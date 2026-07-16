import * as fs from 'node:fs';
import * as path from 'node:path';
import * as esbuild from 'esbuild';
import toc from '../playground/toc.ts';
import { Eta } from 'eta';
import { copyAssets } from './lib/utils.ts';
import { Example, parseMarkdown } from './lib/markdown.ts';
import { Page } from 'cheerio_cms';

const projectRoot = path.resolve(import.meta.dirname, '..');

/**
 * Checks that toc.ts and playground/ agree in both directions. Without the
 * second check an unlisted example directory is silently skipped, so a new
 * example just never appears on the site.
 */
function validateToc() {
	const listed = toc.flatMap((group) => group.examples as readonly string[]);

	for (const slug of listed) {
		if (!fs.existsSync(`./playground/${slug}`)) {
			throw new Error(`toc.ts lists "${slug}" but playground/${slug}/ does not exist`);
		}
	}

	// Only directories that already have a code.html count as examples, so a
	// half-scaffolded folder doesn't break `npm run dev` before it can be listed.
	const present = fs
		.readdirSync('./playground', { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.filter((slug) => fs.existsSync(`./playground/${slug}/code.html`));

	const unlisted = present.filter((slug) => !listed.includes(slug));
	if (unlisted.length > 0) {
		throw new Error(
			`playground/ contains ${unlisted.map((s) => `"${s}"`).join(', ')} ` +
				`but toc.ts does not list ${unlisted.length > 1 ? 'them' : 'it'}`,
		);
	}
}

export default async function build() {
	process.chdir(projectRoot);

	validateToc();

	fs.rmSync('./docs', { recursive: true, force: true });
	fs.mkdirSync('./docs', { recursive: true });

	await esbuild.build({
		entryPoints: [path.join(import.meta.dirname, 'playground-component/index.ts')],
		bundle: true,
		format: 'esm',
		outfile: './docs/playground.js',
		target: 'es2022',
		loader: { '.css': 'text' },
		minify: true,
		logLevel: 'warning',
	});

	// fetch() only rejects on network failure, so an HTTP error would otherwise be
	// baked into every generated page as if it were the template.
	const templateUrl = 'https://versatiles.org/playground.html';
	const response = await fetch(templateUrl);
	if (!response.ok) {
		throw new Error(`Failed to fetch page template ${templateUrl}: HTTP ${response.status}`);
	}
	const template = await response.text();
	const eta = new Eta({ views: path.join(import.meta.dirname, 'templates') });

	const allExamples: Example[] = [];

	const groups: { title: string; examples: Example[] }[] = toc.map((group) => ({
		title: group.title,
		examples: group.examples.map((slug) => {
			const example = parseMarkdown(slug, `./playground/${slug}/text.md`);
			allExamples.push(example);
			return example;
		}),
	}));

	for (const example of allExamples) {
		const { slug } = example;
		fs.mkdirSync(`./docs/${slug}`, { recursive: true });
		copyAssets(`./playground/${slug}`, `./docs/${slug}`);

		const content = eta.render('page', example);
		buildPage(content, example);
	}

	const content = eta.render('index', { groups });
	buildPage(content);

	function buildPage(content: string, example?: Example) {
		const githubUrl = example ? `tree/main/playground/${example.slug}` : '';

		const page = new Page(template)
			.setBaseUrl('https://versatiles.org/playground/')
			.setGithubLink(`https://github.com/versatiles-org/playground/${githubUrl}`)
			.setContent(content);
		if (example) {
			page
				.setTitle(`Versatiles Playground - ${example.title}`, example.description)
				.setSocialImage(`https://versatiles.org/playground/${example.slug}/preview.png`);
		}

		const html = page.render();
		fs.writeFileSync(`./docs/${example ? `${example.slug}/` : ''}index.html`, html);
	}
}

if (import.meta.filename === process.argv[1]) await build();

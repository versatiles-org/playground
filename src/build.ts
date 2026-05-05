import * as fs from 'node:fs';
import * as path from 'node:path';
import * as esbuild from 'esbuild';
import toc from '../playground/toc.ts';
import { Eta } from 'eta';
import { copyAssets } from './lib/utils.ts';
import { Example, parseMarkdown } from './lib/markdown.ts';
import { Page } from 'cheerio_cms';

const projectRoot = path.resolve(import.meta.dirname, '..');

export default async function build() {
	process.chdir(projectRoot);

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

	const template = await (await fetch('https://versatiles.org/playground.html')).text();
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

if (import.meta.url === `file://${process.argv[1]}`) await build();

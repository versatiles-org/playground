import toc from '../playground/toc.ts';
import { getLiveCodesConfig } from './lib/livecodes.ts';
import { Eta } from 'eta';
import { copyAssets } from './lib/utils.ts';
import { Example, parseMarkdown } from './lib/markdown.ts';
import { Page } from 'cheerio_cms';

export default async function build(preview = false) {
	Deno.chdir((new URL('..', import.meta.url)).pathname);

	try {
		Deno.removeSync('./docs', { recursive: true });
	} catch (_) { /* */ }

	const template = await (await fetch('https://versatiles.org/playground.html')).text();
	const eta = new Eta({ views: (new URL('./templates', import.meta.url)).pathname });

	const allExamples: Example[] = [];

	const groups: { title: string; examples: Example[] }[] = toc.map((group) => ({
		title: group.title,
		examples: group.examples.map((slug) => {
			const example = parseMarkdown(slug, `./playground/${slug}/text.md`);
			allExamples.push(example);
			return example;
		}),
	}));

	const style = [
		'margin:5em auto',
		'width:min(1200px,100vw)',
		'height:500px',
		'position:relative',
		'left:calc(50% - min(1200px,100vw) / 2)',
		'border:none',
		'border-radius:8px',
	].join(';');

	for (const example of allExamples) {
		const { slug } = example;
		Deno.mkdirSync(`./docs/${slug}`, { recursive: true });
		copyAssets(`./playground/${slug}`, `./docs/${slug}`);

		const config = getLiveCodesConfig(example);
		Deno.writeTextFileSync(`./docs/${slug}/config.json`, JSON.stringify(config));
		const content = eta.render('page', { ...example, config, preview, style });
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
			page.setTitle(`Versatiles Playground - ${example.title}`, example.description)
				.setSocialImage(`https://versatiles.org/playground/${example.slug}/preview.png`);
		}

		const html = page.render();
		Deno.writeTextFileSync(`./docs/${example ? `${example.slug}/` : ''}index.html`, html);
	}
}

if (import.meta.main) await build();

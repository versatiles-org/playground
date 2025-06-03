import toc from '../playground/toc.ts';
import { getLiveCodesConfig } from './lib/livecodes.ts';
import { Eta } from 'eta';
import { copyAssets } from './lib/utils.ts';
import { Example, parseMarkdown } from './lib/markdown.ts';
import { Page } from 'https://raw.githubusercontent.com/versatiles-org/versatiles-org.github.io/refs/heads/main/src/cms/page.ts';

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

	for (const example of allExamples) {
		const { slug } = example;
		Deno.mkdirSync(`./docs/${slug}`, { recursive: true });
		copyAssets(`./playground/${slug}`, `./docs/${slug}`);

		const config = getLiveCodesConfig(example);
		Deno.writeTextFileSync(`./docs/${slug}/config.json`, JSON.stringify(config));
		const content = eta.render('page', { ...example, config, preview });
		buildPage(content, slug);
	}

	const content = eta.render('index', { groups });
	buildPage(content);

	function buildPage(content: string, slug?: string) {
		const html = new Page(template)
			.setBaseUrl('https://versatiles.org/playground/')
			.setGithubLink(
				`https://github.com/versatiles-org/playground/${
					slug ? `tree/main/playground/${slug}` : ''
				}`,
			)
			.setContent(content).render();
		Deno.writeTextFileSync(`./docs/${slug ? `${slug}/` : ''}index.html`, html);
	}
}

if (import.meta.main) await build();

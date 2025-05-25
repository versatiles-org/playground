import toc from '../playground/toc.ts';
import { getLiveCodesEmbedOptions } from './lib/livecodes.ts';
import { Eta } from 'eta';
import { copyAssets } from './lib/utils.ts';
import { Example, parseMarkdown } from './lib/markdown.ts';
import { CSS } from '@deno/gfm';

Deno.chdir((new URL('..', import.meta.url)).pathname);
try {
	Deno.removeSync('./docs', { recursive: true });
} catch (error) {}

const eta = new Eta({ views: (new URL('./templates', import.meta.url)).pathname });

const allExamples: Example[] = [];

const groups: { title: string; examples: Example[] }[] = toc.map((group) => ({
	title: group.title,
	examples: group.examples.map((slug) => {
		const example = parseMarkdown(slug, `./playground/${slug}/index.md`);
		allExamples.push(example);
		return example;
	}),
}));

for (const example of allExamples) {
	const { slug } = example;
	Deno.mkdirSync(`./docs/${slug}`, { recursive: true });
	copyAssets(`./playground/${slug}`, `./docs/${slug}`);

	const playgroundOptions = getLiveCodesEmbedOptions(example);
	const editorHTML = eta.render('editor', {
		...example,
		playgroundOptions,
		CSS,
	});
	Deno.writeTextFileSync(`./docs/${slug}/index.html`, editorHTML);
}

const overviewHTML = eta.render('overview', { groups });
Deno.writeTextFileSync('./docs/index.html', overviewHTML);

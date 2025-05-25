import type { Config } from 'livecodes';
import { Example } from './markdown.ts';

function getLiveCodesConfig(
	example: Example,
): Config {
	const { slug: name, title, description } = example;
	const filename = `./playground/${name}/index.html`;
	try {
		Deno.statSync(filename);
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) throw new Error(`File not found: ${filename}`);
		throw error;
	}

	const content = Deno.readTextFileSync(filename);
	return {
		activeEditor: 'markup',
		allowLangChange: true,
		appLanguage: undefined,
		autosave: false,
		autotest: false,
		autoupdate: true,
		closeBrackets: true,
		cssPreset: '',
		customSettings: {},
		delay: 1500,
		description,
		editor: undefined,
		editorMode: undefined,
		editorTheme: undefined,
		emmet: true,
		enableAI: false,
		foldRegions: false,
		fontFamily: undefined,
		fontSize: undefined,
		formatOnsave: false,
		head: '',
		htmlAttrs: {},
		imports: {},
		languages: undefined,
		layout: 'responsive',
		lineNumbers: true,
		markup: { language: 'html', content },
		mode: 'full',
		processors: [],
		readonly: false,
		recoverUnsaved: true,
		script: { language: 'javascript', content: '' },
		scripts: [],
		semicolons: true,
		showSpacing: false,
		singleQuote: false,
		style: { language: 'css', content: '' },
		stylesheets: [],
		tabSize: 2,
		tags: [],
		tests: { language: 'typescript', content: '' },
		theme: 'dark',
		themeColor: undefined,
		title,
		tools: { enabled: 'all', active: 'console', status: 'closed' },
		trailingComma: true,
		types: {},
		useTabs: false,
		version: '45',
		view: 'split',
		welcome: true,
		wordWrap: false,
		zoom: 1,
	};
}

export function getLiveCodesEmbedOptions(example: Example) {
	return {
		appUrl: 'https://versatiles.org/playground/livecodes/',
		config: getLiveCodesConfig(example),
	};
}

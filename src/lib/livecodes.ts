import type { Config } from 'livecodes';
import { Example } from './markdown.ts';

export function getLiveCodesConfig(
	example: Example,
): Config {
	const { slug: name, title, description } = example;
	const filename = `./playground/${name}/code.html`;
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
		delay: 1000,
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
		mode: 'simple',
		processors: [],
		readonly: false,
		recoverUnsaved: true,
		script: { language: 'javascript', content: '' },
		scripts: [],
		semicolons: true,
		showSpacing: false,
		singleQuote: false,
		style: { language: 'css', content: 'body {\n  margin: 0;\n}' },
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
		welcome: false,
		wordWrap: false,
		zoom: 1,
	};
}

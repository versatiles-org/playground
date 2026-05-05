import prismCss from 'prismjs/themes/prism-tomorrow.css';
import vpCss from './styles.css';
import Prism from 'prismjs';
import { CodeJar } from 'codejar';

const styleEl = document.createElement('style');
styleEl.textContent = `${prismCss}\n${vpCss}`;
document.head.appendChild(styleEl);

async function mount(root: HTMLElement) {
	const snippetUrl = root.dataset.snippet ?? './code.html';
	const response = await fetch(snippetUrl);
	if (!response.ok) throw new Error(`Failed to fetch ${snippetUrl}: ${response.status}`);
	const snippet = await response.text();

	// allow-same-origin + allow-scripts is the canonical "sandbox escape" combo, but
	// MapLibre's web workers and tile fetches need both. With srcdoc the iframe inherits
	// the parent origin anyway, so this isn't loosening anything in practice.
	root.innerHTML = `
		<div class="vp-pane vp-pane-preview">
			<div class="vp-label">Preview</div>
			<div class="vp-preview-wrap">
				<iframe class="vp-preview" sandbox="allow-scripts allow-same-origin allow-popups" title="Preview"></iframe>
			</div>
		</div>
		<div class="vp-pane vp-pane-code">
			<div class="vp-label">code.html</div>
			<code class="vp-editor language-markup" spellcheck="false"></code>
		</div>
	`;

	const editorEl = root.querySelector<HTMLElement>('.vp-editor')!;
	const iframe = root.querySelector<HTMLIFrameElement>('iframe.vp-preview')!;

	const jar = CodeJar(editorEl, (el) => Prism.highlightElement(el), {
		tab: '\t',
		indentOn: /[<{]$/,
	});
	jar.updateCode(snippet);

	const run = () => {
		iframe.srcdoc = withDefaultStyle(editorEl.textContent ?? '');
	};
	run();

	let debounceId: ReturnType<typeof setTimeout> | undefined;
	editorEl.addEventListener('input', () => {
		clearTimeout(debounceId);
		debounceId = setTimeout(run, 1000);
	});
}

function withDefaultStyle(html: string): string {
	const tag = '<style>body{margin:0;}</style>';
	if (html.includes('</head>')) return html.replace('</head>', tag + '</head>');
	if (/<body\b[^>]*>/i.test(html)) return html.replace(/<body\b[^>]*>/i, (m) => m + tag);
	return tag + html;
}

function showError(root: HTMLElement, err: unknown) {
	const message = err instanceof Error ? err.message : String(err);
	const escaped = message.replace(/[<>&]/g, (c) => `&#${c.charCodeAt(0)};`);
	root.innerHTML = `<div class="vp-error">Failed to load playground: ${escaped}</div>`;
	console.error('[vp-playground] mount failed', err);
}

const screenshotMode = new URLSearchParams(location.search).has('screenshot');

document.querySelectorAll<HTMLElement>('.vp-playground').forEach((el) => {
	if (screenshotMode) el.classList.add('vp-screenshot');
	mount(el).catch((err) => showError(el, err));
});

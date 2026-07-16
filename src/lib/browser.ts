import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import type { Page } from 'puppeteer';

const IFRAME_SELECTOR = '.vp-playground iframe.vp-preview';
const CANVAS_SELECTOR = '.maplibregl-canvas';

export interface NetworkTracker {
	/** Number of requests currently in flight. */
	readonly inFlight: number;
	/** Detach listeners. */
	stop(): void;
}

/**
 * Counts in-flight requests for a page. Must be created *before* navigating:
 * puppeteer only reports requests that start after the listener is attached, so
 * a tracker created afterwards is blind to whatever is already downloading and
 * would report a busy network as idle.
 */
export function trackNetwork(page: Page): NetworkTracker {
	let inFlight = 0;

	const onRequest = () => void inFlight++;
	const onSettled = () => void (inFlight = Math.max(0, inFlight - 1));

	page.on('request', onRequest);
	page.on('requestfinished', onSettled);
	page.on('requestfailed', onSettled);

	return {
		get inFlight() {
			return inFlight;
		},
		stop() {
			page.off('request', onRequest);
			page.off('requestfinished', onSettled);
			page.off('requestfailed', onSettled);
		},
	};
}

interface PreviewState {
	/** Hash of the preview pixels, for detecting "nothing changed since last poll". */
	signature: string;
	/** Distinct colors across the preview. */
	colors: number;
}

/**
 * Screenshots the preview iframe.
 *
 * Captures via puppeteer rather than reading the canvas in-page, because
 * MapLibre runs without `preserveDrawingBuffer` and drawImage/toDataURL would
 * return an empty buffer. It screenshots the *iframe element* rather than the
 * canvas inside it: puppeteer clips an element screenshot using coordinates
 * from that element's own frame, so capturing the canvas — which lives in the
 * iframe's coordinate space — silently returns the wrong region of the page.
 *
 * Returns undefined instead of throwing when the preview cannot be read yet;
 * the component assigns srcdoc asynchronously, so a poll can land while the
 * frame's execution context is being replaced.
 */
async function readPreview(page: Page): Promise<PreviewState | undefined> {
	try {
		const iframe = await page.$(IFRAME_SELECTOR);
		const frame = await iframe?.contentFrame();
		// evaluate() addresses the iframe's own document, so this lookup is sound.
		const canvas = await frame?.$(CANVAS_SELECTOR);
		if (!iframe || !canvas) return undefined;

		const buffer = Buffer.from(await iframe.screenshot({ type: 'png' }));
		const { data } = PNG.sync.read(buffer);

		const colors = new Set<number>();
		for (let i = 0; i < data.length; i += 4) {
			colors.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
		}

		return { signature: createHash('sha1').update(data).digest('hex'), colors: colors.size };
	} catch {
		// Frame swapped under us, or nothing has a box yet; retry next poll.
		return undefined;
	}
}

export interface MapRenderedOptions {
	pollMs?: number;
	timeoutMs?: number;
}

/**
 * Waits until the map has finished drawing, by requiring all of:
 *
 *  - no requests in flight, so no tile or style is still on its way;
 *  - the preview is not one flat color;
 *  - the preview is byte-identical across two consecutive idle polls.
 *
 * Network idle alone is not enough: it passes while the GPU still has frames to
 * paint. Pixel stability alone is not enough either: rendering can stall
 * waiting on a slow tile, which would capture a half-drawn map.
 *
 * Scope of the flat-color check: it catches a catastrophically blank preview
 * (no WebGL, nothing drawn at all). It deliberately does not try to detect
 * missing tiles — a map with markers or attribution still has hundreds of
 * colors, so any threshold would be arbitrary. Failed or 404 tiles are caught
 * by the request listeners in smoke.ts instead, which is where they belong.
 *
 * MapLibre's `idle` event would state this directly, but no example exposes its
 * Map instance to the parent frame, so we observe the page instead.
 *
 * @returns true once rendered and settled, false if `timeoutMs` was hit first.
 */
export async function waitForMapRendered(
	page: Page,
	tracker: NetworkTracker,
	{ pollMs = 400, timeoutMs = 30_000 }: MapRenderedOptions = {},
): Promise<boolean> {
	const deadline = Date.now() + timeoutMs;
	let previous: string | undefined;

	while (Date.now() < deadline) {
		await new Promise((resolve) => setTimeout(resolve, pollMs));

		// Something is still loading; whatever is on screen now does not count.
		if (tracker.inFlight > 0) {
			previous = undefined;
			continue;
		}

		const state = await readPreview(page);
		if (!state) {
			// Unreadable this round; an older signature must not count as stable.
			previous = undefined;
			continue;
		}

		if (state.colors > 1 && state.signature === previous) return true;
		previous = state.signature;
	}

	return false;
}

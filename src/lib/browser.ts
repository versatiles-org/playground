import type { Page } from 'puppeteer';

export interface NetworkQuietOptions {
	/** How long the network must stay idle before we call it settled. */
	quietMs?: number;
	/** Upper bound on the whole wait, in case something never settles. */
	timeoutMs?: number;
	/** Extra delay after quiet, giving the GPU time to rasterize what arrived. */
	renderMs?: number;
}

/**
 * Waits until the page has made no requests for `quietMs`, then gives the map a
 * moment to paint. Replaces a fixed sleep: it waits longer when tiles are slow
 * and returns immediately when they are already cached.
 *
 * MapLibre's `idle` event would be the precise signal, but no example exposes
 * its Map instance to the parent frame, so we observe network traffic instead.
 * Page-level request events include those made by the preview iframe.
 *
 * Caveat of any network-idle heuristic: an idle gap longer than `quietMs` in
 * the middle of loading ends the wait early. Measured against the examples, the
 * largest mid-load gap is ~150ms (style parse into tile requests), so the 500ms
 * default leaves ~3x headroom. Raise it if an example ever loads in slow bursts.
 *
 * @returns true if the network settled, false if `timeoutMs` was hit first.
 */
export async function waitForNetworkQuiet(
	page: Page,
	{ quietMs = 500, timeoutMs = 15_000, renderMs = 300 }: NetworkQuietOptions = {},
): Promise<boolean> {
	let inFlight = 0;

	const settled = await new Promise<boolean>((resolve) => {
		let quietTimer: ReturnType<typeof setTimeout> | undefined;

		const finish = (value: boolean) => {
			clearTimeout(quietTimer);
			clearTimeout(hardTimer);
			page.off('request', onRequest);
			page.off('requestfinished', onSettled);
			page.off('requestfailed', onSettled);
			resolve(value);
		};

		const armQuietTimer = () => {
			clearTimeout(quietTimer);
			quietTimer = setTimeout(() => finish(true), quietMs);
		};

		const onRequest = () => {
			inFlight++;
			clearTimeout(quietTimer);
		};

		const onSettled = () => {
			inFlight = Math.max(0, inFlight - 1);
			if (inFlight === 0) armQuietTimer();
		};

		const hardTimer = setTimeout(() => finish(false), timeoutMs);

		page.on('request', onRequest);
		page.on('requestfinished', onSettled);
		page.on('requestfailed', onSettled);

		// Nothing may be in flight already, in which case no event would ever fire.
		armQuietTimer();
	});

	// Tiles arrive over the network but are rasterized a frame or two later.
	await new Promise((resolve) => setTimeout(resolve, renderMs));

	return settled;
}

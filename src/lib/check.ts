import type { Frame, Page } from 'puppeteer';

export interface CheckContext {
	/** The playground page, for browser-level setup such as permissions. */
	page: Page;
	/** The document inside the preview iframe, where the example itself runs. */
	preview: Frame;
}

/**
 * An optional per-example interaction test, living next to the example as
 * `playground/$slug/check.ts`. The smoke test runs it once the map has finished
 * rendering; throwing (e.g. via `node:assert`) marks the example as broken.
 *
 * Loading an example only proves it painted. Everything a visitor actually does
 * to it — clicking a feature, pressing a control — is invisible to that, so
 * examples built around an interaction carry a check for it.
 */
export type ExampleCheck = (context: CheckContext) => Promise<void>;

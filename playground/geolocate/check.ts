import type { ExampleCheck } from '../../src/lib/check.ts';

/**
 * Geolocation needs a granted permission and a position, neither of which a
 * headless browser has by default — so the check supplies both, then presses the
 * button the same way a visitor would.
 */
const check: ExampleCheck = async ({ page, preview }) => {
	const context = page.browser().defaultBrowserContext();
	await context.overridePermissions(new URL(page.url()).origin, ['geolocation']);
	await page.setGeolocation({ latitude: 52.52, longitude: 13.405 }); // Berlin

	await preview.click('button.maplibregl-ctrl-geolocate');

	// Both only exist once a position was actually resolved and accepted.
	await preview.waitForSelector('.maplibregl-user-location-dot');
	await preview.waitForSelector('button.maplibregl-ctrl-geolocate-active');
};

export default check;

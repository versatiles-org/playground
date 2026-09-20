---
title: Map Style
description: How to generate a style with versatiles-style and adjust its colors and labels.
---

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) uses `style` objects to define the appearance of a map. These objects describe data sources, layers, colors, fonts, symbols, etc. (If you want to fine-tune a map down to individual layers, see the complete [MapLibre Style Spec](https://maplibre.org/maplibre-style-spec/).)

To make it easier to work with map styles, we've developed the [JavaScript library "versatiles-style"](https://github.com/versatiles-org/versatiles-style) to generate styles efficiently in the frontend or the backend.

We host versatiles-style at a predictable path on `tiles.versatiles.org` (see our [frontend specification](https://docs.versatiles.org/compendium/specification_frontend.html)):

- `/assets/lib/versatiles-style/versatiles-style.js`

Loading the library adds the global `VersaTilesStyle` to the JavaScript environment. To generate a style:

```javascript
const style = VersaTilesStyle.osm({
	urls: { base: 'https://tiles.versatiles.org' }, // <- where tiles, sprites and fonts come from
});

new maplibregl.Map({
	container: 'map',
	style: await VersaTilesStyle.inlineSources(style), // <- use the style
})
```

In this example we additionally use German labels (`text.language`), render labels in black (`colors.label`), and reduce the overall saturation (`recolor.saturate`).

> [!IMPORTANT]
> Two things are easy to leave out, and both end in a blank map:
>
> - **Set `urls.base`.** Every other URL in the style — tiles, sprites, glyphs — is resolved against it, and it defaults to *your page's own origin*. That is the right default once you host the tiles yourself, but on any other page it points the map at a server that has no `/tiles/` or `/assets/`.
> - **Pass the style through `inlineSources()`.** `osm()` is synchronous and does no network requests: it leaves each source as a reference to a [TileJSON](https://github.com/mapbox/tilejson-spec) file, and ours list *relative* tile URLs that MapLibre cannot resolve. `inlineSources()` fetches them and folds in the absolute tile URLs, the zoom range and the attribution. Since it returns a `Promise`, this example uses `<script type="module">`: top-level `await` only works in modules.

### Themes

`osm()` renders OpenStreetMap vector tiles in one of five palettes, each also available as a dark theme with a `-dark` suffix (`colorful-dark`, …):

- `colorful` — the default, rich colors
- `natural` — muted greens and browns
- `muted` — minimal, low-contrast
- `gray` — grayscale
- `toner` — black and white

See the [API documentation](https://versatiles.org/versatiles-style/index.html), in particular:

- [OsmOptions](https://versatiles.org/versatiles-style/types/_versatiles_style.OsmOptions.html) — all options `osm()` accepts.
- [RecolorOptions](https://versatiles.org/versatiles-style/types/_versatiles_style.RecolorOptions.html) — change brightness, contrast, saturation, gamma, etc.
- [ColorsOptions](https://versatiles.org/versatiles-style/types/_versatiles_style.ColorsOptions.html) — change individual colors.

### Going further: the "Matrix" effect

Combining `layers.labels` and `recolor` produces stylized variants. The following gives you a green-tinted, label-free map that 90s movie fans will recognize:

```javascript
const style = VersaTilesStyle.osm({
	layers: { labels: false },
	recolor: {
		invertBrightness: true,
		tint: { color: '#0A0', amount: 1 },
	},
});
```

> [!NOTE]
> [versatiles-style](https://github.com/versatiles-org/versatiles-style) is actively evolving. Expect API changes as we expand its capabilities — version 6 replaced the old style functions (`colorful`, `eclipse`, `graybeard`, `neutrino`) with `osm({ theme })` and regrouped the options.

> [!WARNING]
> Instead of loading the libraries from tiles.versatiles.org, we recommend including them directly in your project and hosting them yourself. Since we regularly update the front-end libraries on our demo server, future updates may affect your project.

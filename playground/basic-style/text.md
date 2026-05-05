---
title: Basic Style
description: How to style a simple OSM map.
---

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) uses `style` objects to define the appearance of a map. These objects describe data sources, layers, colors, fonts, symbols, etc. (If you want to fine-tune a map down to individual layers, see the complete [MapLibre Style Spec](https://maplibre.org/maplibre-style-spec/).)

To make it easier to work with map styles, we've developed the [JavaScript library "versatiles-style"](https://github.com/versatiles-org/versatiles-style) to generate styles efficiently in the frontend or the backend.

We host versatiles-style at a predictable path on `tiles.versatiles.org` (see our [frontend specification](https://docs.versatiles.org/compendium/specification_frontend.html)):

- `/assets/lib/versatiles-style/versatiles-style.js`

Loading the library adds the global `VersaTilesStyle` to the JavaScript environment. To generate a style:

```javascript
const style = VersaTilesStyle.colorful(); // <- generates a style

new maplibregl.Map({
	container: 'map',
	style, // <- use the style
})
```

In this example we additionally use German labels (`language: 'de'`), render labels in black (`colors.label`), and reduce the overall saturation (`recolor.saturate`).

We provide several base styles for different use cases:

- `colorful` — the default, rich colors
- `eclipse` — dark mode
- `graybeard` — grayscale
- `neutrino` — minimal, low-contrast

Each takes the same options. See the [API documentation](https://versatiles.org/versatiles-style/index.html), in particular:

- [StyleBuilderOptions](https://versatiles.org/versatiles-style/interfaces/StyleBuilderOptions.html) — all options the style functions accept.
- [RecolorOptions](https://versatiles.org/versatiles-style/interfaces/RecolorOptions.html) — change brightness, contrast, saturation, gamma, etc.
- [StyleBuilderColors](https://versatiles.org/versatiles-style/interfaces/StyleBuilderColors.html) — change individual colors.

### Going further: the "Matrix" effect

Combining `hideLabels` and `recolor` produces stylized variants. The following gives you a green-tinted, label-free map that 90s movie fans will recognize:

```javascript
const style = VersaTilesStyle.colorful({
	hideLabels: true,
	recolor: {
		invertBrightness: true,
		tintColor: '#0A0',
		tint: 1,
	},
});
```

> [!NOTE]
> [versatiles-style](https://github.com/versatiles-org/versatiles-style) is actively evolving. Expect API changes as we expand its capabilities.

> [!WARNING]
> Instead of loading the libraries from tiles.versatiles.org, we recommend including them directly in your project and hosting them yourself. Since we regularly update the front-end libraries on our demo server, future updates may affect your project.

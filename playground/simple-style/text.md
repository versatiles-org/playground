---
title: Simple Style
description: How to style a simple OSM map.
---

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) use special `style` objects that define the appearance of your map. These `style` object are quite complex JavaScript objects that define data sources, layers, colors, fonts, symbols, etc. (If you later want to really fine tune your map you can find the complete specification here: [MapLibre Style Spec](https://maplibre.org/maplibre-style-spec/))

To make it easier to work with these map styles, we've developed the [JavaScript library "versatiles-style"](https://github.com/versatiles-org/versatiles-style) to generate styles very fast and efficient in the frontend or the backend.

Based on our [frontend specification](https://docs.versatiles.org/compendium/specification_frontend.html), the library should be ready to use under:

- `/assets/lib/versatiles-style/versatiles-style.js`

Loading our library adds the global variable `VersaTilesStyle` to the JavaScript environment. To generate a style ready to use simply run:

```javascript
const style = VersaTilesStyle.colorful(); // <- generates a style

new maplibregl.Map({
	style // <- use the style
	container: "map",
})
```

We also provide other functions to generate base styles, like `colorful`, `eclipse`, `graybeard` and `neutrino`.

All these style functions accept optional properties to fine tune the styles, like:

```javascript
{
   baseUrl: string; // host of your map server, like "https://example.org"
   bounds: [number, number, number, number]; // bounding box of the initial view
   colors: Partial<StyleBuilderColors>; // to change individual colors
   fonts: Partial<StyleBuilderFonts>; // to change the default fonts
   glyphs: string; // to change the url template of the fonts
   hideLabels: boolean; // to hide all labels on the map
   language: Language; // to switch the default language of all labels
   recolor: RecolorOptions; // to change all colors in the map
   sprite: SpriteSpecification; // to load different symbols
   tiles: string[]; // to change the tile source
}
```

For example, the following code will generate a map style without labels and tint it green, making it look like the 'Matrix', which will make people from the '90s think your map looks cool.

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

To learn more about all the options provided by "versatiles-style", take a look at the [API documentation](https://versatiles.org/versatiles-style/index.html), e.g.:

- [StyleBuilderOptions](https://versatiles.org/versatiles-style/interfaces/StyleBuilderOptions.html) for all options provided by the style functions.
- [RecolorOptions](https://versatiles.org/versatiles-style/interfaces/RecolorOptions.html) for the property `recolor` to change overall brightness, contrast, saturation, gamma, etc.
- [StyleBuilderColors](https://versatiles.org/versatiles-style/interfaces/StyleBuilderColors.html) for the property `colors` to change individual colors.

> [!NOTE]\
> ["versatiles-style"](https://github.com/versatiles-org/versatiles-style) helped us a lot in making it easier to work with map styles. However, many features are missing. That is why we plan to completely revamp the entire library in 2025.

> [!WARNING]
> Instead of loading the libraries from tiles.versatiles.org, we recommend including them directly in your project and hosting them yourself. Since we regularly update the front-end libraries on our demo server, future updates may affect your project.

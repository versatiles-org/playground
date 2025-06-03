---
title: Simple Style
description: How to style a simple OSM map.
---

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) use styles to define your map. These styles are quite complex JavaScript objects that define data sources, layers, colors, fonts, symbols, etc. (If you later want to really fine tune your map you can find the complete specification here: [MapLibre Style Spec](https://maplibre.org/maplibre-style-spec/)) To make it easier to work with map styles, we've developed a [JavaScript library "versatiles-style"](https://github.com/versatiles-org/versatiles-style) to generate styles very fast and efficient in the frontend or the backend.

Based on our [frontend specification](https://docs.versatiles.org/compendium/specification_frontend.html), the library should be ready to use under:

- `/assets/lib/versatiles-style/versatiles-style.js`

Loading our library adds the global variable `VersaTilesStyle` to the JavaScript environment. To generate a style ready to use simply run:

```javascript
const style = VersaTilesStyle.colorful();
new maplibregl.Map({
	style // <- use the generated style
	container: "map",
})
```

We also provide other functions to generate base styles, like `colorful`, `eclipse`, `graybeard` and `neutrino`.

All these style functions accept optional properties to adapt the styles, like:

```javascript
{
   baseUrl: string; // host of the map server, like "https://example.org"
   bounds: [number, number, number, number]; // bbox of the initial view
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

So for example, the following code will generate a style without labels and tint it green to make it look like "Matrix" so people from the 90's will think your map looks cool.

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
> ["versatiles-style"](https://github.com/versatiles-org/versatiles-style) helped us a lot to make it easier to work with map styles. That is way we plan to completely revamp the whole library in 2025.

> [!WARNING]
> You might want to include libraries directly in your project and serve them yourself instead of loading them from tiles.versatiles.org. We regularly update front-end libraries on our demo server. However, this could introduce breaking changes to your project at some point in the future.

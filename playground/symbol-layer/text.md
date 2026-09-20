---
title: Symbol Layer
description: How to draw hundreds of points as icons with labels.
---

[Marker and Popup](../add-marker/) places a `Marker` — an HTML element — on the map. That is convenient for a handful of points, but every marker is a DOM node the browser has to position on each frame, and markers know nothing about each other, so they happily overlap.

A `symbol` layer is the other approach: the points live in a source, MapLibre renders them together with the rest of the map, and one layer can carry thousands of them. This example draws 170 windmills and lighthouses from [OpenStreetMap](https://www.openstreetmap.org/).

### Icons

`icon-image` names an image in the style's [sprite](https://maplibre.org/maplibre-style-spec/sprite/) — a single sheet holding all icons. Our styles load the sprite `base`, which contains around 120 images, all named `icon-…` ([have a look](https://versatiles.org/versatiles-style/sprites.html)).

> [!IMPORTANT]
> Our styles declare their sprite as a *list*, which means every image id carries the sprite's name as a prefix: `base:icon-windmill`, not `icon-windmill`. Without the prefix MapLibre silently draws no icon at all.

Instead of a fixed id, this example builds the id from each feature's `kind` property:

```javascript
'icon-image': ['concat', 'base:icon-', ['get', 'kind']],
```

That is an [expression](https://maplibre.org/maplibre-style-spec/expressions/): a small formula MapLibre evaluates per feature. `['get', 'kind']` reads a property, `['concat', …]` glues strings together — so a windmill gets `base:icon-windmill` and a lighthouse `base:icon-lighthouse`. Almost every layout and paint property accepts expressions, which is what makes a single layer enough for differently styled features.

### Labels

`text-field` works the same way; here it simply reads the name. Two properties around it are easy to get wrong:

- **`text-font`** must name a font your glyph server actually has. We provide `noto_sans_regular` and `noto_sans_bold`. MapLibre's default is a Mapbox font that we do not host, so leaving it out means no labels.
- **`text-anchor`** and **`text-offset`** move the label off the icon — otherwise both are drawn at the same spot, on top of each other.

The halo (`text-halo-color`, `text-halo-width`) is what keeps labels legible over dark and light ground alike.

### Collision handling

Zoom out and most labels disappear. MapLibre hides icons and labels that would overlap, keeping only what fits — which is why a symbol layer stays readable at any zoom while 170 markers would turn into a pile. Set `icon-allow-overlap` or `text-allow-overlap` to `true` if you would rather show everything.

All properties are listed in the Style Specification under [symbol layers](https://maplibre.org/maplibre-style-spec/layers/#symbol).

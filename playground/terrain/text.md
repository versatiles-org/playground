---
title: 3D Terrain
description: How to render a map in three dimensions.
---

Elevation data reaches the browser the same way [satellite imagery](../satellite/) does: as image tiles. But these images are not meant to be looked at — the height of each pixel is encoded in its red, green and blue channels. A [`raster-dem`](https://maplibre.org/maplibre-style-spec/sources/#raster-dem) source tells [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) to read the pixels as numbers instead of colors, and the style's `terrain` property then lifts the whole map onto that surface.

[versatiles-style](https://github.com/versatiles-org/versatiles-style) sets this up for any of its styles:

```javascript
const style = await VersaTilesStyle.colorful({
	baseUrl: 'https://tiles.versatiles.org',
	terrain: { exaggeration: 1.5 },
	hillshade: true,
});
```

As with `satellite()`, the result is a Promise: the elevation [TileJSON](https://github.com/mapbox/tilejson-spec) has to be fetched first, so the source ends up with the right zoom range, attribution — and encoding.

### Two ways to show relief

**`terrain`** is the three-dimensional one. `exaggeration: 1` is true to scale; higher values stretch the height, which helps in gentler landscapes. It only becomes visible once the camera is tilted.

**`hillshade`** paints light and shadow onto the slopes and works on a flat, untilted map — often the better choice, because it costs one layer and no camera work. It reads the same elevation source, so both options can be combined, as in this example.

### Tilting the camera

Terrain seen from straight above looks like an ordinary map, so this example starts with `pitch: 75` and a `bearing` that points the camera at the Matterhorn's north face.

`maxPitch: 85` is needed for anything beyond `pitch: 60` — MapLibre's default limit. Visitors tilt and rotate the map by dragging with the right mouse button, holding <kbd>Ctrl</kbd> while dragging, or using two fingers on a touchscreen.

Above the horizon there is no map left to draw, which is why the example gives the style a `sky`. Without it that part of the canvas simply stays empty.

### Using your own elevation tiles

`terrain` is a plain style property, so the manual version is two calls:

```javascript
map.addSource('elevation', {
	type: 'raster-dem',
	tiles: ['https://example.org/dem/{z}/{x}/{y}.png'],
	encoding: 'terrarium', // or 'mapbox' — see below
	maxzoom: 12,
});

map.setTerrain({ source: 'elevation', exaggeration: 1.5 });
```

> [!IMPORTANT]
> There are two common ways to pack a height into RGB: `terrarium` (used by our tiles) and `mapbox`. MapLibre assumes `mapbox` unless told otherwise, and a mismatch does not fail — it produces a landscape of noise. If your terrain looks like crumpled paper, this is why.

Our elevation tiles cover the world up to zoom 12. Zooming in further keeps working; the terrain just stops gaining detail.

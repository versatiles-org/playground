---
title: Add GeoJSON
description: How to add GeoJSON data to a map.
---

This example loads the boundary of the [Val Suzon](https://en.wikipedia.org/wiki/Val_Suzon) nature reserve in Burgundy, France, and renders it on the map.

### Sources and layers

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) keeps *data* and *presentation* separate:

- A **source** ([`addSource()`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addsource)) holds the data — a GeoJSON object, a vector tile URL, etc.
- A **layer** ([`addLayer()`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addlayer)) tells MapLibre how to render features from a source.

One source can feed many layers. In this example we use one GeoJSON source with two layers: a translucent `fill` for the polygon's interior and a dashed `line` for its outline.

### Layer types

The most common types (see the full list in the [Style Specification](https://maplibre.org/maplibre-style-spec/layers/)):

- **`fill`** — polygons (areas)
- **`line`** — lines and polygon outlines
- **`circle`** — points as filled circles
- **`symbol`** — points or lines decorated with text and/or icons
- **`heatmap`** — point-density visualisation
- **`raster`** — image tiles (e.g., satellite imagery)

### `paint` vs `layout`

Each layer accepts properties in two buckets:

- **`layout`** — how features are arranged before rendering (e.g., `line-cap`, `line-join`, `text-field`, `icon-image`).
- **`paint`** — visual styling applied during rendering (e.g., `fill-color`, `line-width`, `line-dasharray`, `circle-opacity`).

The full property reference for each layer type lives in the Style Specification linked above.

### Inline data

Instead of fetching, you can pass GeoJSON directly:

```javascript
map.addSource('mydata', {
	type: 'geojson',
	data: {
		type: 'FeatureCollection',
		features: [/* ... */],
	},
});
```

We generally recommend exploring the [MapLibre examples](https://maplibre.org/maplibre-gl-js/docs/examples/) to see what's possible in MapLibre.

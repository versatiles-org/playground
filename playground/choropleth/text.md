---
title: Clickable Choropleth
description: How to color areas by a value and react to clicks.
---

A *choropleth* colors areas by a number: here the 16 German federal states, shaded by how many people live per square kilometre. The boundaries come from [Eurostat's GISCO service](https://ec.europa.eu/eurostat/web/gisco), the population figures from [Eurostat](https://ec.europa.eu/eurostat), and each feature carries three properties — `name`, `population` and `density`.

### Color from a property

A `fill` layer with a fixed `fill-color` would paint every state the same. Instead, the color is an [expression](https://maplibre.org/maplibre-style-spec/expressions/) that MapLibre evaluates per feature:

```javascript
'fill-color': [
	'step', ['get', 'density'],
	'#b7d3f6', 100,   // below 100 inhabitants/km²
	'#86b6ef', 200,   // 100 … 200
	'#5598e7', 300,   // 200 … 300
	'#2a78d6', 500,   // 300 … 500
	'#1c5cab', 1500,  // 500 … 1500
	'#104281',        // 1500 and above
],
```

[`step`](https://maplibre.org/maplibre-style-spec/expressions/#step) sorts values into classes: a first color, then pairs of *threshold, color*. Its sibling [`interpolate`](https://maplibre.org/maplibre-style-spec/expressions/#interpolate) blends continuously between stops instead — useful when the exact value matters more than the class.

A second layer on the same source draws the borders in white — as in [Add GeoJSON](../add-geojson/), one source feeds a `fill` and a `line` layer. Without it, neighbouring states from the same class merge into one blob.

Two rules make the result readable: stay within **one hue from light to dark** (a rainbow suggests categories where there is a scale), and **normalise the number** — coloring by raw population would just redraw the map of big states.

### Reacting to clicks

Passing a layer id to [`map.on()`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#on) limits an event to that layer, so the handler only runs when a state is actually hit:

```javascript
map.on('click', 'states', (event) => {
	const { name, population, density } = event.features[0].properties;
	// ...
});
```

`event.features` holds the features under the cursor, with their properties — everything needed to fill a [`Popup`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/). A popup closes when the map is clicked again, so they don't pile up.

The two `mouseenter` / `mouseleave` handlers swap the mouse cursor for a pointer. Without them nothing suggests that the map can be clicked at all.

> [!NOTE]
> The second argument of `addLayer()` inserts both layers below the basemap's labels, which would otherwise disappear under a sheet of translucent blue. Layer order does not affect clicks: a layer-bound handler only ever queries its own layer, so the fill stays clickable even where the outline covers it.

For a published map, add a legend: the colors alone don't say which value belongs to which shade.

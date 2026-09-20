---
title: Satellite Imagery
description: How to show satellite imagery with the map's labels on top.
---

Everything on a VersaTiles basemap is drawn from *vector* tiles: the browser receives geometries and attributes and renders them according to the style. Satellite imagery cannot work that way — it is photography, so it arrives as ready-made images. In [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) those are handled by a [`raster` source](https://maplibre.org/maplibre-style-spec/sources/#raster) and drawn by a [`raster` layer](https://maplibre.org/maplibre-style-spec/layers/#raster).

You don't have to wire that up yourself: [versatiles-style](https://github.com/versatiles-org/versatiles-style) ships a [`satellite()`](https://versatiles.org/versatiles-style/variables/_versatiles_style.satellite.html) function that returns a finished style, that even includes a OSM vector overlay for labels and streets. If you don't need the overlay, you can disable it like this:

```javascript
const style = VersaTilesStyle.satellite({
	urls: { base: 'https://tiles.versatiles.org' },
	osmOverlay: false,
});
```

As with [`osm()`](../basic-style/), the style still has to go through `inlineSources()` before MapLibre sees it: that fetches the imagery's [TileJSON](https://github.com/mapbox/tilejson-spec), so the source ends up with absolute tile URLs, the correct zoom range and the attribution instead of hard-coded ones. Since that returns a `Promise`, this example uses `<script type="module">` — top-level `await` only works in modules.

> [!NOTE]
> Imagery coverage is not uniform. Worldwide satellite data reaches about zoom 12; the high-resolution orthophotos go deeper, but only where an open data provider offers them — currently large parts of Central and Western Europe. Outside those areas the imagery stops sharpening.

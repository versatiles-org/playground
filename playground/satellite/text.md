---
title: Satellite Imagery
description: How to show satellite imagery on a map.
---

Everything on a VersaTiles basemap is drawn from *vector* tiles: the browser receives geometries and attributes and renders them according to the style. Satellite imagery cannot work that way — it is photography, so it arrives as ready-made images. In [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) those are handled by a [`raster` source](https://maplibre.org/maplibre-style-spec/sources/#raster) and drawn by a [`raster` layer](https://maplibre.org/maplibre-style-spec/layers/#raster).

You don't have to wire that up yourself: [versatiles-style](https://github.com/versatiles-org/versatiles-style) ships a [`satellite()`](https://versatiles.org/versatiles-style/functions/satellite.html) function that returns a finished style, that even includes a OSM vector overlay for labels and streets. If you don't need the overlay, you can disable it like this:

```javascript
const style = await VersaTilesStyle.satellite({ overlay: false });
```

Note the `await`: unlike `colorful()` and friends, `satellite()` fetches the imagery's [TileJSON](https://github.com/mapbox/tilejson-spec) first, so it can pick up the correct zoom range and attribution instead of hard-coding them. That is also why this example uses `<script type="module">` — top-level `await` only works in modules.

> [!NOTE]
> Imagery coverage is not uniform. Worldwide satellite data reaches about zoom 12; the high-resolution orthophotos go deeper, but only where an open data provider offers them — currently large parts of Central and Western Europe. Outside those areas the imagery stops sharpening.

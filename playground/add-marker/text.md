---
title: Add Marker
description: How to place a basic marker on a map.
---

A [`Marker`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/) is a DOM element placed at a geographic coordinate. As you pan or zoom the map, MapLibre keeps the marker anchored at its real-world position.

> [!WARNING]
> Coordinates in MapLibre are always `[longitude, latitude]` — **not** `[latitude, longitude]`. This is the convention used by GeoJSON and most spatial libraries, and it bites everyone at least once.

The minimal workflow:

```javascript
new maplibregl.Marker({ color: '#c00' })
	.setLngLat([12.34, 45.43])
	.addTo(map);
```

Common customizations:

- **`color`** — pick a color for the default pin.
- **Custom element** — pass `{ element: yourCustomDom }` to render any HTML you like.
- **[`setPopup(popup)`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/#setpopup)** — attach a [`Popup`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/) so clicking the marker opens a tooltip (used in this example).
- **[`setDraggable(true)`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/#setdraggable)** — let the user drag the marker around.

Browse the [MapLibre examples](https://maplibre.org/maplibre-gl-js/docs/examples/) for more patterns.

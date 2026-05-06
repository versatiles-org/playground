---
title: Geocoder Plugin Example
description: Add address search to the map.
---

This example turns a [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) basemap into a searchable map using the [`maplibre-gl-geocoder`](https://maplibre.org/maplibre-gl-geocoder/) plugin and a [Photon](https://github.com/komoot/photon) geocoding backend that we host at `https://geocode.versatiles.org`.

### Why Photon + maplibre-gl-geocoder?

- **Photon** is an open-source geocoder built on OpenStreetMap data. It returns GeoJSON, which makes it easy to wire into MapLibre.
- **maplibre-gl-geocoder** adds a polished search UI that drops straight into the MapLibre control bar.

### The `forwardGeocode` adapter

The plugin was originally written for Mapbox's geocoding API, so it expects each result feature to carry specific fields:

- `place_name` — the human-readable string shown in the dropdown
- `place_type` — an array of category strings (e.g., `['place']`)
- `center` — a `[lng, lat]` coordinate the map should fly to when the user picks a result

Photon returns plain GeoJSON without these fields, so the example walks each feature and synthesises them: it concatenates `name`, `city`, and `country` into a display string, hard-codes the type, and copies the geometry's coordinates to `center`. That small loop is the entire bridge between Photon and the plugin.

If you swap Photon for another backend — or run your own Photon instance and just point at a different URL — this adapter is the only piece you'd need to adjust.

### `marker: false`

By default the plugin drops its own marker on each result. We pass `marker: false` so nothing is placed automatically; your code can render a custom marker (or none) if it wants to.

### Self-hosting the Photon backend

If `https://geocode.versatiles.org` is unavailable or you want full control over the data, run your own [Photon](https://github.com/komoot/photon) instance and point the `forwardGeocode` URL at it. Photon ships as a single JAR and a downloadable index — no other setup needed.

### Further reading

- **Plugin source:** <https://github.com/maplibre/maplibre-gl-geocoder>
- **Plugin docs:** <https://maplibre.org/maplibre-gl-geocoder/>
- **Photon project:** <https://github.com/komoot/photon>

> [!WARNING]
> This example loads the plugin from a public CDN (`unpkg.com`). For production, consider self-hosting the plugin's `.js` and `.css` files alongside your other assets — public CDNs can have outages and version availability can shift.

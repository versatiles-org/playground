---
title: Geocoder Plugin Example
description: Add address search to the map.
---

This example shows how to turn a **MapLibre GL JS** basemap into a fully search‑able map using **maplibre‑gl‑geocoder** plugin and a Photon geocoding backend that we host at `https://geocode.versatiles.org`.

### Why Photon + maplibre‑gl‑geocoder?

* **Photon** is an open‑source geocoder built on OpenStreetMap data. It returns GeoJSON, which makes it trivial to wire into MapLibre.
* **maplibre‑gl‑geocoder** adds a polished search UI that drops straight into the MapLibre control bar.

### Further reading

- **Plugin source:** <https://github.com/maplibre/maplibre-gl-geocoder>
- **Plugin docs:** <https://maplibre.org/maplibre-gl-geocoder/>
- **Photon project:** <https://github.com/komoot/photon>

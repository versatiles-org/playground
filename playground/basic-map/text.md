---
title: Basic OSM Map
description: How to add a simple OSM map.
---

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) loads and renders map tiles in the browser. To use MapLibre, you need to load its JavaScript and CSS files.

We host common frontend libraries at predictable paths on `tiles.versatiles.org`. The exact paths are documented in our [frontend specification](https://docs.versatiles.org/compendium/specification_frontend.html). For MapLibre:

- `/assets/lib/maplibre-gl/maplibre-gl.js` (JavaScript code)
- `/assets/lib/maplibre-gl/maplibre-gl.css` (style sheet)

In our example, we load these assets from our demo server, but you can modify all URLs as needed.

> [!WARNING]
> You might want to include libraries such as MapLibre GL JS directly in your project and serve them yourself instead of loading them from tiles.versatiles.org. We regularly update frontend libraries on our demo server. However, this could introduce breaking changes to your project at some point in the future.

Loading the MapLibre library adds the global `maplibregl` variable to the JavaScript environment. Use `new maplibregl.Map()` to initialise your map.

You can set the initial view by passing either `bounds: [west, south, east, north]` (as in this example) or `center: [lng, lat]` with `zoom`.

The call to `maplibregl.setRTLTextPlugin(...)` registers an optional plugin so MapLibre can render right-to-left scripts (Arabic, Hebrew) correctly. Skip it if your maps never show those languages.

To learn more about all the options provided by MapLibre, take a look at the documentation for the [Map class documentation](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/) and in general the [MapLibre API documentation](https://maplibre.org/maplibre-gl-js/docs/API/). We can also highly recommend all the [MapLibre examples](https://maplibre.org/maplibre-gl-js/docs/examples/).

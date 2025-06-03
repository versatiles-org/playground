---
title: Simple Map
description: How to add a simple map.
---

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) loads and renders map tiles in the browser. To use MapLibre, you need to load the necessary JavaScript and CSS files. Based on our [frontend specification](https://docs.versatiles.org/compendium/specification_frontend.html), the necessary assets should always be available under:

- `/assets/lib/maplibre-gl/maplibre-gl.js` (JavaScript code)
- `/assets/lib/maplibre-gl/maplibre-gl.css` (style sheet)


In our example, we load these assets from our demo server at `https://tiles.versatiles.org`, but you can modify all URLs as needed.

> [!WARNING]
> You might want to include libraries such as MapLibre GL JS directly in your project and serve them yourself instead of loading them from tiles.versatiles.org. We regularly update front-end libraries on our demo server. However, this could introduce breaking changes to your project at some point in the future.

Loading the MapLibre libraries adds the global `maplibregl` variable to the JavaScript environment. Use `new maplibregl.Map()` to initialise your map.

To learn more about all the options provided by MapLibre, take a look at the documentation for the [Map class documentation](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/) and in general the [MapLibre API documentation](https://maplibre.org/maplibre-gl-js/docs/API/).
---
title: Geolocate Control
description: How to add a "find me" button to the map.
---

Unlike the [address search](../geocoder/), locating the user needs no plugin and no server: browsers ship a [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API), and [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) wraps it in a ready-made control.

```javascript
map.addControl(new maplibregl.GeolocateControl());
```

That is the whole feature: a button in the corner of the map, a permission prompt when it is pressed, a dot at the user's position and a circle showing how accurate that position is. [`addControl()`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addcontrol) takes a second argument if you want the button somewhere other than `'top-right'`.

Nothing happens before the button is clicked — the browser only asks for permission on a user gesture, and never shares a position the user has not agreed to.

### Options

- **`trackUserLocation`** turns the button into a toggle. Once located, the map keeps following the user, and panning the map away puts the button into a third state, from where a click re-centers it. Off by default, so the map jumps to the position once and then stays put.
- **`positionOptions`** goes straight to the browser. `enableHighAccuracy: true` asks for the GPS instead of a network-based estimate — more precise, slower, and hungrier for battery. `timeout` (6 seconds by default) and `maximumAge` live here too.
- **`fitBoundsOptions`** controls the movement to the position. By default it stops at `maxZoom: 15`, so a very accurate fix does not drop the user into a zoom-19 close-up.
- **`showUserLocation`** and **`showAccuracyCircle`** hide the dot or its accuracy circle. Both are on.

### Reacting to the position

Keep a reference to the control and it will tell you what happens:

```javascript
const geolocate = new maplibregl.GeolocateControl();
map.addControl(geolocate);

geolocate.on('geolocate', (event) => console.log(event.coords.latitude, event.coords.longitude));
geolocate.on('error', (event) => console.log('no position:', event.message));
```

`geolocate` carries the browser's [`GeolocationCoordinates`](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates), and `error` fires when the user declines or no position can be determined — the control then disables its button.

> [!IMPORTANT]
> Geolocation only works in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts): `https://` or `localhost`. Over plain `http://` the browser refuses, and the control hides its button. A map inside a *cross-origin* iframe needs `<iframe allow="geolocation">` on top of that — the preview above works without it because it is served from the same origin as this page.

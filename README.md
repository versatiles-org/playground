[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

# VersaTiles Playground

A web-based playground demonstrating how to use [VersaTiles](https://versatiles.org) in a frontend environment.

Each example is a self-contained HTML snippet rendered in a small in-house live editor (preview on top, syntax-highlighted code editor below). The code is editable: press **Run** — or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>, <kbd>⌘</kbd>+<kbd>Enter</kbd> on a Mac — to render your changes. Nothing is stored, so reloading the page brings back the original snippet.

The site is built statically and automatically deployed via GitHub Pages:

👉 https://versatiles.org/playground/

---

## 📁 Repository Structure

```text
├─ .github/workflows/      # CI pipeline for building & deploying the playground
├─ docs/                   # Build output (generated, gitignored)
├─ playground/             # Source examples
│  ├─ toc.ts               # Table of contents listing all available examples
│  └─ $name/               # Individual example directory
│     ├─ code.html         # Self-contained HTML snippet rendered in the iframe
│     └─ text.md           # Markdown explanation, with YAML front matter for title/description
└─ src/                    # Source code for the generator, dev server, and component
   ├─ build.ts             # Builds all example pages and the runtime bundle
   ├─ dev.ts               # Development server (port 8080; override with PORT env var)
   ├─ screenshots.ts       # Generates 16:9 preview images for all examples
   ├─ smoke.ts             # Loads every example in a headless browser and checks it runs
   ├─ lib/                 # Shared utility code
   ├─ playground-component/# Runtime live-editor component (bundled with esbuild)
   └─ templates/           # ETA templates
      ├─ index.eta         # Template for the index page
      └─ page.eta          # Template for individual example pages
```

---

## 🚀 Usage

### Build the Playground

To generate all web pages from the examples:

```bash
npm run build
```

### Run in Development Mode

To start a local development server:

```bash
npm run dev
```

### Run the Tests

```bash
npm run test            # both suites
npm run test:component  # the live editor
npm run test:examples   # every example
```

`test:component` drives the editor in a headless browser — that the code shows up, that **Run** and its keyboard shortcut re-render the preview, and that typing alone does not.

`test:examples` loads each example in a headless browser and fails if the browser reported an error, an asset failed to load, or the map never painted. It does not compare pixels — tiles come from the live network, so exact colors are not reproducible.

For the same reason a failing example is run a second time before the test gives up: a single failure is as likely to be a hiccup on the network as a broken example. One that passes on the retry is reported as `(passed on retry)`, with the first attempt's output kept — a flake that keeps coming back is worth noticing.

Rendering alone says nothing about what a visitor *does* with an example, so an example built around an interaction can add an optional `check.ts` next to its `code.html`:

```ts
import * as assert from 'node:assert/strict';
import type { ExampleCheck } from '../../src/lib/check.ts';

const check: ExampleCheck = async ({ page, preview }) => {
	await preview.click('.maplibregl-marker');
	await preview.waitForSelector('.maplibregl-popup-content');
};

export default check;
```

`preview` is the frame the example runs in, `page` the surrounding playground page (for browser-level setup such as permissions). The smoke test runs the check once the map has finished rendering and treats anything thrown — an assertion, a selector that never appears — as a broken example.

---

## 🧸 Adding a New Example

To add a new example to the playground:

1. **Create a Folder:**

   Add a new directory inside `playground/` (use a descriptive name for your example).

2. **Add Example Files:**

   - Create a `code.html` file with a self-contained HTML snippet (DOCTYPE + scripts + map setup).
   - Create a `text.md` file with a markdown explanation. The YAML front matter must include `title` and `description`.
   - Optionally create a `check.ts` file to test an interaction the example is about (see [Run the Tests](#run-the-tests)).
   - Data the example loads (e.g. `data.geojson`) belongs in the same folder, and is fetched by its deployed URL — `https://versatiles.org/playground/$name/$file` — so the snippet keeps working when someone copies it elsewhere. The build fails if that file is missing or belongs to another example.

3. **Register the Example:**

   Update the `examples` array in `playground/toc.ts` to include your new example.

4. **Preview Locally:**

   - Start the development server with `npm run dev`.
   - Open [http://localhost:8080](http://localhost:8080) in your browser.

5. **Iterate:**

   Improve your `code.html` and `text.md` files to refine your example and documentation.

Screenshots are automatically generated during [deployment](https://github.com/versatiles-org/playground/blob/main/.github/workflows/ci.yml), so committing `code.html` + `text.md` is enough. You can test screenshots locally with `npm run screenshots` — without it, the index page shows broken thumbnails for new examples.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

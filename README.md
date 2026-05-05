[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

# VersaTiles Playground

A web-based playground demonstrating how to use [VersaTiles](https://versatiles.org) in a frontend environment.

Each example is a self-contained HTML snippet rendered in a small in-house live editor (preview on top, syntax-highlighted code editor below). The site is built statically and automatically deployed via GitHub Pages:

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

---

## 🧸 Adding a New Example

To add a new example to the playground:

1. **Create a Folder:**

   Add a new directory inside `playground/` (use a descriptive name for your example).

2. **Add Example Files:**

   - Create a `code.html` file with a self-contained HTML snippet (DOCTYPE + scripts + map setup).
   - Create a `text.md` file with a markdown explanation. The YAML front matter must include `title` and `description`.

3. **Register the Example:**

   Update the `examples` array in `playground/toc.ts` to include your new example.

4. **Preview Locally:**

   - Start the development server with `npm run dev`.
   - Open [http://localhost:8080](http://localhost:8080) in your browser.

5. **Iterate:**

   Improve your `code.html` and `text.md` files to refine your example and documentation.

Screenshots are automatically generated during [deployment](https://github.com/versatiles-org/playground/blob/main/.github/workflows/gh-release.yml), so committing `code.html` + `text.md` is enough. You can test screenshots locally with `npm run screenshots` — without it, the index page shows broken thumbnails for new examples.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

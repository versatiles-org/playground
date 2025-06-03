# VersaTiles Playground

A web-based playground demonstrating how to use [VersaTiles](https://versatiles.org) in a frontend environment.

This project uses the free [LiveCodes](https://github.com/live-codes/livecodes) editor and is automatically deployed via GitHub Pages:
👉 https://versatiles.org/playground/

⸻

## 📁 Repository Structure

```text
├─ .github/workflows/     # CI pipeline for building & deploying the playground
├─ docs/                  # Output directory for the generated website
├─ playground/            # Source examples for the playground
│  ├─ toc.ts              # Table of contents listing all available examples
│  └─ $name/              # Individual example directory (replace $name with actual example name)
│     ├─ code.html        # LiveCodes HTML snippet
│     └─ text.md          # Markdown explanation for the example
└─ src/                   # Source code for the generator and dev server
   ├─ generate.ts         # Script to build all example pages
   ├─ dev.ts              # Development server
   ├─ lib/                # Shared utility code
   └─ templates/          # Embedded JS templates (ETA format)
      ├─ index.eta        # Template for the index page
      └─ page.eta         # Template for individual example pages
```

⸻

## 🚀 Usage

### Build the Playground

To generate all web pages from the examples:

```bash
deno task build
```

### Run in Development Mode

To start a local development server:

```bash
deno task dev
```


⸻

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
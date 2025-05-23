# VersaTiles Playground

A playground to show how to use [VersaTiles](https://versatiles.org) in a web frontend.

Every example is built with the free **[LiveCodes](https://github.com/live-codes/livecodes)** editor and automatically deployed to GitHub Pages:

> **Live demo:** https://versatiles.org/playground/

---

## Repository Structure

```text
/
├── .github/workflows/    # CI pipeline that builds & deploys the playground
├── examples/             # JSON exports of individual LiveCodes examples
└── index.html            # Landing page listing all examples
```

---

## 🚀 Add a New Example

> Below, replace `<NAME>` with a short kebab‑case identifier for your example.

1. **Open LiveCodes** at https://versatiles.org/playground/livecodes and create your example.
   Need help? Check the [LiveCodes docs](https://livecodes.io/docs/features/).
2. **Export the project** via `Menu → Project → Export → Export Project (JSON)` and save it as `examples/<NAME>.json` in this repo.
3. **Link it** in `index.html` by adding a line like:

   ```html
   <ul>
     …
     <li><a href="examples/<NAME>">Short description of your example</a></li>
   </ul>
   ```

4. **Commit & push** (or open a PR). The GitHub Actions workflow will build and deploy the updated playground.
   Once the workflow succeeds, your example will be listed at:
   `https://versatiles.org/playground/`.

---

## 🔄 Update an Existing Example

1. Open an example in LiveCodes.
2. Make your changes.
3. Re‑export the project (JSON) and overwrite `examples/<NAME>.json`.
4. Commit & push. The site will redeploy automatically.

---

## ⚙️ How it works

- **LiveCodes** is a 100 % client‑side playground. It can open a project JSON provided via the `?config=` query parameter.
- Our **GitHub Actions** workflow builda a new page on every push to `main` and adds:

  1. LiveCodes.
  2. all `examples/*.json`
  3. `index.html`.

- Because everything happens in the browser, **no backend** is required.

---

## 📄 License

[MIT](LICENSE)

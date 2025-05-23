# VersaTiles Playground

It's a collection of examples on how to use VersaTiles in the frontend

when pushing, a github workflow loads the free Code playground [LiveCodes](https://github.com/live-codes/livecodes), adds the examples from this repo and deploys everything as Github pages under [versatiles.org/playground/](https://versatiles.org/playground/)

# How to add new examples?

Here is a Step-by-Step instruction for an new example named "TESTNAME".

1. Open [LiveCodes at https://versatiles.org/playground/livecodes](https://versatiles.org/playground/livecodes) and write your code. If you need help, check the [documentation of LiveCodes](https://livecodes.io/docs/features/)

2. Export the result using (Menu > Project > Export > Export Result (HTML)) and save the HTML file as `examples/TESTNAME.html`.

3. Update the top-level `index.html` by adding a new line:
```html
<ul>
	...
	<li><a href="examples/TESTNAME.html">new example showing something</a></li>
</ul>
```

4. Push/PR the changes, wait till the GitHub workflow is finished and open [versatiles.org/playground/](https://versatiles.org/playground/)

# How to update an example?

Make your changes in [LiveCodes at https://versatiles.org/playground/livecodes](https://versatiles.org/playground/livecodes), click "Export Result (HTML)" and overwrite the example in this repo.

# How does it work?

LiveCodes is a frontend only playground, so it can not load files from the server. But it accepts the [query parameter  `x`](https://livecodes.io/docs/features/import#query-param), containing a url, pointing to a public GitHub repo directory, containing the example files.

So the hack is done in the GitHub workflow: Instead of publishing the html files of the examples to github pages, the html files are replaced with redirects, opening LiveCodes with a query parameter, that points to the source code of the examples in the repo.

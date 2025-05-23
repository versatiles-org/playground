# VersaTiles Playground

It's a collection of examples on how to use VersaTiles in the frontend

when pushing, a github workflow loads the free Code playground [LiveCodes](https://github.com/live-codes/livecodes), adds the examples from this repo and deploys everything as Github pages under [versatiles.org/playground/](https://versatiles.org/playground/)

# How to add new examples?

Here is a Step-by-Step instruction for an new example named "$NAME".

1. Open [LiveCodes at https://versatiles.org/playground/livecodes](https://versatiles.org/playground/livecodes) and write your code. If you need help, check the [documentation of LiveCodes](https://livecodes.io/docs/features/)

2. Export the result using `Menu` > `Project` > `Export` > `Export Project (JSON)` and save the JSON file as `examples/$NAME.json`.

3. Update the top-level `index.html` by adding a new line:
```html
<ul>
	...
	<li><a href="examples/$NAME">new example showing something</a></li>
</ul>
```

4. Push/PR the changes, wait till the GitHub workflow is finished and open [versatiles.org/playground/](https://versatiles.org/playground/)

# How to update an example?

Make your changes in [LiveCodes at https://versatiles.org/playground/livecodes](https://versatiles.org/playground/livecodes), click `Export Project (JSON)` and overwrite the `examples/$NAME.json` in this repo.

# How does it work?

LiveCodes is a frontend only playground. It accepts the GET parameter `?config=`, containing a url of a project JSON.

So the hack is done in the GitHub workflow: Next to every `.json` in the examples directory the workflow adds a `.html` file containing a simple html redirects to LiveCodes with the `?config=` query parameter, that points to the correct example `.json`.

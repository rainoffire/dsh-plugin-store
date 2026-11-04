# DSH Plugin Store

A Plugins-page tab that turns the GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic
and the community `dsh-plugin-catalog` index into a small storefront.

## Install from this repository

```sh
dsh plugin --profile web add github:rainoffire/dsh-plugin-store
```

The repository is the plugin package itself (`package.json` at the root), so the Git spec installs
directly. The package is published as `@rainoffire/dsh-plugin-store`; the `private` flag keeps an
accidental npm publish from happening until you remove it.

## What it does

- Adds **Plugin Store** (插件商店) as a tab on the Plugins page.
- Joins two sources on the Host:
  - GitHub `topic:dsh-plugin`, sorted by recent activity, filtered for repositories that
    actually describe a DSH plugin; these add **Topic** badges and fresh discoveries.
  - `dsh-plugin-catalog`, which supplies the npm package name, curated category and latest
    version, so catalog entries can install through the page's own confirmation dialog.
- Classifies every entry into the catalog's 24 categories, with keyword rules for topic-only
  discoveries.
- Lets you search, filter by category and source, sort, open a detail sheet, shortlist plugins
  into a local shopping list, and install individually. The shortlist is kept in
  `localStorage`; nothing is sent anywhere.

## Runtime shape

- `index.js` — Host half. Registers `GET /dsh-plugin-store/catalog.json`, caches the joined
  document for ten minutes, and serves the last good cache when a refresh fails.
- `client.js` — Browser half. Registers the `plugins.tab` entry and renders the storefront with
  plain React.
- `locale/*.json` — display metadata read by Plugin Manager without activating the plugin.

## Notes

- The GitHub search API is unauthenticated by default (10 searches/minute). Set `GITHUB_TOKEN`
  in the Host environment to raise the limit. A rate-limited search degrades to the cached
  catalog plus a notice; it never empties the store.
- Installing a plugin runs third-party code. The install action opens DSH's own confirmation
  dialog; review the repository before confirming.

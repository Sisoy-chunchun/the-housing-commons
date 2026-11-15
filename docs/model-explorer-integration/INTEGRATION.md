# Model Explorer integration

This is an additive module for the Housing Website Prototype. It contains no replacement copies of the existing Home, Resources, Learn, Commons or About pages.

## Files to add

- `model-explorer.html`: page wrapper using the saved prototype's shared header, footer, fonts, stylesheet and menu script.
- `model-explorer/`: complete interactive explainer, scoped color/font theme and iframe height bridge.

Place both at the root of the CURRENT prototype beside `index.html`. The wrapper expects the existing `css/styles.css` and `js/site.js`. If the current prototype uses a component framework, use its existing shell and embed the same local module.

Add `<a href="model-explorer.html">MODEL EXPLORER</a>` to the current shared navigation or each static page's `.main-nav`, preferably after Learn. On the new page, give this link `aria-current="page"`. Keep all other links and page content intact. Update the mobile navigation too.

The included wrapper mirrors the saved v2 prototype. If the current header/footer differs, use the current version and retain only the iframe, its title, and the scoped embed CSS/JS imports. Do not restore older pages or overwrite the Commons network integration.

## Theme

| Role | Value |
| --- | --- |
| Charcoal | `#222A2A` |
| Sand | `#F0ECDF` |
| Lime | `#D4E94A` |
| Tacha | `#CBD370` |
| Aqua | `#6CB6BB` |
| Sky | `#93B9C4` |
| Signal red | `#FF5C30` |
| Headings and controls | Bricolage Grotesque |
| Body | Atkinson Hyperlegible Next |
| Labels | IBM Plex Mono |

`theme.css` changes colors and font families; the original `styles.css` preserves layout. Diagram rendering uses the same palette and body font, with a redraw after fonts load. Model text and datasets are unchanged. The exact font stylesheet URL is copied from the prototype, including its local fallback stacks.

## Embedding

The module is served from the same site and uses no separate sign-in. Its original internal navigation, header, hero, content, and footer remain present. The new primary Model Explorer tab belongs to the parent prototype. The child reports its content height; the parent accepts messages only from that iframe and the matching origin, with a bounded numeric height. This keeps content in normal page scrolling.

Serve the prototype through its normal local preview for testing. Opening through file:// may work in some browsers, but same-origin HTTP hosting is the supported integration path.

## Handoff

Attach this ZIP in the Housing Website Prototype workspace and use `INTEGRATION_PROMPT.md`. That workspace should merge these additions into its CURRENT project, verify the integration, and return the updated project without publishing.

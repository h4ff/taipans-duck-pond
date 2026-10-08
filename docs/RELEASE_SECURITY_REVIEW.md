# Duck Pond v0.157 — Release Security & Cleanup Review

Date: 8 Oct 2026

## Scope

Static GitHub Pages client application, including CSV loading, DOM rendering, audio, event/timer lifecycle, local assets and the v0.156 feature set.

## Findings

- No API keys, passwords, access tokens, private endpoints, `.env` files or credential material were found in the build.
- No external JavaScript, CSS, CDN dependencies, analytics or third-party runtime calls are present. Runtime network access is limited to same-origin CSV/assets.
- No `eval`, `new Function`, `document.write`, WebSocket or dynamic script injection was found.
- Player and event data are rendered with `textContent`/DOM nodes. The remaining hidden diagnostic tables were converted from escaped `innerHTML` construction to DOM construction in v0.157, removing the final HTML-string sink.
- CSV player IDs are validated against the loaded roster before duck events are accepted. Invalid dates, unknown duck types, unknown players and duplicate player IDs are rejected or normalised with warnings.
- A restrictive browser Content Security Policy is now declared in `index.html`: same-origin scripts/assets/data only, no objects, frames, forms or workers. Inline style permission remains because the animation engine intentionally writes dynamic style values.
- Referrer policy is now `no-referrer`.
- The repository contains public player display data (full name/nickname) by design. Because the site and browser-delivered CSVs are public, nothing in `data/` should be treated as confidential.
- GitHub Pages cannot set every ideal HTTP response header from application code. Stronger server headers (for example HSTS/header-level CSP) would require a host that supports custom response headers.
- The Gangnam audio clip is a licensing item to remove/replace before any commercial distribution, per project decision.

## Cleanup / stability decisions

- Hidden development/test hooks were retained for the Round 1 build because they are already disabled/hidden and removing their supporting code this close to launch creates unnecessary regression risk.
- No broad asset purge was performed. Many duck assets are referenced through dynamically constructed paths, so deleting files based only on literal string searches is unsafe.
- Existing event/timer cleanup for fight, snake, high-five, audio and Gangnam was reviewed; no release-blocking orphan timer/listener issue was identified.
- No feature behaviour, CSV schema, duck geometry or accepted animation timing was intentionally changed by this pass.

## Release recommendation

v0.157 is suitable as the release-candidate baseline, subject to normal regression testing on desktop, iPhone/Safari and Facebook's in-app browser. Any further changes before Round 1 should be defect-only where possible.

# Duck Pond v1.0.0 — Release & Security Review

Date: 10 Oct 2026

## Scope

Static GitHub Pages client application, including CSV loading, DOM rendering, audio, mobile interaction, event/timer lifecycle, production assets and the tested v0.183 release-candidate feature set.

## Security findings

- No API keys, passwords, access tokens, private endpoints, `.env` files or credential material are present.
- No external JavaScript, CSS, CDN dependencies, analytics or third-party runtime calls are present. Runtime data and assets are same-origin.
- No `eval`, `new Function`, `document.write`, WebSocket or dynamic script injection is used.
- Player/event values are rendered using DOM nodes and `textContent`; no HTML-string data sink remains.
- CSV player IDs are validated against the roster. Invalid dates, unknown player IDs, invalid duck types and duplicate player IDs are rejected or normalised with warnings.
- `index.html` declares a restrictive same-origin Content Security Policy and `no-referrer`. Inline styles remain permitted because the animation engine intentionally writes runtime positioning values.
- GitHub Pages is public static hosting. Anything in the repository or browser-delivered CSV files must be treated as public information.
- The current player data model contains display names/nicknames and should not be extended with confidential or sensitive data.
- The Gangnam audio clip remains a licensing consideration for any future commercial distribution.

## Pre-release cleanup completed

- Removed hidden developer/test UI and its event handlers.
- Removed hidden CSV diagnostic tables and their DOM-building code.
- Removed obsolete `OPEN_ME_WINDOWS.bat`.
- Removed unreferenced `assets/gangnam/LeftLegGangnam.png` and `assets/gangnam/GlassesWalkingNormal.png`.
- Removed dead functions: `toneBurst`, `playWingFlapSound`, `samePlayerEscapePoint`, and `chooseFightPair`.
- Removed obsolete Load-60/manual duck/role replay helpers and their UI-only state.
- Removed stale fight-test CSS and developer-control CSS.
- Kept dynamically generated duck asset families intact; literal-reference-only asset deletion is unsafe because many paths are assembled at runtime.

## Residual platform limitations

- GitHub Pages does not provide application-controlled HTTP response headers such as HSTS or header-level CSP.
- Facebook and Instagram in-app browsers may restrict orientation behaviour; the application provides a browser-opening notice but cannot force the social-app container to rotate.
- High duck counts can increase mobile thermal/rendering load. v0.162+ transform-based movement and the cheaper prestige implementation materially reduce this cost.

## Release recommendation

v1.0.0 is the production release promoted directly from the tested v0.183 candidate. Post-launch changes should be developed and tested separately before promotion to production.

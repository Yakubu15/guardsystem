# Mfumo wa Ratiya ya Walinzi (Guard System)

A duty-roster (ratiba) generator for security guards. Register guards, then
automatically assign them across posts and shifts, and print or save the result
as a PDF. The interface is in Swahili.

## Requirements

- Node.js 18 or newer (tested on Node 24)

## Install & run

```bash
npm install
npm start
```

Then open <http://localhost:3000>.

Set `PORT` / `HOST` to override the defaults:

```bash
PORT=8080 HOST=127.0.0.1 npm start
```

## Tests

```bash
npm test
```

## How it works

**Posts (malindo):** IKULU, PBZ, ULINZI KITUO, CRO
**Shifts:** 02:00–10:00, 10:00–18:00, 18:00–02:00

4 posts × 3 shifts = 12 slots, each needing 1 Senior and 1 Junior guard, so
**24 guards** are required to generate a full roster. Guards are sorted by
service number and assigned round-robin.

| Feature | Notes |
| --- | --- |
| Roster persistence | Saved in `localStorage`, so a refresh no longer clears the list |
| Duplicate check | A service number can only be registered once |
| Fair rotation | "Badilisha Mgawanyo" rotates the starting offset so duties are shared evenly |
| Two templates | Modern cards or a military-style table grid |
| Print / PDF | Uses the browser's print dialog with a print-only stylesheet |
| XSS protection | All user-entered values are escaped before rendering |

## Project layout

```
server.js            Express app (serves public/, exports createApp for tests)
public/index.html    The whole frontend (vanilla JS + Tailwind via CDN)
test/server.test.js  Smoke tests run with Node's built-in test runner
```

## Notes & limitations

- There is **no backend database**. The roster lives only in the browser that
  created it, so it is per-device and not shared between users. Sharing a
  roster requires a real backend.
- **No scheduling constraints** beyond round-robin. Rest days, leave,
  consecutive-shift limits and specific post assignments are not modelled.
- Tailwind is loaded from a **CDN**, so first load needs internet access. For
  production, install Tailwind locally and build the CSS.
- There is no authentication; anyone who can reach the server can use the app.

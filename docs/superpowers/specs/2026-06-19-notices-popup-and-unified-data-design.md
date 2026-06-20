# Notices: Unified Data, Launch Popup & Individual Page — Design

**Date:** 2026-06-19
**Status:** Approved design (pending spec review)
**Stack:** Vite + React 19 + React Router v7 (client-side routing)

## Goal

Make the college website show a dismissible **popup notice** when a visitor opens the
homepage. The popup shows one chosen ("featured") notice, can be cancelled, and clicking
it opens that notice's own page. At the same time, unify all notice displays (homepage
ticker, popup, `/notices` list, `/notices/:id` page) so they read from **one source of
data**, and structure that data behind a thin service layer so we can swap static mock
data for a real backend API later by changing **one file**.

## Current State (audit)

- **Data:** static array in `src/features/notices/data/mockNotices.js`. Fields:
  `id, title, description, date{day,month}, publishedDate, author, audience, tags[], pdfUrl`.
- **`/notices`** (`NoticeBoardPage.jsx`): works — search + filter + split list/detail. Imports `mockNotices` directly.
- **`/notices/:id`** (`NoticeViewerPage.jsx`): route exists but the component is an **empty stub**.
- **Homepage ticker** (`HomePage.jsx`): uses its **own** hardcoded `urgentNotices` array, not linked to `mockNotices`, not clickable through to a notice.
- **No popup/modal for notices.** `LightboxModal` (gallery) exists as a reference pattern.

## Decisions

| Decision | Choice |
|---|---|
| Which notice the popup shows | A `featured: true` notice; if none, fall back to most recent |
| Popup frequency | Once until dismissed; remembered per-notice in `localStorage`. A new featured notice (different id) shows again |
| Popup style | Centered modal card + dimmed backdrop |
| Where popup appears | Homepage only |
| Routing | By `id` for now (`slug` deferred to the API phase) |
| Data layer | Async service module (`getNotices`, `getNoticeById`, `getFeaturedNotice`) consumed via React Router loaders + a `useEffect` in the popup |
| Backend issue | GitHub issue, written as a plain-English requirement |

## Components & Changes

### 1. Data model (`src/features/notices/data/mockNotices.js`)
Add one field to each notice:
- `featured: boolean` — exactly one notice should be `true`. This is the notice shown in the homepage popup. If none is `true`, the service falls back to the most recent by `publishedDate`.

All other fields stay unchanged. (`slug` is intentionally **not** added yet — see API issue; we route by `id`.)

### 2. Service layer (NEW: `src/features/notices/services/noticesService.js`)
The single point that all notice data flows through. Today it returns the static array;
later only this file changes to call `fetch()`.

```
getNotices()        -> Promise<Notice[]>   // all notices, sorted newest-first by publishedDate
getNoticeById(id)   -> Promise<Notice|null>// one notice by id (string/number tolerant), or null
getFeaturedNotice() -> Promise<Notice|null>// the featured notice, else newest, else null
```

- All functions are `async` (return Promises) so the swap to a network call is invisible to callers.
- No component imports `mockNotices` directly anymore — everything goes through this service.

### 3. Route loaders (`src/routes/AppRoutes.jsx`)
Attach loaders to the notices routes (loaders coexist with the existing `lazy()` elements):
- `/notices` → `loader` calls `getNotices()`; `NoticeBoardPage` reads via `useLoaderData()`.
- `/notices/:id` → `loader` calls `getNoticeById(params.id)`; `NoticeViewerPage` reads via `useLoaderData()`.

This removes per-component loading/error boilerplate now and becomes a real async fetch
later with no component changes.

### 4. Individual notice page (`src/features/notices/pages/NoticeViewerPage.jsx`)
Implement the stub:
- Reads the loaded notice via `useLoaderData()`.
- Renders a full-page notice view, reusing the existing `NoticeDetailView` layout/styling for visual consistency.
- "Not found" (bad/unknown id → loader returned `null`): show a friendly "Notice not found" message with a link back to `/notices`.
- This page is the "dedicated place" the popup and ticker link to.

### 5. Launch popup (NEW: `src/features/notices/components/NoticePopup.jsx`)
- Mounted on the **homepage** only (rendered in `HomePage.jsx`).
- On mount, calls `getFeaturedNotice()` via `useEffect`.
- Reads `localStorage` key `dismissedNotice` (stores the last dismissed notice id). If it
  equals the featured notice's id → do **not** show. A different/new featured id shows again.
- Centered modal card on a dimmed backdrop showing: tag badge, title, short description,
  a **"Read more →"** button, and an **✕** close button.
- Close (✕ or backdrop click or `Esc`): hides the popup and writes the featured id to
  `localStorage` under `dismissedNotice`.
- "Read more →" / clicking the card: navigates to `/notices/:id` (via `useNavigate`).
- Accessibility: `role="dialog"`, `aria-modal="true"`, labelled by the title, `Esc` to
  close, focus moved into the dialog on open.

### 6. Homepage ticker (`src/features/general_pages/HomePage.jsx`)
- Delete the local `urgentNotices` array.
- Source ticker items from `getNotices()` (shared data).
- Each ticker item links to its `/notices/:id` page.
- Mount `<NoticePopup />` here.

## Data Flow

```
mockNotices.js (static)
        │
        ▼
noticesService.js  (getNotices / getNoticeById / getFeaturedNotice)   <-- ONLY file that changes for API
        │
        ├── route loader (/notices)      -> NoticeBoardPage  (useLoaderData)
        ├── route loader (/notices/:id)  -> NoticeViewerPage (useLoaderData)
        ├── HomePage ticker              -> getNotices()
        └── NoticePopup (homepage)       -> getFeaturedNotice()  -> navigate(/notices/:id)
```

## Out of Scope (now)

- Real backend / network calls (captured in the GitHub API issue).
- `slug`-based URLs, pagination, draft/scheduled publishing (listed as future API fields).
- Making `pdfUrl` downloads real (still `#` until backend provides files).

## Backend API Issue (GitHub)

Open a GitHub issue on `sobitbhattarai94/Itahari-Namuna-College`, written in plain English as
a requirement (not instructions on how to build it). It states: we need an API that returns
notices in the shape below, and explains what each key is for — e.g. `featured` = the notice
shown as the homepage popup. It lists:
- A list endpoint (all notices, newest first) and a single-notice-by-id endpoint.
- The JSON keys we consume and a one-line meaning for each.
- Nice-to-have future keys (slug, attachments list, publish/expiry dates, draft flag).

## Acceptance Criteria

1. Opening the homepage shows a centered popup for the featured notice; ✕/backdrop/Esc closes it.
2. After dismissing, reloading the homepage does **not** re-show the same notice; a different featured notice **does** show.
3. Clicking the popup (or "Read more") opens that notice at `/notices/:id`.
4. `/notices/:id` renders the full notice; an unknown id shows a friendly not-found with a link back.
5. Homepage ticker, `/notices` list, popup, and detail page all read from the same data; ticker items link to their notice pages.
6. No component imports `mockNotices` directly — all access goes through `noticesService`.
7. A GitHub issue exists describing the required API and the meaning of each key.

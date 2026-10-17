# Instagram Clone

A responsive Instagram clone built with **React 19**, **Vite** and **React Router**, backed by a
**json-server** REST API. It recreates the core Instagram experience — stories, a likeable feed and an
editable profile — in a small, readable codebase.

Live demo (Render free instance — the first request may take a moment while it wakes up):
https://instagram-clone-jqor.onrender.com

## Features

- **Stories bar** with Instagram-style gradient rings and a full-screen story viewer
- **Story viewer** with progress bars, previous/next navigation and a safe redirect for out-of-range ids
- **Feed** with author avatars resolved from the users API, relative timestamps and like / save toggles
- **Optimistic updates** for likes and follows, rolled back automatically if the request fails
- **Profile page** with bio, post/follower/following counts, an edit form and a following list
- **Loading skeletons, empty states and error states** everywhere instead of endless "Loading…" text
- **Responsive layout** — three columns on desktop, two on tablets, bottom navigation on mobile
- **Automatic dark mode** via `prefers-color-scheme`
- Accessible markup: semantic landmarks, `aria-label` / `aria-pressed`, focus-visible outlines and
  `prefers-reduced-motion` support

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, React Router 7 |
| Build tool | Vite 8 |
| Icons / styling | Bootstrap 5, Bootstrap Icons, React Icons |
| HTTP client | Axios |
| Mock API | json-server |

## Getting Started

### Prerequisites

- Node.js 18 or newer

### 1. Install dependencies

```bash
npm install
```

### 2. Start the REST API

The app reads its data from `db.json`, served by json-server on port `3000`.

```bash
npm run server
```

### 3. Start the app

In a second terminal:

```bash
npm run dev
```

Open the URL printed by Vite (by default http://localhost:5173).

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run server` | Serve `db.json` as a REST API on port 3000 |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |

## API Endpoints

The UI talks to these json-server resources:

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/posts` | Feed posts |
| `PUT` | `/posts/:id` | Persisting likes |
| `GET` | `/stories`, `/stories/:id` | Stories bar and story viewer |
| `GET` | `/users`, `/users/:id` | Post authors and the profile page |
| `PUT` | `/users/:id` | Saving profile edits |
| `GET` | `/profile/:id` | Signed-in account card in the right rail |
| `GET` | `/suggestion` | "Suggested for you" list |
| `GET` / `POST` / `DELETE` | `/following` | Follow and unfollow |

## Project Structure

```
src/
├── assets/            # Logo and brand images
├── lib/
│   ├── api.js         # Axios instance + one function per endpoint
│   └── format.js      # Like / comment / relative-time formatters
├── App.jsx            # Feed layout (sidebar + feed + rail)
├── Feed.jsx           # Stories + posts column
├── Sidebar.jsx        # Primary navigation
├── Stories.jsx        # Story ring list
├── Posts.jsx          # Post cards with like and save actions
├── Suggestion.jsx     # Right-hand suggestions rail
├── Viewstory.jsx      # Full-screen story viewer
├── Profile.jsx        # Profile page with edit form
├── main.jsx           # Router setup and entry point
└── index.css          # Design tokens, layout and responsive rules
```

## Environment Variables

Copy `.env.example` to `.env.local` to point the app at a different API host:

```bash
VITE_API_URL=http://localhost:3000
```

If `VITE_API_URL` is not set, the app falls back to `http://localhost:3000`.

## Deployment

The production build is a static bundle, so it can be hosted anywhere. Two things to keep in mind:

1. Set `VITE_API_URL` to a publicly reachable API URL — `localhost` only works on your own machine.
2. Because the app uses client-side routing, the host must rewrite unknown paths to `index.html`.

> This demo has no authentication layer, so the "signed-in" user is a constant (`CURRENT_USER_ID` in
> `src/lib/api.js`) and the JSON API is intentionally open.

## Author

**Singathurai C** — Software · Cloud · DevOps Engineer

- GitHub: https://github.com/singathurai007
- Portfolio: https://singathurai007.github.io/singathurai-portfolio/

<div align="center">

# rendalone.

**A keyframe-driven, multi-track video editor for the browser — powered by [Remotion](https://www.remotion.dev/).**

Compose videos from layered tracks of text, shapes, media, and audio; animate them with keyframes; preview them live; and export to MP4 through a small render server.

[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e.svg)](#license)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-2dd4bf.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4-ff6b6b.svg)](https://www.remotion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vite.dev/)

</div>

---

## Table of contents

- [What it does](#what-it-does)
- [The big picture](#the-big-picture)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Repository layout](#repository-layout)
- [The data model](#the-data-model)
- [How rendering works](#how-rendering-works)
- [Editor internals](#editor-internals)
- [Configuration](#configuration)
- [Extending: add a component type](#extending-add-a-component-type)
- [Tech stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## What it does

- **Multi-track timeline.** Stack any number of **video** lanes (visuals composite top-to-bottom by lane order) plus **audio** lanes. Each lane holds clips placed on a frame timeline.
- **Live, WYSIWYG preview.** The preview uses the exact same render code as the final export — what you see is what you get.
- **Direct-manipulation canvas.** Click a clip in the preview to drag, resize, and rotate it with [`react-moveable`](https://daybrush.com/moveable/).
- **Keyframe animation.** Capture the playhead state as a keyframe; rendalone interpolates `left`, `top`, `width`, `height`, `opacity`, and `transform` between keyframes.
- **One-click opacity fades.** Add a fade-in / fade-out to any clip from the inspector (implemented as opacity keyframes — it affects playback only, the timeline block stays clean).
- **Component library.** Background, Shape (rectangle / ellipse / line), Text, Image, Video, GIF, and Lottie.
- **Audio with waveforms.** Drop in audio; rendalone draws a live waveform with [Wavesurfer.js](https://wavesurfer.xyz/) and plays it through Remotion.
- **Local templates.** Save and reload whole compositions from `localStorage`.
- **MP4 export.** A small Fastify server renders the timeline with the Remotion CLI and streams progress back to the editor.

## The big picture

rendalone is an **npm-workspaces monorepo** with two apps and two shared packages:

```
apps/app  (Vite + React, http://localhost:3000)
  Landing / Waitlist / About  ->  Editor (/editor)
                                    |
                                    v
                          TimelineProvider
                   (single VideoComposition in state)
                     |                         |
       preview path  |                         |  export path
                     v                         v
   @remotion/player + EditableSceneLayer    POST /api/render  (timeline JSON)
   (Moveable selection overlay)                  |   ^
                     |                           |   | NDJSON progress
                     |                           v   |
                     |                  apps/api (Fastify, :3001)
                     |                  spawns the Remotion CLI ->
                     |                  /out/*.mp4, streams progress,
                     |                  serves the file
                     |                           |
                     v                           v
          packages/composition  (Remotion compositions, per-type renderers, public/)
          packages/shared       (types, timeline math, keyframes, pure reducers)
                                  ^ imported by BOTH the app and the composition
```

Key idea: **`packages/shared` owns the data model and all the pure timeline logic.** The editor (`apps/app`) and the renderer (`packages/composition`) both import from it, so the preview and the export can never drift apart.

## Quick start

```bash
git clone https://github.com/your-org/rendalone.git
cd rendalone
npm install
npm run dev
```

`npm run dev` starts **both** the editor (`:3000`) and the render API (`:3001`) together via `concurrently`. Open <http://localhost:3000> and head to **/editor**.

### Requirements

- Node.js **≥ 18** (LTS recommended)
- npm **≥ 9** (workspaces support)
- **FFmpeg** for MP4 export — bundled with `@remotion/renderer` on most platforms; install it manually if rendering complains.

## Scripts

Run from the repo root:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the editor **and** the render API together (hot reload). |
| `npm run dev:app` | Start only the Vite editor (`:3000`). |
| `npm run dev:api` | Start only the Fastify render server (`:3001`). |
| `npm run build` | Production bundle of the editor to `apps/app/dist/`. |
| `npm run preview` | Serve the built editor locally. |
| `npm run remotion:studio` | Open Remotion Studio against the composition entry. |
| `npm run remotion:render` | Render the default composition to `out/video.mp4` from the CLI. |

Each workspace also has its own scripts (e.g. `npm run build -w @renda/api`).

## Repository layout

```
renda/                          (repo root — npm workspaces)
├── apps/
│   ├── app/                     Vite + React editor (port 3000)
│   │   └── src/
│   │       ├── components/
│   │       │   ├── editor/      Editor shell: preview panel, media panel, layout
│   │       │   ├── timeline/    Timeline ruler, clips, control bar, transport icons, waveform
│   │       │   ├── inspector/   Property panel for the selected clip / lane
│   │       │   ├── landing/     Marketing site (hero, pricing, faq, …)
│   │       │   ├── waitlist/    Waitlist page
│   │       │   └── shared/      Header, panel, color picker, popover forms, render dialog
│   │       ├── editor/          EditableSceneLayer — Moveable overlay on the preview
│   │       ├── providers/       TimelineProvider (state) + EditorUiProvider (panels/layout)
│   │       ├── hooks/           useTemplates (localStorage save/load)
│   │       ├── utils/ constants/  localStorage helpers + keys
│   │       └── theme.ts         Dark-first Chakra theme
│   │
│   └── api/                     Fastify render server (port 3001)
│       └── src/
│           ├── index.ts         Routes: POST /api/render, GET /api/render/file, /health
│           └── render-video.ts  Spawns the Remotion CLI, parses progress, writes /out
│
└── packages/
    ├── shared/                  Framework-agnostic core (imported by app AND composition)
    │   └── src/
    │       ├── types/           VideoComposition, Lane, TimedComponent, keyframes, per-component types
    │       └── lib/
    │           ├── video.ts            FPS, dimensions, totalDurationFrames, getActiveComponent
    │           ├── timeline-math.ts    px↔frame↔seconds, zoom, timecode formatting
    │           ├── keyframes.ts         getComponentStyleAtFrame (interpolation entry point)
    │           ├── interpolate.ts       Style interpolation between two keyframes
    │           ├── sort-components.ts   Render order (backgrounds first)
    │           ├── styles.ts            parsePx and friends
    │           ├── import-project.ts / render-validation.ts
    │           └── timeline-utils/      Pure reducers: add/move/trim/remove/patch/edit,
    │                                    add/delete lane, keyframes, fade-keyframes
    │
    └── composition/             Remotion side (imported by the app's preview and the CLI)
        └── src/
            ├── index.ts                Remotion entry (used by studio + render)
            ├── root.tsx                Registers the "scenes" + "composition" compositions
            ├── scenes.tsx              Top-level: maps lanes → layered visuals + audio
            ├── scene-composition.tsx   Renders a set of components at a frame (shared by preview + export)
            ├── guards.ts               Type guards (isText, isImage, …)
            ├── renderers/              One renderer per component type
            ├── templates/              default-template.ts (the starting composition)
            └── public/                 Static assets served by Vite (logo.png, fonts, …)
```

## The data model

Everything in the editor is one object: a **`VideoComposition`** (defined in `packages/shared/src/types`). It is the single source of truth held by `TimelineProvider` and the exact payload sent to the render API.

```ts
type VideoComposition = {
  lanes: Lane[];
};

type Lane = {
  id: string;
  name: string;
  type: "video" | "audio";   // video lanes composite; audio lanes play
  locked?: boolean;
  hidden?: boolean;
  components: TimedComponent[];
};

// A component placed on the timeline = its visual type + timing + animation.
type Timed<T> = T & {
  startFrame: number;          // where it starts on the timeline
  duration: number;            // how long it lasts (frames)
  sourceStartFrame?: number;   // trim in-point (video/audio)
  sourceEndFrame?: number;     // trim out-point
  keyframes?: ComponentKeyframe[];
};

type TimedComponent =
  | Timed<BackgroundComponentType>
  | Timed<ShapeComponentType>
  | Timed<TextComponentType>
  | Timed<ImageComponentType>
  | Timed<VideoComponentType>
  | Timed<GifComponentType>
  | Timed<LottieComponentType>;
```

- **Lanes are tracks**, not scenes. Video lanes stack by their order in the array (`zIndex = laneIndex`); the first lane is the bottom layer.
- A **clip** is a `TimedComponent`: its base style lives in `divStyles`, and `keyframes` describe how that style changes over the clip's local frames (`0 … duration`).
- `totalDurationFrames` (in `lib/video.ts`) is the max `startFrame + duration` across all lanes — that's the composition length.

## How rendering works

There is **one** render path, used in two contexts:

`scene-composition.tsx` → `SceneCompositionInner` takes a list of components and a frame, then for each component:
1. computes its interpolated style with `getComponentStyleAtFrame(component, frame)` (from `packages/shared`),
2. sorts by z-index (`sortComponentsForRender` — backgrounds first),
3. dispatches to the matching renderer via the type guards in `guards.ts`.

**Preview (in the browser):** `@remotion/player` renders `scenes.tsx`, which walks the lanes and feeds the active clip of each lane into `SceneCompositionInner`. The editor adds `EditableSceneLayer` on top for selection + Moveable handles, reusing the very same render output.

**Export (MP4):**
1. The editor `POST`s the `VideoComposition` JSON to `http://localhost:3001/api/render` (`render-dialog.tsx`).
2. `apps/api` writes the props to `out/.render-props.json` and spawns the **Remotion CLI** to render the `scenes` composition (`render-video.ts`).
3. The server parses CLI stdout for bundling / rendering / encoding progress and streams it back as **NDJSON**; the editor shows a live progress bar.
4. On success the file lands in `/out`, and the editor downloads it from `GET /api/render/file?name=…`.

Because the CLI renders the same `packages/composition` code the preview uses, exports match the editor frame-for-frame.

## Editor internals

- **State — `TimelineProvider`** (`apps/app/src/providers/timeline.tsx`). Holds the `VideoComposition`, the playhead frame, the current selection, and play/pause. Every mutation calls a **pure reducer** from `packages/shared/src/lib/timeline-utils/*` (`moveComponent`, `trimComponentStart/End`, `patchComponent`, `editComponent`, `addKeyframe`, `addLane`, …) and sets the result back into state. Reducers are pure and unit-testable; the provider just wires them to React.
- **UI state — `EditorUiProvider`.** Which panels are open, layout sizes, etc.
- **Canvas editing — `EditableSceneLayer`** (`apps/app/src/editor/`). Attaches `react-moveable` to the selected clip. While dragging it applies *live* style overrides; on release it bakes the change into the clip's base `divStyles` via `editComponent`.
- **Keyframes.** The inspector's **Add keyframe** records the current styles at the playhead's clip-local frame. `getComponentStyleAtFrame` later interpolates between the surrounding keyframes.
- **Fades.** `lib/timeline-utils/fade-keyframes.ts` builds/clears opacity keyframes at the clip's start or end. The inspector's **Fade in / Fade out** buttons toggle them (solid = active, click again to remove). Fades are pure data — no special-case rendering.

## Configuration

**Composition defaults** live in `packages/shared/src/lib/video.ts`:

```ts
export const FPS = 60;
export const COMPOSITION_WIDTH = 1920;
export const COMPOSITION_HEIGHT = 1080;
```

Change these to retarget every preview and export (e.g. 1280×720@30).

**Editor → API URL.** The editor reads `VITE_API_URL` (see `apps/app/.env.development`, default `http://localhost:3001`). Point this at wherever the render server runs.

**Vite aliases & assets** (`apps/app/vite.config.ts`): `@renda/shared` and `@renda/composition` resolve to the packages' `src/`, and `publicDir` is set to `packages/composition/public` so static assets (e.g. `logo.png`) are shared between the editor and the renderer.

**Remotion entry** for `remotion studio` / `remotion render` is `packages/composition/src/index.ts`.

## Extending: add a component type

1. **Type** — add `packages/shared/src/types/components/your-component.ts` and add it to the `TimedComponent` union in `types/timed-component.ts`.
2. **Guard** — add `isYourComponent` in `packages/composition/src/guards.ts`.
3. **Renderer** — add `packages/composition/src/renderers/your-component.tsx` (render only the content; positioning/sizing is applied by `scene-composition.tsx`) and wire it into `renderContent`.
4. **Authoring UI** — expose it in the editor's media panel (`apps/app/src/components/editor/components/media-panel.tsx`), reusing or adding a form under `components/shared/popover/components/`.
5. **Z-order (optional)** — adjust `packages/shared/src/lib/sort-components.ts` if it needs special layering.

## Tech stack

| Layer | Library |
| --- | --- |
| Rendering | [Remotion](https://www.remotion.dev/) 4 |
| Preview player | [`@remotion/player`](https://www.remotion.dev/docs/player) |
| Render server | [Fastify](https://fastify.dev/) 5 + Remotion CLI |
| UI | [Chakra UI](https://chakra-ui.com/) 2 |
| Canvas editing | [`react-moveable`](https://daybrush.com/moveable/) |
| Audio waveforms | [Wavesurfer.js](https://wavesurfer.xyz/) |
| Routing | [React Router](https://reactrouter.com/) 6 |
| Build tool | [Vite](https://vite.dev/) 8 (Rolldown) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |

## Contributing

PRs welcome. Before opening one:

```bash
npm run build      # editor production build must pass
npx tsc --noEmit   # type check the whole monorepo
```

Please keep timeline logic in `packages/shared` as **pure functions** (no React, no DOM) so it stays testable and reusable by both the editor and the renderer.

## License

MIT — see [LICENSE](./LICENSE).

Remotion has its own [license terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md); review them before using rendalone commercially.

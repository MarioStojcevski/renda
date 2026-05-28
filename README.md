<div align="center">

# renda

**A minimal, keyframe-driven video editor for the browser — powered by [Remotion](https://www.remotion.dev/).**

Build scene-based videos, drop in text, shapes, media, and audio, animate them with keyframes, and export programmatically with the Remotion CLI.

[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e.svg)](#license)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-2dd4bf.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4-ff6b6b.svg)](https://www.remotion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vite.dev/)

</div>

---

## Features

- **Dark-first editor UI** with a timeline, preview, and inspector — built on Chakra UI.
- **Scene-based composition.** Each scene has its own components and duration; scenes play back-to-back via Remotion `Series`.
- **Interactive canvas.** Click any component to drag, resize, and rotate it directly on the preview, powered by [`react-moveable`](https://daybrush.com/moveable/).
- **Keyframe animation.** Capture a keyframe at the playhead and renda interpolates `left`, `top`, `width`, `height`, `opacity`, and `rotate` between frames.
- **Component library.**
  - **Background** — solid color or CSS gradient that fills the whole canvas.
  - **Shape** — rectangle, ellipse, or line with fill and stroke.
  - **Media** — upload PNG, SVG, JPG, WebP, GIF, or paste a URL.
  - **Text** — color, size, content.
  - **Video / GIF / Lottie / SlotMachine** — for richer compositions.
- **Audio track with waveforms.** Drop in any audio file; renda renders a live waveform with [Wavesurfer.js](https://wavesurfer.xyz/) and plays it back through Remotion.
- **Local templates.** Save and reload entire compositions from `localStorage`.
- **Programmatic export.** Render the same composition to MP4 via the Remotion CLI.

## Quick start

```bash
git clone https://github.com/your-org/renda.git
cd renda
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Requirements

- Node.js **≥ 18** (LTS recommended)
- npm **≥ 9** (or pnpm / yarn — adjust the commands accordingly)

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server (hot reload). |
| `npm run build` | Production bundle to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run remotion:studio` | Open Remotion Studio against `src/composition/index.ts`. |
| `npm run remotion:render` | Render the composition to `out/video.mp4`. |

## Usage

1. **Add a scene.** Use the **Scene** button in the timeline toolbar.
2. **Add components.** Open any of the popovers in the left rail — `Background`, `Shape`, `Media`, `Text`, `Video`, `Gif`, `Lottie` — to drop a component onto the active scene.
3. **Edit on the canvas.** Click a component. Drag the bounding box to move, the handles to resize, the rotation knob to rotate.
4. **Animate with keyframes.** Move the playhead to a frame, change the component (drag/resize/rotate or edit values in the inspector), then click **Add keyframe at Xs**. Repeat at another frame and renda interpolates between them.
5. **Audio.** Click the **Audio** button in the timeline toolbar and pick a file. The waveform renders inline; trim start/duration from the inspector.
6. **Save a template.** Name it in the **Export** panel and hit **Save** — it's stored in `localStorage`.
7. **Export to MP4.**
   ```bash
   npm run remotion:render
   ```

## Project layout

```
src/
├── components/         UI (editor, timeline, inspector, shared, layout)
│   ├── editor/         Main editor view (preview + inspector + sidebar)
│   ├── timeline/       Timeline ruler, video & audio tracks, waveforms
│   ├── inspector/      Per-selection property panels
│   └── shared/         Header, popovers, logo, panel, color picker
├── composition/        Remotion compositions and per-type renderers
│   ├── renderers/      Background, Shape, Text, Image, Video, Gif, Lottie, SlotMachine
│   ├── templates/      Built-in starter compositions
│   ├── scenes.tsx      Top-level Remotion <Series> + audio
│   └── scene-composition.tsx  Player + editor overlay (Moveable)
├── providers/timeline/ Centralized state: playhead, selection, audio, keyframes
├── lib/                Pure helpers (keyframes, timeline math, defaults, sort)
├── types/              Discriminated-union component types
├── hooks/              `useTemplates` (localStorage)
└── theme.ts            Dark-first Chakra theme
```

## How it works

renda keeps a single source of truth — a `VideoComposition` — in the `TimelineProvider`. Every editor action (add component, drag, set keyframe, change scene duration, add audio) is a pure transformation defined under `src/providers/timeline/utils/*`, so reducers stay small, testable, and easy to extend.

At render time:

- **Preview / export** — `SceneComposition` runs inside `<Player>` (and Remotion's renderer). For each component it sorts by z-index (backgrounds first), then asks `getComponentStyleAtFrame` for the interpolated styles given the current frame, and dispatches to the matching renderer via type guards.
- **Editor overlay** — `EditableSceneLayer` reuses the exact same render path with `interactive` on, attaching `react-moveable` to the selected target. Drag/resize/rotate end → `editComponent` updates the base `divStyles`; the **Add keyframe** button records a `ComponentKeyframe`.

This means **what you see in the editor is exactly what Remotion exports** — no separate preview-only code paths.

## Configuration

Composition defaults live in `src/lib/video.ts`:

```ts
export const FPS = 30;
export const COMPOSITION_WIDTH = 1280;
export const COMPOSITION_HEIGHT = 720;
```

Change these to retarget the export (e.g. 1920×1080@60fps).

The Remotion entry point — used by `remotion studio` and `remotion render` — is `src/composition/index.ts`.

## Tech stack

| Layer | Library |
| --- | --- |
| Rendering | [Remotion](https://www.remotion.dev/) 4 |
| Player | [`@remotion/player`](https://www.remotion.dev/docs/player) |
| UI | [Chakra UI](https://chakra-ui.com/) 2 |
| Canvas editing | [`react-moveable`](https://daybrush.com/moveable/) |
| Audio waveforms | [Wavesurfer.js](https://wavesurfer.xyz/) |
| Build tool | [Vite](https://vite.dev/) 8 (Rolldown) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |

## Contributing

PRs welcome. Before opening one, please:

```bash
npm run build         # production build must pass
npx tsc --noEmit      # type check must pass
```

When adding a new component type:

1. Add a type in `src/types/components/your-component.ts` and append it to the `SceneComponentType` union.
2. Add a renderer in `src/composition/renderers/your-component.tsx` (no positioning wrapper — the scene composition provides it).
3. Add a type guard in `src/composition/guards.ts` and a branch in `renderContent`.
4. Optionally expose it in the **Components** rail by adding it to `popoverTypes` and shipping a form under `src/components/shared/popover/components/`.
5. If it needs special z-ordering, update `src/lib/sort-components.ts`.

## License

MIT — see [LICENSE](./LICENSE).

Remotion has its own [license terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md); review them before using renda commercially.

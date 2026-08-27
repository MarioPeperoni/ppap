# ppap — Pure Pen & Paper

Implementation specification. Sections 1–9 are binding for all work. Section 10 splits the build
into phases; implement them in order, and close a phase only when its acceptance criteria hold.

---

## 1. Product

An infinite dotted canvas you write on with a pen, plus the minimum needed to keep many boards.
Handwritten notes and sketches, nothing more.

**Design principle:** every pixel of chrome must justify itself. The canvas is the app. The
interface is a floating toolbar and a thin title bar.

**Platform:** Windows first (Electron Forge + Vite + React 19 + TypeScript). macOS is one entry
in the release matrix, not a design constraint.

**Out of scope:** collaboration, cloud sync, shape and arrow tools, sticky notes, rich text,
PDF and SVG export, element rotation, layers, grouping, freeform color picking, mobile and web
builds, plugins.

---

## 2. Architecture

### 2.1 Stack

| Concern    | Choice                                                              |
| ---------- | ------------------------------------------------------------------- |
| UI         | React 19, TypeScript                                                |
| State      | `zustand` (v5), vanilla store shared with non-React canvas code     |
| Styling    | `tailwindcss@4` with `@tailwindcss/vite`, CSS-first `@theme` config |
| Primitives | `@radix-ui/react-popover`, `-dialog`, `-tooltip`                    |
| Icons      | `lucide-react`, named imports                                       |
| Ink        | `perfect-freehand`                                                  |
| Archive    | `fflate`                                                            |
| Tests      | `vitest`                                                            |
| Updates    | `update-electron-app`                                               |
| Build      | Electron Forge + Vite                                               |

A new dependency has to beat "thirty lines in `src/core`".

### 2.2 Process split

| Process      | Owns                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **main**     | Window lifecycle, window controls, all filesystem access, the board repository, archive encoding, the asset protocol, native dialogs. |
| **preload**  | The single bridge. A typed `window.ppap` API over `contextBridge`.                                                                    |
| **renderer** | Library grid, canvas, tools, camera, history. No Node, no filesystem.                                                                 |

### 2.3 Directory layout

```
src/
  main/
    main.ts               bootstrap only
    window/               BrowserWindow factory, window-control handlers
    board/
      BoardRepository.ts       interface
      FileBoardRepository.ts   implementation over the library directory
      LibraryIndex.ts          index cache, rebuild by scan
    archive/
      ArchiveCodec.ts          .ppap read/write over fflate
      AssetStore.ts            content-addressed assets, orphan collection
    protocol/assetProtocol.ts  ppap-asset:// scheme
    ipc/                       one contract table, one handler per entry
  preload/preload.ts
  shared/
    types.ts              BoardFile, BoardMeta, Element
    ipc.ts                channel names and payload types
  core/                   pure: no React, no DOM, no Electron
    camera.ts             screen<->board transforms, zoom-to-point, zoom-to-fit
    geometry.ts           bbox, point-segment distance, polygon containment, rect intersection
    stroke.ts             perfect-freehand wrapper, outline and bbox
    erase.ts              stroke splitting against an eraser path
    select.ts             marquee and lasso predicates, uniform scaling
    grid.ts               adaptive dot levels
    history.ts            command stack
    elements.ts           element factory
    serialize.ts          BoardFile validation and version migration
  renderer/
    App.tsx               route: library | board
    state/                zustand slices
    library/              LibraryGrid, BoardTile
    board/
      Board.tsx           canvas host, pointer routing, keyboard map
      layers/             GridLayer, SceneLayer, OverlayLayer
      render/             ElementRenderer registry
      tools/              pen, pencil, eraser, marquee, lasso, hand + ToolRegistry
    components/           Toolbar, TitleBar, ToolPopover
```

Anything expressible as a pure function belongs in `src/core`.

### 2.4 Patterns

| Pattern    | Where                          | Contract                                                                                                                                                             |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository | `main/board`                   | `BoardRepository` exposes `list / load / save / create / rename / remove`. Callers never learn that boards are files.                                                |
| Factory    | `core/elements.ts`             | `createStroke`, `createImage` own id generation and defaults.                                                                                                        |
| Strategy   | `renderer/board/tools`         | Every tool implements `Tool { id, cursor, onPointerDown, onPointerMove, onPointerUp, onCancel, drawOverlay }`. Adding a tool means adding a file and registering it. |
| Strategy   | `renderer/board/render`        | One `ElementRenderer` per element type, keyed by `Element['type']`.                                                                                                  |
| Command    | `core/history.ts`              | `Command { apply, revert }`. One gesture produces one command.                                                                                                       |
| Adapter    | `main/archive/ArchiveCodec.ts` | The only module that knows the archive is a zip.                                                                                                                     |

### 2.5 Rendering

Three absolutely positioned canvases, each sized `clientSize * devicePixelRatio`:

| Layer          | Contents                                                                   | Repaints on                           |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| `GridLayer`    | Dot grid                                                                   | Camera, viewport size, theme          |
| `SceneLayer`   | Committed elements                                                         | Element mutation, camera, theme       |
| `OverlayLayer` | Live stroke, lasso path, marquee, selection box and handles, eraser cursor | Every pointer sample during a gesture |

One `requestAnimationFrame` scheduler with per-layer dirty flags drives all painting. Event
handlers set flags; they never paint. `SceneLayer` culls by element bbox against the visible
board rect.

### 2.6 State

| Store          | Holds                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `libraryStore` | Board metadata, sort order, loading state                                                                  |
| `keymapStore`  | A primary and a secondary key per rebindable action; persisted to settings                                 |
| `boardStore`   | Board id and name, `elements: Map<string, Element>`, `camera`, `selection: Set<string>`                    |
| `toolStore`    | Active tool, pen colour pair, the id of the active palette, pen width, eraser width; persisted to settings |
| `paletteStore` | The saved palettes; persisted to settings                                                                  |
| `historyStore` | Undo and redo command stacks, capped at 200 commands per board                                             |

Canvas layers subscribe to the vanilla store directly, so a pointer move never rerenders a React
component. React components use narrow selectors with `useShallow`. Element mutations go through
store actions that push a command and mark layers dirty.

---

## 3. Coordinate system and camera

Board space is unbounded. One board unit is one CSS pixel at zoom 1.

```
camera = { x, y, zoom }        // x,y is the board coordinate at the viewport's top-left corner
screen = (board - camera.xy) * camera.zoom
board  = screen / camera.zoom + camera.xy
```

- Zoom clamps to `0.1 … 8`.
- A bare wheel zooms **anchored at the cursor**, factor `1.1` per notch. `Ctrl` or `Cmd`+wheel
  pans instead, vertically or, with `Shift`, horizontally.
- The `wheelAction` setting says what the bare wheel does; the modifier always does the other one,
  so both stay within reach whichever way it is set.
- `Ctrl` `+` / `-` zoom by ×1.25 anchored at the viewport centre. `Ctrl+0` sets 100 %.
- `Ctrl+1` fits the bbox of all elements with 64 units of padding, capped at 100 %.
- The camera is stored in the board file and restored on open.

`core/camera.ts` owns every transform; screen↔board round-trips exactly.

---

## 4. Dot grid

- Base spacing `24` board units; levels are `24 · 2^n`.
- The coarsest level whose on-screen spacing is `>= 16 px` is drawn solid; the next finer level
  fades in linearly as its spacing crosses `16 → 28 px`.
- Dot radius `1.1 px` in screen space.
- Colors: light `#D4D4D4`, dark `#333333`.
- Only dots inside the viewport are drawn, batched into one `Path2D` per level.
- `Ctrl+G` toggles the grid; visibility is a board property.

`core/grid.ts` exports `gridLevels(zoom, base) -> { spacing, alpha }[]`.

---

## 5. Data model

`src/shared/types.ts` is the single source of truth.

```ts
type ColorToken = 'ink' | 'blue' | 'red' | 'green' | 'violet' | 'orange';
type HexColor = `#${string}`; // lowercase #rrggbb, a colour the user picked
type StrokeColor = ColorToken | HexColor;
type SizeToken = 's' | 'm' | 'l';

interface SavedPalette {
  id: string; // uuid v4
  name: string;
  colors: HexColor[]; // at most MAX_CUSTOM_COLORS
}
type NibToken = 'pen' | 'pencil';
type FontToken = 'sans' | 'serif' | 'mono' | 'hand';

interface BoardMeta {
  format: 'ppap';
  version: 1;
  id: string; // uuid v4, also the file name
  name: string;
  createdAt: string; // ISO 8601
  modifiedAt: string; // ISO 8601
  folderId: string | null;
}

interface Folder {
  id: string; // uuid v4
  name: string;
  createdAt: string; // ISO 8601
}

interface BoardContent {
  gridVisible: boolean;
  camera: { x: number; y: number; zoom: number };
  elements: Element[]; // array order is z-order
}

interface BoardFile {
  meta: BoardMeta;
  content: BoardContent;
}

type Element = StrokeElement | ImageElement | TextElement;

interface ElementBase {
  id: string;
  createdAt: number;
}

interface StrokeElement extends ElementBase {
  type: 'stroke';
  points: [x: number, y: number, pressure: number][]; // board coords, pressure 0..1
  color: StrokeColor; // a token follows the theme, a hex is the ink the user picked
  size: SizeToken; // s=4, m=8, l=16, xl=32 board units
  nib: NibToken; // pen tapers with pressure, pencil holds one width
}

interface ImageElement extends ElementBase {
  type: 'image';
  assetId: string; // sha256 of the bytes
  mime: string;
  x: number;
  y: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

interface TextElement extends ElementBase {
  type: 'text';
  text: string; // newlines break lines, nothing else is markup
  x: number;
  y: number;
  width: number; // the measured box, so bounds stay pure and synchronous
  height: number;
  color: StrokeColor;
  size: SizeToken; // s=16, m=24, l=36, xl=56 board units
  font: FontToken;
  scale: number; // what a resize left behind, multiplied into the face
}
```

Bounding boxes and stroke outlines are cached in memory, keyed by element id, invalidated on
mutation, and never written to disk.

### 5.1 Palette

| Token      | Light     | Dark      |
| ---------- | --------- | --------- |
| `ink`      | `#111111` | `#EDEDED` |
| `blue`     | `#2563EB` | `#5B8DEF` |
| `red`      | `#DC2626` | `#F0616B` |
| `green`    | `#16A34A` | `#4ADE80` |
| `violet`   | `#7C3AED` | `#A78BFA` |
| `orange`   | `#EA580C` | `#FB923C` |
| background | `#FFFFFF` | `#191919` |
| dots       | `#D4D4D4` | `#333333` |

The palette is declared once as CSS custom properties in `@theme`, with dark values under
`@media (prefers-color-scheme: dark)` and a `[data-theme="dark"]` selector so the manual override
wins in both directions. Canvas code resolves the variables through `getComputedStyle` once per
theme change and caches the result.

PNG export renders with the light palette on opaque white.

---

## 6. Tools

Exactly one tool is active. Held `Space` and the middle mouse button temporarily override it with
pan and restore it on release. All pointer types drive the active tool identically until P5.

The canvas host sets `touch-action: none` and calls `setPointerCapture` on pointerdown.

### 6.1 Pen and pencil — pen `P`, pencil `N`

- One `StrokeTool` drives both; the nib it carries is stored on every stroke it commits.
- `perfect-freehand` with `{ size, thinning, smoothing: 0.5, streamline: 0.5, simulatePressure }`,
  where `simulatePressure` is true for devices that report no real pressure. `thinning` is `0.5`
  for the pen and `0` for the pencil, so the pencil holds one width from end to end.
- The size a nib is given is the width it draws at pressure `0.25`, so the picked width sits in the
  middle of the pen's taper instead of at its top.
- `event.getCoalescedEvents()` supplies the full input sample rate; every sample is appended.
- The live stroke draws on `OverlayLayer`; `pointerup` commits it as one command and clears the
  overlay.
- Six colors × three widths in a popover above the icon, shared by both nibs. `C` and `Shift+C`
  cycle the six and whatever the active palette holds, `[` and `]` step width. Choices persist in
  settings.
- Two colors are held at once: the active one and a pinned partner, and `X` swaps them. A click in
  the popover sets the active color, `Shift`-click pins the partner, and a second `Shift`-click
  unpins it. The active color wears a solid ring standing off the swatch and the partner a dashed
  one, so the swatch shows its color whole and two swatches side by side never collide. Every
  selected control in the popover wears that same standing ring, the mark of a choice everywhere in
  the app. Picking the pinned color is the swap, so the pair never collapses into one color.
  Both colors survive a restart, and a colour keeps its pin after its palette leaves the bar.
- A change of color away from the popover flashes a dot in the new color beside the cursor and
  fades it out, so the swap is legible without looking down at the toolbar.
- Under the six sits the active palette: its `MAX_CUSTOM_COLORS` colors and, after them, a
  swatch-sized button that opens the library, the two filling one row of six. The pen holds the
  palette's id, never a copy of its colors, so editing the palette changes the row and deleting it
  leaves the button alone. A stroke keeps the hex it was drawn with, so a palette going inactive leaves the ink
  alone and a board carries its colors wherever it travels.
- A custom color is drawn as picked unless it would sink into the canvas under it. Below
  `MIN_INK_CONTRAST` in OKLCh lightness it is pushed away from the canvas, hue intact, which is
  what keeps it readable in both themes and in a PNG export.

### 6.2 Eraser — `E`

Splits strokes. For each pointer segment, with eraser radius `r`:

1. Select strokes whose bbox intersects the eraser segment bbox inflated by `r`.
2. Mark stroke points within `r` of the segment.
3. Drop marked points; each surviving run becomes a stroke inheriting color, size and order. Runs
   under 2 points are discarded.
4. Images and text boxes are removed when the eraser centre enters their bbox.

A whole `pointerdown … pointerup` gesture is one command holding `{ removed, added }`. A single
source stroke yields at most 64 fragments; past that it is removed outright. The eraser cursor is
a circle outline on the overlay. `[` and `]` step its radius.

### 6.3 Selection — marquee `V`, lasso `L`

- **Marquee** selects elements whose bbox intersects the dragged rectangle.
- **Lasso** selects strokes fully contained in the polygon, and images and text boxes whose bbox
  centre is inside.

A non-empty selection shows a bounding box with four corner handles:

- Dragging inside moves. Dragging a handle scales **uniformly** about the opposite corner; stroke
  widths and text faces scale with the selection.
- `Backspace` deletes. `Ctrl+C` / `Ctrl+X` / `Ctrl+V` copy, cut and paste at the
  cursor, and both copy and cut lay the selection on the system clipboard as PNG, so the fragment
  drops into any other application. `Ctrl+D` duplicates offset by 24 units. `Ctrl+A` selects all.
  `Escape` clears.

### 6.4 Hand — `H`

Drags the camera.

### 6.5 Text — `T`

- Clicking bare canvas opens a caret there, its first line centred on the point. Clicking an
  existing text box reopens that box with the caret at its end.
- Typing runs in a transparent `<textarea>` laid over the canvas in the element's own font, size
  and colour, so what is typed is already what the canvas will draw. The element it stands for is
  held back from the scene layer until the box closes.
- `Escape` and `Ctrl+Enter` close the box, as does reaching for another tool or clicking elsewhere.
  `Enter` breaks a line. A box closed blank commits nothing, and blanking an existing one deletes
  it.
- Four faces, picked in the popover: sans, serif, mono and hand. `[` and `]` step the size through
  the same four tokens the pen uses.
- The box carries the measured width and height of its text, so selection, erasing and export treat
  it as a placed rect the way an image is treated.

### 6.6 Images

- `Ctrl+V` with an image on the clipboard, and dropping image files on the canvas, insert an
  `ImageElement` centred at the cursor.
- Bytes are stored verbatim. `assetId` is their SHA-256, so the same image pasted repeatedly
  occupies one archive entry.
- Initial size fits the natural size within 800 board units, preserving aspect ratio.
- The renderer references `ppap-asset://<boardId>/<assetId>` and never holds the bytes.

### 6.7 Keyboard reference

Rebindable in Settings, a primary and a secondary stroke per action, modifiers allowed:

| Primary                     | Secondary | Action                                                |
| --------------------------- | --------- | ----------------------------------------------------- |
| `P` `N` `T` `E` `V` `L` `H` | `1` … `7` | Pen / pencil / text / eraser / marquee / lasso / hand |
| `C`, `Shift+C`              | —         | Next and previous color                               |
| `X`                         | —         | Swap the active color with the pinned one             |
| `[`, `]`                    | —         | Step stroke or eraser width                           |
| `Backspace`                 | `Delete`  | Delete the selection                                  |

Fixed:

| Keys                                         | Action                                   |
| -------------------------------------------- | ---------------------------------------- |
| `Space` held, middle-drag                    | Temporary pan                            |
| `Escape`                                     | Cancel gesture, clear selection          |
| Wheel                                        | Zoom at cursor, or pan when set that way |
| `Ctrl`+wheel                                 | Whatever the bare wheel does not do      |
| `Ctrl+=` `Ctrl+-` `Ctrl+0` `Ctrl+1`          | Zoom in / out / 100 % / fit              |
| `Ctrl+Z`, `Ctrl+Shift+Z`, `Ctrl+Y`           | Undo, redo                               |
| `Ctrl+A` `Ctrl+C` `Ctrl+X` `Ctrl+V` `Ctrl+D` | Selection operations                     |
| `Ctrl+G`                                     | Toggle grid                              |
| `Ctrl+S`                                     | Flush pending save                       |
| `Ctrl+N`                                     | New board                                |
| `F2`                                         | Rename board                             |
| `Alt+←`                                      | Back to the library                      |

`Space` and `Escape` are refused as bindings. Every other fixed stroke can be taken by a
rebindable action, which the Settings row calls out as an override.

---

## 7. Persistence

### 7.1 Archive format

A `.ppap` file is a zip:

```
board.ppap
├─ meta.json            BoardMeta
├─ board.json           BoardContent
├─ thumb.png            480×300
└─ assets/<sha256>      raw image bytes
```

JSON entries use deflate; `thumb.png` and `assets/*` are stored uncompressed. Listing reads only
`meta.json` and `thumb.png`, using the `filter` option of `fflate`'s `unzip`.

`ArchiveCodec` is the only module aware of the container. `serialize.ts` validates `meta.format`
and `meta.version` on read and runs migrations keyed by version.

### 7.2 Library directory

```
<userData>/ppap/
  boards/<uuid>.ppap
  folders.json         [{ id, name, createdAt }]
  index.json           cache of BoardMeta, rebuilt by scanning boards/
  settings.json        theme, active tool, pen colour pair and width, saved palettes and the id of the active one, wheel, sort order, key bindings
```

`index.json` is a cache. When it is missing, unparsable, or out of step with `boards/`,
`LibraryIndex` rebuilds it by reading each archive's `meta.json`.

`folders.json` is durable. A board's `folderId` travels inside its archive, so filing survives an
index rebuild; folder names survive in `folders.json`. A `folderId` pointing at a missing folder
resolves to the library root.

### 7.3 Saving

- Element mutations schedule a save debounced by **800 ms**. Camera changes schedule one on a
  lazy 5 s timer and on board close.
- The renderer sends `BoardContent` plus any new asset buffers; main encodes and writes.
- Writes go to `<id>.ppap.tmp` and land with `fs.rename`. A board never exists half-written.
- At most one save is queued per board while another is in flight.
- On save, `AssetStore` keeps only assets referenced by the element list.
- Thumbnails regenerate at most every 10 s and on board close.
- `Ctrl+S` flushes immediately. Quitting flushes pending writes first.

### 7.4 Asset protocol

Main registers `ppap-asset` before `app.ready` via `protocol.registerSchemesAsPrivileged`
(`{ standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true }`) and
serves it with `protocol.handle`. Responses carry the asset's mime type and
`Access-Control-Allow-Origin: *`, which keeps the canvas untainted so PNG export works.

The handler resolves `<boardId>` and `<assetId>` against the open board only, and rejects any id
failing `/^[0-9a-f-]{36}$/` and `/^[0-9a-f]{64}$/` respectively.

### 7.5 Export and import

- **Export .ppap** copies the archive through a native save dialog.
- **Import .ppap** validates the archive, assigns a new `id`, and adds it to the library.
- **Export PNG** renders the content bbox plus 40 units of padding at 2×.
- **`Ctrl+C`** renders the selection bbox to the clipboard as `image/png` beside the elements it
  holds in-app, and remembers that PNG's digest, so a paste back into ppap restores strokes rather
  than a picture of them.
- Squirrel registers the `.ppap` extension through `fileAssociations`; opening a file from the
  shell imports it and navigates to that board.

### 7.6 IPC

```ts
window.ppap = {
  library: {
    list():                            Promise<BoardMeta[]>;
    create(name?: string):             Promise<BoardMeta>;
    load(id: string):                  Promise<BoardFile>;
    save(id: string, content: BoardContent, assets: NewAsset[], thumb?: Uint8Array): Promise<void>;
    rename(id: string, name: string):  Promise<void>;
    remove(id: string):                Promise<void>;
    setFolder(id: string, folderId: string | null): Promise<void>;
    exportFile(id: string):            Promise<boolean>;
    importFile():                      Promise<BoardMeta | null>;
  },
  folders: {
    list():                            Promise<Folder[]>;
    create(name: string):              Promise<Folder>;
    rename(id: string, name: string):  Promise<void>;
    remove(id: string):                Promise<void>;
  },
  window:    { minimize(); toggleMaximize(); close(); onMaximizeChange(cb) },
  theme:     { get(): Promise<Theme>; set(t: Theme); onChange(cb) },
  clipboard: { writeImage(png: Uint8Array): Promise<void> },
}
```

Channel names and payload types live in `shared/ipc.ts` and are registered from one table. Every
handler validates its arguments in main: ids against their pattern, sizes against a cap, and
resolved paths against the library directory.

---

## 8. UI

### 8.1 Window

One window hosts both views, and `requestSingleInstanceLock` focuses the running instance instead
of opening a second. Frameless, `titleBarStyle: 'hidden'`, shown on `ready-to-show` with a
`backgroundColor` matching the active theme. A 36 px title bar:

```
┌───────────────────────────────────────────────┐
│ ←   sprint planning                  ─  □  × │
├───────────────────────────────────────────────┤
│                    canvas                     │
│              ┌────────────────┐               │
│              │  ✎  ⌫  ▭  ⌾  ✋ │               │
└──────────────┴────────────────┴───────────────┘
```

The back arrow and the board name appear on the board screen; the name is edited in place by
click or `F2`. The library screen carries the app name and a gear icon. Window buttons are HTML
with `-webkit-app-region: no-drag`; the rest of the bar drags, and double-click maximizes. There
is no menu bar.

### 8.2 Toolbar

One floating pill, horizontally centred, 16 px above the bottom edge. Icons only, no labels, no
borders. The active tool carries a subtle filled background. Hover shows a Radix tooltip with the
name and shortcut. Clicking the active tool, or pressing its shortcut again, opens its popover:
colors, the active palette and width for the pen and pencil, colors, the four faces and size for
text, radius for the eraser. The width sits
on a slider spanning the popover, stepped through the four sizes and named above it; its track is a
wedge thickening left to right, notched at the inner stops and capped at both ends.
The active pen, pencil or text tool carries a rounded color bar under its icon: the active color alone, or
split 65 / 35 with the pinned partner. The popover closes on `Escape`, outside click, and
selection. The zoom percentage sits in the bottom-right corner between a `−` and a `+` button;
clicking it sets 100 %, and the step buttons grey out at the zoom limits.

### 8.3 Library grid

- Tiles of thumbnail, name, and relative modified date, in a responsive grid.
- The `+` tile comes first and opens the new board immediately.
- The thumbnail opens the board; the name under it renames, so the row that lights up on hover is
  the row that edits.
- Default name is the creation date (`23 Aug 2026`). A pencil beside the trash on hover renames
  too, as does `F2` anywhere on a focused tile.
- A `Library` header sits over the grid with the sort control on its right: modified date
  descending by default, with name and creation date available.
- `Delete` opens a Radix confirmation dialog, then removes the archive.
- Empty state: one line of text and the `+` tile.
- Folder tiles sit between the `+` tile and the boards, each a mosaic of the four most recently
  modified thumbnails it holds, its name and its board count. Clicking one opens it in place;
  a breadcrumb takes the header's place and leads back, and the library holds no nesting.
- The folder button in the library title bar makes a folder and starts its rename. A board tile
  drags onto a folder tile to file it and onto `Library` in the breadcrumb to take it out. New and
  imported boards land in the open folder.
- Deleting a folder keeps its boards, which return to the library root.

### 8.4 Settings

The gear in the library title bar opens a Radix dialog holding the theme control
(`System | Light | Dark`), the wheel action and the application version.
`Escape` closes it. The board screen has no settings surface.

**Shortcuts** widens the dialog and swaps its body for the keymap panel, grouped as tools, color,
stroke and selection. A row holds two boxes of one fixed width, primary and secondary, each
clearing on its own `×` and cutting a long stroke to an ellipsis, and one button resetting the pair; the footer resets them all. Clicking a box arms it and the next
keystroke lands, with the modifiers held. Taking a key from another action leaves that one unbound
and says so; taking one from a fixed shortcut says what it overrides; `Space` and `Escape` are
refused. `Escape` while armed cancels the capture.

### 8.5 Palettes

The palette button in the pen popover closes it and opens a Radix dialog of its own, so the popover
never grows to hold a collection. The dialog is two panes: a scrolling list of up to
`MAX_SAVED_PALETTES` palettes on the left, each a name over a strip of its dots, the active one
tagged `Active` in green, and a button under them that makes a new one; the palette picked there
opens in the editor on the right.

The editor renames the palette in place, cut to `MAX_PALETTE_NAME`, shows its colors as swatches
that drop on a click of their corner, and fills the rest of the pane with an HSV panel over a hex
field and an `Add colour` button wearing the colour it would add, lettered dark or light against
it. A palette takes a colour once and stops at `MAX_CUSTOM_COLORS`.
`Activate palette` hands the pen its id and closes the dialog, and reads `Active` behind that same
green dot for the palette already carried; the bin deletes the palette, leaving the pen with none
when it was the active one. A palette with no colors is kept but cannot be activated.

---

## 9. Engineering standards

### 9.1 TypeScript

`strict`, plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`,
`verbatimModuleSyntax`. No `any`, no non-null assertions on values crossing a process boundary,
no casts on IPC payloads — validation instead. Element handling uses exhaustive switches on
`Element['type']`, so a new element type breaks the build wherever it must be handled.
`tsc --noEmit` gates every phase.

### 9.2 Lint and format

ESLint 9 flat config (`eslint.config.js`) with `typescript-eslint` type-aware rules on:
`no-floating-promises`, `no-misused-promises`, `consistent-type-imports`,
`switch-exhaustiveness-check`, `no-unnecessary-condition`. Prettier owns formatting; ESLint
carries no stylistic rules. `husky` and `lint-staged` run `eslint --fix` and `tsc --noEmit` on
pre-commit.

Lint and type errors are fixed at their root. Suppression comments are not part of this codebase.

### 9.3 Electron security

`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`. A CSP
that allows `'self'` and `ppap-asset:` only. `will-navigate` and `setWindowOpenHandler` deny
everything. `session.setPermissionRequestHandler` denies everything. `requestSingleInstanceLock`
guards a second instance and routes file-open arguments to the running one. The Fuses plugin in
`forge.config.ts` disables `runAsNode` and Node CLI inspection in packaged builds.

### 9.4 Tests

`vitest` over `src/core`, run with `npm test` and `npm run test:watch`:

| Module      | Covered behaviour                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `camera`    | Round-trip, zoom-at-point keeps its anchor fixed, clamping, zoom-to-fit                            |
| `geometry`  | Point-segment distance, concave and self-intersecting polygon containment, rect intersection       |
| `erase`     | Middle cut yields two strokes, end cut trims, full cover removes, style inherited, 64-fragment cap |
| `select`    | Marquee intersects, lasso contains, uniform scaling preserves aspect and scales widths             |
| `grid`      | Level selection and fade alpha across the zoom range                                               |
| `history`   | Command apply and revert restore identical state                                                   |
| `serialize` | Archive round-trip, malformed input rejected, migration path                                       |
| `elements`  | Factory defaults, asset hashing and dedup                                                          |

In development builds only, `window.__ppapDev.seed(n)` fills the open board with `n` generated
strokes for hands-on checks of the targets in §9.5.

### 9.5 Performance targets

| Metric                                                 | Target     |
| ------------------------------------------------------ | ---------- |
| Frame time while drawing on a board of ~10 000 strokes | ≤ 16.6 ms  |
| Pointer-to-ink latency on the overlay layer            | ≤ 2 frames |
| Board open (5 MB archive) to first paint               | ≤ 300 ms   |
| Save encoding on the renderer thread                   | ≤ 50 ms    |
| Cold start to library grid                             | ≤ 1.5 s    |

The rules that hold them:

- All painting flows through the single rAF scheduler.
- `SceneLayer` never repaints for an overlay-only change; `GridLayer` repaints only on camera,
  viewport or theme change.
- Elements are culled by bbox before drawing.
- Stroke outlines and bboxes are cached and invalidated on mutation.
- Store selectors stay narrow; a pointer move touches no React component.
- Elements live in a `Map` copied shallowly on write, with no proxy layer on the drawing path.

### 9.6 Updates

`update-electron-app` checks GitHub Releases every 6 hours, downloads in the background, and
installs on restart. It is disabled in development builds.

### 9.7 CI

`.github/workflows/ci.yml` runs on pull requests: `lint → tsc --noEmit → test → build`.
`release.yml` runs on push to `main` and takes its version from the `type [x.y.z] description`
PR title.

---

## 10. Phases

Each phase ends with a clean `tsc --noEmit`, a clean lint, passing tests, and a working
`npm start`. Within a phase, work lands in small commits: one piece at a time, each leaving the
app in a running state.

### P0 — Canvas, camera, pen, eraser

Three-layer canvas host and rAF scheduler, camera and transforms, adaptive dot grid, tool registry
with pen, eraser and hand, command history, floating toolbar, frameless title bar, theme tokens.
One in-memory board.

**Done when** drawing stays fluid on a board seeded with 10 000 strokes, the eraser cuts a stroke
into two independent strokes, pan and zoom hold their anchor, and every gesture undoes in one step.

### P1 — Selection

Marquee and lasso, selection box with corner handles, move, uniform scale, delete, copy, cut,
paste, duplicate, select all.

**Done when** a lasso drawn around part of a drawing takes exactly the strokes fully inside it,
and scaling a multi-stroke selection keeps relative positions and stroke weights coherent.

### P2 — Persistence and library

`ArchiveCodec`, `BoardRepository`, `LibraryIndex`, autosave with the camera and element split,
atomic writes, thumbnails, library grid with rename, delete and sort, export and import, PNG
export, the selection on the system clipboard, settings.

**Done when** a board reopens with identical content and camera, a deleted `index.json` rebuilds
silently, and killing the app mid-stroke leaves a valid archive.

### P3 — Images

`AssetStore` with SHA-256 addressing and orphan collection, the `ppap-asset` protocol, clipboard
paste and file drop, images in selection, scaling, erasing and export.

**Done when** the same screenshot pasted five times adds one archive entry, and PNG export of a
board containing images produces a full image rather than a blank canvas.

### P4 — Folders

`folderId` on `BoardMeta`, `folders.json`, folder tiles, dragging a board onto a folder,
breadcrumb navigation. The on-disk board layout stays flat.

**Done when** boards can be filed and unfiled and the grouping survives an index rebuild.

### P5 — Windows Ink

- `pointerType === 'pen'` drives the tool; `pointerType === 'touch'` pans and pinch-zooms. A
  **Draw with touch** setting, default off, restores touch drawing.
- Palm rejection: while a pen has been seen within the last 500 ms, touch pointers never draw.
- Barrel button (`event.buttons & 2`) acts as eraser while held. The inverted eraser tip
  (`event.buttons & 32`) erases regardless of the active tool.
- `tiltX`, `tiltY` and `twist` feed the stroke when they improve it.
- Press-and-hold right-click and edge flicks are suppressed over the canvas.
- `pointerrawupdate` and `getPredictedEvents()` are adopted for the live stroke when the measured
  latency gain is real.

**Done when** a palm resting on a Surface-class screen leaves no marks and flipping the pen erases.

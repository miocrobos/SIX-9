# UI Context

## Theme

Light and dark modes. Default is dark; users can toggle via `ThemeToggle`. The `.dark` class on `<html>` activates dark mode, controlled by `ThemeProvider` (saves to `localStorage`).

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes like `zinc-*`.

### Theme architecture
- Raw mode-aware variables: `:root` (light) / `html.dark` (dark) — e.g. `--raw-bg-base`, `--raw-accent-primary`.
- `@theme inline` references these via `var()` — e.g. `--color-bg-base: var(--raw-bg-base)`.
- Components use Tailwind utilities: `bg-bg-base`, `text-text-primary`, etc.
- `ThemeProvider` in `components/theme-provider.tsx` manages the class + localStorage.
- `ThemeToggle` in `components/theme-toggle.tsx` provides the UI control.

| Role             | Tailwind utility          | Light (`--raw-*`)         | Dark (`--raw-*`)          |
| ---------------- | ------------------------- | ------------------------- | ------------------------- |
| Page background  | `bg-bg-base`              | `#F7F8FC`                 | `#080809`                 |
| Surface          | `bg-bg-surface`           | `#ffffff`                 | `#111114`                 |
| Elevated surface | `bg-bg-elevated`          | `#f1f3f5`                 | `#18181c`                 |
| Subtle surface   | `bg-bg-subtle`            | `#e9ecef`                 | `#1e1e23`                 |
| Default border   | `border-border-default`   | `#E8E8E8`                 | `#2a2a30`                 |
| Subtle border    | `border-border-subtle`    | `#dee2e6`                 | `#3a3a42`                 |
| Primary text     | `text-text-primary`       | `#1A1A1A`                 | `#f0f0f4`                 |
| Secondary text   | `text-text-secondary`     | `#555555`                 | `#c0c0cc`                 |
| Muted text       | `text-text-muted`         | `#888888`                 | `#808090`                 |
| Faint text       | `text-text-faint`         | `#AAAAAA`                 | `#505060`                 |
| Brand accent     | `text-accent-primary`     | `#D92525` (SIX red)       | `#D92525` (SIX red)       |
| Brand dim bg     | `bg-accent-primary-dim`   | `rgba(217,37,37,0.10)`    | `rgba(217,37,37,0.12)`    |
| AI accent        | `text-accent-ai`          | `#6457f9` (indigo-purple) | `#6457f9` (indigo-purple) |
| AI text          | `text-accent-ai-text`     | `#8b82ff`                 | `#8b82ff`                 |
| Error            | `text-state-error`        | `#dc2626`                 | `#ff4d4f`                 |
| Success          | `text-state-success`      | `#16a34a`                 | `#34d399`                 |
| Warning          | `text-state-warning`      | `#d97706`                 | `#fbbf24`                 |

Tailwind utility names follow the pattern `{property}-{token-name}`, e.g. `bg-bg-surface`, `text-text-primary`, `border-border-default`, `text-accent-primary`, `bg-accent-primary-dim`.

## Typography

| Role      | Font       | CSS Variable        |
| --------- | ---------- | ------------------- |
| UI text   | Geist Sans | `--font-geist-sans` |
| Code/mono | Geist Mono | `--font-geist-mono` |

Both fonts are loaded via `next/font/google` and applied as CSS variables on the `<html>` element. The base `body` uses Geist Sans with `antialiased`.

## Border Radius

Radius increases with surface depth — smaller for inner elements, larger for outer containers.

| Context           | Class         |
| ----------------- | ------------- |
| Inline / small UI | `rounded-xl`  |
| Cards / panels    | `rounded-2xl` |
| Modal / overlay   | `rounded-3xl` |

## Canvas

### Node Color Palette

8 defined color pairs. Each pair specifies a dark node fill and a vivid contrasting text color tuned for readability on the dark canvas. Defined in `types/canvas.ts` as `NODE_COLORS`.

| Node fill | Text color | Character              |
| --------- | ---------- | ---------------------- |
| `#1F1F1F` | `#EDEDED`  | Neutral dark (default) |
| `#10233D` | `#52A8FF`  | Blue                   |
| `#2E1938` | `#BF7AF0`  | Purple                 |
| `#331B00` | `#FF990A`  | Orange                 |
| `#3C1618` | `#FF6166`  | Red                    |
| `#3A1726` | `#F75F8F`  | Pink                   |
| `#0F2E18` | `#62C073`  | Green                  |
| `#062822` | `#0AC7B4`  | Teal                   |

Default node color: `#1F1F1F` with `#EDEDED` text.

### Edge Style

Smooth-step path with an arrow marker. Default edge color: `#f8fafc`. Stroke width is thin — edges are visually secondary to nodes.

### Node Shapes

6 supported shapes, defined in `types/canvas.ts` as `NODE_SHAPES`. Complex shapes (diamond, hexagon, cylinder) are rendered as inline SVGs rather than CSS borders.

- `rectangle` — default general-purpose node
- `diamond` — decision / gateway
- `circle` — event / endpoint
- `pill` — service / process
- `cylinder` — database / storage
- `hexagon` — external system / boundary

### Connection Handles

Small white circular handles, hidden by default, revealed on node hover. Appear at all four sides of a node.

### Canvas Background

React Flow `<Background>` component. Canvas sits on the base background color.

## Component Library

shadcn/ui on top of Tailwind. No custom design system. Components live in `components/ui/`. Use the `shadcn` CLI to add new components rather than writing them from scratch.

## Layout Patterns

- Editor workspace: full-viewport layout — floating sidebar overlay on the left, center canvas, slide-over AI sidebar on the right.
- Sidebars: floating overlay with dark semi-transparent background and subtle border.
- Modals and dialogs: centered overlay, `rounded-3xl`, dark background with backdrop blur.
- Navbar: top bar with dark background and bottom border.

## Icons

Lucide React. Stroke-based icons only — no filled variants. Icon sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons, `h-8 w-8` for feature icons in empty states.

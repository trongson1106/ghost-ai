# UI Context

## Theme

Dark only.
No light mode. The design language is a dark technical
workspace — near-black backgrounds, layered surfaces,
and vivid accent colors for interactive elements.

## Colors

| Role | CSS Variable | Hex / Value |
|---|---|---|
| Page background | `--bg-base` | `#080809` |
| Surface | `--bg-surface` | `#111114` |
| Elevated surface | `--bg-elevated` | `#18181c` |
| Subtle surface | `--bg-subtle` | `#1e1e23` |
| Default border | `--border-default` | `#2a2a30` |
| Subtle border | `--border-subtle` | `#3a3a42` |
| Primary text | `--text-primary` | `#f0f0f4` |
| Secondary text | `--text-secondary` | `#c0c0cc` |
| Muted text | `--text-muted` | `#808090` |
| Faint text | `--text-faint` | `#505060` |
| Brand accent | `--accent-primary` | `#00c8d4` (cyan) |
| Brand dim | `--accent-primary-dim` | `rgba(0, 200, 212, 0.12)` |
| AI accent | `--accent-ai` | `#6457f9` (indigo-purple) |
| AI text | `--accent-ai-text` | `#8b82ff` |
| Error | `--state-error` | `#ff4d4f` |
| Success | `--state-success` | `#34d399` |
| Warning | `--state-warning` | `#fbbf24` |
## Typography

| Role      | Font              | Variable      |
| --------- | ----------------- | ------------- |
| UI text   | Geist Sans | `--font-sans` |
| Code/mono | Geist Mono | `--font-mono` |

## Border Radius

| Context           | Class            |
| ----------------- | ---------------- |
| Inline / small UI | `rounded-x1` |
| Cards / panels    | `rounded-2x1` |
| Modals / overlays | `rounded-3x1` |

## Canvas

8 defined color pairs. Each pair specifies a dark node fill and a vivid contrasting text color tuned for readability on the dark canvas. Defined in `types/canvas.ts` as `NODE_COLORS`.

| Node fill | Text color | Character |
|---|---|---|
| `#1F1F1F` | `#EDEDED` | Neutral dark (default) |
| `#10233D` | `#52A8FF` | Blue |
| `#2E1938` | `#BF7AF0` | Purple |
| `#331B00` | `#FF990A` | Orange |
| `#3C1618` | `#FF6166` | Red |
| `#3A1726` | `#F75F8F` | Pink |
| `#0F2E18` | `#62C073` | Green |
| `#062822` | `#0AC7B4` | Teal |

Default node color: `#1F1F1F` with `#EDEDED` text.

## Layout Patterns

- Editor: full-viewport split with
  left sidebar, center canvas, right sidebar
- Sidebars: fixed width with border separator
- Modals: centered overlay with backdrop blur
- Navbar: top bar with bottom border
## Icons

Lucide React. Stroke-based icons only. Sizes:
h-4 w-4 for inline, h-5 w-5 for buttons.

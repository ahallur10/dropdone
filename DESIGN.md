# Dropdone design system

Rules for building any Dropdone UI. All tokens live in `app/globals.css` (Tailwind v4 `@theme`), fonts load from `app/fonts.ts`. Never hardcode a hex value or font size in a component; use the tokens and `type-*` classes.

## Fonts

| Role | Font | Where |
|---|---|---|
| Display and headings | Epilogue | `type-display`, `type-h1` to `type-h4`, `type-stat` |
| Body and UI | Geist | `type-lead`, `type-body`, `type-body-sm`, `type-label`, `type-caption` |
| Labels and data | Geist Mono | `type-eyebrow`, `type-data`, badges |

## Text styles

| Class | Font | Size (mobile to desktop) | Weight | Line height | Tracking | Notes |
|---|---|---|---|---|---|---|
| `type-display` | Epilogue | 44 to 96px | 900 italic | 0.95 | -0.02em | Uppercase. Hero headline only, once per page |
| `type-h1` | Epilogue | 36 to 64px | 800 | 1.05 | -0.025em | Page titles. `<h1>` default |
| `type-h2` | Epilogue | 28 to 44px | 800 | 1.1 | -0.02em | Section titles. `<h2>` default |
| `type-h3` | Epilogue | 22 to 28px | 700 | 1.2 | -0.015em | Card and feature titles. `<h3>` default |
| `type-h4` | Epilogue | 20px | 700 | 1.3 | -0.01em | Small headings. `<h4>` default |
| `type-stat` | Epilogue | 40 to 56px | 900 italic | 1.0 | -0.02em | Big numbers only (time saved, split times) |
| `type-eyebrow` | Geist Mono | 12px | 500 | 1.3 | 0.08em | Uppercase, lime. Sits above section titles |
| `type-lead` | Geist | 18 to 20px | 400 | 1.55 | 0 | Hero and section intros, max 60ch |
| `type-body` | Geist | 16px | 400 | 1.6 | 0 | Paragraphs. `<body>` default |
| `type-body-sm` | Geist | 14px | 400 | 1.5 | 0 | Card descriptions, muted gray |
| `type-label` | Geist | 15px | 500 | 1.2 | 0 | Buttons, nav links, form labels |
| `type-caption` | Geist | 12px | 400 | 1.4 | 0 | Metadata, footnotes. `<small>` default |
| `type-data` | Geist Mono | 14px | 400 | 1.5 | 0 | File names, cell values, code, timers |

## Italic rule

Italic Epilogue appears in exactly two places: the hero headline (`type-display`) and big stat numbers (`type-stat`). Every other heading is upright. Never italicize body text or Geist.

## Color application

| Use | Token | Tailwind class |
|---|---|---|
| Page background | `--color-page` #131416 | `bg-page` |
| Header and bottom fades | `--color-header` #0F1113 | `bg-header` |
| Alternate section band | `--color-section` #18191C | `bg-section` |
| Cards | `--color-surface` #1C1E21 | `bg-surface` |
| Inputs, media placeholders | `--color-surface-strong` #23262A | `bg-surface-strong` |
| Card hover | `--color-surface-hover` #2A2D32 | `bg-surface-hover` |
| Borders | `--color-line-subtle` / `--color-line` / `--color-line-strong` (white 5 / 10 / 20%) | `border-line` |
| Headings | `--color-fg` #FFFFFF | `text-fg` |
| Body | `--color-fg-soft` #F7F7F8 | `text-fg-soft` |
| Supporting copy | `--color-fg-muted` #828282 | `text-fg-muted` |
| Captions, metadata | `--color-fg-subtle` #626262 | `text-fg-subtle` |
| Text on lime or white | `--color-fg-inverse` #1A1A1A | `text-fg-inverse` |
| Brand lime | `--color-brand` #D1FE17 | `bg-brand`, `text-brand` |
| Ghost button fill | `--color-brand-a24` | `bg-brand-a24` |
| Promo badges | `--color-pink` #FF005B | `.badge-pink` |
| Info badges | `--color-blue` #0256FE | `.badge-blue` |
| Success / warning / danger | #2EB844 / #FFBE4C / #FA0019 | `text-success` etc. |

## Rules

1. **One lime CTA per view.** Use `.btn-brand` for the single most important action (Join early access). Secondary actions use `.btn-ghost` or `.btn-primary`.
2. **Lime is the only loud color.** Use it for the CTA, eyebrows, focus rings, one highlighted phrase in a headline, and icons. Never as a section background.
3. **Pink and blue are badges only.** Never large fills, never text color for paragraphs.
4. **Depth comes from surface steps, not shadows.** Page, then surface, then surface-strong. No drop shadows, no glows, no gradients.
5. **Borders are always white at low alpha.** Never a solid gray hex.
6. **Headlines:** one lime phrase max per heading, for example `Show it once. <span class="text-brand">Drop it</span> forever.`
7. **Radius:** buttons and inputs 10px, cards 16px, hero media 20px, badges 6px.
8. **Measure:** paragraphs max 65ch, lead max 60ch.
9. **Contrast:** never put `fg-muted` or `fg-subtle` text on `surface-strong` or lighter; use `fg-soft` there.
10. **Container:** content max width 1240px (`max-w-site mx-auto px-6`).

## Example hero

```tsx
<section className="max-w-site mx-auto px-6 py-24 flex flex-col gap-6">
  <p className="type-eyebrow">For the export you clean every week</p>
  <h1 className="type-display">
    Show it once.<br />
    <span className="text-brand">Drop it</span> forever.
  </h1>
  <p className="type-lead max-w-[60ch] text-fg-muted">
    Drag the messy export onto Dropdone. Your workbook updates itself, wherever it lives.
  </p>
  <div className="flex flex-wrap gap-3">
    <a className="btn-brand" href="#join">Join early access</a>
    <a className="btn-ghost" href="#how">See how it works</a>
  </div>
</section>
```

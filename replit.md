# LeakFix

Revenue recovery SaaS demo for Paystack merchants. Surfaces failed, abandoned, and churned payments so merchants can recover lost revenue.

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5 runes mode)
- **Styling**: Tailwind CSS v4 + component-scoped `<style>` blocks
- **Fonts**: DM Sans 300–800 (headings/CTAs) + Inter (body/UI) via Google Fonts
- **Icons**: Inline SVG (Lucide paths, no runtime dependency)
- **Package manager**: Bun
- **Build tool**: Vite 8

## Design System

- Background: `#f5f2f0` (Cloud Canvas)
- Cards: `#ffffff`, 24px radius, two-layer shadow, hover lift
- Text: `#000000` headings, `#333333` body
- Borders: `#d6d6d6` only
- Primary accent (buttons): `#f1ccff` (Amethyst)
- Insight card: `#91e0ff`, 16px radius, compact `20px 24px` padding
- Max width: 1200px centered
- Section spacing: 32px | Element gaps: 16px
- Nav/filter buttons: 10px radius

## App Flow (5-state machine)

`landing → scanning → results → recovering → recovered`

- **landing**: Hero, stats row (₦2.4B, 18%, <1hr), 3-feature cards, CTA strip, footer
- **scanning**: Animated progress bar, 3 scan steps with live check icons
- **results**: Impact card (total lost in red), rotating insight card, failed/abandoned transaction list with filter tabs
- **recovering**: Recovery animation
- **recovered**: Success state with "View messages" modal (randomised SMS bubbles, 3 of 6 templates per open)

## Project Structure

```
src/
  lib/
    assets/         # favicon.svg
    data/
      transactions.ts   # 18 diverse international mock transactions + formatNaira + lostAmount
  routes/
    layout.css      # Google Fonts @import + Tailwind v4 + global resets
    +layout.svelte  # Root layout with favicon
    +page.svelte    # Entire app (~1600 lines): all 5 views, all styles
```

## Key Data

`src/lib/data/transactions.ts` exports:
- `transactions`: 18 entries — 6 failed, 5 abandoned, 7 success — diverse international names/emails
- `lostAmount`: Sum of all `failed` + `abandoned` transactions
- `formatNaira(amount)`: Formats numbers as `₦1,000,000`

## Notes

- CSS import order in `layout.css`: Google Fonts `@import url(...)` MUST come before `@import 'tailwindcss'`
- HMR console errors about `layout.css` and `favicon.svg` are transient flicker — not real bugs
- Duplicate `.btn-primary` was removed; full-width override lives in `.success-actions .btn-primary`
- `lucide-svelte` is installed but icons are inlined as raw SVG paths to avoid SSR module resolution issues

## Dev Server

Run with: `bun run dev` → http://localhost:5000

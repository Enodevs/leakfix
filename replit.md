# LeakFix

Revenue recovery tool for Paystack merchants. Surfaces failed, abandoned, and churned payments so merchants can recover lost revenue.

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5 runes mode)
- **Styling**: Tailwind CSS v4 + component-scoped `<style>` blocks
- **Fonts**: Playfair Display (headings) + Inter (body/UI) via Google Fonts
- **Package manager**: Bun
- **Build tool**: Vite 8

## Design System

- Background: `#f5f2f0` (Cloud Canvas)
- Cards: `#ffffff`, 24px radius, `0px 8px 16px rgba(0,0,0,0.04)` shadow
- Text: `#000000` headings, `#333333` body
- Borders: `#d6d6d6` only
- Primary accent (buttons): `#f1ccff` (Amethyst)
- Max width: 1200px centered
- Section spacing: 30px | Card padding: 40px | Element gaps: 16px

## Project Structure

```
src/
  lib/
    assets/         # favicon.svg
    data/
      transactions.ts   # Mock transaction data (15 entries) + formatNaira + lostAmount
  routes/
    layout.css      # Tailwind import + Google Fonts + global resets
    +layout.svelte  # Root layout with favicon
    +page.svelte    # Homepage (hero, stats, features, transactions table, CTA, footer)
```

## Key Data

`src/lib/data/transactions.ts` exports:
- `transactions`: Array of 15 mock entries with `id`, `customer_email`, `amount`, `status`
- `lostAmount`: Computed sum of all `failed` + `abandoned` transactions
- `formatNaira(amount)`: Formats numbers as `₦1,000,000`

## Homepage Sections

1. **Sticky navbar** — LeakFix logo (left) + Demo button (right)
2. **Hero** — Headline, subtext, "Scan for leaks" CTA
3. **Stats row** — 3 metric cards ($2.4M recovered, 18% avg, 72hrs)
4. **Features** — 3-card grid (failed charges, abandoned checkouts, subscription churn)
5. **Transactions table** — Filterable by status, shows total lost amount badge
6. **CTA strip** — Bottom conversion section
7. **Footer**

## Dev Server

Run with: `bun run dev` → http://localhost:5000

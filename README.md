# LeakFix

**Revenue recovery for Paystack merchants.**

## The problem

Paystack merchants silently lose 15–20% of revenue to failed payments, abandoned checkouts, and expired cards — with no built-in way to recover it.

## What it does

LeakFix scans your Paystack transaction history, surfaces every failed and abandoned payment, and sends targeted recovery messages to get customers back.

## How to run

```bash
bun install
bun run dev
```

App runs at `http://localhost:5000`

## Demo flow (< 30 seconds)

1. Land on homepage → click **"Scan for leaks"**
2. Watch scan complete → see total amount lost
3. Click **"Recover this money"**
4. See recovery confirmation → click **"View messages"** to see what was sent

## Tech

SvelteKit · Tailwind CSS v4 · TypeScript · Bun

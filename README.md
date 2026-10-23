# Nikah Invitation

A mobile-first, multilingual Muslim wedding invitation built with React, Vite, Tailwind CSS, and Framer Motion.

## Run locally
```bash
npm install
npm run dev
``

## Production build
```bash
npm run build
npm run preview
``

## Customize the invitation
Edit the `wedding` object near the top of `src/App.jsx`:
- `groom`, `bride`, `date` (ISO date-time with timezone)
- `nikah` date, time, venue, address, and `mapUrl`
- optional `walima` and `storyEnabled`

The countdown and calendar export use the configured `date`. RSVP is intentionally not presented as saved: connect a secure backend (for example Firebase) before collecting guest responses. Do not expose guest responses publicly.

## Deploy
Import this GitHub repository into Vercel. Vercel detects Vite automatically; build command is `npm run build` and output directory is `dist`.

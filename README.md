# Nikah Invitation

An elegant, frontend-only Muslim wedding invitation built with React, Vite, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Customize the invitation

Edit `src/data/weddingDetails.js` to set the couple's names, date, venue, hosts, RSVP number, map query, and optional walima section. Calendar, location, and WhatsApp actions remain disabled until their required details are configured.

## Deploy

Import this repository into Vercel. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.

The envelope artwork is recreated using independent SVG/CSS relief elements so each door can rotate separately. No backend or database is required.
# Nay Pyi Taw “San” Private High School Website

A responsive Next.js + TypeScript + Tailwind informational school website. No student registration, login, backend, or database.

## Included sections
- Home and Grade 5–12 academic programs
- Student achievement cards with animated profile modals (currently DEMO / SAMPLE data — 4 fictional students)
- School activities: Teachers’ Appreciation, Sports Competition, Prize-Giving, Student Activity Day
- Facilities: library, clean washrooms, classrooms, campus
- Sports: Chinlone, Football/Futsal, Volleyball
- School bus transportation sample routes
- Photo highlights/gallery
- Contact phone/email and framed Google Maps embed
- Myanmar/English language toggle
- Light mode / night mode

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Preview the production build
The project uses `output: 'export'`, so the generated site in `out/` must be served over HTTP — do **not** double-click `out/index.html`. Browsers block its CSS and JavaScript from a `file://` URL, which makes the page look broken and disables card clicks.

```bash
npm run build
npm run preview
```
Open http://localhost:4173 (or the URL printed in the terminal). `npm start` runs the same preview server.

## Student achievements demo data

The achievement cards and profile modals currently use **DEMO / SAMPLE DATA**:

- `content/achievements-demo.json` — 4 fictional demo students, marked `DEMO_SAMPLE_DATA`. This file powers the demo.
- `content/achievements.json` — separate placeholder/real-records file, untouched by the demo.
- `src/lib/achievements.ts` — single switch (`USE_DEMO_DATA`) that selects which file is displayed.

To publish real, approved records:

1. Add `subjectsMY` and `subjectsEN` arrays (one entry per distinction subject) to each record in `content/achievements.json`.
2. Set `USE_DEMO_DATA = false` in `src/lib/achievements.ts`.
3. The visible DEMO notices disappear automatically once `IS_DEMO_DATA` is false.

Demo profiles are fictional and must not be presented as verified school achievements.

## Replace sample content
Edit JSON files in `content/`:
- `site.json` — school name, location, introduction
- `programs.json` — Grade 5–12 program descriptions and photos
- `achievements-demo.json` — demo student profiles (replace via the steps above)
- `achievements.json` — approved student records used when demo mode is off
- `events.json` — activities and event photo URLs
- `facilities.json` — library, washrooms, classrooms, campus
- `sports.json` — chinlone, football/futsal, volleyball
- `transport.json` — bus service/routes
- `contact.json` — phone, email, address, Google Maps embed/direct link

All photos currently use sample image URLs. Replace them with school-owned/authorized photographs before publishing. Confirm student/guardian permission before publishing student names or photos.

## Deploy to Vercel
Push the project to GitHub, import that repository in Vercel, and deploy. Future GitHub commits will automatically redeploy to the same production URL.

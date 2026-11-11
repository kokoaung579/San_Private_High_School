# Fixed San Private High School Website

## What was fixed
- Added the missing `postcss.config.js` so Tailwind CSS is processed by Next.js.
- Replaced CSS package `@import` statements with standard Tailwind `@tailwind` directives.
- Added smooth scrolling and top-navigation offset so section links are not hidden behind sticky navigation.

## Run locally
1. Install Node.js 18.17+ (Node 20 LTS recommended).
2. Open this project folder in a terminal.
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

For production validation: `npm run build` then `npm start`.

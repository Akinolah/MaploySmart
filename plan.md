# MAPolyGo Redesign Plan

## Product scope

Rebuild the public MAPolyGo campus-navigation experience as a polished, production-ready web app for Moshood Abiola Polytechnic, Abeokuta. Preserve the recognizable campus-navigation job while making route planning, wayfinding, search, place discovery, and help content dramatically easier to use. The first release is a responsive frontend prototype with realistic local campus data and clear states for future map, location, AI, and backend integrations.

## Design direction

- **Design movement:** Editorial wayfinding utility with soft neo-brutalist details: confident typographic hierarchy, tactile cards, visible state changes, and a calm map-first workspace.
- **Core principles:** (1) orient before asking, (2) progressive disclosure, (3) every destination is actionable, (4) reassure users with distance/time/status context.
- **Color philosophy:** Deep ink/navy anchors trust and legibility; MAPolyGo teal is the ownable signal for action and location; warm paper and pale mint surfaces make the campus feel human rather than clinical; coral is reserved for alerts and route exceptions.
- **Layout paradigm:** A split “wayfinding desk” layout on desktop: persistent sidebar/navigation rail, a generous content canvas, and a map surface that acts like a working table. Mobile collapses into a bottom navigation bar and stacked route cards.
- **Signature elements:** (1) teal location-pin mark with a cut-out path, (2) dotted route line motif, (3) compact “signal chips” for open-now, distance, accessibility, and current-location state.
- **Interaction philosophy:** Make the next action obvious, show a helpful empty state instead of a blank one, use reversible controls (swap, reset, close), and keep the selected place visible while the user explores.
- **Animation:** Use 150–220ms ease-out transitions for cards, chips, panels, and route changes; use a soft pulse on current location; keep map markers static unless selected; respect `prefers-reduced-motion`.
- **Typography system:** `Space Grotesk` for display and section headings, `DM Sans` for body/UI text. Tight display headlines, 14–16px body copy, 12px uppercase utility labels with generous tracking.
- **Brand essence:** “The campus compass for every MAPoly arrival.” Personality: **clear, grounded, encouraging**.
- **Brand voice:** Short, reassuring, specific. Example lines: “Start with where you are.” / “You’re close — follow the teal line past the Science Complex.”
- **Wordmark & logo:** A rounded square teal badge containing a simplified pin/path glyph, paired with a compact MAPolyGo wordmark; use the mark in the app shell, mobile nav, and empty states.
- **Signature brand color:** MAPolyGo teal `#0B8F83`.

## Information architecture

- `/` — Home/orientation: search, quick route, popular destinations, first-time helper.
- `/explore` — Campus directory with category filters, search, and place cards.
- `/navigate` — Route planner with from/to selectors, current-location state, map, route summary, and route options.
- `/directions` — Step-by-step walking route with progress, maneuvers, reverse/reset actions.
- `/place/:id` — Place detail view with description, service hours, accessibility notes, image, and actions.
- `/gallery` — Categorized campus gallery with full-screen/lightbox state.
- `/guide` — AI campus guide with suggested prompts and clear scope note.
- `/resources` — Visitor help, directory, accessibility, map legend, FAQs, and emergency/contact information.

## Implementation approach

- Use a small Vite + React + TypeScript application with client-side hash routing so every page is directly addressable in Preview without a server.
- Keep campus content in typed local data modules so UI behavior is realistic and future API/database swaps are straightforward.
- Build reusable primitives for shell, buttons, chips, place cards, map surface, route cards, and empty/loading/status states.
- Use an inline SVG icon set based on familiar line-icon metaphors to avoid icon-font loading and keep rendering crisp.
- Use CSS custom properties for the design system, CSS grid/flex for responsive layout, and media queries for mobile/tablet/desktop behavior.
- Model current-location and route-planning interactions locally: selecting “Your location” updates the source state, route planning produces a representative route summary, and directions render contextual walking steps.
- Do not claim live GPS, production map routing, or a live AI model in this frontend-only build; label those future integrations honestly in the UI.

## Project structure

- `index.html` — document shell and Google font preconnects.
- `package.json`, `tsconfig.json`, `vite.config.ts` — Vite/React toolchain.
- `public/manus-routes.json` — complete route manifest for the managed preview.
- `src/main.tsx` — React entry point.
- `src/data.ts` — typed campus places, route steps, gallery content, categories, and FAQs.
- `src/icons.tsx` — small inline SVG icon library.
- `src/components.tsx` — reusable app shell and UI primitives.
- `src/App.tsx` — hash router, page composition, and product interactions.
- `src/styles.css` — responsive visual system and page-level styling.
- `app.config.ts` — durable project logo metadata.
- `plan.md` and `TODO.md` — approved plan and outcome tracking.

## Dependencies and serving

- Runtime dependencies: React, React DOM, and Lucide React for accessible, consistent icons.
- Dev dependencies: Vite, TypeScript, and the React TypeScript plugin.
- Preview runs on the managed runtime port `3000` and binds to `0.0.0.0`.
- The project remains frontend-only for this iteration; managed server/database capabilities are not enabled.
- Static build output is `dist`; the configured build command installs and builds from a clean checkpoint.

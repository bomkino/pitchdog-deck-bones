# Contributing

Useful contributions make Deck Bones a sharper, safer, more truthful Film and TV planner.

## Before coding

Use the tool for a real scripted feature or series. Name the route, recipient, stage, and wrong or missing plan behavior. Open an issue before adding a new question group or changing a section rule.

## Local setup

```bash
git clone https://github.com/bomkino/pitchdog-deck-bones.git
cd pitchdog-deck-bones
npm install
npm run verify
```

Use Node.js 22.18 or newer.

## Product rules

- Keep Deck Bones Film and TV only.
- Preserve the fast route; expert depth requires explicit consent.
- Use finite, bold choices. Do not add prose boxes unless a future engine can demonstrably use the text.
- Put visible choices in `src/content.ts` and deterministic plan rules in `src/plan.ts`.
- Distinguish a current requirement from a convention, and a prerequisite from a deck section.
- Never invent legal, finance, rights, access, audience, or market claims.
- Add a focused test for every changed rule.
- Keep state local. Do not add runtime AI, analytics, accounts, remote fonts, or an email gate.
- Preserve keyboard, touch, screen-reader, system-theme, reduced-motion, and question-to-top behavior.
- No noise overlays or decorative motion without a product reason.

## Pull requests

Include the user problem, decision, affected decision-tree branches, screenshots for visible work, tests, `npm run verify` output, and privacy/accessibility/licensing effects.

Contributions use AGPL-3.0-or-later for software and documentation; CC BY-SA 4.0 for original visual assets.

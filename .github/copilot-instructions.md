# Copilot Instructions

## Architecture & Framework
- **Next.js App Router**: Build exclusively using the Next.js App Router under `app/` (Server Components, Route Handlers, Client Components where interactivity is needed).
- **TypeScript**: Strict TypeScript everywhere; keep domain types aligned in `types/` and model definitions in `models/`.

## Styling & Design System
- **Tailwind CSS Neobrutalism**: Use the project's custom brutalist utility classes defined in `app/globals.css`:
  - `brut`: 3px solid ink border with rounded corners.
  - `shadow-brut`, `shadow-brut-lg`, `shadow-brut-none`: Solid ink drop shadows.
  - `press`, `lift`: Interactive micro-animations for buttons and cards.
  - Semantic theme color tokens: `surface`, `ink`, `paper`, `primary`, `secondary`, `success`, `warning`, `danger`.
- **No Icon Libraries**: Do not install or import external icon libraries (e.g., `lucide-react`, `heroicons`). Implement all custom stroked SVG icons in `components/icons.tsx`.

## Data & Backend Security
- **Mongoose Models**: Define schemas under `models/` with timestamping and Mongoose validation.
- **Per-User Data Isolation**: Every database read, write, update, and delete operation MUST be strictly scoped to the authenticated user ID (`user: session.userId`). Never perform unscoped queries.
- **Input Validation**: Centralize route input validation in `lib/validation.ts` before database execution.

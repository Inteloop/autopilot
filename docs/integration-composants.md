# Integration composants front

## Analyse de structure

Le projet supporte la structure demandee :

- React avec TypeScript.
- Tailwind CSS configure dans `tailwind.config.ts`.
- Structure shadcn via `components.json`.
- Composants UI dans `src/components/ui`.

Le chemin `/components/ui` mentionne dans le brief correspond ici a l'alias shadcn `@/components/ui`, qui pointe vers `src/components/ui`. Dans un projet Vite, conserver les composants sous `src/` permet a TypeScript, Vite et Tailwind de les analyser directement.

## Dependances utilisees

- `react`, `react-dom`
- `vite`, `@vitejs/plugin-react`
- `typescript`
- `tailwindcss`, `postcss`, `autoprefixer`
- `lucide-react`
- `clsx`, `tailwind-merge`

## Composants ajoutes

- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/splite.tsx`
- `src/components/ui/spotlight.tsx`
- `src/components/ui/cursor-spotlight.tsx`
- `src/components/ui/demo.tsx`

## Integration Spline

Le composant fourni a ete integre dans `src/components/ui/splite.tsx`, en conservant le nom demande. Le projet utilise l'alias shadcn `@/components/ui`, donc l'import reste compatible avec `@/components/ui/splite`.

Dependances ajoutees avec Bun :

- `@splinetool/runtime`
- `@splinetool/react-spline`
- `framer-motion`

La demo `SplineSceneBasic` est affichee dans le panneau lateral de l'application. Aucun provider React supplementaire n'est requis : `SplineScene` utilise `React.lazy` et `Suspense`, et `CursorSpotlight` gere son etat localement.

## Props et etat

Le composant principal `App` gere :

- `apiKey` et `apiKeyDraft` pour la cle Groq stockee en localStorage.
- `messages` pour l'historique de chat.
- `isTyping` pour l'indicateur de frappe.
- `selectedVehicle` pour afficher une fiche vehicule.
- `appointmentOpen` pour ouvrir le formulaire RDV.

## Questions traitees

- Donnees passees : base de connaissances `knowledge.json`, messages utilisateur, cle Groq.
- Etat : React local state suffit pour le MVP.
- Assets : images Unsplash pour les vehicules et le showroom.
- Responsive : grille desktop chat + panneau lateral, empilement mobile.
- Emplacement : composant integre directement dans `src/App.tsx` car l'application MVP tient sur un ecran principal.

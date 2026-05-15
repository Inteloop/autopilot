# Auto Assist

MVP de chatbot SAV et vente pour un concessionnaire automobile a Abidjan.

## Stack

- React + TypeScript avec Vite
- Tailwind CSS
- Structure compatible shadcn avec composants dans `src/components/ui`
- Groq Chat Completions via `https://api.groq.com/openai/v1/chat/completions`
- Base de connaissances locale dans `src/data/knowledge.json`

## Lancer le projet

```bash
bun install
bun run dev
```

Au premier lancement, collez une cle Groq dans le champ de configuration. Elle est stockee dans `localStorage` pour ce MVP. Si aucune cle n'est fournie ou si l'appel echoue, le chatbot bascule sur un mode demo local base sur `knowledge.json`.

## Fonctionnalites MVP

- Chat en francais avec bulles utilisateur/bot et indicateur de frappe.
- Historique conversationnel limite aux 10 derniers messages pour l'appel LLM.
- Reponses basees sur le catalogue, les tarifs SAV, la FAQ et les infos pratiques.
- Actions intelligentes : rendez-vous, fiche vehicule, conseiller WhatsApp.
- Scenarios de demo et decisions en Markdown dans `docs/`.

## Notes shadcn

Le chemin par defaut des composants UI est `src/components/ui`, mappe par `components.json` sur l'alias `@/components/ui`. C'est important pour garder les imports compatibles avec les composants shadcn et eviter de disperser les primitives UI dans l'application.

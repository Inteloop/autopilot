# Equipe agents Auto Assist

## Repartition des roles

| Role | Agent | Responsabilites |
| --- | --- | --- |
| Time Keeper | Codex principal | Surveille le rythme 60 minutes, maintient les etapes et signale les priorites. |
| Scribe | Agent Scribe | Note les prompts, decisions techniques, bugs et risques dans `docs/`. |
| Architecte | Codex principal | Valide la structure React/TypeScript/Tailwind, le prompt systeme et le contrat JSON. |
| Developpeur 1 | Codex principal | Implemente l'app, l'UI, la logique Groq et les actions intelligentes. |
| Developpeur 2 | Codex principal | Integre les composants UI, fallback local, corrections TypeScript et verification build. |
| Demo Lead | Agent Demo Lead | Prepare les scenarios de demonstration et criteres de verification. |

## Cadence MVP

1. 10 min : setup repo, Tailwind, shadcn-like, base de connaissances.
2. 10 min : interface de chat.
3. 10 min : appel Groq et prompt systeme.
4. 10 min : historique conversationnel limite.
5. 10 min : actions intelligentes.
6. 10 min : verification, demo, documentation.

## Definition de pret pour la demo

- L'app demarre localement.
- Le chatbot fonctionne en mode Groq avec cle ou en mode secours local.
- Les 6 scenarios de demo ont une reponse attendue.
- Le dossier `docs/` contient les prompts, decisions, risques et scenarios.

# Bugs et risques

## Vue d'ensemble

Le MVP Auto Assist touche a des decisions potentiellement couteuses ou liees a la securite. Les risques principaux concernent les conseils trop affirmatifs, les donnees manquantes et les attentes utilisateur.

## Risques prioritaires

| Risque | Impact | Probabilite | Mitigation MVP |
| --- | --- | --- | --- |
| Diagnostic trop certain | Eleve | Moyenne | Forcer hypotheses, limites et conseil professionnel. |
| Conseil dangereux en cas de freinage/direction | Eleve | Faible a moyenne | Regles d'urgence explicites et tests dedies. |
| Reponse trop generique | Moyen | Elevee | Sortie structuree et questions de clarification. |
| Informations vehicule insuffisantes | Moyen | Elevee | Demander marque, modele, annee, kilometrage quand utile. |
| Hallucination de prix ou disponibilite | Moyen | Moyenne | Marquer les chiffres comme estimations ou ne pas en donner sans source. |
| Experience trop longue | Moyen | Moyenne | Limiter a trois questions avant recommandation provisoire. |
| Mauvaise interpretation budget/usage | Moyen | Moyenne | Reformulation initiale et confirmation des contraintes. |
| Donnees personnelles en clair | Moyen | Faible | Eviter de demander plaques, VIN, adresse precise en MVP. |

## Bugs probables a surveiller

- L'assistant pose trop de questions et retarde la valeur.
- L'assistant donne une liste de causes sans prioriser l'urgence.
- L'assistant oublie l'alternative ou la prochaine action.
- L'assistant confond symptome critique et entretien courant.
- L'assistant propose des modeles de vehicules sans tenir compte du budget.
- L'assistant utilise un ton trop confiant sur des sujets incertains.

## Signaux rouges produit

- L'utilisateur pense que la reponse vaut diagnostic officiel.
- L'utilisateur ne sait pas quoi faire apres la reponse.
- Le parcours de demo depend d'un seul exemple qui marche bien.
- Les retours equipe portent surtout sur le style, pas sur la decision obtenue.
- Les limites sont cachees en fin de texte et peu visibles.

## Matrice d'urgence automobile

| Situation | Niveau MVP | Reponse attendue |
| --- | --- | --- |
| Freins mous, bruit metallique fort au freinage | Eleve | Ne pas continuer a rouler, verifier par professionnel. |
| Direction dure, instable ou voyant direction | Eleve | S'arreter prudemment, assistance si necessaire. |
| Fumee, odeur de brule, surchauffe | Eleve | Couper le moteur si securise, ne pas ignorer. |
| Voyant moteur fixe sans symptome | Moyen | Verification rapide, conduite prudente selon manuel. |
| Entretien en retard sans symptome | Moyen | Planifier controle, prioriser elements de securite. |
| Achat ou optimisation budget | Faible | Clarifier usage, comparer options et compromis. |

## Plan de reduction des risques

1. Tester chaque prompt critique avant demo.
2. Ajouter un controle manuel des reponses dangereuses.
3. Collecter les cas ou l'assistant manque d'informations.
4. Reviser le prompt systeme apres chaque session de feedback.
5. Documenter les limites visibles dans l'interface.

# Decisions techniques

## Principes MVP

- Construire un parcours simple avant d'optimiser l'automatisation.
- Conserver les traces de decisions et d'hypotheses pour faciliter les retours d'equipe.
- Preferer des integrations remplacables a des couplages forts.
- Traiter la securite automobile comme une zone a risque: prudence, limites explicites, escalade vers un professionnel.

## Decisions proposees

| Sujet | Decision MVP | Pourquoi | Statut |
| --- | --- | --- | --- |
| Parcours principal | Conversation guidee avec sortie structuree | Rapide a tester, facile a evaluer | Propose |
| Sortie assistant | Resume, urgence, recommandation, alternative, limites | Rend les reponses comparables | Propose |
| Gestion incertitude | Afficher hypotheses et informations manquantes | Evite les diagnostics trop affirmatifs | Propose |
| Donnees vehicule | Champs libres au debut, normalisation plus tard | Reduit le cout d'entree MVP | Propose |
| Historique | Journaliser prompts, reponses et feedback de demo | Permet d'ameliorer les prompts | Propose |
| Securite | Regles explicites pour freins, direction, fumee, voyant critique | Reduit le risque utilisateur | Propose |

## Architecture cible legere

```text
Interface MVP
  -> Collecte contexte utilisateur
  -> Prompt orchestration
  -> Modele assistant
  -> Reponse structuree
  -> Journal de feedback
```

## Donnees minimales a collecter

- Type de besoin: achat, panne, entretien, cout, assurance, autre.
- Vehicule: marque, modele, annee, kilometrage, motorisation si connue.
- Contexte: usage, delai, budget, localisation ou contraintes.
- Signaux de risque: voyant, bruit, odeur, fumee, freinage, direction, temperature.
- Feedback: utile, incomplet, trop long, trop prudent, dangereux, autre.

## Choix a trancher apres demo

- Interface: chat pur ou formulaire hybride.
- Niveau de personnalisation par pays, reglementation et marche local.
- Source de donnees pour prix, disponibilite, rappels constructeur et cout d'entretien.
- Niveau de journalisation acceptable pour la confidentialite.
- Seuils d'escalade vers humain ou professionnel.

## Non-objectifs MVP

- Diagnostic mecanique certain.
- Estimation de prix temps reel.
- Couverture exhaustive des modeles et motorisations.
- Remplacement d'un garage, expert assurance ou controle technique.
- Automatisation de prise de rendez-vous sans validation utilisateur.

## Criteres d'acceptation

- Le parcours fonctionne sur les cinq jeux de test prioritaires.
- Les reponses critiques contiennent une recommandation de prudence claire.
- Les prompts peuvent etre modifies sans redeployer toute l'application.
- Chaque reponse expose au moins une action concrete.
- Les retours de demo peuvent etre rattaches au scenario teste.

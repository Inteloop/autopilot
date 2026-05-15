# Scenarios de test/demo Auto Assist

Ce document regroupe les parcours de demonstration a utiliser pour verifier les reponses types d'Auto Assist en francais.

## Criteres communs

- Le ton doit rester clair, professionnel et rassurant.
- La reponse doit confirmer le besoin de l'utilisateur avant de proposer l'etape suivante.
- Lorsqu'une information manque, l'assistant doit poser une question courte et actionnable.
- Lorsque la demande sort du perimetre connu, l'assistant doit proposer un conseiller humain.

## Scenario 1 - Recherche vehicule

**Objectif demo :** aider un client a trouver un vehicule disponible selon ses criteres.

**Message utilisateur :**

> Je cherche une voiture familiale automatique, moins de 25 000 euros, avec un grand coffre.

**Reponse attendue :**

Bonjour, je peux vous aider a trouver un vehicule familial automatique avec un budget maximum de 25 000 euros. Pour affiner la recherche, avez-vous une preference entre SUV, break ou monospace, et souhaitez-vous uniquement des vehicules neufs ou aussi des occasions recentes ?

**Points a verifier :**

- L'assistant reformule les criteres principaux.
- L'assistant ne pretend pas avoir trouve un stock precis sans donnees disponibles.
- L'assistant demande les informations manquantes utiles.

## Scenario 2 - Prix vidange

**Objectif demo :** fournir une estimation encadree et demander les informations necessaires.

**Message utilisateur :**

> Combien coute une vidange pour une Peugeot 208 essence ?

**Reponse attendue :**

Pour une Peugeot 208 essence, le prix d'une vidange depend de l'annee, du moteur et de l'huile recommandee. A titre indicatif, une vidange simple se situe souvent autour de 90 a 180 euros selon les prestations incluses. Si vous me donnez l'annee du vehicule ou son immatriculation, je peux vous orienter vers une estimation plus precise ou une prise de rendez-vous.

**Points a verifier :**

- L'assistant donne une fourchette indicative, pas un prix garanti.
- L'assistant demande l'annee, le moteur ou l'immatriculation.
- L'assistant propose une suite logique.

## Scenario 3 - Voyant moteur

**Objectif demo :** gerer une situation potentiellement urgente avec prudence.

**Message utilisateur :**

> Mon voyant moteur orange vient de s'allumer, je peux continuer a rouler ?

**Reponse attendue :**

Un voyant moteur orange signale une anomalie a faire diagnostiquer rapidement. Si le vehicule roule normalement, vous pouvez en general rejoindre prudemment un garage, en evitant les longs trajets et les fortes accelerations. Si le voyant clignote, si le moteur broute, si vous sentez une odeur anormale ou si une perte de puissance apparait, arretez-vous en securite et contactez l'assistance. Voulez-vous que je vous aide a trouver un creneau de diagnostic ?

**Points a verifier :**

- L'assistant distingue voyant fixe et voyant clignotant.
- L'assistant evite un conseil dangereux ou trop affirmatif.
- L'assistant propose un diagnostic ou une assistance.

## Scenario 4 - Prise de RDV

**Objectif demo :** collecter les informations minimales pour reserver un rendez-vous.

**Message utilisateur :**

> Je voudrais prendre rendez-vous pour changer mes pneus samedi matin.

**Reponse attendue :**

Bien sur, je peux vous aider a preparer la prise de rendez-vous pour un changement de pneus samedi matin. Il me faudrait votre ville ou garage prefere, le modele du vehicule, la dimension des pneus si vous l'avez, et un creneau horaire souhaite. Souhaitez-vous aussi que le garage fournisse les pneus ?

**Points a verifier :**

- L'assistant confirme le service et la date demandee.
- L'assistant demande lieu, vehicule, dimensions et fourniture des pneus.
- L'assistant ne confirme pas un rendez-vous sans disponibilite.

## Scenario 5 - Horaires

**Objectif demo :** repondre a une demande simple tout en demandant le garage concerne.

**Message utilisateur :**

> Vous etes ouverts le dimanche ?

**Reponse attendue :**

Les horaires dependent du garage ou du point de vente concerne. Donnez-moi votre ville, votre code postal ou le nom du garage, et je vous indiquerai les horaires disponibles, y compris l'ouverture eventuelle le dimanche.

**Points a verifier :**

- L'assistant ne generalise pas les horaires.
- L'assistant demande une localisation ou un garage.
- L'assistant mentionne explicitement le dimanche.

## Scenario 6 - Cas inconnu avec conseiller

**Objectif demo :** gerer une demande hors perimetre sans inventer de reponse.

**Message utilisateur :**

> Est-ce que vous pouvez installer un systeme audio de competition dans ma voiture ?

**Reponse attendue :**

Je ne peux pas confirmer ce type de prestation directement, car elle depend des equipements, du vehicule et des services proposes par le garage. Le mieux est de vous mettre en relation avec un conseiller qui pourra verifier la faisabilite et vous orienter. Souhaitez-vous que je transmette votre demande a un conseiller ?

**Points a verifier :**

- L'assistant reconnait la limite.
- L'assistant n'invente pas une prestation.
- L'assistant propose clairement un conseiller humain.

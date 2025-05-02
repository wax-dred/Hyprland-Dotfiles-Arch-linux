# Guide des Raccourcis Neovim

## Modes de Base

- `i` : Passer en mode insertion (pour écrire du texte)
- `Esc` ou `Ctrl+[` : Retourner en mode normal
- `v` : Passer en mode visuel (pour sélectionner du texte)
- `:` : Passer en mode commande

## Déplacements de Base

- `h` : Gauche
- `j` : Bas
- `k` : Haut
- `l` : Droite
- `w` : Mot suivant
- `b` : Mot précédent
- `0` : Début de ligne
- `$` : Fin de ligne
- `gg` : Début du fichier
- `G` : Fin du fichier

## Édition

- `x` : Supprimer le caractère sous le curseur
- `dd` : Supprimer la ligne entière
- `yy` : Copier la ligne entière
- `p` : Coller après le curseur
- `P` : Coller avant le curseur
- `u` : Annuler
- `Ctrl+r` : Rétablir
- `o` : Insérer une nouvelle ligne en dessous
- `O` : Insérer une nouvelle ligne au-dessus

## Recherche et Remplacement

- `/motif` : Rechercher vers l'avant
- `?motif` : Rechercher vers l'arrière
- `n` : Occurrence suivante
- `N` : Occurrence précédente
- `:%s/ancien/nouveau/g` : Remplacer toutes les occurrences

## Manipulation des Fenêtres

- `:sp` : Diviser horizontalement
- `:vsp` : Diviser verticalement
- `Ctrl+w h/j/k/l` : Naviguer entre les fenêtres
- `:q` : Fermer la fenêtre
- `:wq` : Sauvegarder et fermer
- `:w` : Sauvegarder

## Commandes Avancées

- `ci"` : Changer le texte entre guillemets
- `di(` : Supprimer le texte entre parenthèses
- `>>` : Indenter la ligne
- `<<` : Désindenter la ligne
- `.` : Répéter la dernière commande
- `ZZ` : Sauvegarder et quitter
- `ZQ` : Quitter sans sauvegarder

## Marques et Sauts

- `m[a-z]` : Définir une marque locale
- `'[a-z]` : Aller à une marque
- `Ctrl+o` : Retourner à la position précédente
- `Ctrl+i` : Aller à la position suivante

## Macros

- `q[a-z]` : Commencer l'enregistrement d'une macro
- `q` : Arrêter l'enregistrement
- `@[a-z]` : Exécuter une macro
- `@@` : Répéter la dernière macro

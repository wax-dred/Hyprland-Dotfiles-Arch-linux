#!/bin/bash

# Répertoire source des scripts
SOURCE_DIR="/home/florian/.config/hypr/scripts/Gamescope"

# Répertoire de destination dans le PATH
DEST_DIR="/usr/local/bin"

# Vérifier si le répertoire source existe
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Erreur : Le répertoire source $SOURCE_DIR n'existe pas."
    exit 1
fi

# Compteur de scripts ajoutés
SCRIPT_COUNT=0

# Boucle sur tous les fichiers du répertoire
for script in "$SOURCE_DIR"/*; do
    # Vérifier si c'est un fichier exécutable
    if [ -x "$script" ] && [ -f "$script" ]; then
        # Extraire le nom du script
        SCRIPT_NAME=$(basename "$script")
        
        # Créer un lien symbolique
        sudo ln -sf "$script" "$DEST_DIR/$SCRIPT_NAME"
        
        echo "Ajout du script : $SCRIPT_NAME"
        ((SCRIPT_COUNT++))
    fi
done

echo "Total de scripts ajoutés : $SCRIPT_COUNT"
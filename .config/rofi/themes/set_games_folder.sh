#!/bin/bash

# Fichier de configuration de rofi-games
CONFIG_FILE="$HOME/.config/rofi-games/config.toml"

# Ouvre une boîte de dialogue pour demander le chemin des jeux
new_folder=$(zenity --file-selection --directory --title="Choisissez le dossier des jeux")

# Vérifie si l'utilisateur a sélectionné un dossier
if [[ -n "$new_folder" ]]; then
    # Modifie ou ajoute le chemin dans le fichier de configuration
    if grep -q "games_folder" "$CONFIG_FILE"; then
        sed -i "s|^games_folder = .*|games_folder = \"$new_folder\"|" "$CONFIG_FILE"
    else
        echo "games_folder = \"$new_folder\"" >> "$CONFIG_FILE"
    fi
    notify-send "Rofi Games" "Chemin des jeux mis à jour : $new_folder"
else
    notify-send "Rofi Games" "Aucun dossier sélectionné."
fi

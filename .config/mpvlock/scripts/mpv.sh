#!/bin/bash

# Dossier contenant les vidéos
video_dir="$HOME/Pictures/wallpapers/Video"

# Fichier de config à modifier (change ça selon l’endroit réel)
config_file="$HOME/.config/mpvlock/mpvlock.conf"

# Choisir un .mp4 aléatoire
random_video=$(find "$video_dir" -type f -name "*.mp4" | shuf -n 1)

# Échapper les caractères spéciaux pour sed
escaped_video=$(printf '%s\n' "$random_video" | sed -e 's/[\/&]/\\&/g')

# Modifier le champ "path" dans la section background
sed -i -E "s|^( *path *= *).*$|\1$escaped_video|" "$config_file"

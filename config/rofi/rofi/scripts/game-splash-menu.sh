#!/usr/bin/env bash
SCRIPTSDIR="$HOME/.config/hypr/scripts"
# Change to the script's directory
cd "$(dirname "$(realpath "$0")")"

# Configuration
HEIGHT=360  # This should match height in game-splash-menu.rasi
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
BANNER_SCRIPT="$SCRIPT_DIR/update-game-banner.sh"

# Icônes pour le menu
PLAY=""
LIBRARY=""
ACHIEVEMENTS=""
NEWS=""
BACK=""

# Fonction pour obtenir les informations d'affichage via Hyprland
get-hyprland-monitor-info() {
    local json_output
    if command -v hyprctl >/dev/null 2>&1; then
        json_output=$(hyprctl monitors -j)
        echo "$json_output"
    else
        echo "Erreur: hyprctl non trouvé"
        exit 1
    fi
}

# Fonction pour obtenir la largeur de l'écran avec Hyprland
get-display-width() {
    local monitor_info=$(get-hyprland-monitor-info)
    echo "$monitor_info" | jq -r '.[0].width'
}

# Fonction pour obtenir le facteur d'échelle avec Hyprland
get-scale-factor() {
    local monitor_info=$(get-hyprland-monitor-info)
    echo "$monitor_info" | jq -r '.[0].scale' || echo "1"
}

# Configuration de l'environnement pour Hyprland
setup-hyprland-environment() {
    local scale_factor=$(get-scale-factor)
    
    # Configuration des variables d'environnement
    export XCURSOR_SIZE=24
    export GDK_SCALE=$scale_factor
    export QT_AUTO_SCREEN_SCALE_FACTOR=1
    
    # Créer le dossier de configuration Rofi si nécessaire
    local config_dir="$HOME/.config/rofi"
    mkdir -p "$config_dir"
    
    # Générer la configuration Rofi adaptée à Hyprland
    cat > "$config_dir/config.rasi" << EOF
configuration {
    font: "JetBrainsMono Nerd Font 12";
    dpi: $(echo "scale=0; 96 * $scale_factor/1" | bc);
    monitor: -1;
}

* {
    scaling-factor: $scale_factor;
}
EOF
}

# Vérification que l'APPID est fourni
if [ -z "$1" ]; then
    echo "Erreur: APPID requis"
    echo "Usage: $0 <APPID>"
    exit 1
fi

APPID="$1"

# Configuration de l'environnement Hyprland
setup-hyprland-environment

# Récupération de la largeur de l'écran
DISPLAY_WIDTH=$(get-display-width)
if [ -z "$DISPLAY_WIDTH" ]; then
    echo "Erreur: Impossible de récupérer la largeur de l'écran"
    exit 1
fi

# Vérification que le script de bannière existe
if [ ! -f "$BANNER_SCRIPT" ]; then
    echo "Erreur: Script de bannière non trouvé : $BANNER_SCRIPT"
    exit 1
fi

# Génération de la bannière avec tous les paramètres requis
# Ajustement de la largeur en fonction du facteur d'échelle
SCALE_FACTOR=$(get-scale-factor)
ADJUSTED_WIDTH=$(echo "scale=0; $DISPLAY_WIDTH * $SCALE_FACTOR/1" | bc)

"$BANNER_SCRIPT" \
    -a "$APPID" \
    -w "$ADJUSTED_WIDTH" \
    -h "$HEIGHT" \
    -b 200 \
    -f

# En cas d'erreur lors de la génération de la bannière
if [ $? -ne 0 ]; then
    echo "Erreur lors de la génération de la bannière"
    exit 1
fi

# Fonction pour lister les options du menu
list-icons() {
    echo "$PLAY Play"
    echo "$LIBRARY Open in library"
    echo "$ACHIEVEMENTS Achievements"
    echo "$NEWS News"
    echo "$BACK Back"
}

# Fonction pour gérer les actions du menu
handle-option() {
    case "$1" in
        "$PLAY Play")
            steam "steam://rungameid/$APPID"
            ;;
        "$LIBRARY Open in library")
            steam "steam://nav/games/details/$APPID"
            ;;
        "$ACHIEVEMENTS Achievements")
            steam "steam://url/SteamIDAchievementsPage/$APPID"
            ;;
        "$NEWS News")
            steam "steam://appnews/$APPID"
            ;;
        "$BACK Back")
            ./rofi-wrapper.sh games
            ;;
    esac
}

# Affichage du menu avec Rofi
SELECTION=$(list-icons | rofi -dmenu -theme game-splash-menu)
handle-option "$SELECTION" &
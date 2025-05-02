#!/bin/bash

# Commande Rofi
rofi_command="rofi -i -show -dmenu -config ~/.config/rofi/config-perf.rasi"
notif="$HOME/.config/swaync/images/hypr.png"
# Fonction Menu
menu(){
    options=("Performance" "Balanced" "Power Saver")
    # Afficher les options dans Rofi et renvoyer la sélection
    echo -e "${options[0]}\n${options[1]}\n${options[2]}"
}

# Fonction principale
main(){
    # Affiche le menu et récupère la sélection
    selection=$(menu | $rofi_command)
    
    # Si l'utilisateur a sélectionné une option, appliquer le changement de profil
    case $selection in
        "Performance") 
            powerprofilesctl set performance
            notify-send -e -u normal -i "$notif" " Games " " Performance " -t 1000
            ;;
        "Balanced")
            powerprofilesctl set balanced
            notify-send -e -u normal -i "$notif" " Games " " Balanced " -t 1000
            ;;
        "Power Saver")
            powerprofilesctl set power-saver
            notify-send -e -u normal -i "$notif" " Games " " power-saver " -t 1000
            ;;
        *) 
            # Si aucune option n'est sélectionnée (ou si on ferme Rofi), quitter
            exit 0
            ;;
    esac
}

# Lancer la fonction principale
main

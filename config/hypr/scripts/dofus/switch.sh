#!/bin/bash

get_active_window_class() {
  hyprctl activewindow -j | jq -r '.class'
}

get_dofus_windows() {
  hyprctl clients -j | jq -r '.[] | select(.class == "Dofus.x64") | .address'
}

get_active_window() {
  hyprctl activewindow -j | jq -r '.address'
}

reset_keybindings() {
  # Rétablir les actions par défaut des boutons latéraux
  hyprctl keyword bind ,mouse:276 exec "xdotool key XF86_MonBrightnessUp"
  hyprctl keyword bind ,mouse:275 exec "xdotool key XF86_MonBrightnessDown"
}

switch_window() {
  direction=$1

  # Vérifier si la fenêtre active est une fenêtre Dofus
  active_class=$(get_active_window_class)

  if [ "$active_class" != "Dofus.x64" ]; then
    # Si ce n'est pas une fenêtre Dofus, restaurer les raccourcis par défaut
    reset_keybindings
    exit 0
  fi

  # Obtenir la liste des fenêtres Dofus
  windows=($(get_dofus_windows))
  current_window=$(get_active_window)

  if [ "${#windows[@]}" -eq 0 ]; then
    # Si aucune fenêtre Dofus n'est trouvée, restaurer les raccourcis
    reset_keybindings
    exit 0
  fi

  # Bascule entre les fenêtres Dofus
  for i in "${!windows[@]}"; do
    if [ "${windows[$i]}" = "$current_window" ]; then
      if [ "$direction" = "next" ]; then
        next_index=$(((i + 1) % ${#windows[@]}))
      else
        next_index=$(((i - 1 + ${#windows[@]}) % ${#windows[@]}))
      fi
      hyprctl dispatch focuswindow address:${windows[$next_index]}
      hyprctl dispatch bringactivetotop
      break
    fi
  done
}

case "$1" in
"next") switch_window "next" ;;
"prev") switch_window "prev" ;;
esac

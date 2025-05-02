#!/bin/bash

# Game Mode. Turning off all animations
STEAM_DIR=~/.local/share/Steam
dofus="$HOME/.config/swaync/images/dofus.png"
KEYMAPS="$HOME/.config/hypr/configs"
BIND="bind = , mouse:276, exec, ~/.config/hypr/scripts/dofus/switch.sh next"
SCRIPTSDIR="$HOME/.config/hypr/scripts"
DOFUSINFO=0
# Nouvelle partie : surveillance des jeux Steam
HYPRGAMEMODE=$(hyprctl getoption animations:enabled | awk 'NR==1{print $2}')

while true; do
  get_active_window_class() {
    hyprctl activewindow -j | jq -r '.class'
  }

  dofusgames=$(pgrep -af dofus)

  if [ -z "$dofusgames" ]; then
    if [ "$DOFUSINFO" = 1 ]; then
      echo "non"
      sed -i 's/^\(bind = , mouse.*\)/#\1/g' ${KEYMAPS}/Keybinds.conf
      sleep 1
      sed -i 's/#bindm/bindm/g' ~/.config/hypr/configs/Keybinds.conf
      sleep 0.5
      hyprctl reload
      notify-send -e -u normal -i "$dofus" " Dofus Unity" " Multi-compte Disable" -t 10000
      DOFUSINFO=0
    fi
  else
    if [ "$DOFUSINFO" = 0 ]; then
      echo "oui"
      sed -i 's/#bind = , mouse/bind = , mouse/g' ${KEYMAPS}/Keybinds.conf
      sleep 1
      sed -i 's/^\(bindm.*\)/#\1/g' ~/.config/hypr/configs/Keybinds.conf
      hyprctl reload
      sleep 0.5
      notify-send -e -u normal -i "$dofus" " Dofus Unity" " Multi-compte Enable" -t 10000
      DOFUSINFO=1
    fi
  fi
done

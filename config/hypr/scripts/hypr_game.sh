#!/bin/bash
# /* ---- 💫 https://github.com/JaKooLit 💫 ---- */  ##
# Game Mode. Turning off all animations

notif="$HOME/.config/swaync/images/ja.png"
SCRIPTSDIR="$HOME/.config/hypr/scripts"

sleep 1
HYPRGAMEMODE=$(hyprctl getoption animations:enabled | awk 'NR==1{print $2}')
sleep 1
if [ "$HYPRGAMEMODE" = 1 ]; then
  hyprctl --batch "\
        keyword animations:enabled 0;\
        keyword decoration:shadow:enabled 0;\
        keyword decoration:blur:enabled 0;\
        keyword general:gaps_in 0;\
        keyword general:gaps_out 0;\
        keyword general:border_size 1;\
        keyword decoration:rounding 0"

  hyprctl keyword "windowrule opacity 1 override 1 override 1 override, ^(.*)$"
  swww kill
  notify-send -e -u low -i "$notif" " Gamemode:" " enabled"
  exit
else
  swww-daemon --format xrgb && swww img "$HOME/.config/rofi/.current_wallpaper" &
  sleep 0.5
  ${SCRIPTSDIR}/WallustSwww.sh
  sleep 1
  ${SCRIPTSDIR}/Refresh.sh
  sleep 1
  hyprctl reload
  notify-send -e -u normal -i "$notif" " Gamemode:" " disabled"
  exit
fi

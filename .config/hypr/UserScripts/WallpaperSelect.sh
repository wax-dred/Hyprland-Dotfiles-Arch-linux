#!/bin/bash
# /* ---- 💫 https://github.com/JaKooLit 💫 ---- */
# This script for selecting wallpapers (SUPER W)

# WALLPAPERS PATH
terminal=kitty
wallDIR="$HOME/Pictures/wallpapers"
SCRIPTSDIR="$HOME/.config/hypr/scripts"
USERSCRIPTSDIR="$HOME/.config/hypr/UserScripts"
wallpaper_current="$HOME/.config/hypr/wallpaper_effects/.wallpaper_current"
mpvDIR="$HOME/Pictures/wallpapers/Video"
THUMBNAIL_DIR="/tmp/video_thumbnails"
mkdir -p "$THUMBNAIL_DIR"

rofi_override="element-icon{size:${icon_size}px;}"

# Directory for swaync
iDIR="$HOME/.config/swaync/images"
iDIRi="$HOME/.config/swaync/icons"

# variables
rofi_theme="~/.config/rofi/config-wallpaper.rasi"
focused_monitor=$(hyprctl monitors -j | jq -r '.[] | select(.focused) | .name')

# Get monitor width and DPI
monitor_width=$(hyprctl monitors -j | jq -r --arg mon "$focused_monitor" '.[] | select(.name == $mon) | .width')
scale_factor=$(hyprctl monitors -j | jq -r --arg mon "$focused_monitor" '.[] | select(.name == $mon) | .scale')

# Calculate icon size for rofi
icon_size=$(echo "scale=1; ($monitor_width * 8) / ($scale_factor * 100)" | bc)
rofi_override="element-icon{size:${icon_size}px;}"

# Fonction pour générer des miniatures
generate_thumbnail() {
  local video_path="$1"
  local thumbnail_path="${THUMBNAIL_DIR}/$(basename "$video_path").png"

  # Ne générer la miniature que si elle n'existe pas déjà
  if [[ ! -f "$thumbnail_path" ]]; then
    ffmpegthumbnailer -i "$video_path" -o "$thumbnail_path" -s 256
  fi

  echo "$thumbnail_path"
}

# Vérifie si swww-daemon est déjà lancé
if ! pgrep -x "swww-daemon" > /dev/null; then
    echo "Démarrage de swww-daemon..."
    swww-daemon &
    sleep 1  # Attendre un peu pour éviter les conflits
else
    echo "swww-daemon est déjà en cours d'exécution."
fi

# swww transition config
FPS=60
TYPE="any"
DURATION=2
BEZIER=".43,1.19,1,.4"
SWWW_PARAMS="--transition-fps $FPS --transition-type $TYPE --transition-duration $DURATION"


# Check if swaybg is running
if pidof swaybg > /dev/null; then
  pkill swaybg
fi

# Retrieve image files using null delimiter to handle spaces in filenames
mapfile -d '' PICS < <(find -L "${wallDIR}" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.pnm" -o -iname "*.tga" -o -iname "*.tiff" -o -iname "*.webp" -o -iname "*.bmp" -o -iname "*.farbfeld" -o -iname "*.png" -o -iname "*.gif" \) -print0)
mapfile -d '' PICS_MPV < <(find "${mpvDIR}" -type f \( -iname "*.mp4" \) -print0)

RANDOM_PIC="${PICS[$((RANDOM % ${#PICS[@]}))]}"
RANDOM_PIC_NAME=". random"
MULTI_PIC="${PICS[$((RANDOM % ${#PICS[@]}))]}"
MULTI_PIC_NAME=". Multi_Work"
MPV_PIC="${PICS_MPV[$((RANDOM % ${#PICS_MPV[@]}))]}"
MPV_PIC_NAME=". mpv"
EFFECT_PIC="${PICS[$((RANDOM % ${#PICS[@]}))]}"
EFFECT_PIC_NAME=". effect"

# Rofi command
rofi_command="rofi -i -show -dmenu -config $rofi_theme -theme-str $rofi_override"

# Sorting Wallpapers
menu() {
  # Sort the PICS array
  IFS=$'\n' sorted_options=($(sort <<<"${PICS[*]}"))

  # Place ". random" at the beginning with the random picture as an icon
  printf "%s\x00icon\x1f%s\n" "$RANDOM_PIC_NAME" "$RANDOM_PIC"
  printf "%s\x00icon\x1f%s\n" "$MULTI_PIC_NAME" "$MULTI_PIC"
  random_thumbnail=$(generate_thumbnail "$MPV_PIC")
  printf "%s\x00icon\x1f%s\n" "$MPV_PIC_NAME" "$random_thumbnail"
  printf "%s\x00icon\x1f%s\n" "$EFFECT_PIC_NAME" "$EFFECT_PIC"

  for pic_path in "${sorted_options[@]}"; do
    pic_name=$(basename "$pic_path")

    # Displaying .gif to indicate animated images
    if [[ ! "$pic_name" =~ \.gif$ ]]; then
      printf "%s\x00icon\x1f%s\n" "$(echo "$pic_name" | cut -d. -f1)" "$pic_path"
    else
      printf "%s\n" "$pic_name"
    fi
  done
}

# initiate swww if not running
swww query || swww-daemon --format xrgb

# Choice of wallpapers
main() {
  choice=$(menu | $rofi_command)

  # Trim any potential whitespace or hidden characters
  choice=$(echo "$choice" | xargs)
  RANDOM_PIC_NAME=$(echo "$RANDOM_PIC_NAME" | xargs)
  MULTI_PIC_NAME=$(echo "$MULTI_PIC_NAME" | xargs)
  MPV_PIC_NAME=$(echo "$MPV_PIC_NAME" | xargs)
  EFFECT_PIC_NAME=$(echo "$EFFECT_PIC_NAME" | xargs)

  # No choice case
  if [[ -z "$choice" ]]; then
    echo "No choice selected. Exiting."
    exit 0
  fi

  if [[ "$choice" == "$MULTI_PIC_NAME" ]]; then
    echo "ok"
    "$SCRIPTSDIR/Multi_Workspace.sh"
  fi

  # Random choice case
  if [[ "$choice" == "$RANDOM_PIC_NAME" ]]; then
    pkill Multi_Workspace
    # Vérifie si mpvpaper est en cours d'exécution
    if pgrep -x "mpvpaper" > /dev/null; then
        echo "mpvpaper est en cours d'exécution. Arrêt en cours..."
        pkill mpvpaper
        sleep 1  # Attendre un peu pour s'assurer qu'il est bien arrêté
    fi
	  swww img -o "$focused_monitor" "$RANDOM_PIC" $SWWW_PARAMS;
    sleep 2
    "$SCRIPTSDIR/WallustSwww.sh"
    sleep 0.5
    "$SCRIPTSDIR/Refresh.sh"
    exit 0
  fi

  #Rofi Mpvpaper
  if [[ "$choice" == "$MPV_PIC_NAME" ]]; then
    "$USERSCRIPTSDIR/Wallmp4Select.sh"
    pkill WallpaperSelect
  fi

  #Rofi Effect
  if [[ "$choice" == "$EFFECT_PIC_NAME" ]]; then
    "$USERSCRIPTSDIR/WallpaperEffects.sh"
  fi

  # Find the index of the selected file
  pic_index=-1
  for i in "${!PICS[@]}"; do
    filename=$(basename "${PICS[$i]}")
    if [[ "$filename" == "$choice"* ]]; then
      pic_index=$i
      break
    fi
  done

  if [[ $pic_index -ne -1 ]]; then
    pkill Multi_Workspace
    swww img -o "$focused_monitor" "${PICS[$pic_index]}" $SWWW_PARAMS
  else
    echo "Image not found."
    exit 1
  fi

}

# Check if rofi is already running
if pidof rofi > /dev/null; then
  pkill rofi
fi

main

wait $!
"$SCRIPTSDIR/WallustSwww.sh" &&

wait $!
sleep 2
"$SCRIPTSDIR/Refresh.sh"

sleep 1
# Check if user selected a wallpaper
if [[ -n "$choice" ]]; then
  sddm_sequoia="/usr/share/sddm/themes/sequoia_2"
  if [ -d "$sddm_sequoia" ]; then
    notify-send -i "$iDIR/ja.png" "Set wallpaper" "as SDDM background?" \
      -t 10000 \
      -A "yes=Yes" \
      -A "no=No" \
      -h string:x-canonical-private-synchronous:wallpaper-notify

    # Wait for user input using dbus-monitor
    dbus-monitor "interface='org.freedesktop.Notifications',member='ActionInvoked'" |
    while read -r line; do
      if echo "$line" | grep -q "yes"; then

		  # Check if terminal exists
		  if ! command -v "$terminal" &>/dev/null; then
   			notify-send -i "$iDIR/ja.png" "Missing $terminal" "Install $terminal to enable setting of wallpaper background"
   		  exit 1
		  fi

      $terminal -e bash -c "echo 'Enter your password to set wallpaper as SDDM Background'; \
      sudo cp -r $wallpaper_current '$sddm_sequoia/backgrounds/default' && \
      notify-send -i '$iDIR/ja.png' 'SDDM' 'Background SET'"
      break
  elif echo "$line" | grep -q "no"; then
    echo "Wallpaper not set as SDDM background. Exiting."
    break
  fi

  done &
  fi
fi

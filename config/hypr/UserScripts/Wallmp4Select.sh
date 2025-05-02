#!/bin/bash

# WALLPAPERS PATH
wallDIR="$HOME/Pictures/wallpapers/Video"
SCRIPTSDIR="$HOME/.config/hypr/scripts"
THUMBNAIL_DIR="/tmp/video_thumbnails"
Rofi_Dir="$HOME/.config/rofi"
mkdir -p "$THUMBNAIL_DIR"

# variables
rofi_theme="~/.config/rofi/config-wallpaper.rasi"
focused_monitor=$(hyprctl monitors -j | jq -r '.[] | select(.focused) | .name')
rofi_override="element-icon{size:${icon_size}px;}"

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

pkill -f WallpaperSelect

# Check if swaybg is running
if pidof swaybg >/dev/null; then
  pkill swaybg
  pkill swww
fi

# Check if rofi is already running
if pidof rofi > /dev/null; then
  pkill rofi
fi

# Retrieve video files using null delimiter to handle spaces in filenames
mapfile -d '' PICS < <(find "${wallDIR}" -type f \( -iname "*.mp4" \) -print0)

RANDOM_PIC="${PICS[$((RANDOM % ${#PICS[@]}))]}"
RANDOM_PIC_NAME=". random"
RETURN_PIC_NAME=". return"

# Rofi command
rofi_command="rofi -i -show -dmenu -config $rofi_theme -theme-str $rofi_override"

# Sorting Wallpapers
menu() {
  # Sort the PICS array
  IFS=$'\n' sorted_options=($(sort <<<"${PICS[*]}"))

  # Place ". return" at the beginning
  printf "%s\x00icon\x1f%s\n" "$RETURN_PIC_NAME"

  # Place ". random" at the beginning with the random picture as an icon
  random_thumbnail=$(generate_thumbnail "$RANDOM_PIC")
  printf "%s\x00icon\x1f%s\n" "$RANDOM_PIC_NAME" "$random_thumbnail"


  for pic_path in "${sorted_options[@]}"; do
    pic_name=$(basename "$pic_path")
    thumbnail=$(generate_thumbnail "$pic_path")

    # Displaying .gif to indicate animated images
    if [[ ! "$pic_name" =~ \.gif$ ]]; then
      printf "%s\x00icon\x1f%s\n" "$(echo "$pic_name" | cut -d. -f1)" "$thumbnail"
    else
      printf "%s\n" "$pic_name"
    fi
  done
}

# Choice of wallpapers
main() {
  choice=$(menu | $rofi_command)

  # Trim any potential whitespace or hidden characters
  choice=$(echo "$choice" | xargs)
  RANDOM_PIC_NAME=$(echo "$RANDOM_PIC_NAME" | xargs)
  RETURN_PIC_NAME=$(echo "$RETURN_PIC_NAME" | xargs)

  # No choice case
  if [[ -z "$choice" ]]; then
    echo "No choice selected. Exiting."
    exit 0
  fi

  if [[ "$choice" == "$RETURN_PIC_NAME" ]]; then
    $HOME/.config/hypr/UserScripts/WallpaperSelect.sh
    exit 0
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
    if pidof mpvpaper >/dev/null; then
      pkill -f mpvpaper
    fi
    swww kill
    rm "$HOME/.config/rofi/.current_wallpaper"
    sleep 0.5
    ffmpegthumbnailer -i "${PICS[$pic_index]}" -o "$Rofi_Dir/.current_wallpaper" -s 1024 -q 10
    sleep 0.5
    sleep 2
    "$SCRIPTSDIR/WallustSwww.sh"
    sleep 2
    "$SCRIPTSDIR/Refresh.sh"
    mpvpaper -o "--video-crop=3440x1440 --loop \
    --cache=no \
    --no-audio \
    --fps=60 \
    --quiet \
    --profile=fast \
    --hwdec=auto \
    --vo=gpu \
    --interpolation=no \
    --vf=lavfi=[scale=3440:1440:flags=fast_bilinear]" \
      "$focused_monitor" "${PICS[$pic_index]}"
  else
    echo "Image not found."
    exit 1
  fi
}

# Check if rofi is already running
if pidof rofi >/dev/null; then
  pkill rofi
  sleep 1 # Allow some time for rofi to close
fi
main

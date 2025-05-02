wallpaper_path="$HOME/.config/rofi/.current_wallpaper"

if [ -z pidof mpvpaper ]; then
  exit
else
  wallust run "$wallpaper_path" -s &
  sleep 2
fi

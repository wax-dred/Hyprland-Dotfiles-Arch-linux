# 🌿 Hyprland Dotfiles – Arch Linux Setup

Bienvenue dans mes dotfiles personnels pour un système Arch Linux personnalisé utilisant **Hyprland** comme compositeur Wayland.
Ce dépôt contient les fichiers de configuration pour diverses applications qui composent mon environnement Linux à la fois minimaliste et réactif.

---

## 🖼️ Aperçu
![Configuration Hyprland](images/Base.png)
> 🔧 Astuce: Remplacez `images/Base.png` par le chemin réel de votre capture d'écran.

---

## 📦 Configurations incluses
Ce dépôt comprend les fichiers de configuration pour les applications suivantes:
```bash
.config/
├── Ags # Aylur's GTK Shell
├── btop # Moniteur de ressources
├── cava # Visualiseur audio
├── fish # Shell
├── hypr # Hyprland WM
├── kitty # Terminal
├── mpvlock # Écran de verrouillage MPV
├── neofetch # Outil d'information système
├── nvim # Éditeur Neovim
├── rofi # Lanceur d'applications
├── rofi-games # Extension pour lancer des jeux avec Rofi
├── spicetify # Personnalisation Spotify
├── swaync # Centre de notifications
├── swappy # Outil d'annotation pour captures d'écran
├── wallust # Gestionnaire de schémas de couleurs
├── waybar # Barre d'état pour Wayland
└── wezterm # Terminal
```

---

## 🚀 Rofi - Lanceur d'applications et plus

### Lanceur d'applications
Mon lanceur Rofi est personnalisé pour s'intégrer parfaitement avec mon thème général. Il propose une interface claire et réactive pour lancer vos applications favorites.

![Rofi Launcher](images/Launcher.png)

Mention spéciale à [JaKooLit](https://github.com/JaKooLit) pour l'inspiration.

### Sélecteur de fonds d'écran
J'ai créé un sélecteur de fonds d'écran personnalisé avec Rofi qui permet de choisir et d'appliquer facilement les fonds d'écran à partir d'une interface visuelle.

![Wallpaper Selector](images/Rofi_wall.png)

Pour utiliser le sélecteur de fonds d'écran:
---
 Key: `Mod+W` (Mod = Super = Windows Key)
---

## 🎨 Wallust - Thèmes dynamiques

Wallust gère automatiquement mes schémas de couleurs en fonction du fond d'écran actuel, créant une expérience visuelle cohérente à travers tout le système.

### Intégration avec Thunar
Mon installation utilise une configuration GTK personnalisée qui fait que Thunar (et toutes les autres applications GTK) s'adaptent automatiquement au schéma de couleurs généré par Wallust.

![Thunar avec Wallust](images/Wallst_gtk.png)

Pour appliquer un nouveau thème après avoir changé de fond d'écran:

.themes/gtk et ajuster avec wallust

---

## 🎮 Gaming avec scripts personnalisés

J'ai développé un système de lancement de jeux avec des options préconfigurées pour chaque jeu. Cela permet de lancer facilement des jeux avec différentes configurations sans avoir à les spécifier manuellement à chaque fois.

### Fonctionnalités
- Options préférées pour chaque jeu (résolution, plein écran, etc.)
- Configurations de performance optimisées
- Intégration avec Mangohud pour les statistiques en jeu
- Support pour les launchers (Steam, Lutris, etc.)

![Gaming Launcher](images/Rofi_games.png) 
-01-script-Game

Exemple d'utilisation:
nom du script: The_Finals
Remplir:
    GAMESCOPE_OPTIONS="False"
    GAME_PERF="True"
    GAME_VRR="True"
    ANIMATION="True"
    MANGOHUD_OPTION="True"
    OPTION_AFTER="-useallavailablecores"
    LANG_KEY="fr"

    # ======= PARAMÈTRES GÉNÉRAUX =======
    MONITOR="DP-2"
    RESOLUTION="3440x1440"
    REFRESH_RATE="165"
    POSITION="0x0"
    SCALE="1"

    RES_WIDTH=3440
    RES_HEIGHT=1440
    FSR="True"
Lancer le script: config/hypr/scripts/Gamescope/add_script.sh

Puis:
```Option de lancement steam
The_Final %command% # Lance Cyberpunk 2077 avec ray tracing activé
```

---

## 💻 Installation

### Prérequis
```bash
sudo pacman -S hyprland kitty rofi waybar fish neovim btop cava thunar
```

Pour les dépendances supplémentaires:
```bash
yay -S wallust spicetify-cli rofi-games-git swaync swappy aylurs-gtk-shell-git
```


## 🙏 Remerciements
- [JaKooLit](https://github.com/JaKooLit) qui ma fais découvrir et aimé Hyprland
- [Hyprland](https://github.com/hyprwm/Hyprland) pour le compositeur Wayland incroyable
- [r/unixporn](https://reddit.com/r/unixporn) pour l'inspiration
- Tous les développeurs des outils utilisés dans cette configuration

---

## 📜 Licence
Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
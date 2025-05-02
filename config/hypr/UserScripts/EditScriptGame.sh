#!/bin/bash
# /* ---- 💫 Script Editor for Gamescope Scripts ---- */ ##
# Rofi menu for Quick Edit/View of Gamescope Game Scripts

# Define preferred text editor and terminal
edit=${EDITOR:-nvim}
tty=kitty

# Paths to scripts directory
SCRIPTS_DIR="$HOME/.config/hypr/scripts/Gamescope"
BASE_SCRIPT="Base_Script_Game"  # Script modèle à ne pas afficher dans la liste principale
UPDATE_SCRIPT="add-script.sh"   # Script de mise à jour à ne pas afficher dans la liste principale
THIS_SCRIPT="EditScriptGame.sh" # Nom de ce script pour permettre le retour au menu

# Rofi theme
rofi_theme="~/.config/rofi/config-edit-game.rasi"
rofi_theme_name="~/.config/rofi/config-edit-game-name.rasi"
msg="  Choose which game script to View or Edit ($SCRIPTS_DIR)"

# Option de retour au menu
declare -A back_to_menu=(
 ["Return to menu"]=$HOME/.config/hypr/UserScripts/$THIS_SCRIPT
)

# Function to display the menu options dynamically
menu() {
    # Get list of scripts, excluding base script and update script
    script_files=$(find "$SCRIPTS_DIR" -type f -executable ! -name "$BASE_SCRIPT" ! -name "$UPDATE_SCRIPT" | sort)
    # Count for numbering
    count=1
    
    # Generate menu with numbered entries
    for script in $script_files; do
        script_name=$(basename "$script")
        echo "$count. $script_name"
        ((count++))
    done   
    # Add options for special actions
    echo "$count. + Create new game script"
    ((count++))
    echo "$count. Edit base script template"
    ((count++))
    echo "$count. Run update script"
}

# Function to create a new script from base
create_script_from_base() {
    base_path="$SCRIPTS_DIR/$BASE_SCRIPT"
    new_script_name=$1
    new_script_path="$SCRIPTS_DIR/$new_script_name"
    
    # Check if base script exists
    if [[ -f "$base_path" ]]; then
        # Copy base script
        cp "$base_path" "$new_script_path"
        
        # Make executable
        chmod +x "$new_script_path"
    else
        # Create basic script if base doesn't exist
        echo "#!/bin/bash" > "$new_script_path"
        echo "# /* ---- 💫 Game Launch Script: $new_script_name ---- */ ##" >> "$new_script_path"
        echo "# Description: Custom launch script for game" >> "$new_script_path"
        echo "# Author: $(whoami)" >> "$new_script_path"
        echo "# Date: $(date +%Y-%m-%d)" >> "$new_script_path"
        echo "" >> "$new_script_path"
        echo "# Game launch code here" >> "$new_script_path"
        echo "" >> "$new_script_path"
        
        # Make executable
        chmod +x "$new_script_path"
    fi
    
    # Open the new script in editor
    $tty -e $edit "$new_script_path"
}

# Function to run the update script
run_update_script() {
    update_path="$SCRIPTS_DIR/$UPDATE_SCRIPT"
    
    if [[ -f "$update_path" && -x "$update_path" ]]; then
        $tty -e bash -c "$update_path; echo 'Press Enter to close'; read"
    else
        $tty -e bash -c "echo 'Update script not found or not executable!'; echo 'Press Enter to close'; read"
    fi
}

# Function to get script name with option to return to menu
get_script_name() {
    # Prepare Rofi input with Return to menu option
    echo "Return to menu" | rofi -i -dmenu -config $rofi_theme_name
}

# Main function to handle menu selection
main() {
    # Check if scripts directory exists, create if not
    if [ ! -d "$SCRIPTS_DIR" ]; then
        mkdir -p "$SCRIPTS_DIR"
    fi
    
    # Get choice from rofi menu
    choice=$(menu | rofi -i -dmenu -config $rofi_theme -mesg "$msg")
    
    # Extract number and script name
    choice_num=$(echo "$choice" | cut -d. -f1)
    
    # Get the total number of game scripts
    script_count=$(find "$SCRIPTS_DIR" -type f -executable ! -name "$BASE_SCRIPT" ! -name "$UPDATE_SCRIPT" | wc -l)
    
    # Check if choice is to create a new script
    if [[ $choice_num -eq $((script_count + 1)) ]]; then
        # Ask for new script name - avec un placeholder modifié et option de retour
        new_script_name=$(get_script_name)
        
        if [[ -n "$new_script_name" ]]; then
            if [[ "$new_script_name" == "Return to menu" ]]; then
                # Relancer ce script pour revenir au menu
                exec "${back_to_menu[$new_script_name]}"
            else
                # Create the new script
                create_script_from_base "$new_script_name"
            fi
        fi
        return
    fi
    
    # Check if choice is to edit the base script
    if [[ $choice_num -eq $((script_count + 2)) ]]; then
        base_script_path="$SCRIPTS_DIR/$BASE_SCRIPT"
        
        # Edit the base script
        $tty -e $edit "$base_script_path"
        return
    fi
    
    # Check if choice is to run the update script
    if [[ $choice_num -eq $((script_count + 3)) ]]; then
        run_update_script
        return
    fi
    
    # Handle regular script selection
    if [[ -n "$choice" ]]; then
        # Find the selected script
        script_files=$(find "$SCRIPTS_DIR" -type f -executable ! -name "$BASE_SCRIPT" ! -name "$UPDATE_SCRIPT" | sort)
        
        # Initialize counter
        count=1
        
        # Find the file corresponding to the number
        for script in $script_files; do
            if [[ $count -eq $choice_num ]]; then
                # Open the script in editor
                $tty -e $edit "$script"
                break
            fi
            ((count++))
        done
    fi
}

# Check if rofi is already running
if pidof rofi > /dev/null; then
    pkill rofi
fi

main
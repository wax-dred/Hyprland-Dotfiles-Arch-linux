#!/usr/bin/bash
# Script to list and start selected VM with rofi, including distribution icons
#
# Bindings:
# enter to start virt-viewer
# alt+m to start virt-manager

# Config
display=:0
xrdp="$HOME/.config/hypr/scripts/xrdp"
icon_path="$HOME/.config/rofi/vm-icons"
dom=$1

# Function to get VM list with their current state and icons
get_vm_list() {
    virsh --connect qemu:///system list --all --name | while read -r vm_name; do
        if [ -n "$vm_name" ]; then
            icon="$icon_path/${vm_name}.png"
            [ ! -f "$icon" ] && icon="$icon_path/default.png"
            echo -e "$vm_name\0icon\x1f$icon"
        fi
    done
}

# Use rofi to select VM if not provided as argument
if [ -z "$dom" ]; then
    dom=$(get_vm_list | rofi -dmenu -p "Select VM" -kb-custom-1 'Alt+m' -theme /home/florian/.config/rofi/config_vm.rasi)
fi

exit_code=$?

# Exit if no VM selected
if [ -z "$dom" ]; then
    exit 0
fi

# Extract VM name (remove icon part if present)
dom=$(echo "$dom" | cut -d $'\0' -f 1)

# Check VM state and start if not running
if [ "$(virsh --connect qemu:///system domstate "$dom")" != "running" ]; then
    notify-send "Starting VM" "$dom"
    if [ "$dom" == "Gaming_Xrdp" ]; then
        "${xrdp}/xrdp.sh"
    else
        virsh --connect qemu:///system start "$dom"
        
        # Wait for VM to be in running state
        while [ "$(virsh --connect qemu:///system domstate "$dom")" != "running" ]; do
            sleep 1
        done
        
        if [ $exit_code -eq 0 ]; then
            virt-manager --show-domain-console "$dom" -c qemu:///system
        elif [ $exit_code -eq 10 ]; then
            virt-manager --show-domain-console "$dom" -c qemu:///system
        fi
    fi
else
    notify-send "VM Already Running" "$dom"
    if [ $exit_code -eq 0 ] || [ $exit_code -eq 10 ]; then
        virt-manager --show-domain-console "$dom" -c qemu:///system
    fi
fi
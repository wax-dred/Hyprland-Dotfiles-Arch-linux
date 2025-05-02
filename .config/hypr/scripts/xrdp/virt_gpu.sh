q#!/bin/bash
#  _                           _      __     ____  __  
# | |    __ _ _   _ _ __   ___| |__   \ \   / /  \/  | 
# | |   / _` | | | | '_ \ / __| '_ \   \ \ / /| |\/| | 
# | |__| (_| | |_| | | | | (__| | | |   \ V / | |  | | 
# |_____\__,_|\__,_|_| |_|\___|_| |_|    \_/  |_|  |_| 
#                                                      
#  
# ----------------------------------------------------- 

tmp=$(virsh --connect qemu:///system list | grep " win11 " | awk '{ print $3}')
echo "Virtual Machine win11 is starting now... Waiting 30s before starting Gpu Windows 11."
notify-send "Virtual Machine win11 is starting now..." "Waiting 30s before starting Gpu Windows 11."

if ([ "x$tmp" == "x" ] || [ "x$tmp" != "xrunning" ])
then
    echo "Virtual Machine win11 is starting now... Waiting 30s before starting xfreerdp."
    notify-send "Virtual Machine win11 is starting now..." "Waiting 30s before starting xfreerdp."
    virsh --connect qemu:///system start win11
    sleep 20
else
    notify-send "Virtual Machine win11 is already running." "Launching xfreerdp now!"
    echo "Starting xfreerdp now..."
fi
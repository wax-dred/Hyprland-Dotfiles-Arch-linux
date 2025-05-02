#!/bin/bash
#  _                           _      __     ____  __  
# | |    __ _ _   _ _ __   ___| |__   \ \   / /  \/  | 
# | |   / _` | | | | '_ \ / __| '_ \   \ \ / /| |\/| | 
# | |__| (_| | |_| | | | | (__| | | |   \ V / | |  | | 
# |_____\__,_|\__,_|_| |_|\___|_| |_|    \_/  |_|  |_| 
#                                                      
#  
# by Stephan Raabe (2023) 
# ----------------------------------------------------- 

if [ -f ~/private/win11-credentials.sh ]; then
    echo "Credential file exists. Using the file."
    source ~/private/win11-credentials.sh
else
    win11user="florian"
    win11pass="Deeslinecra33"
    vmip="192.168.122.127"
fi

xfreerdp3 /v:192.168.122.127 /u:florian /p:$Deeslinecra33 &
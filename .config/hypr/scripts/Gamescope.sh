#!/bin/bash
# Script pour lancer des jeux via Gamescope avec optimisations

# Variables d'environnement
export __GL_SHADER_DISK_CACHE_SKIP_CLEANUP=1
export RADV_PERFTEST=gpl
export DXVK_ASYNC=1
export DXVK_ENABLE_NVAPI=1
export mesa_glthread=true
export VK_INSTANCE_LAYERS=VK_LAYER_MESA_overlay
export RADV_TEX_ANISO=16
export XKB_DEFAULT_LAYOUT=fr
export DXVK_HDR=1

# Lancement du jeu
RES_WIDTH=3440
RES_HEIGHT=1440
REFRESH_RATE=165
FSR_MODE="fsr"

gamescope -W $RES_WIDTH -H $RES_HEIGHT -r $REFRESH_RATE -f -F --hdr-enable fsr --sdr-gamut-wideness 1 --force-grab-cursor -- "$@"

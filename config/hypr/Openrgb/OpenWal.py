from openrgb import OpenRGBClient
from openrgb.utils import RGBColor, DeviceType
import time, math, json, os
import traceback

WALLUST_PATH = '/home/florian/.config/hypr/Openrgb/wal_rgb.json'

# --- Utilitaires ---
def hex_to_rgbcolor(hex_code):
    hex_code = hex_code.lstrip('#')
    r = int(hex_code[0:2], 16)
    g = int(hex_code[2:4], 16)
    b = int(hex_code[4:6], 16)
    return RGBColor(r, g, b)

def load_colors():
    with open(WALLUST_PATH) as f:
        wal = json.load(f)
    return [hex_to_rgbcolor(wal['colors'][f'color{i}']) for i in range(16)]

# --- Connexion OpenRGB ---
client = OpenRGBClient()
devices = client.devices

# Debug : liste des modes disponibles
for device in devices:
    print(f"\n🎛️ {device.name} ({device.type})")
    print("Modes disponibles :")
    for mode in device.modes:
        print(f"  - {mode.name}")

# Identifie les bons périphériques
ram_devices = [d for d in devices if d.name == "Corsair Vengeance Pro RGB"]
node_pro = next(d for d in devices if d.name == "Corsair Lighting Node Pro")
mobo = next(d for d in devices if d.type == DeviceType.MOTHERBOARD)

# Couleurs initiales
colors = load_colors()
last_modified_time = os.path.getmtime(WALLUST_PATH)
colorA = colors[13]  # Couleur statique
colorB = colors[12]
colorC = colors[2]
colorD = colors[11]
colorE = colors[5]

# --- Mémoire ---
last_colors = {}
last_modes = {}

# --- Fonctions Optimisées ---
def set_mode_safe(device, target_mode_name):
    for mode in device.modes:
        if mode.name.lower() == target_mode_name.lower():
            if last_modes.get(device) != mode.name:
                device.set_mode(mode)
                last_modes[device] = mode.name
            return
    print(f"⚠️ Mode '{target_mode_name}' non disponible pour {device.name}")

def smart_set_color(device, color):
    if last_colors.get(device) != color:
        device.set_color(color)
        last_colors[device] = color

def set_static(device, color):
    set_mode_safe(device, "Static")
    smart_set_color(device, color)

def set_direct(device, color):
    set_mode_safe(device, "Direct")
    smart_set_color(device, color)

def get_mode_color_limits(device, mode_name):
    for mode in device.modes:
        if mode.name.lower() == mode_name.lower():
            return mode.colors_min, mode.colors_max
    return 0, 0

def set_color_shift(device, color1, color2):
    try:
        set_mode_safe(device, "Color Shift")
        time.sleep(0.2)  # 👈 donne le temps de changer de mode
        min_colors, max_colors = get_mode_color_limits(device, "Color Shift")
        color_count = min(max(min_colors, 2), max_colors)
        device.set_colors([color1, color2][:color_count])
    except Exception as e:
        print(f"⚠️ Erreur Color Shift sur {device.name}: {e}")
        traceback.print_exc()
        set_static(device, color1)

def set_marquee(device, color1):
    try:
        set_mode_safe(device, "Marquee")
        min_colors, max_colors = get_mode_color_limits(device, "Marquee")
        color_count = min(max(min_colors, 3), max_colors)
        colors = [color1 if i % 2 == 0 else color2 for i in range(color_count)]
        device.set_colors(colors)
    except Exception as e:
        print(f"⚠️ Erreur Marquee sur {device.name}: {e}")
        set_color_shift(device, color1, color2)

# --- Boucle d'effet ---
start_time = time.time()
try:
    while True:
        current_modified_time = os.path.getmtime(WALLUST_PATH)
        if current_modified_time != last_modified_time:
            print("🔄 wal_rgb.json modifié, on recharge !")
            colors = load_colors()
            colorA = colors[0]
            colorB = colors[14]
            colorB = colors[2]
            colorC = colors[7]
            colorD = colors[12]
            colorE = colors[4]
            colorF = colors[15]
            last_modified_time = current_modified_time

        # Phase 1 - RAM Rain, Node Static, Mobo Static
        for ram in ram_devices:
            set_static(ram, colorA)
        set_color_shift(node_pro, colorA, colorB)
        set_static(mobo, colorB)
        if time.time() - start_time < 4:
            for ram in ram_devices:
                set_direct(ram, colorB)
        if time.time() - start_time < 4:
            for ram in ram_devices:
                set_direct(ram, colorC)

        print("🌈 Phase 1 - statique")
        current_modified_time = os.path.getmtime(WALLUST_PATH)
        if current_modified_time != last_modified_time:
            print("🔄 wal_rgb.json modifié, on recharge !")
            colors = load_colors()
            colorA = colors[0]
            colorB = colors[14]
            colorB = colors[2]
            colorC = colors[7]
            colorD = colors[12]
            colorE = colors[4]
            colorF = colors[15]
            last_modified_time = current_modified_time
        time.sleep(10.0)

        # Phase 2 - RAM Rain, Node Color Shift B-C, Mobo Static D
        for ram in ram_devices:
            set_static(ram, colorB)
        set_color_shift(node_pro, colorB, colorC)
        set_static(mobo, colorC)
        if time.time() - start_time < 4:
            for ram in ram_devices:
                set_direct(ram, colorC)
        if time.time() - start_time < 4:
            for ram in ram_devices:
                set_direct(ram, colorD)
                
        print("🌈 Phase 2 - Node Color Shift B-C")
        current_modified_time = os.path.getmtime(WALLUST_PATH)
        if current_modified_time != last_modified_time:
            print("🔄 wal_rgb.json modifié, on recharge !")
            colors = load_colors()
            colorA = colors[0]
            colorB = colors[14]
            colorB = colors[2]
            colorC = colors[7]
            colorD = colors[12]
            colorE = colors[4]
            colorF = colors[15]
            last_modified_time = current_modified_time
        time.sleep(10.0)

        # Phase 3 - RAM Rain, Node Color Shift D-E, Mobo Static A
        for ram in ram_devices:
            set_static(ram, colorC)
        set_color_shift(node_pro, colorC, colorD)
        set_static(mobo, colorD)
        if time.time() - start_time < 4:
            for ram in ram_devices:
                set_direct(ram, colorE)
        if time.time() - start_time < 4:
            for ram in ram_devices:
                set_direct(ram, colorF)

        print("🌈 Phase 3 - Node Color Shift D-E")
        current_modified_time = os.path.getmtime(WALLUST_PATH)
        if current_modified_time != last_modified_time:
            print("🔄 wal_rgb.json modifié, on recharge !")
            colors = load_colors()
            colorA = colors[0]
            colorB = colors[14]
            colorB = colors[2]
            colorC = colors[7]
            colorD = colors[12]
            colorE = colors[4]
            colorF = colors[15]
            last_modified_time = current_modified_time
        time.sleep(10.0)

        # Phase 4 - RAM Rain, Node Color Shift E-A, Mobo Static A
        for ram in ram_devices:
            set_static(ram, colorD)
        set_color_shift(node_pro, colorD, colorE)
        set_static(mobo, colorE)
        print("🌈 Phase 4 - Node Color Shift E-A")
        current_modified_time = os.path.getmtime(WALLUST_PATH)
        if current_modified_time != last_modified_time:
            print("🔄 wal_rgb.json modifié, on recharge !")
            colors = load_colors()
            colorA = colors[0]
            colorB = colors[14]
            colorB = colors[2]
            colorC = colors[7]
            colorD = colors[12]
            colorE = colors[4]
            colorF = colors[15]
            last_modified_time = current_modified_time
        time.sleep(10.0)


except KeyboardInterrupt:
    print("🛑 Animation stoppée par l'utilisateur.")
    for device in ram_devices + [node_pro, mobo]:
        try:
            set_static(device, colorA)
        except:
            pass

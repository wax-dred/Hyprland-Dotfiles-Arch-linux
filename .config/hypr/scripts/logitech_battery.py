#!/usr/bin/env python3
import subprocess
import re


def get_battery_percentage():
    try:
        # Exécute la commande Solaar
        result = subprocess.run(["solaar", "show"], capture_output=True, text=True)
        output = result.stdout

        # Cherche le pourcentage de batterie
        match = re.search(r"Battery:\s+(\d+)%", output)
        if match:
            return f"{match.group(1)}%"
        else:
            return ""
    except Exception as e:
        return f"Error: {str(e)}"

def main():
    battery = get_battery_percentage()
    print(battery)

if __name__ == "__main__":
    main()

#!/bin/bash

# wallust-shader : Génère un shader OpenRGB basé sur la palette Wallust

WALLUST_COLORS="$HOME/.config/hypr/Openrgb/wal_rgb.json"
OUTPUT="$HOME/.config/OpenRGB/plugins/settings/effect-shaders/wallust"

# Check for jq
command -v jq >/dev/null || { echo "❌ 'jq' requis. Installe-le avec : sudo pacman -S jq"; exit 1; }

mkdir -p "$(dirname "$OUTPUT")"

# HEX to vec3
hex_to_vec3() {
  hex=$1
  r=$((16#${hex:1:2}))
  g=$((16#${hex:3:2}))
  b=$((16#${hex:5:2}))
  echo "vec3("$(awk "BEGIN{printf \"%.3f, %.3f, %.3f\", $r/255, $g/255, $b/255}")")"
}

# Extract colors
mapfile -t color_vecs < <(
  for i in {0..7}; do
    hex=$(jq -r ".colors.\"color$i\"" "$WALLUST_COLORS")
    hex_to_vec3 "$hex"
  done
)

# Write shader file
cat > "$OUTPUT" <<EOF
#define time iTime

// Couleurs dynamiques Wallust
vec3 col1 = ${color_vecs[0]};
vec3 col2 = ${color_vecs[1]};
vec3 col3 = ${color_vecs[2]};
vec3 col4 = ${color_vecs[3]};
vec3 col5 = ${color_vecs[4]};
vec3 col6 = ${color_vecs[5]};

// Alias pour les étapes
vec3 colorA = col5;
vec3 colorB = col4;
vec3 colorC = col3;
vec3 colorD = col1;
vec3 colorE = col6;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float t = mod(time, 25.0);
    vec3 col;

    if (t < 5.0) {
        // Étape 1 : couleur statique (cyan lumineux)
        col = colorA;
    } else if (t < 10.0) {
        // Étape 2 : dégradé orange-jaune animé
        float n = noise(uv * 20.0 + vec2(0.0, time * 4.0));
        col = mix(colorB, colorC, smoothstep(0.3, 0.7, n));
    } else if (t < 15.0) {
        // Étape 3 : cyan à noir, façon transition frappante
        float n = noise(uv * 15.0 + vec2(0.0, time * 6.0));
        col = mix(colorA, colorD, smoothstep(0.2, 0.8, n));
    } else if (t < 20.0) {
        // Étape 4 : retour au dégradé jaune-orangé
        float wave = sin((uv.x + uv.y + time * 2.0) * 10.0) * 0.5 + 0.5;
        col = mix(colorB, colorC, wave);
    } else {
        // Étape 5 : teinte or profond statique
        col = colorE;
    }

    fragColor = vec4(sqrt(abs(col)), 1.0);
}
EOF

# Optionnel : Appliquer le profil OpenRGB (si déjà existant)
openrgb --profile "$OUTPUT" >/dev/null 2>&1 && \
  echo "✅ Shader appliqué via OpenRGB." || \
  echo "ℹ️ Shader généré, mais OpenRGB ne l’a pas appliqué directement."

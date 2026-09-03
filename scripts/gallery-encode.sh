#!/bin/bash
# Isecci za galeriju: kratki loop bez zvuka + poster.
set -e
cd "$(dirname "$0")/.."

# Folder sa originalima sa Drive-a, nije u repou.
SRC="${SRC:-drive-download-20260903T085737Z-1-001}"
if [ ! -d "$SRC" ]; then echo "nema foldera sa originalima: $SRC"; exit 1; fi
OUTV="assets/video/gallery"
OUTP="assets/img/gallery"
mkdir -p "$OUTV" "$OUTP"

# slug|fajl|start|trajanje|filter|sirina|visina
CLIPS=(
"upis|9_16 X sezona Upis.mp4|5.5|12|scale=540:960:flags=lanczos|540|960"
"toddlerography|9_16 Toddlerography FINAL.mp4|8|12|scale=540:960:flags=lanczos|540|960"
"party|16_9 PARTY.mp4|78|12|scale=960:540:flags=lanczos|960|540"
"za-anu|16_9 OTER AFTER ZA ANU.mp4|44|12|scale=960:540:flags=lanczos|960|540"
"skola|Video 1_1 Škola.mp4|40|12|crop=1080:1080:420:0,scale=640:640:flags=lanczos|640|640"
"battle|Video 1_1 Battle Form8.mp4|40|12|crop=1080:1080:0:294,scale=640:640:flags=lanczos|640|640"
"promo|Video 1_1 Form8 Promo 9. sezona.mp4|8|12|crop=1080:1080:0:294,scale=640:640:flags=lanczos|640|640"
)

for c in "${CLIPS[@]}"; do
  IFS='|' read -r slug file ss t vf w h <<< "$c"
  echo "== $slug ($w x $h)"
  ffmpeg -v error -y -ss "$ss" -t "$t" -i "$SRC/$file" -an \
    -vf "hqdn3d=2:1.5:3:3,$vf" -r 25 \
    -c:v libx264 -profile:v high -preset slow -crf 32 -pix_fmt yuv420p \
    -g 50 -movflags +faststart "$OUTV/$slug-$w.mp4"
  ffmpeg -v error -y -ss "$ss" -i "$SRC/$file" -frames:v 1 \
    -vf "$vf" -q:v 7 "$OUTP/$slug-$w.jpg"
done

ls -la "$OUTV" "$OUTP"

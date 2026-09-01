# Hero video

Hero nosi kratak loop iz promo snimka, bez zvuka. Poster slika se vidi odmah,
video se skida tek posle `load` događaja, tako da ne kasni prvi prikaz stranice.

## Fajlovi

```
assets/video/hero-1280.mp4      16:9, za ekrane preko 700px
assets/video/hero-640.mp4       4:5, za telefone
assets/img/hero/hero-poster.jpg     poster za 16:9
assets/img/hero/hero-poster-640.jpg poster za 4:5
```

Samo MP4, bez WebM-a. VP9 je na ovom materijalu ispao veći od H.264 pri istom
kvalitetu, a H.264 svira svuda.

Telefon dobija poseban isečak zato što je hero na telefonu uži nego viši
(oko 390x600). Kad bi se 16:9 snimak razvukao preko toga, videla bi se samo
trećina kadra po širini. Isečak 4:5 je centriran, kadrovi su centrirani u
snimku pa se ništa bitno ne gubi.

## Kako se pravi iz originala

Original je 1920x1080, 25 fps, oko 53 sekunde. Uzet je deo od 21.12s do 33.96s,
oba kraja su na rezu, pa skok na kraju loopa izgleda kao još jedan rez.

```bash
SRC="MY SHARONA remake.mp4"
SS=21.12; T=12.84

ffmpeg -y -ss $SS -t $T -i "$SRC" -an \
  -vf "hqdn3d=2:1.5:3:3,scale=1280:720:flags=lanczos" -r 25 \
  -c:v libx264 -profile:v high -preset slow -crf 32 -pix_fmt yuv420p \
  -g 50 -movflags +faststart assets/video/hero-1280.mp4

ffmpeg -y -ss $SS -t $T -i "$SRC" -an \
  -vf "hqdn3d=2:1.5:3:3,crop=864:1080:108:0,scale=640:800:flags=lanczos" -r 25 \
  -c:v libx264 -profile:v high -preset slow -crf 32 -pix_fmt yuv420p \
  -g 50 -movflags +faststart assets/video/hero-640.mp4

ffmpeg -y -ss $SS -i "$SRC" -frames:v 1 \
  -vf "scale=1280:720:flags=lanczos" -q:v 6 assets/img/hero/hero-poster.jpg

ffmpeg -y -ss $SS -i "$SRC" -frames:v 1 \
  -vf "crop=864:1080:108:0,scale=640:800:flags=lanczos" -q:v 6 \
  assets/img/hero/hero-poster-640.jpg
```

`-an` izbacuje zvuk, hero svira nemo pa je audio čist višak.
`hqdn3d` skida zrno iz snimka i time obara bitrate, bez njega je isti fajl
oko 30% veći. `+faststart` gura indeks na početak fajla, da video krene
da svira pre nego što se ceo skine.

Trenutne veličine: 1.4 MB za 1280, 730 KB za 640, posteri 30 i 17 KB.
Ako treba manje, diže se `crf` (35 daje oko 900 KB) ili se skraćuje isečak.

## Kako radi na strani

U `index.html` i `en/index.html`:

- `<picture>` sa posterom nosi prvi prikaz, `fetchpriority="high"` i `preload`
  u `head`-u, po jedan za svaki odnos stranica
- `<video>` stoji preko postera, prazan je, bez `src`, sa `preload="none"`
- `assets/js/site.js` posle `load` događaja upisuje `src` iz `data-wide` ili
  `data-narrow`, pusti video i tek na `playing` ga otkrije prelazom

Video se uopšte ne skida kad je uključeno `prefers-reduced-motion`, kad browser
javi `saveData` ili kad je veza 2G. Tada ostaje poster. Bez JavaScripta takođe
ostaje poster.

Scrim preko videa je pojačan (`.hero__scrim`) zato što je snimak na beloj
pozadini, a logo i nav su svetli. Filter na `.hero__media` više nije
`grayscale`, snimak je već crno-beli i ima tirkiznu boju brenda u sebi.

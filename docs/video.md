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

# Klipovi u galeriji

Sekcija "Zaviri u naš svet" ima sedam klipova, po dvanaest sekundi, bez zvuka,
u loopu. Raspored po odnosu stranica prati imena fajlova sa Drive-a.

| Slot | Klip | Izvorni fajl | Isečak |
|------|------|--------------|--------|
| 9:16 | `upis-540` | `9_16 X sezona Upis.mp4` | 5.5s - 17.5s |
| 16:9 | `party-960` | `16_9 PARTY.mp4` | 78s - 90s |
| 9:16 | `toddlerography-540` | `9_16 Toddlerography FINAL.mp4` | 8s - 20s |
| 1:1 | `skola-640` | `Video 1_1 Škola.mp4` | 40s - 52s |
| 1:1 | `battle-640` | `Video 1_1 Battle Form8.mp4` | 40s - 52s |
| 1:1 | `promo-640` | `Video 1_1 Form8 Promo 9. sezona.mp4` | 8s - 20s |
| 16:9 | `za-anu-960` | `16_9 OTER AFTER ZA ANU.mp4` | 44s - 56s |

Tri fajla sa imenom `1_1` nisu snimljena kao kvadrat: `Battle` i `Promo 9. sezona`
su 1080x1920, `Škola` je 1920x1080. Kvadrat se dobija isecanjem:

- iz uspravnog kadra ide `crop=1080:1080:0:294`, dakle malo iznad sredine,
  jer su lica u gornjoj polovini kadra
- iz položenog kadra ide `crop=1080:1080:420:0`, tačno po sredini

Škola tu gubi 44% širine, pa široki kadrovi cele grupe izlaze iz kvadrata.
Ako to smeta, klip ide u 16:9 slot, a neki drugi u kvadrat.

## Kako se prave klipovi

```
drive-download-.../          originali, folder je u .gitignore
assets/video/gallery/        klipovi, 12s, bez zvuka
assets/img/gallery/          posteri, prvi kadar isečka
```

Skripta je `scripts/gallery-encode.sh`. Menja se tabela `CLIPS` na vrhu:
slug, ime fajla, početak, trajanje, ffmpeg filter, širina, visina.

```bash
bash scripts/gallery-encode.sh
```

Parametri su isti kao za hero: `hqdn3d` skida zrno, `-an` izbacuje zvuk,
`crf 32`, `+faststart`. Ukupno oko 7.5 MB za svih sedam klipova.

Rezolucije su tik iznad onoga što se stvarno prikazuje: kvadrat je na desktopu
oko 242px, uspravni oko 226px, široki oko 430 do 715px.

## Kako galerija radi na strani

Svaki klip je `<video preload="none">` bez `src`, sa posterom u `poster`
atributu. `assets/js/site.js` upisuje `src` iz `data-src` i pušta video tek kad
klip dođe blizu ekrana, a pauzira ga kad izađe. Ista pravila kao za hero: ništa
se ne skida kad je uključeno `prefers-reduced-motion`, `saveData` ili 2G veza,
tada ostaje poster.

Grid je flex traka po traka. U traci je `flex-grow` jednak odnosu stranica, pa
svi klipovi u istoj traci ispadnu iste visine, a svaki zadrži svoj kadar bez
dodatnog isecanja. Ispod 720px trake se slažu uspravno, jedan klip po redu.

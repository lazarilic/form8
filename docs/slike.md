# Slike: struktura foldera i pravila

Sajt je statičan, bez build koraka, pa se slike ubacuju ručno i putanje se pišu direktno u HTML.
Zbog toga struktura mora da bude predvidiva, a imena fajlova stabilna.

## Struktura

```
assets/img/
  brand/      logo i favicon, retko se menja
  hero/       posteri za hero video, po jedan za 16:9 i 4:5
  groups/     fotografije grupa, po jedna po grupi
  gallery/    slike i posteri za galeriju
```

Folder `groups/` je popunjen. Ostala tri su tu da logo i hero ne stoje pomešani
sa fotografijama, i da se zna gde ide sledeća serija.

Originali sa fotografisanja stoje u `assets/img/groups/originals/` i taj folder je
u `.gitignore`. Originali su 5 do 15 MB po fajlu, ne idu u repo, iz njih se samo
prave isečci.

## Imena fajlova u groups/

Slug grupe, mala slova, crtica umesto razmaka, pa širina u pikselima:

```
assets/img/groups/mini-youngz-360.jpg
assets/img/groups/mini-youngz-720.jpg
assets/img/groups/kids-360.jpg
assets/img/groups/kids-720.jpg
assets/img/groups/teens-360.jpg
assets/img/groups/teens-720.jpg
assets/img/groups/funky-moms-360.jpg
assets/img/groups/funky-moms-720.jpg
```

Slug prati `group__name` iz HTML-a. Ako se doda nova grupa, ide isti obrazac,
bez datuma i bez rednih brojeva u imenu. Novu fotografiju iste grupe
prepisujemo preko stare, tako da putanja u HTML-u ostaje ista.

Fajl `PILIĆ.jpg` sa fotografisanja je uzet za grupu Mini Youngz. Ako to nije
ta grupa, treba zameniti original i ponovo pustiti komandu ispod.

## Format i dimenzije

Kartica grupe ima `aspect-ratio: 1 / 1` (`.group__ph` u `assets/css/site.css`).
Najšira kartica je oko 340 CSS piksela: na 1440px ekranu grid ide u četiri
kolone po ~326px, a na telefonu je kartica preko cele širine, oko 340px.

- odnos stranica 1:1, isečen tačno, bez belih ivica
- `-360.jpg` = 360x360, za obične ekrane
- `-720.jpg` = 720x720, za retina ekrane
- JPEG, kvalitet 80, do 150 KB po fajlu
- slike su crno-bele na sajtu preko CSS-a, pa originale čuvamo u boji

Isečke pravimo iz `originals/`, isečak je centriran:

```bash
cd assets/img/groups
for s in mini-youngz kids teens funky-moms; do
  for w in 360 720; do
    magick originals/$s.jpg -auto-orient -resize ${w}x${w}^ -gravity center \
      -extent ${w}x${w} -strip -quality 80 $s-$w.jpg
  done
done
```

`-strip` skida EXIF, tako da ime fotoaparata i datum snimanja ne odu na sajt.

## Kako se ubacuju u HTML

Placeholder blok je zamenjen `img`-om sa istom klasom i sa `srcset`:

```html
<img class="group__ph" src="assets/img/groups/teens-360.jpg"
     srcset="assets/img/groups/teens-360.jpg 360w, assets/img/groups/teens-720.jpg 720w"
     sizes="(max-width: 520px) 100vw, (max-width: 1040px) 45vw, 340px"
     alt="Devojka iz grupe Teens" width="360" height="360" loading="lazy" decoding="async">
```

U `en/index.html` isti fajlovi, putanja ide sa `../`, menja se i `alt`.
Prva kartica nema `loading="lazy"`, ostale tri imaju.

U `assets/css/site.css` dodato je `img.group__ph` sa `width: 100%`, `object-fit: cover`
i crno-belim filterom. Ako slike treba da ostanu u boji, briše se
red sa `filter`.

Placeholder klasa `.ph` ostaje, koristi je galerija dok ne stignu prave slike.

## Šta je urađeno, šta ostaje

Urađeno: fotografije četiri grupe u `groups/` u dve veličine, zamenjeni placeholderi
u obe verzije sajta, CSS za `img.group__ph`.

Logo je u `brand/`, posteri za hero video u `hero/`, putanje u oba HTML-a su prepravljene
(`og:image`, favicon, JSON-LD `logo`, `hero__logo`, `hero__media`). Hero video je opisan
u `docs/video.md`.

Ostaje:

- prave slike i posteri za galeriju u `gallery/`

# form8

Sajt za form.8, street style školu plesa za decu u Beogradu.

Statična strana, bez build koraka. Sav tekst je u HTML-u, pa ga Google i AI asistenti vide bez izvršavanja JS-a.

## Struktura

```
index.html          srpska verzija
en/index.html       engleska verzija
assets/css/site.css sav CSS
assets/js/site.js   tabovi za raspored, hero video, klipovi u galeriji i mapa (progressive enhancement)
assets/img/brand/   logo i favicon
assets/img/hero/    privremena hero fotografija
assets/img/groups/  fotografije grupa
assets/img/gallery/ posteri za klipove u galeriji
assets/vendor/leaflet/ Leaflet 1.9.4, lokalna kopija
assets/video/       hero loop i klipovi za galeriju
scripts/gallery-encode.sh  pravi klipove i postere za galeriju iz originala
docs/slike.md       pravila za slike: imena, dimenzije, isecanje
docs/video.md       hero loop i klipovi u galeriji
robots.txt
sitemap.xml
```

## Pokretanje lokalno

```bash
python3 -m http.server 8000
```

Pa otvori http://localhost:8000.

## Dizajn

Implementirana je maketa **3a** iz Claude Design projekta "Form8 Analiza i Nova Verzija".

Paleta:

| Boja | Upotreba |
|------|----------|
| `#3FEFE1` | akcent iz logotipa: CTA, brojevi, aktivne stavke, marquee |
| `#0D0D0D` | osnovna podloga |
| `#062D29` | tekst na tirkiznim površinama, bela na tirkizu ne prolazi kontrast |
| `#F5F3ED` | tekst na crnoj |

Fontovi: Anton (naslovi), Archivo (tekst), JetBrains Mono (oznake i vremena).

## Mapa

Leaflet 1.9.4 sa OpenStreetMap tajlovima. Bez ključa, bez naloga i bez kartice,
samo obavezna atribucija u uglu mape. Biblioteka stoji u `assets/vendor/leaflet/`,
skida se tek kad sekcija Raspored dođe na ekran.

Tajlovi sa `tile.openstreetmap.org` su svetli, u tamnu temu ih obrće CSS filter
na `.leaflet-tile-pane`. `leaflet.css` se ubacuje iz JS-a, dakle posle `site.css`,
pa sva naša pravila za Leaflet idu kroz `.map` da bi bila specifičnija.

Koordinate i Google linkovi lokacija stoje u HTML-u, na pinovima ispod mape
(`data-lat`, `data-lng`, `data-address`, `data-url`) i u JSON-LD-u:

| Lokacija | Koordinate |
|----------|-----------|
| Vračar, Mileševska 42a, KUD Gradimir | 44.7984713, 20.4819718 |
| Novi Beograd, Milentija Popovića 1, Urban Dance Studio | 44.8140220, 20.4352170 |
| Vidikovac, Pilota Mihaila Petrovića 75a | 44.7421147, 20.4173993 |

Bez JS-a mapa se ne učita, ali adresa u svakom panelu rasporeda vodi na Google mape.

OSM tajlovi su besplatni za sajt ovog obima, uz atribuciju. Ako sajt jednog dana
skoči na desetine hiljada pregleda mesečno, ili ako se traži dizajnirana tamna
podloga umesto CSS filtera, ide se na MapTiler ili CARTO sa ključem, oba imaju
besplatan nivo.

## Preview

Sajt je okačen na GitHub Pages: https://lazarilic.github.io/form8/

To je preview sa placeholder podacima, pa je zaključan za pretraživače
(`noindex` u oba HTML-a i `Disallow: /` u `robots.txt`).

## Šta fali pre puštanja u rad

- [x] pravi WhatsApp broj u `wa.me` linkovima, +381691408193
- [x] pravi Instagram handle, `form8.bgd`
- [ ] pravi TikTok handle, sada je placeholder `@form8`
- [ ] telefon po sali u JSON-LD-u, za sada stoji jedan broj na organizaciji
- [x] video loop u herou umesto privremene fotografije
- [x] prave fotografije i klipovi u galeriji umesto placeholder blokova
- [ ] potvrditi cene i termine sa školom, trenutno su iz makete
- [ ] pravi domen u `canonical`, `hreflang`, `og:url` i `sitemap.xml`, sada pokazuju na Pages preview
- [ ] skinuti `noindex` iz oba HTML-a i `Disallow: /` iz `robots.txt`

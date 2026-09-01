# form8

Sajt za form.8, street style školu plesa za decu u Beogradu.

Statična strana, bez build koraka. Sav tekst je u HTML-u, pa ga Google i AI asistenti vide bez izvršavanja JS-a.

## Struktura

```
index.html          srpska verzija
en/index.html       engleska verzija
assets/css/site.css sav CSS
assets/js/site.js   tabovi za raspored (progressive enhancement)
assets/img/         logo i privremena hero fotografija
assets/img/groups/  fotografije grupa
assets/img/gallery/ galerija, još prazno
docs/slike.md       pravila za slike: imena, dimenzije, isecanje
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

## Preview

Sajt je okačen na GitHub Pages: https://lazarilic.github.io/form8/

To je preview sa placeholder podacima, pa je zaključan za pretraživače
(`noindex` u oba HTML-a i `Disallow: /` u `robots.txt`).

## Šta fali pre puštanja u rad

- [ ] pravi WhatsApp broj u `wa.me` linkovima
- [ ] pravi Instagram i TikTok handle
- [ ] adrese sve tri sale, pa dopuniti JSON-LD sa `streetAddress`, `geo` i `telephone`
- [ ] video loop u herou umesto privremene fotografije
- [ ] prave fotografije i klipovi u galeriji umesto placeholder blokova
- [ ] potvrditi cene i termine sa školom, trenutno su iz makete
- [ ] pravi domen u `canonical`, `hreflang`, `og:url` i `sitemap.xml`, sada pokazuju na Pages preview
- [ ] skinuti `noindex` iz oba HTML-a i `Disallow: /` iz `robots.txt`

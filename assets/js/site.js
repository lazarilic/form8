// Raspored: tabovi po lokaciji.
// Svi paneli su u HTML-u zbog pretrage, JS samo sakriva neaktivne.
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var tablist = document.querySelector('[data-tabs]');
  if (!tablist) return;

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  function panelFor(tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  }

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      var panel = panelFor(t);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();

    var index = tabs.indexOf(tab);
    pins.forEach(function (pin) {
      pin.setAttribute('aria-current', Number(pin.dataset.loc) === index ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('form8:loc', { detail: index }));
  }

  var pins = Array.prototype.slice.call(document.querySelectorAll('[data-loc]'));

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { select(tab, false); });
  });

  tablist.addEventListener('keydown', function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    var next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') next = tabs[0];
    if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next, true);
  });

  select(tabs[0], false);

  // Pinovi ispod mape biraju istu lokaciju kao tabovi.
  pins.forEach(function (pin) {
    pin.addEventListener('click', function (e) {
      var tab = tabs[Number(pin.dataset.loc)];
      if (!tab) return;
      e.preventDefault();
      select(tab, false);
      tab.scrollIntoView({ block: 'center' });
    });
  });

  // Klik na marker na mapi, bez skrolovanja strane.
  document.addEventListener('form8:loc-request', function (e) {
    var tab = tabs[e.detail];
    if (tab) select(tab, false);
  });
})();

// Hero video: poster nosi prvi prikaz, fajl se skida tek posle load-a.
(function () {
  'use strict';

  var video = document.querySelector('[data-hero]');
  if (!video) return;

  var conn = navigator.connection || {};
  if (conn.saveData) return;
  if (/(^|-)2g$/.test(conn.effectiveType || '')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function start() {
    var narrow = window.matchMedia('(max-width: 700px)').matches;
    video.src = narrow ? video.dataset.narrow : video.dataset.wide;
    video.muted = true;
    video.addEventListener('playing', function () {
      video.classList.add('is-playing');
    }, { once: true });
    var played = video.play();
    if (played && played.catch) played.catch(function () {});
  }

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();

// Mapa lokacija: Leaflet i OpenStreetMap tajlovi, bez kljuca i naloga.
// Tajlovi su svetli, u tamnu temu ih obrce CSS filter u site.css.
// Biblioteka se skida tek kad mapa dodje na ekran, do tada je u boksu placeholder.
(function () {
  'use strict';

  var box = document.querySelector('[data-map]');
  if (!box) return;

  var canvas = box.querySelector('.map__canvas');
  var pins = Array.prototype.slice.call(box.querySelectorAll('[data-loc]'));
  if (!canvas || !pins.length) return;

  var base = box.dataset.leaflet;
  var cta = box.dataset.cta || 'Google Maps';
  var locs = pins.map(function (pin) {
    return {
      name: pin.textContent.trim(),
      lat: Number(pin.dataset.lat),
      lng: Number(pin.dataset.lng),
      address: pin.dataset.address,
      url: pin.dataset.url
    };
  });

  var started = false;

  function load() {
    if (started) return;
    started = true;

    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = base + 'leaflet.css';
    document.head.appendChild(css);

    var js = document.createElement('script');
    js.src = base + 'leaflet.js';
    js.onload = init;
    document.head.appendChild(js);
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function init() {
    canvas.innerHTML = '';
    box.classList.add('is-ready');

    var map = L.map(canvas, {
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.attributionControl.setPrefix('<a href="https://leafletjs.com" rel="noopener">Leaflet</a>');

    var markers = locs.map(function (loc) {
      var icon = L.divIcon({
        className: 'map__marker',
        html: '<span class="map__marker__dot"></span><span class="map__marker__label">' + esc(loc.name) + '</span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10]
      });
      var m = L.marker([loc.lat, loc.lng], { icon: icon, title: loc.name, alt: loc.name, riseOnHover: true }).addTo(map);
      m.bindPopup(
        '<b class="map__pop-name">' + esc(loc.name) + '</b>' +
        '<span class="map__pop-addr">' + esc(loc.address) + '</span>' +
        '<a class="map__pop-link" href="' + esc(loc.url) + '" target="_blank" rel="noopener">' + esc(cta) + ' &rarr;</a>'
      );
      return m;
    });

    map.fitBounds(L.latLngBounds(locs.map(function (l) { return [l.lat, l.lng]; })), {
      padding: [34, 26],
      maxZoom: 14
    });

    // Tocak zumira tek kad se klikne u mapu, da ne otima skrol strane.
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var active = -1;

    markers.forEach(function (m, i) {
      m.on('click', function () {
        document.dispatchEvent(new CustomEvent('form8:loc-request', { detail: i }));
      });
    });

    document.addEventListener('form8:loc', function (e) {
      var i = e.detail;
      if (i === active || !markers[i]) return;
      active = i;
      var latlng = markers[i].getLatLng();
      if (still) map.setView(latlng, 15, { animate: false });
      else map.flyTo(latlng, 15, { duration: 0.7 });
      markers[i].openPopup();
    });

    var selected = pins.filter(function (p) { return p.getAttribute('aria-current') === 'true'; })[0];
    if (selected) active = Number(selected.dataset.loc);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (en) { return en.isIntersecting; })) {
        io.disconnect();
        load();
      }
    }, { rootMargin: '300px' });
    io.observe(box);
  } else {
    load();
  }
})();

// Galerija: klipovi se skidaju tek kad dodju blizu ekrana, sviraju nemo u loopu
// i pauziraju se cim izadju iz kadra. Poster stoji dok video ne krene.
(function () {
  'use strict';

  var clips = Array.prototype.slice.call(document.querySelectorAll('[data-clip]'));
  if (!clips.length) return;

  var conn = navigator.connection || {};
  if (conn.saveData) return;
  if (/(^|-)2g$/.test(conn.effectiveType || '')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function play(v) {
    if (!v.src) v.src = v.dataset.src;
    v.muted = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) play(en.target);
      else if (en.target.src) en.target.pause();
    });
  }, { rootMargin: '200px 0px', threshold: 0.2 });

  clips.forEach(function (v) { io.observe(v); });
})();

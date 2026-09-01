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
  }

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

  // Pinovi na mapi biraju istu lokaciju kao tabovi.
  document.querySelectorAll('[data-loc]').forEach(function (pin) {
    pin.addEventListener('click', function (e) {
      var tab = tabs[Number(pin.dataset.loc)];
      if (!tab) return;
      e.preventDefault();
      select(tab, false);
      tab.scrollIntoView({ block: 'center' });
    });
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

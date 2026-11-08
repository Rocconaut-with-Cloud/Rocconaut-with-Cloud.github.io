/* Rocconaut O.F. Apps – Effekte (ohne externe Bibliotheken) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Einblenden beim Scrollen
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // FAQ aufklappen
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Diashow im iPhone
  var slides = document.querySelectorAll('.screen img');
  if (slides.length > 1 && !reduce) {
    var idx = 0, paused = false;
    var screen = document.querySelector('.screen');
    screen.addEventListener('mouseenter', function () { paused = true; });
    screen.addEventListener('mouseleave', function () { paused = false; });
    setInterval(function () {
      if (paused || document.hidden) return;
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 3200);
  }

  if (reduce) return;

  // Kopfbereich: Kompassnadel, Lichtgitter, Ringe
  var hero = document.querySelector('.hero');
  var compass = document.querySelector('.compass');
  var compassSvg = compass && compass.querySelector('svg');
  var angle = 0;
  if (hero && canHover) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      var my = ((e.clientY - r.top) / r.height) * 2 - 1;
      hero.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      hero.style.setProperty('--px', (-mx * 20) + 'px');
      hero.style.setProperty('--py', (-my * 14) + 'px');
      hero.classList.add('active');
      if (compassSvg) {
        var c = compassSvg.getBoundingClientRect();
        var target = Math.atan2(e.clientX - (c.left + c.width / 2), -(e.clientY - (c.top + c.height / 2))) * 180 / Math.PI;
        var d = ((target - angle) % 360 + 540) % 360 - 180;
        angle += d;
        compassSvg.style.setProperty('--angle', angle + 'deg');
      }
    });
    hero.addEventListener('mouseleave', function () {
      hero.classList.remove('active');
      hero.style.setProperty('--px', '0px');
      hero.style.setProperty('--py', '0px');
      angle = Math.round(angle / 360) * 360;
      if (compassSvg) compassSvg.style.setProperty('--angle', angle + 'deg');
    });
  }

  // Scroll: Kompass verkleinert sich, iPhone dreht sich gerade
  var device = document.querySelector('.device');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (compass) {
        var p = Math.min(1, Math.max(0, window.scrollY / 600));
        compass.style.setProperty('--sp', p.toFixed(3));
      }
      if (device) {
        var r = device.getBoundingClientRect();
        var vh = window.innerHeight || 800;
        var dp = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
        device.style.setProperty('--dy', (-24 * (1 - dp)).toFixed(2) + 'deg');
        device.style.setProperty('--dx', (8 * (1 - dp)).toFixed(2) + 'deg');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // App-Karte: 3D-Kippen mit Lichtreflex
  var card = document.querySelector('.card');
  if (card && canHover) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.classList.add('hover');
      card.style.setProperty('--ry', ((px - 0.5) * 8).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-(py - 0.5) * 8).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('mouseleave', function () {
      card.classList.remove('hover');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }
})();

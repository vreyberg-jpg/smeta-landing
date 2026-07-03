(function () {
  var tg = window.Telegram && window.Telegram.WebApp;
  var inTelegram = tg && ((tg.initData && tg.initData.length) || (tg.platform && tg.platform !== 'unknown'));
  if (inTelegram) {
    try { tg.ready(); tg.expand(); } catch (e) {}
    document.documentElement.classList.add('in-telegram');
  }

  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) {
      var sibs = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (c) { return c.classList && c.classList.contains('reveal'); }) : [el];
      var i = sibs.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 0.07, 0.35) + 's';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  function countUp(el) {
    var to = +el.getAttribute('data-to') || 0, t0 = null;
    (function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / 1100), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = new Intl.NumberFormat('uk-UA').format(v);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var cus = document.querySelectorAll('.cu');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); io2.unobserve(en.target); } });
    }, { threshold: 0.4 });
    cus.forEach(function (el) { io2.observe(el); });
  } else {
    cus.forEach(countUp);
  }

  var qrEl = document.getElementById('qr');
  if (qrEl && window.QRCode) {
    new QRCode(qrEl, {
      text: 'https://t.me/good_smeta_bot', width: 128, height: 128,
      colorDark: '#1e2732', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M
    });
  }
})();

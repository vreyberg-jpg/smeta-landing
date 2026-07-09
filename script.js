(function () {
  var tg = window.Telegram && window.Telegram.WebApp;
  var inTelegram = tg && ((tg.initData && tg.initData.length) || (tg.platform && tg.platform !== 'unknown'));
  if (inTelegram) {
    try {
      tg.ready();
      tg.expand();
      if (tg.setHeaderColor) tg.setHeaderColor('#1e2732');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#1e2732');
      if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
    } catch (e) {}
    document.documentElement.classList.add('in-telegram');
  }

  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  var onScroll = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
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

  function scaleFrames() {
    document.querySelectorAll('.dl-frame').forEach(function (f) {
      var ifr = f.querySelector('iframe');
      if (ifr) ifr.style.transform = 'scale(' + (f.clientWidth / 1180) + ')';
    });
  }
  scaleFrames();
  window.addEventListener('resize', scaleFrames);
  window.addEventListener('load', scaleFrames);

  // тонкий зорепад на фіксованому фоні (глибина тёмного фону)
  (function () {
    if (document.documentElement.classList.contains('in-telegram')) return;
    var canvas = document.createElement('canvas');
    canvas.id = 'stars';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [], W = 0, H = 0;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function resize() {
      W = canvas.width = Math.floor(window.innerWidth * dpr);
      H = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      var n = Math.min(100, Math.round(window.innerWidth * window.innerHeight / 18000));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: (Math.random() * 1.2 + 0.3) * dpr,
          ph: Math.random() * 6.283, tw: Math.random() * 0.03 + 0.008,
          vy: (Math.random() * 0.05 + 0.015) * dpr
        });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduce) { s.ph += s.tw; s.y -= s.vy; if (s.y < 0) { s.y = H; s.x = Math.random() * W; } }
        ctx.globalAlpha = 0.2 + 0.5 * (0.5 + 0.5 * Math.sin(s.ph));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fillStyle = '#bcd2f0'; ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(frame);
    }
    resize(); frame();
    window.addEventListener('resize', resize);
  })();
})();

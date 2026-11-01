/* extras.js — flowing AI background + project images for bhanu-chaitra-portfolio
   Add ONE line before </body> in index.html:  <script src="extras.js"></script>
   Nothing else in your HTML or CSS needs to change. */
(function () {
  'use strict';
  if (window.__bhanuExtras) return;
  window.__bhanuExtras = true;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ------------------------------------------------------------------ */
  /* 1. FLOWING BACKGROUND (drifting orbs + flowing wave ribbons)        */
  /* ------------------------------------------------------------------ */
  function flowingBackground() {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    var c = document.createElement('canvas');
    c.className = 'flow-bg';
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(c, document.body.firstChild);
    var ctx = c.getContext('2d');
    var W, H, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // keep real content above the canvas (without breaking fixed/sticky navs)
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === c || el.tagName === 'SCRIPT') return;
      var cs = getComputedStyle(el);
      if (cs.position === 'static') el.style.position = 'relative';
      if (cs.zIndex === 'auto') el.style.zIndex = '1';
    });

    // sections with a solid colour would hide the background, so make them see-through
    document.querySelectorAll('section, main, footer, #home').forEach(function (el) {
      var m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (!m) return;
      var p = m[1].split(',').map(Number);
      if (p.length === 3 || p[3] === 1) el.style.backgroundColor = 'transparent';
    });

    var orbs = [
      { c: '118,183,255', r: 0.34, x: 0.15, y: 0.22, s: 0.21, p: 0.0, a: 0.30 },
      { c: '155,101,255', r: 0.40, x: 0.82, y: 0.35, s: 0.17, p: 2.1, a: 0.32 },
      { c: '67,139,255',  r: 0.30, x: 0.35, y: 0.82, s: 0.25, p: 4.0, a: 0.26 },
      { c: '217,200,255', r: 0.22, x: 0.65, y: 0.70, s: 0.30, p: 5.3, a: 0.16 }
    ];
    var waves = [
      { y: 0.30, a: 0.08, f: 1.4, s: 0.30, c: '118,183,255', w: 2.0 },
      { y: 0.55, a: 0.11, f: 1.1, s: -0.24, c: '155,101,255', w: 2.4 },
      { y: 0.78, a: 0.07, f: 1.8, s: 0.20, c: '67,139,255', w: 1.8 }
    ];
    var TAU = Math.PI * 2;

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      orbs.forEach(function (o) {
        var x = (o.x + Math.sin(t * o.s + o.p) * 0.16) * W;
        var y = (o.y + Math.cos(t * o.s * 0.8 + o.p) * 0.14) * H;
        var r = o.r * Math.max(W, H) * (1 + Math.sin(t * 0.5 + o.p) * 0.08);
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(' + o.c + ',' + o.a + ')');
        g.addColorStop(1, 'rgba(' + o.c + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      });

      waves.forEach(function (w) {
        for (var k = 0; k < 3; k++) {
          ctx.beginPath();
          var off = k * 0.55;
          for (var x = 0; x <= W + 14; x += 14) {
            var u = x / W;
            var y =
              (w.y +
                Math.sin(u * w.f * TAU + t * w.s + off) * w.a +
                Math.sin(u * w.f * 1.7 * TAU - t * w.s * 0.7 + off) * w.a * 0.5 +
                k * 0.012) * H;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = 'rgba(' + w.c + ',' + (0.30 - k * 0.08) + ')';
          ctx.lineWidth = w.w - k * 0.4;
          ctx.shadowColor = 'rgba(' + w.c + ',0.8)';
          ctx.shadowBlur = 16;
          ctx.stroke();
        }
      });
      ctx.shadowBlur = 0;
    }

    if (reduce) { draw(3); return; }
    var start = performance.now();
    (function loop(now) {
      draw((now - start) / 1000);
      requestAnimationFrame(loop);
    })(start);
  }

  /* ------------------------------------------------------------------ */
  /* 2. PROJECT IMAGES (illustrated SVG covers, one per project)         */
  /* ------------------------------------------------------------------ */
  function wrap(id, inner) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">' +
      '<defs>' +
      '<linearGradient id="bg' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12113a"/><stop offset="1" stop-color="#2a1b69"/></linearGradient>' +
      '<linearGradient id="ac' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#76B7FF"/><stop offset="1" stop-color="#9B65FF"/></linearGradient>' +
      '<radialGradient id="orb' + id + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#E6DCFF"/><stop offset=".45" stop-color="#9B65FF"/><stop offset="1" stop-color="#2b1a8a"/></radialGradient>' +
      '<filter id="gl' + id + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>' +
      '</defs>' +
      '<style>' +
      '.fl{animation:fl 4s ease-in-out infinite}@keyframes fl{50%{transform:translateY(-7px)}}' +
      '.pu{transform-box:fill-box;transform-origin:center;animation:pu 3s ease-in-out infinite}@keyframes pu{50%{transform:scale(1.1);opacity:.75}}' +
      '.da{stroke-dasharray:8 8;animation:da 2s linear infinite}@keyframes da{to{stroke-dashoffset:-32}}' +
      '.bar{transform-box:fill-box;transform-origin:bottom;animation:gr 3.2s ease-in-out infinite}@keyframes gr{50%{transform:scaleY(.8)}}' +
      '.sc{animation:sc 3.5s ease-in-out infinite}@keyframes sc{0%,100%{transform:translateY(0)}50%{transform:translateY(190px)}}' +
      '</style>' +
      '<rect width="640" height="300" fill="url(#bg' + id + ')"/>' +
      '<circle cx="540" cy="40" r="90" fill="#9B65FF" opacity=".18" filter="url(#gl' + id + ')"/>' +
      '<circle cx="80" cy="270" r="100" fill="#438BFF" opacity=".16" filter="url(#gl' + id + ')"/>' +
      inner +
      '</svg>'
    );
  }

  var CARD = 'fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.2)"';

  var ART = {
    mining: function () {
      var bars = '';
      var hs = [70, 110, 85, 130, 100];
      for (var i = 0; i < 5; i++) {
        bars += '<rect class="bar" style="animation-delay:' + i * 0.3 + 's" x="' + (335 + i * 34) + '" y="' + (230 - hs[i]) + '" width="20" height="' + hs[i] + '" rx="5" fill="url(#acM)"/>';
      }
      return wrap('M',
        // terraced open-pit
        '<path d="M30 250 L110 160 L190 250 Z" fill="#3b2f8f" opacity=".85"/>' +
        '<path d="M60 250 L110 195 L160 250 Z" fill="#5a46c9" opacity=".9"/>' +
        '<path d="M85 250 L110 222 L135 250 Z" fill="#76B7FF" opacity=".9"/>' +
        '<path d="M20 252 H215" stroke="rgba(255,255,255,.25)" stroke-width="2"/>' +
        '<path class="da" d="M200 200 C250 170 270 150 300 140" stroke="#76B7FF" stroke-width="2.5" fill="none"/>' +
        // dashboard
        '<rect x="300" y="50" width="300" height="200" rx="18" ' + CARD + '/>' +
        '<circle cx="324" cy="72" r="4" fill="#76B7FF"/><circle cx="340" cy="72" r="4" fill="#9B65FF"/>' +
        bars +
        '<circle cx="540" cy="150" r="38" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="10"/>' +
        '<circle class="pu" cx="540" cy="150" r="38" fill="none" stroke="url(#acM)" stroke-width="10" stroke-linecap="round" stroke-dasharray="170 240" transform="rotate(-90 540 150)"/>' +
        '<path d="M335 96 L380 82 L420 92 L470 66" stroke="#D9C8FF" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      );
    },

    railway: function () {
      var sl = '';
      var ys = [150, 165, 183, 205, 232, 266];
      for (var i = 0; i < ys.length; i++) {
        var half = 20 + (ys[i] - 130) * 0.9;
        sl += '<line x1="' + (320 - half) + '" y1="' + ys[i] + '" x2="' + (320 + half) + '" y2="' + ys[i] + '" stroke="rgba(255,255,255,.22)" stroke-width="3"/>';
      }
      var crowd = '';
      var pts = [[70,70,14],[100,95,10],[60,115,8],[130,65,9],[95,50,7],[560,60,13],[530,92,9],[585,100,8],[500,55,7]];
      for (var j = 0; j < pts.length; j++) {
        crowd += '<circle class="pu" style="animation-delay:' + j * 0.25 + 's" cx="' + pts[j][0] + '" cy="' + pts[j][1] + '" r="' + pts[j][2] + '" fill="#9B65FF" opacity=".55"/>';
      }
      return wrap('R',
        crowd +
        '<path d="M300 120 L120 300 M340 120 L520 300" stroke="#76B7FF" stroke-width="4" stroke-linecap="round" fill="none"/>' +
        sl +
        '<g class="fl">' +
        '<rect x="262" y="128" width="116" height="104" rx="22" fill="url(#acR)"/>' +
        '<rect x="276" y="142" width="88" height="44" rx="10" fill="#12113a" opacity=".85"/>' +
        '<circle cx="287" cy="208" r="7" fill="#fff"/><circle cx="353" cy="208" r="7" fill="#fff"/>' +
        '<circle cx="287" cy="208" r="16" fill="#fff" opacity=".25" filter="url(#glR)"/><circle cx="353" cy="208" r="16" fill="#fff" opacity=".25" filter="url(#glR)"/>' +
        '</g>'
      );
    },

    aura: function () {
      var w = '';
      var hs = [30, 60, 95, 55, 120, 70, 40, 85, 50, 25];
      for (var i = 0; i < hs.length; i++) {
        var left = i < 5;
        var x = left ? 70 + i * 36 : 400 + (i - 5) * 36;
        var h = left ? hs[i] : hs[9 - i];
        w += '<rect class="bar" style="animation-delay:' + (i * 0.18) + 's" x="' + x + '" y="' + (150 - h / 2) + '" width="14" height="' + h + '" rx="7" fill="url(#acA)"/>';
      }
      return wrap('A',
        w +
        '<circle cx="320" cy="150" r="108" fill="none" stroke="rgba(255,255,255,.12)" stroke-dasharray="4 8"/>' +
        '<circle class="pu" cx="320" cy="150" r="88" fill="#9B65FF" opacity=".25" filter="url(#glA)"/>' +
        '<circle class="pu" cx="320" cy="150" r="68" fill="url(#orbA)"/>' +
        '<circle cx="320" cy="150" r="46" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>' +
        '<rect x="312" y="124" width="16" height="34" rx="8" fill="#fff"/>' +
        '<path d="M300 150 a20 20 0 0 0 40 0 M320 172 v14" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
      );
    },

    medvision: function () {
      var net = '';
      var cols = [[500, [90, 150, 210]], [560, [70, 130, 190, 240]], [610, [120, 180]]];
      for (var a = 0; a < cols.length - 1; a++) {
        cols[a][1].forEach(function (y1) {
          cols[a + 1][1].forEach(function (y2) {
            net += '<line x1="' + cols[a][0] + '" y1="' + y1 + '" x2="' + cols[a + 1][0] + '" y2="' + y2 + '" stroke="rgba(118,183,255,.25)"/>';
          });
        });
      }
      cols.forEach(function (col) {
        col[1].forEach(function (y) { net += '<circle cx="' + col[0] + '" cy="' + y + '" r="6" fill="#76B7FF"/>'; });
      });
      return wrap('V',
        net +
        '<rect x="190" y="30" width="220" height="240" rx="22" fill="rgba(10,10,40,.7)" stroke="rgba(255,255,255,.2)"/>' +
        // stylised lungs
        '<path d="M300 90 C250 90 232 150 236 205 C238 232 270 236 285 215 C296 198 298 150 300 90 Z" fill="#3b2f8f" stroke="#76B7FF" stroke-width="2"/>' +
        '<path d="M300 90 C350 90 368 150 364 205 C362 232 330 236 315 215 C304 198 302 150 300 90 Z" fill="#3b2f8f" stroke="#76B7FF" stroke-width="2"/>' +
        '<path d="M300 60 V120" stroke="#9B65FF" stroke-width="5" stroke-linecap="round"/>' +
        '<circle class="pu" cx="338" cy="165" r="15" fill="#9B65FF" opacity=".8"/>' +
        // detection box
        '<path d="M312 140 h-8 v8 M364 140 h8 v8 M312 192 h-8 v-8 M364 192 h8 v-8" stroke="#5ee1ff" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(-6 -8)"/>' +
        '<rect class="sc" x="200" y="38" width="200" height="3" rx="2" fill="#5ee1ff" opacity=".9"/>' +
        '<path class="da" d="M410 150 C440 150 460 150 492 150" stroke="#76B7FF" stroke-width="2" fill="none"/>'
      );
    },

    genai: function () {
      return wrap('G',
        // doc stack
        '<rect x="60" y="78" width="120" height="150" rx="12" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.15)"/>' +
        '<rect x="48" y="62" width="120" height="150" rx="12" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)"/>' +
        '<rect x="36" y="46" width="120" height="150" rx="12" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)"/>' +
        '<g stroke="#76B7FF" stroke-width="5" stroke-linecap="round" opacity=".9"><line x1="54" y1="76" x2="136" y2="76"/><line x1="54" y1="98" x2="124" y2="98"/><line x1="54" y1="120" x2="136" y2="120"/><line x1="54" y1="142" x2="106" y2="142"/><line x1="54" y1="164" x2="130" y2="164"/></g>' +
        // arrows
        '<path class="da" d="M170 120 C210 120 230 140 262 148" stroke="#9B65FF" stroke-width="3" fill="none"/>' +
        '<path class="da" d="M378 148 C410 140 430 120 466 120" stroke="#9B65FF" stroke-width="3" fill="none"/>' +
        // sparkle
        '<path class="pu" d="M320 98 L334 134 L370 148 L334 162 L320 198 L306 162 L270 148 L306 134 Z" fill="url(#acG)" filter="url(#glG)" opacity=".7"/>' +
        '<path class="pu" d="M320 98 L334 134 L370 148 L334 162 L320 198 L306 162 L270 148 L306 134 Z" fill="url(#acG)"/>' +
        '<path d="M232 70 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 Z M404 214 l5 11 l11 5 l-11 5 l-5 11 l-5 -11 l-11 -5 l11 -5 Z" fill="#D9C8FF"/>' +
        // summary card
        '<rect x="466" y="70" width="140" height="130" rx="14" ' + CARD + '/>' +
        '<circle cx="492" cy="96" r="11" fill="#5ee1ff"/><path d="M486 96 l5 5 l9 -10" stroke="#12113a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g stroke="#D9C8FF" stroke-width="5" stroke-linecap="round"><line x1="484" y1="130" x2="586" y2="130"/><line x1="484" y1="152" x2="570" y2="152"/><line x1="484" y1="174" x2="548" y2="174"/></g>'
      );
    },

    market: function () {
      var bars = '';
      var hs = [30, 52, 40, 70, 58, 86];
      for (var i = 0; i < hs.length; i++) {
        bars += '<rect class="bar" style="animation-delay:' + i * 0.25 + 's" x="' + (70 + i * 26) + '" y="' + (250 - hs[i]) + '" width="16" height="' + hs[i] + '" rx="4" fill="url(#acK)" opacity=".85"/>';
      }
      return wrap('K',
        '<path d="M250 40 V250 H610" stroke="rgba(255,255,255,.25)" stroke-width="2" fill="none"/>' +
        '<g stroke="rgba(255,255,255,.07)"><line x1="250" y1="90" x2="610" y2="90"/><line x1="250" y1="140" x2="610" y2="140"/><line x1="250" y1="190" x2="610" y2="190"/></g>' +
        bars +
        '<circle class="pu" cx="330" cy="190" r="34" fill="#76B7FF" opacity=".55"/>' +
        '<circle class="pu" style="animation-delay:.5s" cx="430" cy="130" r="48" fill="#9B65FF" opacity=".6"/>' +
        '<circle class="pu" style="animation-delay:1s" cx="520" cy="170" r="26" fill="#5ee1ff" opacity=".55"/>' +
        '<circle class="pu" style="animation-delay:1.5s" cx="560" cy="85" r="36" fill="#D9C8FF" opacity=".5"/>' +
        '<path class="da" d="M270 220 L330 190 L430 130 L520 150 L580 70" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="580" cy="70" r="6" fill="#fff"/>'
      );
    }
  };

  var MATCH = [
    { re: /mining operations/i,          art: 'mining',    alt: 'Mining operations digital transformation dashboard' },
    { re: /railway/i,                    art: 'railway',   alt: 'Railway passenger analytics illustration' },
    { re: /aura/i,                       art: 'aura',      alt: 'AURA AI voice assistant orb and waveform' },
    { re: /medvision/i,                  art: 'medvision', alt: 'MedVision AI medical image analysis' },
    { re: /genai|business process/i,     art: 'genai',     alt: 'GenAI document processing workflow' },
    { re: /market intelligence|technology services/i, art: 'market', alt: 'Technology services market intelligence chart' }
  ];

  function projectImages() {
    var css = document.createElement('style');
    css.textContent =
      '.proj-art{display:block;width:100%;height:auto;border-radius:14px;margin:0 0 18px;' +
      'border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 30px rgba(67,139,255,.18);' +
      'transition:transform .4s ease,box-shadow .4s ease}' +
      '.proj-art:hover{transform:scale(1.025);box-shadow:0 14px 40px rgba(155,101,255,.35)}';
    document.head.appendChild(css);

    var scope = document.getElementById('projects') || document.body;
    var heads = Array.prototype.filter.call(scope.querySelectorAll('h3, h4'), function (h) {
      return MATCH.some(function (m) { return m.re.test(h.textContent); });
    });

    function count(el) {
      return heads.filter(function (h) { return el.contains(h); }).length;
    }

    heads.forEach(function (h) {
      var def = MATCH.filter(function (m) { return m.re.test(h.textContent); })[0];
      // climb to the card: the largest ancestor that still contains only this one project
      var card = h;
      while (card.parentElement && card.parentElement !== scope && count(card.parentElement) === 1) {
        card = card.parentElement;
      }
      if (card.querySelector('.proj-art')) return;

      var img = new Image();
      img.className = 'proj-art';
      img.loading = 'lazy';
      img.alt = def.alt;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ART[def.art]());

      var cs = getComputedStyle(card);
      if (cs.display.indexOf('flex') > -1 && cs.flexDirection.indexOf('row') === 0) {
        card.style.flexDirection = 'column';
      }
      card.insertBefore(img, card.firstChild);
    });
  }

  ready(function () {
    try { flowingBackground(); } catch (e) { console.error('flow bg:', e); }
    try { projectImages(); } catch (e) { console.error('project images:', e); }
  });
})();
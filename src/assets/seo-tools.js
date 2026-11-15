(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Meta title and description checker ---------- */
  var mt = $('kb-meta-tool');
  if (mt) {
    var TITLE_PX = 580, DESC_PX = 960;
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    var width = function (text, size) { ctx.font = size + 'px Arial, sans-serif'; return ctx.measureText(text).width; };
    var cut = function (text, size, max) {
      if (width(text, size) <= max) return text;
      var out = '';
      for (var i = 0; i < text.length; i++) { if (width(out + text[i] + '...', size) > max) break; out += text[i]; }
      return out.replace(/\s+\S*$/, '') + '...';
    };
    var bar = function (el, px, max) {
      var pct = Math.min(100, Math.round(px / max * 100));
      el.style.width = pct + '%';
      el.className = 'kb-bar-fill ' + (px > max ? 'over' : px > max * 0.9 ? 'near' : px < max * 0.5 ? 'short' : 'ok');
    };
    var run = function () {
      var t = $('kb-title').value.trim(), d = $('kb-desc').value.trim(), url = $('kb-url').value.trim() || 'https://www.example.co.uk/bouncy-castle-hire/';
      var place = $('kb-place').value.trim();
      var tpx = width(t, 20), dpx = width(d, 14);
      $('kb-title-count').textContent = t.length + ' characters, about ' + Math.round(tpx) + ' of ' + TITLE_PX + ' pixels';
      $('kb-desc-count').textContent = d.length + ' characters, about ' + Math.round(dpx) + ' of ' + DESC_PX + ' pixels';
      bar($('kb-title-bar'), tpx, TITLE_PX); bar($('kb-desc-bar'), dpx, DESC_PX);
      var host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      var crumbs = host.split('/'); var site = crumbs.shift();
      $('kb-serp-site').textContent = site.replace(/^www\./, '');
      $('kb-serp-url').textContent = 'https://' + site + (crumbs.length ? ' › ' + crumbs.join(' › ') : '');
      $('kb-serp-title').textContent = t ? cut(t, 20, TITLE_PX) : 'Your page title will appear here';
      $('kb-serp-desc').textContent = d ? cut(d, 14, DESC_PX) : 'Your meta description will appear here. Google may rewrite it, but a good one still helps people choose your result.';
      var tips = [];
      if (!t) tips.push(['info', 'Add a title to see the checks.']);
      else {
        if (tpx > TITLE_PX) tips.push(['bad', 'The title is likely to be cut off in Google. Move the most important words to the front or shorten it.']);
        else if (tpx < TITLE_PX * 0.5) tips.push(['warn', 'The title is quite short. There is room to add your main service or area.']);
        else tips.push(['good', 'The title should fit in Google without being cut off.']);
        if (place && t.toLowerCase().indexOf(place.toLowerCase()) === -1) tips.push(['warn', 'Your area, "' + place + '", isn\'t in the title. For local searches it usually should be.']);
        if (place && t.toLowerCase().indexOf(place.toLowerCase()) > -1) tips.push(['good', 'Your area is in the title.']);
        var words = t.toLowerCase().match(/[a-z']{4,}/g) || [], seen = {}, dup = [];
        words.forEach(function (w) { if (seen[w] && dup.indexOf(w) === -1) dup.push(w); seen[w] = 1; });
        if (dup.length) tips.push(['warn', 'Repeated words in the title: ' + dup.join(', ') + '. Repeating keywords rarely helps and can look spammy.']);
        if (t === t.toUpperCase() && /[A-Z]/.test(t)) tips.push(['warn', 'The title is all in capitals. Normal or title case is easier to read.']);
        if (t === t.toLowerCase() && /[a-z]/.test(t)) tips.push(['warn', 'The title is all lower case. Capitalising it looks more professional.']);
      }
      if (!d) tips.push(['info', 'Add a meta description to see the checks.']);
      else {
        if (dpx > DESC_PX) tips.push(['bad', 'The description is likely to be cut off. Keep the key message and call to action in the first part.']);
        else if (d.length < 70) tips.push(['warn', 'The description is short. Use the space to say what you offer, where, and why people should choose you.']);
        else tips.push(['good', 'The description length looks good.']);
        if (place && d.toLowerCase().indexOf(place.toLowerCase()) === -1) tips.push(['warn', 'Consider mentioning "' + place + '" or nearby towns in the description.']);
        if (!/\b(book|call|get|see|find|check|enquire|order|browse|view|contact)\b/i.test(d)) tips.push(['info', 'Try ending with a call to action, such as "Book online" or "Check availability".']);
        if (t && d.toLowerCase() === t.toLowerCase()) tips.push(['bad', 'The description is the same as the title. Use it to add new information.']);
      }
      $('kb-meta-tips').innerHTML = tips.map(function (x) { return '<li class="' + x[0] + '">' + esc(x[1]) + '</li>'; }).join('');
    };
    ['kb-title', 'kb-desc', 'kb-url', 'kb-place'].forEach(function (id) { $(id).addEventListener('input', run); });
    run();
  }

  /* ---------- Sitemap to URL list ---------- */
  var sm = $('kb-sitemap-tool');
  if (sm) {
    var last = [];
    var parse = function (xmlText) {
      var doc = new DOMParser().parseFromString(xmlText, 'application/xml');
      if (doc.getElementsByTagName('parsererror').length) throw new Error('That doesn\'t look like valid sitemap XML. Check you copied the whole file.');
      var isIndex = doc.getElementsByTagName('sitemapindex').length > 0;
      var nodes = doc.getElementsByTagName(isIndex ? 'sitemap' : 'url');
      var rows = [];
      for (var i = 0; i < nodes.length; i++) {
        var loc = nodes[i].getElementsByTagName('loc')[0], mod = nodes[i].getElementsByTagName('lastmod')[0];
        if (loc) rows.push({ url: loc.textContent.trim(), lastmod: mod ? mod.textContent.trim() : '' });
      }
      return { isIndex: isIndex, rows: rows };
    };
    var show = function (res) {
      var rows = res.rows, seen = {}, dups = 0, folders = {};
      rows.forEach(function (r) {
        if (seen[r.url]) dups++; seen[r.url] = 1;
        var path = r.url.replace(/^https?:\/\/[^/]+/, ''), f = (path.split('/')[1] || '(home page)');
        if (/\./.test(f) && path.split('/').length <= 2) f = '(top level)';
        folders[f] = (folders[f] || 0) + 1;
      });
      last = rows;
      var withMod = $('kb-lastmod').checked;
      $('kb-urls').value = rows.map(function (r) { return withMod && r.lastmod ? r.url + '\t' + r.lastmod : r.url; }).join('\n');
      var top = Object.keys(folders).sort(function (a, b) { return folders[b] - folders[a]; }).slice(0, 12);
      $('kb-sm-summary').innerHTML =
        '<p><strong>' + rows.length + '</strong> ' + (res.isIndex ? 'child sitemaps found. This is a sitemap index: open each one and paste it in to list its pages.' : 'URLs found.') +
        (dups ? ' <strong>' + dups + '</strong> duplicate' + (dups > 1 ? 's' : '') + '.' : ' No duplicates.') + '</p>' +
        (res.isIndex ? '' : '<table><thead><tr><th>Section</th><th>URLs</th></tr></thead><tbody>' + top.map(function (f) { return '<tr><td>' + esc(f) + '</td><td>' + folders[f] + '</td></tr>'; }).join('') + '</tbody></table>');
      $('kb-sm-results').hidden = false;
    };
    var go = function (text) {
      $('kb-sm-error').textContent = '';
      try { show(parse(text)); } catch (err) { $('kb-sm-error').textContent = err.message; $('kb-sm-results').hidden = true; }
    };
    $('kb-sm-go').addEventListener('click', function () { go($('kb-xml').value); });
    $('kb-file').addEventListener('change', function (ev) {
      var f = ev.target.files[0]; if (!f) return;
      if (/\.gz$/i.test(f.name) && window.DecompressionStream) {
        new Response(f.stream().pipeThrough(new DecompressionStream('gzip'))).text().then(function (t) { $('kb-xml').value = t; go(t); });
      } else { f.text().then(function (t) { $('kb-xml').value = t; go(t); }); }
    });
    $('kb-lastmod').addEventListener('change', function () { if (last.length) show({ isIndex: false, rows: last }); });
    $('kb-copy').addEventListener('click', function () {
      var ta = $('kb-urls'); ta.select();
      (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.reject()).then(function () { $('kb-copy').textContent = 'Copied'; setTimeout(function () { $('kb-copy').textContent = 'Copy list'; }, 1500); }, function () { document.execCommand('copy'); });
    });
    $('kb-csv').addEventListener('click', function () {
      var csv = 'url,lastmod\n' + last.map(function (r) { return '"' + r.url.replace(/"/g, '""') + '","' + r.lastmod + '"'; }).join('\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'sitemap-urls.csv'; a.click();
    });
  }

  /* ---------- Google review link generator ---------- */
  var rv = $('kb-review-tool');
  if (rv) {
    var link = '';
    var copy = function (text, btn) {
      var done = function () { var o = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = o; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done); else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); done(); }
    };
    var build = function () {
      var raw = $('kb-place-id').value.trim(), name = $('kb-biz').value.trim() || 'us';
      $('kb-rv-error').textContent = '';
      if (!raw) { $('kb-rv-out').hidden = true; return; }
      if (/^https?:\/\//i.test(raw)) {
        if (!/(google\.[a-z.]+|g\.page|goo\.gl|maps\.app\.goo\.gl)/i.test(raw)) { $('kb-rv-error').textContent = 'That link doesn\'t look like a Google link. Paste a Place ID or the review link from your Google Business Profile.'; $('kb-rv-out').hidden = true; return; }
        link = raw;
      } else if (/^[A-Za-z0-9_-]{15,}$/.test(raw)) {
        link = 'https://search.google.com/local/writereview?placeid=' + raw;
      } else { $('kb-rv-error').textContent = 'That doesn\'t look like a Place ID. They are a long string of letters and numbers, often starting "ChIJ".'; $('kb-rv-out').hidden = true; return; }
      $('kb-rv-link').value = link;
      $('kb-rv-test').href = link;
      if (window.qrcode) {
        var q = window.qrcode(0, 'M'); q.addData(link); q.make();
        $('kb-rv-qr').innerHTML = q.createSvgTag({ cellSize: 6, margin: 4, scalable: true });
      } else { $('kb-rv-qr').textContent = 'The QR code couldn\'t load. Refresh the page to try again.'; }
      var biz = name === 'us' ? 'us' : name;
      $('kb-msg-text').value = 'Thanks for choosing ' + biz + '! We hope you had a brilliant time. If you have a minute, a quick Google review would really help us: ' + link;
      $('kb-msg-email').value = 'Subject: Thank you, and a quick favour\n\nHi [name],\n\nThank you for booking with ' + biz + '. We hope everyone had a great time.\n\nIf you could spare a minute to leave us a Google review, it would mean a lot and helps other families find us:\n' + link + '\n\nThanks again,\n[your name]';
      $('kb-msg-card').value = 'Enjoyed your hire? Scan to leave us a Google review. It only takes a minute and helps other families find ' + (name === 'us' ? 'us' : name) + '.';
      $('kb-rv-out').hidden = false;
    };
    ['kb-place-id', 'kb-biz'].forEach(function (id) { $(id).addEventListener('input', build); });
    document.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { copy($(b.getAttribute('data-copy')).value, b); }); });
    $('kb-rv-png').addEventListener('click', function () {
      var svg = $('kb-rv-qr').querySelector('svg'); if (!svg) return;
      var data = new XMLSerializer().serializeToString(svg), img = new Image(), size = 1000;
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = c.height = size; var x = c.getContext('2d');
        x.fillStyle = '#fff'; x.fillRect(0, 0, size, size); x.drawImage(img, 0, 0, size, size);
        var a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'google-review-qr-code.png'; a.click();
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
    });
    build();
  }

  /* ---------- Missed bookings calculator ---------- */
  var mb = $('kb-missed-tool');
  if (mb) {
    var RATE = { '5': 45, '60': 40, '360': 30, '1440': 20, '2880': 10 };
    var gbp = function (n) { return '£' + Math.round(n).toLocaleString('en-GB'); };
    var syncRate = function () { if (!$('kb-mb-now').dataset.touched) $('kb-mb-now').value = RATE[$('kb-mb-reply').value]; };
    var calc = function () {
      var enq = parseFloat($('kb-mb-enq').value) || 0, val = parseFloat($('kb-mb-val').value) || 0, months = parseFloat($('kb-mb-months').value) || 0;
      var now = (parseFloat($('kb-mb-now').value) || 0) / 100, fast = (parseFloat($('kb-mb-fast').value) || 0) / 100;
      var bNow = enq * now, bFast = enq * fast, extra = Math.max(0, bFast - bNow);
      $('kb-mb-out').innerHTML = '<div class="kb-cards">' +
        '<div><span>Bookings now</span><b>' + Math.round(bNow) + '</b><small>a month in busy season</small></div>' +
        '<div><span>With fast replies</span><b>' + Math.round(bFast) + '</b><small>a month in busy season</small></div>' +
        '<div class="hl"><span>Extra bookings</span><b>' + Math.round(extra) + '</b><small>a month, worth about ' + gbp(extra * val) + '</small></div>' +
        '<div class="hl"><span>Over your busy season</span><b>' + gbp(extra * val * months) + '</b><small>across ' + months + ' month' + (months === 1 ? '' : 's') + '</small></div></div>' +
        (fast <= now ? '<p class="kb-count">Your replies are already fast, so there is little to gain here. Nice work.</p>' : '');
    };
    $('kb-mb-reply').addEventListener('change', function () { syncRate(); calc(); });
    $('kb-mb-now').addEventListener('input', function () { $('kb-mb-now').dataset.touched = '1'; });
    ['kb-mb-enq', 'kb-mb-val', 'kb-mb-months', 'kb-mb-now', 'kb-mb-fast'].forEach(function (id) { $(id).addEventListener('input', calc); });
    syncRate(); calc();
  }
})();

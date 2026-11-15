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

  var copyText = function (text, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = o; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done); else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); done(); }
  };
  document.querySelectorAll('[data-copy2]').forEach(function (b) { b.addEventListener('click', function () { copyText($(b.getAttribute('data-copy2')).value, b); }); });

  /* ---------- Word counter ---------- */
  var wc = $('kb-wc-tool');
  if (wc) {
    var STOP = 'a,an,and,are,as,at,be,but,by,for,from,has,have,i,if,in,into,is,it,its,of,on,or,our,so,that,the,their,them,there,they,this,to,was,we,were,will,with,you,your,can,all,not,no,yes,do,does,did,just,also,more,than,then,up,out,what,when,which,who,how,us,my,me,he,she,his,her,been,being,would,could,should,about,over,any,some,very,one,get,got,i\'m,it\'s,we\'re,you\'re'.split(',');
    var syll = function (w) { w = w.toLowerCase().replace(/[^a-z]/g, ''); if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, ''); var m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; };
    var LIMITS = [['Page title (approx.)', 60], ['Meta description (approx.)', 155], ['Google Business Profile description', 750], ['Google Business Profile post', 1500], ['X (Twitter) post', 280]];
    var count = function () {
      var t = $('kb-wc-text').value, words = t.match(/[A-Za-z0-9À-ɏ']+(?:[-'][A-Za-z0-9À-ɏ]+)*/g) || [];
      var chars = t.length, noSpace = t.replace(/\s/g, '').length;
      var sentences = (t.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (words.length ? 1 : 0);
      var paras = t.split(/\n\s*\n/).filter(function (x) { return x.trim(); }).length;
      var syl = words.reduce(function (a, w) { return a + syll(w); }, 0);
      var fre = words.length && sentences ? 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syl / words.length) : 0;
      var ease = !words.length ? '–' : fre >= 70 ? 'Easy' : fre >= 60 ? 'Plain English' : fre >= 50 ? 'Fairly hard' : 'Hard';
      var mins = function (wpm) { var m = words.length / wpm; return m < 1 ? Math.max(1, Math.round(m * 60)) + ' sec' : Math.round(m) + ' min'; };
      $('kb-wc-stats').innerHTML = '<div class="kb-cards">' +
        '<div><span>Words</span><b>' + words.length.toLocaleString('en-GB') + '</b></div>' +
        '<div><span>Characters</span><b>' + chars.toLocaleString('en-GB') + '</b><small>' + noSpace.toLocaleString('en-GB') + ' without spaces</small></div>' +
        '<div><span>Sentences</span><b>' + sentences + '</b><small>' + paras + ' paragraph' + (paras === 1 ? '' : 's') + '</small></div>' +
        '<div><span>Reading time</span><b>' + (words.length ? mins(200) : '–') + '</b><small>speaking: ' + (words.length ? mins(130) : '–') + '</small></div>' +
        '<div><span>Readability</span><b>' + (words.length ? Math.round(fre) : '–') + '</b><small>' + ease + ' (Flesch reading ease)</small></div></div>';
      var freq = {};
      words.forEach(function (w) { w = w.toLowerCase(); if (w.length > 2 && STOP.indexOf(w) === -1) freq[w] = (freq[w] || 0) + 1; });
      var top = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 10);
      $('kb-wc-top').innerHTML = top.length ? '<table><thead><tr><th>Word</th><th>Times</th><th>Share of words</th></tr></thead><tbody>' + top.map(function (w) { return '<tr><td>' + esc(w) + '</td><td>' + freq[w] + '</td><td>' + (freq[w] / words.length * 100).toFixed(1) + '%</td></tr>'; }).join('') + '</tbody></table>' : '<p class="kb-count">Type or paste some text to see your most-used words.</p>';
      $('kb-wc-limits').innerHTML = '<ul class="kb-tips">' + LIMITS.map(function (l) { var ok = chars <= l[1]; return '<li class="' + (chars ? (ok ? 'good' : 'bad') : 'info') + '">' + esc(l[0]) + ': ' + chars + ' of ' + l[1] + ' characters' + (chars && !ok ? ' (' + (chars - l[1]) + ' over)' : '') + '</li>'; }).join('') + '</ul>';
    };
    $('kb-wc-text').addEventListener('input', count); count();
  }

  /* ---------- Find and replace ---------- */
  var fr = $('kb-fr-tool');
  if (fr) {
    var addRow = function (f, r) {
      var d = document.createElement('div'); d.className = 'kb-fr-row';
      d.innerHTML = '<input type="text" aria-label="Find" placeholder="Find"><input type="text" aria-label="Replace with" placeholder="Replace with"><button type="button" class="sec" aria-label="Remove this pair">×</button>';
      d.children[0].value = f || ''; d.children[1].value = r || '';
      d.children[2].addEventListener('click', function () { d.remove(); run(); });
      d.addEventListener('input', run);
      $('kb-fr-rows').appendChild(d);
    };
    var run = function () {
      var text = $('kb-fr-in').value, total = 0, err = '';
      var flags = $('kb-fr-case').checked ? 'g' : 'gi', whole = $('kb-fr-whole').checked, rx = $('kb-fr-regex').checked;
      document.querySelectorAll('.kb-fr-row').forEach(function (row) {
        var f = row.children[0].value, r = row.children[1].value; if (!f) return;
        var pat = rx ? f : f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (whole) pat = '\\b' + pat + '\\b';
        try {
          var re = new RegExp(pat, flags), m = text.match(re); total += m ? m.length : 0;
          text = text.replace(re, rx ? r : r.replace(/\$/g, '$$$$'));
        } catch (e) { err = 'One of your patterns isn\'t valid: ' + e.message; }
      });
      $('kb-fr-out').value = text;
      $('kb-fr-count').textContent = err || (total + ' replacement' + (total === 1 ? '' : 's') + ' made');
    };
    $('kb-fr-add').addEventListener('click', function () { addRow(); });
    ['kb-fr-in', 'kb-fr-case', 'kb-fr-whole', 'kb-fr-regex'].forEach(function (id) { $(id).addEventListener('input', run); $(id).addEventListener('change', run); });
    addRow('Manchester', 'Stockport'); addRow('M1', 'SK1'); run();
  }

  /* ---------- HTML cleaner ---------- */
  var hc = $('kb-hc-tool');
  if (hc) {
    var opt = function (id) { return $(id).checked; };
    var KEEP_ATTR = ['href', 'src', 'alt', 'title', 'colspan', 'rowspan'];
    var toMd = function (node) {
      var out = '';
      node.childNodes.forEach(function (n) {
        if (n.nodeType === 3) { out += n.textContent.replace(/\s+/g, ' '); return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName.toLowerCase(), inner = toMd(n);
        if (/^h[1-6]$/.test(tag)) out += '\n\n' + '#'.repeat(+tag[1]) + ' ' + inner.trim() + '\n\n';
        else if (tag === 'p' || tag === 'div') out += '\n\n' + inner.trim() + '\n\n';
        else if (tag === 'br') out += '  \n';
        else if (tag === 'strong' || tag === 'b') out += inner.trim() ? '**' + inner.trim() + '**' : '';
        else if (tag === 'em' || tag === 'i') out += inner.trim() ? '_' + inner.trim() + '_' : '';
        else if (tag === 'a') out += '[' + inner.trim() + '](' + (n.getAttribute('href') || '') + ')';
        else if (tag === 'img') out += '![' + (n.getAttribute('alt') || '') + '](' + (n.getAttribute('src') || '') + ')';
        else if (tag === 'ul' || tag === 'ol') {
          var i = 0; out += '\n\n';
          n.childNodes.forEach(function (li) { if (li.nodeType === 1 && li.tagName.toLowerCase() === 'li') { i++; out += (tag === 'ol' ? i + '. ' : '- ') + toMd(li).trim().replace(/\n+/g, ' ') + '\n'; } });
          out += '\n';
        } else if (tag === 'blockquote') out += '\n\n> ' + inner.trim().replace(/\n+/g, '\n> ') + '\n\n';
        else if (tag === 'hr') out += '\n\n---\n\n';
        else if (tag === 'code') out += '`' + inner + '`';
        else out += inner;
      });
      return out;
    };
    var clean = function () {
      var src = $('kb-hc-in').value, doc = new DOMParser().parseFromString('<body>' + src + '</body>', 'text/html'), body = doc.body;
      body.querySelectorAll('script,style,meta,link,title,noscript,iframe,object,embed,form,input,button,xml').forEach(function (n) { n.remove(); });
      if (opt('kb-hc-comments')) { var w = doc.createTreeWalker(body, 128), c = [], x; while ((x = w.nextNode())) c.push(x); c.forEach(function (n) { n.remove(); }); }
      body.querySelectorAll('*').forEach(function (el) {
        var name = el.tagName.toLowerCase();
        if (name.indexOf(':') > -1) { el.replaceWith.apply(el, Array.prototype.slice.call(el.childNodes)); return; }
        Array.prototype.slice.call(el.attributes).forEach(function (a) {
          var n = a.name.toLowerCase();
          if (/^on/.test(n)) { el.removeAttribute(a.name); return; }
          if (opt('kb-hc-attrs') && KEEP_ATTR.indexOf(n) === -1) { el.removeAttribute(a.name); return; }
          if (opt('kb-hc-styles') && (n === 'style' || n === 'align' || n === 'face' || n === 'color' || n === 'size' || n === 'bgcolor' || n === 'width' || n === 'height')) el.removeAttribute(a.name);
          if (opt('kb-hc-classes') && (n === 'class' || n === 'id' || /^data-/.test(n) || /^aria-/.test(n) || n === 'dir' || n === 'lang')) el.removeAttribute(a.name);
          if (n === 'href' && /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
        });
      });
      if (opt('kb-hc-spans')) body.querySelectorAll('span,font').forEach(function (el) { el.replaceWith.apply(el, Array.prototype.slice.call(el.childNodes)); });
      if (opt('kb-hc-empty')) { for (var k = 0; k < 3; k++) body.querySelectorAll('p,span,div,strong,b,em,i,u,h1,h2,h3,h4,h5,h6,li,a:not([href])').forEach(function (el) { if (!el.textContent.replace(/ /g, ' ').trim() && !el.querySelector('img,br,hr,iframe')) el.remove(); }); }
      var html = body.innerHTML.replace(/&nbsp;/g, opt('kb-hc-nbsp') ? ' ' : '&nbsp;').replace(/\n{3,}/g, '\n\n').trim();
      var md = opt('kb-hc-md');
      $('kb-hc-out').value = md ? toMd(body).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() : html;
      $('kb-hc-out-label').textContent = md ? 'Cleaned Markdown' : 'Cleaned HTML';
      $('kb-hc-stats').textContent = src.length ? 'Before: ' + src.length.toLocaleString('en-GB') + ' characters. After: ' + $('kb-hc-out').value.length.toLocaleString('en-GB') + ' characters.' : '';
      $('kb-hc-preview').srcdoc = '<!doctype html><meta charset="utf-8"><style>body{font:15px/1.5 Arial,sans-serif;color:#222;margin:12px}img{max-width:100%}</style>' + html;
    };
    hc.addEventListener('input', clean); hc.addEventListener('change', clean); clean();
  }

  /* ---------- Local business schema generator ---------- */
  var sg = $('kb-schema-tool');
  if (sg) {
    var val = function (id) { return $(id).value.trim(); };
    var list = function (id, sep) { return val(id).split(sep).map(function (x) { return x.trim(); }).filter(Boolean); };
    var gen = function () {
      var o = { '@context': 'https://schema.org', '@type': val('kb-sg-type') };
      if (val('kb-sg-name')) o.name = val('kb-sg-name');
      if (val('kb-sg-desc')) o.description = val('kb-sg-desc');
      if (val('kb-sg-url')) { o.url = val('kb-sg-url'); o['@id'] = val('kb-sg-url').replace(/\/?$/, '/') + '#business'; }
      if (val('kb-sg-logo')) o.logo = val('kb-sg-logo');
      if (val('kb-sg-image')) o.image = val('kb-sg-image');
      if (val('kb-sg-phone')) o.telephone = val('kb-sg-phone');
      if (val('kb-sg-email')) o.email = val('kb-sg-email');
      var addr = { '@type': 'PostalAddress' }, hide = $('kb-sg-hide').checked;
      if (val('kb-sg-street') && !hide) addr.streetAddress = val('kb-sg-street');
      if (val('kb-sg-town')) addr.addressLocality = val('kb-sg-town');
      if (val('kb-sg-region')) addr.addressRegion = val('kb-sg-region');
      if (val('kb-sg-postcode') && !hide) addr.postalCode = val('kb-sg-postcode');
      addr.addressCountry = val('kb-sg-country') || 'GB';
      if (Object.keys(addr).length > 2) o.address = addr;
      var areas = list('kb-sg-areas', ',');
      if (areas.length) o.areaServed = areas.map(function (a) { return { '@type': 'City', name: a }; });
      var days = Array.prototype.slice.call(document.querySelectorAll('.kb-sg-day:checked')).map(function (c) { return c.value; });
      if (days.length && val('kb-sg-open') && val('kb-sg-close')) o.openingHoursSpecification = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: val('kb-sg-open'), closes: val('kb-sg-close') }];
      if (val('kb-sg-price')) o.priceRange = val('kb-sg-price');
      var same = list('kb-sg-same', /\n/);
      if (same.length) o.sameAs = same;
      $('kb-sg-out').value = '<script type="application/ld+json">\n' + JSON.stringify(o, null, 2) + '\n</' + 'script>';
      var warn = [];
      if (!o.name) warn.push(['bad', 'Add your business name.']);
      if (!o.url) warn.push(['warn', 'Add your website address.']);
      if (!o.telephone) warn.push(['warn', 'Add a phone number, written the same way as on your Google Business Profile.']);
      if (!o.address) warn.push(['warn', 'Add at least your town and county.']);
      if (hide) warn.push(['info', 'Your street address and postcode are left out, which suits businesses that travel to customers and hide their address on Google.']);
      if (!warn.length) warn.push(['good', 'Looks complete. Test it before adding it to your site.']);
      $('kb-sg-tips').innerHTML = warn.map(function (x) { return '<li class="' + x[0] + '">' + esc(x[1]) + '</li>'; }).join('');
    };
    sg.addEventListener('input', gen); sg.addEventListener('change', gen); gen();
  }
})();

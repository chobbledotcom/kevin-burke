---
title: "HTML Cleaner: Strip Word and Google Docs Junk | Free Tool"
heading: "HTML Cleaner"
description: "Free HTML cleaner. Paste messy HTML from Word, Google Docs or an old website and remove inline styles, spans, empty tags and junk, or convert it to Markdown."
hide_related: true
---

<link rel="stylesheet" href="/assets/seo-tools.css">

Copying content from Word, Google Docs or an old website brings a lot of hidden junk with it: inline styles, fonts, empty tags and endless spans. That clutter can break your site's design and bloat your pages. Paste the HTML below, pick what to remove, and copy back clean code.

<div class="kb-tool" id="kb-hc-tool">
<label for="kb-hc-in">Paste your HTML</label>
<textarea id="kb-hc-in" class="kb-mono" rows="9">&lt;p class="MsoNormal" style="margin:0cm;font-family:Calibri"&gt;&lt;span style="font-size:12pt"&gt;&lt;b&gt;Bouncy castle hire&lt;/b&gt; in &lt;font color="#333"&gt;Stockport&lt;/font&gt;&lt;/span&gt;&lt;o:p&gt;&lt;/o:p&gt;&lt;/p&gt;
&lt;p style="margin:0cm"&gt;&lt;span&gt;&amp;nbsp;&lt;/span&gt;&lt;/p&gt;
&lt;p dir="ltr" id="docs-internal-guid-123"&gt;&lt;span style="color:#000000"&gt;Delivered, set up and collected.&lt;/span&gt;&lt;/p&gt;</textarea>
<div class="kb-opts">
<label class="kb-check"><input type="checkbox" id="kb-hc-styles" checked> Remove inline styles and fonts</label>
<label class="kb-check"><input type="checkbox" id="kb-hc-classes" checked> Remove classes, IDs and data attributes</label>
<label class="kb-check"><input type="checkbox" id="kb-hc-spans" checked> Unwrap span and font tags</label>
<label class="kb-check"><input type="checkbox" id="kb-hc-empty" checked> Remove empty tags</label>
<label class="kb-check"><input type="checkbox" id="kb-hc-comments" checked> Remove comments</label>
<label class="kb-check"><input type="checkbox" id="kb-hc-nbsp" checked> Turn non-breaking spaces into normal spaces</label>
<label class="kb-check"><input type="checkbox" id="kb-hc-attrs"> Remove all attributes except links, images and alt text</label>
<label class="kb-check"><input type="checkbox" id="kb-hc-md"> Convert to Markdown</label>
</div>
<p class="kb-count" id="kb-hc-stats" aria-live="polite"></p>
<label for="kb-hc-out" id="kb-hc-out-label">Cleaned HTML</label>
<textarea id="kb-hc-out" class="kb-mono" rows="9" readonly></textarea>
<div class="kb-actions"><button type="button" data-copy2="kb-hc-out">Copy cleaned code</button></div>
<label>Preview</label>
<iframe class="kb-preview" id="kb-hc-preview" sandbox="" title="Preview of the cleaned HTML"></iframe>
</div>

<script src="/assets/seo-tools.js" defer></script>

## What the cleaner always removes

For safety and tidiness, it always strips scripts, style blocks, forms, embedded frames, Word's special "o:p" tags and any "on-click" style code, whatever options you choose. The preview runs in a locked-down frame, so pasted code can't do anything on your computer.

## When to use it

- **Moving content to a new website**, so old styles don't fight with your new design.
- **Pasting from Word or Google Docs** into a website editor that shows the HTML.
- **Converting to Markdown** for sites built with Markdown, such as many modern website builders and this site.

See all my [free SEO tools](/seo-tools/), or [get in touch](/contact/) if you're moving to a new website and want to keep your rankings.

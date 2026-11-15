---
title: "Find and Replace Text Tool | Multiple Replacements at Once"
heading: "Find and Replace"
description: "Free online find and replace tool. Swap several words or phrases at once, with match case, whole words and pattern options. Copy the result in one click."
hide_related: true
---

<link rel="stylesheet" href="/assets/seo-tools.css">

Paste your text, add the words you want to swap, and copy the result. You can make several replacements in one go, which is handy for turning one page into a template for another town or product.

<div class="kb-tool" id="kb-fr-tool">
<label for="kb-fr-in">Your text</label>
<textarea id="kb-fr-in" rows="8">Bouncy castle hire in Manchester. We deliver across Manchester and the M1 postcode area, so if you're planning a party in Manchester, get in touch.</textarea>
<label>Find and replace</label>
<div id="kb-fr-rows"></div>
<div class="kb-actions"><button type="button" class="sec" id="kb-fr-add">+ Add another</button></div>
<div class="kb-opts">
<label class="kb-check"><input type="checkbox" id="kb-fr-case"> Match case</label>
<label class="kb-check"><input type="checkbox" id="kb-fr-whole" checked> Whole words only</label>
<label class="kb-check"><input type="checkbox" id="kb-fr-regex"> Use patterns (regular expressions)</label>
</div>
<p class="kb-count" id="kb-fr-count" aria-live="polite"></p>
<label for="kb-fr-out">Result</label>
<textarea id="kb-fr-out" rows="8" readonly></textarea>
<div class="kb-actions"><button type="button" data-copy2="kb-fr-out">Copy result</button></div>
</div>

<script src="/assets/seo-tools.js" defer></script>

## Tips

- **Replacements run in order, top to bottom**, so each one works on the result of the one before.
- **"Whole words only"** stops "Bury" changing the middle of "Burying". Turn it off to replace part of a word.
- **Patterns** are for advanced users. For example, `\s{2,}` finds double spaces, and `$1` in the replacement reuses a matched group.

**A word of warning on town pages:** swapping the town name is a good way to start a new page, not a way to finish one. Google treats near-identical pages as low quality. Each town page needs its own local detail: venues, parks, schools and the places you deliver to. My [town pages guide](/bouncy-castle-town-pages-guide/) explains how.

See all my [free SEO tools](/seo-tools/).

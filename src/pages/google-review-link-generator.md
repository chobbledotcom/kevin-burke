---
title: "Google Review Link Generator and QR Code | Free Tool"
heading: "Google Review Link Generator"
description: "Free Google review link generator. Create a link that opens your review box, a QR code for flyers and vans, and ready-made thank-you messages for customers."
hide_related: true
---

<link rel="stylesheet" href="/assets/seo-tools.css">

The easier you make it, the more reviews you get. This tool turns your Google Place ID into a link that opens the "write a review" box straight away, plus a QR code and thank-you messages you can send after every hire.

<div class="kb-tool" id="kb-review-tool">
<label for="kb-place-id">Your Google Place ID, or the review link from your Google Business Profile</label>
<input type="text" id="kb-place-id" placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4">
<label for="kb-biz">Your business name (for the messages)</label>
<input type="text" id="kb-biz" placeholder="e.g. Jumping Jacks Castles">
<p class="kb-error" id="kb-rv-error" role="alert"></p>
<div id="kb-rv-out" hidden>
<div class="kb-out-box">
<label for="kb-rv-link">Your review link</label>
<input type="text" id="kb-rv-link" readonly>
<div class="kb-actions kb-rv-actions"><button type="button" data-copy="kb-rv-link">Copy link</button><a class="kb-btn" id="kb-rv-test" href="#" target="_blank" rel="noopener">Test it</a></div>
</div>
<div class="kb-split" style="margin-top:1rem">
<div><div class="kb-qr" id="kb-rv-qr"></div><div class="kb-actions"><button type="button" class="sec" id="kb-rv-png">Download QR code</button></div></div>
<div>
<label for="kb-msg-text">Text or WhatsApp message</label>
<textarea id="kb-msg-text" rows="4"></textarea>
<div class="kb-actions"><button type="button" class="sec" data-copy="kb-msg-text">Copy message</button></div>
<label for="kb-msg-email">Email</label>
<textarea id="kb-msg-email" rows="8"></textarea>
<div class="kb-actions"><button type="button" class="sec" data-copy="kb-msg-email">Copy email</button></div>
<label for="kb-msg-card">Words for a card or flyer next to the QR code</label>
<textarea id="kb-msg-card" rows="3"></textarea>
<div class="kb-actions"><button type="button" class="sec" data-copy="kb-msg-card">Copy text</button></div>
</div>
</div>
</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"></script>
<script src="/assets/seo-tools.js" defer></script>

## How to find your Place ID

You have two easy options:

1. **Google's Place ID Finder.** Open the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id), type your business name into the map's search box and pick your listing. Copy the ID it shows, usually starting "ChIJ", and paste it above.
2. **Your Google Business Profile.** Search for your business on Google while signed in, choose "Ask for reviews" or "Get more reviews", and copy the link it gives you. Paste that whole link above instead of a Place ID.

Always press "Test it" before you print anything, to check the link opens your own review box.

## Getting more reviews from your hires

- **Ask straight after the event**, while the party is still fresh. A text the same evening or the next morning works best.
- **Put the QR code where customers see it:** on invoices, delivery notes, the side of the van and a card left with the castle.
- **Reply to every review**, good or bad. It shows future customers you care, and reviews that mention your town and what was hired help with local searches.
- **Never offer discounts or freebies for reviews.** Google's rules don't allow it, and reviews can be removed.

For the full approach, read my [bouncy castle reviews guide](/bouncy-castle-reviews-guide/), or see all my [free SEO tools](/seo-tools/).

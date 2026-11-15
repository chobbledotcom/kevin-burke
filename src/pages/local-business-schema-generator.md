---
title: "Local Business Schema Generator | Free JSON-LD Tool"
heading: "Local Business Schema Generator"
description: "Free local business schema generator. Fill in your details and get JSON-LD structured data with your address or service areas, phone, hours and social links."
hide_related: true
---

<link rel="stylesheet" href="/assets/seo-tools.css">

Schema markup is a small block of code that tells search engines your business details in a format they can read reliably: your name, phone number, where you're based, the areas you cover and your opening hours. Fill in the form and copy the code into your website.

<div class="kb-tool" id="kb-schema-tool">
<div class="kb-row">
<div><label for="kb-sg-name">Business name</label><input type="text" id="kb-sg-name" value="Jumping Jacks Castles"></div>
<div><label for="kb-sg-type">Type of business</label><select id="kb-sg-type"><option value="LocalBusiness">Local business (general)</option><option value="EntertainmentBusiness">Entertainment business</option><option value="ProfessionalService">Professional service</option><option value="Store">Shop</option></select></div>
</div>
<label for="kb-sg-desc">Short description</label>
<input type="text" id="kb-sg-desc" value="Bouncy castle and soft play hire for parties across Stockport and south Manchester.">
<div class="kb-row">
<div><label for="kb-sg-url">Website</label><input type="url" id="kb-sg-url" value="https://www.example.co.uk/"></div>
<div><label for="kb-sg-phone">Phone number</label><input type="text" id="kb-sg-phone" value="0161 000 0000"></div>
</div>
<div class="kb-row">
<div><label for="kb-sg-email">Email (optional)</label><input type="text" id="kb-sg-email"></div>
<div><label for="kb-sg-price">Price range (optional, e.g. ££)</label><input type="text" id="kb-sg-price"></div>
</div>
<div class="kb-row">
<div><label for="kb-sg-logo">Logo image URL (optional)</label><input type="url" id="kb-sg-logo"></div>
<div><label for="kb-sg-image">Photo URL (optional)</label><input type="url" id="kb-sg-image"></div>
</div>
<h3>Address</h3>
<label class="kb-check"><input type="checkbox" id="kb-sg-hide" checked> I travel to customers and don't show my street address</label>
<div class="kb-row">
<div><label for="kb-sg-street">Street address</label><input type="text" id="kb-sg-street"></div>
<div><label for="kb-sg-town">Town</label><input type="text" id="kb-sg-town" value="Stockport"></div>
</div>
<div class="kb-row">
<div><label for="kb-sg-region">County</label><input type="text" id="kb-sg-region" value="Greater Manchester"></div>
<div><label for="kb-sg-postcode">Postcode</label><input type="text" id="kb-sg-postcode"></div>
</div>
<input type="hidden" id="kb-sg-country" value="GB">
<label for="kb-sg-areas">Areas you cover (separate with commas)</label>
<input type="text" id="kb-sg-areas" value="Stockport, Cheadle, Bramhall, Didsbury, Hazel Grove">
<h3>Opening hours (optional)</h3>
<div class="kb-days">
<label class="kb-check"><input type="checkbox" class="kb-sg-day" value="Monday" checked> Mon</label>
<label class="kb-check"><input type="checkbox" class="kb-sg-day" value="Tuesday" checked> Tue</label>
<label class="kb-check"><input type="checkbox" class="kb-sg-day" value="Wednesday" checked> Wed</label>
<label class="kb-check"><input type="checkbox" class="kb-sg-day" value="Thursday" checked> Thu</label>
<label class="kb-check"><input type="checkbox" class="kb-sg-day" value="Friday" checked> Fri</label>
<label class="kb-check"><input type="checkbox" class="kb-sg-day" value="Saturday" checked> Sat</label>
<label class="kb-check"><input type="checkbox" class="kb-sg-day" value="Sunday"> Sun</label>
</div>
<div class="kb-row">
<div><label for="kb-sg-open">Opens</label><input type="text" id="kb-sg-open" value="09:00"></div>
<div><label for="kb-sg-close">Closes</label><input type="text" id="kb-sg-close" value="18:00"></div>
</div>
<label for="kb-sg-same">Social and listing links (one per line)</label>
<textarea id="kb-sg-same" rows="3">https://www.facebook.com/yourpage</textarea>
<ul class="kb-tips" id="kb-sg-tips"></ul>
<label for="kb-sg-out">Your schema code</label>
<textarea id="kb-sg-out" class="kb-mono" rows="14" readonly></textarea>
<div class="kb-actions"><button type="button" data-copy2="kb-sg-out">Copy code</button></div>
</div>

<script src="/assets/seo-tools.js" defer></script>

## How to add it to your website

1. **Copy the code** and paste it into the head section of your home page, or into a "custom code" or "header scripts" box if your website builder has one. WordPress users can use a plugin that allows header code.
2. **Test it** with Google's [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/).
3. **Keep it matching** your Google Business Profile, Facebook page and directory listings: same name, same phone number written the same way, same areas.

## What schema does, and doesn't, do

Schema helps search engines understand and trust your business details, and it's one of the signals that ties your website to your Google Business Profile. It won't jump you up the rankings on its own, and Google decides whether to use it. For local businesses, a complete, active [Google Business Profile](/bouncy-castle-google-business-profile-guide/) and good reviews matter more, so do those first.

See all my [free SEO tools](/seo-tools/), or read about my [local SEO service](/local-seo/).

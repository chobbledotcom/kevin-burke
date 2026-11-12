---
title: "Sitemap to URL List Converter | Free XML Sitemap Tool"
heading: "Sitemap to URL List"
description: "Free tool to turn an XML sitemap into a plain list of URLs. Paste or upload a sitemap, spot duplicates, see pages by section, and copy or download a CSV."
hide_related: true
---

<link rel="stylesheet" href="/assets/seo-tools.css">

Paste the contents of an XML sitemap, or upload the file, and get a clean list of every URL in it. It's handy for checking which pages a site has, planning redirects or building a spreadsheet for an SEO audit.

<div class="kb-tool" id="kb-sitemap-tool">
<label for="kb-xml">Paste your sitemap XML</label>
<textarea id="kb-xml" rows="8" placeholder="&lt;urlset&gt;&lt;url&gt;&lt;loc&gt;https://www.example.co.uk/&lt;/loc&gt;&lt;/url&gt;...&lt;/urlset&gt;"></textarea>
<label for="kb-file">Or upload a sitemap file (.xml or .xml.gz)</label>
<input type="file" id="kb-file" accept=".xml,.gz,text/xml,application/xml">
<div class="kb-actions"><button type="button" id="kb-sm-go">Get the URLs</button><label style="margin:0;font-weight:400"><input type="checkbox" id="kb-lastmod"> Include last modified dates</label></div>
<p class="kb-error" id="kb-sm-error" role="alert"></p>
<div id="kb-sm-results" hidden>
<div id="kb-sm-summary"></div>
<label for="kb-urls">URL list</label>
<textarea id="kb-urls" rows="12" readonly></textarea>
<div class="kb-actions"><button type="button" id="kb-copy">Copy list</button><button type="button" class="sec" id="kb-csv">Download CSV</button></div>
</div>
</div>

<script src="/assets/seo-tools.js" defer></script>

## Where to find a sitemap

Most websites have a sitemap at one of these addresses. Open it in your browser, select everything and copy it in:

- **/sitemap.xml**, for example yoursite.co.uk/sitemap.xml
- **/sitemap_index.xml** on WordPress sites using Yoast or Rank Math
- **/wp-sitemap.xml** on other WordPress sites
- The address listed in the site's **/robots.txt** file, after "Sitemap:"

If the sitemap is a sitemap index (a list of other sitemaps), the tool lists those first. Open each one and paste it in to get its pages.

## Why the tool doesn't fetch sitemaps for you

Most websites block other sites from reading their files directly in the browser, so a tool like this can't reliably fetch a sitemap from a web address. Pasting or uploading works every time, and it means nothing you check is sent to me or anyone else.

Need help with what you find, such as missing pages, old URLs or duplicates? [Get in touch](/contact/), or try the [meta title and description checker](/meta-title-checker/). See all [free SEO tools](/seo-tools/).

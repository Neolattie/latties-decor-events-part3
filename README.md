# Lattie's Decor & Events - WEDE5020 Portfolio of Evidence

A responsive, multi-page website for **Lattie's Decor & Events**, a wedding, birthday, baby shower, graduation and memorial decor business with studios in **Midrand** and **Sandton**, Gauteng, South Africa.

| | |
|---|---|
| **Live website** | https://latties-decor-events.netlify.app *(replace with your final deployed URL)* |
| **GitHub repository** | https://github.com/YOUR-USERNAME/latties-decor-events *(replace with your repository link)* |
| **Module** | WEDE5020 - Web Development (The IIE / Rosebank College) |
| **Student** | Neo (replace with full name and student number) |

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Technologies used](#2-technologies-used)
3. [Folder structure](#3-folder-structure)
4. [Pages](#4-pages)
5. [Part 3 features](#5-part-3-features)
6. [Search engine optimisation (SEO)](#6-search-engine-optimisation-seo)
7. [Forms, validation and AJAX](#7-forms-validation-and-ajax)
8. [Responsive design](#8-responsive-design)
9. [Security and performance](#9-security-and-performance)
10. [Running the site locally](#10-running-the-site-locally)
11. [Deployment](#11-deployment)
12. [Part 3 requirements checklist](#12-part-3-requirements-checklist)
13. [Changelog](#13-changelog)
14. [AI tool disclosure](#14-ai-tool-disclosure)
15. [References](#15-references)

---

## 1. Project overview

Lattie's Decor & Events transforms meaningful occasions into unforgettable experiences with elegance, thoughtfulness and artistry. The website lets visitors:

- learn about the business and its services,
- browse and search decor packages and a photo gallery,
- find the Midrand and Sandton studios on an interactive map,
- request a personalised quote with an instant cost and availability response, and
- send a general message to the team.

The design uses a silk-drape background, a soft grey palette with a muted gold accent and Georgia serif typography to reflect the brand's elegant, luxurious aesthetic.

## 2. Technologies used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure, forms, accessibility attributes |
| CSS3 | Layout (Grid/Flexbox), animations, media queries, custom properties |
| JavaScript (ES6) | Navigation, dynamic content, search/filter, validation, AJAX |
| jQuery 3.6.1 (local copy in `js_assets/vendor/`) | Tabs, accordion and modal |
| Leaflet 1.9.4 (loaded from unpkg CDN) + OpenStreetMap tiles | Interactive studio map |
| FormSubmit (free service) | Receives the AJAX enquiry submission and emails it to the business |
| Netlify | Free hosting and security headers |
| Git & GitHub | Version control |

## 3. Folder structure

```
latties-decor-events/
|-- index.html            Home
|-- about.html            About (tabs + accordion FAQ)
|-- services.html         Services (dynamic packages, search, sort, modal)
|-- gallery.html          Gallery (filter + lightbox)
|-- enquiry.html          Quote enquiry form (validation + AJAX)
|-- contact.html          Contact form + interactive map
|-- 404.html              Custom "page not found"
|-- robots.txt            Crawler instructions
|-- sitemap.xml           Site map for search engines
|-- _headers              Security and caching headers (Netlify)
|-- favicon.png
|-- README.md
|-- css_assets/
|   `-- style.css         All site styles + responsive breakpoints
|-- js_assets/
|   |-- main.js           Navigation, scroll animations, back-to-top
|   |-- ui-widgets.js     jQuery tabs, accordion, modal
|   |-- packages-data.js  Package content used by the dynamic listing
|   |-- services.js       Dynamic package cards, search, filter, sort
|   |-- gallery.js        Gallery filter and lightbox
|   |-- map.js            Leaflet map
|   |-- forms.js          Validation, estimate, AJAX and email compile
|   `-- vendor/           jQuery 3.6.1 and its licence
`-- _images/              Optimised images with descriptive file names
```

## 4. Pages

| Page | Purpose |
|---|---|
| **Home** (`index.html`) | Hero, signature gallery preview, reasons to choose Lattie's |
| **About** (`about.html`) | Story / Promise / Process tabs and an FAQ accordion |
| **Services** (`services.html`) | Service overview plus searchable, sortable package listing with detail modal |
| **Gallery** (`gallery.html`) | Filterable photo gallery with lightbox |
| **Enquiry / Quote** (`enquiry.html`) | Enquiry form about services/packages, returns cost and availability |
| **Contact** (`contact.html`) | Studio details, interactive map and general message form |

## 5. Part 3 features

### 5.1 Interactive elements (jQuery)
- **Tabs** (About page) with keyboard support (arrow keys, Home, End) and ARIA roles.
- **Accordion** (About page FAQ) - one panel open at a time with slide animation.
- **Modal** (Services page) - "View details" opens a package pop-up; closes with the X button, the backdrop or Escape; keyboard focus is trapped inside while open.

### 5.2 Interactive map (Leaflet)
The Contact page shows both studios on an OpenStreetMap map. Buttons fly to a studio and open its popup. Scroll-zoom is enabled only after the map is clicked so it does not trap page scrolling on phones. If Leaflet cannot load, a text fallback is shown.
*Note: markers show the approximate centre of each suburb because the exact street addresses are not published on the site.*

### 5.3 Animations and transitions (CSS + JavaScript)
- CSS keyframes for hero entrance, card fade-ups, modal pop-in and lightbox fade.
- Hover transitions on cards, buttons, gallery images and navigation.
- **Scroll-reveal** with `IntersectionObserver` - sections fade in as they enter the screen.
- Animated hamburger icon, back-to-top button fade.
- All motion is disabled for visitors who choose "reduce motion" in their system settings.

### 5.4 Advanced DOM manipulation
`document.createElement`, `DocumentFragment`, `replaceChildren`, `dataset` attributes, **event delegation** (one click listener for all package buttons / gallery thumbnails), `classList` toggling, ARIA state updates (`aria-expanded`, `aria-selected`, `aria-pressed`, `aria-live`) and `IntersectionObserver`. User input is always inserted with `textContent`, never `innerHTML`, which prevents HTML injection.

### 5.5 Gallery with lightbox
Eight event photos are built dynamically with category filters (All, Weddings, Birthdays & Parties, Baby Showers, Graduations, Memorials). Clicking a photo opens a lightbox with previous/next buttons, arrow-key navigation, Escape to close, a caption and focus that returns to the thumbnail on close.

### 5.6 Dynamic content and search
`services.html` builds eight package cards from the data array in `packages-data.js`. Visitors can:
- **search** by keyword (name, category, summary, inclusions),
- **filter** by event type (the dropdown is generated from the data), and
- **sort** by name or price (low-high / high-low).

A live result count is announced to screen readers and a friendly message shows when nothing matches. *Package prices are example "from" prices - replace them with the business's real prices in `packages-data.js`.*

## 6. Search engine optimisation (SEO)

### 6.1 On-page SEO

| Technique | Implementation |
|---|---|
| **Keyword research** | Target phrases chosen for the service and the area: *event decor Gauteng, wedding decor Midrand, event decorator Sandton, baby shower decor, birthday decor, memorial service decor*. Used naturally in titles, headings, descriptions, alt text and body copy. |
| **Title tags** | Unique, under about 60 characters, page topic first and brand last (e.g. "Event Decor Services & Packages \| Lattie's Decor & Events"). |
| **Meta descriptions** | Unique 120-160 character summary with a call to action on every page. |
| **Header tags** | Exactly one `<h1>` per page (the logo text is no longer an `<h1>`), followed by a logical `<h2>`/`<h3>` hierarchy. |
| **Image optimisation** | Descriptive hyphenated file names (e.g. `baby-shower-balloon-garden-decor.jpg`), descriptive `alt` text, compressed JPEGs, `srcset`/`sizes`, `width`/`height`, `loading="lazy"`. |
| **URL structure** | Short lowercase page names (`services.html`, `gallery.html`), no spaces or special characters; repository folder renamed from `lattie's decor&events` to `latties-decor-events`. |
| **Internal linking** | Navigation, footer links, call-to-action buttons and in-text links (e.g. FAQ -> enquiry/packages, gallery -> enquiry). |
| **Mobile-friendliness** | Viewport meta tag, responsive layout, full-width tap targets in the mobile menu, hamburger menu. |
| **Structured data** | JSON-LD `LocalBusiness` markup on the home page (name, logo, phone, email, region, opening hours). |
| **Social sharing** | Open Graph and Twitter Card tags on every page; canonical URL on every page. |

### 6.2 Off-page SEO (plan)
These actions happen outside the code, so they are recorded here as the business's plan:

| Technique | Plan |
|---|---|
| **Backlinks** | Ask venues, florists and photographers the business works with to link to the website; list the business on South African directories. |
| **Social media** | Share gallery photos and the site link on Instagram, Facebook and WhatsApp Business; add the profile links to the `sameAs` property of the JSON-LD once they exist. |
| **Local SEO** | Create and verify a Google Business Profile for each studio (Midrand and Sandton), keep the name/phone/hours identical to the website, and ask happy clients for reviews. Area names already appear in titles, headings and structured data. |

### 6.3 Additional requests
- **robots.txt** - allows crawling, blocks `/404.html` and `/js_assets/vendor/`, and points to the sitemap.
- **sitemap.xml** - lists the six main pages with priority and change frequency.
- **Page speed** - images resized and compressed (the two studio PNGs dropped from about 4.2 MB to about 0.2 MB, and phones load the smaller 400px versions of each photo), lazy-loading, `defer` on every script, no render-blocking JavaScript, long-term caching headers.
- **Security** - see section 9.

> **Before submitting:** the canonical URLs, `sitemap.xml` and `robots.txt` use `https://latties-decor-events.netlify.app`. If your deployed address is different, do a find-and-replace of that address across the project.

## 7. Forms, validation and AJAX

### 7.1 `enquiry.html` - enquire about services and packages
Fields: full name, email, phone, event type, event date, estimated guests, budget range, optional package, venue/city, and special requirements.

1. **Validation** - HTML5 attributes (`required`, `type`, `min`, `max`, `minlength`, `maxlength`) plus JavaScript checks for name characters, email format, **South African phone numbers** (`082 123 4567` or `+27 82 123 4567`), a **future date** (within three years), guest count 10-1000 and text lengths. Errors appear next to each field, the first invalid field is focused, and fields re-validate as the user types.
2. **Processing** - once valid, the form calculates an **estimated cost range** from the event type and guest count (or the chosen package's price, whichever is higher), compares it with the selected budget, and gives an **availability message** based on how far away the date is.
3. **AJAX submission** - the form's `action` attribute points to FormSubmit. JavaScript sends the data with `fetch()` to the FormSubmit AJAX endpoint without reloading the page. If the request fails, the visitor still sees their estimate and a ready-made "Email my enquiry" button. Without JavaScript the form still submits normally through the `action` URL.
4. A hidden "honeypot" field (`_honey`) catches spam bots.

> **First-time setup:** the first time the live form is submitted, FormSubmit emails an activation link to `Lattieneo@gmail.com`. Click it once to start receiving enquiries.

### 7.2 `contact.html` - general message
Fields: name, email, optional phone, message type, subject and message (20-1000 characters, with a live character counter). When valid, the information is **compiled into an email** (subject + body) and shown in a preview. The visitor presses **Send email** to open their email app addressed to the recipient set in `forms.js` (`RECIPIENT = "Lattieneo@gmail.com"`), or **Copy email text**.

## 8. Responsive design

| Breakpoint | Changes |
|---|---|
| **> 992px (desktop)** | Three-column card grids, full horizontal navigation, 3-column gallery |
| **<= 992px (large tablet)** | Two-column grids and gallery, smaller logo text, tighter navigation spacing, two-column toolbar |
| **<= 768px (tablet)** | **Hamburger navigation** with animated icon, slightly smaller base font, reduced hero/section padding, stacked modal, form padding reduced |
| **<= 600px (mobile)** | Single-column grids, gallery and forms; stacked tabs; scroll (not fixed) background for phone browsers; smaller headings |
| **<= 380px (small phone)** | Smaller logo and brand name, tighter form padding |
| **>= 1400px (large screens)** | Wider content container and slightly larger text |

Images use `max-width: 100%`, `object-fit: cover`, `srcset`/`sizes` (400px and full-size versions), and explicit `width`/`height` to avoid layout shift. Typography, spacing and touch targets adjust at every breakpoint. The site was tested at 375px, 768px and 1280px widths with no horizontal scrolling.

## 9. Security and performance

- **Content Security Policy** and other headers in `_headers` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`). *Netlify applies these automatically; GitHub Pages ignores this file.*
- HTTPS provided automatically by Netlify/GitHub Pages.
- All inline `<style>` blocks and inline `style=""` attributes were moved into `style.css`, so scripts and styles can be restricted to the site's own files.
- Subresource Integrity (`integrity` attribute) on the Leaflet files loaded from a CDN.
- `textContent`/DOM methods instead of `innerHTML` for any data from users; `encodeURIComponent` when building email links.
- Client-side validation plus a spam honeypot. *Client-side checks improve user experience but are not a substitute for server-side validation; FormSubmit performs its own checks on its servers.*
- `rel="noopener noreferrer"` on external links.

## 10. Running the site locally

No build step is needed.

1. Download or clone the repository.
2. Open the folder in VS Code and use the **Live Server** extension (right-click `index.html` -> *Open with Live Server*), **or** run `python -m http.server 8000` in the folder and visit `http://localhost:8000`.
3. An internet connection is needed for the map tiles and Leaflet files, and for the live form submission.

## 11. Deployment

**Netlify (used for this project):**
1. Push the project to GitHub.
2. Log in to Netlify -> *Add new site* -> *Import an existing project* -> choose the GitHub repository.
3. Leave the build command empty and set the publish directory to the repository root (`.`).
4. Under *Site configuration* -> *Change site name*, choose `latties-decor-events` (or update the URLs in the project to match your name).

Alternatively, drag the project folder onto Netlify Drop. **GitHub Pages** also works (Settings -> Pages -> deploy from the `main` branch), but the `_headers` file will be ignored there.

## 12. Part 3 requirements checklist

| Requirement | Where |
|---|---|
| Interactive elements (accordion, tabs, modal) with jQuery | `about.html`, `services.html`, `js_assets/ui-widgets.js` |
| Interactive map | `contact.html`, `js_assets/map.js` |
| Animations and transitions (CSS + JS) | `css_assets/style.css` section 12, `js_assets/main.js` |
| Advanced DOM manipulation | `services.js`, `gallery.js`, `forms.js` |
| Gallery with lightbox | `gallery.html`, `js_assets/gallery.js` |
| Dynamic content loading | `services.html`, `packages-data.js`, `services.js` |
| Search to filter and sort content | Package search, category filter and sort on `services.html` |
| On-page SEO | All pages (section 6.1) |
| Off-page SEO | Section 6.2 |
| robots.txt, sitemap.xml, page speed, security | Sections 6.3 and 9 |
| HTML forms on `enquiry.html` and `contact.html` | Section 7 |
| HTML5 + JavaScript validation, error handling | `js_assets/forms.js` |
| Form `action` attribute | `enquiry.html` (FormSubmit URL) and `contact.html` |
| AJAX form submission | `enquiry.html` via `fetch()` |
| Part 2 feedback corrections recorded in changelog | Section 13 |
| README updated (changelog + references) | This file |
| Deployed on a free platform | Section 11 |

## 13. Changelog

All entries are listed newest first. Entries marked **[Feedback]** respond directly to the Part 2 feedback; entries marked **[Part 3]** are new work.

### Version 3.0.0 - 27 October 2026 (Part 3)

#### Corrections made from Part 2 feedback

| ID | Feedback received | What was changed | Files |
|---|---|---|---|
| **[Feedback] F1** | *Responsive design: media queries/breakpoints - "The website is not responsive" (3/10)* | Added `<meta name="viewport" content="width=device-width, initial-scale=1">` to every page (it was missing, so phones displayed the desktop layout). Added breakpoints at 992px, 768px, 600px, 380px and 1400px (see section 8). The only media query in Part 2 was a single 600px rule on the enquiry form. | all `.html`, `css_assets/style.css` |
| **[Feedback] F2** | *Adjustment - Layout: "No layout adjustments made" (0/5)* | Card, package and studio grids now change from 3 columns to 2 to 1. The header wraps on small screens, hero and page padding reduce, form fields stack to one column and the gallery changes from 3 to 2 to 1 columns. The enquiry form's styles were moved from an inline `<style>` block into the shared stylesheet. | `css_assets/style.css`, `enquiry.html` |
| **[Feedback] F3** | *Adjustment - Typography: "Text elements do not adapt to different screen sizes" (0/5)* | Headings, hero text, quotes and brand name now have smaller sizes at each breakpoint (e.g. hero heading 2.4rem -> 2.1rem -> 1.8rem -> 1.55rem -> 1.35rem); base font reduced to 95% on tablets and increased on 1400px+ screens; body text wraps with `overflow-wrap` for long emails. | `css_assets/style.css` |
| **[Feedback] F4** | *Adjustment - Navigation menu (kept at the required standard)* | Navigation upgraded to a hamburger menu at 768px and below: animated three-bar button, `aria-expanded` state, closes on Escape, on link selection and when the window is widened. Added a "Skip to main content" link and `aria-current="page"` on the active link. | `css_assets/style.css`, `js_assets/main.js`, all `.html` |
| **[Feedback] F5** | *Adjustment - Images: "Image adjustments are incomplete or incorrect" (2/5)* | Images now scale with `max-width: 100%; height: auto`, use `object-fit: cover`, and have `width`/`height` attributes. Added two sizes of each photo (`-400.jpg` and full) with `srcset` and `sizes` so phones download smaller files. Compressed all images (the 2.3 MB and 1.8 MB studio PNGs became JPEGs of about 155 KB and 70 KB). Studio and card image heights reduce on mobile. Logo cropped to a square so the circular frame no longer distorts it. | `_images/`, all `.html`, `css_assets/style.css` |
| **[Feedback] F6** | *GitHub - README: "incomplete or lacks detail" (2/5)* | README rewritten with project overview, technologies, folder structure, page descriptions, feature explanations, SEO, forms, responsive design, security, local setup, deployment, requirements checklist, changelog, AI disclosure and references. | `README.md` |
| **[Feedback] F7** | *GitHub - Changelog: "No changelog provided" (0/5)* | Created this changelog section with detailed entries for every change, including the reason, the files affected and the feedback it addresses. | `README.md` |
| **[Feedback] F8** | *References: "No references provided" (0/5)* | Added a Harvard-style reference list (section 15) covering the libraries, documentation and guidance used, plus an AI tool disclosure (section 14). | `README.md` |

#### Other fixes found while correcting Part 2

| ID | Change | Reason | Files |
|---|---|---|---|
| **[Feedback] F9** | Fixed broken logo path on the enquiry page (`company-logo.jpg` -> `_images/...`). | The logo did not display on that page. | `enquiry.html` |
| **[Feedback] F10** | Fixed the page background path. The stylesheet pointed at a WhatsApp image file name that was not in the project, so the silk background never loaded. It now uses `_images/silk-drape-background.jpg`. | Background was missing on the live site. | `css_assets/style.css` |
| **[Feedback] F11** | Corrected spelling and grammar in page copy ("transform **you** most meaningful" -> "your", "**from** the joy" -> "From", "every **details**" -> "every detail", "colour" spelling made consistent, quote punctuation on the contact page). | Professional wording. | `services.html`, `contact.html`, `index.html` |
| **[Feedback] F12** | Moved all inline `style=""` attributes and page-level `<style>` blocks into `style.css`. | One place to maintain styles; required for a strict Content Security Policy. | all `.html`, `css_assets/style.css` |
| **[Feedback] F13** | Replaced the repeated `<h1>` in the header with a `<span>` and gave each page a single descriptive `<h1>`. Home hero, About, Services, Contact, Enquiry and Gallery headings were upgraded accordingly. | Heading structure and SEO. | all `.html` |
| **[Feedback] F14** | Renamed image files to descriptive, hyphenated names (e.g. `Posh Wedding.jpg` -> `elegant-wedding-reception-decor.jpg`, `studio1 (1).png` -> `midrand-studio-lounge.jpg`) and renamed the project folder to `latties-decor-events`. | Spaces and special characters break URLs; descriptive names help image SEO. | `_images/`, all `.html` |
| **[Feedback] F15** | Added descriptive `alt` text to every image, `lang="en-ZA"`, and proper `<article>`, `<section>`, `<blockquote>` and `<nav aria-label>` elements. | Accessibility and SEO. | all `.html` |

#### New features

| ID | Change | Files |
|---|---|---|
| **[Part 3] P1** | Added **tabs** and an **accordion** FAQ to the About page using jQuery, with ARIA roles and keyboard support. | `about.html`, `js_assets/ui-widgets.js`, `js_assets/vendor/` |
| **[Part 3] P2** | Added a reusable **modal** (package details) with focus trap, Escape/backdrop close and focus return. | `js_assets/ui-widgets.js`, `css_assets/style.css` |
| **[Part 3] P3** | Added an interactive **Leaflet map** with markers and fly-to buttons for the Midrand and Sandton studios, plus a text fallback. | `contact.html`, `js_assets/map.js` |
| **[Part 3] P4** | Added CSS and JavaScript **animations**: hero entrance, scroll-reveal, hover transitions, animated hamburger, modal and lightbox transitions; respects "reduce motion". | `css_assets/style.css`, `js_assets/main.js` |
| **[Part 3] P5** | Created the **Gallery** page with category filters and an accessible **lightbox**; added "Gallery" to the navigation on every page. | `gallery.html`, `js_assets/gallery.js` |
| **[Part 3] P6** | Added **dynamic package listing** on the Services page, generated from a data file, with **search**, **category filter** and **sorting**, live result count and empty-state message. | `services.html`, `js_assets/packages-data.js`, `js_assets/services.js` |
| **[Part 3] P7** | Applied **on-page SEO**: unique titles and meta descriptions, keywords, canonical links, Open Graph/Twitter tags, JSON-LD `LocalBusiness` data, internal links. | all `.html` |
| **[Part 3] P8** | Created `robots.txt` and `sitemap.xml`; added a custom `404.html`. | `robots.txt`, `sitemap.xml`, `404.html` |
| **[Part 3] P9** | Added **page-speed** improvements: compressed images, lazy loading, deferred scripts, cache headers. | `_images/`, all `.html`, `_headers` |
| **[Part 3] P10** | Added **security** headers and a Content Security Policy; SRI on CDN files; honeypot spam field; safe DOM insertion. | `_headers`, `contact.html`, `js_assets/*.js` |
| **[Part 3] P11** | Rebuilt the **enquiry form**: added phone and optional package fields, HTML5 attributes, JavaScript validation with inline error messages, character counter, cost/availability response and **AJAX** submission with a failure fallback. Package links from the Services page pre-fill the form. | `enquiry.html`, `js_assets/forms.js` |
| **[Part 3] P12** | Added a **contact form** with validation that **compiles the message into an email** and lets the visitor send it to the recipient stated in the code. | `contact.html`, `js_assets/forms.js` |
| **[Part 3] P13** | Added back-to-top button, automatic footer year and footer navigation links. | `js_assets/main.js`, all `.html` |
| **[Part 3] P14** | Updated this README with Part 3 information, changelog and references. | `README.md` |
| **[Part 3] P15** | Added a thank-you message after both forms: the enquiry form also sends the customer an automatic thank-you email (FormSubmit autoresponse) and the contact form shows a thank-you before the email is sent. | `js_assets/forms.js` |
| **[Part 3] P16** | Added explanatory comments to every HTML page, the stylesheet and all JavaScript files (code behaviour unchanged). | all `.html`, `css_assets/style.css`, `js_assets/*.js` |

### Version 2.0.0 - September 2026 (Part 2, as submitted)
- Applied CSS styling: silk-drape background, card layouts, divider, sticky header and styled forms.
- Added the About, Services, Enquiry and Contact pages with images, studio cards and an enquiry form.

### Version 1.0.0 - September 2026 (Part 1, as submitted)
- Planned the site and created the initial HTML structure, navigation and content for Lattie's Decor & Events.

## 14. AI tool disclosure

In line with academic integrity requirements, the following AI assistance was used for this assignment:

- **Tool:** Claude (Sonnet 5.5), a large language model by Anthropic.
- **Used for:** drafting the Part 3 JavaScript, CSS and HTML, restructuring the responsive design after the Part 2 feedback, and drafting this README. The code was tested in a browser at mobile, tablet and desktop widths.
- **Student responsibility:** I reviewed the generated code, understand how it works, adjusted the content (names, prices, contact details) for the business, and take responsibility for the submitted work.

*(Edit this section so that it accurately describes how you used the tool.)*

## 15. References

Anthropic (2026) *Claude Sonnet 5.5* [Large language model]. Available at: https://claude.ai (Accessed: 27 October 2026).

FormSubmit (n.d.) *FormSubmit - Easiest form backend*. Available at: https://formsubmit.co (Accessed: 27 October 2026).

Google (n.d.) *Search Engine Optimization (SEO) Starter Guide*. Google Search Central. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 27 October 2026).

Google (n.d.) *Introduction to robots.txt*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 27 October 2026).

Leaflet (2023) *Leaflet - an open-source JavaScript library for mobile-friendly interactive maps* (version 1.9.4). Available at: https://leafletjs.com (Accessed: 27 October 2026).

MDN Web Docs (n.d.) *Fetch API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 27 October 2026).

MDN Web Docs (n.d.) *Intersection Observer API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 27 October 2026).

MDN Web Docs (n.d.) *Client-side form validation*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: 27 October 2026).

MDN Web Docs (n.d.) *Using media queries*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries (Accessed: 27 October 2026).

MDN Web Docs (n.d.) *Responsive images*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images (Accessed: 27 October 2026).

Netlify (n.d.) *Custom headers*. Netlify Docs. Available at: https://docs.netlify.com/routing/headers/ (Accessed: 27 October 2026).

OpenJS Foundation (2022) *jQuery* (version 3.6.1). Available at: https://jquery.com (Accessed: 27 October 2026).

OpenStreetMap contributors (n.d.) *OpenStreetMap*. Available at: https://www.openstreetmap.org (Accessed: 27 October 2026).

OWASP Foundation (n.d.) *Content Security Policy Cheat Sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html (Accessed: 27 October 2026).

Schema.org (n.d.) *LocalBusiness*. Available at: https://schema.org/LocalBusiness (Accessed: 27 October 2026).

Sitemaps.org (n.d.) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html (Accessed: 27 October 2026).

W3C (n.d.) *ARIA Authoring Practices Guide: Tabs pattern*. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ (Accessed: 27 October 2026).

W3C (n.d.) *ARIA Authoring Practices Guide: Accordion pattern*. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ (Accessed: 27 October 2026).

W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/ (Accessed: 27 October 2026).

### Image credits
The decor and studio photographs and the logo are the property of Lattie's Decor & Events and are used with the owner's permission for this assignment. *(Confirm this statement is accurate for the images you used, and credit the original sources if any were found online.)*

/* =========================================================
   services.js - dynamic package listing
   - Builds the package cards from LATTIE_PACKAGES (packages-data.js)
   - Live search, category filter and sorting
   - "View details" opens the jQuery modal (ui-widgets.js)
   DOM techniques used: createElement, DocumentFragment, dataset,
   event delegation, replaceChildren, aria-live updates.
   ========================================================= */
(function () {
  "use strict";

  var data = window.LATTIE_PACKAGES || [];
  var grid = document.getElementById("package-grid");
  if (!grid || !data.length) return;

  var searchInput = document.getElementById("pkg-search");
  var categorySelect = document.getElementById("pkg-category");
  var sortSelect = document.getElementById("pkg-sort");
  var countEl = document.getElementById("pkg-count");

  var rand = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });

  /* Fill the category dropdown from the data (dynamic, so new categories appear automatically) */
  function buildCategories() {
    var seen = {};
    data.forEach(function (p) { seen[p.category] = true; });
    Object.keys(seen).sort().forEach(function (cat) {
      var opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  }

  /* Build one package card with the DOM API (no innerHTML = no injection risk) */
  function buildCard(p) {
    var card = document.createElement("article");
    card.className = "card";
    card.dataset.id = p.id;

    var img = document.createElement("img");
    img.src = p.image + "-400.jpg";
    img.srcset = p.image + "-400.jpg 400w, " + p.image + ".jpg 736w";
    img.sizes = "(max-width: 600px) 100vw, (max-width: 992px) 50vw, 33vw";
    img.alt = p.alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 400;
    img.height = 250;
    card.appendChild(img);

    var body = document.createElement("div");
    body.className = "card-content";

    var tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = p.category;

    var h3 = document.createElement("h3");
    h3.textContent = p.name;

    var price = document.createElement("p");
    price.className = "price";
    price.textContent = "From " + rand.format(p.price) + " ";
    var small = document.createElement("small");
    small.textContent = "| " + p.guests;
    price.appendChild(small);

    var summary = document.createElement("p");
    summary.textContent = p.summary;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-small";
    btn.dataset.action = "details";
    btn.dataset.id = p.id;
    btn.textContent = "View details";

    body.append(tag, h3, price, summary, btn);
    card.appendChild(body);
    return card;
  }

  /* Filter + search + sort, then re-render */
  function render() {
    var term = searchInput.value.trim().toLowerCase();
    var cat = categorySelect.value;
    var sort = sortSelect.value;

    var list = data.filter(function (p) {
      var matchesCat = cat === "all" || p.category === cat;
      var haystack = (p.name + " " + p.category + " " + p.summary + " " + p.includes.join(" ")).toLowerCase();
      return matchesCat && (!term || haystack.indexOf(term) !== -1);
    });

    list.sort(function (a, b) {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    var frag = document.createDocumentFragment();
    list.forEach(function (p) { frag.appendChild(buildCard(p)); });

    if (!list.length) {
      var empty = document.createElement("p");
      empty.className = "empty-state panel";
      empty.textContent = "No packages match “" + searchInput.value.trim() + "”. Try a different word or choose All categories.";
      frag.appendChild(empty);
    }

    grid.replaceChildren(frag);
    countEl.textContent = list.length + (list.length === 1 ? " package found" : " packages found");
  }

  /* Event delegation: one listener handles every "View details" button */
  grid.addEventListener("click", function (e) {
    var btn = e.target.closest('[data-action="details"]');
    if (!btn || !window.LattieModal) return;
    var p = data.find(function (item) { return item.id === btn.dataset.id; });
    if (!p) return;
    window.LattieModal.open({
      title: p.name,
      category: p.category,
      image: p.image + ".jpg",
      imageAlt: p.alt,
      price: "From " + rand.format(p.price) + " | " + p.guests,
      description: p.summary,
      includes: p.includes,
      enquiryHref: "enquiry.html?package=" + encodeURIComponent(p.id)
    });
  });

  var debounce;
  searchInput.addEventListener("input", function () {
    clearTimeout(debounce);
    debounce = setTimeout(render, 150);
  });
  categorySelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);

  buildCategories();
  render();
})();
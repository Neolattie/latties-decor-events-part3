/* =========================================================
   gallery.js - filterable gallery with an accessible lightbox
   - Gallery items are built dynamically from the array below
   - Category filter buttons
   - Lightbox: click to enlarge, next/previous, Esc to close,
     arrow keys, focus returns to the thumbnail on close
   ========================================================= */
(function () {
  "use strict";

  var items = [
    { file: "elegant-wedding-reception-decor", cat: "Weddings", caption: "Ballroom wedding reception with chandeliers and floral runners", alt: "Elegant wedding reception hall with chandeliers and long floral tables", w: 736, h: 1101 },
    { file: "wedding-entrance-walkway-decor", cat: "Weddings", caption: "Backlit entrance walkway with photo displays", alt: "Backlit photo panels and flowers lining a wedding entrance walkway", w: 735, h: 489 },
    { file: "traditional-wedding-marquee-decor", cat: "Weddings", caption: "Garden marquee with long banquet tables", alt: "Long wedding tables under a draped marquee on green grass", w: 735, h: 1120 },
    { file: "birthday-pink-table-decor", cat: "Birthdays & Parties", caption: "Pink milestone birthday table styling", alt: "Pink and white birthday table with tall candles and flowers", w: 736, h: 1104 },
    { file: "unicorn-pastel-party-decor", cat: "Birthdays & Parties", caption: "Pastel rainbow kids party table", alt: "Pastel rainbow party table with flowers and iridescent plates", w: 736, h: 736 },
    { file: "baby-shower-balloon-garden-decor", cat: "Baby Showers", caption: "Garden baby shower with balloon garland", alt: "Baby shower with green and white balloon garland and welcome sign", w: 736, h: 920 },
    { file: "graduation-balloon-backdrop-decor", cat: "Graduations", caption: "Graduation photo backdrop with balloon arch", alt: "Graduation backdrop with dark balloon arch and congratulations sign", w: 736, h: 736 },
    { file: "memorial-service-floral-stage-decor", cat: "Memorials", caption: "Memorial service stage with white florals", alt: "Memorial service stage with white flowers, portraits and soft draping", w: 736, h: 472 }
  ];

  var grid = document.getElementById("gallery-masonry");
  var filterBar = document.getElementById("gallery-filters");
  var lightbox = document.getElementById("lightbox");
  if (!grid || !filterBar || !lightbox) return;

  var lbImg = lightbox.querySelector("img");
  var lbCaption = lightbox.querySelector("figcaption");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var prevBtn = lightbox.querySelector(".lightbox-prev");
  var nextBtn = lightbox.querySelector(".lightbox-next");

  var visible = items.slice(); // items currently shown (after filtering)
  var current = 0;
  var opener = null;

  /* ----- Filter buttons ----- */
  function buildFilters() {
    var cats = ["All"];
    items.forEach(function (it) { if (cats.indexOf(it.cat) === -1) cats.push(it.cat); });
    cats.forEach(function (cat, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter-btn";
      b.textContent = cat;
      b.dataset.cat = cat;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      filterBar.appendChild(b);
    });
  }

  /* ----- Render thumbnails ----- */
  function render() {
    var frag = document.createDocumentFragment();
    visible.forEach(function (it, index) {
      var fig = document.createElement("figure");
      fig.className = "masonry-item";
      fig.style.animationDelay = index * 60 + "ms";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.index = index;
      btn.setAttribute("aria-label", "Enlarge photo: " + it.caption);

      var img = document.createElement("img");
      img.src = "_images/" + it.file + "-400.jpg";
      img.srcset = "_images/" + it.file + "-400.jpg 400w, _images/" + it.file + ".jpg 736w";
      img.sizes = "(max-width: 600px) 100vw, (max-width: 992px) 50vw, 33vw";
      img.alt = it.alt;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 400;
      img.height = Math.round((400 * it.h) / it.w);
      btn.appendChild(img);

      var cap = document.createElement("figcaption");
      cap.textContent = it.caption;

      fig.append(btn, cap);
      frag.appendChild(fig);
    });
    grid.replaceChildren(frag);
  }

  filterBar.addEventListener("click", function (e) {
    var b = e.target.closest(".filter-btn");
    if (!b) return;
    filterBar.querySelectorAll(".filter-btn").forEach(function (x) {
      x.setAttribute("aria-pressed", String(x === b));
    });
    var cat = b.dataset.cat;
    visible = cat === "All" ? items.slice() : items.filter(function (it) { return it.cat === cat; });
    render();
    document.getElementById("gallery-status").textContent =
      "Showing " + visible.length + " photo" + (visible.length === 1 ? "" : "s") + (cat === "All" ? "" : " in " + cat);
  });

  /* ----- Lightbox ----- */
  function show(index) {
    current = (index + visible.length) % visible.length;
    var it = visible[current];
    lbImg.src = "_images/" + it.file + ".jpg";
    lbImg.alt = it.alt;
    lbCaption.textContent = it.caption + " (" + (current + 1) + " of " + visible.length + ")";
  }

  function open(index, trigger) {
    opener = trigger;
    show(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (opener) opener.focus();
  }

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-index]");
    if (btn) open(Number(btn.dataset.index), btn);
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () { show(current - 1); });
  nextBtn.addEventListener("click", function () { show(current + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  buildFilters();
  render();
})();
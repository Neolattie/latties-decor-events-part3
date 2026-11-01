/* =========================================================
   main.js - runs on every page
   - Responsive navigation (hamburger menu)
   - Scroll-reveal animations (IntersectionObserver)
   - Back-to-top button
   - Dynamic footer year
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Responsive navigation ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close with Escape and when a link is chosen
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    // Reset when the window grows back to desktop width
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) setMenu(false);
    });
  }

  /* ---------- Scroll-reveal animation ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    document.documentElement.classList.add("js-reveal");
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Back-to-top button (created with the DOM API) ---------- */
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "back-to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.textContent = "↑";
  document.body.appendChild(topBtn);

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener(
    "scroll",
    function () {
      topBtn.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true }
  );

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
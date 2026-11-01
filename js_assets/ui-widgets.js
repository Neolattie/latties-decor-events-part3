/* =========================================================
   ui-widgets.js - jQuery interactive elements
   - Tabs  (.tabs)
   - Accordion (.accordion)
   - Reusable modal (exposed as window.LattieModal)
   Requires jQuery (js_assets/vendor/jquery.min.js)
   ========================================================= */
(function ($) {
  "use strict";
  if (!$) return;

  /* ---------- Tabs (WAI-ARIA tab pattern with arrow-key support) ---------- */
  $(".tabs").each(function () {
    var $tabs = $(this);
    var $buttons = $tabs.find('[role="tab"]');
    var $panels = $tabs.find('[role="tabpanel"]');

    function activate($btn) {
      $buttons.attr({ "aria-selected": "false", tabindex: "-1" });
      $panels.prop("hidden", true);
      $btn.attr({ "aria-selected": "true", tabindex: "0" });
      var $panel = $("#" + $btn.attr("aria-controls"));
      $panel.prop("hidden", false).hide().fadeIn(250); // jQuery transition
    }

    $buttons.on("click", function () {
      activate($(this));
    });

    $buttons.on("keydown", function (e) {
      var i = $buttons.index(this);
      var next = null;
      if (e.key === "ArrowRight") next = $buttons.eq((i + 1) % $buttons.length);
      if (e.key === "ArrowLeft") next = $buttons.eq((i - 1 + $buttons.length) % $buttons.length);
      if (e.key === "Home") next = $buttons.first();
      if (e.key === "End") next = $buttons.last();
      if (next) {
        e.preventDefault();
        activate(next);
        next.trigger("focus");
      }
    });
  });

  /* ---------- Accordion (one panel open at a time) ---------- */
  $(".accordion").each(function () {
    var $acc = $(this);
    $acc.on("click", ".accordion-header", function () {
      var $btn = $(this);
      var $body = $("#" + $btn.attr("aria-controls"));
      var isOpen = $btn.attr("aria-expanded") === "true";

      // close all
      $acc.find(".accordion-header").attr("aria-expanded", "false");
      $acc.find(".accordion-body").slideUp(250, function () {
        $(this).prop("hidden", true);
      });

      // open the chosen one (unless it was already open)
      if (!isOpen) {
        $btn.attr("aria-expanded", "true");
        $body.prop("hidden", false).hide().slideDown(250);
      }
    });
  });

  /* ---------- Modal ---------- */
  var $backdrop = null;
  var lastFocus = null;

  function closeModal() {
    if (!$backdrop) return;
    $backdrop.removeClass("open").attr("aria-hidden", "true");
    $("body").removeClass("no-scroll");
    if (lastFocus) lastFocus.focus();
  }

  /**
   * Open the modal.
   * @param {Object} data {title, image, imageAlt, price, description, includes[], enquiryHref}
   * Text is inserted with .text() so user data can never inject HTML.
   */
  function openModal(data) {
    if (!$backdrop) {
      $backdrop = $(
        '<div class="modal-backdrop" aria-hidden="true">' +
          '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '<button type="button" class="modal-close" aria-label="Close dialog">&times;</button>' +
          '<img src="" alt="" width="400" height="500">' +
          '<div class="modal-body">' +
          '<span class="tag"></span>' +
          '<h2 id="modal-title"></h2>' +
          '<p class="price"></p>' +
          '<p class="modal-desc"></p>' +
          "<ul></ul>" +
          '<a class="btn btn-small modal-cta" href="enquiry.html">Request this package</a>' +
          "</div></div></div>"
      ).appendTo("body");

      $backdrop.on("click", function (e) {
        if (e.target === this) closeModal();
      });
      $backdrop.on("click", ".modal-close", closeModal);
      $(document).on("keydown", function (e) {
        if (e.key === "Escape" && $backdrop.hasClass("open")) closeModal();
        // simple focus trap
        if (e.key === "Tab" && $backdrop.hasClass("open")) {
          var $f = $backdrop.find("button, a[href]");
          var first = $f.first()[0];
          var last = $f.last()[0];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    lastFocus = document.activeElement;
    $backdrop.find("img").attr({ src: data.image, alt: data.imageAlt || "" });
    $backdrop.find(".tag").text(data.category || "");
    $backdrop.find("h2").text(data.title);
    $backdrop.find(".price").text(data.price || "");
    $backdrop.find(".modal-desc").text(data.description || "");
    var $list = $backdrop.find("ul").empty();
    (data.includes || []).forEach(function (item) {
      $("<li>").text(item).appendTo($list);
    });
    $backdrop.find(".modal-cta").attr("href", data.enquiryHref || "enquiry.html");

    $backdrop.addClass("open").attr("aria-hidden", "false");
    $("body").addClass("no-scroll");
    $backdrop.find(".modal-close").trigger("focus");
  }

  window.LattieModal = { open: openModal, close: closeModal };
})(window.jQuery);
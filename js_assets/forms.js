/* =========================================================
   forms.js - validation and submission for enquiry.html and contact.html
   - HTML5 attributes (required, type, min, max, minlength, pattern) give
     the browser-level rules; this script adds friendly messages and
     format checks (SA phone numbers, future dates, lengths).
   - enquiry.html : validated -> estimate/availability response shown ->
                    sent with AJAX (fetch) to the form's action URL
   - contact.html : validated -> compiled into an email -> user sends it
                    to RECIPIENT with one click (mailto)
   ========================================================= */
(function () {
  "use strict";

  /* Recipient of the contact-form email (change here if it ever changes) */
  var RECIPIENT = "Lattieneo@gmail.com";

  /* ---------- Reusable validators: each returns "" when valid, otherwise an error message ---------- */
  var v = {
    required: function (label) {
      return function (val) { return val.trim() ? "" : label + " is required."; };
    },
    name: function (val) {
      var t = val.trim();
      if (!t) return "Please enter your full name.";
      if (t.length < 2 || t.length > 60) return "Name must be between 2 and 60 characters.";
      if (!/^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ '\-.]*$/.test(t)) return "Name may only contain letters, spaces, apostrophes and hyphens.";
      return "";
    },
    email: function (val) {
      var t = val.trim();
      if (!t) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return "Enter a valid email address, e.g. name@example.com.";
      return "";
    },
    /* South African numbers: 0821234567, 082 123 4567 or +27 82 123 4567 */
    phone: function (optional) {
      return function (val) {
        var t = val.replace(/[\s\-()]/g, "");
        if (!t) return optional ? "" : "Please enter your phone number.";
        if (!/^(\+27|0)[1-8][0-9]{8}$/.test(t)) return "Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.";
        return "";
      };
    },
    select: function (label) {
      return function (val) { return val ? "" : "Please choose " + label + "."; };
    },
    futureDate: function (val) {
      if (!val) return "Please choose the event date.";
      var d = parseDate(val);
      if (isNaN(d)) return "Enter a valid date.";
      var today = startOfToday();
      if (d <= today) return "The event date must be in the future.";
      var max = new Date(today);
      max.setFullYear(max.getFullYear() + 3);
      if (d > max) return "Please choose a date within the next 3 years.";
      return "";
    },
    intRange: function (min, max) {
      return function (val) {
        if (!val.trim()) return "Please enter the number of guests.";
        var n = Number(val);
        if (!Number.isInteger(n)) return "Enter a whole number.";
        if (n < min || n > max) return "Guests must be between " + min + " and " + max + ".";
        return "";
      };
    },
    length: function (min, max, label, optional) {
      return function (val) {
        var t = val.trim();
        if (!t) return optional ? "" : label + " is required.";
        if (t.length < min) return label + " must be at least " + min + " characters (currently " + t.length + ").";
        if (t.length > max) return label + " must be " + max + " characters or fewer.";
        return "";
      };
    }
  };

  function parseDate(str) {
    var p = str.split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function startOfToday() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function toISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  /* ---------- Generic form wiring ---------- */
  function setupValidation(form, rules) {
    var touched = {};

    function check(id) {
      var field = form.elements[id];
      var errEl = document.getElementById(id + "-error");
      var msg = rules[id](field.value);
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      field.classList.toggle("is-valid", !msg && field.value.trim() !== "");
      if (errEl) errEl.textContent = msg;
      return !msg;
    }

    Object.keys(rules).forEach(function (id) {
      var field = form.elements[id];
      field.addEventListener("blur", function () { touched[id] = true; check(id); });
      var evt = field.tagName === "SELECT" ? "change" : "input";
      field.addEventListener(evt, function () { if (touched[id]) check(id); });
    });

    return {
      validateAll: function () {
        var firstBad = null;
        var bad = 0;
        Object.keys(rules).forEach(function (id) {
          touched[id] = true;
          if (!check(id)) {
            bad++;
            if (!firstBad) firstBad = form.elements[id];
          }
        });
        return { ok: bad === 0, count: bad, first: firstBad };
      },
      reset: function () {
        touched = {};
        Object.keys(rules).forEach(function (id) {
          var f = form.elements[id];
          f.removeAttribute("aria-invalid");
          f.classList.remove("is-valid");
          var e = document.getElementById(id + "-error");
          if (e) e.textContent = "";
        });
      }
    };
  }

  /* Live character counter for textareas */
  function setupCounter(textarea, counterEl, max) {
    function update() { counterEl.textContent = textarea.value.length + " / " + max; }
    textarea.addEventListener("input", update);
    update();
  }

  /* Small helper to build elements safely */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === "className") node.className = props[k];
      else if (k === "text") node.textContent = props[k];
      else node.setAttribute(k, props[k]);
    });
    (children || []).forEach(function (c) { node.append(c); });
    return node;
  }

  var rand = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });

  /* =======================================================
     ENQUIRY FORM
     ======================================================= */
  var enquiryForm = document.getElementById("enquiry-form");
  if (enquiryForm) initEnquiry(enquiryForm);

  function initEnquiry(form) {
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector(".submit-btn");
    var packages = window.LATTIE_PACKAGES || [];

    /* Estimate model (example rates - adjust to your real pricing) */
    var pricing = {
      wedding:    { base: 6000, perGuest: 420, label: "Wedding / Reception" },
      babyshower: { base: 2500, perGuest: 220, label: "Baby Shower" },
      birthday:   { base: 2500, perGuest: 200, label: "Birthday Party" },
      memorial:   { base: 3500, perGuest: 260, label: "Memorial Service" },
      other:      { base: 2500, perGuest: 230, label: "Other Celebration" }
    };
    var budgets = {
      "10k-25k": { min: 10000, max: 25000, label: "R10,000 - R25,000" },
      "25k-50k": { min: 25000, max: 50000, label: "R25,000 - R50,000" },
      "50k-100k": { min: 50000, max: 100000, label: "R50,000 - R100,000" },
      "100k+": { min: 100000, max: Infinity, label: "R100,000+" }
    };
    var categoryToEvent = { Wedding: "wedding", Birthday: "birthday", "Baby Shower": "babyshower", Memorial: "memorial", Graduation: "other" };

    /* Dynamic: fill the optional package dropdown from packages-data.js */
    var pkgSelect = form.elements.package;
    packages.forEach(function (p) {
      pkgSelect.appendChild(el("option", { value: p.id, text: p.name + " (from " + rand.format(p.price) + ")" }));
    });

    /* Pre-select a package when arriving from the services page: enquiry.html?package=baby-shower */
    var wanted = new URLSearchParams(window.location.search).get("package");
    var chosen = packages.find(function (p) { return p.id === wanted; });
    if (chosen) {
      pkgSelect.value = chosen.id;
      if (categoryToEvent[chosen.category]) form.elements.eventtype.value = categoryToEvent[chosen.category];
    }

    /* Earliest selectable date = tomorrow (HTML5 min attribute) */
    var tomorrow = startOfToday();
    tomorrow.setDate(tomorrow.getDate() + 1);
    form.elements.eventdate.min = toISO(tomorrow);

    setupCounter(form.elements.notes, document.getElementById("notes-count"), 500);

    var validation = setupValidation(form, {
      fullname: v.name,
      email: v.email,
      phone: v.phone(false),
      eventtype: v.select("an event type"),
      eventdate: v.futureDate,
      guestcount: v.intRange(10, 1000),
      budget: v.select("a budget range"),
      venue: v.length(3, 100, "Venue / city", false),
      notes: v.length(0, 500, "Notes", true)
    });

    /* Turn the validated data into a cost + availability response */
    function buildResponse(data) {
      var model = pricing[data.eventtype];
      var pkg = packages.find(function (p) { return p.id === data.package; });
      var guests = Number(data.guestcount);
      var estimate = model.base + model.perGuest * guests;
      if (pkg) estimate = Math.max(estimate, pkg.price);
      var low = Math.round((estimate * 0.9) / 100) * 100;
      var high = Math.round((estimate * 1.15) / 100) * 100;

      var days = Math.round((parseDate(data.eventdate) - startOfToday()) / 86400000);
      var availability;
      var level = "";
      if (days < 7) {
        availability = "Very short notice - we cannot guarantee availability. Please call us so we can see what is possible.";
        level = "warn";
      } else if (days < 30) {
        availability = "Limited availability - dates within a month book quickly. We will confirm within one business day.";
        level = "warn";
      } else {
        availability = "Good news - your date looks available. We will confirm once the quote is approved.";
      }

      var b = budgets[data.budget];
      var fit;
      if (high < b.min) fit = "Your budget has room to spare - we can add premium touches such as extra florals, lighting or a feature backdrop.";
      else if (low > b.max) fit = "The estimate is above your selected budget. We can scale the design or choose a smaller package to fit.";
      else fit = "The estimate sits comfortably within your selected budget.";

      return { days: days, low: low, high: high, availability: availability, level: level, fit: fit, pkg: pkg, event: model.label, budget: b.label };
    }

    function showResult(data, res, sendState) {
      var box = el("div", { className: "result-box " + res.level });
      box.append(el("h3", { text: "Thank you, " + data.fullname.trim().split(" ")[0] + "!" }));
      box.append(el("p", { text: "Here is a quick response to your " + res.event.toLowerCase() + " enquiry:" }));

      var dl = el("dl");
      var rows = [
        ["Estimated cost", rand.format(res.low) + " - " + rand.format(res.high)],
        ["Selected budget", res.budget],
        ["Event date", data.eventdate + " (" + res.days + " days away)"],
        ["Guests", String(Number(data.guestcount))]
      ];
      if (res.pkg) rows.push(["Package", res.pkg.name]);
      rows.forEach(function (r) { dl.append(el("dt", { text: r[0] }), el("dd", { text: r[1] })); });
      box.append(dl);

      box.append(el("p", { text: res.availability }));
      box.append(el("p", { text: res.fit }));
      box.append(el("p", { className: "char-count", text: "This is an automatic estimate, not a final quote. A consultant will confirm the details with you." }));

      if (sendState === "sent") {
        box.append(el("p", { text: "✔ Your request has been sent to our team." }));
      } else {
        var mail = "mailto:" + RECIPIENT + "?subject=" + encodeURIComponent("Enquiry: " + res.event + " on " + data.eventdate) +
          "&body=" + encodeURIComponent("Name: " + data.fullname + "\nEmail: " + data.email + "\nPhone: " + data.phone + "\nGuests: " + data.guestcount + "\nVenue: " + data.venue + "\nNotes: " + (data.notes || "-"));
        box.append(el("p", { text: "We could not send your request automatically (check your connection). Please send it by email instead:" }));
        box.append(el("div", { className: "result-actions" }, [el("a", { className: "btn btn-small", href: mail, text: "Email my enquiry" })]));
      }
      status.replaceChildren(box);
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.replaceChildren();

      var result = validation.validateAll();
      if (!result.ok) {
        status.append(el("div", { className: "result-box fail", role: "alert", text: "Please fix the " + result.count + " highlighted field" + (result.count === 1 ? "" : "s") + " and try again." }));
        result.first.focus();
        return;
      }

      // Spam trap: real people never fill the hidden field
      if (form.elements._honey && form.elements._honey.value) return;

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = typeof value === "string" ? value : ""; });
      var res = buildResponse(data);

      submitBtn.disabled = true;
      submitBtn.textContent = "SENDING...";

      /* AJAX: send in the background so the page does not reload */
      var endpoint = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      var payload = Object.assign({}, data, {
        _subject: "New website enquiry - " + res.event,
        _template: "table",
        estimate: rand.format(res.low) + " - " + rand.format(res.high)
      });
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, 12000);

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function () {
          showResult(data, res, "sent");
          form.reset();
          validation.reset();
          document.getElementById("notes-count").textContent = "0 / 500";
        })
        .catch(function () { showResult(data, res, "failed"); })
        .finally(function () {
          clearTimeout(timer);
          submitBtn.disabled = false;
          submitBtn.textContent = "SUBMIT REQUEST";
        });
    });
  }

  /* =======================================================
     CONTACT FORM
     ======================================================= */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) initContact(contactForm);

  function initContact(form) {
    var status = document.getElementById("form-status");

    setupCounter(form.elements.message, document.getElementById("message-count"), 1000);

    var validation = setupValidation(form, {
      fullname: v.name,
      email: v.email,
      phone: v.phone(true),
      messagetype: v.select("a message type"),
      subject: v.length(3, 80, "Subject", false),
      message: v.length(20, 1000, "Message", false)
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.replaceChildren();

      var result = validation.validateAll();
      if (!result.ok) {
        status.append(el("div", { className: "result-box fail", role: "alert", text: "Please fix the " + result.count + " highlighted field" + (result.count === 1 ? "" : "s") + " and try again." }));
        result.first.focus();
        return;
      }
      if (form.elements._honey && form.elements._honey.value) return;

      var f = form.elements;
      var typeLabel = f.messagetype.options[f.messagetype.selectedIndex].text;
      var subject = "[" + typeLabel + "] " + f.subject.value.trim();
      var body =
        "Hello Lattie's Decor & Events,\n\n" +
        f.message.value.trim() + "\n\n" +
        "--- Contact details ---\n" +
        "Name: " + f.fullname.value.trim() + "\n" +
        "Email: " + f.email.value.trim() + "\n" +
        "Phone: " + (f.phone.value.trim() || "Not provided") + "\n" +
        "Message type: " + typeLabel + "\n";

      var href = "mailto:" + RECIPIENT + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      var copyBtn = el("button", { type: "button", className: "btn btn-outline btn-small", text: "Copy email text" });
      copyBtn.addEventListener("click", function () {
        var full = "To: " + RECIPIENT + "\nSubject: " + subject + "\n\n" + body;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(full).then(function () { copyBtn.textContent = "Copied!"; });
        }
      });

      var box = el("div", { className: "result-box" }, [
        el("h3", { text: "Your email is ready" }),
        el("p", { text: "Check the details below, then press the button to send it to " + RECIPIENT + " from your email app." }),
        el("dl", {}, [el("dt", { text: "To" }), el("dd", { text: RECIPIENT }), el("dt", { text: "Subject" }), el("dd", { text: subject })]),
        el("pre", { text: body }),
        el("div", { className: "result-actions" }, [el("a", { className: "btn btn-small", href: href, text: "Send email" }), copyBtn])
      ]);
      status.replaceChildren(box);
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
})();
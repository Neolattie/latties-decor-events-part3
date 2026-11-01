/* =========================================================
   map.js - interactive studio map (Leaflet + OpenStreetMap)
   Leaflet is loaded from unpkg in contact.html. If it cannot load
   (offline / blocked) a text fallback is shown instead.
   Coordinates are the approximate centre of each suburb.
   ========================================================= */
(function () {
  "use strict";

  var mapEl = document.getElementById("studio-map");
  if (!mapEl) return;

  if (typeof L === "undefined") {
    var msg = document.createElement("p");
    msg.className = "map-fallback panel";
    msg.textContent = "The interactive map could not be loaded. Our studios are in Midrand and Sandton, Gauteng.";
    mapEl.replaceChildren(msg);
    mapEl.style.height = "auto";
    return;
  }

  var studios = [
    { id: "midrand", name: "Midrand Studio", lat: -25.9992, lng: 28.1263, hours: "Mon-Fri, 09:00-18:30" },
    { id: "sandton", name: "Sandton Studio", lat: -26.1076, lng: 28.0567, hours: "Mon-Fri, 09:00-18:30" }
  ];

  var map = L.map(mapEl, { scrollWheelZoom: false }).setView([-26.05, 28.09], 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  }).addTo(map);

  var markers = {};
  studios.forEach(function (s) {
    // Popup content built with DOM nodes so nothing is parsed as HTML
    var box = document.createElement("div");
    var title = document.createElement("strong");
    title.textContent = s.name;
    var info = document.createElement("div");
    info.textContent = s.hours + " (approximate location)";
    box.append(title, info);

    markers[s.id] = L.marker([s.lat, s.lng], { title: s.name, alt: s.name }).addTo(map).bindPopup(box);
  });

  // Fit both studios on screen
  map.fitBounds(
    studios.map(function (s) { return [s.lat, s.lng]; }),
    { padding: [50, 50] }
  );

  // Buttons: fly to a studio and open its popup
  document.querySelectorAll("[data-studio]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.dataset.studio;
      var s = studios.find(function (x) { return x.id === id; });
      if (!s) return;
      map.flyTo([s.lat, s.lng], 14, { duration: 1.2 });
      map.once("moveend", function () { markers[id].openPopup(); });
    });
  });

  // Allow scroll-zoom only after the map is clicked (prevents scroll-trapping on mobile/desktop)
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("mouseout", function () { map.scrollWheelZoom.disable(); });
})();
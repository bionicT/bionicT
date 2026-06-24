/* Easy Helper — app logic.
 * Keeps things deliberately simple: the four big buttons trigger native
 * device actions (phone, SMS, Maps, Translate). Contact details are stored
 * locally on the device so a family member can set them up once. */

(function () {
  "use strict";

  // Sensible defaults — a caregiver can change these in Settings.
  var DEFAULTS = {
    callName: "",
    callNumber: "",
    adminNumber: "",
    adminMessage: "I need some help, please.",
    homeAddress: ""
  };

  var STORAGE_KEY = "easyHelperSettings";

  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, DEFAULTS);
      return Object.assign({}, DEFAULTS, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      /* storage may be unavailable (private mode) — fail quietly */
    }
  }

  // Strip everything except digits and a leading +, for tel:/sms: links.
  function cleanNumber(num) {
    if (!num) return "";
    var trimmed = String(num).trim();
    var plus = trimmed.charAt(0) === "+" ? "+" : "";
    return plus + trimmed.replace(/[^0-9]/g, "");
  }

  function go(url) {
    window.location.href = url;
  }

  // ---------- Actions ----------
  var actions = {
    call: function (settings) {
      var num = cleanNumber(settings.callNumber);
      if (!num) {
        alert("No phone number set yet.\n\nTap Settings to add the number of the person to call.");
        return;
      }
      go("tel:" + num);
    },

    translate: function () {
      // Opens Google Translate. Works in-app on phones with it installed,
      // otherwise opens the website.
      go("https://translate.google.com/");
    },

    text: function (settings) {
      var num = cleanNumber(settings.adminNumber);
      if (!num) {
        alert("No text number set yet.\n\nTap Settings to add the admin's phone number.");
        return;
      }
      var body = settings.adminMessage || DEFAULTS.adminMessage;
      // "?&body=" form is the most broadly compatible across iOS/Android.
      go("sms:" + num + "?&body=" + encodeURIComponent(body));
    },

    directions: function (settings) {
      var dest = (settings.homeAddress || "").trim();
      var base = "https://www.google.com/maps/dir/?api=1";
      if (dest) {
        go(base + "&destination=" + encodeURIComponent(dest));
      } else {
        // No saved address — just open Maps so they can search.
        go("https://www.google.com/maps");
      }
    }
  };

  // ---------- Wire up the big buttons ----------
  function initTiles() {
    var tiles = document.querySelectorAll(".tile");
    Array.prototype.forEach.call(tiles, function (tile) {
      tile.addEventListener("click", function () {
        var name = tile.getAttribute("data-action");
        var fn = actions[name];
        if (fn) fn(loadSettings());
      });
    });
  }

  // ---------- Clock ----------
  function initClock() {
    var el = document.getElementById("clock");
    if (!el) return;
    function tick() {
      var now = new Date();
      var date = now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      });
      var time = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit"
      });
      el.textContent = date + " · " + time;
    }
    tick();
    setInterval(tick, 1000 * 15);
  }

  // ---------- Settings dialog ----------
  function initSettings() {
    var dialog = document.getElementById("settings-dialog");
    var openBtn = document.getElementById("settings-btn");
    var cancelBtn = document.getElementById("settings-cancel");
    var form = document.getElementById("settings-form");
    if (!dialog || !openBtn || !form) return;

    var fields = {
      callName: document.getElementById("call-name"),
      callNumber: document.getElementById("call-number"),
      adminNumber: document.getElementById("admin-number"),
      adminMessage: document.getElementById("admin-message"),
      homeAddress: document.getElementById("home-address")
    };

    function populate() {
      var s = loadSettings();
      Object.keys(fields).forEach(function (k) {
        if (fields[k]) fields[k].value = s[k] || "";
      });
    }

    function openDialog() {
      populate();
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    }

    function closeDialog() {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    }

    openBtn.addEventListener("click", openDialog);
    if (cancelBtn) cancelBtn.addEventListener("click", closeDialog);

    form.addEventListener("submit", function () {
      // method="dialog" closes the dialog; we just persist the values.
      var current = loadSettings();
      Object.keys(fields).forEach(function (k) {
        if (fields[k]) current[k] = fields[k].value.trim();
      });
      saveSettings(current);
    });
  }

  // ---------- Service worker (offline support) ----------
  function initServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {
          /* offline support is a nice-to-have; ignore failures */
        });
      });
    }
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", function () {
    initTiles();
    initClock();
    initSettings();
    initServiceWorker();
  });
})();

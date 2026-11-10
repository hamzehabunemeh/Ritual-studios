/* Ritual Studios — site behaviour */
(function () {
  "use strict";
  var C = window.RITUAL_CONFIG || {};
  var S = window.RITUAL_SCHEDULE || [];
  var REST = window.RITUAL_REST_DAYS || [];
  var DAYS = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  document.documentElement.classList.remove("no-js");

  /* ---------- helpers ---------- */
  function fmtTime(t) {
    var p = t.split(":"), h = +p[0], m = p[1];
    var ap = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return h + ":" + m + " " + ap;
  }
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function nowInStudio() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: C.timeZone || "Asia/Amman", weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      var o = {}; parts.forEach(function (x) { o[x.type] = x.value; });
      return { day: o.weekday.toLowerCase(), min: +o.hour * 60 + +o.minute };
    } catch (e) {
      var d = new Date();
      return { day: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][d.getDay()], min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function classesOn(day) { return S.filter(function (c) { return c.day === day; }).sort(function (a, b) { return toMin(a.time) - toMin(b.time); }); }
  function bookUrl(c) { return "book.html?service=group&class=" + encodeURIComponent(c.name + " — " + cap(c.day) + " " + fmtTime(c.time)); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- config links ---------- */
  $$("[data-link]").forEach(function (a) { var k = a.getAttribute("data-link"); if (C[k]) a.href = C[k]; });

  /* ---------- header ---------- */
  var header = $(".site-header");
  var forceSolid = header && header.hasAttribute("data-solid");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", forceSolid || window.scrollY > 40);
    var f = $(".site-footer"), ig = $(".ig-float");
    if (f && ig) ig.classList.toggle("is-hidden", f.getBoundingClientRect().top < window.innerHeight - 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var toggle = $(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") document.body.classList.remove("menu-open"); });
  }

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".reveal").forEach(function (el) { ro.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("is-in"); }); }

  /* ---------- video: autoplay muted when in view, one "tap for sound" button ---------- */
  $$("[data-film]").forEach(function (wrap) {
    var v = $("video", wrap), b = $(".sound-btn", wrap);
    if (!v) return;
    v.muted = true; v.setAttribute("muted", ""); v.playsInline = true;
    var play = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) play(); else v.pause(); });
      }, { threshold: 0.35 }).observe(v);
    } else play();
    if (b) b.addEventListener("click", function () {
      v.muted = !v.muted;
      if (!v.muted) { v.volume = 1; play(); }
      b.classList.toggle("is-on", !v.muted);
      b.setAttribute("aria-label", v.muted ? "Turn sound on" : "Mute video");
    });
  });

  /* ---------- Google rating ---------- */
  $$("[data-rating]").forEach(function (box) {
    var r = parseFloat(C.googleRating), n = parseInt(C.googleReviewCount, 10);
    if (!isNaN(r)) {
      $(".rating__score", box).textContent = r.toFixed(1);
      $(".stars__fill", box).style.width = Math.max(0, Math.min(100, r / 5 * 100)) + "%";
      $(".rating__meta", box).textContent = !isNaN(n) ? "Based on " + n + " Google reviews" : "Rated on Google";
      box.hidden = false;
    } else { box.hidden = true; }
  });

  /* ---------- Home: up next + this week ---------- */
  var nextBox = $("[data-up-next]");
  if (nextBox && S.length) {
    var now = nowInStudio(), di = DAYS.indexOf(now.day), found = null, offset = 0;
    for (var i = 0; i < 7 && !found; i++) {
      var d = DAYS[(di + i) % 7];
      var list = classesOn(d).filter(function (c) { return i > 0 || toMin(c.time) > now.min; });
      if (list.length) { found = list[0]; offset = i; }
    }
    if (found) {
      $(".next-card__label", nextBox).textContent = offset === 0 ? "Up next · Today" : offset === 1 ? "Up next · Tomorrow" : "Up next · " + cap(found.day);
      $(".next-card__class", nextBox).textContent = found.name;
      $(".next-card__meta", nextBox).textContent = fmtTime(found.time) + "  ·  with " + found.coach;
      $(".next-card .btn", nextBox).href = bookUrl(found);
    }
    var mw = $(".mini-week", nextBox);
    if (mw) mw.innerHTML = DAYS.map(function (d) {
      var cs = classesOn(d);
      var txt = cs.length ? cs.map(function (c) { return esc(c.name); }).join(" · ") : "Rest day";
      var t = cs.length ? cs.map(function (c) { return fmtTime(c.time).replace(" ", ""); }).join(" · ") : "—";
      return '<li class="' + (d === now.day ? "is-today" : "") + '"><span>' + d.slice(0, 3) + '</span><span>' + t.split(" · ")[0] + '</span><span>' + txt + "</span></li>";
    }).join("");
  }

  /* ---------- Schedule page ---------- */
  var week = $("[data-week]");
  if (week) {
    var today = nowInStudio().day;
    week.innerHTML = DAYS.map(function (d) {
      var cs = classesOn(d), rows;
      if (!cs.length && REST.indexOf(d) > -1) rows = '<div class="class-row is-rest">Rest day</div>';
      else rows = cs.map(function (c) {
        return '<div class="class-row" data-coach="' + esc(c.coach) + '">' +
          '<span class="class-row__time">' + fmtTime(c.time) + "</span>" +
          '<span class="class-row__name">' + esc(c.name) + "</span>" +
          '<span class="class-row__coach">' + esc(c.coach) + "</span>" +
          '<a class="btn btn--sm" href="' + bookUrl(c) + '">Book<span class="visually-hidden"> ' + esc(c.name) + "</span></a></div>";
      }).join("");
      return '<div class="day reveal' + (d === today ? " is-today" : "") + '" data-day="' + d + '"><div class="day__name">' + d + (d === today ? "<small>Today</small>" : "") + '</div><div class="day__classes">' + rows + "</div></div>";
    }).join("");
    $$(".reveal", week).forEach(function (el) { el.classList.add("is-in"); });

    var coaches = []; S.forEach(function (c) { if (coaches.indexOf(c.coach) < 0) coaches.push(c.coach); });
    var fl = $("[data-filters]");
    if (fl) {
      fl.innerHTML = '<button class="chip" aria-pressed="true" data-coach="all">All classes</button>' +
        coaches.map(function (c) { return '<button class="chip" aria-pressed="false" data-coach="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
      fl.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        var who = b.getAttribute("data-coach");
        $$(".chip", fl).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        $$(".day", week).forEach(function (day) {
          var visible = 0;
          $$(".class-row", day).forEach(function (r) {
            var show = who === "all" ? true : r.getAttribute("data-coach") === who;
            r.classList.toggle("is-hidden", !show); if (show) visible++;
          });
          day.classList.toggle("is-empty", visible === 0);
        });
      });
    }
  }

  /* ---------- Coaches: classes per coach ---------- */
  $$("[data-coach-classes]").forEach(function (ul) {
    var who = ul.getAttribute("data-coach-classes");
    ul.innerHTML = S.filter(function (c) { return c.coach === who; }).map(function (c) {
      return "<li><span>" + esc(c.name) + "</span><span>" + c.day.slice(0, 3) + " " + fmtTime(c.time).replace(" ", "") + "</span></li>";
    }).join("");
  });

  /* ---------- Booking form ---------- */
  var form = $("#booking-form");
  if (form) {
    var sel = $("#class", form);
    sel.innerHTML = '<option value="">Choose a class</option>' + DAYS.map(function (d) {
      var cs = classesOn(d); if (!cs.length) return "";
      return '<optgroup label="' + cap(d) + '">' + cs.map(function (c) {
        var v = c.name + " — " + cap(d) + " " + fmtTime(c.time);
        return '<option value="' + esc(v) + '">' + esc(c.name) + " · " + fmtTime(c.time) + " · " + esc(c.coach) + "</option>";
      }).join("") + "</optgroup>";
    }).join("");

    function syncService() {
      var s = (form.querySelector('input[name="service"]:checked') || {}).value || "";
      $$("[data-show-for]", form).forEach(function (el) {
        var on = el.getAttribute("data-show-for").split(" ").indexOf(s) > -1;
        el.classList.toggle("is-visible", on);
        $$("input, select, textarea", el).forEach(function (f) { f.disabled = !on; });
      });
    }
    function syncStage() {
      var st = (form.querySelector('input[name="stage"]:checked') || {}).value;
      $$("[data-stage]", form).forEach(function (el) {
        var on = el.getAttribute("data-stage") === st;
        el.style.display = on ? "" : "none";
        $$("select", el).forEach(function (f) { f.disabled = !on; });
      });
    }
    form.addEventListener("change", function (e) {
      if (e.target.name === "service") syncService();
      if (e.target.name === "stage") syncStage();
      var f = e.target.closest(".field"); if (f) f.classList.remove("has-error");
    });

    var q = new URLSearchParams(location.search);
    var svc = q.get("service");
    if (svc) { var r = form.querySelector('input[name="service"][value="' + svc + '"]'); if (r) r.checked = true; }
    syncService(); syncStage();
    if (q.get("class")) { sel.value = q.get("class"); }

    var status = $(".form-status", form.parentNode);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status"; status.textContent = "";
      var ok = true, firstBad = null;
      $$("[required]", form).forEach(function (f) {
        if (f.disabled) return;
        var bad = f.type === "radio" ? !form.querySelector('input[name="' + f.name + '"]:checked') : f.type === "checkbox" ? !f.checked : !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
        var wrap = f.closest(".field");
        if (wrap) wrap.classList.toggle("has-error", bad);
        if (bad) { ok = false; firstBad = firstBad || f; }
      });
      if (!ok) { firstBad.focus(); status.className = "form-status is-error"; status.textContent = "Please complete the highlighted fields."; return; }

      if (!C.web3formsKey) {
        status.className = "form-status is-error";
        status.textContent = "The booking form is not connected yet. Please message us on Instagram @" + (C.instagramHandle || "ritualstudios") + ".";
        return;
      }
      var data = new FormData(form);
      var svcLabel = { group: "Group class", personal: "Personal training", natal: "Pre/Post natal" }[data.get("service")] || "Booking";
      data.append("access_key", C.web3formsKey);
      data.append("subject", "New booking request · " + svcLabel + " · " + data.get("name"));
      data.append("from_name", "Ritual Studios website");
      data.append("replyto", data.get("email"));
      var btn = $("button[type=submit]", form); btn.disabled = true; btn.firstChild.textContent = "Sending… ";
      fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message);
          form.hidden = true;
          var done = $(".form-success"); done.classList.add("is-visible");
          $("[data-first-name]", done).textContent = String(data.get("name")).split(" ")[0];
          done.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function () {
          status.className = "form-status is-error";
          status.textContent = "Something went wrong sending your request. Please try again, or message us on Instagram.";
        })
        .finally(function () { btn.disabled = false; btn.firstChild.textContent = "Send request "; });
    });
  }

  var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();

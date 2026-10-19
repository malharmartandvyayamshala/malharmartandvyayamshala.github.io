(function () {
  var KEY = "mmvs-language";
  var root = document.documentElement;

  // Language: every text has a .lang-hi and .lang-en sibling; CSS hides the inactive one.
  function syncPlaceholders() {
    document.querySelectorAll("[data-placeholder-hi]").forEach(function (el) {
      el.placeholder = el.getAttribute("data-placeholder-" + (root.lang === "en" ? "en" : "hi"));
    });
  }
  function setLang(lang) {
    root.lang = lang;
    syncPlaceholders();
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }
  syncPlaceholders();
  document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(root.lang === "en" ? "hi" : "en");
    });
  });

  // Mobile menu
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    menuBtn && menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      document.body.classList.toggle("nav-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  // Highlight current page in nav
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-list a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.setAttribute("aria-current", "page");
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Branch search (matches Hindi and English text)
  var q = document.getElementById("branch-q");
  if (q) {
    var rows = document.querySelectorAll("#branch-list > li");
    var empty = document.getElementById("branch-empty");
    q.addEventListener("input", function () {
      var term = q.value.trim().toLowerCase(), shown = 0;
      rows.forEach(function (li) {
        var hit = !term || li.textContent.toLowerCase().indexOf(term) !== -1;
        li.hidden = !hit;
        if (hit) shown++;
      });
      empty.hidden = shown > 0;
    });
  }

  // Archive filters: show records whose data-cat includes the chosen category
  var filterBtns = document.querySelectorAll("[data-archive-filter]");
  if (filterBtns.length) {
    var records = document.querySelectorAll(".archive-item");
    var groups = document.querySelectorAll(".archive-decade");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-archive-filter");
        filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        records.forEach(function (item) {
          item.hidden = cat !== "all" && (" " + item.getAttribute("data-cat") + " ").indexOf(" " + cat + " ") === -1;
        });
        groups.forEach(function (g) { g.hidden = !g.querySelector(".archive-item:not([hidden])"); });
      });
    });
  }

  // Gallery filters: show cards whose data-cat matches the chosen category
  var galleryBtns = document.querySelectorAll("[data-gallery-filter]");
  if (galleryBtns.length) {
    var cards = document.querySelectorAll(".gallery-page .gallery-card");
    galleryBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-gallery-filter");
        galleryBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        cards.forEach(function (c) { c.hidden = cat !== "all" && c.getAttribute("data-cat") !== cat; });
      });
    });
  }

  // Archive lightbox (links still open the image directly if <dialog> is unsupported)
  var box = document.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector("img");
    var boxLink = box.querySelector("[data-lightbox-open]");
    document.querySelectorAll("[data-zoom]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var thumb = a.querySelector("img");
        boxImg.src = a.href;
        boxImg.alt = thumb ? thumb.alt : "";
        boxLink.href = a.href;
        var cap = box.querySelector("[data-lightbox-caption]");
        var src = a.querySelector(".gallery-caption");
        if (cap) cap.innerHTML = src ? src.innerHTML : "";
        box.showModal();
      });
    });
    box.querySelector(".lightbox-close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }

  // Gentle reveal on scroll
  var items = document.querySelectorAll("main .section .container > *");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();

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

/* ==========================================================================
   NexaCloud Landing Page — interactions
   - Mobile navigation
   - Marketplace slider (arrows + drag + snap)
   - How-it-works step highlight
   - FAQ accordion
   - Pixel-rain decoration (CTA & footer)
   - Back to top
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Mobile navigation ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // close the drawer when a link is tapped
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Marketplace slider ---------------- */
  var slider = document.getElementById("appSlider");
  var btnPrev = document.getElementById("sliderPrev");
  var btnNext = document.getElementById("sliderNext");

  if (slider && btnPrev && btnNext) {
    function slideStep() {
      var card = slider.querySelector(".app-card");
      if (!card) return 320;
      var gap = parseFloat(getComputedStyle(slider).gap) || 24;
      return card.getBoundingClientRect().width + gap;
    }

    function updateArrows() {
      var maxScroll = slider.scrollWidth - slider.clientWidth - 2;
      btnPrev.disabled = slider.scrollLeft <= 2;
      btnNext.disabled = slider.scrollLeft >= maxScroll;
    }

    btnPrev.addEventListener("click", function () {
      slider.scrollBy({ left: -slideStep(), behavior: "smooth" });
    });
    btnNext.addEventListener("click", function () {
      slider.scrollBy({ left: slideStep(), behavior: "smooth" });
    });
    slider.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();

    // drag to scroll with the mouse (touch scrolls natively)
    var isDown = false, startX = 0, startScroll = 0, moved = false;

    slider.addEventListener("mousedown", function (e) {
      isDown = true;
      moved = false;
      startX = e.pageX;
      startScroll = slider.scrollLeft;
      slider.style.scrollSnapType = "none";
      slider.style.scrollBehavior = "auto";
    });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      slider.scrollLeft = startScroll - dx;
    });
    window.addEventListener("mouseup", function () {
      if (!isDown) return;
      isDown = false;
      slider.style.scrollSnapType = "";
      slider.style.scrollBehavior = "";
    });
    // don't trigger card links after a drag
    slider.addEventListener("click", function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  /* ---------------- How-it-works step highlight ---------------- */
  var steps = document.querySelectorAll("#howSteps .how-step");
  steps.forEach(function (step) {
    step.addEventListener("click", function () {
      steps.forEach(function (s) { s.classList.remove("is-active"); });
      step.classList.add("is-active");
    });
  });

  /* ---------------- FAQ accordion ---------------- */
  var faqItems = document.querySelectorAll("#faqList .faq-item");

  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;

    if (item.classList.contains("is-open")) {
      a.style.maxHeight = a.scrollHeight + "px";
    }

    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-a").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------------- Pixel-rain canvases (CTA & footer) ---------------- */
  function drawPixels(canvas, options) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    var cell = options.cell;
    var cols = Math.ceil(rect.width / cell);
    var rows = Math.ceil(rect.height / cell);
    var colors = ["#7C3AED", "#5B21D6", "#4B12C1", "#3B0E9E", "#2E1065"];

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        // density grows toward the corner/edge the effect anchors to
        var tx = 1, ty = 1;
        if (options.anchorX === "right") tx = x / cols;
        if (options.anchorX === "left") tx = 1 - x / cols;
        if (options.anchorY === "bottom") ty = y / rows;
        if (options.anchorY === "top") ty = 1 - y / rows;
        var t = tx * ty;
        if (Math.random() > t * options.density) continue;

        ctx.globalAlpha = 0.15 + Math.random() * 0.7 * t;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        var size = cell * (0.42 + Math.random() * 0.3);
        ctx.fillRect(x * cell, y * cell, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }

  function paintAllPixels() {
    var cta = document.querySelector(".cta-pixels");
    var footRight = document.querySelector(".footer-pixels");
    var footLeft = document.querySelector(".footer-pixels-left");
    if (cta) drawPixels(cta, { cell: 14, density: 0.75, anchorY: "bottom" });
    if (footRight) drawPixels(footRight, { cell: 13, density: 0.7, anchorX: "right", anchorY: "top" });
    if (footLeft) drawPixels(footLeft, { cell: 13, density: 0.65, anchorX: "left", anchorY: "bottom" });
  }

  paintAllPixels();
  var pixelTimer;
  window.addEventListener("resize", function () {
    clearTimeout(pixelTimer);
    pixelTimer = setTimeout(paintAllPixels, 200);
  });

  /* ---------------- Back to top ---------------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

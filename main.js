/* =========================================================
   DIGITAL IT MOVE — UI interactions
   Nav state, mobile menu, scroll progress, reveal-on-scroll,
   animated counters, contact form.
   ========================================================= */

(function () {
  "use strict";

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- nav scroll state ---------------- */
  const nav = document.querySelector(".nav");
  const progressFill = document.getElementById("progressFill");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressFill.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile menu ---------------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* ---------------- reveal-on-scroll ---------------- */
  // Auto-tag common content blocks with .reveal, then observe them.
  const revealSelectors = [
    ".section__head",
    ".metric-card",
    ".service-row",
    ".work-card",
    ".process-step",
    ".about__inner > *",
    ".testimonial__quote",
    ".testimonial__attr",
    ".contact__inner > *",
  ];

  const revealEls = new Set();
  revealSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => revealEls.add(el));
  });
  revealEls.forEach((el) => el.classList.add("reveal"));

  if (REDUCED_MOTION) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // stagger slightly based on position among siblings
            const el = entry.target;
            const delay = (el.dataset.staggerIndex || 0) * 60;
            setTimeout(() => el.classList.add("is-visible"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    // assign stagger index within each parent group for nicer cascades
    revealSelectors.forEach((sel) => {
      const group = document.querySelectorAll(sel);
      group.forEach((el, i) => {
        el.dataset.staggerIndex = i % 6;
        io.observe(el);
      });
    });
  }

  /* ---------------- animated counters ---------------- */
  const counters = document.querySelectorAll(".metric-card__value");
  const counted = new WeakSet();

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target) || counted.has(el)) return;
    counted.add(el);

    if (REDUCED_MOTION) {
      el.textContent = target;
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    }
    requestAnimationFrame(tick);
  }

  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterIO.observe(el));

  /* ---------------- contact form ---------------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const label = submitBtn.querySelector(".btn__label");
      const originalLabel = label.textContent;

      submitBtn.disabled = true;
      label.textContent = "Sending…";

      // Simulated submit — replace with real endpoint integration.
      setTimeout(() => {
        note.textContent = "Thanks — we'll reply within one business day.";
        label.textContent = "Sent";
        form.reset();
        setTimeout(() => {
          label.textContent = originalLabel;
          submitBtn.disabled = false;
        }, 2200);
      }, 700);
    });
  }

  /* ---------------- smooth anchor offset correction ---------------- */
  // With fixed nav, ensure anchored sections aren't tucked under it.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: REDUCED_MOTION ? "auto" : "smooth" });
    });
  });
})();

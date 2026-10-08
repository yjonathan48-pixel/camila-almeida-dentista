document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  // Mobile nav toggle (closes after choosing a section)
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) links.classList.remove("open");
    });
  }

  // Highlight the menu item of the section currently on screen
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[data-section]"));
  const sections = navLinks
    .map((a) => document.getElementById(a.dataset.section))
    .filter(Boolean);

  const updateActive = () => {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach((s) => {
      if (s.offsetTop <= y) current = s;
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    navLinks.forEach((a) => {
      a.classList.toggle("active", current && a.dataset.section === current.id);
    });
  };
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();

  // Photo carousel: one photo at a time, arrows / dots / swipe / keyboard
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dotsBox = carousel.querySelector(".carousel-dots");
    let index = 0;

    const dots = Array.from(slides).map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Ir para a foto ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      dotsBox.appendChild(dot);
      return dot;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, n) => d.classList.toggle("active", n === index));
    }

    carousel.querySelector(".carousel-prev").addEventListener("click", () => go(index - 1));
    carousel.querySelector(".carousel-next").addEventListener("click", () => go(index + 1));

    carousel.setAttribute("tabindex", "0");
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });

    let startX = null;
    carousel.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    go(0);
  }

  // Contact form: build a WhatsApp message instead of a real backend submit
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name").value.trim();
      const phone = form.querySelector("#phone").value.trim();
      const message = form.querySelector("#message").value.trim();

      const text = encodeURIComponent(
        `Olá, meu nome é ${name}.\nTelefone: ${phone}\nMensagem: ${message}`
      );

      window.open(`https://wa.me/551138857806?text=${text}`, "_blank");
    });
  }
});

// Reveal the page only when photos and fonts are ready, so everything appears together
(function () {
  let shown = false;
  const show = () => {
    if (shown) return;
    shown = true;
    document.documentElement.classList.remove("is-loading");
    // Now that the page is up, fetch the remaining photos so arrows/scroll never wait
    document.querySelectorAll("img[loading=lazy]").forEach((img) => { img.loading = "eager"; });
  };
  const imagesReady = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve);
  });
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([imagesReady, fontsReady]).then(show, show);
  setTimeout(show, 2500);
})();
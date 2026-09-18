// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

                          if (toggle && links) {
                            toggle.addEventListener("click", () => {
                              links.classList.toggle("open");
                            });
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
                            `Ola, meu nome e ${name}.\nTelefone: ${phone}\nMensagem: ${message}`
                            );

                          window.open(`https://wa.me/551138857806?text=${text}`, "_blank");
    });
  }
});

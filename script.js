// ALFAJORES BERNALDINOS · Interacciones de la carta
const WHATSAPP_NUMBER = "51956732186";

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Pedido directo desde cada variedad.
document.querySelectorAll(".order-product").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    openWhatsApp(`Hola, quiero pedir un alfajor ${product} de Alfajores Bernaldinos. ¿Tienen disponibilidad?`);
  });
});

// Menú adaptable para móviles.
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }
  });
});

// Animaciones de entrada al desplazarse por la carta.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Año automático en el pie de página.
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// ===== V2 · Animaciones extra =====
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.prepend(progress);
const header = document.querySelector(".site-header");
const navLinks = [...document.querySelectorAll(".main-nav a:not(.nav-order)")];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  header?.classList.toggle("is-scrolled", scrollY > 40);
  const pos = scrollY + innerHeight * 0.35;
  sections.forEach((sec, i) => navLinks[i].classList.toggle("active", !!sec && sec.offsetTop <= pos && sec.offsetTop + sec.offsetHeight > pos));
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Entrada escalonada de las tarjetas.
document.querySelectorAll(".product").forEach((card, i) => card.style.setProperty("--d", `${(i % 2) * 0.12 + Math.floor(i / 2) * 0.08}s`));

// Efecto onda en los botones de pedido.
document.querySelectorAll(".order-product").forEach((btn) => {
  btn.addEventListener("pointerdown", (e) => {
    const r = btn.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className = "ripple";
    const size = Math.max(r.width, r.height);
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  });
});
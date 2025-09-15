document.addEventListener("DOMContentLoaded", () => {


  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", e => {
      if (link.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });


  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

 
  const heroButtons = document.querySelectorAll(".hero-buttons .btn");
  heroButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => btn.classList.add("hovered"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("hovered"));
  });


  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach(card => appearOnScroll.observe(card));

 
  const heroImage = document.querySelector(".hero-image img");
  if (heroImage) {
    heroImage.style.opacity = 0;
    heroImage.style.transform = "translateY(30px)";
    setTimeout(() => {
      heroImage.style.transition = "all 1s ease";
      heroImage.style.opacity = 1;
      heroImage.style.transform = "translateY(0)";
    }, 300);
  }


  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.background = "linear-gradient(to right, navy, midnightblue)";
    } else {
      header.style.background = "linear-gradient(to right, midnightblue, navy)";
    }
  });


  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("mouseenter", () => { logo.style.transform = "scale(1.08)"; });
    logo.addEventListener("mouseleave", () => { logo.style.transform = "scale(1)"; });
  }
});

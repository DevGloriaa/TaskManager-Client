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
  const options = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, options);

  faders.forEach(fader => appearOnScroll.observe(fader));


  const heroButtons = document.querySelectorAll(".hero-buttons .btn");
  heroButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => btn.classList.add("hovered"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("hovered"));
  });
});

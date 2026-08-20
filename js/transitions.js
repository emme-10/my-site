(function () {
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return;

    e.preventDefault();
    document.body.classList.add("page-exiting");
    setTimeout(() => { window.location.href = href; }, 220);
  });

  // Increase nav + weather contrast when scrolled over lighter card content
  const navPill = document.querySelector(".nav-pill");
  const weatherCard = document.querySelector(".weather-card");
  const clockWidget = document.querySelector(".clock-widget");

  if (navPill) {
    let ticking = false;

    function updateScrollContrast() {
      const scrolled = window.scrollY > 40;
      navPill.classList.toggle("nav-scrolled", scrolled);
      if (weatherCard) weatherCard.classList.toggle("card-scrolled", scrolled);
      if (clockWidget) clockWidget.classList.toggle("card-scrolled", scrolled);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(updateScrollContrast);
        ticking = true;
      }
    }, { passive: true });
  }
})();

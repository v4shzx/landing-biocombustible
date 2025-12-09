// Parallax Effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  const fastLayer = document.querySelectorAll(".parallax-fast");
  const mediumLayer = document.querySelectorAll(".parallax-medium");

  fastLayer.forEach((el) => {
    el.style.transform = `translateY(${scrolled * 0.3}px)`;
  });

  mediumLayer.forEach((el) => {
    el.style.transform = `translateY(${scrolled * 0.1}px)`;
  });
});

// Theme Toggle Logic
const toggleBtns = [
  document.getElementById("theme-toggle"),
  document.getElementById("theme-toggle-mobile"),
];
const sunIcons = [
  document.getElementById("sun-icon"),
  document.getElementById("sun-icon-mobile"),
];
const moonIcons = [
  document.getElementById("moon-icon"),
  document.getElementById("moon-icon-mobile"),
];
const body = document.body;

toggleBtns.forEach((btn) => {
  if (!btn) return;
  btn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isLight = body.classList.contains("light-theme");

    if (isLight) {
      // Light Mode Active -> Show Moon (to switch to dark)
      sunIcons.forEach((icon) => icon && icon.classList.add("hidden"));
      moonIcons.forEach((icon) => icon && icon.classList.remove("hidden"));
    } else {
      // Dark Mode Active -> Show Sun (to switch to light)
      sunIcons.forEach((icon) => icon && icon.classList.remove("hidden"));
      moonIcons.forEach((icon) => icon && icon.classList.add("hidden"));
    }
  });
});

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Carousel Logic
const track = document.getElementById("carousel-track");
const slides = track.children;
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
let currentSlide = 0;

function updateCarousel() {
  const width = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${currentSlide * width}px)`;
}

nextBtn.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarousel();
});

// Handle resize for responsive carousel
window.addEventListener("resize", updateCarousel);

// Scroll Spy / Active Link Logic
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.classList.remove("text-green-400", "font-bold");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("text-green-400", "font-bold");
      link.classList.remove("text-gray-300"); // For mobile
    } else {
      if (link.closest("#mobile-menu")) {
        link.classList.add("text-gray-300");
      }
    }
  });
});

// Form submission handler
const contactForm = document.getElementById("contact-form");
const popup = document.getElementById("popup-notification");
const closePopupBtn = document.getElementById("close-popup");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Show popup
  popup.classList.remove("hidden");
  popup.querySelector("div").classList.remove("scale-95");
  popup.querySelector("div").classList.add("scale-100");

  // Reset form
  contactForm.reset();
});

closePopupBtn.addEventListener("click", () => {
  popup.querySelector("div").classList.remove("scale-100");
  popup.querySelector("div").classList.add("scale-95");
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 200);
});

// Close popup when clicking outside
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    closePopupBtn.click();
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");
const navItemsWithDropdown = document.querySelectorAll(".nav-item.has-dropdown");
const hero = document.querySelector(".hero");
const heroScene = document.querySelector("[data-hero-scene]");
const heroLayers = document.querySelectorAll("[data-hero-layer]");
const heroWheel = document.querySelector(".hero-scroll-wheel");
const awardsSection = document.querySelector(".awards-section");
const expertiseSection = document.querySelector(".expertise-section");

navItemsWithDropdown.forEach((item) => {
  item.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
});

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll(".nav-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const item = toggle.closest(".nav-item.has-dropdown");
      if (!item) {
        return;
      }

      const isMobile = window.matchMedia("(max-width: 860px)").matches;
      const isOpen = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));

      if (isMobile) {
        navItemsWithDropdown.forEach((navItem) => {
          if (navItem !== item) {
            navItem.classList.remove("is-open");
            navItem.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
          }
        });
      }
    });
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      navItemsWithDropdown.forEach((item) => {
        item.classList.remove("is-open");
        item.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
      navItemsWithDropdown.forEach((item) => {
        item.classList.remove("is-open");
        item.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  navItemsWithDropdown.forEach((item) => {
    item.addEventListener("mouseleave", () => {
      if (!window.matchMedia("(max-width: 860px)").matches) {
        item.classList.remove("is-open");
        item.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
      }
    });
  });
}

if (siteHeader) {
  const syncHeader = () => {
    siteHeader.classList.toggle("is-sticky", window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

if (hero) {
  window.requestAnimationFrame(() => {
    hero.classList.add("is-ready");
  });
}

if (heroScene && heroLayers.length > 0) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const animateLayers = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    heroLayers.forEach((layer) => {
      const depth = Number(layer.getAttribute("data-hero-layer")) || 0;
      const moveX = currentX * depth * 22;
      const moveY = currentY * depth * 18;
      layer.style.setProperty("--hero-x", `${moveX}px`);
      layer.style.setProperty("--hero-y", `${moveY}px`);
    });

    heroScene.style.backgroundPosition = `${50 + currentX * 2}% ${currentY * -8}px`;
    window.requestAnimationFrame(animateLayers);
  };

  heroScene.addEventListener("mousemove", (event) => {
    const bounds = heroScene.getBoundingClientRect();
    targetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    targetY = (event.clientY - bounds.top) / bounds.height - 0.5;
  });

  heroScene.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  window.requestAnimationFrame(animateLayers);
}

if (heroWheel) {
  let start;

  const animateWheel = (timestamp) => {
    if (start == null) {
      start = timestamp;
    }

    const progress = ((timestamp - start) % 1800) / 1800;
    const translate = progress < 0.5 ? progress * 14 : (1 - progress) * 14;
    const opacity = progress < 0.5 ? 1 - progress * 0.9 : 0.55 + (progress - 0.5) * 0.9;

    heroWheel.style.transform = `translate3d(0, ${translate}px, 0)`;
    heroWheel.style.opacity = String(Math.max(0.2, opacity));

    window.requestAnimationFrame(animateWheel);
  };

  window.requestAnimationFrame(animateWheel);
}

if (awardsSection) {
  const awardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          awardsSection.classList.add("is-visible");
          awardsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  awardsObserver.observe(awardsSection);
}

if (expertiseSection) {
  const expertiseObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          expertiseSection.classList.add("is-visible");
          expertiseObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  expertiseObserver.observe(expertiseSection);
}

// Mega Menu Dynamic Hover Logic
const megaCategories = document.querySelectorAll("#mega-categories li");
const megaPanes = document.querySelectorAll(".mega-content-pane");

if (megaCategories.length > 0 && megaPanes.length > 0) {
  const switchPane = (category, event) => {
    if (event) event.preventDefault();
    // Remove active class from all categories and panes
    megaCategories.forEach((cat) => cat.classList.remove("is-active"));
    megaPanes.forEach((pane) => pane.classList.remove("is-active"));
    
    // Add active class to hovered/clicked category
    category.classList.add("is-active");
    
    // Get target pane ID and activate it
    const targetId = category.getAttribute("data-target");
    if (targetId) {
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add("is-active");
      }
    }
  };

  megaCategories.forEach((category) => {
    category.addEventListener("mouseenter", (e) => switchPane(category, null));
    category.addEventListener("click", (e) => switchPane(category, e));
    
    const link = category.querySelector("a");
    if(link) {
      link.addEventListener("focus", (e) => switchPane(category, null));
    }
  });
}



// --- ZOHO INSPIRED GLOBAL MENU LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
  const developmentTrigger = document.querySelector('.nav-trigger-development');
  const globalMenuBtns = developmentTrigger?.querySelectorAll('.global-menu-btn') ?? [];
  const globalMenuContainer = document.getElementById('zwc-global-menu-container');
  const developmentNavItem = document.querySelector('.nav-item-development');
  const developmentToggle = document.querySelector('.nav-toggle[aria-label="Toggle Development menu"]');
  const developmentTab = document.getElementById('zwc-development-tab');
  const leftCats = document.querySelectorAll('.zwc-product-category');
  const rightPanes = document.querySelectorAll('.zwc-product-details');

  const isMobileMenu = () => window.matchMedia('(max-width: 860px)').matches;

  const setDevelopmentExpanded = (isExpanded) => {
    developmentToggle?.setAttribute('aria-expanded', String(isExpanded));
    developmentNavItem?.classList.toggle('is-open', isExpanded);
  };

  const openMenu = () => {
    if (!globalMenuContainer) {
      return;
    }
    globalMenuContainer.classList.add('active');
    developmentTab?.classList.add('active');
    setDevelopmentExpanded(true);
  };

  let closeTimer;
  const closeMenu = (delay = 140) => {
    if (!globalMenuContainer) {
      return;
    }

    clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      globalMenuContainer.classList.remove('active');
      developmentTab?.classList.remove('active');
      setDevelopmentExpanded(false);
    }, delay);
  };

  const activateCategory = (category) => {
    const targetClass = category?.getAttribute('data-class');
    if (!targetClass) {
      return;
    }

    leftCats.forEach((item) => {
      const isActive = item === category;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-expanded', String(isActive));
      item.setAttribute('aria-selected', String(isActive));
    });

    rightPanes.forEach((pane) => {
      pane.classList.toggle('active', pane.classList.contains(targetClass));
    });
  };

  if (globalMenuBtns.length > 0 && globalMenuContainer && developmentNavItem) {
    developmentTrigger?.addEventListener('click', (event) => {
      event.preventDefault();

      const clickedInteractiveChild = event.target.closest('.global-menu-btn');
      if (clickedInteractiveChild) {
        return;
      }

      const shouldOpen = !globalMenuContainer.classList.contains('active');
      if (shouldOpen) {
        clearTimeout(closeTimer);
        openMenu();
      } else {
        closeMenu(0);
      }
    });

    globalMenuBtns.forEach((btn) => {
      btn.addEventListener('focusin', () => {
        if (!isMobileMenu()) {
          clearTimeout(closeTimer);
          openMenu();
        }
      });

      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const shouldOpen = !globalMenuContainer.classList.contains('active');
        if (shouldOpen) {
          clearTimeout(closeTimer);
          openMenu();
        } else {
          closeMenu(0);
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!globalMenuContainer.classList.contains('active')) {
        return;
      }

      const clickedInsideMenu = globalMenuContainer.contains(event.target);
      const clickedTrigger = developmentNavItem.contains(event.target);
      if (!clickedInsideMenu && !clickedTrigger) {
        closeMenu(0);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu(0);
      }
    });
  }

  // Left Sidebar Categories Logic
  leftCats.forEach((cat) => {
    cat.addEventListener('mouseenter', () => {
      if (!isMobileMenu()) {
        activateCategory(cat);
      }
    });

    cat.addEventListener('focus', () => activateCategory(cat));
    cat.addEventListener('click', () => activateCategory(cat));
  });
});

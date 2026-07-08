const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");
const navItemsWithDropdown = document.querySelectorAll(".nav-item.has-dropdown");
const hero = document.querySelector(".hero");
const heroWheel = document.querySelector(".hero-scroll-wheel");
const awardsSection = document.querySelector(".awards-section");
const expertiseSection = document.querySelector(".expertise-section");

navItemsWithDropdown.forEach((item) => {
  item.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
});

if (menuToggle && mainNav) {
  const companyNavItem = mainNav.querySelector(".nav-item-company");
  const companyLink = mainNav.querySelector(".nav-link-company");
  const companyToggle = mainNav.querySelector(".nav-toggle-company");

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

      if (!isMobile && item === companyNavItem) {
        navItemsWithDropdown.forEach((navItem) => {
          if (navItem !== item) {
            navItem.classList.remove("is-open");
            navItem.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
          }
        });
      }

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
      if (!window.matchMedia("(max-width: 860px)").matches && link === companyLink) {
        return;
      }

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

  companyLink?.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 860px)").matches || !companyNavItem || !companyToggle) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    navItemsWithDropdown.forEach((navItem) => {
      if (navItem !== companyNavItem) {
        navItem.classList.remove("is-open");
        navItem.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
      }
    });

    const isOpen = companyNavItem.classList.toggle("is-open");
    companyToggle.setAttribute("aria-expanded", String(isOpen));
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
  const searchWrapper = document.querySelector('.zwcg-category-search');
  const searchField = searchWrapper?.querySelector('.zwcg-category-search-field');
  const exploreWrapper = document.querySelector('.zwc-explore-wrapper');

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
    const activeCategory = Array.from(leftCats).find((cat) => cat.classList.contains('active')) ?? leftCats[0];
    if (activeCategory) {
      activateCategory(activeCategory);
    }
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

  const filterPaneCards = (targetPane) => {
    if (!targetPane) {
      return;
    }

    const cardsList = targetPane.querySelector('.mega-sub-links');
    if (!cardsList) {
      return;
    }

    const query = searchField?.value.trim().toLowerCase() ?? '';
    const cards = Array.from(cardsList.querySelectorAll(':scope > li'));
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = card.textContent?.toLowerCase() ?? '';
      const matches = query === '' || text.includes(query);
      card.classList.toggle('is-search-hidden', !matches);
      if (matches) {
        visibleCount += 1;
      }
    });

    let emptyState = targetPane.querySelector('.zwc-search-empty');
    if (!emptyState) {
      emptyState = document.createElement('p');
      emptyState.className = 'zwc-search-empty';
      emptyState.textContent = 'No services match your search.';
      cardsList.after(emptyState);
    }

    emptyState.classList.toggle('is-visible', query !== '' && visibleCount === 0);
  };

  const syncPaneHeader = (targetPane) => {
    if (!targetPane) {
      return;
    }

    const title = targetPane.querySelector('.zwc-category-title');
    if (!title) {
      return;
    }

    let header = targetPane.querySelector('.zwc-category-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'zwc-category-header';
      title.before(header);
    }

    header.appendChild(title);
    filterPaneCards(targetPane);
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

    let activePane = null;
    rightPanes.forEach((pane) => {
      const isActive = pane.classList.contains(targetClass);
      pane.classList.toggle('active', isActive);
      if (isActive) {
        activePane = pane;
      }
    });

    syncPaneHeader(activePane);
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

  searchField?.addEventListener('input', () => {
    const activePane = Array.from(rightPanes).find((pane) => pane.classList.contains('active'));
    if (activePane) {
      filterPaneCards(activePane);
    }
  });

  const initialCategory = Array.from(leftCats).find((cat) => cat.classList.contains('active')) ?? leftCats[0];
  if (initialCategory) {
    activateCategory(initialCategory);
  }
});

// Header Search Logic
document.addEventListener("DOMContentLoaded", () => {
  const headerSearchWrapper = document.querySelector(".header-search-wrapper");
  const headerSearchBtn = document.querySelector(".header-search-wrapper .search-button");
  const headerSearchInput = document.querySelector(".header-search-input");

  const searchTerms = ["Services", "Tools", "Blogs"];
  let termIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeWriter() {
    if (!headerSearchWrapper.classList.contains("search-active")) return;

    const currentTerm = searchTerms[termIndex];
    
    if (isDeleting) {
      headerSearchInput.placeholder = "Search " + currentTerm.substring(0, charIndex - 1);
      charIndex--;
    } else {
      headerSearchInput.placeholder = "Search " + currentTerm.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentTerm.length) {
      typeSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      termIndex = (termIndex + 1) % searchTerms.length;
      typeSpeed = 300;
    }

    typingTimeout = setTimeout(typeWriter, typeSpeed);
  }

  function stopTypeWriter() {
    clearTimeout(typingTimeout);
    headerSearchInput.placeholder = "Search...";
    termIndex = 0;
    charIndex = 0;
    isDeleting = false;
  }

  // Global Search Logic
  const globalSearchIndex = [];
  const resultsContainer = document.querySelector('.header-search-results');

  // Build index from DOM
  const serviceCards = document.querySelectorAll('.mega-infobox-link');
  serviceCards.forEach(link => {
    const title = link.querySelector('.mega-info-box-title')?.textContent.trim() || '';
    const desc = link.querySelector('.mega-info-box-desc')?.textContent.trim() || '';
    if (title) {
      globalSearchIndex.push({
        title: title,
        desc: desc,
        href: link.getAttribute('href') || '#',
        type: 'Service'
      });
    }
  });

  // Hardcode specific pages
  globalSearchIndex.push({ title: 'AI Business Tools', desc: 'Explore our latest AI-powered business tools.', href: '#contact', type: 'Tools' });
  globalSearchIndex.push({ title: 'Blog', desc: 'Read our latest articles and insights.', href: '#', type: 'Blog' });
  globalSearchIndex.push({ title: 'Contact Us', desc: 'Get in touch with our team today.', href: '#contact', type: 'Page' });

  headerSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (query.length < 2) {
      resultsContainer.classList.remove('has-results');
      return;
    }

    const matches = globalSearchIndex.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.desc.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      resultsContainer.classList.add('has-results');
      matches.forEach(match => {
        const a = document.createElement('a');
        a.href = match.href;
        a.className = 'search-result-item';
        a.innerHTML = `<span class="search-result-title">${match.title}</span><span class="search-result-desc">${match.desc}</span>`;
        a.addEventListener('click', () => {
          closeSearch();
        });
        resultsContainer.appendChild(a);
      });
    } else {
      resultsContainer.classList.add('has-results');
      resultsContainer.innerHTML = `<span class="search-result-item"><span class="search-result-title">No results found</span></span>`;
    }
  });

  function closeSearch() {
    headerSearchWrapper.classList.remove("search-active");
    resultsContainer?.classList.remove('has-results');
    headerSearchInput.value = '';
    stopTypeWriter();
  }

  if (headerSearchWrapper && headerSearchBtn && headerSearchInput) {
    headerSearchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (headerSearchWrapper.classList.contains("search-active")) {
        closeSearch();
      } else {
        headerSearchWrapper.classList.add("search-active");
        headerSearchInput.focus();
        if (headerSearchInput.value.trim().length >= 2) {
          resultsContainer?.classList.add('has-results');
        }
        typeWriter();
      }
    });

    document.addEventListener("click", (e) => {
      if (!headerSearchWrapper.contains(e.target) && headerSearchWrapper.classList.contains("search-active")) {
        closeSearch();
      }
    });

    headerSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSearch();
        headerSearchBtn.focus();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const marketButtons = Array.from(document.querySelectorAll(".market-logo-button"));
  const marketImage = document.getElementById("market-feature-image");
  const marketTitle = document.getElementById("market-feature-title");
  const marketLink = document.getElementById("market-feature-link");
  const statOneLabel = document.getElementById("market-stat-one-label");
  const statOneText = document.getElementById("market-stat-one-text");
  const statTwoLabel = document.getElementById("market-stat-two-label");
  const statTwoText = document.getElementById("market-stat-two-text");
  const statThreeLabel = document.getElementById("market-stat-three-label");
  const statThreeText = document.getElementById("market-stat-three-text");

  if (!marketButtons.length || !marketImage || !marketTitle || !marketLink) {
    return;
  }

  const applyMarketStory = (button) => {
    marketButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    marketImage.src = button.dataset.image || marketImage.src;
    marketImage.alt = button.dataset.alt || marketImage.alt;
    marketTitle.textContent = button.dataset.title || marketTitle.textContent;
    marketLink.href = button.dataset.href || "#";

    if (statOneLabel && statOneText) {
      statOneLabel.textContent = button.dataset.statOneLabel || "";
      statOneText.textContent = button.dataset.statOneText || "";
    }

    if (statTwoLabel && statTwoText) {
      statTwoLabel.textContent = button.dataset.statTwoLabel || "";
      statTwoText.textContent = button.dataset.statTwoText || "";
    }

    if (statThreeLabel && statThreeText) {
      statThreeLabel.textContent = button.dataset.statThreeLabel || "";
      statThreeText.textContent = button.dataset.statThreeText || "";
    }
  };

  marketButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      if (window.matchMedia("(min-width: 861px)").matches) {
        applyMarketStory(button);
      }
    });

    button.addEventListener("focus", () => applyMarketStory(button));
    button.addEventListener("click", () => applyMarketStory(button));
  });
});

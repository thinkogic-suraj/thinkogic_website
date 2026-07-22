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
  let lastScrollY = window.scrollY;
  let tickingHeader = false;

  const syncHeader = () => {
    const currentScrollY = window.scrollY;
    const isMenuOpen = mainNav?.classList.contains("is-open");
    const isPastThreshold = currentScrollY > 12;
    const isScrollingDown = currentScrollY > lastScrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);

    siteHeader.classList.toggle("is-sticky", isPastThreshold);

    if (!isPastThreshold || currentScrollY <= 8 || isMenuOpen) {
      siteHeader.classList.remove("is-hidden");
    } else if (scrollDelta > 6) {
      siteHeader.classList.toggle("is-hidden", isScrollingDown);
    }

    lastScrollY = Math.max(currentScrollY, 0);
    tickingHeader = false;
  };

  syncHeader();
  window.addEventListener(
    "scroll",
    () => {
      if (tickingHeader) {
        return;
      }

      tickingHeader = true;
      window.requestAnimationFrame(syncHeader);
    },
    { passive: true }
  );
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
const ensureDevelopmentMegaMenu = async () => {
  if (document.getElementById('zwc-global-menu-container')) {
    return;
  }

  const siteHeader = document.querySelector('.site-header');
  const navShell = siteHeader?.querySelector('.nav-shell');
  if (!siteHeader || !navShell || !document.querySelector('.nav-item-development')) {
    return;
  }

  try {
    const response = await fetch('/index.html', { credentials: 'same-origin' });
    if (!response.ok) {
      return;
    }

    const markup = await response.text();
    const parser = new DOMParser();
    const remoteDoc = parser.parseFromString(markup, 'text/html');
    const sharedMenu = remoteDoc.getElementById('zwc-global-menu-container');
    if (!sharedMenu) {
      return;
    }

    siteHeader.insertBefore(sharedMenu, navShell.nextSibling);
  } catch (error) {
    console.warn('Unable to load shared development mega menu.', error);
  }
};

const initDevelopmentMegaMenu = () => {
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

  if (!developmentTrigger || !globalMenuContainer || !developmentNavItem) {
    return;
  }

  if (developmentNavItem.dataset.megaMenuInitialized === 'true') {
    return;
  }

  developmentNavItem.dataset.megaMenuInitialized = 'true';

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

  if (globalMenuBtns.length > 0) {
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
};

document.addEventListener('DOMContentLoaded', async () => {
  await ensureDevelopmentMegaMenu();
  initDevelopmentMegaMenu();
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
  const marketCopy = document.getElementById("market-panel-copy");
  const marketMedia = document.getElementById("market-panel-media");
  const marketImage = document.getElementById("market-feature-image");
  const marketTitle = document.getElementById("market-feature-title");
  const marketDescription = document.getElementById("market-feature-description");
  const marketLink = document.getElementById("market-feature-link");
  const marketHighlights = document.getElementById("market-highlights");

  if (!marketButtons.length || !marketCopy || !marketMedia || !marketImage || !marketTitle || !marketDescription || !marketLink || !marketHighlights) {
    return;
  }

  let transitionTimer;

  const renderMarketStory = (button) => {
    marketButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    const highlights = [
      button.dataset.highlightOne,
      button.dataset.highlightTwo,
      button.dataset.highlightThree,
    ].filter(Boolean);

    marketImage.src = button.dataset.image || marketImage.src;
    marketImage.alt = button.dataset.alt || marketImage.alt;
    marketTitle.textContent = button.dataset.title || marketTitle.textContent;
    marketDescription.textContent = button.dataset.description || marketDescription.textContent;
    marketLink.href = button.dataset.href || "#";
    marketHighlights.innerHTML = highlights.map((item) => `<li>${item}</li>`).join("");
  };

  const animateMarketStory = (button) => {
    clearTimeout(transitionTimer);
    marketCopy.classList.add("is-transitioning");
    marketMedia.classList.add("is-transitioning");

    transitionTimer = window.setTimeout(() => {
      renderMarketStory(button);
      marketCopy.classList.remove("is-transitioning");
      marketMedia.classList.remove("is-transitioning");
    }, 170);
  };

  marketButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      if (window.matchMedia("(min-width: 861px)").matches && !button.classList.contains("is-active")) {
        animateMarketStory(button);
      }
    });

    button.addEventListener("focus", () => animateMarketStory(button));
    button.addEventListener("click", () => animateMarketStory(button));
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const processList = document.querySelector(".mad-process-list");
  const processRows = Array.from(document.querySelectorAll(".mad-process-row"));
  if (processList && processRows.length > 0) {
    processList.style.setProperty("--mad-process-count", String(processRows.length));
    processRows.forEach((row, index) => {
      row.style.zIndex = String(index + 1);
    });
  }

  const impactCounters = Array.from(document.querySelectorAll("[data-mad-counter]"));
  if (impactCounters.length > 0) {
    const animateCounter = (counter) => {
      if (counter.dataset.animated === "true") {
        return;
      }

      counter.dataset.animated = "true";
      const target = Number(counter.dataset.target || "0");
      const decimals = Number(counter.dataset.decimals || "0");
      const suffix = counter.dataset.suffix || "";
      const duration = 1800;
      let startTime = 0;

      const updateValue = (timestamp) => {
        if (startTime === 0) {
          startTime = timestamp;
        }

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * eased;
        const formattedValue = decimals > 0
          ? currentValue.toFixed(decimals)
          : Math.round(currentValue).toString();

        counter.textContent = `${formattedValue}${suffix}`;

        if (progress < 1) {
          window.requestAnimationFrame(updateValue);
        } else {
          counter.textContent = `${decimals > 0 ? target.toFixed(decimals) : target}${suffix}`;
        }
      };

      window.requestAnimationFrame(updateValue);
    };

    const impactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            impactObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    impactCounters.forEach((counter) => impactObserver.observe(counter));
  }

  const expertiseShell = document.querySelector("[data-mad-expertise]");
  if (expertiseShell) {
    const viewport = expertiseShell.querySelector(".mad-expertise-viewport");
    const track = expertiseShell.querySelector(".mad-expertise-track");
    const cards = track ? Array.from(track.querySelectorAll(".mad-expertise-card")) : [];
    const prevButton = document.querySelector('[data-mad-expertise-arrows] [data-direction="prev"]');
    const nextButton = document.querySelector('[data-mad-expertise-arrows] [data-direction="next"]');
    let currentIndex = 0;

    const getVisibleCards = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        return 1;
      }

      if (window.matchMedia("(max-width: 860px)").matches) {
        return 2;
      }

      if (window.matchMedia("(max-width: 1180px)").matches) {
        return 3;
      }

      return 4;
    };

    const getGap = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        return 14;
      }

      return 18;
    };

    const getMaxIndex = () => Math.max(0, cards.length - getVisibleCards());

    const syncExpertiseSlider = () => {
      if (!viewport || !track || cards.length === 0) {
        return;
      }

      const visibleCards = getVisibleCards();
      const gap = getGap();
      const cardWidth = cards[0].getBoundingClientRect().width;
      const maxIndex = getMaxIndex();

      currentIndex = Math.min(currentIndex, maxIndex);

      const offset = (cardWidth + gap) * currentIndex;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      if (prevButton) {
        prevButton.disabled = currentIndex <= 0;
      }

      if (nextButton) {
        nextButton.disabled = currentIndex >= maxIndex || cards.length <= visibleCards;
      }
    };

    prevButton?.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      syncExpertiseSlider();
    });

    nextButton?.addEventListener("click", () => {
      currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
      syncExpertiseSlider();
    });

    window.addEventListener("resize", syncExpertiseSlider, { passive: true });
    syncExpertiseSlider();
  }

  const testimonialShell = document.querySelector(".mad-testimonial-row");
  if (testimonialShell) {
    const testimonialCards = [
      { stars: ["★", "★", "★", "★", "☆"], rating: "4.5 star rating" },
      { stars: ["★", "★", "★", "★", "★"], rating: "5 star rating" },
      { stars: ["★", "★", "★", "★", "★"], rating: "5 star rating" },
      { stars: ["★", "★", "★", "★", "★"], rating: "5 star rating" },
      { stars: ["★", "★", "★", "★", "★"], rating: "5 star rating" },
      { stars: ["★", "★", "★", "★", "★"], rating: "5 star rating" }
    ];
    const quoteSvg = '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"/></svg>';
    const buildStars = (rating) => rating === "4.5 star rating"
      ? ["\u2605", "\u2605", "\u2605", "\u2605", "\u2606"]
      : ["\u2605", "\u2605", "\u2605", "\u2605", "\u2605"];

    testimonialShell.innerHTML = `
      <button class="mad-testimonial-arrow mad-testimonial-arrow-prev" type="button" aria-label="Previous testimonials" data-direction="prev">
        <span aria-hidden="true">\u2190</span>
      </button>
      <div class="mad-testimonial-viewport">
        <div class="mad-testimonial-track">
          ${testimonialCards.map((card) => `
            <article class="mad-testimonial">
              <div class="mad-testimonial-quote" aria-hidden="true">${quoteSvg}</div>
              <p>They were very prompt in their responses and always available. Thanks to Thinkogic engineers, we were able to complete all projects on time and without any issues. The team was very prompt in terms of responding to queries and requests.</p>
              <div class="mad-testimonial-footer">
                <img class="mad-testimonial-logo" src="https://thinkogic.com/wp-content/uploads/2024/09/smarti_logo-1-4.png" alt="Smart-i" />
                <ul class="mad-stars" aria-label="${card.rating}">
                  ${buildStars(card.rating).map((star) => `<li>${star}</li>`).join("")}
                </ul>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
      <button class="mad-testimonial-arrow mad-testimonial-arrow-next" type="button" aria-label="Next testimonials" data-direction="next">
        <span aria-hidden="true">\u2192</span>
      </button>
    `;

    const viewport = testimonialShell.querySelector(".mad-testimonial-viewport");
    const track = testimonialShell.querySelector(".mad-testimonial-track");
    const cards = track ? Array.from(track.querySelectorAll(".mad-testimonial")) : [];
    const prevButton = testimonialShell.querySelector('[data-direction="prev"]');
    const nextButton = testimonialShell.querySelector('[data-direction="next"]');
    let currentIndex = 0;

    const getVisibleCards = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        return 1;
      }

      if (window.matchMedia("(max-width: 1024px)").matches) {
        return 2;
      }

      return 3;
    };

    const getGap = () => {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        return 10;
      }

      return 6;
    };

    const getMaxIndex = () => Math.max(0, cards.length - getVisibleCards());

    const syncTestimonialSlider = () => {
      if (!viewport || !track || cards.length === 0) {
        return;
      }

      const gap = getGap();
      const cardWidth = cards[0].getBoundingClientRect().width;
      const maxIndex = getMaxIndex();

      currentIndex = Math.min(currentIndex, maxIndex);
      track.style.transform = `translate3d(${-((cardWidth + gap) * currentIndex)}px, 0, 0)`;

      if (prevButton) {
        prevButton.disabled = currentIndex <= 0;
      }

      if (nextButton) {
        nextButton.disabled = currentIndex >= maxIndex;
      }
    };

    prevButton?.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      syncTestimonialSlider();
    });

    nextButton?.addEventListener("click", () => {
      currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
      syncTestimonialSlider();
    });

    window.addEventListener("resize", syncTestimonialSlider, { passive: true });
    syncTestimonialSlider();
  }

  const techShell = document.querySelector("[data-mad-tech]");
  if (techShell) {
    const tabs = Array.from(techShell.querySelectorAll(".mad-tech-tab"));
    const panels = Array.from(techShell.querySelectorAll(".mad-tech-panel"));

    const activateTechTab = (tab) => {
      const target = tab.dataset.panel;

      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.panel === target;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activateTechTab(tab));
    });
  }

  const faqShell = document.querySelector("[data-mad-faq]");
  if (faqShell) {
    const items = Array.from(faqShell.querySelectorAll(".mad-faq-item"));

    items.forEach((item) => {
      const trigger = item.querySelector(".mad-faq-trigger");
      const panel = item.querySelector(".mad-faq-panel");

      if (!trigger || !panel) {
        return;
      }

      trigger.addEventListener("click", () => {
        const willOpen = trigger.getAttribute("aria-expanded") !== "true";

        items.forEach((entry) => {
          const entryTrigger = entry.querySelector(".mad-faq-trigger");
          const entryPanel = entry.querySelector(".mad-faq-panel");

          if (!entryTrigger || !entryPanel) {
            return;
          }

          const isCurrent = entry === item && willOpen;
          entryTrigger.setAttribute("aria-expanded", String(isCurrent));
          entryPanel.hidden = !isCurrent;
        });
      });
    });
  }

  const initPartnerLoop = ({ shellSelector, trackSelector, gapVar, visibleVar, slideVar }) => {
    const partnerStrip = document.querySelector(shellSelector);
    if (!partnerStrip) {
      return;
    }

    const partnerTrack = partnerStrip.querySelector(trackSelector);
    const baseSlides = partnerTrack ? Array.from(partnerTrack.children) : [];
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let loopWidth = 0;
    let offset = 0;
    let lastFrameTime = 0;
    let frameId = 0;
    let isPaused = false;

    const getVisibleSlides = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        return 2;
      }

      if (window.matchMedia("(max-width: 860px)").matches) {
        return 3;
      }

      return 4;
    };

    const getPartnerGap = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        return 22;
      }

      if (window.matchMedia("(max-width: 860px)").matches) {
        return 28;
      }

      if (window.matchMedia("(max-width: 1180px)").matches) {
        return 36;
      }

      return 48;
    };

    const syncPartnerMetrics = () => {
      if (!partnerTrack || baseSlides.length === 0) {
        return;
      }

      const gap = getPartnerGap();
      const visibleSlides = getVisibleSlides();
      const availableWidth = partnerStrip.clientWidth;
      const slideWidth = Math.max(86, (availableWidth - gap * (visibleSlides - 1)) / visibleSlides);

      partnerStrip.style.setProperty(gapVar, `${gap}px`);
      partnerStrip.style.setProperty(visibleVar, String(visibleSlides));
      partnerStrip.style.setProperty(slideVar, `${slideWidth}px`);

      loopWidth = baseSlides.reduce((sum, slide) => sum + slide.getBoundingClientRect().width, 0);
      loopWidth += gap * Math.max(baseSlides.length - 1, 0);
      offset = loopWidth > 0 ? offset % loopWidth : 0;
      partnerTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const buildPartnerLoop = () => {
      if (!partnerTrack || baseSlides.length === 0) {
        return;
      }

      partnerTrack.querySelectorAll("[data-clone='true']").forEach((clone) => clone.remove());

      for (let cycle = 0; cycle < 3; cycle += 1) {
        baseSlides.forEach((slide) => {
          const clone = slide.cloneNode(true);
          clone.dataset.clone = "true";
          clone.setAttribute("aria-hidden", "true");
          const image = clone.querySelector("img");
          if (image) {
            image.alt = "";
          }
          partnerTrack.appendChild(clone);
        });
      }
    };

    const stepPartnerLoop = (timestamp) => {
      if (!partnerTrack) {
        return;
      }

      if (lastFrameTime === 0) {
        lastFrameTime = timestamp;
      }

      const delta = (timestamp - lastFrameTime) / 1000;
      lastFrameTime = timestamp;

      if (!isPaused && !reducedMotionQuery.matches && loopWidth > 0) {
        offset += 28 * delta;
        if (offset >= loopWidth) {
          offset -= loopWidth;
        }
        partnerTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      frameId = window.requestAnimationFrame(stepPartnerLoop);
    };

    const startPartnerLoop = () => {
      if (frameId || reducedMotionQuery.matches || !partnerTrack) {
        return;
      }

      lastFrameTime = 0;
      frameId = window.requestAnimationFrame(stepPartnerLoop);
    };

    const stopPartnerLoop = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const refreshPartnerLoop = () => {
      syncPartnerMetrics();

      if (reducedMotionQuery.matches) {
        stopPartnerLoop();
        offset = 0;
        if (partnerTrack) {
          partnerTrack.style.transform = "translate3d(0, 0, 0)";
        }
        return;
      }

      startPartnerLoop();
    };

    if (partnerTrack && baseSlides.length > 0) {
      buildPartnerLoop();
      syncPartnerMetrics();
      startPartnerLoop();

      baseSlides.forEach((slide) => {
        slide.querySelector("img")?.addEventListener("load", syncPartnerMetrics, { once: true });
      });

      partnerStrip.addEventListener("mouseenter", () => {
        isPaused = true;
      });

      partnerStrip.addEventListener("mouseleave", () => {
        isPaused = false;
      });

      partnerStrip.addEventListener("focusin", () => {
        isPaused = true;
      });

      partnerStrip.addEventListener("focusout", () => {
        isPaused = false;
      });

      window.addEventListener("resize", refreshPartnerLoop, { passive: true });

      if (typeof reducedMotionQuery.addEventListener === "function") {
        reducedMotionQuery.addEventListener("change", refreshPartnerLoop);
      } else if (typeof reducedMotionQuery.addListener === "function") {
        reducedMotionQuery.addListener(refreshPartnerLoop);
      }
    }
  };

  initPartnerLoop({
    shellSelector: "[data-mad-partners]",
    trackSelector: ".mad-partner-track",
    gapVar: "--mad-partner-gap",
    visibleVar: "--mad-visible-slides",
    slideVar: "--mad-slide-width",
  });

  initPartnerLoop({
    shellSelector: "[data-wpd-partners]",
    trackSelector: ".wpd-partner-track",
    gapVar: "--wpd-partner-gap",
    visibleVar: "--wpd-visible-slides",
    slideVar: "--wpd-slide-width",
  });
});

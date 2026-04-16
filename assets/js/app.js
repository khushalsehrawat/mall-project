const venueData = {
  parkview: {
    title: "Parkview Meeting + Event Center",
    type: "Private event flagship",
    capacity: "720 standing",
    squareFeet: "4,000 sq ft",
    overview:
      "Positioned in the southwest corner of Nickelodeon Universe, Parkview gives brands and promoters a premium box above the action with full A/V, private restrooms, and a balcony overlooking the park.",
    details: [
      "720 standing reception capacity in the full room",
      "272 banquet seats in the interior room",
      "177 standing guests on the exterior balcony",
      "Built for launches, receptions, sponsor hospitality, and elevated private buyouts"
    ],
    metrics: [
      { label: "Interior", value: "3,000 sq ft" },
      { label: "Balcony", value: "1,000 sq ft" },
      { label: "Banquet", value: "272" },
      { label: "Reception", value: "720" }
    ]
  },
  executive: {
    title: "Executive Center",
    type: "Flexible multi-room venue",
    capacity: "244 standing",
    squareFeet: "2,834 sq ft",
    overview:
      "Located on Level 4 East and overlooking Nickelodeon Universe, the Executive Center packages four meeting spaces into one business-forward venue for presentations, press events, conferences, and VIP partner sessions.",
    details: [
      "Four distinct meeting spaces plus two adjoining conference room formats",
      "95 classroom capacity and 220 theater capacity",
      "Ideal for summits, sponsor pitches, corporate hospitality, and content studios",
      "Fast transition between plenary, breakout, and reception mode"
    ],
    metrics: [
      { label: "Suites", value: "4 rooms" },
      { label: "Theater", value: "220" },
      { label: "Classroom", value: "95" },
      { label: "Conference", value: "47-54" }
    ]
  },
  lounge: {
    title: "The Lounge",
    type: "Casual gathering space",
    capacity: "70 guests",
    squareFeet: "3,000 sq ft",
    overview:
      "The Lounge offers a more intimate social setting for curated community programming, talent green rooms, executive meetups, brand workshops, and softer-touch partnership moments inside the destination.",
    details: [
      "Flexible setup options with room for up to 70 guests",
      "Works for curated dinners, media previews, and small-format speaking programs",
      "Pairs well with larger public-facing activations elsewhere on property",
      "Built for high-touch networking and premium hospitality"
    ],
    metrics: [
      { label: "Footprint", value: "3,000 sq ft" },
      { label: "Guest Count", value: "70" },
      { label: "Format", value: "Flexible" },
      { label: "Use Case", value: "Hospitality" }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileLayoutQuery = window.matchMedia("(max-width: 767px)");

  const menuTrigger = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector(".nav-links");
  const header = document.querySelector(".deck-header");
  const deckFooter = document.querySelector(".deck-footer");
  const progressBar = document.querySelector(".scroll-progress");
  const deck = document.querySelector("[data-deck]");
  const deckTrack = document.querySelector("[data-deck-track]");
  const introGate = document.querySelector("[data-intro-gate]");
  const enterButtons = document.querySelectorAll("[data-enter-deck], [data-enter-deck-secondary]");
  const navAnchors = document.querySelectorAll(".nav-links a, .section-rail a, .deck-footer__nav a");
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const slides = Array.from(
    deckTrack?.querySelectorAll("section[id]") || deck?.querySelectorAll("section[id]") || document.querySelectorAll("section[id]")
  );
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
  }
  const moduleVideo = document.querySelector(".module-hero video");
  const slider = document.querySelector("[data-dining-slider]");
  const prevButton = document.querySelector("[data-slider-prev]");
  const nextButton = document.querySelector("[data-slider-next]");
  const module = document.getElementById("eventsModule");
  const moduleButtons = document.querySelectorAll("[data-open-module]");
  const closeModuleButton = document.querySelector("[data-close-module]");
  const moduleBackdrop = document.querySelector(".events-module__backdrop");
  const venueButtons = document.querySelectorAll("[data-venue]");
  const detailTitle = document.querySelector("[data-detail-title]");
  const detailType = document.querySelector("[data-detail-type]");
  const detailOverview = document.querySelector("[data-detail-overview]");
  const detailCapacity = document.querySelector("[data-detail-capacity]");
  const detailSquareFeet = document.querySelector("[data-detail-squarefeet]");
  const detailList = document.querySelector("[data-detail-list]");
  const detailMetrics = document.querySelector("[data-detail-metrics]");
  const revealTargets = document.querySelectorAll(
    ".section-heading, .section-surface, .why-visual, .kpi-card, .retail-panel__card, .luxury-layout, .dining-card, .entertainment-card, .event-panel, .opportunity-card"
  );
  const loopAnimations = [];
  const animatedCounters = new WeakSet();
  let activeIndex = Math.max(
    slides.findIndex((slide) => `#${slide.id}` === window.location.hash),
    0
  );
  let touchStartX = 0;
  let touchStartY = 0;
  let isScrollLocked = false;
  let unlockTimer = 0;
  let hasQueuedMotion = false;
  let fitFrame = 0;

  const safePlay = (media) => {
    if (!media) return;
    const playPromise = media.play?.();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const pauseMedia = (media) => {
    if (!media) return;
    media.pause?.();
  };

  const isMobileLayout = () => mobileLayoutQuery.matches;
  const hasEnteredDeck = () => document.body.classList.contains("is-entered");
  const isModuleOpen = () => module?.classList.contains("is-open");

  const syncChromeMetrics = () => {
    const headerHeight = Math.ceil(header?.offsetHeight || 128);
    const footerVisible = deckFooter && window.getComputedStyle(deckFooter).display !== "none";
    const footerHeight = footerVisible ? Math.ceil((deckFooter?.offsetHeight || 0) + 32) : 28;

    document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
    document.documentElement.style.setProperty("--deck-footer-space", `${footerHeight}px`);
  };

  const updateDeckUI = () => {
    const isSolid = hasEnteredDeck() && activeIndex > 0;
    const progress = slides.length > 1 ? activeIndex / (slides.length - 1) : 0;

    header?.classList.toggle("is-solid", isSolid);
    if (progressBar) {
      progressBar.style.setProperty("--scroll-progress", progress.toFixed(3));
    }
  };

  const syncModuleVideo = () => {
    const shouldPlay = document.visibilityState !== "hidden" && isModuleOpen();
    if (shouldPlay) {
      safePlay(moduleVideo);
      return;
    }

    pauseMedia(moduleVideo);
  };

  const syncSlideMedia = () => {
    const pageVisible = document.visibilityState !== "hidden";

    slides.forEach((slide, index) => {
      const shouldPlay = pageVisible && hasEnteredDeck() && !isModuleOpen() && index === activeIndex;
      slide.querySelectorAll("video").forEach((video) => {
        if (shouldPlay) {
          safePlay(video);
          return;
        }

        pauseMedia(video);
      });
    });

    syncModuleVideo();
  };

  document.addEventListener("visibilitychange", () => {
    syncSlideMedia();
  });

  menuTrigger?.addEventListener("click", () => {
    navLinks?.classList.toggle("is-open");
  });

  syncChromeMetrics();

  const setActiveNav = (id) => {
    navAnchors.forEach((anchor) => {
      const isActive = anchor.getAttribute("href") === `#${id}`;
      anchor.classList.toggle("is-active", isActive);
      anchor.toggleAttribute("aria-current", isActive);
    });
  };

  const getSlideShell = (slide) =>
    slide?.querySelector(slide.classList.contains("hero") ? ".hero-content" : ".section-shell");

  const scrollMobileToSlide = (slide, behavior = prefersReducedMotion ? "auto" : "smooth") => {
    if (!deck || !slide) return;
    const resolvedBehavior = isMobileLayout() ? "auto" : behavior;

    deck.scrollTo({
      top: Math.max(slide.offsetTop, 0),
      behavior: resolvedBehavior
    });
  };

  const syncMobileActiveSection = ({ replaceHistory = false } = {}) => {
    if (!isMobileLayout() || !slides.length) return;

    const chromeOffset = Math.ceil(header?.offsetHeight || 0);
    const marker = chromeOffset + Math.max((window.innerHeight - chromeOffset) * 0.35, 120);
    let nextIndex = activeIndex;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      if (rect.top <= marker && rect.bottom >= marker) {
        nextIndex = index;
      }
    });

    activeIndex = nextIndex;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
      slide.setAttribute("aria-hidden", "false");
    });

    const currentSlide = slides[activeIndex];
    if (!currentSlide) return;

    setActiveNav(currentSlide.dataset.navTarget || currentSlide.id);
    updateDeckUI();
    revealSlide(currentSlide);
    syncSlideMedia();

    if (replaceHistory) {
      const hash = `#${currentSlide.id}`;
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    }
  };

  const renderVenue = (key) => {
    const venue = venueData[key];
    if (!venue) return;

    detailTitle.textContent = venue.title;
    detailType.textContent = venue.type;
    detailOverview.textContent = venue.overview;
    detailCapacity.textContent = venue.capacity;
    detailSquareFeet.textContent = venue.squareFeet;

    detailList.innerHTML = venue.details.map((item) => `<li>${item}</li>`).join("");
    detailMetrics.innerHTML = venue.metrics
      .map(
        (metric) => `
          <div class="metric-card">
            <small>${metric.label}</small>
            <strong>${metric.value}</strong>
          </div>
        `
      )
      .join("");

    venueButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.venue === key);
    });
  };

  venueButtons.forEach((button) => {
    button.addEventListener("click", () => renderVenue(button.dataset.venue));
  });

  renderVenue("parkview");

  const openModule = () => {
    module?.classList.add("is-open");
    document.body.classList.add("module-open");
    module?.setAttribute("aria-hidden", "false");
    syncSlideMedia();
  };

  const closeModule = () => {
    module?.classList.remove("is-open");
    document.body.classList.remove("module-open");
    module?.setAttribute("aria-hidden", "true");
    syncSlideMedia();
  };

  moduleButtons.forEach((button) => button.addEventListener("click", openModule));
  closeModuleButton?.addEventListener("click", closeModule);
  moduleBackdrop?.addEventListener("click", closeModule);

  const sliderStep = () => {
    const card = slider?.querySelector(".dining-card");
    if (!card || !slider) return 320;
    return card.getBoundingClientRect().width + 18;
  };

  prevButton?.addEventListener("click", () => {
    slider?.scrollBy({ left: -sliderStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  nextButton?.addEventListener("click", () => {
    slider?.scrollBy({ left: sliderStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  const animateCounter = (counter) => {
    if (animatedCounters.has(counter)) return;

    const target = Number(counter.dataset.countTo || 0);
    const suffix = counter.dataset.suffix || "";
    const prefix = counter.dataset.prefix || "";
    const duration = Number(counter.dataset.duration || 1.6);
    const decimals = Number.isInteger(target) ? 0 : 1;
    const formatValue = (value) => `${prefix}${value.toFixed(decimals).replace(/\.0$/, "")}${suffix}`;

    animatedCounters.add(counter);

    if (prefersReducedMotion || !window.gsap || Number.isNaN(target)) {
      counter.textContent = formatValue(target);
      return;
    }

    const state = { value: 0 };
    gsap.to(state, {
      value: target,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        counter.textContent = formatValue(state.value);
      }
    });
  };

  const revealSlide = (slide) => {
    if (!slide) return;

    slide.querySelectorAll(".reveal-item").forEach((item, index) => {
      if (item.classList.contains("is-visible")) return;

      if (prefersReducedMotion) {
        item.classList.add("is-visible");
        return;
      }

      window.setTimeout(() => {
        item.classList.add("is-visible");
      }, Math.min(index * 45, 260));
    });
    slide.querySelectorAll("[data-count-to]").forEach(animateCounter);
  };

  const moveTrack = (behavior = prefersReducedMotion ? "auto" : "smooth") => {
    if (!deckTrack || !deck) return;
    if (isMobileLayout()) {
      deckTrack.style.removeProperty("transform");
      deckTrack.classList.remove("is-instant");
      return;
    }

    const offset = -(activeIndex * deck.clientWidth);
    const shouldJump = behavior === "auto" || prefersReducedMotion;

    deckTrack.classList.toggle("is-instant", shouldJump);
    deckTrack.style.transform = `translate3d(${offset}px, 0, 0)`;

    if (shouldJump) {
      window.requestAnimationFrame(() => {
        deckTrack.classList.remove("is-instant");
      });
    }
  };

  const fitSlides = () => {
    slides.forEach((slide) => {
      slide.classList.remove("is-compact", "is-tight", "is-packed");
      slide.classList.remove("is-scaled");
      slide.style.removeProperty("--slide-fit-scale");
    });

    if (isMobileLayout()) {
      slides.forEach((slide) => {
        const shell = getSlideShell(slide);
        if (!shell) return;

        ["is-compact", "is-tight", "is-packed"].forEach((fitClass) => {
          if (shell.scrollHeight <= shell.clientHeight + 8) return;
          slide.classList.add(fitClass);
        });

        const overflow = shell.scrollHeight - shell.clientHeight;
        if (overflow <= 8) return;

        const availableHeight = Math.max(shell.clientHeight - 10, 1);
        const scale = Math.max(0.82, Math.min(1, availableHeight / shell.scrollHeight));
        if (scale < 0.995) {
          slide.style.setProperty("--slide-fit-scale", scale.toFixed(3));
          slide.classList.add("is-scaled");
        }
      });

      moveTrack("auto");
      return;
    }

    slides.forEach((slide) => {
      ["is-compact", "is-tight", "is-packed"].forEach((fitClass) => {
        if (slide.scrollHeight <= slide.clientHeight + 8) return;
        slide.classList.add(fitClass);
      });

      const overflow = slide.scrollHeight - slide.clientHeight;
      if (overflow > 8) {
        const isShortViewport = window.innerHeight <= 820;
        const isVeryShortViewport = window.innerHeight <= 760;
        const isPrioritySlide = ["why", "retail", "luxury", "dining"].includes(slide.id);
        let scale = Math.min(1, (slide.clientHeight - 12) / slide.scrollHeight);

        if (window.innerWidth <= 767) {
          if (slide.id === "retail") scale -= 0.09;
          if (slide.id === "events") scale -= 0.08;
        }

        if (isShortViewport && isPrioritySlide) {
          scale -= 0.04;
        }

        if (isVeryShortViewport && isPrioritySlide) {
          scale -= 0.03;
        }

        const minimumScale = isVeryShortViewport ? 0.7 : isShortViewport ? 0.74 : 0.8;
        scale = Math.max(minimumScale, scale);
        if (scale < 0.999) {
          slide.style.setProperty("--slide-fit-scale", scale.toFixed(3));
          slide.classList.add("is-scaled");
        }
      }
    });

    moveTrack("auto");
  };

  const scheduleFit = () => {
    window.cancelAnimationFrame(fitFrame);
    fitFrame = window.requestAnimationFrame(() => {
      fitFrame = 0;
      fitSlides();
      if (isMobileLayout()) {
        syncMobileActiveSection();
      }
    });
  };

  const setSlideState = (
    nextIndex,
    { replaceHistory = true, behavior = prefersReducedMotion ? "auto" : "smooth" } = {}
  ) => {
    const clampedIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));
    const targetSlide = slides[clampedIndex];
    if (!targetSlide) return;

    activeIndex = clampedIndex;
    if (isMobileLayout()) {
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === clampedIndex);
        slide.setAttribute("aria-hidden", "false");
      });

      const navTarget = targetSlide.dataset.navTarget || targetSlide.id;
      setActiveNav(navTarget);
      updateDeckUI();
      revealSlide(targetSlide);
      syncSlideMedia();

      if (replaceHistory) {
        const hash = `#${targetSlide.id}`;
        if (window.location.hash !== hash) {
          window.history.replaceState(null, "", hash);
        }
      }
      return;
    }

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === clampedIndex);
      slide.toggleAttribute("aria-hidden", index !== clampedIndex);
    });

    const navTarget = targetSlide.dataset.navTarget || targetSlide.id;
    setActiveNav(navTarget);
    updateDeckUI();
    revealSlide(targetSlide);
    syncSlideMedia();
    moveTrack(behavior);

    if (replaceHistory) {
      const hash = `#${targetSlide.id}`;
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    }
  };

  const goToSlide = (
    nextIndex,
    {
      behavior = prefersReducedMotion ? "auto" : "smooth",
      replaceHistory = true,
      lock = true,
      allowWhileGated = false,
      force = false
    } = {}
  ) => {
    if (!slides.length || !deckTrack || isModuleOpen() || (!hasEnteredDeck() && !allowWhileGated)) return;

    const clampedIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));
    if (isMobileLayout()) {
      setSlideState(clampedIndex, { replaceHistory, behavior });
      scrollMobileToSlide(slides[clampedIndex], behavior);
      return;
    }

    if (clampedIndex === activeIndex && !force) {
      moveTrack(behavior);
      updateDeckUI();
      return;
    }

    window.clearTimeout(unlockTimer);
    if (lock && !prefersReducedMotion) {
      isScrollLocked = true;
      unlockTimer = window.setTimeout(() => {
        isScrollLocked = false;
      }, 620);
    } else {
      isScrollLocked = false;
    }

    setSlideState(clampedIndex, { replaceHistory, behavior });
  };

  const goToHash = (hash, options) => {
    if (!hash || hash === "#" || hash === "#0") return false;

    const nextIndex = slides.findIndex((slide) => `#${slide.id}` === hash);
    if (nextIndex === -1) return false;

    goToSlide(nextIndex, options);
    return true;
  };

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      navLinks?.classList.remove("is-open");

      const hash = anchor.getAttribute("href");
      if (!goToHash(hash)) return;

      event.preventDefault();
    });
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (isMobileLayout() || !hasEnteredDeck() || isModuleOpen()) return;

      const primaryDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(primaryDelta) < 24) return;

      event.preventDefault();
      if (isScrollLocked) return;

      goToSlide(activeIndex + Math.sign(primaryDelta));
    },
    { passive: false }
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (isMobileLayout() || !hasEnteredDeck() || isModuleOpen() || isScrollLocked) return;

      const touch = event.changedTouches[0];
      const deltaX = touchStartX - touch.clientX;
      const deltaY = touchStartY - touch.clientY;
      const primaryDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

      if (Math.abs(primaryDelta) < 56) return;

      goToSlide(activeIndex + Math.sign(primaryDelta));
    },
    { passive: true }
  );

  window.addEventListener("hashchange", () => {
    const nextIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
    if (nextIndex === -1 || nextIndex === activeIndex) return;

    if (isMobileLayout()) {
      setSlideState(nextIndex, { replaceHistory: false, behavior: "auto" });
      scrollMobileToSlide(slides[nextIndex], "auto");
      return;
    }

    if (!hasEnteredDeck()) {
      setSlideState(nextIndex, { replaceHistory: false, behavior: "auto" });
      return;
    }

    goToSlide(nextIndex, { replaceHistory: false, lock: false });
  });

  window.addEventListener("resize", () => {
    syncChromeMetrics();
    scheduleFit();
    moveTrack("auto");
    updateDeckUI();
    syncMobileActiveSection();
  });

  window.addEventListener(
    "scroll",
    () => {
      syncMobileActiveSection();
    },
    { passive: true }
  );

  deck?.addEventListener(
    "scroll",
    () => {
      syncMobileActiveSection();
    },
    { passive: true }
  );

  slides.forEach((slide) => {
    slide.querySelectorAll("img").forEach((image) => {
      image.addEventListener("load", scheduleFit, { passive: true });
    });

    slide.querySelectorAll("video").forEach((video) => {
      video.addEventListener("loadedmetadata", scheduleFit, { passive: true });
      video.addEventListener("loadeddata", scheduleFit, { passive: true });
    });
  });

  mobileLayoutQuery.addEventListener?.("change", () => {
    syncChromeMetrics();
    scheduleFit();
    moveTrack("auto");
    syncMobileActiveSection({ replaceHistory: false });
  });

  revealTargets.forEach((item) => item.classList.add("reveal-item"));

  if (prefersReducedMotion) {
    revealTargets.forEach((item) => item.classList.add("is-visible"));
  }

  const startMotion = () => {
    if (prefersReducedMotion || !window.gsap) {
      return;
    }
/*
    gsap.to(".hero-video", {
      scale: 1,
      duration: 1.8,
      ease: "power2.out"
    });
*/
    loopAnimations.push(
      gsap.to(".hero-glow", {
        scale: 1.04,
        xPercent: 1.4,
        yPercent: -1.6,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      })
    );

    gsap.from(".hero-copy .eyebrow, .hero-copy h1, .hero-statement, .hero-business-line, .hero-actions .btn-pill, .hero-stats .stat-chip", {
      y: 28,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.08
    });

    gsap.from(".hero-float", {
      y: 32,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.2
    });

    const logoTrack = document.querySelector(".logo-track");
    if (logoTrack) {
      loopAnimations.push(
        gsap.to(logoTrack, {
          xPercent: -40,
          ease: "none",
          repeat: -1,
          duration: 24
        })
      );
    }
  };

  const queueMotion = () => {
    if (hasQueuedMotion) return;
    hasQueuedMotion = true;

    const runMotion = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(startMotion, { timeout: 450 });
        return;
      }

      window.setTimeout(startMotion, 180);
    };

    if (document.readyState === "complete") {
      runMotion();
      return;
    }

    window.addEventListener("load", runMotion, { once: true });
  };

  window.addEventListener("orientationchange", () => {
    syncChromeMetrics();
    scheduleFit();
  });

  document.fonts?.ready?.then(() => {
    syncChromeMetrics();
    scheduleFit();
  });

  document.querySelectorAll("img").forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", scheduleFit, { once: true });
    image.addEventListener("error", scheduleFit, { once: true });
  });

  document.addEventListener("keydown", (event) => {
    if (!hasEnteredDeck() && event.key !== "Escape") return;

    if (event.key === "Escape") {
      closeModule();
      return;
    }

    if (isModuleOpen()) return;

    const target = event.target;
    const tagName = target?.tagName;
    const isTypingTarget =
      target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tagName);
    if (isTypingTarget) return;

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown" ||
      event.key === "PageDown" ||
      event.key === " "
    ) {
      event.preventDefault();
      goToSlide(activeIndex + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      goToSlide(activeIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      goToSlide(slides.length - 1);
    }
  });

  setSlideState(activeIndex, { replaceHistory: false, behavior: "auto" });
  scheduleFit();
  syncMobileActiveSection();
  if (hasEnteredDeck()) {
    queueMotion();
  } else {
    updateDeckUI();
    syncSlideMedia();
  }

  enterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (hasEnteredDeck()) return;

      document.body.classList.remove("is-gated");
      document.body.classList.add("is-entered");
      introGate?.classList.add("is-dismissed");
      syncChromeMetrics();
      setSlideState(activeIndex, {
        replaceHistory: false,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
      scheduleFit();
      queueMotion();
    });
  });
});

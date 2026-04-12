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

  const menuTrigger = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector(".nav-links");
  const header = document.querySelector(".deck-header");
  const progressBar = document.querySelector(".scroll-progress");
  const navAnchors = document.querySelectorAll(".nav-links a, .section-rail a");
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
}
  const entertainmentVideo = document.querySelector(".entertainment-card__media video");
  const eventVideo = document.querySelector(".event-stage video");
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
  const railDots = document.querySelectorAll(".section-rail a");
  const counters = document.querySelectorAll("[data-count-to]");
  const inlineVideos = [heroVideo].filter(Boolean);
  const sectionVideos = [entertainmentVideo, eventVideo].filter(Boolean);
  const revealTargets = document.querySelectorAll(
  ".section-heading, .kpi-card, .section-surface, .retail-panel__card, .luxury-layout, .dining-card, .entertainment-card, .event-panel, .opportunity-card"
  );
  const loopAnimations = [];

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

  const syncInlineVideos = () => {
    const pageVisible = document.visibilityState !== "hidden";
    inlineVideos.forEach((video) => {
      const inView = video.dataset.inView === "true";
      if (pageVisible && inView) {
        safePlay(video);
        return;
      }

      pauseMedia(video);
    });
  };

  const syncModuleVideo = () => {
    const shouldPlay = document.visibilityState !== "hidden" && module?.classList.contains("is-open");
    if (shouldPlay) {
      safePlay(moduleVideo);
      return;
    }

    pauseMedia(moduleVideo);
  };

  safePlay(heroVideo);
  sectionVideos.forEach((video) => pauseMedia(video));

  if (inlineVideos.length) {
    const mediaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.inView = entry.isIntersecting ? "true" : "false";
        });

        syncInlineVideos();
      },
      {
        rootMargin: "180px 0px",
        threshold: 0.2
      }
    );

    inlineVideos.forEach((video) => mediaObserver.observe(video));
  }

  document.addEventListener("visibilitychange", () => {
    syncInlineVideos();
    syncModuleVideo();
  });

  menuTrigger?.addEventListener("click", () => {
    navLinks?.classList.toggle("is-open");
  });

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navLinks?.classList.remove("is-open");
    });
  });

  const setActiveNav = (id) => {
    navAnchors.forEach((anchor) => {
      anchor.classList.toggle("is-active", anchor.getAttribute("href") === `#${id}`);
    });

    railDots.forEach((anchor) => {
      anchor.classList.toggle("is-active", anchor.getAttribute("href") === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

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
    syncModuleVideo();
  };

  const closeModule = () => {
    module?.classList.remove("is-open");
    document.body.classList.remove("module-open");
    module?.setAttribute("aria-hidden", "true");
    syncModuleVideo();
  };

  moduleButtons.forEach((button) => button.addEventListener("click", openModule));
  closeModuleButton?.addEventListener("click", closeModule);
  moduleBackdrop?.addEventListener("click", closeModule);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModule();
  });

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
    const target = Number(counter.dataset.countTo || 0);
    const suffix = counter.dataset.suffix || "";
    const prefix = counter.dataset.prefix || "";
    const duration = Number(counter.dataset.duration || 1.6);

    if (prefersReducedMotion || !window.gsap || Number.isNaN(target)) {
      counter.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const state = { value: 0 };
    gsap.to(state, {
      value: target,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        counter.textContent = `${prefix}${Math.round(state.value)}${suffix}`;
      }
    });
  };

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  let tickingScroll = false;
  let lastProgress = -1;
  let lastHeaderSolid = false;

  const updateScrollUI = () => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
    const isSolid = scrollY > 24;

    if (isSolid !== lastHeaderSolid) {
      header?.classList.toggle("is-solid", isSolid);
      lastHeaderSolid = isSolid;
    }

    if (progressBar && Math.abs(progress - lastProgress) > 0.005) {
      progressBar.style.setProperty("--scroll-progress", progress.toFixed(2));
      lastProgress = progress;
    }
  };

  const handleScroll = () => {
    if (tickingScroll) return;

    tickingScroll = true;
    window.requestAnimationFrame(() => {
      updateScrollUI();
      tickingScroll = false;
    });
  };

  const headerOffset = () => (header?.offsetHeight || 0) + 16;

  const scrollToTarget = (hash) => {
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#" || hash === "#0") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      scrollToTarget(hash);
    });
  });

  updateScrollUI();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);

  revealTargets.forEach((item) => item.classList.add("reveal-item"));

  if (prefersReducedMotion) {
    revealTargets.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12
    }
  );

  revealTargets.forEach((item) => revealObserver.observe(item));

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

  queueMotion();
});

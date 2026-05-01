class InteractiveDeck {
  constructor() {
    this.currentSlideId = 'hero';
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.slideIds = this.slides.map(s => s.id);
    this.navItems = document.querySelectorAll('.nav-item');
    this.isAnimating = false;
    this.scrollTimeout = null;

    // Register GSAP plugins if needed (none strictly required for basic timelines, but good practice)
    gsap.registerPlugin();

    this.init();
  }

  init() {
    // Initial setup - hide all except active
    gsap.set('.slide', { autoAlpha: 0, zIndex: 1 });
    gsap.set('#hero', { autoAlpha: 1, zIndex: 10 });

    this.updateNav(this.currentSlideId);
    this.animateSlideIn(document.getElementById('hero'));

    // Initialize Particles for Brand Domination
    this.initParticles();

    // Setup Brand Projection Module
    this.setupDominationModule();

    // Setup Scroll & Touch Listeners
    this.setupScroll();
    this.setupTouch();
  }

  setupScroll() {
    let lastScrollTime = 0;

    window.addEventListener('wheel', (e) => {
      const now = new Date().getTime();

      // Enforce a 1.2 second cooldown between scroll triggers 
      // AND prevent if already animating.
      if (now - lastScrollTime < 1200 || this.isAnimating) {
        return;
      }

      // Require a minimum scroll threshold to prevent accidental tiny scrolls
      if (Math.abs(e.deltaY) > 5) {
        if (e.deltaY > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
        lastScrollTime = now;
      }
    }, { passive: false });
  }

  setupTouch() {
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', e => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', e => {
      if (this.isAnimating) return;
      touchEndY = e.changedTouches[0].screenY;
      
      const diff = touchStartY - touchEndY;
      // 50px swipe threshold
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide(); // Swiped up -> go down a slide
        } else {
          this.prevSlide(); // Swiped down -> go up a slide
        }
      }
    }, { passive: true });
  }

  nextSlide() {
    const currentIndex = this.slideIds.indexOf(this.currentSlideId);
    if (currentIndex < this.slideIds.length - 1) {
      this.goToSlide(this.slideIds[currentIndex + 1]);
    }
  }

  prevSlide() {
    const currentIndex = this.slideIds.indexOf(this.currentSlideId);
    if (currentIndex > 0) {
      this.goToSlide(this.slideIds[currentIndex - 1]);
    }
  }

  goToSlide(targetSlideId) {
    if (this.currentSlideId === targetSlideId || this.isAnimating) return;
    this.isAnimating = true;

    const currentSlide = document.getElementById(this.currentSlideId);
    const targetSlide = document.getElementById(targetSlideId);

    // Update State immediately for UI feedback
    this.currentSlideId = targetSlideId;
    this.updateNav(targetSlideId);

    // Crossfade / Transition Logic
    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        // Clean up current slide animations if needed
        gsap.set(currentSlide.querySelectorAll('.gsap-anim-up, .gsap-anim-fade, .gsap-anim-slide-left, .gsap-anim-slide-right'), { clearProps: "all" });
      }
    });

    const currentBg = currentSlide.querySelector('.slide-bg');
    if (currentBg && !currentBg.classList.contains('brand-domination-bg')) {
      // Subtle scale up on the exiting background
      tl.to(currentBg, { scale: 1.05, duration: 0.8, ease: 'power2.inOut' }, 0);
    }

    // 1. Fade out current slide
    tl.to(currentSlide, {
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      zIndex: 1
    }, 0);

    // 2. Prepare target slide
    gsap.set(targetSlide, { zIndex: 10 });
    const targetBg = targetSlide.querySelector('.slide-bg');
    if (targetBg && !targetBg.classList.contains('brand-domination-bg')) {
      gsap.set(targetBg, { scale: 1.1 }); // Start slightly zoomed in for the incoming slide
    }

    // 3. Fade in target slide
    tl.to(targetSlide, {
      autoAlpha: 1,
      duration: 0.8,
      ease: 'power2.inOut',
      onStart: () => {
        this.animateSlideIn(targetSlide);
      }
    }, "-=0.4"); // Overlap slightly

    // Subtly scale down the incoming background to normal size
    if (targetBg && !targetBg.classList.contains('brand-domination-bg')) {
      tl.to(targetBg, { scale: 1, duration: 1.2, ease: 'power2.out' }, "-=0.8");
    }
  }

  animateSlideIn(slide) {
    // Select animatable elements within the slide
    const upElems = slide.querySelectorAll('.gsap-anim-up');
    const fadeElems = slide.querySelectorAll('.gsap-anim-fade');
    const leftElems = slide.querySelectorAll('.gsap-anim-slide-left');
    const rightElems = slide.querySelectorAll('.gsap-anim-slide-right');

    const tl = gsap.timeline();

    if (upElems.length) tl.fromTo(upElems, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }, 0.2);
    if (fadeElems.length) tl.fromTo(fadeElems, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, ease: 'power2.out' }, 0.3);
    if (leftElems.length) tl.fromTo(leftElems, { x: 80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0.4);
    if (rightElems.length) tl.fromTo(rightElems, { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0.4);
  }

  updateNav(slideId) {
    this.navItems.forEach(item => {
      if (item.dataset.target === slideId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  initParticles() {
    if (window.particlesJS) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: '#d4af37' },
          shape: { type: 'circle' },
          opacity: { value: 0.3, random: true },
          size: { value: 2, random: true },
          line_linked: { enable: true, distance: 150, color: '#00d2ff', opacity: 0.2, width: 1 },
          move: { enable: true, speed: 1.5, direction: 'top', random: true, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
          modes: { grab: { distance: 200, line_linked: { opacity: 0.5 } }, push: { particles_nb: 3 } }
        },
        retina_detect: true
      });
    }
  }

  setupDominationModule() {
    const buttons = document.querySelectorAll('.vertical-btn');
    const stageIdle = document.getElementById('stage-idle');
    const stageLoading = document.getElementById('stage-loading');
    const stageActive = document.getElementById('stage-active');

    const dataMap = {
      'fashion': {
        title: 'Premium Fashion',
        desc: 'Our ecosystem amplifies premium fashion through high-dwell tourism and adjacent luxury co-tenants.',
        traffic: '12.5M',
        dwell: '+45m',
        fomo: 'The synergy of adjacent luxury and tax-free shopping creates an unparalleled conversion engine. If you aren\'t here, your competitor is capturing this intent.'
      },
      'tech': {
        title: 'Consumer Tech',
        desc: 'High-intent demographic convergence makes this the ultimate stage for product unveilings and flagship stores.',
        traffic: '18.2M',
        dwell: '+30m',
        fomo: 'Early adopters flock to our entertainment zones, perfectly overlapping with tech launch audiences. Dominate the visual field during peak traffic.'
      },
      'dining': {
        title: 'Experiential F&B',
        desc: 'Dining is the connective tissue of the 5.6M sq ft ecosystem, extending visits deep into the evening.',
        traffic: '24.0M',
        dwell: '+90m',
        fomo: 'Guests who dine stay 2x longer. Your concept becomes the anchor of their full-day itinerary. Out-position local standalones.'
      }
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isDominationAnimating) return;
        this.isDominationAnimating = true;

        // UI State Update
        buttons.forEach(b => b.classList.remove('active'));
        const targetBtn = e.currentTarget;
        targetBtn.classList.add('active');

        const vertical = targetBtn.dataset.vertical;
        const data = dataMap[vertical];

        // GSAP Cinematic Timeline
        const tl = gsap.timeline({
          onComplete: () => { this.isDominationAnimating = false; }
        });

        // 1. Darken and hide current stage
        tl.to([stageIdle, stageActive], { autoAlpha: 0, duration: 0.3, display: 'none' });

        // 2. Show loading / calibrating
        tl.set(stageLoading, { display: 'block' });
        tl.fromTo(stageLoading, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.4 });

        // 3. Accelerate particles background (simulating intense data flow)
        if (window.pJSDom && window.pJSDom[0]) {
          tl.to(window.pJSDom[0].pJS.particles.move, { speed: 8, duration: 1.5, ease: 'power2.in' }, "-=0.4");
        }

        // 4. Wait for 'processing'
        tl.to({}, { duration: 1.5 });

        // 5. Hide loading, setup new data
        tl.to(stageLoading, {
          autoAlpha: 0, duration: 0.3, display: 'none', onComplete: () => {
            document.getElementById('res-title').textContent = data.title;
            document.getElementById('res-desc').textContent = data.desc;
            document.getElementById('res-traffic').textContent = data.traffic;
            document.getElementById('res-dwell').textContent = data.dwell;
            document.getElementById('res-fomo').textContent = data.fomo;
          }
        });

        // 6. Explosive Reveal of Active Stage
        tl.set(stageActive, { display: 'block' });

        // Staggered reveal of metrics
        const metrics = stageActive.querySelectorAll('.metric-anim');
        tl.fromTo(stageActive, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
        tl.fromTo('.domination-hero', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.7)' });
        tl.fromTo(metrics, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, "-=0.3");

        // 7. Slow down particles to ambient state
        if (window.pJSDom && window.pJSDom[0]) {
          tl.to(window.pJSDom[0].pJS.particles.move, { speed: 1.5, duration: 2, ease: 'power2.out' }, "-=1");
        }
      });
    });
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  window.deck = new InteractiveDeck();
});

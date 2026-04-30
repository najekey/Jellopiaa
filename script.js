// ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));

    // ===== HAMBURGER =====
    const hamburger = document.getElementById('hamburger');
    const navDrawer = document.getElementById('navDrawer');
    const navOverlay = document.getElementById('navOverlay');
    function toggleDrawer(open) {
      hamburger.classList.toggle('open', open);
      navDrawer.classList.toggle('open', open);
      navOverlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    hamburger.addEventListener('click', () => toggleDrawer(!navDrawer.classList.contains('open')));
    navOverlay.addEventListener('click', () => toggleDrawer(false));
    document.querySelectorAll('.drawer-link').forEach(a => {
      a.addEventListener('click', () => toggleDrawer(false));
    });

    // ===== GALLERY SLIDER =====
    (function() {
      const wrap = document.getElementById('galleryWrap');
      const track = document.getElementById('galleryTrack');
      const dotsContainer = document.getElementById('galleryDots');
      const prevBtn = document.getElementById('galleryPrev');
      const nextBtn = document.getElementById('galleryNext');
      const slides = Array.from(track.querySelectorAll('.gallery-slide'));
      const lightbox = document.getElementById('lightbox');
      const lightboxEmoji = document.getElementById('lightboxEmoji');

      let currentIndex = 0;
      let isDragging = false;
      let startX = 0;
      let dragDelta = 0;
      let slidesPerView = getSlidesPerView();

      function getSlidesPerView() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 900) return 2;
        return 3;
      }

      function totalSteps() {
        return Math.max(0, slides.length - slidesPerView);
      }

      // Build dots
      function buildDots() {
        dotsContainer.innerHTML = '';
        const steps = totalSteps() + 1;
        for (let i = 0; i < steps; i++) {
          const d = document.createElement('button');
          d.className = 'gallery-dot' + (i === currentIndex ? ' active' : '');
          d.setAttribute('aria-label', 'Slide ' + (i + 1));
          d.addEventListener('click', () => goTo(i));
          dotsContainer.appendChild(d);
        }
      }

      function updateDots() {
        dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentIndex);
        });
      }

      function updateArrows() {
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= totalSteps();
      }

      function getSlideWidth() {
        if (!slides[0]) return 0;
        const rect = slides[0].getBoundingClientRect();
        return rect.width + 20; // width + margin-right gap
      }

      function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, totalSteps()));
        const offset = currentIndex * getSlideWidth();
        track.style.transition = 'transform 0.45s cubic-bezier(.4,0,.2,1)';
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
        updateArrows();
      }

      prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
      nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

      // ---- DRAG (mouse) ----
      wrap.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        dragDelta = 0;
        wrap.classList.add('dragging');
        track.style.transition = 'none';
      });
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragDelta = e.clientX - startX;
        const base = currentIndex * getSlideWidth();
        track.style.transform = `translateX(${-base + dragDelta}px)`;
      });
      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        wrap.classList.remove('dragging');
        const threshold = getSlideWidth() * 0.25;
        if (dragDelta < -threshold) goTo(currentIndex + 1);
        else if (dragDelta > threshold) goTo(currentIndex - 1);
        else goTo(currentIndex);
      });

      // ---- TOUCH (mobile) ----
      let touchStartX = 0;
      wrap.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        track.style.transition = 'none';
      }, { passive: true });
      wrap.addEventListener('touchmove', (e) => {
        const delta = e.touches[0].clientX - touchStartX;
        const base = currentIndex * getSlideWidth();
        track.style.transform = `translateX(${-base + delta}px)`;
      }, { passive: true });
      wrap.addEventListener('touchend', (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        const threshold = getSlideWidth() * 0.25;
        if (delta < -threshold) goTo(currentIndex + 1);
        else if (delta > threshold) goTo(currentIndex - 1);
        else goTo(currentIndex);
      });

      // ---- Lightbox on click (distinguish from drag) ----
      slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
          if (Math.abs(dragDelta) > 8) return; // was a drag, not a click
          lightboxEmoji.textContent = slide.dataset.emoji;
          lightbox.classList.add('open');
        });
      });

      // ---- Keyboard ----
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
        if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      });

      // ---- Resize ----
      window.addEventListener('resize', () => {
        slidesPerView = getSlidesPerView();
        buildDots();
        goTo(Math.min(currentIndex, totalSteps()));
      });

      // Init
      buildDots();
      updateArrows();
      goTo(0);
    })();

    // ===== LIGHTBOX CLOSE =====
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

    // ===== SCROLL TO TOP =====
    const scrollBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== INTERSECTION OBSERVER – ANIMATE IN =====
    const animateEls = document.querySelectorAll('.about-card, .menu-content, .about-img-wrap, .menu-img-wrap, .gallery-slide-inner, .contact-text, .contact-phone-mockup');
    const ioAnim = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.animationDelay = (Array.from(animateEls).indexOf(e.target) % 4) * 0.1 + 's';
          e.target.classList.add('animate-in');
          ioAnim.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    animateEls.forEach(el => ioAnim.observe(el));
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Libraries & Core Functions
  initNavbarScroll();
  initMobileNavClose();
  initMenuFilters();
  initReservationForm();
  initGalleryLightbox();
  initAos();
  initGsapAnimations();
  initRooftopParallax();
});

/* ==========================================
   NAVBAR & FLOATING BUTTONS SCROLL EFFECT
   ========================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-peaberrys');
  const floatReserve = document.getElementById('floating-reserve-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      if (floatReserve) floatReserve.style.opacity = '1';
    } else {
      navbar.classList.remove('scrolled');
      if (floatReserve) floatReserve.style.opacity = '0.7'; // slightly faded at top
    }
  });
}

/* ==========================================
   DYNAMIC MENU FILTERING
   ========================================== */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        // Simple GSAP transition if loaded, else standard toggle
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('filtered-out');
          if (window.gsap) {
            gsap.fromTo(item, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
          }
        } else {
          item.classList.add('filtered-out');
        }
      });
    });
  });
}

/* ==========================================
   RESERVATION FORM EXPERIENCE & WHATSAPP
   ========================================== */
function initReservationForm() {
  const form = document.getElementById('peaberrys-booking-form');
  const formContainer = document.getElementById('booking-form-wrapper');
  const successState = document.getElementById('booking-success-wrapper');
  const summaryDetails = document.getElementById('booking-summary-details');
  const waConfirmBtn = document.getElementById('wa-confirm-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation checks
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const guests = document.getElementById('booking-guests').value;
    const occasion = document.getElementById('booking-occasion').value;

    if (!name || !phone || !date || !time || !guests) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    // Save reservation detail in LocalStorage as a mock backend database
    const bookingDetails = {
      name, phone, email, date, time, guests, occasion,
      id: 'PB-' + Math.floor(Math.random() * 900000 + 100000),
      timestamp: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem('peaberrys_bookings') || '[]');
    existingBookings.push(bookingDetails);
    localStorage.setItem('peaberrys_bookings', JSON.stringify(existingBookings));

    // Fill summary card details
    summaryDetails.innerHTML = `
      <div class="row text-start mt-4">
        <div class="col-6 mb-2"><strong>Booking ID:</strong> <span class="text-gold">${bookingDetails.id}</span></div>
        <div class="col-6 mb-2"><strong>Guest Name:</strong> ${name}</div>
        <div class="col-6 mb-2"><strong>Date & Time:</strong> ${date} at ${time}</div>
        <div class="col-6 mb-2"><strong>Guests Count:</strong> ${guests} Pax</div>
        <div class="col-12 mb-2"><strong>Occasion:</strong> ${occasion || 'Casual Dining'}</div>
      </div>
    `;

    // Setup direct WhatsApp Message integration
    const waText = encodeURIComponent(
      `*Peaberrys Reservation Request*\n\n` +
      `• *ID:* ${bookingDetails.id}\n` +
      `• *Name:* ${name}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Email:* ${email || 'N/A'}\n` +
      `• *Date & Time:* ${date} at ${time}\n` +
      `• *Guests:* ${guests} Pax\n` +
      `• *Occasion:* ${occasion || 'Casual Dining'}\n\n` +
      `Please confirm my booking. Thank you!`
    );

    waConfirmBtn.setAttribute('href', `https://wa.me/919748880772?text=${waText}`);

    // Animate transition between form and success state using GSAP if loaded
    if (window.gsap) {
      gsap.to(formContainer, {
        opacity: 0, y: -20, duration: 0.4, onComplete: () => {
          formContainer.style.display = 'none';
          successState.style.display = 'block';
          gsap.fromTo(successState, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      });
    } else {
      formContainer.style.display = 'none';
      successState.style.display = 'block';
    }

    showNotification('Reservation request saved successfully!');
  });
}

/* ==========================================
   PINTEREST GALLERY LIGHTBOX
   ========================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.masonry-img');
      const title = item.querySelector('.masonry-title').innerText;
      const tag = item.querySelector('.masonry-tag').innerText;

      lightboxImg.src = img.src;
      lightboxCaption.innerHTML = `<span class="text-gold d-block fs-6 mb-1">${tag}</span>${title}`;

      lightbox.style.display = 'flex';

      // GSAP animate lightbox entry
      if (window.gsap) {
        gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(lightboxImg, { scale: 0.9, y: 30 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' });
      }
    });
  });

  // Close lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
  });

  function closeLightbox() {
    if (window.gsap) {
      gsap.to(lightbox, {
        opacity: 0, duration: 0.2, onComplete: () => {
          lightbox.style.display = 'none';
        }
      });
    } else {
      lightbox.style.display = 'none';
    }
  }
}

/* ==========================================
   AOS ANIMATIONS INITIALIZATION
   ========================================== */
function initAos() {
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120,
      easing: 'ease-out-cubic'
    });
  }
}

/* ==========================================
   GSAP HERO & SCROLLTRIGGER EFFECTS
   ========================================== */
function initGsapAnimations() {
  if (!window.gsap) return;

  // Register ScrollTrigger if available
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Entry Animation
  const tlHero = gsap.timeline();
  tlHero.from('.navbar-peaberrys', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' })
    .from('.hero-title', { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6')
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
    .from('.hero-content .btn-premium', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }, '-=0.6')
    .from('.hero-scroll-indicator', { opacity: 0, y: -10, duration: 0.6 }, '-=0.2');

  // GSAP Parallax Scroll Animations
  if (window.ScrollTrigger) {
    // Story main image hover parallax lookalike on scroll
    gsap.to('.story-img-main', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.story-img-secondary', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
}

/* ==========================================
   SIMPLE PARALLAX ON ROOFTOP SECTION
   ========================================== */
function initRooftopParallax() {
  const parallaxBg = document.querySelector('.rooftop-parallax-bg');
  if (!parallaxBg) return;

  window.addEventListener('scroll', () => {
    const section = document.querySelector('.rooftop-section');
    const rect = section.getBoundingClientRect();

    // Check if section is visible in viewport
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Calculate relative scrolled percentage
      const scrolled = window.scrollY - (section.offsetTop - window.innerHeight);
      const parallaxVal = scrolled * 0.12;
      parallaxBg.style.transform = `translateY(${parallaxVal}px)`;
    }
  });
}

/* ==========================================
   NOTIFICATION HELPER (TOAST)
   ========================================== */
function showNotification(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-custom ${type === 'error' ? 'bg-danger text-white' : 'bg-dark text-white'}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <i class="fas ${type === 'error' ? 'fa-exclamation-circle text-white' : 'fa-check-circle text-gold'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Style toast dynamically
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    left: '2rem',
    zIndex: '9999',
    padding: '1rem 1.8rem',
    borderRadius: '4px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '0.85rem',
    fontWeight: '500',
    letterSpacing: '0.05em',
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
  });

  document.body.appendChild(toast);

  // Animate slide-in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  // Slide-out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* ==========================================
   MOBILE NAV AUTO-CLOSE ON LINK CLICK
   ========================================== */
function initMobileNavClose() {
  const navLinks = document.querySelectorAll('.nav-link-peaberrys');
  const navbarCollapse = document.getElementById('peaberrysNav');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          new bootstrap.Collapse(navbarCollapse).hide();
        }
      }
    });
  });
}

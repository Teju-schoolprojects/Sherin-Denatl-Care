document.addEventListener('DOMContentLoaded', () => {

  // --- Initializing Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Header Scrolled Effect ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Sidebar Navigation ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  const openSidebar = () => {
    mobileSidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Disable scroll
  };

  const closeSidebar = () => {
    mobileSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    document.body.style.overflow = ''; // Enable scroll
  };

  menuToggle.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  sidebarLinks.forEach(link => link.addEventListener('click', closeSidebar));


  // --- Dynamic Clinic Open/Closed Hours Logic ---
  const updateClinicStatus = () => {
    const liveStatusBadge = document.getElementById('live-status-badge');
    const liveStatusBox = document.getElementById('live-status-box');
    const statusTitleMsg = document.getElementById('status-title-msg');
    const statusDescMsg = document.getElementById('status-desc-msg');
    const timingRows = document.querySelectorAll('.timing-row');

    const now = new Date();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = daysOfWeek[now.getDay()];
    
    // Highlight today in the hours list
    timingRows.forEach(row => {
      if (row.getAttribute('data-day') === currentDay) {
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }
    });

    // Current time in minutes from midnight
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTotalMin = currentHour * 60 + currentMin;

    // Session definitions in minutes from midnight
    // Morning: 9:30 AM to 2:00 PM (570 to 840 mins)
    const morningStart = 9 * 60 + 30;
    const morningEnd = 14 * 60;
    
    // Evening: 5:00 PM to 8:30 PM (1020 to 1230 mins)
    const eveningStart = 17 * 60;
    const eveningEnd = 20 * 60 + 30;

    const dayIndex = now.getDay(); // 0 is Sunday
    const isSunday = dayIndex === 0;

    let isOpen = false;
    let statusText = '';
    let badgeText = '';
    let descText = '';

    if (isSunday) {
      isOpen = false;
      badgeText = 'Closed';
      statusText = 'Clinic is Closed Today (Sunday)';
      descText = 'We are closed on Sundays. Our morning session opens on Monday at 9:30 AM.';
    } else if (currentTotalMin >= morningStart && currentTotalMin < morningEnd) {
      isOpen = true;
      badgeText = 'Open Now';
      statusText = 'We are Open Now';
      descText = `Morning session is active. We are open until 2:00 PM today. Come visit us!`;
    } else if (currentTotalMin >= eveningStart && currentTotalMin < eveningEnd) {
      isOpen = true;
      badgeText = 'Open Now';
      statusText = 'We are Open Now';
      descText = `Evening session is active. We are open until 8:30 PM tonight. Come visit us!`;
    } else {
      isOpen = false;
      badgeText = 'Closed';
      statusText = 'Clinic is Closed';
      
      if (currentTotalMin < morningStart) {
        descText = `We open today at 9:30 AM. Feel free to request an appointment slot online!`;
      } else if (currentTotalMin >= morningEnd && currentTotalMin < eveningStart) {
        descText = `We are currently in afternoon recess. Evening session starts at 5:00 PM today.`;
      } else {
        descText = `We are closed for the day. Our morning session opens tomorrow at 9:30 AM.`;
      }
    }

    // Update Hero badge
    if (liveStatusBadge) {
      if (isOpen) {
        liveStatusBadge.style.display = 'inline-flex';
        liveStatusBadge.className = `badge badge-live-status open`;
        liveStatusBadge.innerHTML = `<span class="dot"></span> ${badgeText}`;
      } else {
        liveStatusBadge.style.display = 'none';
      }
    }

    // Update hours widget
    if (liveStatusBox) {
      liveStatusBox.className = `live-status-message-box ${isOpen ? 'open' : 'closed'}`;
      statusTitleMsg.textContent = statusText;
      statusDescMsg.textContent = descText;
    }
  };

  // Run immediately and update every minute
  updateClinicStatus();
  setInterval(updateClinicStatus, 60000);


  // --- Services Filter Tabs ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active class on tab buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match transition duration
        }
      });
    });
  });


  // --- Reviews Carousel ---
  const slides = document.querySelectorAll('.review-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlide = 0;
  let carouselInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));

    // Handle overflow/underflow
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startAutoSlide = () => {
    carouselInterval = setInterval(nextSlide, 6000);
  };

  const stopAutoSlide = () => {
    clearInterval(carouselInterval);
  };

  // Event Listeners for controls
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(currentSlide - 1);
      startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });

    indicators.forEach((indicator, idx) => {
      indicator.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(idx);
        startAutoSlide();
      });
    });

    startAutoSlide();
  }


  // --- Booking Form Validation & Submission ---
  const bookingForm = document.getElementById('appointment-form');
  const successBox = document.getElementById('booking-success-box');
  const resetBtn = document.getElementById('reset-booking-btn');
  const dateInput = document.getElementById('booking-date');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Pre-fill service from Service Card click
  const selectServiceTriggers = document.querySelectorAll('.select-service-trigger');
  const serviceDropdown = document.getElementById('booking-service');

  selectServiceTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const selectedService = trigger.getAttribute('data-service');
      if (serviceDropdown && selectedService) {
        serviceDropdown.value = selectedService;
      }
    });
  });

  // Validate individual input
  const validateField = (element, errorElement, condition) => {
    if (condition) {
      element.classList.remove('error-state');
      errorElement.style.display = 'none';
      return true;
    } else {
      element.classList.add('error-state');
      errorElement.style.display = 'block';
      return false;
    }
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('booking-name');
      const phoneEl = document.getElementById('booking-phone');
      const serviceEl = document.getElementById('booking-service');
      const dateEl = document.getElementById('booking-date');
      const sessionEl = document.getElementById('booking-session');

      const errName = document.getElementById('error-name');
      const errPhone = document.getElementById('error-phone');
      const errService = document.getElementById('error-service');
      const errDate = document.getElementById('error-date');
      const errSession = document.getElementById('error-session');

      // Validations
      const isNameValid = validateField(nameEl, errName, nameEl.value.trim().length > 1);
      
      const phoneRegex = /^[6-9][0-9]{9}$/;
      const isPhoneValid = validateField(phoneEl, errPhone, phoneRegex.test(phoneEl.value.trim()));
      
      const isServiceValid = validateField(serviceEl, errService, serviceEl.value !== "");
      
      const isDateValid = validateField(dateEl, errDate, dateEl.value !== "");
      
      const isSessionValid = validateField(sessionEl, errSession, sessionEl.value !== "");

      const isFormValid = isNameValid && isPhoneValid && isServiceValid && isDateValid && isSessionValid;

      if (isFormValid) {
        // Display Summary Info
        document.getElementById('summary-name').textContent = nameEl.value.trim();
        document.getElementById('summary-service').textContent = serviceEl.value;
        document.getElementById('summary-date').textContent = new Date(dateEl.value).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        document.getElementById('summary-session').textContent = sessionEl.value;
        
        const phoneVal = phoneEl.value.trim();
        document.getElementById('summary-phone').textContent = `+91 ${phoneVal.substring(0, 5)} ${phoneVal.substring(5)}`;
        document.getElementById('summary-phone-inline').textContent = `+91 ${phoneVal.substring(0, 5)} ${phoneVal.substring(5)}`;

        // Open Success Card
        successBox.classList.add('active');
        bookingForm.reset();
      }
    });

    // Reset Success Box back to empty form
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        successBox.classList.remove('active');
      });
    }
  }

});

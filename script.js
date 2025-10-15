// Simple hero background carousel: changes only the image, keeps text static
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!hero || !dotsContainer) return; // run only on pages with hero dots

  const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
  const images = [
    "images/2151872279 1.png",
    "images/2151872279 1 (1).png",
    "images/2151872279 1.png",

  ];

  let current = 0;

  function applySlide(index) {
    current = index % images.length;
    // Update active dot
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    // Update hero background (keep gradient overlay + positioning)
    hero.style.background = `linear-gradient(rgba(51, 51, 51, 0.71), rgba(51, 51, 51, 0.71)), url('${images[current]}') center/cover`;
    hero.style.backgroundRepeat = 'no-repeat';
  }

  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      applySlide(i);
      resetTimer();
    });
  });

  // Auto-rotate every 5 seconds
  let timerId;
  function startTimer() {
    timerId = setInterval(() => applySlide(current + 1), 5000);
  }
  function resetTimer() {
    if (timerId) clearInterval(timerId);
    startTimer();
  }

  // Pause on hover for user control
  hero.addEventListener('mouseenter', () => { if (timerId) clearInterval(timerId); });
  hero.addEventListener('mouseleave', startTimer);

  // Initialize
  applySlide(0);
  startTimer();


  

  // === Upcoming Trainings Countdown ===
  const upcomingSection = document.querySelector('.upcoming-training');
  if (upcomingSection) {
    const boxes = Array.from(upcomingSection.querySelectorAll('.countdown-row .countdown-box'));
    // Map boxes by their label text to avoid depending on order
    const mapByLabel = {};
    boxes.forEach(box => {
      const label = (box.querySelector('p')?.textContent || '').trim().toLowerCase();
      mapByLabel[label] = box.querySelector('h2');
    });

    // Resolve event date/time:
    // 1) Prefer explicit data attribute, e.g. <section class="upcoming-training" data-event-date="2026-10-05T00:00:00">
    // 2) Otherwise parse from the schedule text (e.g., "5th October, 00:00 | Virtual Classes")
    const dataAttr = upcomingSection.dataset?.eventDate;
    let eventDate;
    if (dataAttr) {
      eventDate = new Date(dataAttr);
    } else {
      const scheduleText = upcomingSection.querySelector('.text-white.mb-0')?.textContent || '';
      // Extract "5th October, 00:00" pattern
      const match = scheduleText.match(/(\d{1,2})(st|nd|rd|th)?\s+([A-Za-z]+),\s*(\d{1,2}):(\d{2})/);
      const now = new Date();
      const year = now.getFullYear();
      if (match) {
        const day = parseInt(match[1], 10);
        const monthName = match[3].toLowerCase();
        const hour = parseInt(match[4], 10);
        const minute = parseInt(match[5], 10);
        const months = {
          january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
          july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
        };
        const mIndex = months[monthName];
        eventDate = new Date(year, mIndex, day, hour, minute);
        // If date already passed this year, roll to next year
        if (eventDate < now) {
          eventDate = new Date(year + 1, mIndex, day, hour, minute);
        }
      } else {
        // Fallback: 5 days from now
        eventDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      }
    }

    function updateCountdown() {
      const now = new Date();
      let diff = eventDate - now;
      if (diff <= 0) diff = 0; // Clamp to zero when reached

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const days = Math.floor(diff / day);
      const hours = Math.floor((diff % day) / hour);
      const minutes = Math.floor((diff % hour) / minute);
      const seconds = Math.floor((diff % minute) / second);

      if (mapByLabel['days']) mapByLabel['days'].textContent = String(days);
      if (mapByLabel['hours']) mapByLabel['hours'].textContent = String(hours).padStart(2, '0');
      if (mapByLabel['minutes']) mapByLabel['minutes'].textContent = String(minutes).padStart(2, '0');
      if (mapByLabel['seconds']) mapByLabel['seconds'].textContent = String(seconds).padStart(2, '0');
    }

    // Initial paint and 1-second updates
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});
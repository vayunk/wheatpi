/* ─────────────────────────────────────────────────────────
   KCL Robotics Lab Display – app.js
   ───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  const data = window.DASHBOARD_DATA;

  // ── DOM refs ──
  const $time      = document.getElementById("time");
  const $date      = document.getElementById("date");
  const $greeting  = document.getElementById("greeting");
  
  const $slideshow    = document.getElementById("slideshow-container");
  const $slideProg    = document.getElementById("slides-progress");
  const $slideCap     = document.getElementById("slideshow-caption");

  const $equipList    = document.getElementById("equipment-list");
  const $eventList    = document.getElementById("event-list");
  const $nextText     = document.getElementById("next-up-text");
  const $nextCount    = document.getElementById("next-up-countdown");
  const $noticeList   = document.getElementById("notice-list");
  const $tickerSeg    = document.getElementById("ticker-segment");
  const $tickerTrack  = document.getElementById("ticker-track");

  // ── 1. Hydration ──
  function hydrate() {
    // Equipment
    data.equipment.forEach(eq => {
      const el = document.createElement("div");
      el.className = "equip-item";
      el.dataset.state = eq.state;
      el.innerHTML = `<span class="equip-dot"></span><span>${eq.name}</span>`;
      $equipList.appendChild(el);
    });

    // Schedule
    data.schedule.forEach(ev => {
      const el = document.createElement("div");
      el.className = "event";
      el.dataset.hour = ev.hour;
      el.dataset.minute = ev.minute;
      
      const hh = String(ev.hour).padStart(2, "0");
      const mm = String(ev.minute).padStart(2, "0");
      
      el.innerHTML = `
        <span class="event-time">${hh}:${mm}</span>
        <span class="event-label">${ev.label}</span>
      `;
      $eventList.appendChild(el);
    });

    // Notices
    data.notices.forEach(n => {
      const el = document.createElement("div");
      el.className = "notice-item";
      el.dataset.priority = n.priority;
      
      const icon = n.priority === 'urgent' ? '⚠️' : '📢';
      
      el.innerHTML = `
        <div class="notice-icon">${icon}</div>
        <div class="notice-content">
          <h3>${n.title}</h3>
          <p>${n.text}</p>
        </div>
      `;
      $noticeList.appendChild(el);
    });

    // Ticker
    let tickerHTML = '';
    data.tickerMessages.forEach(msg => {
      tickerHTML += `<span class="ticker-item">${msg}</span><span class="ticker-sep">•</span>`;
    });
    $tickerSeg.innerHTML = tickerHTML;
    
    // Duplicate ticker for seamless loop
    const clone = $tickerSeg.cloneNode(true);
    $tickerTrack.appendChild(clone);

    // Slideshow
    data.slideshow.forEach((slide, i) => {
      const el = document.createElement("div");
      el.className = "slide";
      if (slide.mediaType === 'image') {
        el.innerHTML = `<img src="${slide.src}" alt="${slide.caption}">`;
      } else if (slide.mediaType === 'video') {
        el.innerHTML = `<video src="${slide.src}" autoplay loop muted></video>`;
      }
      $slideshow.appendChild(el);
    });
  }

  // ── Config ──
  let currentSlide = 0;
  let slideTimer = null;
  let slideStartTime = 0;
  let currentSlideDuration = 5;

  // ── Slideshow ──
  function showNextSlide() {
    const slides = $slideshow.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides.forEach(s => s.classList.remove('active'));
    
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    
    const slideData = data.slideshow[currentSlide];
    
    if (slideData.caption) {
      $slideCap.textContent = slideData.caption;
      $slideCap.classList.add('active');
    } else {
      $slideCap.classList.remove('active');
    }

    currentSlideDuration = slideData.duration || 10;
    slideStartTime = Date.now();
    
    // reset progress bar
    $slideProg.style.transition = 'none';
    $slideProg.style.width = '0%';
    
    // trigger reflow
    void $slideProg.offsetWidth;
    
    $slideProg.style.transition = `width ${currentSlideDuration}s linear`;
    $slideProg.style.width = '100%';

    clearTimeout(slideTimer);
    slideTimer = setTimeout(showNextSlide, currentSlideDuration * 1000);
  }

  // ── Clock + Data ──
  function getGreeting(h) {
    if (h < 6) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();

    $time.textContent = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");

    $date.textContent = now.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

    $greeting.textContent = getGreeting(h);
  }

  // ── Schedule Logic ──
  function updateSchedule() {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const events = $eventList.querySelectorAll(".event");
    let nextEvent = null;

    events.forEach((ev, i) => {
      const h = parseInt(ev.dataset.hour, 10);
      const m = parseInt(ev.dataset.minute, 10);
      const evMin = h * 60 + m;
      
      const nextEv = events[i + 1];
      const nextEvMin = nextEv 
        ? parseInt(nextEv.dataset.hour, 10) * 60 + parseInt(nextEv.dataset.minute, 10)
        : Infinity;

      ev.classList.remove("is-past", "is-now");

      if (nowMin >= nextEvMin) {
        ev.classList.add("is-past");
      } else if (nowMin >= evMin && nowMin < nextEvMin) {
        ev.classList.add("is-now");
      }

      if (evMin > nowMin && !nextEvent) {
        nextEvent = { label: ev.querySelector(".event-label").textContent, min: evMin };
      }
    });

    // Update Next Up card
    if (nextEvent) {
      $nextText.textContent = nextEvent.label;
      const diff = nextEvent.min - nowMin;
      if (diff <= 0) {
        $nextCount.textContent = "NOW";
      } else if (diff < 60) {
        $nextCount.textContent = diff + "m";
      } else {
        const hh = Math.floor(diff / 60);
        const mm = diff % 60;
        $nextCount.textContent = hh + "h " + (mm > 0 ? mm + "m" : "");
      }
    } else {
      $nextText.textContent = "No more events today";
      $nextCount.textContent = "";
    }
  }

  // ── Boot ──
  hydrate();
  
  if (data.slideshow.length > 0) {
    const slides = $slideshow.querySelectorAll('.slide');
    slides[0].classList.add('active'); // Prep first slide
    currentSlide = -1; // so nextSlide increments to 0
    showNextSlide();
  }

  function tick() {
    updateClock();
    updateSchedule();
  }

  tick();
  setInterval(tick, 1000);

})();
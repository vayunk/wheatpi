/* ─────────────────────────────────────────────────────────
   KCL Robotics Lab Display – app.js
   ───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // ── DOM refs ──
  const $time      = document.getElementById("time");
  const $date      = document.getElementById("date");
  const $greeting  = document.getElementById("greeting");
  const $secFill   = document.getElementById("seconds-fill");
  const $eventList = document.getElementById("event-list");
  const $nextText  = document.getElementById("next-up-text");
  const $nextCount = document.getElementById("next-up-countdown");
  const $ticker    = document.getElementById("ticker-track");

  // ── Greeting by time of day ──
  function getGreeting(h) {
    if (h < 6)  return "Good night";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  // ── Clock + date ──
  function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    $time.textContent = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");

    $date.textContent = now.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    $greeting.textContent = getGreeting(h);

    // Seconds progress bar
    $secFill.style.width = ((s / 59) * 100).toFixed(1) + "%";
  }

  // ── Schedule: highlight past / current / next ──
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

      // Track the next upcoming event
      if (evMin > nowMin && !nextEvent) {
        nextEvent = { label: ev.querySelector(".event-label").textContent, min: evMin };
      }
    });

    // Update "up next" card
    if (nextEvent) {
      $nextText.textContent = nextEvent.label;
      const diff = nextEvent.min - nowMin;
      if (diff <= 0) {
        $nextCount.textContent = "Now";
      } else if (diff < 60) {
        $nextCount.textContent = "in " + diff + " min";
      } else {
        const hh = Math.floor(diff / 60);
        const mm = diff % 60;
        $nextCount.textContent = "in " + hh + "h " + (mm > 0 ? mm + "m" : "");
      }
    } else {
      $nextText.textContent = "Nothing more today";
      $nextCount.textContent = "";
    }
  }

  // ── Ticker: duplicate content for seamless loop ──
  function initTicker() {
    const segment = $ticker.querySelector(".ticker-segment");
    if (segment) {
      const clone = segment.cloneNode(true);
      $ticker.appendChild(clone);
    }
  }

  // ── Boot ──
  function tick() {
    updateClock();
    updateSchedule();
  }

  tick();
  setInterval(tick, 1000);
  initTicker();
})();
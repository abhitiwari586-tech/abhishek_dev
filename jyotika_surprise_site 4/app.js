// ===== helpers =====
const $ = (id) => document.getElementById(id);

function isoToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDateISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getPreviewMode() {
  return localStorage.getItem("PREVIEW_ALL") === "1";
}
function setPreviewMode(v) {
  localStorage.setItem("PREVIEW_ALL", v ? "1" : "0");
}
function isUnlocked(iso) {
  return getPreviewMode() || isoToday() >= iso;
}

// ===== header =====
function renderHeader(currentIso) {
  const dot = $("dot");
  const todayText = $("todayText");
  const modeText = $("modeText");
  const toggle = $("togglePreview");

  if (getPreviewMode()) {
    dot.className = "dot warn";
    todayText.textContent = "Preview enabled";
    modeText.textContent = "Preview (all unlocked)";
  } else {
    dot.className = isUnlocked(currentIso) ? "dot good" : "dot";
    todayText.innerHTML = `Today: <b>${formatDateISO(isoToday())}</b>`;
    modeText.textContent = "Locked by date";
  }

  toggle.onclick = () => {
    setPreviewMode(!getPreviewMode());
    location.reload();
  };
}

// ===== confetti =====
function confettiPop() {
  const box = $("confetti");
  if (!box) return;
  box.innerHTML = "";
  box.style.display = "block";

  for (let i = 0; i < 80; i++) {
    const d = document.createElement("div");
    d.className = "c";
    d.style.left = Math.random() * 100 + "vw";
    d.style.background = `hsl(${Math.random() * 360},90%,70%)`;
    box.appendChild(d);
  }
  setTimeout(() => {
    box.style.display = "none";
    box.innerHTML = "";
  }, 1400);
}

// ===== YouTube (click-to-play, FIXED) =====
function ytBox(iso) {
  const s = window.SONGS[iso];
  const box = document.createElement("div");
  box.className = "box";

  if (!s || !s.id) {
    box.innerHTML = `<h3>Song 🎵</h3><p class="muted">No song configured.</p>`;
    return box;
  }

  box.innerHTML = `
    <h3>Song 🎵 <span class="kbd">${s.title}</span></h3>
    <div id="yt_${s.id}" style="margin-top:10px">
      <button class="btn">▶️ Play inside page</button>
    </div>
    <p class="muted" style="margin-top:6px">
      If it doesn’t play, 
      <a href="https://www.youtube.com/watch?v=${s.id}" target="_blank">open on YouTube</a>.
    </p>
  `;

  box.querySelector("button").onclick = () => {
    const host = box.querySelector(`#yt_${s.id}`);
    host.innerHTML = `
      <div style="position:relative;padding-top:56.25%">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${s.id}?autoplay=1&rel=0"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    `;
  };

  return box;
}

// ===== backgrounds =====
function applyBackground(iso) {
  const bg = document.createElement("div");
  bg.className = "bg";
  const map = {
    "2026-02-06": "assets/bg_day1_forest.svg",
    "2026-02-07": "assets/bg_day2_roses.svg",
    "2026-02-08": "assets/bg_day3_candle.svg",
    "2026-02-09": "assets/bg_day4_choco.svg",
    "2026-02-10": "assets/bg_day5_cozy.svg",
    "2026-02-11": "assets/bg_day6_marigold.svg",
    "2026-02-12": "assets/bg_day7_deep.svg",
    "2026-02-14": "assets/bg_day8_sunset.svg",
  };
  bg.style.backgroundImage = `url('${map[iso]}')`;
  document.body.prepend(bg);
}

// ===== interactions per day =====
window.DAYS = {
  "2026-02-06": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `
      <h3>A classic line</h3>
      <p><i>“Thou art more lovely and more temperate.”</i></p>
      <button class="btn" id="m">Reveal meaning</button>
      <p id="o" class="muted" style="display:none;margin-top:10px">
        Your eyes feel calm, deep, and safe — like a place I’d always return to.
      </p>
    `;
    root.appendChild(b);
    $("m").onclick = () => {
      $("o").style.display = "block";
      confettiPop();
    };
  },

  "2026-02-07": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `
      <h3>Pick a rose</h3>
      <button class="btn secondary" id="r">Red 🌹</button>
      <p id="t" class="muted"></p>
    `;
    root.appendChild(b);
    $("r").onclick = () => {
      $("t").textContent = "For the love that feels sure and warm.";
      confettiPop();
    };
  },

  "2026-02-08": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `
      <h3>A question</h3>
      <button class="btn" id="y">Yes 💖</button>
      <button class="btn secondary" id="n">No 🙈</button>
      <p id="p" class="muted"></p>
    `;
    root.appendChild(b);

    $("n").onclick = () => {
      $("p").textContent = "I’ll keep asking 🙂";
      $("n").style.transform = `translate(${Math.random()*40}px,${Math.random()*20}px)`;
    };
    $("y").onclick = () => {
      $("p").textContent = "Then this bouquet is for you 💐";
      confettiPop();
    };
  },

  "2026-02-09": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `<h3>Chocolate 🍫</h3><p>Sweet, just like you.</p>`;
    root.appendChild(b);
  },

  "2026-02-10": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `<h3>Teddy hug 🧸</h3><p>Whenever you need comfort.</p>`;
    root.appendChild(b);
  },

  "2026-02-11": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `<h3>A promise</h3><p>Quiet. Steady. Always.</p>`;
    root.appendChild(b);
  },

  "2026-02-12": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `<h3>Depth</h3><input type="range" min="0" max="100" />`;
    root.appendChild(b);
  },

  "2026-02-14": (root) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `<h3>Take my hand 🤝</h3>`;
    root.appendChild(b);
  },
};

// ===== page initializers =====
function initDayPage(iso, heroText) {
  renderHeader(iso);
  applyBackground(iso);
  $("dayTitle").textContent = `Next surprise — ${formatDateISO(iso)}`;
  $("heroText").textContent = heroText;

  const grid = $("grid");
  grid.innerHTML = "";
  grid.appendChild(ytBox(iso));

  if (isUnlocked(iso)) {
    window.DAYS[iso](grid);
  } else {
    grid.innerHTML += `<div class="box">Locked 🔒</div>`;
  }
}

function initIndex() {
  renderHeader(isoToday());
  const list = $("dateList");
  list.innerHTML = "";

  window.SURPRISE_DATES.forEach((d, i) => {
    const b = document.createElement("div");
    b.className = "box";
    b.innerHTML = `
      <h3>Next surprise — ${formatDateISO(d)}</h3>
      <a class="btn" href="day-${i + 1}.html">Open</a>
    `;
    list.appendChild(b);
  });
}

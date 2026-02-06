// app.js — strict date-locked surprises (no preview unlock)

const $ = (id) => document.getElementById(id);

/* ---------- DATE HELPERS ---------- */
function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ---------- LOCK LOGIC (DATE ONLY, SAFE) ---------- */
function isUnlocked(iso) {
  // Compare real dates at local midnight to avoid string-compare bugs
  const [y, m, d] = iso.split("-").map(Number);
  const unlockDate = new Date(y, m - 1, d);
  unlockDate.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return now.getTime() >= unlockDate.getTime();
}

/* ---------- HEADER ---------- */
function renderHeader(currentIso) {
  const dot = $("dot"),
    todayText = $("todayText"),
    modeText = $("modeText");

  if (dot) dot.className = isUnlocked(currentIso) ? "dot good" : "dot";
  if (todayText) todayText.innerHTML = `Today: <b>${formatDateISO(isoToday())}</b>`;
  if (modeText) modeText.textContent = "Locked by date";

  // Keep button visible but disable it (does nothing)
  const btn = $("togglePreview");
  if (btn) {
    btn.disabled = true;
    btn.onclick = null;
    btn.style.opacity = "0.35";
    btn.style.cursor = "not-allowed";
    btn.title = "Locked by date";
  }
}

/* ---------- CONFETTI ---------- */
function confettiPop() {
  const c = $("confetti");
  if (!c) return;
  c.innerHTML = "";
  c.style.display = "block";
  for (let i = 0; i < 80; i++) {
    const e = document.createElement("div");
    e.className = "c";
    e.style.left = Math.random() * 100 + "vw";
    e.style.background = `hsl(${Math.random() * 360},90%,75%)`;
    e.style.animationDuration = 900 + Math.random() * 700 + "ms";
    c.appendChild(e);
  }
  setTimeout(() => {
    c.style.display = "none";
    c.innerHTML = "";
  }, 1400);
}

/* ---------- SONGS ---------- */
function songForDate(iso) {
  return (window.SONGS && window.SONGS[iso]) ? window.SONGS[iso] : {};
}

function ytBox(iso, unlocked) {
  const box = document.createElement("div");
  box.className = "box";

  if (!unlocked) {
    box.innerHTML = `
      <h3>Song 🎵</h3>
      <p class="muted">This song unlocks on <b>${formatDateISO(iso)}</b>.</p>`;
    return box;
  }

  const s = songForDate(iso);
  if (!s.id) {
    box.innerHTML = "<h3>Song 🎵</h3><p class='muted'>Song not set.</p>";
    return box;
  }

  const pid = "yt_" + Math.random().toString(36).slice(2);
  box.innerHTML = `
    <h3>Song 🎵 <span class="kbd">${s.title || ""}</span></h3>
    <div id="${pid}" style="margin-top:10px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.10)">
      <button class="btn" style="width:100%;border-radius:0" data-id="${s.id}" data-p="${pid}">▶️ Load player</button>
    </div>`;

  setTimeout(() => {
    const b = box.querySelector("button");
    if (!b) return;

    b.onclick = () => {
      const id = s.id;
      const host = $(pid);
      host.innerHTML = `
        <div style="position:relative;padding-top:56.25%">
          <iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0"
            style="position:absolute;inset:0;width:100%;height:100%;border:0"
            allowfullscreen></iframe>
        </div>`;
    };
  }, 0);

  return box;
}

/* ---------- LOCK BOX ---------- */
function lockBox(iso) {
  const d = document.createElement("div");
  d.className = "box";
  d.innerHTML = `
    <h3>Locked 🔒</h3>
    <p>This surprise unlocks on <b>${formatDateISO(iso)}</b>.</p>`;
  return d;
}

/* ---------- SMALL EFFECTS ---------- */
function startRoseShower(target) {
  const wrap = target;
  wrap.style.position = "relative";

  const layer = document.createElement("div");
  layer.style.position = "absolute";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.overflow = "hidden";
  wrap.appendChild(layer);

  const roses = ["🌹", "🌹", "🌸", "🌹", "🌸", "🌹", "🍃"];

  for (let i = 0; i < 70; i++) {
    const span = document.createElement("div");
    span.textContent = roses[Math.floor(Math.random() * roses.length)];
    span.style.position = "absolute";
    span.style.left = Math.random() * 100 + "%";
    span.style.top = -10 - Math.random() * 60 + "px";
    span.style.fontSize = 18 + Math.random() * 26 + "px";
    span.style.opacity = 0.6 + Math.random() * 0.4;

    const dur = 1200 + Math.random() * 1600;
    span.animate(
      [
        { transform: "translateY(0) rotate(0deg)" },
        { transform: `translateY(${wrap.clientHeight + 140}px) rotate(${180 + Math.random() * 360}deg)` },
      ],
      { duration: dur, iterations: 1, easing: "linear", delay: Math.random() * 500 }
    );

    layer.appendChild(span);
    setTimeout(() => span.remove(), dur + 700);
  }

  setTimeout(() => layer.remove(), 3000);
}

function setScene(imgEl, assetPath) {
  imgEl.src = assetPath;
}

/* ---------- DAY CONTENT ---------- */
window.DAYS = window.DAYS || {};

window.DAYS["2026-02-06"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>A classic line</h3>
    <p style="font-size:15px;line-height:1.7"><i>“Thou art more lovely and more temperate.”</i></p>
    <p class="muted" style="margin-top:10px">And yet, Jyotika… even Shakespeare would pause at your eyes.</p>
    <div class="actions"><button class="btn" id="meaningBtn">Reveal meaning</button></div>
    <p class="muted" id="meaningOut" style="margin-top:10px;display:none">
      Your eyes don’t just look beautiful — they feel calm, deep, and safe… like a place I’d choose again and again.
    </p>`;
  root.appendChild(box);

  setTimeout(() => {
    $("meaningBtn").onclick = () => {
      $("meaningOut").style.display = "block";
      confettiPop();
    };
  }, 0);
};

window.DAYS["2026-02-07"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>Pick a rose</h3>
    <p class="muted">Choose one. Then watch the roses bloom around you 🌹</p>
    <div class="actions">
      <button class="btn secondary" id="r1">Red 🌹</button>
      <button class="btn secondary" id="r2">Pink 🌸</button>
      <button class="btn secondary" id="r3">White 🤍</button>
    </div>
    <p id="roseLine" style="margin-top:10px" class="muted">—</p>`;
  root.appendChild(box);

  const scene = document.createElement("div");
  scene.className = "scene";
  scene.innerHTML = `<img alt="Rose shower" src="assets/bg_day2_roses.svg"/>`;
  root.appendChild(scene);

  setTimeout(() => {
    const line = $("roseLine");
    const pick = (msg) => {
      line.textContent = msg;
      startRoseShower(scene);
      confettiPop();
    };
    $("r1").onclick = () => pick("Red — for the love that’s sure, warm, and fearless.");
    $("r2").onclick = () => pick("Pink — for the softness you carry without trying.");
    $("r3").onclick = () => pick("White — for the peace you bring just by existing.");
  }, 0);
};

window.DAYS["2026-02-08"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>A question…</h3>
    <p style="font-size:16px;line-height:1.7">
      <b>Jyotika</b>, if love had a doorway… I’d stand there gently, flowers in hand, and ask you this:
      <br><br>
      <span style="font-size:18px"><b>Will you go out with me?</b> 💖</span>
    </p>
    <div class="actions">
      <button class="btn" id="yes">Yes 💖</button>
      <button class="btn secondary" id="no">No 🙈</button>
    </div>
    <p class="muted" id="pout" style="margin-top:10px">—</p>`;
  root.appendChild(box);

  const scene = document.createElement("div");
  scene.className = "scene";
  scene.innerHTML = `<div style="padding:14px">
    <div class="kbd">A little surprise for you</div>
    <div id="praise" style="margin-top:10px;line-height:1.75;font-size:15px;color:rgba(255,255,255,.92);white-space:pre-line;display:none"></div>
  </div>`;
  root.appendChild(scene);

  const asks = [
    "No worries… but can I ask again, a little more softly? 🌙",
    "Okay… I’ll try with honesty: you make ordinary moments feel magical. Will you go out with me? ✨",
    "If I promised to bring laughter, comfort, and chai on bad days… would you say yes? ☕💗",
    "I don’t want a perfect story. I want a real one — with you. Say yes? 🌹",
    "Just one chance, Jyotika… let me make you smile the way you make me. Will you go out with me? 😊",
  ];

  const praiseLines = [
    "You are beauty in the quiet details —",
    "in the way your eyes hold calm like a secret forest,",
    "in the softness of your smile that makes my heart slow down,",
    "in the grace you carry without even trying.",
    "",
    "If you say yes… I’ll keep you happy the way sunshine keeps mornings warm:",
    "with patience, with respect, with laughter,",
    "with small surprises when you least expect them,",
    "with a love that shows up — every day, not only on special days.",
    "",
    "Because you, Jyotika… you’re not just someone I like.",
    "You’re someone I choose. Again. Again. And always. 💖",
  ];

  let n = 0;
  function showPraise() {
    const area = document.getElementById("praise");
    area.style.display = "block";
    area.textContent = praiseLines.join("\n");
    confettiPop();
  }

  setTimeout(() => {
    $("no").onclick = () => {
      $("pout").textContent = asks[Math.min(n, asks.length - 1)];
      n++;
      const b = $("no");
      b.style.position = "relative";
      b.style.left = Math.random() * 120 - 60 + "px";
      b.style.top = Math.random() * 60 - 30 + "px";
    };

    $("yes").onclick = () => {
      $("pout").textContent = "Yes? Then let me say this… 💐";
      showPraise();
    };
  }, 0);
};

window.DAYS["2026-02-09"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>A sweet gift</h3>
    <p class="muted">Tap to unwrap your chocolate 🍫</p>
    <div class="actions"><button class="btn" id="unwrap">Unwrap 🍫</button></div>
    <p class="muted" style="margin-top:10px">“If sweetness had a face, it would still lose to your smile.”</p>`;
  root.appendChild(box);

  const scene = document.createElement("div");
  scene.className = "scene";
  scene.innerHTML = `<img id="chocoScene" alt="Chocolate" src="assets/scene_choco_unwrap.svg"/>`;
  root.appendChild(scene);

  setTimeout(() => {
    $("unwrap").onclick = () => {
      setScene($("chocoScene"), "assets/scene_choco_open.svg");
      confettiPop();
    };
  }, 0);
};

window.DAYS["2026-02-10"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>Comfort mode 🧸</h3>
    <p class="muted">Press & hold for 1.5s to receive a teddy hug.</p>
    <div class="actions">
      <button class="btn" id="hold">Hold 🧸</button>
      <span class="kbd" id="holdStatus">Waiting…</span>
    </div>
    <p id="teddyLine" class="muted" style="margin-top:10px">—</p>`;
  root.appendChild(box);

  const scene = document.createElement("div");
  scene.className = "scene";
  scene.innerHTML = `<img id="teddyScene" alt="Teddy" src="assets/scene_teddy.svg" style="display:none"/>`;
  root.appendChild(scene);

  setTimeout(() => {
    let timer = null;
    const start = () => {
      $("holdStatus").textContent = "Holding…";
      timer = setTimeout(() => {
        $("holdStatus").textContent = "Delivered ✅";
        $("teddyLine").textContent =
          "For every moment you need comfort, I’m here — quietly, completely.";
        $("teddyScene").style.display = "block";
        confettiPop();
      }, 1500);
    };
    const stop = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      if ($("holdStatus").textContent !== "Delivered ✅") $("holdStatus").textContent = "Try again…";
    };
    const b = $("hold");
    b.addEventListener("mousedown", start);
    b.addEventListener("touchstart", start, { passive: true });
    b.addEventListener("mouseup", stop);
    b.addEventListener("mouseleave", stop);
    b.addEventListener("touchend", stop);
  }, 0);
};

window.DAYS["2026-02-11"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>A promise</h3>
    <p class="muted">Tap to see a promise ✨</p>
    <div class="actions"><button class="btn" id="promiseBtn">Show promise ✨</button></div>
    <p class="muted" style="margin-top:10px">Not a loud love. A steady one.</p>`;
  root.appendChild(box);

  const scene = document.createElement("div");
  scene.className = "scene";
  scene.innerHTML = `<img id="promiseScene" alt="Promise card" src="assets/scene_promise_card.svg" style="display:none"/>`;
  root.appendChild(scene);

  setTimeout(() => {
    $("promiseBtn").onclick = () => {
      $("promiseScene").style.display = "block";
      confettiPop();
    };
  }, 0);
};

window.DAYS["2026-02-12"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>How deep is this feeling?</h3>
    <p class="muted">Slide it. The line changes.</p>
    <div class="actions" style="width:100%"><input id="depth" type="range" min="0" max="100" value="70" style="width:100%"></div>
    <p id="depthLine" style="margin-top:10px">—</p>`;
  root.appendChild(box);

  setTimeout(() => {
    const depth = $("depth");
    const out = $("depthLine");
    const upd = () => {
      const v = parseInt(depth.value, 10);
      out.textContent =
        v >= 81 ? "Gehra hua… the kind that becomes home."
        : v >= 56 ? "A depth… that stays even in silence."
        : v >= 26 ? "A warmth… steady and real."
        : "A spark… sweet and shy.";
    };
    depth.oninput = upd;
    upd();
  }, 0);
};

window.DAYS["2026-02-14"] = (root) => {
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `<h3>A love letter</h3>
    <p class="muted">Tap to start. Each line will appear one by one. ❤️</p>
    <div class="actions">
      <button class="btn" id="startLetter">Start the letter ✨</button>
      <span class="kbd" id="letterStatus">Ready</span>
    </div>
    <div id="letter" style="margin-top:12px;line-height:1.85;font-size:15px;color:rgba(255,255,255,.92);white-space:pre-line"></div>`;
  root.appendChild(box);

  const lines = [
    "Dear Jyotika,",
    "",
    "If I could fold a whole sky into a sentence, I’d still fall short…",
    "because what I feel for you isn’t a line — it’s a lifetime.",
    "",
    "I love the way you exist — calmly, beautifully, truly.",
    "I love your eyes — deep like they’re carrying a thousand gentle stories.",
    "I love your smile — the kind that makes my mind go quiet and my heart go loud.",
    "",
    "I don’t promise perfect days.",
    "I promise present days.",
    "Days where I listen, days where I learn you,",
    "days where I protect your peace,",
    "days where I choose you — even when life gets noisy.",
    "",
    "I’ll hold your hand on celebrations…",
    "and I’ll hold your heart on the difficult nights.",
    "",
    "So here’s my simplest truth:",
    "if love is a home — I want it to be you.",
    "",
    "Happy Valentine’s Day,",
    "Yours (always),",
    "❤️",
  ];

  function popLines() {
    const out = document.getElementById("letter");
    const st = document.getElementById("letterStatus");
    const btn = document.getElementById("startLetter");
    let i = 0;
    out.textContent = "";
    st.textContent = "Writing…";
    btn.disabled = true;

    const tick = () => {
      if (i >= lines.length) {
        st.textContent = "Done ✅";
        confettiPop();
        return;
      }
      out.textContent += lines[i] + "\n";
      i++;
      if (i === 1 || i === 6 || i === 12 || i === lines.length) confettiPop();
      setTimeout(tick, 700);
    };

    tick();
  }

  setTimeout(() => {
    $("startLetter").onclick = popLines;
  }, 0);
};

/* ---------- DAY PAGES INIT ---------- */
function initDayPage(iso, heroText) {
  renderHeader(iso);

  if ($("dayTitle")) $("dayTitle").textContent = `Next surprise — ${formatDateISO(iso)}`;
  if ($("heroText")) $("heroText").textContent = heroText;

  const unlocked = isUnlocked(iso);
  if ($("statusText")) {
    $("statusText").innerHTML = unlocked
      ? "<b style='color:rgba(56,211,159,.92)'>Unlocked</b>"
      : "<b style='color:rgba(255,209,102,.92)'>Locked</b>";
  }

  const grid = $("grid");
  if (!grid) return;
  grid.innerHTML = "";

  // 🔒 Lock song window too
  grid.appendChild(ytBox(iso, unlocked));

  // 🔒 Lock content too
  if (!unlocked) grid.appendChild(lockBox(iso));
  else window.DAYS[iso]?.(grid);
}

/* ---------- INDEX INIT (ALL DATES ALWAYS VISIBLE) ---------- */
function initIndex() {
  renderHeader(isoToday());

  const list = $("dateList");
  if (!list) return;
  list.innerHTML = "";

  const dates = window.SURPRISE_DATES || [];
  dates.forEach((d, i) => {
    const u = isUnlocked(d);
    const s = songForDate(d);
    const item = document.createElement("div");
    item.className = "box";
    item.innerHTML = `
      <h3>Next surprise — ${formatDateISO(d)}</h3>
      <p class="muted">${u ? "Unlocked" : "Locked"} • Song: ${s.title || "—"}</p>
      <div class="actions">
        <a class="btn ${u ? "" : "secondary"}" href="day-${i + 1}.html">
          Open ${u ? "" : "(locked)"}
        </a>
      </div>`;
    list.appendChild(item);
  });
}

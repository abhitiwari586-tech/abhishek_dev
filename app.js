
const $ = (id)=>document.getElementById(id);

function isoToday(){
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,"0");
  const d = String(now.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}
function formatDateISO(iso){
  const [y,m,d] = iso.split("-").map(Number);
  const dt = new Date(y, m-1, d, 0,0,0,0);
  return dt.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });
}
function confettiPop(){
  const conf = $("confetti"); if(!conf) return;
  conf.innerHTML = ""; conf.style.display = "block";
  const w = window.innerWidth, count = 90;
  for(let i=0;i<count;i++){
    const el = document.createElement("div"); el.className="c";
    el.style.left=(Math.random()*w)+"px"; el.style.top=(-20-Math.random()*140)+"px";
    el.style.animationDuration=(900+Math.random()*750)+"ms";
    el.style.width=(7+Math.random()*10)+"px"; el.style.height=(9+Math.random()*14)+"px";
    el.style.background=`hsla(${Math.floor(Math.random()*360)}, 90%, 75%, .92)`;
    conf.appendChild(el);
  }
  setTimeout(()=>{conf.style.display="none"; conf.innerHTML="";},1450);
}
function getPreviewMode(){ return localStorage.getItem("PREVIEW_ALL")==="1"; }
function setPreviewMode(on){ localStorage.setItem("PREVIEW_ALL", on ? "1":"0"); }
function isUnlocked(iso){return true; return isoToday() >= iso; }

function renderHeader(currentIso){
  const dot=$("dot"), todayText=$("todayText"), modeText=$("modeText"), toggle=$("togglePreview");
  if(getPreviewMode()){ dot.className="dot warn"; todayText.innerHTML=`Preview enabled`; }
  else { dot.className=isUnlocked(currentIso) ? "dot good":"dot"; todayText.innerHTML=`Today: <b>${formatDateISO(isoToday())}</b>`; }
  modeText.textContent = getPreviewMode() ? "Preview (all unlocked)" : "Locked by date";
  toggle.textContent = getPreviewMode() ? "Disable preview" : "Preview all days";
  toggle.onclick=()=>{ setPreviewMode(!getPreviewMode()); location.reload(); };
}
function songForDate(iso){ return (window.SONGS && window.SONGS[iso]) ? window.SONGS[iso] : {id:"", title:"Song not set"}; }

// Click-to-load YouTube embed (fixes many local-file/browser restrictions)
function ytBox(iso){
  const s = songForDate(iso);
  const div = document.createElement("div");
  div.className = "box";
  div.innerHTML = `<h3>Song 🎵 <span class="kbd" style="margin-left:8px">${s.title || "—"}</span></h3>`;

  if(!s.id){
    div.innerHTML += `<p class="muted">No YouTube ID set. Edit <span class="kbd">songs.js</span>.</p>`;
    return div;
  }

  const thumb = `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`;
  const playerId = `player_${s.id}_${Math.floor(Math.random()*1e6)}`;

  div.innerHTML += `
    <div id="${playerId}" style="margin-top:10px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04)">
      <button class="btn" style="width:100%;border-radius:0;display:flex;gap:12px;align-items:center;justify-content:center;padding:12px 14px"
        data-yt="${s.id}" data-title="${(s.title||"").replace(/"/g,'&quot;')}" data-target="${playerId}">
        ▶️ Play inside page
      </button>
      <div style="position:relative;padding-top:56.25%;background-image:url('${thumb}');background-size:cover;background-position:center;filter:saturate(1.05) contrast(1.02)">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.45))"></div>
      </div>
    </div>
    <p class="muted" style="margin-top:8px">
      If the embed is blocked by your browser/network, <a href="https://www.youtube.com/watch?v=${s.id}" target="_blank" rel="noopener">Open on YouTube</a>.
    </p>
  `;

  setTimeout(()=>{
    const btn = div.querySelector("button[data-yt]");
    if(!btn) return;
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-yt");
      const t = btn.getAttribute("data-title") || "YouTube";
      const tgt = btn.getAttribute("data-target");
      const host = document.getElementById(tgt);
      if(!host) return;
      host.innerHTML = `
        <div style="position:relative;padding-top:56.25%">
          <iframe title="${t}" loading="lazy" referrerpolicy="origin-when-cross-origin"
            src="https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1"
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
        </div>`;
    }, { once:true });
  }, 0);

  return div;
}

function navLinks(currentIso){
  const dates=window.SURPRISE_DATES||[]; const idx=dates.indexOf(currentIso);
  const prev=idx>0?dates[idx-1]:null; const next=(idx>=0 && idx<dates.length-1)?dates[idx+1]:null;
  const row=document.createElement("div"); row.className="navRow";
  row.innerHTML=`
    <a class="btn ghost" href="index.html">All dates</a>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end">
      ${prev?`<a class="btn secondary" href="day-${idx}.html">← Previous</a>`:`<span></span>`}
      ${next?`<a class="btn" href="day-${idx+2}.html">Next →</a>`:`<span></span>`}
    </div>`;
  return row;
}
function lockBox(currentIso){
  const div=document.createElement("div"); div.className="box";
  div.innerHTML=`<h3>Locked</h3><p>This surprise unlocks on <b>${formatDateISO(currentIso)}</b>.</p>
  <p class="muted">To verify now, click <b>Preview all days</b> (top-right).</p>`;
  return div;
}
function startRoseShower(target){
  const wrap=target; wrap.style.position="relative";
  const layer=document.createElement("div");
  layer.style.position="absolute"; layer.style.inset="0"; layer.style.pointerEvents="none"; layer.style.overflow="hidden";
  wrap.appendChild(layer);
  const roses=["🌹","🌹","🌸","🌹","🌸","🌹","🍃"];
  for(let i=0;i<70;i++){
    const span=document.createElement("div");
    span.textContent=roses[Math.floor(Math.random()*roses.length)];
    span.style.position="absolute"; span.style.left=(Math.random()*100)+"%"; span.style.top=(-10-Math.random()*60)+"px";
    span.style.fontSize=(18+Math.random()*26)+"px"; span.style.opacity=(0.6+Math.random()*0.4);
    const dur=1200+Math.random()*1600;
    span.animate([{transform:"translateY(0) rotate(0deg)"},{transform:`translateY(${wrap.clientHeight+140}px) rotate(${180+Math.random()*360}deg)`}],
      {duration:dur, iterations:1, easing:"linear", delay:Math.random()*500});
    layer.appendChild(span);
    setTimeout(()=>span.remove(), dur+700);
  }
  setTimeout(()=>layer.remove(), 3000);
}
function setScene(imgEl, assetPath){ imgEl.src = assetPath; }

function applyBackground(iso){
  const bg=document.createElement("div"); bg.className="bg";
  const map={
    "2026-02-06":"assets/bg_day1_forest.svg",
    "2026-02-07":"assets/bg_day2_roses.svg",
    "2026-02-08":"assets/bg_day3_candle.svg",
    "2026-02-09":"assets/bg_day4_choco.svg",
    "2026-02-10":"assets/bg_day5_cozy.svg",
    "2026-02-11":"assets/bg_day6_marigold.svg",
    "2026-02-12":"assets/bg_day7_deep.svg",
    "2026-02-14":"assets/bg_day8_sunset.svg"
  };
  bg.style.backgroundImage = `url('${map[iso] || "assets/bg_day3_candle.svg"}')`;
  document.body.prepend(bg);
}

window.DAYS = {
  "2026-02-06": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>A classic line (Shakespeare)</h3>
      <p style="font-size:15px;line-height:1.7"><i>“Thou art more lovely and more temperate.”</i></p>
      <p class="muted" style="margin-top:10px">And yet, Jyotika… even Shakespeare would pause at your eyes.</p>
      <div class="actions"><button class="btn" id="meaningBtn">Reveal meaning</button></div>
      <p class="muted" id="meaningOut" style="margin-top:10px;display:none">
        Your eyes don’t just look beautiful — they feel calm, deep, and safe… like a place I’d choose again and again.
      </p>`;
    root.appendChild(box);
    setTimeout(()=>{ $("meaningBtn").onclick=()=>{ $("meaningOut").style.display="block"; confettiPop(); }; },0);
  },

  "2026-02-07": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>Pick a rose</h3>
      <p class="muted">Choose one. Then watch the roses bloom around you 🌹</p>
      <div class="actions">
        <button class="btn secondary" id="r1">Red 🌹</button>
        <button class="btn secondary" id="r2">Pink 🌸</button>
        <button class="btn secondary" id="r3">White 🤍</button>
      </div>
      <p id="roseLine" style="margin-top:10px" class="muted">—</p>`;
    root.appendChild(box);

    const scene=document.createElement("div"); scene.className="scene";
    scene.innerHTML=`<img alt="Rose shower" src="assets/bg_day2_roses.svg"/>`;
    root.appendChild(scene);

    setTimeout(()=>{
      const line=$("roseLine");
      const pick=(msg)=>{ line.textContent=msg; startRoseShower(scene); confettiPop(); };
      $("r1").onclick=()=>pick("Red — for the love that’s sure, warm, and fearless.");
      $("r2").onclick=()=>pick("Pink — for the softness you carry without trying.");
      $("r3").onclick=()=>pick("White — for the peace you bring just by existing.");
    },0);
  },


  "2026-02-08": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>A question…</h3>
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

    const scene=document.createElement("div"); scene.className="scene";
    scene.innerHTML=`<div style="padding:14px">
      <div class="kbd">A little surprise for you</div>
      <div id="praise" style="margin-top:10px;line-height:1.75;font-size:15px;color:rgba(255,255,255,.92);white-space:pre-line;display:none"></div>
    </div>`;
    root.appendChild(scene);

    const asks=[
      "No worries… but can I ask again, a little more softly? 🌙",
      "Okay… I’ll try with honesty: you make ordinary moments feel magical. Will you go out with me? ✨",
      "If I promised to bring laughter, comfort, and chai on bad days… would you say yes? ☕💗",
      "I don’t want a perfect story. I want a real one — with you. Say yes? 🌹",
      "Just one chance, Jyotika… let me make you smile the way you make me. Will you go out with me? 😊"
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
      "You’re someone I choose. Again. Again. And always. 💖"
    ];

    let n=0;
    function showPraise(){
      const area = document.getElementById("praise");
      area.style.display="block";
      area.textContent = praiseLines.join("\n");
      confettiPop();
    }

    setTimeout(()=>{
      $("no").onclick=()=>{
        const msg = asks[Math.min(n, asks.length-1)];
        $("pout").textContent = msg;
        n++;
        // fun, gentle dodge
        const b=$("no");
        b.style.position="relative";
        b.style.left=(Math.random()*120-60)+"px";
        b.style.top=(Math.random()*60-30)+"px";
      };
      $("yes").onclick=()=>{
        $("pout").textContent="Yes? Then let me say this… 💐";
        showPraise();
      };
    },0);
  },

  "2026-02-09": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>A sweet gift</h3>
      <p class="muted">Tap to unwrap your chocolate 🍫</p>
      <div class="actions"><button class="btn" id="unwrap">Unwrap 🍫</button></div>
      <p class="muted" style="margin-top:10px">“If sweetness had a face, it would still lose to your smile.”</p>`;
    root.appendChild(box);

    const scene=document.createElement("div"); scene.className="scene";
    scene.innerHTML=`<img id="chocoScene" alt="Chocolate" src="assets/scene_choco_unwrap.svg"/>`;
    root.appendChild(scene);

    setTimeout(()=>{
      $("unwrap").onclick=()=>{
        setScene($("chocoScene"), "assets/scene_choco_open.svg");
        confettiPop();
      };
    },0);
  },

  "2026-02-10": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>Comfort mode 🧸</h3>
      <p class="muted">Press & hold for 1.5s to receive a teddy hug.</p>
      <div class="actions">
        <button class="btn" id="hold">Hold 🧸</button>
        <span class="kbd" id="holdStatus">Waiting…</span>
      </div>
      <p id="teddyLine" class="muted" style="margin-top:10px">—</p>`;
    root.appendChild(box);

    const scene=document.createElement("div"); scene.className="scene";
    scene.innerHTML=`<img id="teddyScene" alt="Teddy" src="assets/scene_teddy.svg" style="display:none"/>`;
    root.appendChild(scene);

    setTimeout(()=>{
      let timer=null;
      const start=()=>{
        $("holdStatus").textContent="Holding…";
        timer=setTimeout(()=>{
          $("holdStatus").textContent="Delivered ✅";
          $("teddyLine").textContent="For every moment you need comfort, I’m here — quietly, completely.";
          $("teddyScene").style.display="block";
          confettiPop();
        },1500);
      };
      const stop=()=>{
        if(timer){clearTimeout(timer); timer=null;}
        if($("holdStatus").textContent!=="Delivered ✅") $("holdStatus").textContent="Try again…";
      };
      const b=$("hold");
      b.addEventListener("mousedown",start);
      b.addEventListener("touchstart",start,{passive:true});
      b.addEventListener("mouseup",stop);
      b.addEventListener("mouseleave",stop);
      b.addEventListener("touchend",stop);
    },0);
  },

  "2026-02-11": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>A promise</h3>
      <p class="muted">Tap to see a promise ✨</p>
      <div class="actions"><button class="btn" id="promiseBtn">Show promise ✨</button></div>
      <p class="muted" style="margin-top:10px">Not a loud love. A steady one.</p>`;
    root.appendChild(box);

    const scene=document.createElement("div"); scene.className="scene";
    scene.innerHTML=`<img id="promiseScene" alt="Promise card" src="assets/scene_promise_card.svg" style="display:none"/>`;
    root.appendChild(scene);

    setTimeout(()=>{
      $("promiseBtn").onclick=()=>{
        $("promiseScene").style.display="block";
        confettiPop();
      };
    },0);
  },

  "2026-02-12": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>How deep is this feeling?</h3>
      <p class="muted">Slide it. The line changes.</p>
      <div class="actions" style="width:100%"><input id="depth" type="range" min="0" max="100" value="70" style="width:100%"></div>
      <p id="depthLine" style="margin-top:10px">—</p>`;
    root.appendChild(box);

    setTimeout(()=>{
      const depth=$("depth"), out=$("depthLine");
      const upd=()=>{
        const v=parseInt(depth.value,10);
        out.textContent = v>=81 ? "Gehra hua… the kind that becomes home."
          : v>=56 ? "A depth… that stays even in silence."
          : v>=26 ? "A warmth… steady and real."
          : "A spark… sweet and shy.";
      };
      depth.oninput=upd; upd();
    },0);
  },


  "2026-02-14": (root)=>{
    const box=document.createElement("div"); box.className="box";
    box.innerHTML=`<h3>A love letter</h3>
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
      "❤️"
    ];

    function popLines(targetId, statusId, btnId){
      const out = document.getElementById(targetId);
      const st = document.getElementById(statusId);
      const btn = document.getElementById(btnId);
      let i=0;
      out.textContent="";
      st.textContent="Writing…";
      btn.disabled=true;

      const tick = ()=>{
        if(i >= lines.length){
          st.textContent="Done ✅";
          confettiPop();
          return;
        }
        out.textContent += (lines[i] + "\n");
        i++;
        // small confetti on key moments
        if(i===1 || i===6 || i===12 || i===lines.length) confettiPop();
        setTimeout(tick, 700);
      };
      tick();
    }

    setTimeout(()=>{
      $("startLetter").onclick=()=>popLines("letter","letterStatus","startLetter");
    },0);
  }

};

function initDayPage(iso, heroText){
  renderHeader(iso);
  applyBackground(iso);
  $("dayTitle").textContent = `Next surprise — ${formatDateISO(iso)}`;
  $("heroText").textContent = heroText;
  const unlocked=isUnlocked(iso);
  $("statusText").innerHTML = unlocked ? "<b style='color:rgba(56,211,159,.92)'>Unlocked</b>" : "<b style='color:rgba(255,209,102,.92)'>Locked</b>";
  const grid=$("grid"); grid.innerHTML="";
  grid.appendChild(ytBox(iso)); // YouTube box on every page (even locked)
  if(!unlocked) grid.appendChild(lockBox(iso));
  else { const render=window.DAYS[iso]; if(render) render(grid); }
  $("nav").appendChild(navLinks(iso));
}

function initIndex(){
  renderHeader(isoToday());
  const list=$("dateList"); list.innerHTML="";
  const dates=window.SURPRISE_DATES||[];
  dates.forEach((d,i)=>{
    const item=document.createElement("div"); item.className="box";
    const s=songForDate(d); const unlocked=isUnlocked(d);
    item.innerHTML=`<h3>Next surprise — ${formatDateISO(d)}</h3>
      <p class="muted">${unlocked?"Unlocked":"Locked"} • Song: ${s.title || "—"}</p>
      <div class="actions"><a class="btn ${unlocked?"":"secondary"}" href="day-${i+1}.html">${unlocked?"Open":"Peek (locked)"}</a></div>`;
    list.appendChild(item);
  });
}

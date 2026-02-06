// app.js — strict date-locked surprises (no preview unlock)

const $ = (id) => document.getElementById(id);

/* ---------- DATE HELPERS ---------- */
function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function formatDateISO(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y, m-1, d).toLocaleDateString(undefined,{
    weekday:"long", day:"numeric", month:"long", year:"numeric"
  });
}

/* ---------- LOCK LOGIC (DATE ONLY) ---------- */
function isUnlocked(iso){
  return isoToday() >= iso;
}

/* ---------- HEADER ---------- */
function renderHeader(currentIso){
  const dot=$("dot"), todayText=$("todayText"), modeText=$("modeText");
  if(dot) dot.className = isUnlocked(currentIso) ? "dot good":"dot";
  if(todayText) todayText.innerHTML = `Today: <b>${formatDateISO(isoToday())}</b>`;
  if(modeText) modeText.textContent = "Locked by date";

  const btn = $("togglePreview");
  if(btn){
    btn.disabled = true;
    btn.onclick = null;
    btn.style.opacity="0.35";
    btn.style.cursor="not-allowed";
    btn.title="Locked by date";
  }
}

/* ---------- CONFETTI ---------- */
function confettiPop(){
  const c=$("confetti"); if(!c) return;
  c.innerHTML=""; c.style.display="block";
  for(let i=0;i<80;i++){
    const e=document.createElement("div");
    e.className="c";
    e.style.left=Math.random()*100+"vw";
    e.style.background=`hsl(${Math.random()*360},90%,75%)`;
    e.style.animationDuration=900+Math.random()*700+"ms";
    c.appendChild(e);
  }
  setTimeout(()=>{c.style.display="none";c.innerHTML="";},1400);
}

/* ---------- SONGS ---------- */
function songForDate(iso){
  return window.SONGS?.[iso] || {};
}

function ytBox(iso, unlocked){
  const box=document.createElement("div");
  box.className="box";

  if(!unlocked){
    box.innerHTML=`
      <h3>Song 🎵</h3>
      <p class="muted">This song unlocks on <b>${formatDateISO(iso)}</b>.</p>`;
    return box;
  }

  const s=songForDate(iso);
  if(!s.id){
    box.innerHTML="<h3>Song 🎵</h3><p class='muted'>Song not set.</p>";
    return box;
  }

  const pid="yt_"+Math.random().toString(36).slice(2);
  box.innerHTML=`
    <h3>Song 🎵 <span class="kbd">${s.title||""}</span></h3>
    <div id="${pid}" style="margin-top:10px;border-radius:14px;overflow:hidden">
      <button class="btn" data-id="${s.id}" data-p="${pid}">▶️ Load player</button>
    </div>`;

  setTimeout(()=>{
    box.querySelector("button").onclick=()=>{
      const id=s.id;
      $(pid).innerHTML=`
        <div style="position:relative;padding-top:56.25%">
          <iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0"
            style="position:absolute;inset:0;width:100%;height:100%;border:0"
            allowfullscreen></iframe>
        </div>`;
    };
  },0);

  return box;
}

/* ---------- LOCK BOX ---------- */
function lockBox(iso){
  const d=document.createElement("div");
  d.className="box";
  d.innerHTML=`
    <h3>Locked 🔒</h3>
    <p>This surprise unlocks on <b>${formatDateISO(iso)}</b>.</p>`;
  return d;
}

/* ---------- DAY PAGES ---------- */
function initDayPage(iso, heroText){
  renderHeader(iso);

  $("dayTitle").textContent = `Next surprise — ${formatDateISO(iso)}`;
  $("heroText").textContent = heroText;

  const unlocked=isUnlocked(iso);
  $("statusText").innerHTML = unlocked
    ? "<b style='color:#38d39f'>Unlocked</b>"
    : "<b style='color:#ffd166'>Locked</b>";

  const grid=$("grid"); grid.innerHTML="";

  grid.appendChild(ytBox(iso, unlocked));

  if(!unlocked){
    grid.appendChild(lockBox(iso));
  } else {
    window.DAYS?.[iso]?.(grid);
  }
}

/* ---------- INDEX PAGE ---------- */
function initIndex(){
  renderHeader(isoToday());

  const list=$("dateList"); list.innerHTML="";
  window.SURPRISE_DATES.forEach((d,i)=>{
    const u=isUnlocked(d);
    const s=songForDate(d);
    const box=document.createElement("div");
    box.className="box";
    box.innerHTML=`
      <h3>Next surprise — ${formatDateISO(d)}</h3>
      <p class="muted">${u?"Unlocked":"Locked"} • Song: ${s.title||"—"}</p>
      <div class="actions">
        <a class="btn ${u?"":"secondary"}" href="day-${i+1}.html">
          Open ${u?"":"(locked)"}
        </a>
      </div>`;
    list.appendChild(box);
  });
}

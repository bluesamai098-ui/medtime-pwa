// MedTime PWA — updated with gore toggle & sensitive visuals.
// Keep visuals non-graphic and optional. Save state stored in localStorage.

const SAVE_KEY = "medtime_save_v2";

const DEFAULT_SAVE = {
  xp: 0,
  level: 1,
  completedMaps: [],
  roster: [
    { id: 'physician', name: 'Physician', level: 1, desc: 'High Diagnosis, medium Charm' },
    { id: 'barber', name: 'Barber-Surgeon', level: 1, desc: 'High Hands-on, low Theory' },
    { id: 'apothecary', name: 'Apothecary', level: 1, desc: 'Blends potions, good Knowledge' }
  ],
  settings: {
    goreEnabled: false
  }
};

const MAPS = [
  { id: 'ancient', title: 'Ancient & Classical Medicine', desc: 'Egyptians, Greeks & Romans — humours, Hippocrates, Galen', tags: ['dissection','theory'], questions: [
    { q: 'Which theory dominated Greek and Roman medicine?', a: 'Four Humours', choices: ['Miasma', 'Four Humours', 'Germ Theory', 'Vitalism'] },
    { q: 'Who is known as the "Father of Medicine"?', a: 'Hippocrates', choices: ['Galen', 'Hippocrates', 'Avicenna', 'Galenus'] }
  ]},
  { id: 'medieval', title: 'Medieval Medicine', desc: 'Monastic medicine, Arabic contributions, Black Death', tags: ['plague','texts'], questions: [
    { q: 'Which group preserved medical texts in the Middle Ages?', a: 'Monasteries', choices: ['Guilds', 'Monasteries', 'Universities', 'Hospitals'] },
    { q: 'Name a major medieval medical textbook author.', a: 'Avicenna', choices: ['Pare', 'Avicenna', 'Lister', 'Hippocrates'] }
  ]},
  { id: 'renaissance', title: 'Renaissance & Early Modern', desc: 'Vesalius, Harvey, anatomical revolution', tags: ['dissection','anatomy'], questions: [
    { q: 'Who produced the famous anatomical drawings in De humani corporis fabrica?', a: 'Vesalius', choices: ['Vesalius', 'Harvey', 'Galen', 'Pare'] },
    { q: 'Which discovery explained blood circulation?', a: 'Harvey\'s circulation', choices: ['Miasma', 'Harvey\'s circulation', 'Humours', 'Vaccination'] }
  ]},
  { id: 'industrial', title: 'Industrial Age & Public Health', desc: 'Sanitation, germ theory, hospitals', tags: ['public-health','nursing'], questions: [
    { q: 'Who linked cholera to contaminated water?', a: 'John Snow', choices: ['John Snow', 'Florence Nightingale', 'Pasteur', 'Lister'] },
    { q: 'What improved hospitals and nursing standards?', a: 'Nightingale\'s reforms', choices: ['Germ Theory', 'Nightingale\'s reforms', 'X-rays', 'Pharmacy'] }
  ]},
  { id: 'modern', title: 'Modern Medicine', desc: 'Antibiotics, immunization, modern surgery', tags: ['antibiotics','surgery'], questions: [
    { q: 'Which discovery revolutionized infection treatment?', a: 'Antibiotics', choices: ['Antibiotics', 'Humours', 'Bloodletting', 'Leeches'] },
    { q: 'Which technique became widespread in 20th-century surgery?', a: 'Anesthesia and antisepsis', choices: ['Astrology', 'Anesthesia and antisepsis', 'Miasma theory', 'Herbalism'] }
  ]},
];

let save;

function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return deepCopy(DEFAULT_SAVE);
    const obj = JSON.parse(raw);
    // keep old saves compatible by merging keys
    save = Object.assign(deepCopy(DEFAULT_SAVE), obj);
    return save;
  }catch(e){
    console.warn("Failed to load save:", e);
    return deepCopy(DEFAULT_SAVE);
  }
}

function saveGame(){
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  updateStatus();
}

function deepCopy(o){ return JSON.parse(JSON.stringify(o)); }

function updateStatus(){
  document.getElementById('xp').textContent = `XP: ${save.xp}`;
  document.getElementById('level').textContent = `Level: ${save.level}`;
  document.getElementById('gore-toggle').checked = !!save.settings.goreEnabled;
}

function init(){
  save = loadSave();
  renderMaps();
  renderRoster();
  updateStatus();
  wireUI();
}

function wireUI(){
  document.getElementById('open-roster').addEventListener('click', ()=>togglePanel('roster-area', true));
  document.getElementById('close-roster').addEventListener('click', ()=>togglePanel('roster-area', false));
  document.getElementById('open-settings').addEventListener('click', ()=>togglePanel('settings-area', true));
  document.getElementById('close-settings').addEventListener('click', ()=>togglePanel('settings-area', false));
  document.getElementById('close-challenge').addEventListener('click', closeChallenge);
  document.getElementById('start-first').addEventListener('click', ()=>startMap(MAPS[0]));
  document.getElementById('gore-toggle').addEventListener('change', (e)=>{
    save.settings.goreEnabled = e.target.checked;
    saveGame();
  });
}

function togglePanel(id, show){
  const el = document.getElementById(id);
  if(show){
    el.classList.remove('hidden');
    el.setAttribute('aria-hidden','false');
  } else {
    el.classList.add('hidden');
    el.setAttribute('aria-hidden','true');
  }
}

function renderMaps(){
  const grid = document.getElementById('maps-grid');
  grid.innerHTML = '';
  MAPS.forEach((map, index) => {
    const prevCompleted = index === 0 ? true : save.completedMaps.includes(MAPS[index-1].id);
    const unlocked = prevCompleted || save.completedMaps.includes(map.id);
    const card = document.createElement('div');
    card.className = 'map-card' + (unlocked ? '' : ' locked');
    card.innerHTML = `
      <div class="map-title">${map.title}</div>
      <div class="map-desc">${map.desc}</div>
      <div class="map-actions">
        <button data-map="${map.id}" ${unlocked ? '' : 'disabled'}>Enter</button>
        <small style="color:var(--muted)">${unlocked ? 'Unlocked' : 'Locked'}</small>
      </div>
    `;
    grid.appendChild(card);
    const btn = card.querySelector('button');
    if(unlocked){
      btn.addEventListener('click', ()=>startMap(map));
    }
  });
}

function renderRoster(){
  const rlist = document.getElementById('roster-list');
  rlist.innerHTML = '';
  save.roster.forEach(member => {
    const el = document.createElement('div');
    el.className = 'roster-item';
    el.innerHTML = `<div><strong>${member.name}</strong><div class="roster-stats">${member.desc}</div></div><div style="margin-left:auto"><small>Lv ${member.level}</small></div>`;
    rlist.appendChild(el);
  });
}

function startMap(map){
  // Provide story flavor and pick a question
  const story = generateStoryHook(map);
  const question = map.questions[Math.floor(Math.random() * map.questions.length)];
  const isDissectionScene = (map.tags && map.tags.includes('dissection')) || (question.q.toLowerCase().includes('anatomy'));
  openChallenge(map.title, story + "\n\n" + question.q, question, (correct)=>{
    if(correct){
      save.xp += 30;
      // Level up every 100 XP
      while(save.xp >= save.level * 100){
        save.level += 1;
        const idx = Math.floor(Math.random() * save.roster.length);
        save.roster[idx].level += 1;
      }
      if(!save.completedMaps.includes(map.id)){
        save.completedMaps.push(map.id);
      }
      saveGame();
      renderMaps();
      renderRoster();
    } else {
      save.xp += 5;
      saveGame();
    }
  }, { goreScene: isDissectionScene });
}

function generateStoryHook(map){
  // Non-graphic story hooks with era atmosphere — if dissection tag present, warn about realism when gore on.
  if(map.tags && map.tags.includes('dissection')){
    return `${map.title} — you arrive at an anatomy theatre where scholars debate the body. Expect historically-accurate views including surgical scenes.`;
  }
  if(map.tags && map.tags.includes('plague')){
    return `${map.title} — the city is tense. Your decisions will affect public health and survival.`;
  }
  return `Quest: Journey through ${map.title}. Complete the challenge to earn XP and unlock the next map.`;
}

function openChallenge(title, story, question, callback, opts = {}){
  document.getElementById('challenge-area').classList.remove('hidden');
  document.getElementById('challenge-area').setAttribute('aria-hidden','false');
  document.getElementById('challenge-title').textContent = title;
  document.getElementById('challenge-text').textContent = story;
  const choicesEl = document.getElementById('challenge-choices');
  choicesEl.innerHTML = '';

  // If this scene is a 'gore' relevant one and gore is enabled, show overlay briefly
  if(opts.goreScene && save.settings.goreEnabled){
    showBloodOverlay(2500);
  }

  shuffleArray(question.choices).forEach(choice => {
    const c = document.createElement('div');
    c.className = 'choice';
    c.textContent = choice;
    c.addEventListener('click', () => {
      Array.from(choicesEl.children).forEach(ch => ch.style.pointerEvents = 'none');
      if(choice === question.a){
        c.classList.add('correct');
        document.getElementById('challenge-feedback').textContent = 'Correct! +30 XP';
        setTimeout(()=>{ callback(true); }, 450);
      } else {
        c.classList.add('wrong');
        document.getElementById('challenge-feedback').textContent = `Not quite — correct: ${question.a}. +5 XP`;
        setTimeout(()=>{ callback(false); }, 650);
      }
    });
    choicesEl.appendChild(c);
  });
}

function closeChallenge(){
  document.getElementById('challenge-area').classList.add('hidden');
  document.getElementById('challenge-area').setAttribute('aria-hidden','true');
  document.getElementById('challenge-feedback').textContent = '';
}

function showBloodOverlay(duration = 2000){
  const overlay = document.getElementById('blood-overlay');
  overlay.innerHTML = '<div class="blood-spray" aria-hidden="true"></div>';
  overlay.classList.add('show');
  setTimeout(()=>{ overlay.classList.remove('show'); overlay.innerHTML = ''; }, duration);
}

function shuffleArray(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// First-run seed
if(!localStorage.getItem(SAVE_KEY)){
  localStorage.setItem(SAVE_KEY, JSON.stringify(DEFAULT_SAVE));
}
init();

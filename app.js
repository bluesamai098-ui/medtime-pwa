// Simple PWA game scaffold: MedTime - maps unlock after completion.
// Data model maps to Edexcel "Medicine through time" units.
// Local-progress saved in localStorage under "medtime_save_v1".

const DEFAULT_SAVE = {
  xp: 0,
  level: 1,
  completedMaps: [],
  roster: [
    { id: 'physician', name: 'Physician', level: 1, desc: 'High Diagnosis, medium Charm' },
    { id: 'barber', name: 'Barber-Surgeon', level: 1, desc: 'High Hands-on, low Theory' },
    { id: 'apothecary', name: 'Apothecary', level: 1, desc: 'Blends potions, good Knowledge' }
  ]
};

const MAPS = [
  { id: 'ancient', title: 'Ancient & Classical Medicine', desc: 'Egyptians, Greeks & Romans — humours, Hippocrates, Galen', questions: [
    { q: 'Which theory dominated Greek and Roman medicine?', a: 'Four Humours', choices: ['Miasma', 'Four Humours', 'Germ Theory', 'Vitalism'] },
    { q: 'Who is known as the "Father of Medicine"?', a: 'Hippocrates', choices: ['Galen', 'Hippocrates', 'Avicenna', 'Galenus'] }
  ]},
  { id: 'medieval', title: 'Medieval Medicine', desc: 'Monastic medicine, Arabic contributions, Black Death', questions: [
    { q: 'Which group preserved medical texts in the Middle Ages?', a: 'Monasteries', choices: ['Guilds', 'Monasteries', 'Universities', 'Hospitals'] },
    { q: 'Name a major medieval medical textbook author.', a: 'Avicenna', choices: ['Pare', 'Avicenna', 'Lister', 'Hippocrates'] }
  ]},
  { id: 'renaissance', title: 'The Renaissance & Early Modern', desc: 'Vesalius, Harvey, anatomical revolution', questions: [
    { q: 'Who produced the famous anatomical drawings in De humani corporis fabrica?', a: 'Vesalius', choices: ['Vesalius', 'Harvey', 'Galen', 'Pare'] },
    { q: 'Which discovery explained blood circulation?', a: 'Harvey\'s circulation', choices: ['Miasma', 'Harvey\'s circulation', 'Humours', 'Vaccination'] }
  ]},
  { id: 'industrial', title: 'Industrial Age & Public Health', desc: 'Sanitation, germ theory, hospitals', questions: [
    { q: 'Who linked cholera to contaminated water?', a: 'John Snow', choices: ['John Snow', 'Florence Nightingale', 'Pasteur', 'Lister'] },
    { q: 'What improved hospitals and nursing standards?', a: 'Nightingale\'s reforms', choices: ['Germ Theory', 'Nightingale\'s reforms', 'X-rays', 'Pharmacy'] }
  ]},
  { id: 'modern', title: 'Modern Medicine', desc: 'Antibiotics, immunization, modern surgery', questions: [
    { q: 'Which discovery revolutionized infection treatment?', a: 'Antibiotics', choices: ['Antibiotics', 'Humours', 'Bloodletting', 'Leeches'] },
    { q: 'Which technique became widespread in 20th-century surgery?', a: 'Anesthesia and antisepsis', choices: ['Astrology', 'Anesthesia and antisepsis', 'Miasma theory', 'Herbalism'] }
  ]},
];

const SAVE_KEY = "medtime_save_v1";
let save = loadSave();

function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE));
    return JSON.parse(raw);
  }catch(e){
    console.warn("Failed to load save:", e);
    return JSON.parse(JSON.stringify(DEFAULT_SAVE));
  }
}

function saveGame(){
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  updateStatus();
}

function updateStatus(){
  document.getElementById('xp').textContent = `XP: ${save.xp}`;
  document.getElementById('level').textContent = `Level: ${save.level}`;
}

function init(){
  renderMaps();
  renderRoster();
  updateStatus();

  document.getElementById('open-roster').addEventListener('click', ()=>document.getElementById('roster-area').classList.remove('hidden'));
  document.getElementById('close-roster').addEventListener('click', ()=>document.getElementById('roster-area').classList.add('hidden'));
  document.getElementById('close-challenge').addEventListener('click', closeChallenge);
}

function renderMaps(){
  const grid = document.getElementById('maps-grid');
  grid.innerHTML = '';
  MAPS.forEach((map, index) => {
    const unlocked = index === 0 || save.completedMaps.includes(MAPS[index-1].id) || save.completedMaps.includes(map.id);
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
  // Present a short story hook based on map and then a challenge (quiz)
  const title = map.title;
  const story = `Quest: Journey through ${title}. Complete the challenge to earn XP and unlock the next map.`;
  const question = map.questions[Math.floor(Math.random() * map.questions.length)];
  openChallenge(title, story, question, (correct) => {
    if(correct){
      save.xp += 30;
      // Level up every 100 XP
      if(save.xp >= save.level * 100){
        save.level += 1;
        // reward roster: randomly level up a roster member
        const idx = Math.floor(Math.random() * save.roster.length);
        save.roster[idx].level += 1;
      }
      // mark map completed and unlock next map
      if(!save.completedMaps.includes(map.id)){
        save.completedMaps.push(map.id);
      }
      saveGame();
      renderMaps();
      renderRoster();
    } else {
      save.xp += 5; // consolation XP
      saveGame();
    }
  });
}

function openChallenge(title, story, question, callback){
  document.getElementById('challenge-area').classList.remove('hidden');
  document.getElementById('challenge-title').textContent = title;
  document.getElementById('challenge-text').textContent = story + '\n\n' + question.q;
  const choicesEl = document.getElementById('challenge-choices');
  choicesEl.innerHTML = '';
  shuffleArray(question.choices).forEach(choice => {
    const c = document.createElement('div');
    c.className = 'choice';
    c.textContent = choice;
    c.addEventListener('click', () => {
      // disable other choices
      Array.from(choicesEl.children).forEach(ch => ch.style.pointerEvents = 'none');
      if(choice === question.a){
        c.classList.add('correct');
        document.getElementById('challenge-feedback').textContent = 'Correct! +30 XP';
        callback(true);
      } else {
        c.classList.add('wrong');
        document.getElementById('challenge-feedback').textContent = `Not quite — correct answer: ${question.a}. +5 XP`;
        callback(false);
      }
    });
    choicesEl.appendChild(c);
  });
}

function closeChallenge(){
  document.getElementById('challenge-area').classList.add('hidden');
  document.getElementById('challenge-feedback').textContent = '';
}

function shuffleArray(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Simple first-run seed and save
if(!localStorage.getItem(SAVE_KEY)){
  localStorage.setItem(SAVE_KEY, JSON.stringify(DEFAULT_SAVE));
}
init();

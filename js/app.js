const appState = {
  soundEnabled: true,
  scores: JSON.parse(localStorage.getItem('renaudGamesScores') || '{"crossword":0,"snakeBest":0,"zombieBest":0,"total":0}')
};

function saveScores(){
  localStorage.setItem('renaudGamesScores', JSON.stringify(appState.scores));
  renderStats();
}

function renderStats(){
  const map = {
    statCross: appState.scores.crossword || 0,
    statSnake: appState.scores.snakeBest || 0,
    statZombie: appState.scores.zombieBest || 0,
    statTotal: appState.scores.total || 0
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  });
}

function resetScores(){
  if(!confirm('Réinitialiser tous les scores ?')) return;
  appState.scores = {crossword:0,snakeBest:0,zombieBest:0,total:0};
  saveScores();
  if(typeof renderSnakeHud === 'function') renderSnakeHud();
  if(typeof renderZombieHud === 'function') renderZombieHud();
}

function toggleSound(){
  appState.soundEnabled = !appState.soundEnabled;
  const label = document.getElementById('soundLabel');
  if(label) label.textContent = appState.soundEnabled ? '🔊 Son activé' : '🔇 Son coupé';
}

function beep(freq=440,duration=0.06,type='sine',gain=0.02){
  if(!appState.soundEnabled) return;
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g); g.connect(ctx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  }catch(e){}
}

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
});

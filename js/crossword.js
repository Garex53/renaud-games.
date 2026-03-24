const crosswordState = { puzzle:null, cells:[], selectedWordIndex:0, score:0, solved:false };

const crosswordBank = {
  informatique: {
    facile: [
      {title:'Infos facile A', size:8, words:[
        {answer:'SOURIS', clue:'Périphérique pour cliquer', row:0, col:1, dir:'across'},
        {answer:'USB', clue:'Type de port courant', row:2, col:0, dir:'down'},
        {answer:'WEB', clue:'Réseau de pages', row:4, col:2, dir:'across'},
        {answer:'MAIL', clue:'Message électronique', row:1, col:5, dir:'down'},
        {answer:'PIXEL', clue:'Plus petite unité d’une image numérique', row:6, col:1, dir:'across'}
      ]},
      {title:'Infos facile B', size:8, words:[
        {answer:'ECRAN', clue:'Affiche l’image de l’ordinateur', row:0, col:0, dir:'across'},
        {answer:'WIFI', clue:'Connexion sans fil', row:0, col:2, dir:'down'},
        {answer:'CLIC', clue:'Action de souris', row:3, col:3, dir:'across'},
        {answer:'CODE', clue:'Texte qu’un développeur écrit', row:1, col:6, dir:'down'},
        {answer:'JEU', clue:'Application ludique', row:6, col:4, dir:'across'}
      ]},
      {title:'Infos facile C', size:8, words:[
        {answer:'CLAVIER', clue:'Périphérique pour écrire', row:0, col:0, dir:'across'},
        {answer:'APP', clue:'Application', row:1, col:2, dir:'down'},
        {answer:'BUG', clue:'Erreur dans un programme', row:4, col:1, dir:'across'},
        {answer:'RAM', clue:'Mémoire vive', row:2, col:6, dir:'down'},
        {answer:'SITE', clue:'Page ou ensemble de pages web', row:6, col:2, dir:'across'}
      ]}
    ],
    moyen: [
      {title:'Infos moyen A', size:10, words:[
        {answer:'SERVEUR', clue:'Machine qui héberge des données', row:0, col:0, dir:'across'},
        {answer:'HTML', clue:'Langage de structure du web', row:0, col:2, dir:'down'},
        {answer:'CSS', clue:'Langage de style web', row:2, col:4, dir:'across'},
        {answer:'API', clue:'Interface pour communiquer avec un service', row:1, col:7, dir:'down'},
        {answer:'CACHE', clue:'Mémoire temporaire', row:5, col:1, dir:'across'}
      ]},
      {title:'Infos moyen B', size:10, words:[
        {answer:'LOGICIEL', clue:'Programme installé sur un ordinateur', row:0, col:1, dir:'across'},
        {answer:'LINUX', clue:'Système libre', row:0, col:4, dir:'down'},
        {answer:'RESEAU', clue:'Ensemble d’appareils connectés', row:3, col:0, dir:'across'},
        {answer:'GPU', clue:'Processeur graphique', row:1, col:8, dir:'down'},
        {answer:'PORT', clue:'Canal de communication', row:6, col:2, dir:'across'}
      ]}
    ],
    difficile: [
      {title:'Infos difficile A', size:12, words:[
        {answer:'ALGORITHME', clue:'Suite d’étapes pour résoudre un problème', row:0, col:1, dir:'across'},
        {answer:'PYTHON', clue:'Langage très utilisé', row:0, col:4, dir:'down'},
        {answer:'VARIABLE', clue:'Zone mémoire nommée', row:3, col:0, dir:'across'},
        {answer:'SQL', clue:'Langage de base de données', row:2, col:9, dir:'down'},
        {answer:'PATCH', clue:'Mise à jour corrective', row:8, col:2, dir:'across'}
      ]}
    ]
  },
  culture: {
    facile: [
      {title:'Culture facile A', size:8, words:[
        {answer:'PARIS', clue:'Capitale de la France', row:0, col:1, dir:'across'},
        {answer:'ART', clue:'Peinture, musique, sculpture…', row:0, col:3, dir:'down'},
        {answer:'LUNE', clue:'Satellite naturel de la Terre', row:3, col:2, dir:'across'},
        {answer:'MER', clue:'Grande étendue d’eau salée', row:1, col:6, dir:'down'},
        {answer:'ROME', clue:'Capitale de l’Italie', row:6, col:1, dir:'across'}
      ]}
    ],
    moyen: [
      {title:'Culture moyen A', size:10, words:[
        {answer:'EVEREST', clue:'Plus haut sommet du monde', row:0, col:0, dir:'across'},
        {answer:'JAPON', clue:'Pays de Tokyo', row:0, col:3, dir:'down'},
        {answer:'NIL', clue:'Long fleuve africain', row:3, col:1, dir:'across'},
        {answer:'ORION', clue:'Constellation célèbre', row:2, col:7, dir:'down'},
        {answer:'THEATRE', clue:'Art de la scène', row:6, col:0, dir:'across'}
      ]}
    ],
    difficile: [
      {title:'Culture difficile A', size:12, words:[
        {answer:'ASTRONOMIE', clue:'Science des astres', row:0, col:1, dir:'across'},
        {answer:'GALILEE', clue:'Savant italien', row:0, col:5, dir:'down'},
        {answer:'HISTOIRE', clue:'Étude du passé', row:4, col:0, dir:'across'},
        {answer:'OPERA', clue:'Art lyrique', row:3, col:9, dir:'down'},
        {answer:'SCULPTURE', clue:'Art de modeler la matière', row:8, col:1, dir:'across'}
      ]}
    ]
  },
  cinema: {
    facile: [
      {title:'Cinéma facile A', size:8, words:[
        {answer:'FILM', clue:'Œuvre projetée au cinéma', row:0, col:1, dir:'across'},
        {answer:'SON', clue:'Partie audio', row:0, col:3, dir:'down'},
        {answer:'ACTEUR', clue:'Personne qui joue un rôle', row:3, col:1, dir:'across'},
        {answer:'STAR', clue:'Vedette', row:6, col:2, dir:'across'}
      ]}
    ],
    moyen: [
      {title:'Cinéma moyen A', size:10, words:[
        {answer:'MONTAGE', clue:'Assemblage des plans', row:0, col:1, dir:'across'},
        {answer:'TRAILER', clue:'Bande-annonce', row:0, col:4, dir:'down'},
        {answer:'PLATEAU', clue:'Lieu de tournage', row:3, col:0, dir:'across'},
        {answer:'IMAX', clue:'Format de salle géante', row:2, col:8, dir:'down'},
        {answer:'COMEDIE', clue:'Genre drôle', row:6, col:1, dir:'across'}
      ]}
    ],
    difficile: [
      {title:'Cinéma difficile A', size:12, words:[
        {answer:'DOCUMENTAIRE', clue:'Film basé sur le réel', row:0, col:0, dir:'across'},
        {answer:'NOLAN', clue:'Réalisateur d’Inception', row:0, col:5, dir:'down'},
        {answer:'FOLEY', clue:'Bruitage de cinéma', row:3, col:8, dir:'down'},
        {answer:'PANORAMIQUE', clue:'Mouvement de caméra horizontal', row:7, col:0, dir:'across'}
      ]}
    ]
  }
};

function clonePuzzle(p){ return JSON.parse(JSON.stringify(p)); }
function sanitize(str){ return (str || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,''); }

function tryBuildPuzzle(sourcePuzzle, chosenSize){
  const puzzle = clonePuzzle(sourcePuzzle);
  const size = chosenSize;
  const grid = Array.from({length:size}, () => Array.from({length:size}, () => null));
  let num = 1;
  for(let i=0;i<puzzle.words.length;i++){
    const w = puzzle.words[i];
    const answer = sanitize(w.answer);
    w.answer = answer;
    w.cells = [];
    w.number = num++;
    const len = answer.length;
    if(w.row >= size || w.col >= size) return null;
    if(w.dir === 'across' && w.col + len > size) return null;
    if(w.dir === 'down' && w.row + len > size) return null;
    for(let j=0;j<len;j++){
      const r = w.row + (w.dir === 'down' ? j : 0);
      const c = w.col + (w.dir === 'across' ? j : 0);
      const existing = grid[r][c];
      if(existing && existing !== answer[j]) return null;
      grid[r][c] = answer[j];
      w.cells.push({r,c});
    }
  }
  puzzle.size = size;
  puzzle.solution = grid;
  return puzzle;
}

function pickPuzzle(category, difficulty, chosenSize){
  const list = crosswordBank[category][difficulty]
    .filter(p => p.size <= chosenSize)
    .map(p => tryBuildPuzzle(p, chosenSize))
    .filter(Boolean);
  if(!list.length) return null;
  return list[Math.floor(Math.random()*list.length)];
}

function generateCrossword(){
  const category = document.getElementById('cwCategory').value;
  const difficulty = document.getElementById('cwDifficulty').value;
  const chosenSize = Number(document.getElementById('cwSize').value);
  const puzzle = pickPuzzle(category, difficulty, chosenSize);
  if(!puzzle){
    document.getElementById('cwFeedback').innerHTML = '<span class="bad">Impossible de générer une grille avec ces paramètres.</span>';
    return;
  }
  crosswordState.puzzle = puzzle;
  crosswordState.cells = [];
  crosswordState.selectedWordIndex = 0;
  crosswordState.score = 0;
  crosswordState.solved = false;
  renderCrossword();
  updateCrosswordProgress();
  document.getElementById('cwFeedback').innerHTML = '<span class="good">Nouvelle grille générée.</span>';
}

function renderCrossword(){
  const puzzle = crosswordState.puzzle;
  const gridEl = document.getElementById('cwGrid');
  const cluesEl = document.getElementById('cwClues');
  gridEl.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;
  gridEl.innerHTML = '';
  cluesEl.innerHTML = '';
  crosswordState.cells = Array.from({length:puzzle.size},()=>Array.from({length:puzzle.size},()=>null));

  const numberMap = {};
  puzzle.words.forEach((w)=>{ numberMap[`${w.row}-${w.col}`] = w.number; });

  for(let r=0;r<puzzle.size;r++){
    for(let c=0;c<puzzle.size;c++){
      const solutionChar = puzzle.solution[r][c];
      const wrap = document.createElement('div');
      wrap.className = 'cw-cell-wrap';
      if(solutionChar){
        const input = document.createElement('input');
        input.maxLength = 1;
        input.className = 'cw-cell';
        input.addEventListener('input', (e)=>{
          e.target.value = sanitize(e.target.value).slice(0,1);
          if(e.target.value) moveToNextCell(r,c);
          updateCrosswordProgress();
        });
        input.addEventListener('keydown', (e)=>{
          const key = e.key;
          if(key === 'ArrowUp') focusCell(r-1,c);
          else if(key === 'ArrowDown') focusCell(r+1,c);
          else if(key === 'ArrowLeft') focusCell(r,c-1);
          else if(key === 'ArrowRight') focusCell(r,c+1);
        });
        wrap.appendChild(input);
        crosswordState.cells[r][c] = input;
        if(numberMap[`${r}-${c}`]){
          const num = document.createElement('span');
          num.className = 'cw-number';
          num.textContent = numberMap[`${r}-${c}`];
          wrap.appendChild(num);
        }
      }else{
        const block = document.createElement('div');
        block.className = 'cw-block';
        wrap.appendChild(block);
      }
      gridEl.appendChild(wrap);
    }
  }

  const info = document.createElement('div');
  info.className='note';
  info.style.marginBottom='12px';
  info.textContent = `Grille : ${puzzle.title} — ${puzzle.size}x${puzzle.size}`;
  cluesEl.appendChild(info);

  ['across','down'].forEach(dir => {
    const title = dir === 'across' ? 'Horizontal' : 'Vertical';
    const group = document.createElement('div');
    group.className = 'clue-group';
    group.innerHTML = `<h3 style="margin-bottom:10px;">${title}</h3>`;
    puzzle.words.filter(w => w.dir === dir).forEach((w, idx) => {
      const div = document.createElement('div');
      div.className = 'clue-item';
      div.innerHTML = `<strong>${w.number}.</strong> ${w.clue} <span class="small">(${w.answer.length} lettres)</span>`;
      div.onclick = () => focusWord(puzzle.words.indexOf(w));
      group.appendChild(div);
    });
    cluesEl.appendChild(group);
  });
  focusWord(0);
}

function focusWord(index){
  const word = crosswordState.puzzle.words[index];
  crosswordState.selectedWordIndex = index;
  if(word) focusCell(word.cells[0].r, word.cells[0].c);
}
function focusCell(r,c){ const cell = crosswordState.cells?.[r]?.[c]; if(cell){ cell.focus(); cell.select(); } }
function moveToNextCell(r,c){
  const word = crosswordState.puzzle.words[crosswordState.selectedWordIndex];
  if(word){
    const idx = word.cells.findIndex(pos => pos.r === r && pos.c === c);
    if(idx >= 0 && idx < word.cells.length - 1){
      focusCell(word.cells[idx+1].r, word.cells[idx+1].c); return;
    }
  }
}

function getCrosswordFilledCount(){
  const puzzle = crosswordState.puzzle;
  let total=0, filled=0;
  for(let r=0;r<puzzle.size;r++) for(let c=0;c<puzzle.size;c++) if(puzzle.solution[r][c]){ total++; if(crosswordState.cells[r][c].value) filled++; }
  return {total, filled};
}
function updateCrosswordProgress(){
  const puzzle = crosswordState.puzzle; if(!puzzle) return;
  const {total, filled} = getCrosswordFilledCount();
  const percent = total ? Math.round((filled / total) * 100) : 0;
  document.getElementById('cwProgressLabel').textContent = percent + '%';
  document.getElementById('cwProgressBar').style.width = percent + '%';
  document.getElementById('cwGridScore').textContent = crosswordState.score;
}
function clearCellStyles(){
  const puzzle = crosswordState.puzzle; if(!puzzle) return;
  for(let r=0;r<puzzle.size;r++) for(let c=0;c<puzzle.size;c++){ const cell = crosswordState.cells[r][c]; if(cell) cell.classList.remove('correct','wrong','hint','reveal'); }
}
function checkCrossword(){
  const puzzle = crosswordState.puzzle; if(!puzzle) return;
  let wrong = 0, complete = true; clearCellStyles();
  for(let r=0;r<puzzle.size;r++) for(let c=0;c<puzzle.size;c++){
    const sol = puzzle.solution[r][c]; const cell = crosswordState.cells[r][c];
    if(sol && cell){
      const val = sanitize(cell.value);
      if(!val) complete = false;
      if(val === sol) cell.classList.add('correct');
      else { if(val) cell.classList.add('wrong'); wrong++; complete = false; }
    }
  }
  if(complete && wrong === 0){
    if(!crosswordState.solved){
      crosswordState.solved = true;
      const bonus = 100 + Math.max(0, 60 - crosswordState.score);
      crosswordState.score += bonus;
      appState.scores.crossword += 1;
      appState.scores.total += crosswordState.score;
      saveScores();
    }
    document.getElementById('cwFeedback').innerHTML = `<span class="good">Bravo, grille terminée ! +${crosswordState.score} points</span>`;
    beep(700, 0.12, 'triangle', 0.03);
  }else{
    document.getElementById('cwFeedback').innerHTML = `<span class="warnText">Il reste ${wrong} erreur(s) ou des cases vides.</span>`;
    beep(220, 0.07, 'square', 0.015);
  }
  updateCrosswordProgress();
}
function giveLetterHint(){
  const puzzle = crosswordState.puzzle; if(!puzzle || crosswordState.solved) return;
  const empties=[];
  for(let r=0;r<puzzle.size;r++) for(let c=0;c<puzzle.size;c++) if(puzzle.solution[r][c] && sanitize(crosswordState.cells[r][c].value) !== puzzle.solution[r][c]) empties.push({r,c});
  if(!empties.length) return;
  const pick = empties[Math.floor(Math.random()*empties.length)];
  crosswordState.cells[pick.r][pick.c].value = puzzle.solution[pick.r][pick.c];
  crosswordState.cells[pick.r][pick.c].classList.add('hint');
  crosswordState.score = Math.max(0, crosswordState.score - 4);
  updateCrosswordProgress();
}
function revealWord(){
  const puzzle = crosswordState.puzzle; if(!puzzle || crosswordState.solved) return;
  const remainingWords = puzzle.words.filter(w => w.cells.some(pos => sanitize(crosswordState.cells[pos.r][pos.c].value) !== puzzle.solution[pos.r][pos.c]));
  if(!remainingWords.length) return;
  const word = remainingWords[Math.floor(Math.random()*remainingWords.length)];
  word.cells.forEach(pos => { crosswordState.cells[pos.r][pos.c].value = puzzle.solution[pos.r][pos.c]; crosswordState.cells[pos.r][pos.c].classList.add('reveal'); });
  crosswordState.score = Math.max(0, crosswordState.score - 12);
  updateCrosswordProgress();
}
function clearWrongCells(){
  const puzzle = crosswordState.puzzle; if(!puzzle) return;
  for(let r=0;r<puzzle.size;r++) for(let c=0;c<puzzle.size;c++){
    const sol = puzzle.solution[r][c]; const cell = crosswordState.cells[r][c];
    if(sol && cell && cell.value && sanitize(cell.value) !== sol) cell.value='';
    if(cell) cell.classList.remove('wrong');
  }
  updateCrosswordProgress();
}

document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('cwGrid')) generateCrossword();
});

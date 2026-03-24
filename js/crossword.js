function generateCrossword(){
  const category = document.getElementById('cwCategory').value;
  const difficulty = document.getElementById('cwDifficulty').value;
  const chosenSize = Number(document.getElementById('cwSize').value);

  const puzzle = pickPuzzle(category, difficulty, chosenSize);

  if(!puzzle){
    document.getElementById('cwGrid').innerHTML = '';
    document.getElementById('cwClues').innerHTML = '';
    document.getElementById('cwFeedback').innerHTML =
      '<span class="bad">Aucune vraie grille disponible pour cette catégorie, difficulté et taille.</span>';
    document.getElementById('cwProgressLabel').textContent = '0%';
    document.getElementById('cwProgressBar').style.width = '0%';
    document.getElementById('cwGridScore').textContent = '0';
    return;
  }

  crosswordState.puzzle = puzzle;
  crosswordState.cells = [];
  crosswordState.selectedWordIndex = 0;
  crosswordState.score = 0;
  crosswordState.solved = false;

  renderCrossword();
  updateCrosswordProgress();

  document.getElementById('cwFeedback').innerHTML =
    `<span class="good">Nouvelle grille générée en ${puzzle.size}x${puzzle.size}.</span>`;
}

function clonePuzzle(p) {
  return JSON.parse(JSON.stringify(p));
}

function sanitize(str) {
  return (str || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '');
}

function tryBuildPuzzle(sourcePuzzle, chosenSize) {
  const puzzle = clonePuzzle(sourcePuzzle);
  const size = chosenSize;
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

  for (let i = 0; i < puzzle.words.length; i++) {
    const w = puzzle.words[i];
    const answer = sanitize(w.answer);
    const len = answer.length;

    w.answer = answer;
    w.cells = [];

    if (w.row >= size || w.col >= size) return null;
    if (w.dir === 'across' && w.col + len > size) return null;
    if (w.dir === 'down' && w.row + len > size) return null;

    for (let j = 0; j < len; j++) {
      const r = w.row + (w.dir === 'down' ? j : 0);
      const c = w.col + (w.dir === 'across' ? j : 0);
      const existing = grid[r][c];

      if (existing && existing !== answer[j]) return null;

      grid[r][c] = answer[j];
      w.cells.push({ r, c });
    }
  }

  let num = 1;
  const startMap = new Map();

  puzzle.words.forEach((w) => {
    const key = `${w.row}-${w.col}`;
    if (!startMap.has(key)) {
      startMap.set(key, num++);
    }
    w.number = startMap.get(key);
  });

  puzzle.size = size;
  puzzle.solution = grid;
  return puzzle;
}

function pickPuzzle(category, difficulty, chosenSize){
  const list = (crosswordBank[category]?.[difficulty] || [])
    .filter(p => p.size === chosenSize)
    .map(p => tryBuildPuzzle(p, p.size))
    .filter(Boolean);

  if(!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function generateCrossword(){
  const category = document.getElementById('cwCategory').value;
  const difficulty = document.getElementById('cwDifficulty').value;
  const chosenSize = Number(document.getElementById('cwSize').value);

  const puzzle = pickPuzzle(category, difficulty, chosenSize);

  if(!puzzle){
    document.getElementById('cwGrid').innerHTML = '';
    document.getElementById('cwClues').innerHTML = '';
    document.getElementById('cwFeedback').innerHTML =
      '<span class="bad">Aucune vraie grille disponible pour cette catégorie, difficulté et taille.</span>';
    document.getElementById('cwProgressLabel').textContent = '0%';
    document.getElementById('cwProgressBar').style.width = '0%';
    document.getElementById('cwGridScore').textContent = '0';
    return;
  }

  crosswordState.puzzle = puzzle;
  crosswordState.cells = [];
  crosswordState.selectedWordIndex = 0;
  crosswordState.score = 0;
  crosswordState.solved = false;

  renderCrossword();
  updateCrosswordProgress();

  document.getElementById('cwFeedback').innerHTML =
    `<span class="good">Nouvelle grille générée en ${puzzle.size}x${puzzle.size}.</span>`;
}

  crosswordState.puzzle = puzzle;
  crosswordState.cells = [];
  crosswordState.selectedWordIndex = 0;
  crosswordState.score = 0;
  crosswordState.solved = false;

  renderCrossword();
  updateCrosswordProgress();

  document.getElementById('cwFeedback').innerHTML =
    `<span class="good">Nouvelle grille générée en ${puzzle.size}x${puzzle.size}.</span>`;
}

function renderCrossword() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle) return;

  const gridEl = document.getElementById('cwGrid');
  const cluesEl = document.getElementById('cwClues');

  gridEl.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;
  gridEl.innerHTML = '';
  cluesEl.innerHTML = '';

  crosswordState.cells = Array.from({ length: puzzle.size }, () =>
    Array.from({ length: puzzle.size }, () => null)
  );

  const numberMap = {};
  puzzle.words.forEach((w) => {
    numberMap[`${w.row}-${w.col}`] = w.number;
  });

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const solutionChar = puzzle.solution[r][c];
      const wrap = document.createElement('div');
      wrap.className = 'cw-cell-wrap';

      if (solutionChar) {
        const input = document.createElement('input');
        input.maxLength = 1;
        input.className = 'cw-cell';
        input.dataset.r = r;
        input.dataset.c = c;

        input.addEventListener('input', (e) => {
          e.target.value = sanitize(e.target.value).slice(0, 1);
          if (e.target.value) moveToNextCell(r, c);
          updateCrosswordProgress();
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowUp') focusCell(r - 1, c);
          else if (e.key === 'ArrowDown') focusCell(r + 1, c);
          else if (e.key === 'ArrowLeft') focusCell(r, c - 1);
          else if (e.key === 'ArrowRight') focusCell(r, c + 1);
          else if (e.key === 'Backspace' && !e.target.value) moveToPreviousCell(r, c);
        });

        wrap.appendChild(input);
        crosswordState.cells[r][c] = input;

        if (numberMap[`${r}-${c}`]) {
          const num = document.createElement('span');
          num.className = 'cw-number';
          num.textContent = numberMap[`${r}-${c}`];
          wrap.appendChild(num);
        }
      } else {
        const block = document.createElement('div');
        block.className = 'cw-block';
        wrap.appendChild(block);
      }

      gridEl.appendChild(wrap);
    }
  }

  const info = document.createElement('div');
  info.className = 'note';
  info.style.marginBottom = '12px';
  info.textContent = `Grille : ${puzzle.title} — ${puzzle.size}x${puzzle.size}`;
  cluesEl.appendChild(info);

  ['across', 'down'].forEach((dir) => {
    const title = dir === 'across' ? 'Horizontal' : 'Vertical';
    const group = document.createElement('div');
    group.className = 'clue-group';
    group.innerHTML = `<h3 style="margin-bottom:10px;">${title}</h3>`;

    puzzle.words
      .filter((w) => w.dir === dir)
      .forEach((w) => {
        const div = document.createElement('div');
        div.className = 'clue-item';
        div.innerHTML = `<strong>${w.number}.</strong> ${w.clue} <span class="small">(${w.answer.length} lettres)</span>`;
        div.style.cursor = 'pointer';
        div.onclick = () => focusWord(puzzle.words.indexOf(w));
        group.appendChild(div);
      });

    cluesEl.appendChild(group);
  });

  focusWord(0);
}

function focusWord(index) {
  const word = crosswordState.puzzle?.words[index];
  crosswordState.selectedWordIndex = index;
  if (word && word.cells.length) {
    focusCell(word.cells[0].r, word.cells[0].c);
  }
}

function focusCell(r, c) {
  const cell = crosswordState.cells?.[r]?.[c];
  if (cell) {
    cell.focus();
    cell.select();
  }
}

function moveToNextCell(r, c) {
  const word = crosswordState.puzzle.words[crosswordState.selectedWordIndex];
  if (word) {
    const idx = word.cells.findIndex((pos) => pos.r === r && pos.c === c);
    if (idx >= 0 && idx < word.cells.length - 1) {
      focusCell(word.cells[idx + 1].r, word.cells[idx + 1].c);
      return;
    }
  }

  for (let i = r; i < crosswordState.cells.length; i++) {
    for (let j = i === r ? c + 1 : 0; j < crosswordState.cells[i].length; j++) {
      if (crosswordState.cells[i][j]) {
        focusCell(i, j);
        return;
      }
    }
  }
}

function moveToPreviousCell(r, c) {
  for (let i = r; i >= 0; i--) {
    for (let j = i === r ? c - 1 : crosswordState.cells[i].length - 1; j >= 0; j--) {
      if (crosswordState.cells[i][j]) {
        focusCell(i, j);
        return;
      }
    }
  }
}

function getCrosswordFilledCount() {
  const puzzle = crosswordState.puzzle;
  let total = 0;
  let filled = 0;

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (puzzle.solution[r][c]) {
        total++;
        if (crosswordState.cells[r][c] && crosswordState.cells[r][c].value) {
          filled++;
        }
      }
    }
  }

  return { total, filled };
}

function updateCrosswordProgress() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle) return;

  const { total, filled } = getCrosswordFilledCount();
  const percent = total ? Math.round((filled / total) * 100) : 0;

  document.getElementById('cwProgressLabel').textContent = percent + '%';
  document.getElementById('cwProgressBar').style.width = percent + '%';
  document.getElementById('cwGridScore').textContent = crosswordState.score;
}

function clearCellStyles() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle) return;

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const cell = crosswordState.cells[r][c];
      if (cell) {
        cell.classList.remove('correct', 'wrong', 'hint', 'reveal');
      }
    }
  }
}

function checkCrossword() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle) return;

  let wrong = 0;
  let complete = true;
  clearCellStyles();

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const sol = puzzle.solution[r][c];
      const cell = crosswordState.cells[r][c];

      if (sol && cell) {
        const val = sanitize(cell.value);

        if (!val) complete = false;

        if (val === sol) {
          cell.classList.add('correct');
        } else {
          if (val) cell.classList.add('wrong');
          wrong++;
          complete = false;
        }
      }
    }
  }

  if (complete && wrong === 0) {
    if (!crosswordState.solved) {
      crosswordState.solved = true;
      const bonus = 100 + Math.max(0, 60 - crosswordState.score);
      crosswordState.score += bonus;
      appState.scores.crossword += 1;
      appState.scores.total += crosswordState.score;
      saveScores();
    }

    document.getElementById('cwFeedback').innerHTML =
      `<span class="good">Bravo, grille terminée ! +${crosswordState.score} points</span>`;
    beep(700, 0.12, 'triangle', 0.03);
  } else {
    document.getElementById('cwFeedback').innerHTML =
      `<span class="warnText">Il reste ${wrong} erreur(s) ou des cases vides.</span>`;
    beep(220, 0.07, 'square', 0.015);
  }

  updateCrosswordProgress();
}

function giveLetterHint() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle || crosswordState.solved) return;

  const empties = [];

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (
        puzzle.solution[r][c] &&
        sanitize(crosswordState.cells[r][c].value) !== puzzle.solution[r][c]
      ) {
        empties.push({ r, c });
      }
    }
  }

  if (!empties.length) return;

  const pick = empties[Math.floor(Math.random() * empties.length)];
  crosswordState.cells[pick.r][pick.c].value = puzzle.solution[pick.r][pick.c];
  crosswordState.cells[pick.r][pick.c].classList.add('hint');
  crosswordState.score = Math.max(0, crosswordState.score - 4);
  updateCrosswordProgress();
}

function revealWord() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle || crosswordState.solved) return;

  const remainingWords = puzzle.words.filter((w) =>
    w.cells.some((pos) => sanitize(crosswordState.cells[pos.r][pos.c].value) !== puzzle.solution[pos.r][pos.c])
  );

  if (!remainingWords.length) return;

  const word = remainingWords[Math.floor(Math.random() * remainingWords.length)];

  word.cells.forEach((pos) => {
    crosswordState.cells[pos.r][pos.c].value = puzzle.solution[pos.r][pos.c];
    crosswordState.cells[pos.r][pos.c].classList.add('reveal');
  });

  crosswordState.score = Math.max(0, crosswordState.score - 12);
  updateCrosswordProgress();
}

function clearWrongCells() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle) return;

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const sol = puzzle.solution[r][c];
      const cell = crosswordState.cells[r][c];

      if (sol && cell && cell.value && sanitize(cell.value) !== sol) {
        cell.value = '';
      }

      if (cell) {
        cell.classList.remove('wrong');
      }
    }
  }

  updateCrosswordProgress();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cwGrid')) {
    generateCrossword();
  }
});

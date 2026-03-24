// ================= STATE =================
const crosswordState = {
  puzzle: null,
  cells: [],
  selectedWordIndex: 0,
  score: 0,
  solved: false
};

// ================= UTILS =================
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

// ================= BUILD GRID =================
function tryBuildPuzzle(sourcePuzzle, chosenSize) {
  const puzzle = clonePuzzle(sourcePuzzle);
  const size = chosenSize;
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );

  for (let w of puzzle.words) {
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

      if (grid[r][c] && grid[r][c] !== answer[j]) return null;

      grid[r][c] = answer[j];
      w.cells.push({ r, c });
    }
  }

  let num = 1;
  const startMap = new Map();

  puzzle.words.forEach((w) => {
    const key = `${w.row}-${w.col}`;
    if (!startMap.has(key)) startMap.set(key, num++);
    w.number = startMap.get(key);
  });

  puzzle.size = size;
  puzzle.solution = grid;

  return puzzle;
}

// ================= PICK =================
function pickPuzzle(category, difficulty, chosenSize) {
  const list = (crosswordBank[category]?.[difficulty] || [])
    .map(p => tryBuildPuzzle(p, chosenSize))
    .filter(Boolean);

  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// ================= GENERATE =================
function generateCrossword() {
  const category = document.getElementById('cwCategory').value;
  const difficulty = document.getElementById('cwDifficulty').value;
  const chosenSize = Number(document.getElementById('cwSize').value);

  const puzzle = pickPuzzle(category, difficulty, chosenSize);

  if (!puzzle) {
    document.getElementById('cwGrid').innerHTML = '';
    document.getElementById('cwClues').innerHTML = '';
    document.getElementById('cwFeedback').innerHTML =
      '<span class="bad">Aucune grille compatible.</span>';
    return;
  }

  crosswordState.puzzle = puzzle;
  crosswordState.cells = [];
  crosswordState.selectedWordIndex = 0;
  crosswordState.score = 0;
  crosswordState.solved = false;

  renderCrossword();
  updateCrosswordProgress();
}

// ================= RENDER =================
function renderCrossword() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle) return;

  const gridEl = document.getElementById('cwGrid');
  const cluesEl = document.getElementById('cwClues');

  gridEl.innerHTML = '';
  cluesEl.innerHTML = '';
  gridEl.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;

  crosswordState.cells = Array.from({ length: puzzle.size }, () =>
    Array.from({ length: puzzle.size }, () => null)
  );

  const numberMap = {};
  puzzle.words.forEach(w => numberMap[`${w.row}-${w.col}`] = w.number);

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      const wrap = document.createElement('div');
      wrap.className = 'cw-cell-wrap';

      if (puzzle.solution[r][c]) {
        const input = document.createElement('input');
        input.className = 'cw-cell';
        input.maxLength = 1;

        input.addEventListener('input', (e) => {
          e.target.value = sanitize(e.target.value).slice(0, 1);
          updateCrosswordProgress();
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

  // CLUES
  ['across', 'down'].forEach(dir => {
    const title = dir === 'across' ? 'Horizontal' : 'Vertical';

    const group = document.createElement('div');
    group.innerHTML = `<h3>${title}</h3>`;

    puzzle.words
      .filter(w => w.dir === dir)
      .forEach(w => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${w.number}.</strong> ${w.clue}`;
        group.appendChild(div);
      });

    cluesEl.appendChild(group);
  });
}

// ================= PROGRESS =================
function updateCrosswordProgress() {
  const puzzle = crosswordState.puzzle;
  if (!puzzle) return;

  let total = 0;
  let filled = 0;

  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (puzzle.solution[r][c]) {
        total++;
        if (crosswordState.cells[r][c]?.value) filled++;
      }
    }
  }

  const percent = total ? Math.round((filled / total) * 100) : 0;
  document.getElementById('cwProgressLabel').textContent = percent + '%';
  document.getElementById('cwProgressBar').style.width = percent + '%';
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cwGrid')) {
    generateCrossword();
  }
});

const snake = {
  canvas:null, ctx:null,
  grid:20,
  body:[{x:8,y:10},{x:7,y:10},{x:6,y:10}],
  dir:{x:1,y:0}, nextDir:{x:1,y:0},
  food:{x:13,y:10}, score:0, paused:false, over:false, tick:0, speed:9
};
function initSnake(){
  snake.canvas = document.getElementById('snakeCanvas');
  if(!snake.canvas) return;
  snake.ctx = snake.canvas.getContext('2d');
  resetSnake();
  requestAnimationFrame(snakeLoop);
}
function placeSnakeFood(){ while(true){ const f = {x: Math.floor(Math.random()*snake.grid), y: Math.floor(Math.random()*snake.grid)}; if(!snake.body.some(s=>s.x===f.x && s.y===f.y)){ snake.food = f; return; } } }
function resetSnake(){ snake.body=[{x:8,y:10},{x:7,y:10},{x:6,y:10}]; snake.dir={x:1,y:0}; snake.nextDir={x:1,y:0}; snake.score=0; snake.paused=false; snake.over=false; snake.tick=0; snake.speed=9; placeSnakeFood(); renderSnakeHud(); }
function setSnakeDir(d){ const map={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}; const nd=map[d]; if(nd.x===-snake.dir.x && nd.y===-snake.dir.y) return; snake.nextDir=nd; }
function toggleSnakePause(){ snake.paused=!snake.paused; }
window.addEventListener('keydown',(e)=>{ const k=e.key.toLowerCase(); if(['arrowup','z'].includes(k)) setSnakeDir('up'); else if(['arrowdown','s'].includes(k)) setSnakeDir('down'); else if(['arrowleft','q'].includes(k)) setSnakeDir('left'); else if(['arrowright','d'].includes(k)) setSnakeDir('right'); else if(k===' ') toggleSnakePause(); else if(k==='r' && document.getElementById('snakeCanvas')) resetSnake(); });
function snakeStep(){
  if(snake.paused || snake.over) return;
  snake.dir = snake.nextDir;
  const head = {x: snake.body[0].x + snake.dir.x, y: snake.body[0].y + snake.dir.y};
  if(head.x < 0) head.x = snake.grid - 1; if(head.x >= snake.grid) head.x = 0; if(head.y < 0) head.y = snake.grid - 1; if(head.y >= snake.grid) head.y = 0;
  if(snake.body.some(s=>s.x===head.x && s.y===head.y)){ snake.over=true; beep(140,0.15,'sawtooth',0.02); return; }
  snake.body.unshift(head);
  if(head.x===snake.food.x && head.y===snake.food.y){ snake.score += 10; snake.speed = Math.min(16, snake.speed + 0.3); placeSnakeFood(); beep(640,0.05,'triangle',0.028); } else snake.body.pop();
  if(snake.score > (appState.scores.snakeBest || 0)){ appState.scores.snakeBest = snake.score; appState.scores.total += 2; saveScores(); }
  renderSnakeHud();
}
function roundRect(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function drawSnakeHead(x,y,size){ const ctx=snake.ctx; ctx.fillStyle='#ffb84d'; roundRect(ctx,x+2,y+2,size-4,size-4,8); ctx.fill(); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+12,y+8,2.4,0,Math.PI*2); ctx.arc(x+12,y+14,2.4,0,Math.PI*2); ctx.fill(); }
function drawSnake(){
  if(!snake.canvas) return; const ctx=snake.ctx, size=snake.canvas.width, tile=size/snake.grid; ctx.clearRect(0,0,size,size);
  for(let i=0;i<snake.grid;i++) for(let j=0;j<snake.grid;j++){ ctx.fillStyle=(i+j)%2===0?'rgba(255,255,255,.03)':'rgba(255,255,255,.02)'; roundRect(ctx,i*tile+1.5,j*tile+1.5,tile-3,tile-3,6); ctx.fill(); }
  const fx=snake.food.x*tile, fy=snake.food.y*tile; ctx.fillStyle='#ff5e7d'; ctx.beginPath(); ctx.arc(fx+tile/2, fy+tile/2, tile*0.27, 0, Math.PI*2); ctx.fill();
  snake.body.forEach((s,i)=>{ const x=s.x*tile, y=s.y*tile; if(i===0) drawSnakeHead(x,y,tile); else { ctx.fillStyle=`rgba(93,228,255,${0.86 - Math.min(0.5, i*0.03)})`; roundRect(ctx,x+2,y+2,tile-4,tile-4,8); ctx.fill(); } });
  if(snake.over){ ctx.fillStyle='rgba(0,0,0,.48)'; ctx.fillRect(0,0,size,size); ctx.fillStyle='#fff'; ctx.font='bold 30px Arial'; ctx.textAlign='center'; ctx.fillText('Perdu', size/2, size/2 - 10); }
}
function snakeLoop(){ snake.tick++; const framesPerStep = Math.max(3, Math.round(60 / snake.speed)); if(snake.tick % framesPerStep === 0) snakeStep(); drawSnake(); requestAnimationFrame(snakeLoop); }
function renderSnakeHud(){ const a=document.getElementById('snakeScore'); const b=document.getElementById('snakeBest'); const c=document.getElementById('snakeSpeedLabel'); if(a) a.textContent=snake.score; if(b) b.textContent=appState.scores.snakeBest || 0; if(c) c.textContent=Math.round((snake.speed - 8) * 10) / 10 + 1; }
document.addEventListener('DOMContentLoaded', initSnake);

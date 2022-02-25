const showrules = document.querySelector('.rules-btn');
const close1 = document.querySelector('.close-btn');
const rules = document.querySelector('.rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let score = 0;
let paused = false;


const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    size: 10,
    speed: 4,
    dx : 4,
    dy : -4
}

const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
    visible: true
  };

const brick = {
  w:70,
  h:20,
  padding:10,
  offsetx:45,
  offsety:60,
  visible:true
}


let bricks = [];
let rows = 9;
let column = 5;
let totalbricks = rows * column;


for(let i = 0;i<rows;i++){
  bricks[i] = [];
  for(let j = 0; j< column; j++){
    let x = i * (brick.w + brick.padding) + brick.offsetx;
    let y = j * (brick.h + brick.padding) + brick.offsety;
    bricks[i][j] = {x:x,y:y,...brick};
  }
}


showrules.addEventListener('click',()=>{
    rules.classList.add('show');
    paused = true;
})

close1.addEventListener('click',()=>{
    rules.classList.remove('show');
})


function drawbrick(){
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
    ctx.rect(brick.x, brick.y, brick.w, brick.h);
    ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
    })
  })
}

function drawball(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
    ctx.fillStyle = '#0095dd';
    ctx.fill()
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
  }

  function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
  }

document.addEventListener('keydown',(e)=>{
  if(e.key == 'ArrowRight'){
    paddle.dx = paddle.speed; 
  }else if(e.key == 'ArrowLeft'){
    paddle.dx = -paddle.speed;
  }

  if(e.code == 'Space'){
    paused = !paused
  }
})

document.addEventListener('keyup',(e)=>{
  if(e.key == 'ArrowRight' || e.key == 'ArrowLeft'){
    paddle.dx = 0;
  }
})

function movePaddle(){
  paddle.x += paddle.dx;

  if(paddle.x > (canvas.width - paddle.w)){
    paddle.x = canvas.width - paddle.w;
  }

  if(paddle.x < 0){
    paddle.x = 0
  }
}

function moveBall(){
  ball.x += ball.dx;
  ball.y += ball.dy;

  if(ball.y <=0 || ball.y + ball.size > canvas.height){
    ball.dy *= -1; 
  }

  if(ball.x + ball.size >= canvas.width || ball.x <= 0){
    ball.dx *= -1;
  }

  if(ball.y + ball.size > paddle.y && 
    ball.x - ball.size > paddle.x && 
    ball.x + ball.size < paddle.x + paddle.w)
    {
    ball.dy = -ball.speed;
    // ball.dy *= -1;
  }

  // console.log(ball.x,ball.y);

  bricks.forEach(column =>{
    column.forEach(brick => {
      if(brick.visible){
        if(
          ball.y <= brick.y + brick.h &&
          ball.x > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y
          )
          {
          ball.dy *= -1;
            score++;
          brick.visible = false;
          totalbricks--
        }
      }
     
    })
  })

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }

  if(totalbricks <= 0){
    showAllBricks();
    totalbricks = rows * column;
    alert(`You won the Game Your Socre is ${totalbricks}`);
    score = 0;
  }
}

function showAllBricks(){
  bricks.forEach(column => {
    column.forEach(brick => {
      brick.visible = true;
    })
  })
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawball();
  drawPaddle();
  drawScore();
  drawbrick();
}

draw();


function update() {
  if(!paused){
    movePaddle();
    moveBall();
  draw();
  }
  

  // Draw everything
    requestAnimationFrame(update);
  
}

update();
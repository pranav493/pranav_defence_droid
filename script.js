const board = document.getElementById("canvas");
const ctx = board.getContext("2d");
const Score = document.querySelector("#score");
const maxHealth = 100; 
const gameOverSound = new Audio('diening sound.mp3');
const gameSound= new Audio('gameSound.mp3');

let homeImg = new Image;
homeImg.src = "home.png"; 

let backImg = new Image;
backImg.src = "back.avif";

let score=0;
let health = 100;

//Board
let tileSize = 25;
let rows = 25;
let columns = 25;

board.width = tileSize * rows;
board.height = tileSize * columns;




//Ship
let shipX= board.width/2 ;
let shipY=  board.height - tileSize* 9;
let shipVelocityX = 2*tileSize;
let shipWidth = tileSize*1.5;
let shipHeight = tileSize*2;
let shipImage = new Image();
shipImage.src = "spaceship.png"

let ship={
  x:shipX,
  y:shipY,
  img: shipImage,
  width: shipWidth,
  height: shipHeight
}


//Aliens
let alienArray = [];
let alienX=tileSize;
let alienY=tileSize;
let alienWidth = tileSize*1.5;
let alienHeight = tileSize*1.5;
let alienShipImage = new Image();
alienShipImage.src = "Bot.png";

let alienRows = Math.floor(Math.random()*3 + 4);
let alienColumns = Math.floor(Math.random()*5 + 5);
let alienCount = 0;
let alienVelocityX=2.5;



//Bullets
let bulletArray = [];
let bulletVelocityY=-10;

let gameOver=false;

window.onload = function() { 
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shootBullet);
  
  createAlien();
  gameUpdate();
}


function gameUpdate(){
  requestAnimationFrame(gameUpdate);
  
  ctx.clearRect(0,0,board.width,board.height);
  
  //BackGround
ctx.drawImage(backImg,0,0,board.width,board.height);

//home image
ctx.drawImage(homeImg,0,board.height-7*tileSize,board.width,homeImg.height);

  

//SpaceShip
ctx.drawImage(ship.img,ship.x,ship.y,ship.width,ship.height);


//Rendering Aliens

for(let i=0;i<alienArray.length;i++){
  let aliens = alienArray[i];
  aliens.x+=alienVelocityX;

  //if alien touch border of canvas
  if (aliens.x + 2*aliens.width>= board.width || aliens.x-25<=0){
    alienVelocityX *= -1;
    aliens.x += alienVelocityX*3;

    for(let j=0;j<alienArray.length;j++){
      alienArray[j].y += alienHeight;
    }
  }
  
  if(aliens.alive){
    ctx.drawImage(aliens.img,aliens.x,aliens.y,aliens.width,aliens.height);
  }  
  if(aliens.y>=ship.y){
   Over();
   
   

      
  }
}

//Bullets
for(let i=0;i<bulletArray.length;i++){
  let bullet = bulletArray[i];
  bullet.y += bulletVelocityY;
  ctx.fillStyle="red";
  ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);

  // Bullet collision with aliens
for(let i=0;i<alienArray.length;i++){
  let alien = alienArray[i];
  if(!bullet.used && alien.alive && collision(bullet , alien)){
    bullet.used = true;
    alien.alive = false;
    score++;
    alienCount--;
   
  }  
}
  
}

//Removing used bullets
while(bulletArray.length>0 && (bulletArray[0].used || bulletArray[0].y<0)){
  bulletArray.shift();
}

if(alienCount===0){
  alienArray = [];
  bulletArray = [];
  alienRows = Math.floor(Math.random()*3 + 2);
 alienColumns = Math.floor(Math.random()*5 + 5);
 alienVelocityX+=2;
  createAlien();
}


//  If bullet collides with invader
function collision(a,b){
  gameSound.play();
  gameOverSound.play();
  return a.x < b.x + b.width &&
          a.x + a.width >b.x &&
          a.y < b.y + b.height &&
          a.y +a.height >b.y;
         

}



Score.innerText = `Score:${score*10}`;
health.innerText= `health:${health*10}`;// health not working properly
}

function moveShip(e){
  
  
  if(e.key==="ArrowLeft" && ship.x>0){
    ship.x -= shipVelocityX;
  }
  else if(e.key === "ArrowRight" && ship.x<board.width - ship.width){
    ship.x+= shipVelocityX;
    
  }
  
}
//Creating Alien Ships using Array
function createAlien(){
  
  
  for(let i=0;i<alienColumns;i++){
    for(let j=0;j<alienRows;j++){
      let aliens ={
        img: alienShipImage,
        x:alienX + i*alienWidth,
        y:alienY + j*alienHeight,
        width:alienWidth,
        height:alienHeight,
        img:alienShipImage,
        alive:true
      }
      alienArray.push(aliens);
      
    }
  }
  alienCount=alienArray.length;
}

//Shooting bullet iff spacebar is pressed

function shootBullet(e){
  if(e.key === " "){
    let bullet={
      x: ship.x + ship.width/2,
      y:ship.y,
      width: tileSize/6,
      height:tileSize/3,
      used:false
    }
    bulletArray.push(bullet);
  }
}




function Over(){
  alert("GAME OVER!! Press Enter To Restart ");
  
  alienArray=[];
  bulletArray=[];
  createAlien();
  location.reload;
  score=0;
  
}

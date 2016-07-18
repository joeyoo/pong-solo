var canvas = document.getElementById("canvas");
var tool = canvas.getContext("2d");

// BALL/PADDLE SIZES
var ballRadius = 2;
var paddleHeight = 32, paddleWidth = 4;

// BALL/PADDLE POSITIONS
var paddlePosition = (canvas.height-paddleHeight)/2;
var x = 0, y = 10; //initial ball position
var vxI = 2, vyI = 1; //initial velocity(w/setInterval)
var vx = vxI, vy = vyI; //ball velocity(w/setInterval)

// SCORE KEEPER VARIABLES
var score = 0;
var highScore = localStorage.getItem("highScore");

if (!highScore) {
  highScore = 0;
};

// USER KEY ACTION LISTENERS
var upKey = false, downKey = false;
document.addEventListener("keydown", press);
document.addEventListener("keyup", release);
function press() {
  if (event.keyCode == 40) {
    downKey = true;
    event.preventDefault();
  }
  else if (event.keyCode == 38) {
    upKey = true;
    event.preventDefault();
  }
}
function release() {
  if (event.keyCode == 40) {downKey = false}
  else if (event.keyCode == 38) {upKey = false}
}

// DRAWING FUNCTIONS
var gameObjects = {
  drawBall: function() {
    tool.beginPath();
    tool.arc(x, y, ballRadius, 0, Math.PI*2);
    tool.fillStyle = "white";
    tool.fill();
    tool.closePath();
  }
,
  paddleBottom: function() {
    tool.beginPath();
    tool.fillRect((canvas.width-paddleWidth)/2, paddlePosition, paddleWidth, paddleHeight/2);
    tool.fillStyle = "white";
    tool.closePath();
  }
,
  paddleTop: function() {
    tool.beginPath();
    tool.fillRect((canvas.width-paddleWidth)/2, paddlePosition+(paddleHeight/2), paddleWidth, paddleHeight/2);
    tool.fillStyle = "#00ccff";
    tool.closePath();
  }
,
  drawScore: function() {
    tool.font = "12px 'Press Start 2P'";
    tool.fillStyle = "yellow";
    tool.fillText("SCORE: " + score, 6, 17);
  }
,
  drawHighScore: function() {
    tool.font = "12px 'Press Start 2P'";
    tool.fillStyle = "yellow";
    tool.fillText("BEST: "+ highScore, 185, 17);
  }
,
  lineOfDeath: function() {
    tool.beginPath();
    tool.moveTo(canvas.width/2, 0);
    tool.lineTo(canvas.width/2, canvas.height);
    tool.strokeStyle="red";
    tool.stroke();
    tool.closePath();
  }
,
  whiteLine: function() {
    tool.beginPath();
    tool.moveTo(0, canvas.height/2);
    tool.lineTo(canvas.width, canvas.height/2);
    tool.strokeStyle="white";
    tool.stroke();
    tool.closePath();
  }
,
  draw: function() {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    gameObjects.drawScore();
    gameObjects.drawHighScore();
    gameObjects.whiteLine();
    gameObjects.lineOfDeath();
    gameObjects.drawBall();
    gameObjects.paddleTop();
    gameObjects.paddleBottom();

    // Teleports ball to oppposite side
    if (x == canvas.width - vx && vx == vxI) {x = 0}
    else if (x == -vx && vx == -vxI) {x = canvas.width}
    else if (y + vy > canvas.height - ballRadius || y + vy < ballRadius) {vy = -vy}

    // Ball coming from the left side
    if (vx == vxI && x + vx > (canvas.width/2)-(paddleWidth/2) - ballRadius && x < canvas.width/2) { // checks if ball 'hits' paddle
      if (y > paddlePosition && y < paddlePosition+paddleHeight) {
        if (y < (paddlePosition)+paddleHeight/2) {vy = -vyI*1.3}
        else if (y > (paddlePosition)+paddleHeight/2) {vy = vyI*1.2}
        vx = -vx;
        score ++;
      }
    }
    // Ball coming from the right side
    if (vx == -vxI && x + vx < (canvas.width/2) + (paddleWidth/2) + ballRadius && x > canvas.width/2) { // checks if ball 'hits' paddle
      if (y > paddlePosition && y < paddlePosition+paddleHeight) {
        if (y < (paddlePosition)+paddleHeight/2) {vy = -vyI*1.3}
        else if (y > (paddlePosition)+paddleHeight/2) {vy = vyI*1.2}
        vx = -vx;
        score ++;
      }
    }

    if (score > highScore) {
      localStorage.setItem("highScore", score);
    }

    if (x == canvas.width/2) {
      document.location.reload(false);
    }

    // controls paddle speed
    if (upKey && paddlePosition > 0) {
      paddlePosition -= 2;
    }
    else if (downKey && paddlePosition < canvas.height - paddleHeight) {
      paddlePosition += 2;
    }

    x += vx;
    y += vy;
  }
}

var startScreen = {
  pong: function() {
    tool.beginPath();
    tool.font = "35px Verdana";
    tool.fillStyle = "white";
    tool.fillText("PONG SOLO", 41, 88);
    tool.closePath();
  }
,
  clickScreen: function() {
    tool.beginPath();
    tool.font = "18px Verdana";
    tool.fillStyle = "#00ccff";
    tool.fillText("(click screen to play)", 56, 140);
    tool.closePath();
  }
,
  best: function() {
    tool.beginPath();
    tool.font = "15px Verdana";
    tool.fillStyle = "yellow";
    tool.fillText("HIGH SCORE: "+highScore, 80, 20);
    tool.closePath();
  }
,
  draw: function() {
    startScreen.pong();
    gameObjects.lineOfDeath();
    gameObjects.whiteLine();
    startScreen.clickScreen();
    startScreen.best();
    gameObjects.paddleTop();
    gameObjects.paddleBottom();
  }
}

setTimeout(startScreen.draw)
canvas.onclick = startGame;
function startGame() {
  setInterval(gameObjects.draw, 10);
};

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
//ctx.fillRect(0,0,canvas.width,canvas.height)

let interval
let bestScore = 0

let gameState = {
    rectPosX: 10,
    rectPosY: canvas.height / 2 - 10,
    rectVelocity: { x: 0, y: 0 },
    playerSpeed: 0.5,
    enemyTimeout: 60,
    enemyTimeoutInit: 60,
    friendTimeout: 60,
    friendTimeoutInit: 60,
    enemySpeed: 1,
    friendSpeed: 1,
    enemies: [],
    friends: [],
    friendAdded: false,
    score: 0
};

function random(n) {
    return Math.floor(Math.random() * n);
}

class RectCollider {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    isColliding(rectCollider) {
        if (
            this.x < rectCollider.x + rectCollider.width &&
            this.x + this.width > rectCollider.x &&
            this.y < rectCollider.y + rectCollider.height &&
            this.height + this.y > rectCollider.y
        ) {
            return true;
        }
        return false;
    }
}

function welcome() {
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "40px 'Press Start 2P'"
ctx.fillStyle = "#02F9FD"
ctx.fillText("**GALAXY**", 140, 100)
ctx.font = "25px 'Press Start 2P'"
ctx.fillStyle = "#FEFC2D"
ctx.fillText("Press any key to start", 160, 150)
}

welcome()

function checkCollision(gameState) {
    let playerCollider = new RectCollider(
        gameState.rectPosX,
        gameState.rectPosY,
        10,
        10
    );
    for (let i = 0; i < gameState.enemies.length; ++i) {
        let enemyCollider = new RectCollider(
            gameState.enemies[i].x,
            gameState.enemies[i].y,
            10,
            10
        );
        if (playerCollider.isColliding(enemyCollider)) {
            return true;
        }
        
    }
    for (let i = 0; i < gameState.friends.length; ++i) {
        let friendCollider = new RectCollider(
            gameState.friends[i].x,
            gameState.friends[i].y,
            5,
            5
        );
        if (playerCollider.isColliding(friendCollider)) {
            gameState.playerSpeed *= 1.05;
            gameState.friends.splice(i, 1);
            gameState.score++;
        }
    }
    
}

function start() {
    interval = setInterval(update, 20);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameState.enemyTimeout -= 1;
    if (gameState.enemyTimeout == 0) {
        gameState.enemyTimeout = Math.floor(gameState.enemyTimeoutInit);
        gameState.enemies.push({
            x: canvas.width,
            y: random(canvas.height),
            velocity: gameState.enemySpeed   
    });
        if(gameState.score >0){
        gameState.enemySpeed *= 1.001;
        gameState.enemyTimeoutInit = gameState.enemyTimeoutInit * 0.999;
        }

        if(gameState.score >2){
        gameState.enemySpeed *= 1.01;
        gameState.enemyTimeoutInit = gameState.enemyTimeoutInit * 0.999;
        }
    }

    gameState.friendTimeout -= 1;
    if (gameState.friendTimeout == 0) {
        gameState.friendTimeout = Math.floor(gameState.friendTimeoutInit);
        gameState.friends.push({
            x: canvas.width,
            y: random(canvas.height),
            velocity: gameState.friendSpeed    
        });
        if(gameState.score >0){
        gameState.friendSpeed *= 1.001;
        gameState.friendTimeoutInit = gameState.friendTimeoutInit * 0.999;
        }

        if(gameState.score >2){
        gameState.friendSpeed *= 1.01;
        gameState.friendTimeoutInit = gameState.friendTimeoutInit * 0.999;
        }
    }

    
    ctx.fillStyle = "#FC18F5";
    gameState.rectPosX += gameState.rectVelocity.x;
    gameState.rectPosY += gameState.rectVelocity.y;

    if (gameState.rectPosX > canvas.width - 10) {
        gameState.rectPosX = canvas.width - 10;
        gameState.rectVelocity.x = 0;
    }

    if (gameState.rectPosX < 0) {
        gameState.rectPosX = 0;
        gameState.rectVelocity.x = 0;
    }

    if (gameState.rectPosY < 0) {
        gameState.rectPosY = 0;
        gameState.rectVelocity.y = 0;
    }

    if (gameState.rectPosY > canvas.height - 10) {
        gameState.rectPosY = canvas.height - 10;
        gameState.rectVelocity.y = 0;
    }

    ctx.fillRect(gameState.rectPosX, gameState.rectPosY, 10, 10);
    ctx.fillStyle = "#FEFC2D";

    for (let i = 0; i < gameState.enemies.length; ++i) {
        gameState.enemies[i].x -= gameState.enemies[i].velocity;
        ctx.fillRect(gameState.enemies[i].x, gameState.enemies[i].y, 10, 10);
    }

    finalScore = document.getElementById("score").innerHTML = gameState.score;

    ctx.fillRect(gameState.rectPosX, gameState.rectPosY, 10, 10);
    ctx.fillStyle = "cyan";

    for (let i = 0; i < gameState.friends.length; ++i) {
        gameState.friends[i].x -= gameState.friends[i].velocity;
        ctx.fillRect(gameState.friends[i].x, gameState.friends[i].y, 5, 5);
    }

    for (let i = 0; i < gameState.friends.length; ++i) {
        if (gameState.friends[i].x < -10) {
            gameState.friends.splice(i, 1);
            //gameState.score++;
        }
    }

    if (checkCollision(gameState) == true) {
        gameState = {
            rectPosX: 10,
            rectPosY: canvas.height / 2 - 10,
            rectVelocity: { x: 0, y: 0 },
            playerSpeed: 0.5,
            enemyTimeout: 60,
            enemyTimeoutInit: 60,
            friendTimeout: 60,
            friendTimeoutInit: 60,
            enemySpeed: 1,
            friendSpeed: 1,
            enemies: [],
            friends: [],
            friendAdded: false,
            score: 0
        };
        gameOver()
    }
}
function gameOver() {
            clearInterval(interval)
            interval = undefined
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "40px 'Press Start 2P'"
            ctx.fillStyle = "#02F9FD"
            ctx.fillText("GAME OVER", 140, 70)
            ctx.font = "25px 'Press Start 2P'"
            ctx.fillStyle = "#FC18F5"
            ctx.fillText("Press any button to restart", 128, 225)
            ctx.font = "30px 'Changa one'"
            ctx.fillStyle = "#A180FE"
            ctx.fillText("Your score: ", 170, 130)
            ctx.font = "30px 'Changa one'"
            ctx.fillStyle = "#A180FE"
            ctx.fillText(finalScore, 330, 130)
            scoreMax()
        }

function scoreMax(){
    bestScore = Math.max(finalScore, localStorage.getItem("best"))
    localStorage.setItem("best", bestScore)
    ctx.font = "30px 'Changa one'"
    ctx.fillStyle = "#B0EE36"
    ctx.fillText(bestScore, 330, 170)
    ctx.fillStyle = "#B0EE36"
    ctx.fillText("Best score: ", 170, 170)
    ctx.font = "30px 'Changa one'"
}    
addEventListener('keydown', e=> {
    if (e.keyCode === 39) gameState.rectVelocity.x = gameState.playerSpeed;
    if (e.keyCode === 37) gameState.rectVelocity.x = -gameState.playerSpeed;
    if (e.keyCode === 40) gameState.rectVelocity.y = gameState.playerSpeed;
    if (e.keyCode === 38) gameState.rectVelocity.y = -gameState.playerSpeed;
    if(!interval) start()
});
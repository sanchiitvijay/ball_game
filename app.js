// select canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// create user paddle
const user = {
    x: 0,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

// create com paddle
const com = {
    x: cvs.width - 10,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

// create ball
const ball = {
    x: cvs.width/2,
    y: cvs.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

// draw rectangle
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// create the net
const net = {
    x: cvs.width/2 -1,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
}

// draw net
function drawNet(){
    for(let i = 0; i<= cvs.height; i+=15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw circle
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}
drawCircle(100, 100, 50, "WHITE");

// draw text
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x ,y);
}


// render starting screen
function renderStart() {
    // clear canvas
    drawRect(0, 0, cvs.clientWidth, cvs.clientHeight, "BLACK");

    // draw the net
    drawNet();

    // draw score
    drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");
    drawText(com.score, 3*cvs.width/4, cvs.height/5, "WHITE");
    drawText("Press button to start!", cvs.width/4, 4*cvs.height/5, "WHITE");

    // draw the user and com paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// game render
function render() {
    // clear canvas
    drawRect(0, 0, cvs.clientWidth, cvs.clientHeight, "BLACK");

    // draw the net
    drawNet();

    // draw score
    drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");
    drawText(com.score, 3*cvs.width/4, cvs.height/5, "WHITE");

    // draw the user and com paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// render winner
function renderWin(text) {
    drawText(text, cvs.width/3, 3*cvs.height/5, "WHITE");
}

// control the user paddle

cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}


// collision detection
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top <p.bottom;
}

// reset ball
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX
}

// update: pos, mov, score, ...
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // com paddle auto
    let comLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * comLevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2)? user : com;

    if(collision(ball, player)) {
        // where the ball hit the player
        let collidePoint = ball.y-(player.y + player.height/2);

        // normalisation
        collidePoint = collidePoint/(player.height/2);

        // calculate angle in radian
        let angleRad = collidePoint * Math.PI/4;

        // X direction of the ball when its hit
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        // change vel X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        // everytime the ball hit a paddle, we inc the speed
        ball.speed += 0.5;
    }

    // update the score

    if(ball.x - ball.radius < 0) {
        // the com win
        com.score++;
        if(com.score >= 5) {
            drawText(4, 3*cvs.width/4, cvs.height/5, "BLACK");
            drawText(5, 3*cvs.width/4, cvs.height/5, "WHITE");
            renderWin("computer wins!!");
            process.abort();
        }
        resetBall();
    }else if(ball.x + ball.radius > cvs.width) {
        // the user win
        user.score++;
        if(user.score >= 5) {
            drawText(4, cvs.width/4, cvs.height/5, "BLACK");
            drawText(5, cvs.width/4, cvs.height/5, "WHITE");
            renderWin("     user win!!");
            process.abort();
        }
        resetBall();
    }
}

renderStart();



// game init
function start(){
    function game() {
        update(); 
        render();
    }
    // loop
    const fps = 50;
    setInterval(game, 1000/fps)
};

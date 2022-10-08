/* global ctx*/
/* global camera*/
/* global buttons*/
/* global mx*/
/* global my*/
/* global canvas*/
/* global fieldH*/
/* global fieldW*/

const attractCoficient = 0.001;
const finalVelocityCoficient = 0.2;
const globalG = 10;
let deltaT = 16;
let world = new World();
let activateConsoleUpdate = true;

let lastmx = 0;
let lastmy = 0;

let balls = [];
let isBallHoldingNow = false;

function startGame() {
    
    fitToSize();
    
    balls.push(new Ball(vector2(300, 210), {mass: 1000000, color: "yellow", radius: 20}));
    balls.push(new Ball(vector2(430, 200), {mass: 3, color: "red"}));
    balls.push(new Ball(vector2(330, 300), {mass: 30, color: "green"}));
    balls.push(new Ball(vector2(400, 300), {mass: 10, color: "blue"}));
    balls.push(new Ball(vector2(250, 300), {mass: 20, color: "purple"}));

    setInterval(calcCameraPosAndZoom, deltaT);
    setInterval(update, deltaT);
    setInterval(checkMouseCollision, deltaT);
    setInterval(consoleUpdate, deltaT);
}

function update() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moveBalls();
    drawBalls();
    
    lastmx = mx;
    lastmy = my;
}

function drawBalls(drawBalls = balls) {
    for(let i in drawBalls) {
        let ball = drawBalls[i];
        
        ball.draw();
    }
}
function checkMouseCollision(checkBalls = balls) {
    
    if(!buttons.mouse) {
        isBallHoldingNow = false;
    }
    if(isBallHoldingNow) {
        return;
    }
    
    for(let i in checkBalls) {       
        let ball = checkBalls[i];
        
        let isCollising = ball.checkMouseCollision();
        
        if(isCollising) {
            isBallHoldingNow = true;
            return;
        }
    }
}
function moveBalls(moveBalls = balls) {
    for(let i in moveBalls) {
        let ball = moveBalls[i];
        
        ball.calcMoving();
    }
}

function fitToSize() {
    fieldW = window.innerWidth;
    fieldH = window.innerHeight - 4;
    $("#canvas, #field").width(fieldW).height(fieldH);
    ctx.canvas.width = fieldW;
    ctx.canvas.height = fieldH;
}

function addBall(params = {}) {
    let ball = new Ball(vector2());
    
    if(params.pos) {
        if(params.pos === "random" || params.pos === "rand") {
            ball.setPos(vector2(
                Math.random()*fieldW*camera.zoom + camera.x, 
                Math.random()*fieldH*camera.zoom + camera.y
            ));
        } else {
            ball.setPos(params.pos);
        }
    }
    if(params.radius) {
        if(params.radius === "random" || params.radius === "rand") {
            ball.radius = Math.random()*100;
        } else {
            ball.radius = params.radius;
        }
    }
    if(params.m || params.mass) {
        if(params.m || params.mass === "random" || params.m || params.mass === "rand") {
            ball.setMass(Math.random()*100);
        } else {
            ball.setMass(params.m || params.mass);
        }
    }
    balls.push(ball);
}
function calcMouseMove() {
    let ret = {
        x: mx - lastmx,
        y: my - lastmy
    };
    
    return ret;
}

function drawLine(pos1, pos2, parameters = {}) {
    let params = {
        width: 3,
        color: 'green'
    };
    if(parameters.width)
        params.width = parameters.width;
    if(parameters.color)
        params.color = parameters.color;
    
    ctx.beginPath();
    
    ctx.strokeStyle = params.color;
    ctx.lineWidth = params.width;
    
    ctx.moveTo(pos1.x - camera.x, fieldH/2 - pos1.y + camera.y);
    ctx.lineTo(pos2.x - camera.x, fieldH/2 - pos2.y + camera.y);
    
    ctx.stroke();
    ctx.closePath();
}
function calcCameraPosAndZoom() {
    camera.calcPosAndZoom();
}


function consoleUpdate() {
    if(!activateConsoleUpdate)
        return;
    
//    addBall();
}
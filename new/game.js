/* global ctx*/
/* global keyPressFunctions*/
/* global camera*/
/* global lastHoldedBall*/
/* global buttons*/
/* global mx*/
/* global my*/
/* global canvas*/
/* global fieldH*/
/* global fieldW*/

const attractCofficient = 0.001;
const finalVelocityCofficient = 0.2;
const globalG = 6.67384;
let deltaT = 16.6666666666666666666666;
let world = new World();
let activateConsoleUpdate = true;

let worldMPos = vector2();
let lastWorldM = worldMPos;
let lastButtons = {};

let balls = [];
let isBallHoldingNow = false;


let showGuideText = true;

function startGame() {
    
    fitToSize();
    
    balls.push(new Ball(vector2(6800, 3300), {mass: 1000, color: "yellow", radius: 100}));
    balls.push(new Ball(vector2(8800, 2700), {mass: 30, color: "green", radius: 30}));
    balls.push(new Ball(vector2(8220, 3610), {mass: 100, color: "blue", radius: 50, velocity: vector2(0, 4000)}));
    balls.push(new Ball(vector2(8100, 3600), {mass: 30, color: "red", radius: 30, velocity: vector2(0, 4000)}));
    balls.push(new Ball(vector2(6800, 5300), {mass: 1, color: "purple", radius: 20}));
    
    for(let i = 0; i <= 5; i++) {
        addBall({pos: 'random', mass: 'random'});
    }
    
    lastHoldedBall = balls[2];

    setInterval(calcCameraPosAndZoom, deltaT);
    setInterval(update, deltaT);
    setInterval(checkMouseCollision, deltaT);
    setInterval(consoleUpdate, deltaT);
    
    deltaT = 166.6666666666666666666666666;
}

function update() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    worldMPos = canvas2worldPoint(vector2(mx, my));
    
    moveBalls();
    drawBalls();
    
    if(showGuideText) {
        drawGuideText();
    }
    
    lastWorldM = worldMPos;
    lastButtons = buttons;
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
            ball.setMass(Math.random()*100 + 40);
            ball.radius = ball.attractee.m*0.3;
        } else {
            ball.setMass(params.m || params.mass);
        }
    }
    balls.push(ball);
}
function addBalls(count, params = {}) {
    for(let i = 0; i < count; i++) {
        addBall(params);
    }
}

function calcMouseMove() {
    let ret = {
        x: worldMPos.x - lastWorldM.x,
        y: worldMPos.y - lastWorldM.y
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

function toggleFollowCamera() {
    if(camera.followBall === false) {
        camera.startFollowBall(lastHoldedBall);
    } else {
        camera.unfollow();
    }
}


function drawGuideText() {
    ctx.beginPath();
    ctx.fillStyle = '#D5B6C3';
    ctx.font = "15px Arial";
    ctx.fillText('Hello There!', 10, 25);
    ctx.fillText('in this project I tried', 10, 40);
    ctx.fillText('to simulate gravity and gravition fields', 10, 55);
    ctx.fillText('you can drag a ball & throw it by your mouse', 10, 70);
    ctx.fillText('you can move camera (using arrows)', 10, 85);
    ctx.fillText('you can zoom camera (dot button and that one that`s on the right)', 10, 100);
    ctx.fillText('you can focus your camera on one of the balls (press F)', 10, 115);
    ctx.fillText('you can create balls by clicking "create ball" and "create random ball"', 10, 130);
    ctx.fillText('you can add a ball with random position and mass by clicking "create random ball"', 10, 145);
    ctx.fillText('Have fun!', 10, 160);
    ctx.fillText('(press H to hide guide)', 10, 175);
    ctx.closePath();
}



keyPressFunctions["102"] = function() {
    toggleFollowCamera();
};
keyPressFunctions["70"] = function() {
    toggleFollowCamera();
};
keyPressFunctions["1072"] = function() {
    toggleFollowCamera();
};
keyPressFunctions["72"] = function() {
    showGuideText = !showGuideText;
};
keyPressFunctions["104"] = function() {
    showGuideText = !showGuideText;
};
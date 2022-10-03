/* global ctx*/
/* global buttons*/
/* global mx*/
/* global my*/
/* global canvas*/
/* global fieldH*/
/* global fieldW*/

const attractCoficient = 0.01;
const finalVelocityCoficient = 0.2;

let ballHitboxAdd = 0;
let balls = [];
let isBallHoldingNow = false;
let camera = {x: 0, y: 0, moveSpeed: 5};

class Ball {
    
    pos = vector2();
    vec = {
        vel: 0,
        ang: 0,
        x: 0,
        y: 0
    };
    mass = 10;
    
    radius = 10;
    isHoldedByMouse = false;
    isMouseCollided = false;
    enablePhysics = false;
    displayPos = vector2();
    
    color = "white";
    drawDeco = {
        color: "black",
        borderColor: "black",
        hoover: {
            color: "black",
            borderColor: "black"
        },
        hold: {
            color: "black",
            borderColor: "black"
        }
    }
    
    id = 0;
    
    constructor(pos = vector2(fieldW/2, fieldH/2), parameters = {}) {
        this.pos = pos;
        this.id = balls.length;
        
        this.setParameters(parameters);
        
    }
    setParameters(params) {
        if(typeof params.color !== 'undefined')
            this.color = params.color;
        if(typeof params.borderColor !== 'undefined')
            this.borderColor = params.borderColor;
        if(typeof params.drawRadius !== 'undefined')
            this.radius = params.drawRadius;
        
        if(typeof params.pos !== 'undefined') {
            this.pos = params.pos;
            this.displayPos = params.pos;
        }
        if(typeof params.mass !== 'undefined')
            this.mass = params.mass;
        if(typeof params.vec !== 'undefined')
            this.vec = params.vec;
        if(typeof params.vel !== 'undefined')
            this.vec.vel = params.vel;
        if(typeof params.ang !== 'undefined')
            this.vec.ang = params.ang;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        
        let displayPos = vector2(this.pos.x - camera.x, fieldH - this.pos.y + camera.y);
        
        ctx.beginPath();
        ctx.arc(displayPos.x, displayPos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
        this.displayPos = this.pos;
    }
    
    checkMouseCollision() {
        let left = this.pos.x - this.radius - camera.x;
        let bottom = this.pos.y - this.radius - camera.y;
        let right = left + 2 * ballHitboxAdd + this.radius*2;
        let top = bottom + 2 * ballHitboxAdd + this.radius*2;

        if (mx >= left) {
            if (mx <= right) {
                if (my >= bottom) {
                    if (my <= top) {
                        this.isMouseCollided = true;
//                        this.color = "darkred";
                        return true;
                    }
                }
            }
        }
        
        this.isMouseCollided = false;
//        this.color = "red";
    }
    
    calcMoving() {
        if(this.isMouseCollided) {
            if(buttons.mouse) {
                this.pos = vector2(mx + camera.x, my + camera.y);
//                this.color = "blue";
                this.isHoldedByMouse = true;
            } else {
                this.isHoldedByMouse = false;
//                this.color = "darkred";
            }
        }
        if(this.enablePhysics && !this.isHoldedByMouse) {
            this.calcVector();
        }
    }
    calcVector() {
        for(let i in balls) {
            
            let attractor = balls[i];
            
            if(this.id === attractor.id)
                continue;
            
            let diff = vector2(attractor.displayPos.x - this.pos.x, attractor.displayPos.y - this.pos.y);
            diff.lenght = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
            diff.ang = Math.sqrt(diff.x*diff.x + diff.y*diff.y);
            
            let attractLenght = diff.lenght*attractCoficient;
            let attract = vector2(cos(diff.ang) * attractLenght, sin(diff.ang) * attractLenght);
            
            this.vec.x = cos(this.vec.ang) * this.vec.vel;
            this.vec.y = sin(this.vec.ang) * this.vec.vel;
            
            let move = vector2(this.vec.x + attract.x, this.vec.y + attract.y);
            
            this.vec = {
                vel: Math.sqrt(move.x*move.x + move.y*move.y) * finalVelocityCoficient,
                ang: atan(move.y/move.x)
            };
            
            this.pos = vector2(this.pos.x + move.x, this.pos.x + move.x);
        }
    }
}

function startGame() {
    
    fitToSize();
    
    balls.push(new Ball(vector2(430, 200), {color: "red"}));
    balls.push(new Ball(vector2(330, 300), {color: "green"}));
    balls.push(new Ball(vector2(400, 300), {color: "blue"}));
    balls.push(new Ball(vector2(250, 300), {color: "purple"}));
    balls.push(new Ball(vector2(300, 210), {mass: 100000, color: "yellow"}));

    setInterval(update, 16);
    setInterval(moveCamera, 16);
    setInterval(checkMouseCollision, 16);
}

function update() {   
    moveBalls();
    drawBalls();
}
function moveCamera() {
    if(buttons[38])
        camera.y += camera.moveSpeed;
    if(buttons[40])
        camera.y -= camera.moveSpeed;
    if(buttons[39])
        camera.x += camera.moveSpeed;
    if(buttons[37])
        camera.x -= camera.moveSpeed;
}

function drawBalls(drawBalls = balls) {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
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

function addBall(pos, params = {}) {
    if(pos === "random" || pos === "rand") {
        balls.push(new Ball(
            vector2(Math.random()*fieldW + camera.x, Math.random()*fieldH + camera.y),
            params
        ));
    } else if(pos) {
        balls.push(new Ball(vector2(pos.x + camera.x, pos.y + camera.y), params));
    } else {
        balls.push(new Ball(vector2(camera.x + fieldW/2, camera.y + fieldH/2), params));
    }
}
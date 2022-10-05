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
let camera = {x: 0, y: 0, moveSpeed: 5, zoom: 1};

class Ball {
    
    pos = vector2();
    
    attractor = {
        pos: vector2(),
        m: 10000
    }
    attractee = {
        pos: vector2(),
        m: 10000
    }
    
    velocity = vector2();
    
    radius = 10;
    isHoldedByMouse = false;
    isMouseCollided = false;
    enablePhysics = false;
    
    color = "white";
    id = 0;
    
    constructor(pos = vector2(fieldW/2, fieldH/2), parameters = {}) {
        this.attractee.pos = pos;
        this.attractor.pos = pos;
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
            this.attractee.pos = params.pos;
            this.attractor.pos = params.pos;
        }
        if(typeof params.mass !== 'undefined') {
            this.attractor.mass = params.mass;
            this.attractee.mass = params.mass;
        } 
        if(typeof params.enablePhysics !== 'undefined')
            this.enablePhysics = params.enablePhysics;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        
        let displayPos = vector2(this.attractee.pos.x - camera.x, fieldH - this.attractee.pos.y + camera.y);
        
        ctx.beginPath();
        ctx.arc(displayPos.x, displayPos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
        this.attractor.pos = this.attractee.pos;
    }
    
    checkMouseCollision() {
        let left = this.attractor.pos.x - this.radius - camera.x;
        let bottom = this.attractor.pos.y - this.radius - camera.y;
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
    
    addForce(forceVector) {
        let forceAdd = vector2(forceVector.x/this.attractee.m, forceVector.y/this.attractee.m);
        
        this.velocity.x += forceAdd.x;
        this.velocity.y += forceAdd.y;
    }
    
    calcMoving() {
        if(this.isMouseCollided) {
            if(buttons.mouse) {
                this.attractee.pos = vector2(mx + camera.x, my + camera.y);
//                this.color = "blue";
                this.isHoldedByMouse = true;
            } else {
                this.isHoldedByMouse = false;
//                this.color = "darkred";
            }
        }
        if(this.enablePhysics && !this.isHoldedByMouse) {
            this.calcAttractionToAll();
            
            this.attractee.pos.x += this.velocity.x;
            this.attractee.pos.y += this.velocity.y;
        }
    }
    calcAttractionToAll() {
        
        let attractVector = vector2();
        
        for(let i in balls) {
            let attractor = balls[i].attractor;
            
            if(balls[i] === this)
                continue;
            
            let ret = this.calcAttractionTo(attractor);
            
            attractVector.x += ret.x;
            attractVector.y += ret.y;
        }
        
        this.addForce(attractVector);
    }
    
    calcAttractionTo(attractor) {
        
        let attractee = this.attractee;
        
        let diff = vector2(attractor.pos.x - attractee.pos.x, attractor.pos.y - attractee.pos.y);
        
        diff.magnitude = Math.sqrt(diff.x*diff.x + diff.y*diff.y);
        diff.ang = Math.atan(diff.x/diff.y);
        
        let attractLenght = attractor.m*diff.magnitude;
        
        if(attractLenght > 9999)
            attractLenght = 9999;
        
        let attractVector = {
            x: cos(diff.ang)*attractLenght,
            y: sin(diff.ang)*attractLenght
        };
        
        if(diff.x > 0) {
            attractVector.x = Math.abs(attractVector.x);
        } else {
            attractVector.x = -Math.abs(attractVector.x);
        }
        if(diff.y > 0) {
            attractVector.y = Math.abs(attractVector.y);
        } else {
            attractVector.y = -Math.abs(attractVector.y);
        }
        
        return attractVector;
    }
    
}

function startGame() {
    
    fitToSize();
    
    balls.push(new Ball(vector2(430, 200), {color: "red", enablePhysics: true, mass: 10000}));
    balls.push(new Ball(vector2(330, 300), {color: "green"}));
//    balls.push(new Ball(vector2(400, 300), {color: "blue"}));
//    balls.push(new Ball(vector2(250, 300), {color: "purple"}));
//    balls.push(new Ball(vector2(300, 210), {mass: 100000, color: "yellow"}));

    setInterval(moveCamera, 16);
    setInterval(update, 16);
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
    
    if(buttons[190]) {
        camera.zoom += 0.1;
        ctx.canvas.width = fieldW*camera.zoom;
        ctx.canvas.height = fieldH*camera.zoom;
    }
    if(buttons[191]) {
        camera.zoom -= 0.1;
//        camera.x += ctx.canvas.width*0.1/2;
//        camera.x += ctx.canvas.height*0.1/2;
        ctx.canvas.width = fieldW*camera.zoom;
        ctx.canvas.height = fieldH*camera.zoom; 
    }
    
//    camera.x = balls[0].attractee.pos.x - ctx.canvas.width/2;
//    camera.y = balls[0].attractee.pos.y;
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
            vector2(
                Math.random()*fieldW*camera.zoom + camera.x, 
                Math.random()*fieldH*camera.zoom + camera.y
            ),
            params
        ));
    } else if(pos) {
        balls.push(new Ball(vector2(pos.x + camera.x, pos.y + camera.y), params));
    } else {
        balls.push(new Ball(vector2(camera.x + fieldW/2, camera.y + fieldH/2), params));
    }
}
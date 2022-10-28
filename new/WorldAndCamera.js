/* global ctx*/
/* global balls*/
/* global holdBall*/
/* global camera*/
/* global buttons*/
/* global mx*/
/* global my*/
/* global canvas*/
/* global fieldH*/
/* global fieldW*/

class World {
    constructor(){}
    
    drawCircle(pos, radius, params = {}) {
        ctx.fillStyle = params.color || "white";
        ctx.strokeStyle = params.borderColor || "black";
        
        let borderWidth = params.borderWidth || 2;
        ctx.lineWidth = world2canvasLenght(borderWidth);
        
        let displayPos = world2canvasPoint(pos);
        
        ctx.beginPath();
        ctx.arc(displayPos.x, displayPos.y, world2canvasLenght(radius), 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
   
    drawLine(pos1, pos2, params) {
    
        ctx.beginPath();

        ctx.strokeStyle = params.color || "black";

        let width = params.width || 3;
        ctx.lineWidth = world2canvasLenght(width);

        pos1 = world2canvasPoint(pos1);
        pos2 = world2canvasPoint(pos2);

        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);

        ctx.stroke();
        ctx.closePath();
       
   }
}

function world2canvasPoint(pos, dontInvertY) {
    
    let canvasPoint = {
        x: pos.x - camera.offset.x,
        y: pos.y - camera.offset.y
    };
    if(camera.followBall !== false) {
        canvasPoint.x -= camera.followBall.attractor.pos.x;
        canvasPoint.y -= camera.followBall.attractor.pos.y;
    }
    
    canvasPoint.x /= camera.zoom;
    canvasPoint.y /= camera.zoom;
    
    if(!(dontInvertY === true)) {
        canvasPoint.y = fieldH - canvasPoint.y;
    }
    
    return canvasPoint;
}
function canvas2worldPoint(pos) {
    
    let worldPoint = {
        x: pos.x*camera.zoom + camera.offset.x,
        y: pos.y*camera.zoom + camera.offset.y
    };
    
    if(camera.followBall !== false) {
        worldPoint.x += camera.followBall.attractor.pos.x;
        worldPoint.y += camera.followBall.attractor.pos.y;
    }    
    
    return worldPoint;
}

function world2canvasLenght(lenght) {
    let canvasLenght = lenght/camera.zoom;
    
    return canvasLenght;
}
function canvas2worldLenght(lenght) {
    let worldLenght = lenght*camera.zoom;
    
    return worldLenght;
}

class Camera {
    
    zoom;
    followBall = false;
    moveSpeed;
    offset = vector2();
    
    constructor(params = {}) {
        this.zoom = params.zoom || 1;
        this.moveSpeed = params.moveSpeed || 5;
        this.x = params.x || 0;
        this.y = params.y || 0;
    }
    
    calcPosAndZoom() {
        this.calcMove();

        if(buttons[190]) {
            this.zoom += 0.05*this.zoom;
        }
        if(buttons[191]) {
            this.zoom -= 0.05*this.zoom;
        }
    }
    calcMove() {
        if(buttons[38])
            this.offset.y += this.moveSpeed*this.zoom;
        if(buttons[40])
            this.offset.y -= this.moveSpeed*this.zoom;
        if(buttons[39])
            this.offset.x += this.moveSpeed*this.zoom;
        if(buttons[37])
            this.offset.x -= this.moveSpeed*this.zoom;
    }
    
    startFollowBall(followBall) {
        this.followBall = followBall;
        this.offset = {
            x: -canvas2worldLenght(fieldW/2),
            y: -canvas2worldLenght(fieldH/2)
        };
    }
    unfollow() {
        
        this.offset.x += this.followBall.attractee.pos.x;
        this.offset.y += this.followBall.attractee.pos.y;
        
        this.followBall = false;
    }
}


let camera = new Camera();


//camera.startFollowBall(balls[3]);             
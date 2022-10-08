/* global ctx*/
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
        x: (pos.x - camera.x)/camera.zoom,
        y: (pos.y - camera.y)/camera.zoom
    };
    
    if(!(dontInvertY === true)) {
        canvasPoint.y = fieldH - canvasPoint.y;
    }
    
    return canvasPoint;
}
function world2canvasLenght(lenght) {
    let canvasLenght = lenght/camera.zoom;
    
    return canvasLenght;
}
function canvas2worldPoint(pos) {
    
    let worldPoint = {
        x: pos.x*camera.zoom + camera.x,
        y: pos.y*camera.zoom + camera.y
    };
    
    return worldPoint;
}

class Camera {
    
    zoom;
    moveSpeed;
    x;
    y;
    
    constructor(params = {}) {
        this.zoom = params.zoom || 1;
        this.moveSpeed = params.moveSpeed || 5;
        this.x = params.x || 0;
        this.y = params.y || 0;
    }
    
    calcPosAndZoom() {
        if(buttons[38])
            this.y += this.moveSpeed*this.zoom;
        if(buttons[40])
            this.y -= this.moveSpeed*this.zoom;
        if(buttons[39])
            this.x += this.moveSpeed*this.zoom;
        if(buttons[37])
            this.x -= this.moveSpeed*this.zoom;

        if(buttons[190]) {
            this.zoom += 0.05*this.zoom;
        }
        if(buttons[191]) {
            this.zoom -= 0.05*this.zoom;[]
        }
    }
}


let camera = new Camera();
/* global ctx*/
/* global globalG*/
/* global camera*/
/* global buttons*/
/* global mx*/
/* global my*/
/* global canvas*/
/* global fieldH*/
/* global fieldW*/
/* global world*/
/* global balls*/

let ballHitboxAdd = 0;

class Ball {
    
    pos = vector2();
    
    attractor = {
        pos: vector2(),
        m: 10
    }
    attractee = {
        pos: vector2(),
        m: 10
    }
    
    velocity = vector2();
    
    isHoldedByMouse = false;
    isMouseCollided = false;
    enablePhysics = true;
    
    color = "white";
    borderColor = "black";
    radius = 10;
    borderWidth = this.radius/10;
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
        if(typeof params.radius !== 'undefined')
            this.radius = params.radius + this.borderWidth;
        if(typeof params.borderWidth !== 'undefined')
            this.borderWidth = params.borderWidth || this.radius/10;
        
        if(typeof params.pos !== 'undefined') {
            this.attractee.pos = params.pos;
            this.attractor.pos = params.pos;
        }
        if(typeof params.mass !== 'undefined') {
            this.attractor.m = params.mass;
            this.attractee.m = params.mass;
        } 
        if(typeof params.enablePhysics !== 'undefined')
            this.enablePhysics = params.enablePhysics;
    }
    
    draw() {
        
        world.drawCircle(
            this.attractee.pos, 
            this.radius, 
            {   color: this.color,
                borderColor: this.borderColor,
                borderWidth: this.borderWidth
            });
        
        this.attractor.pos = this.attractee.pos;
    }
    
    checkMouseCollision() {
        let pos = this.attractor.pos;
        
        let m = canvas2worldPoint(vector2(mx, my));
        
        let diff = {
            x: Math.abs(m.x - pos.x),
            y: Math.abs(m.y - pos.y)
        };
        
        diff.magnitude = Math.sqrt(diff.x*diff.x + diff.y*diff.y);
        
        if(diff.magnitude < this.radius + ballHitboxAdd + this.borderWidth/2) {
            this.isMouseCollided = true;
//            this.color = "darkred";
            return true;
        }
        
        this.isMouseCollided = false;
//        this.color = "red";
    }
    
    addForce(forceVector) {
        let forceAdd = vector2(forceVector.x/this.attractee.m, forceVector.y/this.attractee.m);
        
        this.velocity.x += forceAdd.x;
        this.velocity.y += forceAdd.y;
        
        let linePos1 = {
            x: this.attractee.pos.x,
            y: this.attractee.pos.y
        };
        let linePos2 = {
            x: this.attractee.pos.x + forceAdd.x*0.003,
            y: this.attractee.pos.y + forceAdd.y*0.003
        };
        world.drawLine(linePos1, linePos2, {color: "blue"});
        
        linePos2 = {
            x: this.attractee.pos.x + this.velocity.x*0.003,
            y: this.attractee.pos.y + this.velocity.y*0.003
        };
        world.drawLine(linePos1, linePos2, {color: "black"});
    }
    
    calcMoving() {
        if(this.isHoldedByMouse && !buttons.mouse) {
            let mouseMove = calcMouseMove();
            
            let mouseInert = canvas2worldPoint(mouseMove);
            this.velocity = {
                x: (mouseInert.x - camera.x)*1000,
                y: (mouseInert.y - camera.y)*1000
            };
            
            this.isHoldedByMouse = false;
        }
        
        if(this.isMouseCollided) {
            if(buttons.mouse) {
                this.attractee.pos = canvas2worldPoint(vector2(mx, my));
//                this.color = "blue";
                this.isHoldedByMouse = true;
            } else {
//                this.color = "darkred";
            }
        }
        
        if(this.enablePhysics && !this.isHoldedByMouse) {
            this.calcAttractionToAll();
            
            this.attractee.pos.x += this.velocity.x*deltaT/100000;
            this.attractee.pos.y += this.velocity.y*deltaT/100000;
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
        diff.ang = Math.atan(diff.y/diff.x);
        
        let attractLenght = globalG*attractor.m/diff.magnitude;
        
        if(attractLenght > 9999)
            attractLenght = 9999;
        
        if(diff.x < 0) {
            diff.ang += d2R(180);
        }
        
        let attractVector = {
            x: cos(diff.ang)*attractLenght,
            y: sin(diff.ang)*attractLenght
        };
        
        let linePos1 = {
            x: attractee.pos.x,
            y: attractee.pos.y
        };
        let linePos2 = {
            x: attractee.pos.x + attractVector.x*0.01,
            y: attractee.pos.y + attractVector.y*0.01
        };
        world.drawLine(linePos1, linePos2, {color: "green"});
        
        linePos1 = {
            x: attractor.pos.x,
            y: attractor.pos.y
        };
        linePos2 = {
            x: attractor.pos.x - attractVector.x*0.004,
            y: attractor.pos.y - attractVector.y*0.004
        };
        world.drawLine(linePos1, linePos2, {color: "red"});
        
        return attractVector;
    }
    
    //////////////////////////////////
    
    setPos(pos) {
        this.attractor.pos = pos;
        this.attractee.pos = pos;
    }
    setMass(mass) {
        this.attractor.m = mass;
        this.attractee.m = mass;
    }
}
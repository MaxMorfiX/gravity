/* global ctx*/
/* global globalG*/
/* global camera*/
/* global buttons*/
/* global worldMPos*/
/* global lastWorldM*/
/* global canvas*/
/* global fieldH*/
/* global fieldW*/
/* global world*/
/* global balls*/

let ballHitboxAdd = 0;
let lastHoldedBall;

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
    
    velLimiterOnCenter = 0;
    
    velocity = vector2();
    
    isHoldedByMouse = false;
    isMouseCollided = false;
    enablePhysics = true;
    
    color = "white";
    borderColor = "black";
    radius = 10;
    borderWidth = this.radius/10;
    id = 0;
    
    drawVecSettings = {
        drawAttractVectorFromAttractee: false,
        drawAttractVectorFromAttractor: false,
        drawVelocity: true,
        drawFinalForceVector: false
    };
    
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
        
        this.velocity = params.vel || params.velocity || vector2();
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
        
        if(this.drawVecSettings.drawFinalForceVector) {
            let linePos2 = {
                x: this.attractee.pos.x + forceAdd.x*0.003,
                y: this.attractee.pos.y + forceAdd.y*0.003
            };
            world.drawLine(linePos1, linePos2, {color: "blue", width: this.radius*100});
        }        
    }
    
    calcMoving() {
        if(this.isHoldedByMouse && !buttons.mouse) {
            let mouseMove = calcMouseMove();
            
            this.velocity = {
                x: (mouseMove.x - camera.x)*1*deltaT,
                y: (mouseMove.y - camera.y)*1*deltaT
            };
            
            this.isHoldedByMouse = false;
        }
        
        if(this.isMouseCollided) {
            if(buttons.mouse) {
                this.attractee.pos = worldMPos;
//                this.color = "blue";
                this.isHoldedByMouse = true;
                lastHoldedBall = this;
            } else {
//                this.color = "darkred";
            }
        }
        
        if(this.enablePhysics && !this.isHoldedByMouse) {
            this.calcAttractionToAll();
            
            this.attractee.pos.x += this.velocity.x*deltaT/100000;
            this.attractee.pos.y += this.velocity.y*deltaT/100000;
            
            if(this.drawVecSettings.drawVelocity) {
                let linePos1 = {
                    x: this.attractee.pos.x,
                    y: this.attractee.pos.y
                };
                
                let linePos2 = {
                    x: this.attractee.pos.x + this.velocity.x*0.01,
                    y: this.attractee.pos.y + this.velocity.y*0.01
                };
                world.drawLine(linePos1, linePos2, {color: "blue", width: this.radius*0.5});
            }
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
        
        let force = {
            x: diff.x*attractor.m*globalG*deltaT,
            y: diff.y*attractor.m*globalG*deltaT
        };

        force.x /= diff.magnitude*diff.magnitude;
        force.y /= diff.magnitude*diff.magnitude;
        
        force.magnitude = Math.sqrt(force.x*force.x + force.y*force.y);
        
        if(force.magnitude < 5) {
            if(Math.abs(force.x) > this.velLimiterOnCenter) {
                force.y *= this.velLimiterOnCenter/Math.abs(force.x);
                force.x *= this.velLimiterOnCenter/Math.abs(force.x);
            }
            if(Math.abs(force.y) > this.velLimiterOnCenter) {
                force.x *= this.velLimiterOnCenter/Math.abs(force.y);
                force.y *= this.velLimiterOnCenter/Math.abs(force.y);
            }
        }
        
        if(this.drawVecSettings.drawAttractVectorFromAttractee) {
            let linePos1 = {
                x: attractee.pos.x,
                y: attractee.pos.y
            };
            let linePos2 = {
                x: attractee.pos.x + attractVector.x*0.01,
                y: attractee.pos.y + attractVector.y*0.01
            };
            world.drawLine(linePos1, linePos2, {color: "green"});
        }
        if(this.drawVecSettings.drawAttractVectorFromAttractor) {
            let linePos1 = {
                x: attractor.pos.x,
                y: attractor.pos.y
            };
            let linePos2 = {
                x: attractor.pos.x - attractVector.x*0.004,
                y: attractor.pos.y - attractVector.y*0.004
            };
            world.drawLine(linePos1, linePos2, {color: "red"});
        }

        return force;
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
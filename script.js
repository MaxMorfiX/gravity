const SEP = '_';
const fEnablePhysics = true;
var field = $('#field');
var gameInterval = 10;
var mouseTrackInterval = 10;
var ballSize = $('.ball').width();
var holeSize = $('.blackhole').width();
var ballHAdd = 0;
var holeHAdd = 0;

var buttons = {};
var balls = {1: {x: 100, y: 200, ang: dToR(30), inert: 0, m: 10}};
var holes = {1: {x: 200, y: 200, m: 1000000}};
var isBallHold = false;
var isHoleHold = false;
var holdBall = 1;
var holdHole = 1;
var mx = 0;
var my = 0;

cycle();
trackMouse();

function trackMouse() {
    moveByMouse();
    setTimeout(trackMouse, mouseTrackInterval);
}

function cycle() {

    moveByVect();

    setTimeout(cycle, gameInterval);
}

function moveByMouse() {
    if (!buttons['mouse']) {
        isBallHold = false;
        isHoleHold = false;
        return;
    }
    
    if (!isHoleHold) {
        moveBalls();
        if (!isBallHold) {
            moveHoles();
        }
    } else if (!isBallHold) {
        moveHoles();
    }
}

function mouseBallCol() {
    for (var i in balls) {

        var left = balls[i]['x'];
        var bottom = balls[i]['y'];
        var right = left + 2 * ballHAdd + ballSize;
        var top = bottom + 2 * ballHAdd + ballSize;

        if (mx >= left) {
            if (mx <= right) {
                if (my >= bottom) {
                    if (my <= top) {
                        holdBall = i;
                        isBallHold = true;
                        return true;
                    }
                }
            }
        }
    }
}
function moveBalls() {
    if (isBallHold || mouseBallCol()) {
        balls[holdBall]['x'] = mx - ballSize / 2;
        balls[holdBall]['y'] = my - ballSize / 2;
        $('#ball' + holdBall).x(balls[holdBall]['x']);
        $('#ball' + holdBall).y(balls[holdBall]['y']);
    }
}

function mouseHoleCol() {
    for (var i in holes) {

        var left = holes[i]['x'] - holeHAdd;
        var bottom = holes[i]['y'] - holeHAdd;
        var right = left + 2 * holeHAdd + holeSize;
        var top = bottom + 2 * holeHAdd + holeSize;

        if (left < mx && mx <= right 
            && bottom < my && my <= top) 
        {
            holdHole = i;
            isHoleHold = true;
            return true;
        }
    }
}

function moveHoles() {
    if (isHoleHold || mouseHoleCol()) {
        holes[holdHole]['x'] = mx - ballSize / 2;
        holes[holdHole]['y'] = my - ballSize / 2;
        $('#hole' + holdHole).x(mx - holeSize / 2);
        $('#hole' + holdHole).y(my - holeSize / 2);
    }
}

function moveByVect() {
    for (var i in balls) {
        for (var j in holes) {
            
            var hole = holes[j];
            var ball = balls[i];
            var a = ball.ang;
            
            var holeToBallX = hole.x - ball.x;
            var holeToBallY = hole.y - ball.y;
            
            var c = atan(holeToBallY / holeToBallX);

            if (holeToBallX < 0) {
                c = c + Math.PI;
            }
            
            var distToHole = sqrt(holeToBallX*holeToBallX + holeToBallY*holeToBallY);
            var gravityForce = (hole.m * ball.m / distToHole) * 0.00001;
            
            var gVectorX = gravityForce * cos(c);
            var gVectorY = gravityForce * sin(c);
            
            var iVectorX = ball.inert * cos(a);
            var iVectorY = ball.inert * sin(a);
            
            var diffX = iVectorX + gVectorX;
            var diffY = iVectorY + gVectorY;
            
            var b = atan(diffY/diffX);
            var inertiaForce = sqrt(diffX*diffX + diffY*diffY) * ball.m * 0.000000001;
            
            var finalX = ball.x + diffX;
            var finalY = ball.y + diffY;

            console.log('           ');
            console.log('-----------');
            console.log('           ');
            
            console.log('x: ' + ball.x + ' y: ' + ball.y + ' inert: ' + ball.inert + ' angle: ' + rToD(ball.ang));

            console.log('a: ' + a + ' holeToBallX: ' + holeToBallX + ' holeToBallY: ' + holeToBallY + ' c angle: ' + rToD(c));
            
            console.log('distToHole: ' + distToHole + ' gravityForce: ' + gravityForce + ' gVectorX: ' + gVectorX + ' gVectorY: ' + gVectorY);
            
            console.log('iVectorX: ' + iVectorX + ' iVectorY: ' + iVectorY + ' diffX: ' + diffX + ' diffY: ' + diffY);
            
            console.log('b: ' + rToD(b) + ' finalX: ' + finalX + ' inertiaForce: ' + inertiaForce);

            if (fEnablePhysics) {
                ball.x = finalX;
                ball.y = finalY;
                ball.inert = inertiaForce;
                ball.ang = b;

                $('#ball' + i).x(ball.x);
                $('#ball' + i).y(ball.y);
            }
        }
    }
}




function create(type, left, bottom) {
    if (type === 'ball') {
        var id = Object.keys(balls).length + 1;
        var ball = {x: left, y: bottom, ang: 0, inert: 0, m: 10};
        balls[id] = ball;
        var html = `<div id="ball${Object.keys(balls).length}" class="ball" style="left: ${left}px; bottom: ${bottom}px"></div>`;
    }
    if (type === 'hole') {
        var id = Object.keys(holes).length + 1;
        var hole = {x: left, y: bottom, m: 1000000};
        holes[id] = hole;
        var html = `<div id="hole${Object.keys(holes).length}" class="blackhole" style="left: ${left}px; bottom: ${bottom}px"></div>`;
    }
    field.append(html);
}


onmousemove = function (e) {
    mx = e.x;
    my = fieldH - e.y;

//    console.log('mouse x: ' + mx + '; mouse y: ' + my);
};
function mouse(action) {
    if (action === 'down') {
        buttons['mouse'] = true;
    } else if (action === 'up') {
        buttons['mouse'] = false;
        moveByVect();

    }
}
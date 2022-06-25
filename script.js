const SEP = '_';
var field = $('#field');
var gamespeed = 10;
var ballSize = $('.ball').width();
var holeSize = $('.blackhole').width();
var ballHAdd = 0;
var holeHAdd = 0;

var buttons = {};
var balls = {1: {x: 100, y: 200, ang: 30, inert: 7}};
var holes = {1: {x: 0, y: 270, g: 9.8}};
var isBallHold = false;
var isHoleHold = false;
var holdBall = 1;
var holdHole = 1;
var mx = 0;
var my = 0;

cycle();

function cycle() {

    moveByMouse();

    //moveByVect();

    setTimeout(cycle, gamespeed);
}

function moveByMouse() {
    if (buttons['m?ouse']) {
        if (!isHoleHold) {
            moveBalls();
            if (!isBallHold) {
                moveHoles();
            }
        } else if (!isBallHold) {
            moveHoles();
        }
    } else {
        isBallHold = false;
        isHoleHold = false;
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
                        return true;
                    }
                }
            }
        }
    }
}
function moveBalls() {
    if (isBallHold) {
        balls[holdBall]['x'] = mx - ballSize / 2;
        balls[holdBall]['y'] = my - ballSize / 2;
        $('#ball' + holdBall).x(balls[holdBall]['x']);
        $('#ball' + holdBall).y(balls[holdBall]['y']);
    } else if (mouseBallCol()) {
        balls[holdBall]['x'] = mx - ballSize / 2;
        balls[holdBall]['y'] = my - ballSize / 2;
        $('#ball' + holdBall).x(balls[holdBall]['x']);
        $('#ball' + holdBall).y(balls[holdBall]['y']);
        isBallHold = true;
    }
}
function mouseHoleCol() {
    for (var i in holes) {

        var left = holes[i]['x'] - holeHAdd;
        var bottom = holes[i]['y'] - holeHAdd;
        var right = left + 2 * holeHAdd + holeSize;
        var top = bottom + 2 * holeHAdd + holeSize;

        if (mx >= left) {
            if (mx <= right) {
                if (my >= bottom) {
                    if (my <= top) {
                        holdHole = i;
                        return true;
                    }
                }
            }
        }
    }
}
function moveHoles() {
    if (isHoleHold) {
        holes[holdHole]['x'] = mx - ballSize / 2;
        holes[holdHole]['y'] = my - ballSize / 2;
        $('#hole' + holdHole).x(mx - holeSize / 2);
        $('#hole' + holdHole).y(my - holeSize / 2);
    } else if (mouseHoleCol()) {
        holes[holdHole]['x'] = mx - ballSize / 2;
        holes[holdHole]['y'] = my - ballSize / 2;
        $('#hole' + holdHole).x(mx - holeSize / 2);
        $('#hole' + holdHole).y(my - holeSize / 2);
        isHoleHold = true;
    }
}


function moveByVect() {
    for (var i in balls) {
        for (var j in holes) {
            var x1 = balls[i]['x'] + balls[i]['inert'] * Math.cos(balls[i]['ang']);
            var y1 = balls[i]['y'] + balls[i]['inert'] * Math.sin(balls[i]['ang']);

            var xAddH = holes[j]['x'] - balls[i]['x'];
            var yAddH = holes[j]['y'] - balls[i]['y'];

            var tan = yAddH / xAddH;
            var holeAng = Math.atan(tan);

            var xAdd = holes[j]['g'] * Math.cos(holeAng);
            var yAdd = holes[j]['g'] * Math.sin(holeAng);

            $('#ball' + i).x(x1 + xAdd);
            $('#ball' + i).y(y1 + yAdd);

            tan = yAdd / xAdd;
            balls[i]['ang'] = Math.atan(tan);

            balls[i]['inert'] = Math.sin(balls[i]['ang']) / yAdd;
        }
    }
}




function create(type, left, bottom) {
    if (type === 'ball') {
        var ball = {x: left, y: bottom, angle: 0, inert: 0};
        balls[Object.keys(balls).length + 1] = ball;
        var html = `<div id="ball${Object.keys(balls).length}" class="ball" style="left: ${left}px; bottom: ${bottom}px"></div>`;
    }
    if (type === 'hole') {
        var hole = {x: left, y: bottom};
        holes[Object.keys(holes).length + 1] = hole;
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
    }
}
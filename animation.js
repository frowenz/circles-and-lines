
const svg = document.getElementById('mySVG');
const ε = 10;
var circles = [];
let rotation = 0;

function createLine() {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;

    if (Math.random() < Math.min(ratio, 1 / ratio)) {
        x1 = getRandom(0, width)
        y1 = 0 - ε
    }
    else {
        x1 = 0 - ε
        y1 = getRandom(0, height)
    }

    if (Math.random() < Math.min(ratio, 1 / ratio)) {
        x2 = getRandom(0, width)
        y2 = height + ε
    }
    else {
        x2 = width + ε
        y2 = getRandom(0, height)
    }

    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke-width', `${getRandom(25, 50)}px`);
    if (Math.random() < 0.5) {
        line.setAttribute('stroke', 'white');
    }
    else {
        line.setAttribute('stroke', 'black');
    }
    svg.appendChild(line);
}

function createPath() {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;

    if (Math.random() < Math.min(ratio, 1 / ratio)) {
        x1 = getRandom(0, width)
        y1 = 0 - ε
    }
    else {
        x1 = 0 - ε
        y1 = getRandom(0, height)
    }

    if (Math.random() < Math.min(ratio, 1 / ratio)) {
        x2 = getRandom(0, width)
        y2 = height + ε
    }
    else {
        x2 = width + ε
        y2 = getRandom(0, height)
    }


    let corner1, corner2
    if (Math.random() < 0.5) {
        corner1 = `${0}, ${height}`
        corner2 = `0,0`
    }
    else {
        corner1 = `${width}, ${height}`
        corner2 = `${width}, 0`

    }

    // Create triangle path
    path.setAttribute('d', `M ${x1}, ${y1} L ${x2}, ${y2} L ${corner1} L ${corner2} Z`);

    path.setAttribute('style', "mix-blend-mode: difference;");
    path.setAttribute('filter', "url(#invert)");
    svg.appendChild(path);
}


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function createCircles(cx_initial, cy_initial) {

    if (typeof cx_initial === 'undefined') {
        circles.push(createCircle())
    }
    else {
        circles.push(createCircle(cx_initial, cy_initial))
    }

    let { cx, cy, r, dx, dy } = circles[circles.length - 1];

    if (circles.length < 1.5 * numCircles) {
        if (r > 20 && Math.random() < 0.25) {
            circles.push(createCircle(cx, cy, (r / (1.05 + Math.random())), dx, dy));
        }
        else if (r > 150 && Math.random() < 0.15) {
            circles.push(createCircle(cx, cy, (r / getRandom(3, 8)), dx, dy));
        }
        else if (Math.random() < 0.25) {
            {
                const numrings = getRandom(4, 8)
                if (r > 600 && Math.random() < 1) {
                    for (let j = 2; j < numrings; j++) {
                        circles.push(createCircle(cx, cy, (r / (2 ** j)), dx, dy));
                    }
                }
            }
        }
    }
}

function createCircle(cx, cy, r, dx, dy) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    if (typeof r === 'undefined') {
        const sizeDist = Math.random();
        if (sizeDist < 0.20) {
            r = getRandom(7.5, 15);
        }
        else if (sizeDist < 0.35) {
            r = getRandom(15, 30);
        }
        else if (sizeDist < 0.50) {
            r = getRandom(30, 50);
        }
        else if (sizeDist < 0.65) {
            r = getRandom(50, 70);
        }
        else if (sizeDist < 0.80) {
            r = getRandom(70, 100);
        }
        else if (Math.random() < 0.95) {
            r = getRandom(100, 175);
        }
        else {
            r = getRandom(400, 1000);
        }
    }

    if (typeof cx === 'undefined') {
        const side = Math.floor(getRandom(0, 4));
        const width = window.innerWidth;
        const height = window.innerHeight;
        switch (side) {
            case 0: // Top
                cx = getRandom(0, width);
                cy = -r;
                break;
            case 1: // Right
                cx = width + r;
                cy = getRandom(0, height);
                break;
            case 2: // Bottom
                cx = getRandom(0, width);
                cy = height + r;
                break;
            case 3: // Left
            default:
                cx = -r;
                cy = getRandom(0, height);
                break;
        }
    }
    else {
        // console.log (cx)
    }

    if (typeof dx === 'undefined') {
        dx = getRandom(-1, 1);
        dy = getRandom(-1, 1);
    }

    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);

    if (Math.random() < 0.9) {
        circle.setAttribute('fill', 'black');
        circle.setAttribute('style', "mix-blend-mode: difference;");
        circle.setAttribute('filter', "url(#invert)");
    } else {
        circle.setAttribute('fill', 'white');
    }

    svg.appendChild(circle);
    return { circle, cx, cy, r, dx, dy }
}

function updateCircles() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < circles.length; i++) {
        const { circle, dx, dy, r } = circles[i];
        const cx = parseFloat(circle.getAttribute('cx')) + dx;
        const cy = parseFloat(circle.getAttribute('cy')) + dy;

        if (cx < -r || cx > width + r || cy < -r || cy > height + r) {
            svg.removeChild(circle);
            circles.splice(i, 1);
            createCircles();
        } else {
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
        }
    }
}

let lastUpdateTime = performance.now();
function animate(time) {
    const deltaTime = time - lastUpdateTime;

    if (deltaTime >= 1000 / 30) { // 30 FPS
        updateCircles();
        lastUpdateTime = time;
    }

    requestAnimationFrame(animate);
}

for (let i = 0; i < getRandom(1, 3); i++) {
    if (Math.random() < 0.5) {
        createPath();
    }
    else {
        createLine();
    }
}

var numCircles = getRandom(10, 30)
const width = window.innerWidth;
const height = window.innerHeight;
for (let i = 0; i < numCircles; i++) {
    let cx_initial = getRandom(0, width)
    let cy_initial = getRandom(0, height)
    createCircles(cx_initial, cy_initial)
}

animate();

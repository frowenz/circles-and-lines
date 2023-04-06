const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = window.innerWidth + 10; 
canvas.height = window.innerHeight + 10; 
const canvasWidth = window.innerWidth + 10;
const canvasHeight = window.innerHeight + 10;

const numLines = getRandomInt(2, 4);
const numCircles = getRandomInt(4, 7);
const tinySubregionThreshold = 1000;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Save a copy of the current canvas
function saveCanvas(ctx) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    return imageData;
}

// Restore the canvas to a previously saved state
function restoreCanvas(ctx, imageData) {
    ctx.putImageData(imageData, 0, 0);
}

// Modified drawing functions to check for tiny subregions
function drawRandomLineWithCheck(ctx) {
    const savedCanvas = saveCanvas(ctx);
    const edgePoints = drawRandomLine(ctx);
    const tinySubregionDetected = checkForTinySubregions(ctx, edgePoints);

    if (tinySubregionDetected) {
        restoreCanvas(ctx, savedCanvas);
        return false
    }
    return true
}

function drawRandomCircleWithCheck(ctx) {
    const savedCanvas = saveCanvas(ctx);
    const circle = drawRandomCircle(ctx);
    const tinySubregionDetected = checkForTinySubregions(ctx, circle);

    if (tinySubregionDetected) {
        restoreCanvas(ctx, savedCanvas);
        console.log("FAILURE")
        return false
    }
    return true
}
function drawRandomLine(ctx) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Choose two random points on the canvas edges
    const edgePoints = getRandomEdgePoints(canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(edgePoints[0].x, edgePoints[0].y);
    ctx.lineTo(edgePoints[1].x, edgePoints[1].y);
    ctx.stroke();

    return { edgePoints }; // Return edge points
}

function getRandomEdgePoints(canvasWidth, canvasHeight) {
    const edges = [
        { x: 0, y: 0 },
        { x: canvasWidth, y: 0 },
        { x: canvasWidth, y: canvasHeight },
        { x: 0, y: canvasHeight },
    ];
    const edge1 = Math.floor(Math.random() * 4);
    const edge2 = (edge1 + 1 + Math.floor(Math.random() * 3)) % 4;
    const point1 = getRandomPointOnEdge(edges[edge1], edges[(edge1 + 1) % 4]);
    const point2 = getRandomPointOnEdge(edges[edge2], edges[(edge2 + 1) % 4]);
    return [point1, point2];
}

function getRandomPointOnEdge(edge1, edge2) {
    const t = Math.random();
    return {
        x: edge1.x + t * (edge2.x - edge1.x),
        y: edge1.y + t * (edge2.y - edge1.y),
    };
}

function drawRandomCircle(ctx) {
    const x = getRandomInt(0, canvasWidth);
    const y = getRandomInt(0, canvasHeight);
    const radius = getRandomInt(10, canvasWidth / 2);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.stroke();

    const edgePoints = [
        { x: x - radius, y },
        { x: x + radius, y },
        { x, y: y - radius },
        { x, y: y + radius },
    ];

    return { edgePoints }; // Return edge points
}

for (let i = 0; i < numLines; i++) {
    let isSuccess = drawRandomLineWithCheck(ctx);
    while (!isSuccess) {
        isSuccess = drawRandomLineWithCheck(ctx);
    }
}

for (let i = 0; i < numCircles; i++) {
    let isSuccess = drawRandomCircleWithCheck(ctx);
    while (!isSuccess) {
        isSuccess = drawRandomCircleWithCheck(ctx);
    }
}

ctx.stroke();
findAndColorSubregions(ctx);

function findAndColorSubregions(ctx) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const visited = new Set();

    function getPixelIndex(x, y) {
        return (y * canvasWidth + x) * 4;
    }

    function isWhite(x, y) {
        const idx = getPixelIndex(x, y);
        const alpha = imageData.data[idx + 3];
        const threshold = 244; // Adjust this value to better fit your requirements
        return alpha < threshold; // Check if the pixel is empty or semi-transparent
    }


    function setColor(x, y, color) {
        const idx = getPixelIndex(x, y);
        imageData.data[idx] = color.r;
        imageData.data[idx + 1] = color.g;
        imageData.data[idx + 2] = color.b;
        imageData.data[idx + 3] = 255;
    }

    function floodFill(x, y, shouldColor) {
        const queue = [{ x, y }];

        while (queue.length) {
            const { x, y } = queue.shift();

            if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;
            if (!isWhite(x, y) || visited.has(`${x},${y}`)) continue;

            visited.add(`${x},${y}`);

            if (shouldColor) {
                setColor(x, y, { r: 0, g: 0, b: 0 });
            }

            queue.push({ x: x - 1, y });
            queue.push({ x: x + 1, y });
            queue.push({ x, y: y - 1 });
            queue.push({ x, y: y + 1 });
        }
    }
    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            if (!visited.has(`${x},${y}`)) {
                if (isWhite(x, y)) {
                    shouldColor = Math.random() > 0.5;
                    floodFill(x, y, shouldColor);
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}
function checkForTinySubregions(ctx, shape) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const visited = new Set();

    function getPixelIndex(x, y) {
        return (y * canvasWidth + x) * 4;
    }

    function isWhite(x, y) {
        const idx = getPixelIndex(x, y);
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        return r + g + b > 650; // Check if pixel is mostly white
    }

    function floodFillForSize(x, y) {
        let count = 0;
        const queue = [{ x, y }];

        while (queue.length) {
            const { x, y } = queue.shift();

            if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;
            if (!isWhite(x, y) || visited.has(`${x},${y}`)) continue;

            visited.add(`${x},${y}`);
            count++;

            if (count > tinySubregionThreshold) {
                return false;
            }

            queue.push({ x: x - 1, y });
            queue.push({ x: x + 1, y });
            queue.push({ x, y: y - 1 });
            queue.push({ x, y: y + 1 });
        }

        return count <= tinySubregionThreshold;
    }

    for (const point of shape.edgePoints) {
        if (!visited.has(`${point.x},${point.y}`) && isWhite(point.x, point.y)) {
            if (floodFillForSize(point.x, point.y)) {
                return true;
            }
        }
    }

    return false;
}
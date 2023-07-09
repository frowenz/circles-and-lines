// Control Panel Listeners
document.addEventListener('keydown', function (event) {
    if (event.key === 'r' || event.key === 'R') {
        clearAll();
        init();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 't' || event.key === 'T') {
        numRegions = undefined
        numLines = undefined
        numCircles = undefined
        assignRandomColorPair();
        clearAll();
        init();
        numCirclesInput.value = numCircles;
        numLinesInput.value = numLines;
        numRegionsInput.value = numRegions;
    }
});


document.addEventListener("keydown", function (event) {
    if (event.key === "s" || event.key === "S" || event.key === "Escape") {
        toggleModulePanel();
    }
});

function toggleModulePanel() {
    const modulePanel = document.getElementById("module-panel");
    modulePanel.classList.toggle("hidden");
}

document.querySelector("body").addEventListener("click", function (event) {
    const modulePanel = document.getElementById("module-panel");
    const panelRect = modulePanel.getBoundingClientRect();

    // Check if click is outside the panel
    if (
        event.clientX < panelRect.left ||
        event.clientX > panelRect.right ||
        event.clientY < panelRect.top ||
        event.clientY > panelRect.bottom
    ) {
        // Hide the panel
        modulePanel.classList.add("hidden");
    }
    modulePanel.addEventListener("click", function (event) {
        event.stopPropagation();

    });
});

// Circles Input
document.getElementById("num-circles").value = numCircles;
const numCirclesInput = document.getElementById("num-circles");
numCirclesInput.addEventListener("input", function () {
    numCircles = parseInt(this.value);

    while (circles.length < numCircles) {
        let cx_initial = getRandom(0, width)
        let cy_initial = getRandom(0, height)
        createCircles(cx_initial, cy_initial)
    }
    while (circles.length > numCircles) {
        let i = circles.length - 1;
        const { circle } = circles[i];
        foreground.removeChild(circle);
        circles.splice(i, 1);
    }
});


// Lines Input
const numLinesInput = document.getElementById("num-lines");
document.getElementById("num-lines").value = numLines;
numLinesInput.addEventListener("input", function () {
    numLines = parseInt(this.value);

    while (lines.length < numLines) {
        createLine()
    }
    while (lines.length > numLines) {
        let i = lines.length - 1;
        // const { line } = lines[i];
        background.removeChild(lines[i]);
        lines.splice(i, 1);
    }
});

// Regions Input
const numRegionsInput = document.getElementById("num-regions");
document.getElementById("num-regions").value = numRegions;
numRegionsInput.addEventListener("input", function () {
    numRegions = parseInt(this.value);

    while (regions.length < numRegions) {
        createPath()
    }
    while (regions.length > numRegions) {
        let i = regions.length - 1;
        background.removeChild(regions[i]);
        regions.splice(i, 1);
    }
});


// Add event listener to the new button
document.getElementById("random-color-pair").addEventListener("click", function () {
    assignRandomColorPair();
});
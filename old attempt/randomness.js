// Credit: https://gist.github.com/nicolashery/5885280

function randomExponential(rate, randomUniform) {
    rate = rate || 1;
    var U = randomUniform;
    if (typeof randomUniform === 'function') U = randomUniform();
    if (!U) U = Math.random();
    return -Math.log(U) / rate;
}

function randomGeometric(successProbability, randomUniform) {
    successProbability = successProbability || 1 - Math.exp(-1);
    var rate = -Math.log(1 - successProbability);
    return Math.floor(randomExponential(rate, randomUniform));
}

function selectRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function selectWeighted (arr) {
    var total = 0;
    var i = 0;
    var r = Math.random();
    for (i = 0; i < arr.length; i++) {
        total += arr[i][1];
        if (r <= total) {
            return selectRandom(arr[i][0]);
        }
    }
}
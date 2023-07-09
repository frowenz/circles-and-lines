// List of 'random' colors
// TODO: make colors actually random
const colors = [
  ['#000000', '#FFFFFF'],
  ['#242325', '#D2C7B6'],
  ['#000000', '#B7B3A1'],
  ['#7D5C65', '#E5BEED'],
  ['#BDC4A7', '#3F7CAC'],
  ['#998650', '#e7d383'],
  ['#153131', '#57E2E5'],
  ['#D3D0CB', '#393E41'],
  ['#8AAAE5', '#1E2019'],
  ['#587B7F', '#1E2019'],
  // ['#BB3030', '#4F6FB0'],
  ['#8AAAE5', '#000000'],
  ['#603F83',"#C7D3D4"],
  ['#A07855',"#D4B996"],
  ['#101820',"#F2AA4C"],
  ['#000000',"#7C74E5"],
  ['#3429B9',"#7C74E5"],
  ['#FF8FB4',"#C8415C"],
  ['#4ad388',"#2E8B57"],
  ['#2F3C7E', '#EEA47F'],
  // ['#101820', '#FEE715'],
  ['#8AAAE5', '#000000'],
  ['#ADD8E6', '#00008B'],
  ['#CBD18F', '#3A6B35'],
  ['#FFA351', '#734F2B'],
  ['#EEE0CB', '#6A4B81'],
  ['#6A4B81', '#000000'],
  ['#2C5F2D', '#97BC62'],
  ['#2BAE66', '#28334D'],
  ['#DDC3A5', '#201E20'],
  ['#DAFDBA', '#13678A']
]

// Color remapping

function setFirstTableValue(element, newValue) {
  var tableValues = element.getAttribute('tableValues').split(' ');
  tableValues[0] = newValue.toFixed(20);
  element.setAttribute('tableValues', tableValues.join(' '));
}

function setSecondTableValue(element, newValue) {
  var tableValues = element.getAttribute('tableValues').split(' ');
  tableValues[1] = newValue.toFixed(20);
  element.setAttribute('tableValues', tableValues.join(' '));
}

document.getElementById("color-white").addEventListener("input", function () {
  var feFuncR = document.querySelector('feFuncR');
  var feFuncG = document.querySelector('feFuncG');
  var feFuncB = document.querySelector('feFuncB');

  var colorValue = this.value;

  var redDecimal = hexToDecimal(colorValue.substring(1, 3));
  var greenDecimal = hexToDecimal(colorValue.substring(3, 5));
  var blueDecimal = hexToDecimal(colorValue.substring(5, 7));

  var redTableValue = decimalToTableValues(redDecimal);
  var greenTableValue = decimalToTableValues(greenDecimal);
  var blueTableValue = decimalToTableValues(blueDecimal);

  setFirstTableValue(feFuncR, redTableValue);
  setFirstTableValue(feFuncG, greenTableValue);
  setFirstTableValue(feFuncB, blueTableValue);
});

document.getElementById("color-black").addEventListener("input", function () {
  var feFuncR = document.querySelector('feFuncR');
  var feFuncG = document.querySelector('feFuncG');
  var feFuncB = document.querySelector('feFuncB');

  var colorValue = this.value;

  var redDecimal = hexToDecimal(colorValue.substring(1, 3));
  var greenDecimal = hexToDecimal(colorValue.substring(3, 5));
  var blueDecimal = hexToDecimal(colorValue.substring(5, 7));

  var redTableValue = decimalToTableValues(redDecimal);
  var greenTableValue = decimalToTableValues(greenDecimal);
  var blueTableValue = decimalToTableValues(blueDecimal);

  setSecondTableValue(feFuncR, redTableValue);
  setSecondTableValue(feFuncG, greenTableValue);
  setSecondTableValue(feFuncB, blueTableValue);
});

function hexToDecimal(hex) {
  return parseInt(hex.substring(0), 16);
}

function decimalToTableValues(decimal) {
  return decimal / 255;
}


function assignRandomColorPair() {
  const colorPairIndex = Math.floor(Math.random() * colors.length);
  var [color1, color2] = colors[colorPairIndex];

  if (Math.random() > 0.5) {
      let temp = color1;
      color1 = color2;
      color2 = temp;
  }

  document.getElementById("color-white").value = color1;
  document.getElementById("color-black").value = color2;

  applyColorPair(color1, color2);
}

// Add this function to apply the selected color pair to the page
function applyColorPair(color1, color2) {
  var feFuncR = document.querySelector("feFuncR");
  var feFuncG = document.querySelector("feFuncG");
  var feFuncB = document.querySelector("feFuncB");

  var colorValues = [color1, color2];

  colorValues.forEach((colorValue, index) => {
      var redDecimal = hexToDecimal(colorValue.substring(1, 3));
      var greenDecimal = hexToDecimal(colorValue.substring(3, 5));
      var blueDecimal = hexToDecimal(colorValue.substring(5, 7));

      var redTableValue = decimalToTableValues(redDecimal);
      var greenTableValue = decimalToTableValues(greenDecimal);
      var blueTableValue = decimalToTableValues(blueDecimal);

      if (index === 0) {
          setFirstTableValue(feFuncR, redTableValue);
          setFirstTableValue(feFuncG, greenTableValue);
          setFirstTableValue(feFuncB, blueTableValue);
      } else {
          setSecondTableValue(feFuncR, redTableValue);
          setSecondTableValue(feFuncG, greenTableValue);
          setSecondTableValue(feFuncB, blueTableValue);
      }
  });
}

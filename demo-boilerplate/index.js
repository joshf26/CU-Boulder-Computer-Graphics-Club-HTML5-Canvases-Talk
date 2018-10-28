const WIDTH = 500;
const HEIGHT = 500;

let startButton = document.getElementById('start-button');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

startButton.addEventListener('click', function () {
    startButton.style.display = 'none';
});

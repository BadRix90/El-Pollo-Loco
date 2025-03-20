let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas')
    world = new World(canvas, keyboard)

}

window.addEventListener('keydown', (e) => {
    if (e.key === " ") { 
        e.preventDefault();
        keyboard.SPACE = true;
    } else if (e.key.toLowerCase() === "a") { 
        keyboard.LEFT = true;
    } else if (e.key.toLowerCase() === "w") { 
        keyboard.UP = true;
    } else if (e.key.toLowerCase() === "d") { 
        keyboard.RIGHT = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === " ") {
        keyboard.SPACE = false;
    } else if (e.key.toLowerCase() === "a") {
        keyboard.LEFT = false;
    } else if (e.key.toLowerCase() === "w") {
        keyboard.UP = false;
    } else if (e.key.toLowerCase() === "d") {
        keyboard.RIGHT = false;
    }
});

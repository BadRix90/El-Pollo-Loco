let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic;

function init() {
    canvas = document.getElementById('canvas');
    backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = 0.015;

    world = new World(canvas, keyboard);
}

function toggleMusic() {
    if (!backgroundMusic) return

    const btn = document.getElementById("sound-toggle-btn")

    if (!toggleMusic.isToggling) {
        toggleMusic.isToggling = true;

        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                btn.src = "img/GUI/3 Icons/Icons/Icon_03.png";
            }).catch((err) => {
                console.log("Play prevented:", err);
            }).finally(() => {
                toggleMusic.isToggling = false;
            });
        } else {
            btn.src = "img/GUI/3 Icons/Icons/Icon_34.png";
            backgroundMusic.pause();
            toggleMusic.isToggling = false;
        }
    }

}
toggleMusic.isToggling = false

function toggleMenu() {
    world.handleMenuAction("toggle-menu");
}


function stopGame() {
    const bgm = document.getElementById('background-music');
    if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
    }

    const introMusic = document.getElementById('intro-music');
    if (introMusic) {
        introMusic.volume = 0.02;
        introMusic.currentTime = 32;
        introMusic.play();
    }

    if (world) {
        clearInterval(world.lyricInterval);
        clearInterval(world.lyricSetupInterval);
        cancelAnimationFrame(world.drawLoopId); // <- das war wichtig!
    }

    world = new World(canvas, keyboard);
}


window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && world) {
        world.showOptionsMenu = !world.showOptionsMenu;
    }

    if (e.key === " ") {
        e.preventDefault();
        keyboard.SPACE = true;
    } else if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft") {
        keyboard.LEFT = true;
    } else if (e.key.toLowerCase() === "w" || e.key === "ArrowUp") {
        keyboard.UP = true;
    } else if (e.key.toLowerCase() === "d" || e.key === "ArrowRight") {
        keyboard.RIGHT = true;
    } else if (e.key.toLowerCase() === "s" || e.key === "ArrowDown") {
        keyboard.DOWN = true;
    } else if (e.key.toLowerCase() === "q") {
        keyboard.q = true;
    } else if (e.key === "Control") {
        keyboard.CTRL = true;
    } else if (e.key === "Shift") {
        keyboard.SHIFT = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === " ") {
        keyboard.SPACE = false;
    } else if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft") {
        keyboard.LEFT = false;
    } else if (e.key.toLowerCase() === "w" || e.key === "ArrowUp") {
        keyboard.UP = false;
    } else if (e.key.toLowerCase() === "d" || e.key === "ArrowRight") {
        keyboard.RIGHT = false;
    } else if (e.key.toLowerCase() === "s" || e.key === "ArrowDown") {
        keyboard.DOWN = false;
    } else if (e.key.toLowerCase() === "q") {
        keyboard.q = false;
    } else if (e.key === "Control") {
        keyboard.CTRL = false;
    } else if (e.key === "Shift") {
        keyboard.SHIFT = false;
    }
});

function startInFullscreen() {
    const canvas = document.getElementById("canvas");
    const fs = canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.() || canvas.msRequestFullscreen?.();

    Promise.resolve(fs).finally(() => {
        document.getElementById("fullscreen-choice").style.display = "none";

        canvas.addEventListener("click", (e) => {
            if (!world || !world.menuButtons) return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const clickX = (e.clientX - rect.left) * scaleX;
            const clickY = (e.clientY - rect.top) * scaleY;

            for (const btn of world.menuButtons) {
                if (
                    clickX >= btn.x &&
                    clickX <= btn.x + btn.w &&
                    clickY >= btn.y &&
                    clickY <= btn.y + btn.h
                ) {
                    world.handleMenuAction(btn.action);
                    break;
                }
            }
        });

        init(); // Jetzt erst das Spiel starten
    });
}

function startWithoutFullscreen() {
    document.getElementById("fullscreen-choice").style.display = "none";

    const canvas = document.getElementById("canvas");
    canvas.addEventListener("click", (e) => {
        if (!world || !world.menuButtons) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;

        for (const btn of world.menuButtons) {
            if (
                clickX >= btn.x &&
                clickX <= btn.x + btn.w &&
                clickY >= btn.y &&
                clickY <= btn.y + btn.h
            ) {
                world.handleMenuAction(btn.action);
                break;
            }
        }
    });

    init(); // Spiel ohne Fullscreen starten
}


function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function toggleFullscreen() {
    const canvas = document.getElementById("canvas");

    if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {
        const result = canvas.requestFullscreen?.() ||
            canvas.webkitRequestFullscreen?.() ||
            canvas.msRequestFullscreen?.();

        if (result && result.catch) {
            result.catch(() => { });
        }
    } else {
        const result = document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.msExitFullscreen?.();

        if (result && result.catch) {
            result.catch(() => { });
        }
    }
}


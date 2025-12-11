const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width;
let height = canvas.height;
let objectSize = 45;

// Bote que captura objetos
const boat = {
    x: width / 2 - 40,
    y: height - 50,
    width: 80,
    height: 30,
    speed: 7,
    dx: 0
};

const boatImage = new Image();
boatImage.onload = function () {
    resizeCanvas();
};
boatImage.src = 'img/bin.png';

function resizeCanvas() {
    const isMobile = window.innerWidth < 600;
    const scaleFactor = isMobile ? 0.95 : 0.8;

    canvas.width = window.innerWidth * scaleFactor;
    canvas.height = window.innerHeight * scaleFactor;
    width = canvas.width;
    height = canvas.height;

    // Scale elements based on screen width
    // Mobile: larger percentages for better visibility/touch
    const boatScale = isMobile ? 0.20 : 0.10;
    boat.width = width * boatScale;

    if (boatImage.complete && boatImage.naturalWidth > 0) {
        const aspectRatio = boatImage.naturalHeight / boatImage.naturalWidth;
        boat.height = boat.width * aspectRatio;
    } else {
        boat.height = boat.width * 0.4; // Fallback ratio
    }

    boat.speed = width * 0.015;

    // Object size
    const objScale = isMobile ? 0.12 : 0.06;
    objectSize = width * objScale;

    // Update boat position to stay at bottom
    boat.y = height - boat.height - (height * 0.02);

    // Ensure boat stays within new width
    if (boat.x + boat.width > width) {
        boat.x = width - boat.width;
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();



// Objetos orgánicos e inorgánicos
// Objetos orgánicos e inorgánicos

const objects = [];
const organicEmojis = ['🍎', '🍌', '🥕', '🥦', '🌽', '🍇', '🍉', '🥔', '🥬'];
const inorganicEmojis = ['🛢️', '🔋', '🗑️', '🧪', '🔩', '🥤', '⚠️'];

// Sistema de Sonido (Web Audio API)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playCorrectSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function playIncorrectSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// Estado del juego
let gameRunning = false;
let isPaused = false;

// Puntaje
let score = 0;

// Crea objetos aleatorios (orgánico o inorgánico)
function createObject() {
    const x = Math.random() * (width - objectSize);
    const y = -objectSize;
    const isOrganic = Math.random() > 0.5; // 50% chance organic or inorganic

    const emojiList = isOrganic ? organicEmojis : inorganicEmojis;
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    objects.push({ x, y, size: objectSize, isOrganic, emoji });
}

// Movimiento del bote
function moveBoat() {
    boat.x += boat.dx;
    if (boat.x < 0) boat.x = 0;
    if (boat.x + boat.width > width) boat.x = width - boat.width;
}

// Detecta colisiones entre el bote y objetos
function detectCollision(obj) {
    return (
        obj.x < boat.x + boat.width &&
        obj.x + obj.size > boat.x &&
        obj.y + obj.size > boat.y &&
        obj.y < boat.y + boat.height
    );
}

// Dibuja elementos
function drawBoat() {
    if (boatImage.complete && boatImage.naturalWidth > 0) {
        ctx.drawImage(boatImage, boat.x, boat.y, boat.width, boat.height);
    } else {
        // Fallback while loading or if image is missing
        ctx.fillStyle = 'blue';
        ctx.fillRect(boat.x, boat.y, boat.width, boat.height);
    }
}

function drawObject(obj) {
    ctx.save();
    ctx.font = `${obj.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obj.emoji, obj.x + obj.size / 2, obj.y + obj.size / 2);
    ctx.restore();
}

function drawScore() {
    ctx.save();

    const isMobile = width < 600;
    const fontSize = isMobile ? 24 : 20;
    const padding = isMobile ? 15 : 10;

    // Score background pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;

    ctx.font = `bold ${fontSize}px "Segoe UI", sans-serif`;
    const text = 'Puntaje: ' + score;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    const w = textWidth + (padding * 3);
    const h = fontSize + (padding * 2);
    const x = 20;
    const y = 20;
    const r = h / 2;

    // Rounded rectangle (manual path for compatibility)
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2d3748';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + padding, y + h / 2);
    ctx.restore();
}

function drawPauseScreen() {
    ctx.save();
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Box
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;

    const boxW = Math.min(width * 0.8, 400);
    const boxH = 200;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    // Rounded rect for box (manual path)
    ctx.beginPath();
    const r = 20;
    ctx.moveTo(boxX + r, boxY);
    ctx.lineTo(boxX + boxW - r, boxY);
    ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + r);
    ctx.lineTo(boxX + boxW, boxY + boxH - r);
    ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - r, boxY + boxH);
    ctx.lineTo(boxX + r, boxY + boxH);
    ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - r);
    ctx.lineTo(boxX, boxY + r);
    ctx.quadraticCurveTo(boxX, boxY, boxX + r, boxY);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.fillStyle = '#2d3748';
    ctx.textAlign = 'center';

    ctx.font = 'bold 30px "Segoe UI", sans-serif';
    ctx.fillText('Juego Pausado', width / 2, boxY + 60);

    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText('Puntaje: ' + score, width / 2, boxY + 110);

    ctx.fillStyle = '#718096';
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText('Toca el botón para continuar', width / 2, boxY + 160);

    ctx.restore();
}

// Actualización del juego
function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, width, height);

    if (!isPaused) {
        // Crear objetos nuevos periódicamente
        if (Math.random() < 0.03) createObject();

        moveBoat();

        // Mover y dibujar objetos
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            obj.y += 3; // velocidad caída

            if (detectCollision(obj)) {
                // Actualizar puntaje según tipo
                if (obj.isOrganic) {
                    score += 1;
                    playCorrectSound();
                } else {
                    score -= 1;
                    if (score < 0) score = 0; // evitar puntaje negativo
                    playIncorrectSound();
                }
                objects.splice(i, 1); // eliminar objeto capturado
                continue;
            }

            // Eliminar objetos que caen fuera del canvas
            if (obj.y > height) {
                objects.splice(i, 1);
                continue;
            }
        }
    }

    // Draw everything (even if paused, so we see the frozen state)
    for (const obj of objects) {
        drawObject(obj);
    }

    drawBoat();
    drawScore();

    if (isPaused) {
        drawPauseScreen();
    }

    requestAnimationFrame(update);
}

// Start Menu Logic
const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');
const pauseButton = document.getElementById('pauseButton');

startButton.addEventListener('click', () => {
    startMenu.style.display = 'none';
    pauseButton.style.display = 'flex'; // Show pause button
    gameRunning = true;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    update();
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
        // Play Icon
        pauseButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
        `;
    } else {
        // Pause Icon
        pauseButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
        `;
    }
});

// Initial render (background only)
resizeCanvas();

// Control del teclado
function keyDownHandler(e) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        boat.dx = boat.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        boat.dx = -boat.speed;
    }
}

function keyUpHandler(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        boat.dx = 0;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Control táctil
function handleTouch(e) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    e.preventDefault(); // Prevenir scroll
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;

    // Centrar el bote en el dedo
    boat.x = touchX - boat.width / 2;

    // Límites
    if (boat.x < 0) boat.x = 0;
    if (boat.x + boat.width > width) boat.x = width - boat.width;
}

canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });



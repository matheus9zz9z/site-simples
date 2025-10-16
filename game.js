// Game Configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 200;
const MOUSE_WIDTH = 30;
const MOUSE_HEIGHT = 30;
const TRAP_WIDTH = 20;
const TRAP_HEIGHT = 40;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const GAME_SPEED = 5; // Velocidade reduzida
const BASE_TRAP_INTERVAL = 1500; // Intervalo base entre obstáculos

// Detecção de dispositivo móvel
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const MOBILE_SPEED_MULTIPLIER = 0.7; // Reduz a velocidade em 30% no mobile

// Sprite frames for mouse animation
const mouseSprites = {
    run: [
        { x: 0, legOffset: 0 },
        { x: 0, legOffset: 5 },
        { x: 0, legOffset: 0 },
        { x: 0, legOffset: -5 }
    ],
    currentFrame: 0,
    frameCount: 0
};

// Cat configuration
const cat = {
    x: 0,
    y: CANVAS_HEIGHT - 40,
    width: 40,
    height: 40,
    distance: 250, // Distance from mouse
    currentFrame: 0,
    frameCount: 0
};
// Game Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Game State
let gameStarted = false;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('mouseGameHighScore') || 0;

// Mouse
const mouse = {
    x: 300,  // Posição inicial mais à frente
    y: CANVAS_HEIGHT - MOUSE_HEIGHT,
    width: MOUSE_WIDTH,
    height: MOUSE_HEIGHT,
    velocityY: 0,
    jumping: false
};

// Traps
let traps = [];
let lastTrapTime = 0;

// Game Controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !mouse.jumping && gameStarted && !gameOver) {
        mouse.velocityY = JUMP_FORCE;
        mouse.jumping = true;
    }
});

// Draw Functions
function drawMouse() {
    ctx.fillStyle = '#fff';
    
    // Update animation frame
    if (gameStarted && !gameOver) {
        mouseSprites.frameCount++;
        if (mouseSprites.frameCount > 5) {
            mouseSprites.currentFrame = (mouseSprites.currentFrame + 1) % mouseSprites.run.length;
            mouseSprites.frameCount = 0;
        }
    }

    const currentSprite = mouseSprites.run[mouseSprites.currentFrame];
    const legOffset = mouse.jumping ? 0 : currentSprite.legOffset;

    // Body
    ctx.fillRect(mouse.x + 5, mouse.y + 5, mouse.width - 10, mouse.height - 10);
    
    // Head
    ctx.beginPath();
    ctx.arc(mouse.x + mouse.width - 5, mouse.y + mouse.height/2, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.beginPath();
    ctx.arc(mouse.x + mouse.width - 8, mouse.y + mouse.height/2 - 8, 5, 0, Math.PI * 2);
    ctx.arc(mouse.x + mouse.width - 2, mouse.y + mouse.height/2 - 8, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(mouse.x + mouse.width - 3, mouse.y + mouse.height/2 - 1, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#ff9999';
    ctx.beginPath();
    ctx.arc(mouse.x + mouse.width + 1, mouse.y + mouse.height/2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Legs
    ctx.fillStyle = '#fff';
    ctx.fillRect(mouse.x + 8, mouse.y + mouse.height - 5 + legOffset, 4, 8);
    ctx.fillRect(mouse.x + mouse.width - 12, mouse.y + mouse.height - 5 - legOffset, 4, 8);
    
    // Tail
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y + mouse.height - 8);
    ctx.quadraticCurveTo(
        mouse.x - 10, 
        mouse.y + mouse.height - 15 + Math.sin(mouseSprites.currentFrame * Math.PI) * 3,
        mouse.x - 20,
        mouse.y + mouse.height - 5
    );
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCat() {
    ctx.fillStyle = '#ff9966';
    
    // Update animation frame
    cat.frameCount++;
    if (cat.frameCount > 5) {
        cat.currentFrame = (cat.currentFrame + 1) % 4;
        cat.frameCount = 0;
    }
    
    const legOffset = cat.currentFrame % 2 === 0 ? 3 : -3;
    
    // Body
    ctx.fillRect(cat.x + 5, cat.y + 5, cat.width - 10, cat.height - 10);
    
    // Head
    ctx.beginPath();
    ctx.arc(cat.x + cat.width - 5, cat.y + 15, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.beginPath();
    ctx.moveTo(cat.x + cat.width - 12, cat.y + 5);
    ctx.lineTo(cat.x + cat.width - 17, cat.y - 5);
    ctx.lineTo(cat.x + cat.width - 7, cat.y + 5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(cat.x + cat.width - 2, cat.y + 5);
    ctx.lineTo(cat.x + cat.width + 3, cat.y - 5);
    ctx.lineTo(cat.x + cat.width - 7, cat.y + 5);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cat.x + cat.width - 8, cat.y + 12, 2, 0, Math.PI * 2);
    ctx.arc(cat.x + cat.width + 2, cat.y + 12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Legs
    ctx.fillStyle = '#ff9966';
    ctx.fillRect(cat.x + 8, cat.y + cat.height - 8 + legOffset, 4, 8);
    ctx.fillRect(cat.x + cat.width - 12, cat.y + cat.height - 8 - legOffset, 4, 8);
}

function drawTrap(trap) {
    ctx.fillStyle = '#ff4444';
    
    // Base da ratoeira
    ctx.fillRect(trap.x, trap.y + trap.height - 5, trap.width, 5);
    
    // Mola
    ctx.fillStyle = '#aaa';
    ctx.fillRect(trap.x + trap.width/2 - 2, trap.y + 10, 4, trap.height - 15);
    
    // Barra superior
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(trap.x, trap.y, trap.width, 8);
    
    // Queijo (isca)
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(trap.x + trap.width/2, trap.y + 5, 3, 0, Math.PI * 2);
    ctx.fill();
}

function createTrap() {
    // Em dispositivos móveis, cria as armadilhas muito mais longe
    const startX = isMobile ? CANVAS_WIDTH + 300 : CANVAS_WIDTH;
    
    traps.push({
        x: startX,
        y: CANVAS_HEIGHT - TRAP_HEIGHT,
        width: TRAP_WIDTH,
        height: TRAP_HEIGHT
    });
}

function updateTraps() {
    const currentTime = Date.now();
    const interval = isMobile ? 2500 : BASE_TRAP_INTERVAL;
    
    if (currentTime - lastTrapTime > interval) {
        createTrap();
        lastTrapTime = currentTime;
    }

    const currentSpeed = isMobile ? GAME_SPEED * MOBILE_SPEED_MULTIPLIER : GAME_SPEED;

    traps = traps.filter(trap => {
        trap.x -= currentSpeed;
        return trap.x > -TRAP_WIDTH;
    });
}

function checkCollision(mouse, trap) {
    return mouse.x < trap.x + trap.width &&
           mouse.x + mouse.width > trap.x &&
           mouse.y < trap.y + trap.height &&
           mouse.y + mouse.height > trap.y;
}

function updateScore() {
    score++;
    document.getElementById('score').textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('mouseGameHighScore', highScore);
        document.getElementById('highscore').textContent = highScore;
    }
}

// Add touch/mobile support
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!mouse.jumping && gameStarted && !gameOver) {
        mouse.velocityY = JUMP_FORCE;
        mouse.jumping = true;
    }
});

function updateCat() {
    // Calculate target position (behind the mouse)
    const targetX = mouse.x - cat.distance;
    
    // Move cat towards target
    cat.x += (targetX - cat.x) * 0.1;
    
    // Keep cat within canvas bounds
    if (cat.x < 0) cat.x = 0;
}

function drawBackground() {
    // Parede
    ctx.fillStyle = '#D4C5B2'; // Cor bege clara para a parede
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 40);

    // Rodapé
    ctx.fillStyle = '#8B7355'; // Cor marrom para o rodapé
    ctx.fillRect(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 10);

    // Piso
    ctx.fillStyle = '#6E4C1E'; // Cor marrom escura para o piso de madeira
    ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30);

    // Padrão do piso
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
        ctx.fillStyle = '#5C4019'; // Linha mais escura para simular tábuas
        ctx.fillRect(i, CANVAS_HEIGHT - 30, 2, 30);
    }

    // Alguns detalhes na parede (quadros simplificados)
    ctx.fillStyle = '#8B7355';
    ctx.strokeStyle = '#6E4C1E';
    ctx.lineWidth = 2;

    // Quadro 1
    ctx.fillRect(100, 30, 60, 40);
    ctx.strokeRect(95, 25, 70, 50);

    // Quadro 2
    ctx.fillRect(600, 50, 40, 60);
    ctx.strokeRect(595, 45, 50, 70);

    // Tomada na parede
    ctx.fillStyle = '#999';
    ctx.fillRect(300, CANVAS_HEIGHT - 80, 20, 20);
}

function gameLoop() {
    if (!gameStarted || gameOver) return;

    // Clear canvas e desenha o fundo
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBackground();

    // Update mouse position
    mouse.velocityY += GRAVITY;
    mouse.y += mouse.velocityY;
    
    // Update cat position
    updateCat();

    // Ground collision
    if (mouse.y > CANVAS_HEIGHT - MOUSE_HEIGHT) {
        mouse.y = CANVAS_HEIGHT - MOUSE_HEIGHT;
        mouse.velocityY = 0;
        mouse.jumping = false;
    }

    // Update and draw traps
    updateTraps();
    traps.forEach(trap => {
        drawTrap(trap);
        if (checkCollision(mouse, trap)) {
            gameOver = true;
            document.getElementById('startGame').textContent = 'Tentar Novamente';
            document.getElementById('startGame').style.display = 'block';
        }
    });

    // Draw cat and mouse
    drawCat();
    drawMouse();

    // Update score
    updateScore();

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start Game Button
document.getElementById('startGame').addEventListener('click', () => {
    gameStarted = true;
    gameOver = false;
    score = 0;
    traps = [];
    mouse.y = CANVAS_HEIGHT - MOUSE_HEIGHT;
    mouse.velocityY = 0;
    cat.x = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('highscore').textContent = highScore;
    document.getElementById('startGame').style.display = 'none';
    lastTrapTime = Date.now();
    gameLoop();
});

// Initial setup
document.getElementById('highscore').textContent = highScore;

// Draw initial state
drawBackground();
drawMouse();
drawCat();
// Main.js - Loop principal e inicialização do jogo

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.gameStarted = false;
        this.gamePaused = false;
        this.lastTime = 0;
        
        this.keys = {};
        
        // Carrega imagem de fundo
        this.loadBackground();
        
        this.initSystems();
        this.setupEventListeners();
    }

    // Carrega imagem de fundo do mapa
    loadBackground() {
        this.backgroundImage = new Image();
        this.backgroundLoaded = false;
        
        this.backgroundImage.onload = () => {
            this.backgroundLoaded = true;
            console.log('✅ Fundo carregado!');
        };
        
        this.backgroundImage.onerror = () => {
            console.warn('⚠️ Imagem de fundo não encontrada, usando gradiente');
            this.backgroundLoaded = false;
        };
        
        this.backgroundImage.src = 'assets/images/backgroundd.png';
    }

    // Inicializa todos os sistemas
    initSystems() {
        this.player = new Player(
            this.canvas.width / 2 - 25,
            this.canvas.height / 2 - 25
        );

        this.inventory = new Inventory();
        this.resourceManager = new ResourceManager();
        this.craftingSystem = new CraftingSystem();
        this.uiManager = new UIManager(
            this.player,
            this.inventory,
            this.resourceManager,
            this.craftingSystem
        );

        console.log('🎮 Sistemas do jogo inicializados!');
    }

    // Configura event listeners
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            if (e.key === 'c' || e.key === 'C') {
                this.craftingSystem.toggle(this.inventory);
            }
            
            if (e.key === 'i' || e.key === 'I') {
                console.log('📦 Inventário:', this.inventory.items);
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.startGame();
            });
        }

        console.log('⌨️ Event listeners configurados!');
    }

    // Inicia o jogo
    startGame() {
        if (this.gameStarted) return;

        console.log('🚀 Iniciando jogo...');
        
        this.gameStarted = true;
        this.uiManager.hideStartScreen();
        this.uiManager.showGameUI();
        this.resourceManager.spawnInitialResources(this.canvas, 20);
        this.uiManager.updateAll();
        this.uiManager.showNotification('🎮 Bem-vindo ao Forager!', 'success');
        
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Loop principal do jogo
    gameLoop(currentTime) {
        if (!this.gameStarted) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.clearCanvas();
        this.update(currentTime);
        this.draw();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Atualiza lógica do jogo
    update(currentTime) {
        if (this.gamePaused) return;

        this.player.handleInput(this.keys);
        this.player.update(this.canvas);
        this.resourceManager.update(this.canvas, currentTime);

        if (this.resourceManager.checkCollision(this.player, this.inventory)) {
            this.player.collectResource();
            this.uiManager.updateAll();
        }
    }

    // Desenha tudo no canvas
    draw() {
        this.drawBackground();
        this.resourceManager.draw(this.ctx);
        this.player.draw(this.ctx);
        this.uiManager.drawHUD(this.ctx, this.canvas);
    }

    // Limpa canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Desenha fundo
    drawBackground() {
        // Se a imagem carregou, usa ela como fundo
        if (this.backgroundLoaded) {
            // Desenha a imagem repetida (pattern)
            const pattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
            if (pattern) {
                this.ctx.fillStyle = pattern;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                return;
            }
        }
        
        // Fallback: Gradiente
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#90EE90');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Padrão de grama
        this.ctx.fillStyle = 'rgba(34, 139, 34, 0.1)';
        for (let i = 0; i < 100; i++) {
            const x = (i * 97) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.fillRect(x, y, 3, 3);
        }
    }

    // Pausa/despausa
    togglePause() {
        this.gamePaused = !this.gamePaused;
        console.log(this.gamePaused ? '⏸️ Jogo pausado' : '▶️ Jogo retomado');
    }
}

// Inicializa o jogo
window.addEventListener('load', () => {
    console.log('🎮 Forager Game - Carregado!');
    console.log('📚 SENAI Dr. Celso Charuri - 2026');
    
    const game = new Game();
    window.game = game;
    
    console.log('✅ Jogo pronto! Clique em INICIAR JOGO para começar.');
});

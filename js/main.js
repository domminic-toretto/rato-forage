// Main.js - Loop principal e inicialização do jogo

class Game {
    constructor() {
        // Canvas e contexto
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Estado do jogo
        this.gameStarted = false;
        this.gamePaused = false;
        this.lastTime = 0;
        
        // Input do teclado
        this.keys = {};
        
        // Inicializa sistemas do jogo
        this.initSystems();
        
        // Configura event listeners
        this.setupEventListeners();
    }

    // Inicializa todos os sistemas
    initSystems() {
        // Cria jogador no centro do canvas
        this.player = new Player(
            this.canvas.width / 2 - 20,
            this.canvas.height / 2 - 20
        );

        // Cria sistemas
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
        // Teclado - keydown
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Atalhos de teclado
            if (e.key === 'c' || e.key === 'C') {
                this.craftingSystem.toggle(this.inventory);
            }
            
            if (e.key === 'i' || e.key === 'I') {
                console.log('📦 Inventário:', this.inventory.items);
            }
        });

        // Teclado - keyup
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Botão de início
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
        
        // Esconde tela de início
        this.uiManager.hideStartScreen();
        
        // Mostra UI do jogo
        this.uiManager.showGameUI();
        
        // Spawna recursos iniciais
        this.resourceManager.spawnInitialResources(this.canvas, 20);
        
        // Atualiza UI
        this.uiManager.updateAll();
        
        // Mostra mensagem de boas-vindas
        this.uiManager.showNotification('🎮 Bem-vindo ao Forager!', 'success');
        
        // Inicia loop do jogo
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Loop principal do jogo
    gameLoop(currentTime) {
        if (!this.gameStarted) return;

        // Calcula delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Limpa canvas
        this.clearCanvas();

        // Atualiza
        this.update(currentTime);

        // Desenha
        this.draw();

        // Próximo frame
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Atualiza lógica do jogo
    update(currentTime) {
        if (this.gamePaused) return;

        // Atualiza jogador
        this.player.handleInput(this.keys);
        this.player.update(this.canvas);

        // Atualiza recursos (spawn)
        this.resourceManager.update(this.canvas, currentTime);

        // Verifica colisões com recursos
        if (this.resourceManager.checkCollision(this.player, this.inventory)) {
            // Recurso coletado
            this.player.collectResource();
            this.uiManager.updateAll();
        }
    }

    // Desenha tudo no canvas
    draw() {
        // Desenha fundo (grama)
        this.drawBackground();

        // Desenha recursos
        this.resourceManager.draw(this.ctx);

        // Desenha jogador
        this.player.draw(this.ctx);

        // Desenha HUD
        this.uiManager.drawHUD(this.ctx, this.canvas);
    }

    // Limpa canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Desenha fundo decorativo
    drawBackground() {
        // Gradiente de fundo
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');  // Céu
        gradient.addColorStop(1, '#90EE90');  // Grama
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Padrão de grama (pontos decorativos)
        this.ctx.fillStyle = 'rgba(34, 139, 34, 0.1)';
        for (let i = 0; i < 100; i++) {
            const x = (i * 97) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.fillRect(x, y, 3, 3);
        }
    }

    // Pausa/despausa o jogo
    togglePause() {
        this.gamePaused = !this.gamePaused;
        console.log(this.gamePaused ? '⏸️ Jogo pausado' : '▶️ Jogo retomado');
    }
}

// Inicializa o jogo quando a página carregar
window.addEventListener('load', () => {
    console.log('🎮 Forager Game - Carregado!');
    console.log('📚 SENAI Dr. Celso Charuri - 2026');
    
    const game = new Game();
    
    // Disponibiliza globalmente para debug
    window.game = game;
    
    console.log('✅ Jogo pronto! Clique em INICIAR JOGO para começar.');
});

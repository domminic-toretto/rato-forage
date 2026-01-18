// Sistema de UI - Gerencia interface e displays

class UIManager {
    constructor(player, inventory, resourceManager, craftingSystem) {
        this.player = player;
        this.inventory = inventory;
        this.resourceManager = resourceManager;
        this.craftingSystem = craftingSystem;
        
        this.setupEventListeners();
    }

    // Configura event listeners da UI
    setupEventListeners() {
        // Botão de fechar crafting
        const closeButton = document.getElementById('close-crafting');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.craftingSystem.close();
            });
        }

        // Tecla ESC para fechar menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.craftingSystem.close();
            }
        });
    }

    // Atualiza todas as informações da UI
    updateAll() {
        this.updateStats();
        this.updateInventory();
    }

    // Atualiza display de estatísticas
    updateStats() {
        // Nível
        const levelDisplay = document.getElementById('level');
        if (levelDisplay) {
            levelDisplay.textContent = this.player.level;
        }

        // Total de recursos coletados
        const collectedDisplay = document.getElementById('total-collected');
        if (collectedDisplay) {
            collectedDisplay.textContent = this.resourceManager.totalCollected;
        }
    }

    // Atualiza inventário
    updateInventory() {
        this.inventory.updateDisplay();
    }

    // Mostra notificação temporária
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Retorna cor baseada no tipo de notificação
    getNotificationColor(type) {
        const colors = {
            'info': '#2196F3',
            'success': '#4CAF50',
            'warning': '#FF9800',
            'error': '#f44336'
        };
        return colors[type] || colors.info;
    }

    // Mostra tela de início
    showStartScreen() {
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.style.display = 'flex';
        }
    }

    // Esconde tela de início
    hideStartScreen() {
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.style.display = 'none';
        }
    }

    // Mostra canvas e UI do jogo
    showGameUI() {
        const canvas = document.getElementById('gameCanvas');
        const uiContainer = document.getElementById('ui-container');
        
        if (canvas) {
            canvas.classList.add('active');
        }
        
        if (uiContainer) {
            uiContainer.classList.add('active');
        }
    }

    // Desenha HUD no canvas (informações adicionais)
    drawHUD(ctx, canvas) {
        // Barra de experiência
        const barWidth = 200;
        const barHeight = 20;
        const barX = canvas.width / 2 - barWidth / 2;
        const barY = 10;

        // Fundo da barra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Progresso de experiência
        const expPercentage = this.player.experience / this.player.experienceToNextLevel;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(barX, barY, barWidth * expPercentage, barHeight);

        // Borda da barra
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Texto de experiência
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `EXP: ${this.player.experience}/${this.player.experienceToNextLevel}`,
            canvas.width / 2,
            barY + barHeight + 15
        );

        // Instruções no canto
        ctx.textAlign = 'left';
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('WASD - Mover', 10, canvas.height - 60);
        ctx.fillText('C - Crafting', 10, canvas.height - 40);
        ctx.fillText('I - Inventário', 10, canvas.height - 20);
    }

    // Adiciona animações CSS necessárias
    addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
            
            @keyframes slideUp {
                from {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializa animações ao carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const tempUI = new UIManager(null, null, null, null);
        tempUI.addAnimations();
    });
} else {
    const tempUI = new UIManager(null, null, null, null);
    tempUI.addAnimations();
}

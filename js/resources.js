// Sistema de Recursos - Gerencia coleta e spawn de recursos no mapa

class Resource {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.collected = false;
        
        // Configurações visuais por tipo de recurso
        this.config = {
            'apple': { 
                color: '#FF6B6B', 
                emoji: '🍎',
                name: 'Maçã',
                rarity: 0.3
            },
            'grass': { 
                color: '#51CF66', 
                emoji: '🌿',
                name: 'Grama',
                rarity: 0.5
            },
            'stone': { 
                color: '#8B8680', 
                emoji: '🪨',
                name: 'Pedra',
                rarity: 0.15
            },
            'wood': { 
                color: '#8B4513', 
                emoji: '🪵',
                name: 'Madeira',
                rarity: 0.05
            }
        };
    }

    // Desenha o recurso no canvas
    draw(ctx) {
        const cfg = this.config[this.type];
        
        // Sombra do recurso
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x + 2, this.y + 2, this.width, this.height);
        
        // Fundo colorido do recurso
        ctx.fillStyle = cfg.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Borda destacada
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Emoji do recurso (centralizado)
        ctx.font = '20px Arial';
        ctx.fillText(cfg.emoji, this.x + 6, this.y + 22);
    }

    // Verifica colisão com o jogador
    isCollidingWith(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

class ResourceManager {
    constructor() {
        this.resources = [];
        this.spawnInterval = 2000; // 2 segundos
        this.lastSpawn = 0;
        this.maxResources = 30; // Máximo de recursos no mapa
        this.totalCollected = 0;
    }

    // Gera um novo recurso aleatório no mapa
    spawnResource(canvas) {
        if (this.resources.length >= this.maxResources) {
            return; // Não spawna se já tiver muitos recursos
        }

        // Tipos de recursos com suas probabilidades
        const types = [
            { type: 'apple', weight: 30 },
            { type: 'grass', weight: 50 },
            { type: 'stone', weight: 15 },
            { type: 'wood', weight: 5 }
        ];
        
        // Seleciona tipo baseado no peso (probabilidade)
        const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedType = 'grass';
        
        for (const t of types) {
            if (random < t.weight) {
                selectedType = t.type;
                break;
            }
            random -= t.weight;
        }

        // Posição aleatória no canvas (com margem)
        const margin = 50;
        const x = margin + Math.random() * (canvas.width - margin * 2 - 32);
        const y = margin + Math.random() * (canvas.height - margin * 2 - 32);

        this.resources.push(new Resource(x, y, selectedType));
    }

    // Spawna recursos iniciais
    spawnInitialResources(canvas, count = 15) {
        for (let i = 0; i < count; i++) {
            this.spawnResource(canvas);
        }
    }

    // Atualiza sistema de recursos
    update(canvas, currentTime) {
        // Spawna novos recursos periodicamente
        if (currentTime - this.lastSpawn > this.spawnInterval) {
            this.spawnResource(canvas);
            this.lastSpawn = currentTime;
        }
    }

    // Desenha todos os recursos
    draw(ctx) {
        this.resources.forEach(resource => {
            if (!resource.collected) {
                resource.draw(ctx);
            }
        });
    }

    // Remove um recurso por índice
    removeResource(index) {
        if (index >= 0 && index < this.resources.length) {
            this.resources.splice(index, 1);
            this.totalCollected++;
        }
    }

    // Verifica colisão com jogador e coleta recurso
    checkCollision(player, inventory) {
        for (let i = this.resources.length - 1; i >= 0; i--) {
            const resource = this.resources[i];
            
            if (!resource.collected && resource.isCollidingWith(player)) {
                // Adiciona ao inventário
                inventory.addItem(resource.type, 1);
                
                // Remove o recurso
                this.removeResource(i);
                
                // Efeito sonoro (se implementado)
                this.playCollectSound();
                
                return true;
            }
        }
        return false;
    }

    // Efeito sonoro de coleta (placeholder)
    playCollectSound() {
        // Pode ser implementado com Web Audio API
        // Por enquanto, apenas um console.log
        console.log('🎵 Recurso coletado!');
    }
}

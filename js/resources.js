// Sistema de Recursos - Gerencia coleta e spawn de recursos no mapa

class Resource {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 40;
        this.height = 40;
        this.collected = false;
        
        // Configurações por tipo de recurso
        this.config = {
            'apple': { 
                color: '#FF6B6B', 
                emoji: '🍎',
                image: 'assets/images/apple.png',
                name: 'Maçã',
                rarity: 0.3
            },
            'grass': { 
                color: '#51CF66', 
                emoji: '🌿',
                image: 'assets/images/grass.png',
                name: 'Grama',
                rarity: 0.5
            },
            'stone': { 
                color: '#8B8680', 
                emoji: '🪨',
                image: 'assets/images/stone.png',
                name: 'Pedra',
                rarity: 0.15
            },
            'wood': { 
                color: '#8B4513', 
                emoji: '🪵',
                image: 'assets/images/woodd.png',
                name: 'Madeira',
                rarity: 0.05
            }
        };

        // Carrega a imagem
        this.loadImage();
    }

    // Carrega a imagem do recurso
    loadImage() {
        this.imageLoaded = false;
        this.imageObj = new Image();
        
        this.imageObj.onload = () => {
            this.imageLoaded = true;
        };
        
        this.imageObj.onerror = () => {
            console.warn(`⚠️ Imagem não encontrada: ${this.config[this.type].image}`);
            this.imageLoaded = false;
        };
        
        this.imageObj.src = this.config[this.type].image;
    }

    // Desenha o recurso no canvas
    draw(ctx) {
        const cfg = this.config[this.type];
        
        // Sombra do recurso
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height + 2,
            this.width / 2.5,
            6,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Se a imagem carregou, desenha ela
        if (this.imageLoaded) {
            ctx.drawImage(
                this.imageObj,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            // Fallback: desenha com cor e emoji
            ctx.fillStyle = cfg.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Borda
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            // Emoji centralizado
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                cfg.emoji,
                this.x + this.width / 2,
                this.y + this.height / 2
            );
        }
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
            return;
        }

        // Tipos de recursos com suas probabilidades
        const types = [
            { type: 'apple', weight: 30 },
            { type: 'grass', weight: 50 },
            { type: 'stone', weight: 15 },
            { type: 'woodd', weight: 5 }
        ];
        
        // Seleciona tipo baseado no peso
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

        // Posição aleatória (com margem)
        const margin = 50;
        const x = margin + Math.random() * (canvas.width - margin * 2 - 40);
        const y = margin + Math.random() * (canvas.height - margin * 2 - 40);

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
                inventory.addItem(resource.type, 1);
                this.removeResource(i);
                this.playCollectSound();
                return true;
            }
        }
        return false;
    }

    // Efeito sonoro de coleta
    playCollectSound() {
        console.log('🎵 Recurso coletado!');
    }
}

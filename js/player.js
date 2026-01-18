// Classe do Jogador - Controla movimento e interações

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 4;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Informações do jogador
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        
        // Direção (para animação futura)
        this.direction = 'down'; // up, down, left, right
        
        // Estado de movimento
        this.isMoving = false;
    }

    // Processa input do teclado
    handleInput(keys) {
        this.velocityX = 0;
        this.velocityY = 0;
        this.isMoving = false;

        // Movimento vertical
        if (keys['w'] || keys['ArrowUp']) {
            this.velocityY = -this.speed;
            this.direction = 'up';
            this.isMoving = true;
        }
        if (keys['s'] || keys['ArrowDown']) {
            this.velocityY = this.speed;
            this.direction = 'down';
            this.isMoving = true;
        }

        // Movimento horizontal
        if (keys['a'] || keys['ArrowLeft']) {
            this.velocityX = -this.speed;
            this.direction = 'left';
            this.isMoving = true;
        }
        if (keys['d'] || keys['ArrowRight']) {
            this.velocityX = this.speed;
            this.direction = 'right';
            this.isMoving = true;
        }

        // Normaliza velocidade diagonal
        if (this.velocityX !== 0 && this.velocityY !== 0) {
            const factor = Math.sqrt(2) / 2;
            this.velocityX *= factor;
            this.velocityY *= factor;
        }
    }

    // Atualiza posição do jogador
    update(canvas) {
        // Atualiza posição
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Limites do canvas (colisão com bordas)
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
    }

    // Desenha o jogador no canvas
    draw(ctx) {
        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height + 2,
            this.width / 2,
            6,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Corpo do jogador (círculo base)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Borda do corpo
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Rosto (emoji de pessoa)
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Emoji baseado na direção
        const emojis = {
            'up': '🧑',
            'down': '🧑',
            'left': '🧑',
            'right': '🧑'
        };
        
        ctx.fillText(
            emojis[this.direction],
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        // Indicador de nível (acima da cabeça)
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        const levelText = `Lvl ${this.level}`;
        ctx.strokeText(levelText, this.x + this.width / 2, this.y - 8);
        ctx.fillText(levelText, this.x + this.width / 2, this.y - 8);
    }

    // Adiciona experiência e verifica level up
    addExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }

    // Aumenta o nível do jogador
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // Melhora atributos
        this.speed += 0.2;
        
        console.log(`🎉 LEVEL UP! Agora você é nível ${this.level}!`);
        this.showLevelUpEffect();
    }

    // Efeito visual de level up (placeholder)
    showLevelUpEffect() {
        // Pode ser implementado com partículas ou animação
        console.log('✨ *Efeito de level up*');
    }

    // Ganha experiência ao coletar recursos
    collectResource() {
        this.addExperience(10);
    }
}

// Classe do Jogador - RATINHO COM ANIMAÇÃO

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 120;  // ← AUMENTEI de 60 para 80
        this.height = 120; // ← AUMENTEI de 60 para 80
        this.speed = 4;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Informações do jogador
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        
        // Sistema de Animação
        this.direction = 'right'; // Ratinho olha para direita por padrão
        this.isMoving = false;
        this.isAttacking = false;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 50; // ms entre frames (ajuste para mais suave/rápido)
        
        // Configuração das Sprite Sheets
        // Os tamanhos serão calculados automaticamente quando a imagem carregar
        this.animations = {
            idle: {
                loaded: false,
                image: null,
                frames: 1,
                frameWidth: 0,    // Será calculado
                frameHeight: 0,   // Será calculado
                loop: true,
                vertical: false
            },
            walk: {
                loaded: false,
                image: null,
                frames: 5,
                frameWidth: 0,    // Será calculado
                frameHeight: 0,   // Será calculado
                loop: true,
                vertical: false    // Frames empilhados verticalmente
            },
            attack: {
                loaded: false,
                image: null,
                frames: 5,
                frameWidth: 0,    // Será calculado
                frameHeight: 0,   // Será calculado
                loop: false,
                vertical: false   // Frames lado a lado
            }
        };

        this.currentAnimation = 'idle';
        this.loadAnimations();
    }

    // Carrega todas as sprite sheets
    loadAnimations() {
        // Caminhos das suas sprite sheets
        const animPaths = {
            idle: 'assets/images/rat-idle.png',      // Frame único
            walk: 'assets/images/rat-walkk.png',      // 5 frames de caminhada
            attack: 'assets/images/rat-attackk.png'   // 5 frames de ataque
        };

        for (const [animName, path] of Object.entries(animPaths)) {
            this.loadAnimation(animName, path);
        }
    }

    // Carrega uma sprite sheet específica
    loadAnimation(animName, path) {
        const img = new Image();
        
        img.onload = () => {
            this.animations[animName].image = img;
            this.animations[animName].loaded = true;
            console.log(`✅ Animação carregada: ${animName} (${img.width}x${img.height}px)`);
            
            // Calcula automaticamente o tamanho de cada frame
            const anim = this.animations[animName];
            if (anim.frames > 1) {
                anim.frameWidth = img.width / anim.frames;
                anim.frameHeight = img.height;
            } else {
                anim.frameWidth = img.width;
                anim.frameHeight = img.height;
            }
            
            console.log(`  → Frame: ${anim.frameWidth}x${anim.frameHeight}px, Total: ${anim.frames} frames`);
        };
        
        img.onerror = () => {
            console.warn(`⚠️ Animação não encontrada: ${path}`);
        };
        
        img.src = path;
    }

    // Atualiza a animação atual
    updateAnimation(deltaTime) {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;

        this.frameTimer += deltaTime;

        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame++;

            // Verifica fim da animação
            if (this.currentFrame >= anim.frames) {
                if (anim.loop) {
                    this.currentFrame = 0;
                } else {
                    // Se não loopa (como ataque), volta pro idle
                    this.currentFrame = anim.frames - 1;
                    if (this.currentAnimation === 'attack') {
                        this.isAttacking = false;
                        this.setAnimation('idle');
                    }
                }
            }
        }
    }

    // Define qual animação tocar
    setAnimation(animName) {
        if (this.currentAnimation !== animName && !this.isAttacking) {
            this.currentAnimation = animName;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    // Inicia ataque
    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.currentAnimation = 'attack';
            this.currentFrame = 0;
            this.frameTimer = 0;
            console.log('⚔️ Ratinho ataca!');
        }
    }

    // Processa input do teclado
    handleInput(keys) {
        // Durante ataque, só aceita input de movimento (não congela)
        if (this.isAttacking) {
            // Permite movimento durante ataque
            this.velocityX = 0;
            this.velocityY = 0;
            
            if (keys['w'] || keys['ArrowUp']) {
                this.velocityY = -this.speed * 0.5; // Movimento mais lento durante ataque
            }
            if (keys['s'] || keys['ArrowDown']) {
                this.velocityY = this.speed * 0.5;
            }
            if (keys['a'] || keys['ArrowLeft']) {
                this.velocityX = -this.speed * 0.5;
                this.direction = 'left';
            }
            if (keys['d'] || keys['ArrowRight']) {
                this.velocityX = this.speed * 0.5;
                this.direction = 'right';
            }
            
            // Normaliza velocidade diagonal
            if (this.velocityX !== 0 && this.velocityY !== 0) {
                const factor = Math.sqrt(2) / 2;
                this.velocityX *= factor;
                this.velocityY *= factor;
            }
            return;
        }

        this.velocityX = 0;
        this.velocityY = 0;
        this.isMoving = false;

        // Ataque com Space ou X
        if ((keys[' '] || keys['x'] || keys['X']) && !this.isAttacking) {
            this.attack();
            return;
        }

        // Movimento
        if (keys['w'] || keys['ArrowUp']) {
            this.velocityY = -this.speed;
            this.isMoving = true;
        }
        if (keys['s'] || keys['ArrowDown']) {
            this.velocityY = this.speed;
            this.isMoving = true;
        }
        if (keys['a'] || keys['ArrowLeft']) {
            this.velocityX = -this.speed;
            this.isMoving = true;
            this.direction = 'left';
        }
        if (keys['d'] || keys['ArrowRight']) {
            this.velocityX = this.speed;
            this.isMoving = true;
            this.direction = 'right';
        }

        // Define animação baseada no movimento
        if (this.isMoving) {
            this.setAnimation('walk');
        } else {
            this.setAnimation('idle');
        }

        // Normaliza velocidade diagonal
        if (this.velocityX !== 0 && this.velocityY !== 0) {
            const factor = Math.sqrt(2) / 2;
            this.velocityX *= factor;
            this.velocityY *= factor;
        }
    }

    // Atualiza posição
    update(canvas, deltaTime) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Limites do canvas
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }

        this.updateAnimation(deltaTime);
    }

    // Desenha o jogador
    draw(ctx) {
        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height + 2,
            this.width / 2.5,
            8,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        const anim = this.animations[this.currentAnimation];

        if (anim && anim.loaded && anim.image) {
            // Calcula posição do frame na sprite sheet
            let frameX, frameY;
            
            // Verifica se é sprite sheet vertical ou horizontal
            if (anim.vertical) {
                // Frames empilhados verticalmente (walk)
                frameX = 0;
                frameY = this.currentFrame * anim.frameHeight;
            } else {
                // Frames lado a lado horizontalmente (attack, idle)
                frameX = this.currentFrame * anim.frameWidth;
                frameY = 0;
            }

            // Salva contexto para flip horizontal
            ctx.save();

            // Se está indo para esquerda, espelha a imagem
            if (this.direction === 'left') {
                ctx.translate(this.x + this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(
                    anim.image,
                    frameX, frameY,
                    anim.frameWidth, anim.frameHeight,
                    0, 0,
                    this.width, this.height
                );
            } else {
                ctx.drawImage(
                    anim.image,
                    frameX, frameY,
                    anim.frameWidth, anim.frameHeight,
                    this.x, this.y,
                    this.width, this.height
                );
            }

            ctx.restore();
        } else {
            // Fallback: emoji de rato
            this.drawFallback(ctx);
        }

        // Indicador de nível
        this.drawLevelIndicator(ctx);
    }

    // Fallback quando sprite não carrega
    drawFallback(ctx) {
        ctx.fillStyle = '#8B7355';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Emoji de rato
        ctx.font = '35px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            '🐀',
            this.x + this.width / 2,
            this.y + this.height / 2
        );
    }

    // Desenha indicador de nível
    drawLevelIndicator(ctx) {
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        const levelText = `Lvl ${this.level}`;
        ctx.strokeText(levelText, this.x + this.width / 2, this.y - 10);
        ctx.fillText(levelText, this.x + this.width / 2, this.y - 10);
    }

    addExperience(amount) {
        this.experience += amount;
        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        this.speed += 0.2;
        console.log(`🎉 LEVEL UP! Ratinho agora é nível ${this.level}!`);
    }

    collectResource() {
        this.addExperience(10);
    }
}

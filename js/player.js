class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 120;  // Largura visual
        this.height = 120; // Altura visual
        this.speed = 4;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Informações do jogador
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        
        // Sistema de Animação
        this.direction = 'right';
        this.isMoving = false;
        this.isAttacking = false;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 140;
        
        // Configuração das Sprite Sheets
        this.animations = {
            idle: {
                loaded: false,
                image: null,
                frames: 1,
                frameWidth: 0,
                frameHeight: 0,
                loop: true,
                vertical: false
            },
            walk: {
                loaded: false,
                image: null,
                frames: 1,
                frameWidth: 0,   // Será calculado
                frameHeight: 0,  // Será calculado
                loop: true,
                // ⚠️ ATENÇÃO AQUI: 
                // Se sua imagem é uma TORRE (vertical), mude para true. 
                // Se é uma TIRA (horizontal), deixe false.
                vertical: false 
            },
            attack: {
                loaded: false,
                image: null,
                frames: 5,
                frameWidth: 0,
                frameHeight: 0,
                loop: false,
                vertical: false
            }
        };

        this.currentAnimation = 'idle';
        this.loadAnimations();
    }

    loadAnimations() {
        const animPaths = {
            idle: 'assets/images/rat-idle.png',
            walk: 'assets/images/rat-walk.png',
            attack: 'assets/images/rat-attack.png'
        };

        for (const [animName, path] of Object.entries(animPaths)) {
            this.loadAnimation(animName, path);
        }
    }

    // --- CORREÇÃO 1: Lógica de carregamento vertical/horizontal ---
    loadAnimation(animName, path) {
        const img = new Image();
        
        img.onload = () => {
            const anim = this.animations[animName];
            anim.image = img;
            anim.loaded = true;
            
            // Calcula tamanho do frame baseado na orientação
            if (anim.frames > 1) {
                if (anim.vertical) {
                    // Vertical: Largura total, Altura dividida
                    anim.frameWidth = img.width;
                    anim.frameHeight = img.height / anim.frames;
                } else {
                    // Horizontal: Largura dividida, Altura total
                    anim.frameWidth = img.width / anim.frames;
                    anim.frameHeight = img.height;
                }
            } else {
                // Frame único
                anim.frameWidth = img.width;
                anim.frameHeight = img.height;
            }
            
            console.log(`✅ ${animName} carregada: ${anim.frameWidth}x${anim.frameHeight}px (Vertical: ${anim.vertical})`);
        };
        
        img.onerror = () => {
            console.warn(`⚠️ Erro ao carregar imagem: ${path}`);
        };
        
        img.src = path;
    }

    updateAnimation(deltaTime) {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;

        this.frameTimer += deltaTime;

        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame++;

            if (this.currentFrame >= anim.frames) {
                if (anim.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = anim.frames - 1;
                    if (this.currentAnimation === 'attack') {
                        this.isAttacking = false;
                        this.setAnimation('idle');
                    }
                }
            }
        }
    }

    setAnimation(animName) {
        if (this.currentAnimation !== animName && !this.isAttacking) {
            this.currentAnimation = animName;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.currentAnimation = 'attack';
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    handleInput(keys) {
        if (this.isAttacking) {
            this.velocityX = 0;
            this.velocityY = 0;
            
            if (keys['w'] || keys['ArrowUp']) this.velocityY = -this.speed * 0.5;
            if (keys['s'] || keys['ArrowDown']) this.velocityY = this.speed * 0.5;
            if (keys['a'] || keys['ArrowLeft']) {
                this.velocityX = -this.speed * 0.5;
                this.direction = 'left';
            }
            if (keys['d'] || keys['ArrowRight']) {
                this.velocityX = this.speed * 0.5;
                this.direction = 'right';
            }
            
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

        if ((keys[' '] || keys['x'] || keys['X']) && !this.isAttacking) {
            this.attack();
            return;
        }

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

        if (this.isMoving) {
            this.setAnimation('walk');
        } else {
            this.setAnimation('idle');
        }

        if (this.velocityX !== 0 && this.velocityY !== 0) {
            const factor = Math.sqrt(2) / 2;
            this.velocityX *= factor;
            this.velocityY *= factor;
        }
    }

    update(canvas, deltaTime) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;

        this.updateAnimation(deltaTime);
    }

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

        // Verifica validade da animação
        if (anim && anim.loaded && anim.image && anim.frameWidth > 0 && anim.frameHeight > 0) {
            
            // --- CORREÇÃO 2: Cálculo correto das coordenadas de recorte ---
            let frameX, frameY;
            
            if (anim.vertical) {
                // Se for vertical: X fixo, Y muda
                frameX = 0;
                frameY = this.currentFrame * anim.frameHeight;
            } else {
                // Se for horizontal: X muda, Y fixo
                frameX = this.currentFrame * anim.frameWidth;
                frameY = 0;
            }

            ctx.save();

            // Espelhamento Horizontal
            if (this.direction === 'left') {
                ctx.translate(this.x + this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(
                    anim.image,
                    frameX, frameY,
                    anim.frameWidth, anim.frameHeight,
                    0, 0, // Desenha no 0,0 local (após translate)
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
            this.drawFallback(ctx);
        }

        this.drawLevelIndicator(ctx);
    }

    drawFallback(ctx) {
        ctx.fillStyle = '#8B7355';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.font = '35px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐀', this.x + this.width/2, this.y + this.height/2);
    }

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
        console.log(`🎉 LEVEL UP! Ratinho nível ${this.level}!`);
    }

    collectResource() {
        this.addExperience(10);
    }
}

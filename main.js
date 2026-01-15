"use strict";
class X7TWebsite {
    constructor() {
        this.mousePosition = { x: 0, y: 0 };
        this.glowElements = document.querySelectorAll('.glow');
        this.modCard = document.querySelector('.mod-card');
        this.featureCards = document.querySelectorAll('.feature-card');
        this.particlesContainer = document.getElementById('particles');
        this.loadingScreen = document.getElementById('loader');
        this.init();
    }
    init() {
        this.hideLoadingScreen();
        this.setupParallaxEffect();
        this.setupCardTilt();
        this.setupFeatureCards();
        this.setupSmoothReveal();
        this.setupCursorGlow();
        this.createParticles();
        this.setupNavbarScroll();
        this.setupSmoothScroll();
    }
    hideLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (this.loadingScreen) {
                    this.loadingScreen.classList.add('hidden');
                }
            }, 1500);
        });
    }
    setupParallaxEffect() {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX / window.innerWidth;
            this.mousePosition.y = e.clientY / window.innerHeight;
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    updateParallax() {
        this.glowElements.forEach((glow, index) => {
            const speed = (index + 1) * 30;
            const x = (this.mousePosition.x - 0.5) * speed;
            const y = (this.mousePosition.y - 0.5) * speed;
            glow.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    setupCardTilt() {
        if (!this.modCard)
            return;
        this.modCard.addEventListener('mousemove', (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });
        this.modCard.addEventListener('mouseleave', (e) => {
            const card = e.currentTarget;
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    }
    setupFeatureCards() {
        this.featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
    setupSmoothReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.feature-card, .mod-card, .section-title').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            observer.observe(el);
        });
    }
    setupCursorGlow() {
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(0, 212, 170, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(cursorGlow);
        let cursorX = 0, cursorY = 0;
        let currentX = 0, currentY = 0;
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });
        const animateCursor = () => {
            currentX += (cursorX - currentX) * 0.1;
            currentY += (cursorY - currentY) * 0.1;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
        });
    }
    createParticles() {
        if (!this.particlesContainer)
            return;
        const config = {
            count: 30,
            colors: ['#00d4aa', '#7c3aed', '#f472b6'],
            minSize: 2,
            maxSize: 6
        };
        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 15 + Math.random() * 10;
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;
            this.particlesContainer.appendChild(particle);
        }
    }
    setupNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar)
            return;
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(10, 10, 15, 0.98)';
                navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }
            else {
                navbar.style.background = 'linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.8) 50%, transparent 100%)';
                navbar.style.boxShadow = 'none';
            }
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            }
            else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        });
    }
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href') || '');
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}
class MagneticButton {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .discord-link, .github-link');
        this.init();
    }
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
}
class TextScramble {
    constructor(el) {
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.frameRequest = 0;
        this.frame = 0;
        this.queue = [];
        this.resolve = null;
        this.el = el;
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            }
            else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            }
            else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            if (this.resolve)
                this.resolve();
        }
        else {
            this.frameRequest = requestAnimationFrame(() => this.update());
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}
class TetrisGame {
    constructor(canvas) {
        this.blockSize = 24;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.gameLoop = null;
        this.dropInterval = 800;
        this.lastDrop = 0;
        this.keyHandler = null;
        this.animationFrame = null;
        this.colors = [
            { fill: '#00ffff', glow: 'rgba(0, 255, 255, 0.6)' },
            { fill: '#ffff00', glow: 'rgba(255, 255, 0, 0.6)' },
            { fill: '#aa00ff', glow: 'rgba(170, 0, 255, 0.6)' },
            { fill: '#ff7700', glow: 'rgba(255, 119, 0, 0.6)' },
            { fill: '#0077ff', glow: 'rgba(0, 119, 255, 0.6)' },
            { fill: '#00ff00', glow: 'rgba(0, 255, 0, 0.6)' },
            { fill: '#ff0055', glow: 'rgba(255, 0, 85, 0.6)' }
        ];
        this.pieces = [
            [[1, 1, 1, 1]],
            [[1, 1], [1, 1]],
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0, 0], [1, 1, 1]],
            [[0, 0, 1], [1, 1, 1]],
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1, 1], [1, 1, 0]]
        ];
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.holdCanvas = document.getElementById('holdCanvas');
        this.nextCtx = this.nextCanvas?.getContext('2d') || null;
        this.holdCtx = this.holdCanvas?.getContext('2d') || null;
        this.cols = canvas.width / this.blockSize;
        this.rows = canvas.height / this.blockSize;
        this.board = [];
        this.boardGlow = [];
        this.init();
    }
    init() {
        for (let r = 0; r < this.rows; r++) {
            this.board[r] = [];
            this.boardGlow[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.board[r][c] = 0;
                this.boardGlow[r][c] = 0;
            }
        }
        this.nextPiece = this.createPiece();
        this.spawnPiece();
        this.setupControls();
        this.setupMobileControls();
        this.start();
    }
    createPiece() {
        const idx = Math.floor(Math.random() * this.pieces.length);
        return {
            shape: this.pieces[idx].map(row => [...row]),
            color: this.colors[idx].fill,
            glowColor: this.colors[idx].glow,
            x: 0,
            y: 0,
            type: idx
        };
    }
    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        if (this.currentPiece) {
            this.currentPiece.x = Math.floor(this.cols / 2) - Math.ceil(this.currentPiece.shape[0].length / 2);
            this.currentPiece.y = 0;
        }
        this.canHold = true;
        this.drawNextPiece();
        if (this.collision()) {
            this.gameOver = true;
            this.showGameOver();
        }
    }
    collision(piece = null, offsetX = 0, offsetY = 0) {
        const p = piece || this.currentPiece;
        if (!p)
            return false;
        const shape = p.shape;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const newX = p.x + c + offsetX;
                    const newY = p.y + r + offsetY;
                    if (newX < 0 || newX >= this.cols || newY >= this.rows)
                        return true;
                    if (newY >= 0 && this.board[newY][newX])
                        return true;
                }
            }
        }
        return false;
    }
    merge() {
        if (!this.currentPiece)
            return;
        const shape = this.currentPiece.shape;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const y = this.currentPiece.y + r;
                    const x = this.currentPiece.x + c;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                        this.boardGlow[y][x] = this.currentPiece.glowColor;
                    }
                }
            }
        }
    }
    clearLines() {
        let linesCleared = 0;
        for (let r = this.rows - 1; r >= 0; r--) {
            let full = true;
            for (let c = 0; c < this.cols; c++) {
                if (!this.board[r][c]) {
                    full = false;
                    break;
                }
            }
            if (full) {
                this.board.splice(r, 1);
                this.board.unshift(new Array(this.cols).fill(0));
                this.boardGlow.splice(r, 1);
                this.boardGlow.unshift(new Array(this.cols).fill(0));
                linesCleared++;
                r++;
            }
        }
        const points = [0, 100, 300, 500, 800];
        this.score += (points[linesCleared] || 0) * this.level;
        this.lines += linesCleared;
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = Math.max(100, 800 - (this.level - 1) * 70);
        }
        this.updateStats();
    }
    updateStats() {
        const scoreEl = document.getElementById('tetrisScore');
        const levelEl = document.getElementById('tetrisLevel');
        const linesEl = document.getElementById('tetrisLines');
        if (scoreEl)
            scoreEl.textContent = this.score.toString();
        if (levelEl)
            levelEl.textContent = this.level.toString();
        if (linesEl)
            linesEl.textContent = this.lines.toString();
    }
    rotate() {
        if (!this.currentPiece)
            return;
        const shape = this.currentPiece.shape;
        const rotated = [];
        for (let c = 0; c < shape[0].length; c++) {
            rotated[c] = [];
            for (let r = shape.length - 1; r >= 0; r--) {
                rotated[c].push(shape[r][c]);
            }
        }
        const oldShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        const kicks = [0, 1, -1, 2, -2];
        let valid = false;
        for (const kick of kicks) {
            this.currentPiece.x += kick;
            if (!this.collision()) {
                valid = true;
                break;
            }
            this.currentPiece.x -= kick;
        }
        if (!valid)
            this.currentPiece.shape = oldShape;
    }
    move(dir) {
        if (!this.currentPiece)
            return;
        this.currentPiece.x += dir;
        if (this.collision())
            this.currentPiece.x -= dir;
    }
    drop() {
        if (!this.currentPiece)
            return;
        this.currentPiece.y++;
        if (this.collision()) {
            this.currentPiece.y--;
            this.merge();
            this.clearLines();
            this.spawnPiece();
        }
    }
    hardDrop() {
        if (!this.currentPiece)
            return;
        while (!this.collision()) {
            this.currentPiece.y++;
        }
        this.currentPiece.y--;
        this.merge();
        this.clearLines();
        this.spawnPiece();
    }
    hold() {
        if (!this.currentPiece || !this.canHold)
            return;
        this.canHold = false;
        if (this.holdPiece) {
            const temp = this.holdPiece;
            this.holdPiece = {
                shape: this.pieces[this.currentPiece.type].map(row => [...row]),
                color: this.currentPiece.color,
                glowColor: this.currentPiece.glowColor,
                x: 0,
                y: 0,
                type: this.currentPiece.type
            };
            this.currentPiece = temp;
            this.currentPiece.x = Math.floor(this.cols / 2) - Math.ceil(this.currentPiece.shape[0].length / 2);
            this.currentPiece.y = 0;
        }
        else {
            this.holdPiece = {
                shape: this.pieces[this.currentPiece.type].map(row => [...row]),
                color: this.currentPiece.color,
                glowColor: this.currentPiece.glowColor,
                x: 0,
                y: 0,
                type: this.currentPiece.type
            };
            this.spawnPiece();
        }
        this.drawHoldPiece();
    }
    getGhostY() {
        if (!this.currentPiece)
            return 0;
        let ghostY = this.currentPiece.y;
        while (!this.collision(this.currentPiece, 0, ghostY - this.currentPiece.y + 1)) {
            ghostY++;
        }
        return ghostY;
    }
    drawBlock(ctx, x, y, color, glow, size, ghost = false) {
        const padding = 1;
        if (!ghost) {
            ctx.shadowColor = glow;
            ctx.shadowBlur = 15;
        }
        ctx.fillStyle = ghost ? 'rgba(255, 255, 255, 0.15)' : color;
        ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);
        if (!ghost) {
            ctx.shadowBlur = 0;
            const gradient = ctx.createLinearGradient(x * size, y * size, x * size, y * size + size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * size + padding + 0.5, y * size + padding + 0.5, size - padding * 2 - 1, size - padding * 2 - 1);
        }
    }
    draw() {
        this.ctx.fillStyle = 'rgba(5, 5, 15, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(0, 212, 170, 0.1)';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c]) {
                    this.drawBlock(this.ctx, c, r, this.board[r][c], this.boardGlow[r][c], this.blockSize);
                }
            }
        }
        if (this.currentPiece && !this.gameOver) {
            const ghostY = this.getGhostY();
            const shape = this.currentPiece.shape;
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c]) {
                        this.drawBlock(this.ctx, this.currentPiece.x + c, ghostY + r, this.currentPiece.color, this.currentPiece.glowColor, this.blockSize, true);
                    }
                }
            }
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c]) {
                        this.drawBlock(this.ctx, this.currentPiece.x + c, this.currentPiece.y + r, this.currentPiece.color, this.currentPiece.glowColor, this.blockSize);
                    }
                }
            }
        }
        if (this.paused && !this.gameOver) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#00d4aa';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = '#888';
            this.ctx.fillText('Press P to continue', this.canvas.width / 2, this.canvas.height / 2 + 30);
        }
    }
    drawNextPiece() {
        if (!this.nextCtx || !this.nextPiece)
            return;
        this.nextCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.nextCtx.fillRect(0, 0, 80, 80);
        const shape = this.nextPiece.shape;
        const size = 18;
        const offsetX = (80 - shape[0].length * size) / 2;
        const offsetY = (80 - shape.length * size) / 2;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const x = offsetX + c * size;
                    const y = offsetY + r * size;
                    this.nextCtx.shadowColor = this.nextPiece.glowColor;
                    this.nextCtx.shadowBlur = 10;
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(x + 1, y + 1, size - 2, size - 2);
                    this.nextCtx.shadowBlur = 0;
                }
            }
        }
    }
    drawHoldPiece() {
        if (!this.holdCtx)
            return;
        this.holdCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.holdCtx.fillRect(0, 0, 80, 80);
        if (!this.holdPiece)
            return;
        const shape = this.holdPiece.shape;
        const size = 18;
        const offsetX = (80 - shape[0].length * size) / 2;
        const offsetY = (80 - shape.length * size) / 2;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const x = offsetX + c * size;
                    const y = offsetY + r * size;
                    this.holdCtx.shadowColor = this.canHold ? this.holdPiece.glowColor : 'rgba(100, 100, 100, 0.3)';
                    this.holdCtx.shadowBlur = 10;
                    this.holdCtx.fillStyle = this.canHold ? this.holdPiece.color : '#555';
                    this.holdCtx.fillRect(x + 1, y + 1, size - 2, size - 2);
                    this.holdCtx.shadowBlur = 0;
                }
            }
        }
    }
    showGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ff4757';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(255, 71, 87, 0.8)';
        this.ctx.shadowBlur = 20;
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#00d4aa';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillStyle = '#888';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Click to restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.canvas.onclick = () => this.restart();
    }
    restart() {
        this.canvas.onclick = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 800;
        this.gameOver = false;
        this.paused = false;
        this.holdPiece = null;
        this.canHold = true;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.board[r][c] = 0;
                this.boardGlow[r][c] = 0;
            }
        }
        this.updateStats();
        if (this.holdCtx) {
            this.holdCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.holdCtx.fillRect(0, 0, 80, 80);
        }
        this.nextPiece = this.createPiece();
        this.spawnPiece();
    }
    setupControls() {
        this.keyHandler = (e) => {
            if (this.gameOver)
                return;
            if (e.key.toLowerCase() === 'p') {
                this.paused = !this.paused;
                return;
            }
            if (this.paused)
                return;
            switch (e.key) {
                case 'ArrowLeft':
                    this.move(-1);
                    break;
                case 'ArrowRight':
                    this.move(1);
                    break;
                case 'ArrowDown':
                    this.drop();
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case ' ':
                    e.preventDefault();
                    this.hardDrop();
                    break;
                case 'c':
                case 'C':
                    this.hold();
                    break;
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }
    setupMobileControls() {
        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');
        const btnRotate = document.getElementById('btnRotate');
        const btnDown = document.getElementById('btnDown');
        const btnDrop = document.getElementById('btnDrop');
        btnLeft?.addEventListener('click', () => !this.paused && !this.gameOver && this.move(-1));
        btnRight?.addEventListener('click', () => !this.paused && !this.gameOver && this.move(1));
        btnRotate?.addEventListener('click', () => !this.paused && !this.gameOver && this.rotate());
        btnDown?.addEventListener('click', () => !this.paused && !this.gameOver && this.drop());
        btnDrop?.addEventListener('click', () => !this.paused && !this.gameOver && this.hardDrop());
    }
    start() {
        const gameStep = (timestamp) => {
            if (!this.gameOver && !this.paused) {
                if (timestamp - this.lastDrop > this.dropInterval) {
                    this.drop();
                    this.lastDrop = timestamp;
                }
            }
            this.draw();
            this.animationFrame = requestAnimationFrame(gameStep);
        };
        this.animationFrame = requestAnimationFrame(gameStep);
    }
    stop() {
        if (this.animationFrame)
            cancelAnimationFrame(this.animationFrame);
        if (this.keyHandler)
            document.removeEventListener('keydown', this.keyHandler);
    }
}
let tetrisGame = null;
function openTetris() {
    const overlay = document.getElementById('tetrisOverlay');
    if (overlay)
        overlay.classList.add('active');
    const scoreEl = document.getElementById('tetrisScore');
    if (scoreEl)
        scoreEl.textContent = '0';
    const canvas = document.getElementById('tetrisCanvas');
    if (canvas)
        tetrisGame = new TetrisGame(canvas);
}
function closeTetris() {
    const overlay = document.getElementById('tetrisOverlay');
    if (overlay)
        overlay.classList.remove('active');
    if (tetrisGame) {
        tetrisGame.stop();
        tetrisGame = null;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new X7TWebsite();
    new MagneticButton();
    const tetrisTrigger = document.getElementById('tetrisTrigger');
    if (tetrisTrigger) {
        tetrisTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openTetris();
        });
    }
    const tetrisClose = document.getElementById('tetrisClose');
    if (tetrisClose) {
        tetrisClose.addEventListener('click', closeTetris);
    }
    const tetrisOverlay = document.getElementById('tetrisOverlay');
    if (tetrisOverlay) {
        tetrisOverlay.addEventListener('click', (e) => {
            if (e.target === tetrisOverlay)
                closeTetris();
        });
    }
    const style = document.createElement('style');
    style.textContent = `
        .scramble {
            color: var(--primary);
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const mouseEvent = e;
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = mouseEvent.clientX - rect.left - size / 2;
            const y = mouseEvent.clientY - rect.top - size / 2;
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

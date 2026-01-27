// vfx.js - Enhanced Visual Effects for Tenchu Shiren

let vfxCanvas, vfxCtx;
let particles = [];
let bloodSplatters = [];
let isVFXActive = false;

// Initialize VFX system
function initVFX() {
    console.log("Initializing VFX system...");
    
    // Create canvas if it doesn't exist
    if (!document.getElementById('vfx-canvas')) {
        vfxCanvas = document.createElement('canvas');
        vfxCanvas.id = 'vfx-canvas';
        vfxCanvas.style.position = 'fixed';
        vfxCanvas.style.top = '0';
        vfxCanvas.style.left = '0';
        vfxCanvas.style.width = '100%';
        vfxCanvas.style.height = '100%';
        vfxCanvas.style.pointerEvents = 'none';
        vfxCanvas.style.zIndex = '1';
        document.body.appendChild(vfxCanvas);
    } else {
        vfxCanvas = document.getElementById('vfx-canvas');
    }
    
    vfxCtx = vfxCanvas.getContext('2d');
    resizeCanvas();
    
    // Create blood overlay if it doesn't exist
    if (!document.getElementById('blood-overlay')) {
        const bloodOverlay = document.createElement('div');
        bloodOverlay.id = 'blood-overlay';
        document.body.appendChild(bloodOverlay);
    }
    
    // Create particles container if it doesn't exist
    if (!document.getElementById('particles-container')) {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'particles-container';
        document.body.appendChild(particlesContainer);
    }
    
    // Start animation loop
    isVFXActive = true;
    requestAnimationFrame(animateVFX);
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Create initial background particles
    createBackgroundParticles(50);
    
    console.log("VFX system initialized");
}

// Resize canvas to match window
function resizeCanvas() {
    if (vfxCanvas) {
        vfxCanvas.width = window.innerWidth;
        vfxCanvas.height = window.innerHeight;
    }
}

// Animation loop
function animateVFX() {
    if (!isVFXActive || !vfxCtx) return;
    
    // Clear canvas with fade effect
    vfxCtx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    vfxCtx.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height);
    
    // Update and draw particles
    updateParticles();
    
    // Update and draw blood splatters
    updateBloodSplatters();
    
    requestAnimationFrame(animateVFX);
}

// Particle system
class Particle {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = this.getColor();
        this.life = 1;
        this.decay = 0.01 + Math.random() * 0.02;
        this.angle = 0;
        this.rotation = Math.random() * 0.05 - 0.025;
    }
    
    getColor() {
        switch(this.type) {
            case 'blood':
                return `rgba(${139 + Math.random() * 116}, 0, 0, ${0.7 + Math.random() * 0.3})`;
            case 'gold':
                return `rgba(212, 175, 55, ${0.5 + Math.random() * 0.5})`;
            case 'smoke':
                return `rgba(136, 136, 136, ${0.3 + Math.random() * 0.3})`;
            default:
                const colors = [
                    'rgba(139, 0, 0, 0.8)',
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(255, 255, 255, 0.6)'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
        }
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.rotation;
        this.life -= this.decay;
        this.size *= 0.99;
    }
    
    draw() {
        vfxCtx.save();
        vfxCtx.globalAlpha = this.life;
        vfxCtx.fillStyle = this.color;
        vfxCtx.translate(this.x, this.y);
        vfxCtx.rotate(this.angle);
        
        if (this.type === 'blood') {
            // Blood particles are irregular shapes
            vfxCtx.beginPath();
            vfxCtx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
            vfxCtx.fill();
        } else {
            // Other particles are squares
            vfxCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        }
        
        vfxCtx.restore();
    }
}

// Blood splatter class
class BloodSplatter {
    constructor(x, y, intensity = 1) {
        this.x = x;
        this.y = y;
        this.intensity = intensity;
        this.droplets = [];
        this.life = 1;
        this.decay = 0.005;
        this.createDroplets();
    }
    
    createDroplets() {
        const count = 20 + Math.floor(this.intensity * 30);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 * this.intensity;
            const size = 2 + Math.random() * 8 * this.intensity;
            
            this.droplets.push({
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance,
                size: size,
                angle: angle,
                distance: distance,
                speed: 0.5 + Math.random() * 2
            });
        }
    }
    
    update() {
        this.life -= this.decay;
        
        // Update droplets
        for (let droplet of this.droplets) {
            droplet.y += droplet.speed; // Blood drips down
            droplet.size *= 0.995; // Slowly shrink
        }
        
        return this.life > 0;
    }
    
    draw() {
        vfxCtx.save();
        vfxCtx.globalAlpha = this.life;
        
        // Draw droplets
        for (let droplet of this.droplets) {
            const alpha = this.life * (0.3 + Math.random() * 0.7);
            vfxCtx.fillStyle = `rgba(139, 0, 0, ${alpha})`;
            
            // Create blood droplet shape
            vfxCtx.beginPath();
            vfxCtx.ellipse(
                droplet.x, 
                droplet.y, 
                droplet.size, 
                droplet.size * 0.6, 
                droplet.angle, 
                0, 
                Math.PI * 2
            );
            vfxCtx.fill();
            
            // Add highlight
            vfxCtx.fillStyle = `rgba(255, 100, 100, ${alpha * 0.3})`;
            vfxCtx.beginPath();
            vfxCtx.ellipse(
                droplet.x - droplet.size * 0.3, 
                droplet.y - droplet.size * 0.3, 
                droplet.size * 0.3, 
                droplet.size * 0.2, 
                0, 
                0, 
                Math.PI * 2
            );
            vfxCtx.fill();
        }
        
        vfxCtx.restore();
    }
}

// Create background particles
function createBackgroundParticles(count) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            Math.random() * vfxCanvas.width,
            Math.random() * vfxCanvas.height,
            Math.random() > 0.7 ? 'blood' : (Math.random() > 0.5 ? 'gold' : 'smoke')
        ));
    }
}

// Update all particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    // Occasionally add new background particles
    if (particles.length < 50 && Math.random() < 0.1) {
        particles.push(new Particle(
            Math.random() * vfxCanvas.width,
            vfxCanvas.height + 10,
            Math.random() > 0.7 ? 'blood' : 'smoke'
        ));
    }
}

// Update blood splatters
function updateBloodSplatters() {
    for (let i = bloodSplatters.length - 1; i >= 0; i--) {
        if (!bloodSplatters[i].update()) {
            bloodSplatters.splice(i, 1);
        } else {
            bloodSplatters[i].draw();
        }
    }
}

// Create particle burst
function createParticleBurst(x, y, count = 30, type = 'normal') {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, type));
    }
}

// Create blood splatter effect
function createBloodSplatter(x, y, intensity = 1) {
    bloodSplatters.push(new BloodSplatter(x, y, intensity));
    
    // Also create particles
    createParticleBurst(x, y, 15, 'blood');
}

// Create slash effect
function createSlashEffect(x1, y1, x2, y2, color = '#ff0000') {
    const slash = {
        x1, y1, x2, y2,
        color: color,
        life: 1,
        decay: 0.03,
        width: 5
    };
    
    // Animation function
    function animateSlash() {
        if (slash.life <= 0) return;
        
        vfxCtx.save();
        vfxCtx.globalAlpha = slash.life;
        vfxCtx.strokeStyle = slash.color;
        vfxCtx.lineWidth = slash.width;
        vfxCtx.lineCap = 'round';
        vfxCtx.shadowBlur = 20;
        vfxCtx.shadowColor = slash.color;
        
        vfxCtx.beginPath();
        vfxCtx.moveTo(slash.x1, slash.y1);
        vfxCtx.lineTo(slash.x2, slash.y2);
        vfxCtx.stroke();
        
        vfxCtx.restore();
        
        slash.life -= slash.decay;
        
        if (slash.life > 0) {
            requestAnimationFrame(animateSlash);
        }
    }
    
    animateSlash();
    
    // Create particles along the slash
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = slash.x1 + (slash.x2 - slash.x1) * t;
        const y = slash.y1 + (slash.y2 - slash.y1) * t;
        createParticleBurst(x, y, 2, 'blood');
    }
}

// Create screen transition effect
function createScreenTransition(type) {
    switch(type) {
        case 'bloodWave':
            createBloodWave();
            break;
        case 'smokeScreen':
            createSmokeScreen();
            break;
        case 'goldFlash':
            createGoldFlash();
            break;
    }
}

// Blood wave effect
function createBloodWave() {
    const wave = {
        y: 0,
        height: 100,
        speed: 20,
        life: 1
    };
    
    function animateWave() {
        if (wave.y > vfxCanvas.height + wave.height) return;
        
        vfxCtx.save();
        vfxCtx.globalAlpha = 0.3;
        vfxCtx.fillStyle = '#8b0000';
        
        // Create gradient for wave
        const gradient = vfxCtx.createLinearGradient(0, wave.y, 0, wave.y + wave.height);
        gradient.addColorStop(0, 'rgba(139, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
        
        vfxCtx.fillStyle = gradient;
        vfxCtx.fillRect(0, wave.y, vfxCanvas.width, wave.height);
        
        vfxCtx.restore();
        
        wave.y += wave.speed;
        requestAnimationFrame(animateWave);
    }
    
    animateWave();
}

// Smoke screen effect
function createSmokeScreen() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(
            Math.random() * vfxCanvas.width,
            vfxCanvas.height + 10,
            'smoke'
        ));
    }
}

// Gold flash effect
function createGoldFlash() {
    const flash = {
        life: 1,
        decay: 0.05
    };
    
    function animateFlash() {
        if (flash.life <= 0) return;
        
        vfxCtx.save();
        vfxCtx.globalAlpha = flash.life * 0.3;
        vfxCtx.fillStyle = '#d4af37';
        vfxCtx.fillRect(0, 0, vfxCanvas.width, vfxCanvas.height);
        vfxCtx.restore();
        
        flash.life -= flash.decay;
        
        if (flash.life > 0) {
            requestAnimationFrame(animateFlash);
        }
    }
    
    animateFlash();
    createParticleBurst(vfxCanvas.width/2, vfxCanvas.height/2, 50, 'gold');
}

// Create floating kanji characters
function createFloatingKanji() {
    const kanji = ['忍', '殺', '影', '刀', '血', '闇', '鬼', '斬'];
    const kanjiElement = document.createElement('div');
    kanjiElement.className = 'floating-kanji';
    kanjiElement.textContent = kanji[Math.floor(Math.random() * kanji.length)];
    kanjiElement.style.cssText = `
        position: fixed;
        color: rgba(139, 0, 0, 0.3);
        font-size: ${40 + Math.random() * 60}px;
        font-family: 'Noto Sans JP', sans-serif;
        pointer-events: none;
        z-index: 0;
        animation: floatKanji ${15 + Math.random() * 15}s linear infinite;
    `;
    
    document.getElementById('particles-container').appendChild(kanjiElement);
    
    // Set random position
    kanjiElement.style.left = `${Math.random() * 100}%`;
    kanjiElement.style.top = `${Math.random() * 100}%`;
    
    // Remove after animation
    setTimeout(() => {
        if (kanjiElement.parentNode) {
            kanjiElement.parentNode.removeChild(kanjiElement);
        }
    }, 20000);
    
    // Add CSS animation
    if (!document.querySelector('#kanji-animation')) {
        const style = document.createElement('style');
        style.id = 'kanji-animation';
        style.textContent = `
            @keyframes floatKanji {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Create multiple floating kanji
function createKanjiStorm(count = 10) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => createFloatingKanji(), i * 300);
    }
}

// VFX for game events
function createGameVFX(event, data = {}) {
    switch(event) {
        case 'correct':
            createSlashEffect(
                0, 0,
                vfxCanvas.width, vfxCanvas.height,
                '#00ff00'
            );
            createParticleBurst(vfxCanvas.width/2, vfxCanvas.height/2, 20, 'gold');
            break;
            
        case 'incorrect':
            createSlashEffect(
                vfxCanvas.width, 0,
                0, vfxCanvas.height,
                '#ff0000'
            );
            createBloodSplatter(vfxCanvas.width/2, vfxCanvas.height/2, 0.5);
            break;
            
        case 'screenChange':
            createScreenTransition('bloodWave');
            break;
            
        case 'menuOpen':
            createKanjiStorm(5);
            createGoldFlash();
            break;
            
        case 'gameStart':
            createScreenTransition('smokeScreen');
            setTimeout(() => createKanjiStorm(3), 500);
            break;
            
        case 'victory':
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createSlashEffect(
                        Math.random() * vfxCanvas.width,
                        Math.random() * vfxCanvas.height,
                        Math.random() * vfxCanvas.width,
                        Math.random() * vfxCanvas.height,
                        '#d4af37'
                    );
                }, i * 200);
            }
            createParticleBurst(vfxCanvas.width/2, vfxCanvas.height/2, 100, 'gold');
            break;
            
        case 'defeat':
            createBloodSplatter(vfxCanvas.width/2, vfxCanvas.height/2, 1);
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createBloodSplatter(
                        Math.random() * vfxCanvas.width,
                        Math.random() * vfxCanvas.height,
                        0.3
                    );
                }, i * 300);
            }
            break;
            
        case 'appreciation':
            createGoldFlash();
            createKanjiStorm(8);
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(
                    vfxCanvas.width/2,
                    vfxCanvas.height/2,
                    'gold'
                ));
            }
            break;
    }
}

// Export functions
window.initVFX = initVFX;
window.createGameVFX = createGameVFX;
window.createBloodSplatter = createBloodSplatter;
window.createSlashEffect = createSlashEffect;
window.createParticleBurst = createParticleBurst;
window.createKanjiStorm = createKanjiStorm;

console.log("VFX system loaded");
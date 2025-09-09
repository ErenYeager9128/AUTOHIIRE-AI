/**
 * AutoHire AI - Particles System
 * Interactive particle background with 3D effects
 */

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isActive = true;
        this.animationId = null;
        
        this.config = {
            particleCount: 100,
            particleSize: { min: 1, max: 3 },
            particleSpeed: { min: 0.5, max: 2 },
            particleOpacity: { min: 0.1, max: 0.8 },
            connectionDistance: 150,
            connectionOpacity: 0.3,
            mouseInfluence: 100,
            mouseForce: 0.5
        };
        
        this.init();
    }
    
    init() {
        console.log('🌟 Initializing Particle System...');
        
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
        
        console.log('✅ Particle System initialized successfully!');
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            console.warn('Particle canvas not found, creating fallback');
            this.createFallbackCanvas();
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Set canvas styles
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
    }
    
    createFallbackCanvas() {
        const container = document.getElementById('particle-background');
        if (!container) return;
        
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * (this.canvas?.width || window.innerWidth),
                Math.random() * (this.canvas?.height || window.innerHeight),
                this.config
            ));
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouseX = 0;
            this.mouseY = 0;
        });
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.update(this.mouseX, this.mouseY, this.config);
        });
    }
    
    draw() {
        if (!this.ctx || !this.canvas) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
        
        // Draw connections
        this.drawConnections();
    }
    
    drawConnections() {
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${this.config.connectionOpacity})`;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const distance = this.getDistance(
                    this.particles[i].x,
                    this.particles[i].y,
                    this.particles[j].x,
                    this.particles[j].y
                );
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance;
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * this.config.connectionOpacity})`;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Public methods
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.createParticles();
    }
    
    setParticleCount(count) {
        this.config.particleCount = count;
        this.createParticles();
    }
    
    setSpeed(speed) {
        this.config.particleSpeed = speed;
    }
    
    setMouseInfluence(influence) {
        this.config.mouseInfluence = influence;
    }
    
    pause() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    resume() {
        this.isActive = true;
        this.animate();
    }
    
    destroy() {
        this.pause();
        this.particles = [];
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * (Math.random() * (config.particleSpeed.max - config.particleSpeed.min) + config.particleSpeed.min);
        this.vy = (Math.random() - 0.5) * (Math.random() * (config.particleSpeed.max - config.particleSpeed.min) + config.particleSpeed.min);
        this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
        this.opacity = Math.random() * (config.particleOpacity.max - config.particleOpacity.min) + config.particleOpacity.min;
        this.config = config;
        
        // Add some randomness to movement
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    }
    
    update(mouseX, mouseY, config) {
        // Mouse influence
        if (mouseX > 0 && mouseY > 0) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseInfluence) {
                const force = (config.mouseInfluence - distance) / config.mouseInfluence;
                this.vx += (dx / distance) * force * config.mouseForce;
                this.vy += (dy / distance) * force * config.mouseForce;
            }
        }
        
        // Add wobble effect
        this.wobble += this.wobbleSpeed;
        this.vx += Math.sin(this.wobble) * 0.1;
        this.vy += Math.cos(this.wobble) * 0.1;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x <= 0 || this.x >= window.innerWidth) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        }
        
        if (this.y <= 0 || this.y >= window.innerHeight) {
            this.vy *= -0.8;
            this.y = Math.max(0, Math.min(window.innerHeight, this.y));
        }
        
        // Dampen velocity
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Keep particles within bounds
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
    }
    
    draw(ctx) {
        ctx.save();
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        
        gradient.addColorStop(0, `rgba(0, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 255, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Advanced Particle Effects
class AdvancedParticleSystem extends ParticleSystem {
    constructor() {
        super();
        this.effects = [];
        this.initAdvancedFeatures();
    }
    
    initAdvancedFeatures() {
        // Add explosion effect
        this.addExplosionEffect();
        
        // Add trail effect
        this.addTrailEffect();
        
        // Add wave effect
        this.addWaveEffect();
    }
    
    addExplosionEffect() {
        const explosion = {
            x: 0,
            y: 0,
            particles: [],
            isActive: false,
            create: (x, y) => {
                explosion.x = x;
                explosion.y = y;
                explosion.isActive = true;
                
                // Create explosion particles
                for (let i = 0; i < 20; i++) {
                    explosion.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        life: 1,
                        decay: 0.02
                    });
                }
            },
            update: () => {
                if (!explosion.isActive) return;
                
                explosion.particles.forEach((particle, index) => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life -= particle.decay;
                    
                    if (particle.life <= 0) {
                        explosion.particles.splice(index, 1);
                    }
                });
                
                if (explosion.particles.length === 0) {
                    explosion.isActive = false;
                }
            },
            draw: (ctx) => {
                if (!explosion.isActive) return;
                
                explosion.particles.forEach(particle => {
                    ctx.save();
                    ctx.globalAlpha = particle.life;
                    ctx.fillStyle = `rgba(255, 255, 0, ${particle.life})`;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            }
        };
        
        this.effects.push(explosion);
    }
    
    addTrailEffect() {
        const trail = {
            points: [],
            maxPoints: 50,
            addPoint: (x, y) => {
                trail.points.push({ x, y, life: 1 });
                if (trail.points.length > trail.maxPoints) {
                    trail.points.shift();
                }
            },
            update: () => {
                trail.points.forEach(point => {
                    point.life -= 0.02;
                });
                trail.points = trail.points.filter(point => point.life > 0);
            },
            draw: (ctx) => {
                if (trail.points.length < 2) return;
                
                ctx.save();
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                
                ctx.beginPath();
                ctx.moveTo(trail.points[0].x, trail.points[0].y);
                
                for (let i = 1; i < trail.points.length; i++) {
                    const point = trail.points[i];
                    ctx.globalAlpha = point.life;
                    ctx.lineTo(point.x, point.y);
                }
                
                ctx.stroke();
                ctx.restore();
            }
        };
        
        this.effects.push(trail);
    }
    
    addWaveEffect() {
        const wave = {
            amplitude: 20,
            frequency: 0.02,
            speed: 0.05,
            time: 0,
            update: () => {
                wave.time += wave.speed;
            },
            draw: (ctx) => {
                ctx.save();
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                for (let x = 0; x < window.innerWidth; x += 5) {
                    const y = window.innerHeight / 2 + Math.sin(x * wave.frequency + wave.time) * wave.amplitude;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
                ctx.restore();
            }
        };
        
        this.effects.push(wave);
    }
    
    update() {
        super.update();
        
        // Update effects
        this.effects.forEach(effect => {
            if (effect.update) effect.update();
        });
    }
    
    draw() {
        super.draw();
        
        // Draw effects
        this.effects.forEach(effect => {
            if (effect.draw) effect.draw(this.ctx);
        });
    }
    
    triggerExplosion(x, y) {
        const explosion = this.effects.find(effect => effect.create);
        if (explosion) {
            explosion.create(x, y);
        }
    }
    
    addTrailPoint(x, y) {
        const trail = this.effects.find(effect => effect.addPoint);
        if (trail) {
            trail.addPoint(x, y);
        }
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize basic particle system
    window.particleSystem = new ParticleSystem();
    
    // Initialize advanced particle system (optional)
    // window.advancedParticleSystem = new AdvancedParticleSystem();
    
    console.log('🌟 Particle systems initialized successfully!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        AdvancedParticleSystem,
        Particle
    };
}

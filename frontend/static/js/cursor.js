/**
 * AutoHire AI - Custom 3D Cursor
 * Interactive cursor with particle effects and 3D transformations
 */

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.cursorRing = null;
        this.cursorTrail = null;
        this.trailPoints = [];
        this.maxTrailPoints = 20;
        this.isVisible = false;
        this.isHovering = false;
        this.hoverTarget = null;
        
        this.config = {
            dotSize: 8,
            ringSize: 32,
            trailLength: 20,
            trailOpacity: 0.6,
            hoverScale: 1.5,
            hoverRotation: 15,
            smoothness: 0.15,
            magneticStrength: 0.3
        };
        
        this.init();
    }
    
    init() {
        console.log('🎯 Initializing Custom 3D Cursor...');
        
        this.setupCursor();
        this.bindEvents();
        this.animate();
        
        console.log('✅ Custom 3D Cursor initialized successfully!');
    }
    
    setupCursor() {
        this.cursor = document.getElementById('custom-cursor');
        if (!this.cursor) {
            console.warn('Custom cursor not found, creating fallback');
            this.createFallbackCursor();
            return;
        }
        
        this.cursorDot = this.cursor.querySelector('.cursor-dot');
        this.cursorRing = this.cursor.querySelector('.cursor-ring');
        this.cursorTrail = this.cursor.querySelector('.cursor-trail');
        
        // Set initial position
        this.cursor.style.left = '0px';
        this.cursor.style.top = '0px';
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Show custom cursor
        this.cursor.style.display = 'block';
        this.isVisible = true;
    }
    
    createFallbackCursor() {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.className = 'custom-cursor';
        cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-ring"></div>
            <div class="cursor-trail"></div>
        `;
        
        document.body.appendChild(cursor);
        this.cursor = cursor;
        this.cursorDot = cursor.querySelector('.cursor-dot');
        this.cursorRing = cursor.querySelector('.cursor-ring');
        this.cursorTrail = cursor.querySelector('.cursor-trail');
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Show custom cursor
        this.cursor.style.display = 'block';
        this.isVisible = true;
    }
    
    bindEvents() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.updatePosition(e.clientX, e.clientY);
            this.addTrailPoint(e.clientX, e.clientY);
        });
        
        // Mouse enter/leave document
        document.addEventListener('mouseenter', () => {
            this.show();
        });
        
        document.addEventListener('mouseleave', () => {
            this.hide();
        });
        
        // Hover effects
        document.addEventListener('mouseover', (e) => {
            this.onHover(e.target);
        });
        
        document.addEventListener('mouseout', (e) => {
            this.onHoverOut(e.target);
        });
        
        // Click effects
        document.addEventListener('mousedown', () => {
            this.onClick();
        });
        
        document.addEventListener('mouseup', () => {
            this.onClickEnd();
        });
        
        // Scroll effects
        window.addEventListener('scroll', () => {
            this.onScroll();
        });
        
        // Resize effects
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }
    
    updatePosition(x, y) {
        if (!this.isVisible) return;
        
        // Smooth movement
        const currentX = parseFloat(this.cursor.style.left) || 0;
        const currentY = parseFloat(this.cursor.style.top) || 0;
        
        const targetX = x - this.config.dotSize / 2;
        const targetY = y - this.config.dotSize / 2;
        
        const newX = currentX + (targetX - currentX) * this.config.smoothness;
        const newY = currentY + (targetY - currentY) * this.config.smoothness;
        
        // Apply magnetic effect if hovering over interactive elements
        if (this.isHovering && this.hoverTarget) {
            const magneticOffset = this.calculateMagneticOffset(x, y, this.hoverTarget);
            this.cursor.style.left = (newX + magneticOffset.x) + 'px';
            this.cursor.style.top = (newY + magneticOffset.y) + 'px';
        } else {
            this.cursor.style.left = newX + 'px';
            this.cursor.style.top = newY + 'px';
        }
        
        // Update trail
        this.updateTrail();
    }
    
    calculateMagneticOffset(x, y, target) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDistance = Math.max(rect.width, rect.height) / 2;
        
        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const offsetX = (centerX - x) * force * this.config.magneticStrength;
            const offsetY = (centerY - y) * force * this.config.magneticStrength;
            
            return { x: offsetX, y: offsetY };
        }
        
        return { x: 0, y: 0 };
    }
    
    addTrailPoint(x, y) {
        this.trailPoints.push({
            x: x - this.config.dotSize / 2,
            y: y - this.config.dotSize / 2,
            timestamp: Date.now()
        });
        
        // Limit trail length
        if (this.trailPoints.length > this.maxTrailPoints) {
            this.trailPoints.shift();
        }
    }
    
    updateTrail() {
        if (!this.cursorTrail || this.trailPoints.length < 2) return;
        
        // Create SVG path for trail
        let pathData = '';
        this.trailPoints.forEach((point, index) => {
            if (index === 0) {
                pathData += `M ${point.x} ${point.y}`;
            } else {
                pathData += ` L ${point.x} ${point.y}`;
            }
        });
        
        // Update trail element
        if (this.cursorTrail.tagName === 'svg') {
            const path = this.cursorTrail.querySelector('path');
            if (path) {
                path.setAttribute('d', pathData);
            }
        } else {
            // Fallback for non-SVG trail
            this.cursorTrail.style.background = `radial-gradient(circle at center, 
                rgba(0, 255, 255, ${this.config.trailOpacity}) 0%, 
                transparent 70%)`;
        }
    }
    
    onHover(target) {
        if (!this.isVisible) return;
        
        // Check if target is interactive
        if (this.isInteractiveElement(target)) {
            this.isHovering = true;
            this.hoverTarget = target;
            this.applyHoverEffect();
        }
    }
    
    onHoverOut(target) {
        if (!this.isVisible) return;
        
        if (this.isInteractiveElement(target)) {
            this.isHovering = false;
            this.hoverTarget = null;
            this.removeHoverEffect();
        }
    }
    
    isInteractiveElement(element) {
        const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
        const interactiveClasses = ['btn', 'button', 'link', 'interactive', 'clickable', 'hoverable'];
        
        return (
            interactiveTags.includes(element.tagName) ||
            interactiveClasses.some(cls => element.classList.contains(cls)) ||
            element.onclick !== null ||
            element.getAttribute('role') === 'button' ||
            element.getAttribute('tabindex') !== null
        );
    }
    
    applyHoverEffect() {
        if (!this.cursorDot || !this.cursorRing) return;
        
        // Scale effect
        this.cursorDot.style.transform = `scale(${this.config.hoverScale})`;
        this.cursorRing.style.transform = `scale(${this.config.hoverScale})`;
        
        // Rotation effect
        this.cursorRing.style.transform += ` rotate(${this.config.hoverRotation}deg)`;
        
        // Color change
        this.cursorDot.style.backgroundColor = 'var(--neon-primary)';
        this.cursorRing.style.borderColor = 'var(--neon-primary)';
        
        // Glow effect
        this.cursorDot.style.boxShadow = '0 0 20px var(--neon-primary)';
        this.cursorRing.style.boxShadow = '0 0 30px var(--neon-primary)';
    }
    
    removeHoverEffect() {
        if (!this.cursorDot || !this.cursorRing) return;
        
        // Reset scale
        this.cursorDot.style.transform = 'scale(1)';
        this.cursorRing.style.transform = 'scale(1) rotate(0deg)';
        
        // Reset colors
        this.cursorDot.style.backgroundColor = 'var(--neon-accent)';
        this.cursorRing.style.borderColor = 'var(--neon-accent)';
        
        // Reset glow
        this.cursorDot.style.boxShadow = '0 0 10px var(--neon-accent)';
        this.cursorRing.style.boxShadow = '0 0 15px var(--neon-accent)';
    }
    
    onClick() {
        if (!this.isVisible) return;
        
        // Click animation
        if (this.cursorDot) {
            this.cursorDot.style.transform = 'scale(0.8)';
        }
        
        if (this.cursorRing) {
            this.cursorRing.style.transform = 'scale(1.2)';
        }
        
        // Trigger particle explosion if available
        if (window.particleSystem && window.particleSystem.triggerExplosion) {
            const rect = this.cursor.getBoundingClientRect();
            window.particleSystem.triggerExplosion(rect.left, rect.top);
        }
    }
    
    onClickEnd() {
        if (!this.isVisible) return;
        
        // Reset click animation
        if (this.cursorDot) {
            this.cursorDot.style.transform = this.isHovering ? 
                `scale(${this.config.hoverScale})` : 'scale(1)';
        }
        
        if (this.cursorRing) {
            this.cursorRing.style.transform = this.isHovering ? 
                `scale(${this.config.hoverScale}) rotate(${this.config.hoverRotation}deg)` : 'scale(1) rotate(0deg)';
        }
    }
    
    onScroll() {
        // Add scroll effect to cursor
        if (this.cursorRing) {
            this.cursorRing.style.transform += ' rotate(5deg)';
            
            setTimeout(() => {
                if (this.cursorRing) {
                    this.cursorRing.style.transform = this.cursorRing.style.transform.replace(' rotate(5deg)', '');
                }
            }, 200);
        }
    }
    
    onResize() {
        // Recalculate positions after resize
        this.trailPoints = [];
    }
    
    show() {
        if (this.cursor) {
            this.cursor.style.opacity = '1';
            this.isVisible = true;
        }
    }
    
    hide() {
        if (this.cursor) {
            this.cursor.style.opacity = '0';
            this.isVisible = false;
        }
    }
    
    animate() {
        if (!this.isVisible) return;
        
        // Animate trail points
        this.trailPoints.forEach((point, index) => {
            const age = Date.now() - point.timestamp;
            const maxAge = 1000; // 1 second
            
            if (age > maxAge) {
                this.trailPoints.splice(index, 1);
            }
        });
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    // Public methods for external control
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    setTrailLength(length) {
        this.maxTrailPoints = length;
    }
    
    setSmoothness(smoothness) {
        this.config.smoothness = Math.max(0.01, Math.min(1, smoothness));
    }
    
    setMagneticStrength(strength) {
        this.config.magneticStrength = Math.max(0, Math.min(1, strength));
    }
    
    enableMagneticEffect() {
        this.config.magneticStrength = 0.3;
    }
    
    disableMagneticEffect() {
        this.config.magneticStrength = 0;
    }
    
    destroy() {
        // Reset cursor
        document.body.style.cursor = '';
        
        // Remove custom cursor
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        
        // Clear trail
        this.trailPoints = [];
    }
}

// Advanced cursor effects
class AdvancedCursor extends CustomCursor {
    constructor() {
        super();
        this.effects = [];
        this.initAdvancedFeatures();
    }
    
    initAdvancedFeatures() {
        // Add ripple effect
        this.addRippleEffect();
        
        // Add text effect
        this.addTextEffect();
        
        // Add sound effect
        this.addSoundEffect();
    }
    
    addRippleEffect() {
        const ripple = {
            isActive: false,
            x: 0,
            y: 0,
            radius: 0,
            maxRadius: 100,
            opacity: 1,
            speed: 5,
            
            trigger: (x, y) => {
                ripple.isActive = true;
                ripple.x = x;
                ripple.y = y;
                ripple.radius = 0;
                ripple.opacity = 1;
            },
            
            update: () => {
                if (!ripple.isActive) return;
                
                ripple.radius += ripple.speed;
                ripple.opacity -= 0.02;
                
                if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
                    ripple.isActive = false;
                }
            },
            
            draw: (ctx) => {
                if (!ripple.isActive) return;
                
                ctx.save();
                ctx.strokeStyle = `rgba(0, 255, 255, ${ripple.opacity})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        };
        
        this.effects.push(ripple);
    }
    
    addTextEffect() {
        const textEffect = {
            text: '',
            x: 0,
            y: 0,
            opacity: 0,
            isActive: false,
            
            show: (text, x, y) => {
                textEffect.text = text;
                textEffect.x = x;
                textEffect.y = y;
                textEffect.opacity = 1;
                textEffect.isActive = true;
                
                setTimeout(() => {
                    textEffect.hide();
                }, 2000);
            },
            
            hide: () => {
                textEffect.opacity = 0;
                textEffect.isActive = false;
            },
            
            update: () => {
                if (textEffect.isActive && textEffect.opacity > 0) {
                    textEffect.opacity -= 0.01;
                }
            },
            
            draw: (ctx) => {
                if (!textEffect.isActive || textEffect.opacity <= 0) return;
                
                ctx.save();
                ctx.fillStyle = `rgba(0, 255, 255, ${textEffect.opacity})`;
                ctx.font = '14px Orbitron, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(textEffect.text, textEffect.x, textEffect.y);
                ctx.restore();
            }
        };
        
        this.effects.push(textEffect);
    }
    
    addSoundEffect() {
        const soundEffect = {
            audioContext: null,
            oscillator: null,
            
            init: () => {
                try {
                    soundEffect.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    console.warn('Web Audio API not supported');
                }
            },
            
            play: (frequency = 440, duration = 0.1) => {
                if (!soundEffect.audioContext) return;
                
                try {
                    soundEffect.oscillator = soundEffect.audioContext.createOscillator();
                    const gainNode = soundEffect.audioContext.createGain();
                    
                    soundEffect.oscillator.connect(gainNode);
                    gainNode.connect(soundEffect.audioContext.destination);
                    
                    soundEffect.oscillator.frequency.setValueAtTime(frequency, soundEffect.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, soundEffect.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, soundEffect.audioContext.currentTime + duration);
                    
                    soundEffect.oscillator.start(soundEffect.audioContext.currentTime);
                    soundEffect.oscillator.stop(soundEffect.audioContext.currentTime + duration);
                } catch (e) {
                    console.warn('Sound effect failed:', e);
                }
            }
        };
        
        soundEffect.init();
        this.effects.push(soundEffect);
    }
    
    update() {
        super.update();
        
        // Update effects
        this.effects.forEach(effect => {
            if (effect.update) effect.update();
        });
    }
    
    draw(ctx) {
        super.draw(ctx);
        
        // Draw effects
        this.effects.forEach(effect => {
            if (effect.draw) effect.draw(ctx);
        });
    }
    
    // Enhanced public methods
    showText(text, x, y) {
        const textEffect = this.effects.find(effect => effect.show);
        if (textEffect) {
            textEffect.show(text, x, y);
        }
    }
    
    playSound(frequency, duration) {
        const soundEffect = this.effects.find(effect => effect.play);
        if (soundEffect) {
            soundEffect.play(frequency, duration);
        }
    }
}

// Initialize cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize basic custom cursor
    window.customCursor = new CustomCursor();
    
    // Initialize advanced cursor (optional)
    // window.advancedCursor = new AdvancedCursor();
    
    console.log('🎯 Custom cursors initialized successfully!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CustomCursor,
        AdvancedCursor
    };
}

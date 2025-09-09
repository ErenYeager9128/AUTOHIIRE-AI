/**
 * AutoHire AI - Animations Manager
 * Page transitions, scroll animations, and interactive effects
 */

class AnimationManager {
    constructor() {
        this.animations = [];
        this.intersectionObserver = null;
        this.scrollAnimations = [];
        this.pageTransitions = [];
        this.isAnimating = false;
        
        this.config = {
            scrollThreshold: 0.1,
            animationDuration: 800,
            staggerDelay: 100,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            enableScrollAnimations: true,
            enablePageTransitions: true,
            enableStaggeredAnimations: true
        };
        
        this.init();
    }
    
    init() {
        console.log('🎬 Initializing Animation Manager...');
        
        this.setupIntersectionObserver();
        this.bindEvents();
        this.initializePageAnimations();
        
        console.log('✅ Animation Manager initialized successfully!');
    }
    
    setupIntersectionObserver() {
        if (!this.config.enableScrollAnimations) return;
        
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerScrollAnimation(entry.target);
                    }
                });
            },
            {
                threshold: this.config.scrollThreshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    }
    
    bindEvents() {
        // Page load animations
        document.addEventListener('DOMContentLoaded', () => {
            this.animatePageLoad();
        });
        
        // Scroll animations
        if (this.config.enableScrollAnimations) {
            window.addEventListener('scroll', () => {
                this.handleScroll();
            });
        }
        
        // Page transition animations
        if (this.config.enablePageTransitions) {
            this.setupPageTransitions();
        }
        
        // Resize animations
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    initializePageAnimations() {
        // Find elements with animation classes
        this.findAnimatedElements();
        
        // Setup scroll animations
        this.setupScrollAnimations();
        
        // Setup entrance animations
        this.setupEntranceAnimations();
    }
    
    findAnimatedElements() {
        // Find elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-fade-in, .animate-slide-left, .animate-slide-right, ' +
            '.animate-slide-up, .animate-slide-down, .animate-scale-in, ' +
            '.animate-rotate-in, .animate-bounce-in, .animate-pulse, ' +
            '.animate-glow, .animate-float, .animate-spin, .animate-shimmer, ' +
            '.animate-typewriter, .animate-blink'
        );
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `all ${this.config.animationDuration}ms ${this.config.easing}`;
        });
    }
    
    setupScrollAnimations() {
        const scrollElements = document.querySelectorAll(
            '.scroll-animate, .parallax-3d, .tilt-3d, .float-3d'
        );
        
        scrollElements.forEach(element => {
            if (this.intersectionObserver) {
                this.intersectionObserver.observe(element);
            }
            
            this.scrollAnimations.push({
                element: element,
                type: this.getAnimationType(element),
                isAnimated: false
            });
        });
    }
    
    setupEntranceAnimations() {
        const entranceElements = document.querySelectorAll('.entrance-animation');
        
        entranceElements.forEach((element, index) => {
            if (this.config.enableStaggeredAnimations) {
                element.style.animationDelay = `${index * this.config.staggerDelay}ms`;
            }
            
            this.animations.push({
                element: element,
                type: 'entrance',
                isAnimated: false
            });
        });
    }
    
    getAnimationType(element) {
        if (element.classList.contains('parallax-3d')) return 'parallax';
        if (element.classList.contains('tilt-3d')) return 'tilt';
        if (element.classList.contains('float-3d')) return 'float';
        if (element.classList.contains('scroll-animate')) return 'scroll';
        
        return 'default';
    }
    
    animatePageLoad() {
        console.log('🎬 Starting page load animations...');
        
        // Animate header elements
        this.animateHeaderElements();
        
        // Animate main content with stagger
        this.animateMainContent();
        
        // Animate floating elements
        this.animateFloatingElements();
        
        // Trigger entrance animations
        this.triggerEntranceAnimations();
    }
    
    animateHeaderElements() {
        const headerElements = document.querySelectorAll('.page-header-3d *');
        
        headerElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    animateMainContent() {
        const mainElements = document.querySelectorAll('.page-content > *');
        
        mainElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, (index + 1) * 200);
        });
    }
    
    animateFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-elements > *');
        
        floatingElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, (index + 1) * 300);
        });
    }
    
    triggerEntranceAnimations() {
        this.animations.forEach((animation, index) => {
            if (animation.type === 'entrance') {
                setTimeout(() => {
                    this.animateElement(animation.element, 'entrance');
                }, index * this.config.staggerDelay);
            }
        });
    }
    
    triggerScrollAnimation(element) {
        const animation = this.scrollAnimations.find(a => a.element === element);
        
        if (animation && !animation.isAnimated) {
            animation.isAnimated = true;
            this.animateElement(element, animation.type);
        }
    }
    
    animateElement(element, type) {
        if (!element) return;
        
        switch (type) {
            case 'entrance':
                this.animateEntrance(element);
                break;
            case 'parallax':
                this.animateParallax(element);
                break;
            case 'tilt':
                this.animateTilt(element);
                break;
            case 'float':
                this.animateFloat(element);
                break;
            case 'scroll':
                this.animateScroll(element);
                break;
            default:
                this.animateDefault(element);
        }
    }
    
    animateEntrance(element) {
        element.classList.add('animate');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
    
    animateParallax(element) {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(window.pageYOffset * speed);
        
        element.style.transform = `translateY(${yPos}px)`;
    }
    
    animateTilt(element) {
        element.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg)';
    }
    
    animateFloat(element) {
        element.style.animation = 'float 3s ease-in-out infinite';
    }
    
    animateScroll(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
    }
    
    animateDefault(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
    
    handleScroll() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Update parallax elements
        this.updateParallaxElements();
        
        // Update scroll-triggered animations
        this.updateScrollAnimations();
        
        requestAnimationFrame(() => {
            this.isAnimating = false;
        });
    }
    
    updateParallaxElements() {
        const parallaxElements = document.querySelectorAll('.parallax-3d');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(window.pageYOffset * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    updateScrollAnimations() {
        const scrollElements = document.querySelectorAll('.scroll-animate');
        
        scrollElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    handleResize() {
        // Recalculate animation positions
        this.recalculateAnimations();
        
        // Update parallax elements
        this.updateParallaxElements();
    }
    
    recalculateAnimations() {
        // Recalculate positions for floating elements
        const floatingElements = document.querySelectorAll('.floating-elements > *');
        
        floatingElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            element.style.top = `${rect.top}px`;
            element.style.left = `${rect.left}px`;
        });
    }
    
    setupPageTransitions() {
        // Setup navigation link transitions
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) return;
                
                e.preventDefault();
                this.transitionToPage(link.getAttribute('href'));
            });
        });
    }
    
    transitionToPage(url) {
        if (!this.config.enablePageTransitions) {
            window.location.href = url;
            return;
        }
        
        // Start exit animation
        this.startExitAnimation(() => {
            // Navigate to new page
            window.location.href = url;
        });
    }
    
    startExitAnimation(callback) {
        const mainContent = document.querySelector('.main-3d');
        
        if (mainContent) {
            mainContent.style.transition = `all ${this.config.animationDuration}ms ${this.config.easing}`;
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(-50px)';
            
            setTimeout(callback, this.config.animationDuration);
        } else {
            callback();
        }
    }
    
    // Public methods for external control
    addAnimation(element, type, options = {}) {
        const animation = {
            element: element,
            type: type,
            options: options,
            isAnimated: false
        };
        
        this.animations.push(animation);
        
        if (type === 'scroll' && this.intersectionObserver) {
            this.intersectionObserver.observe(element);
        }
        
        return animation;
    }
    
    removeAnimation(element) {
        this.animations = this.animations.filter(a => a.element !== element);
        this.scrollAnimations = this.scrollAnimations.filter(a => a.element !== element);
        
        if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(element);
        }
    }
    
    triggerAnimation(element, type) {
        this.animateElement(element, type);
    }
    
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        if (newConfig.enableScrollAnimations !== undefined) {
            if (newConfig.enableScrollAnimations) {
                this.setupIntersectionObserver();
            } else {
                this.intersectionObserver?.disconnect();
            }
        }
    }
    
    pauseAnimations() {
        document.body.style.setProperty('--animation-play-state', 'paused');
    }
    
    resumeAnimations() {
        document.body.style.setProperty('--animation-play-state', 'running');
    }
    
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        this.animations = [];
        this.scrollAnimations = [];
        this.pageTransitions = [];
    }
}

// Advanced Animation Effects
class AdvancedAnimationManager extends AnimationManager {
    constructor() {
        super();
        this.effects = [];
        this.initAdvancedFeatures();
    }
    
    initAdvancedFeatures() {
        // Add morphing effects
        this.addMorphingEffects();
        
        // Add particle effects
        this.addParticleEffects();
        
        // Add sound effects
        this.addSoundEffects();
    }
    
    addMorphingEffects() {
        const morphing = {
            elements: [],
            isActive: false,
            
            addElement: (element) => {
                morphing.elements.push(element);
            },
            
            start: () => {
                morphing.isActive = true;
                morphing.elements.forEach(element => {
                    element.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.transform = 'scale(1.1) rotate(5deg)';
                });
            },
            
            stop: () => {
                morphing.isActive = false;
                morphing.elements.forEach(element => {
                    element.style.transform = 'scale(1) rotate(0deg)';
                });
            }
        };
        
        this.effects.push(morphing);
    }
    
    addParticleEffects() {
        const particles = {
            isActive: false,
            
            start: () => {
                particles.isActive = true;
                // Trigger particle system if available
                if (window.particleSystem) {
                    window.particleSystem.setParticleCount(200);
                }
            },
            
            stop: () => {
                particles.isActive = false;
                if (window.particleSystem) {
                    window.particleSystem.setParticleCount(100);
                }
            }
        };
        
        this.effects.push(particles);
    }
    
    addSoundEffects() {
        const sound = {
            audioContext: null,
            
            init: () => {
                try {
                    sound.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    console.warn('Web Audio API not supported');
                }
            },
            
            playTransition: () => {
                if (!sound.audioContext) return;
                
                try {
                    const oscillator = sound.audioContext.createOscillator();
                    const gainNode = sound.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(sound.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(440, sound.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(880, sound.audioContext.currentTime + 0.5);
                    
                    gainNode.gain.setValueAtTime(0.1, sound.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, sound.audioContext.currentTime + 0.5);
                    
                    oscillator.start(sound.audioContext.currentTime);
                    oscillator.stop(sound.audioContext.currentTime + 0.5);
                } catch (e) {
                    console.warn('Sound effect failed:', e);
                }
            }
        };
        
        sound.init();
        this.effects.push(sound);
    }
    
    // Enhanced public methods
    startMorphing() {
        const morphing = this.effects.find(effect => effect.start && effect.elements);
        if (morphing) {
            morphing.start();
        }
    }
    
    stopMorphing() {
        const morphing = this.effects.find(effect => effect.stop && effect.elements);
        if (morphing) {
            morphing.stop();
        }
    }
    
    startParticles() {
        const particles = this.effects.find(effect => effect.start && effect.isActive !== undefined);
        if (particles) {
            particles.start();
        }
    }
    
    stopParticles() {
        const particles = this.effects.find(effect => effect.stop && effect.isActive !== undefined);
        if (particles) {
            particles.stop();
        }
    }
    
    playTransitionSound() {
        const sound = this.effects.find(effect => effect.playTransition);
        if (sound) {
            sound.playTransition();
        }
    }
}

// Initialize animation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize basic animation manager
    window.animationManager = new AnimationManager();
    
    // Initialize advanced animation manager (optional)
    // window.advancedAnimationManager = new AdvancedAnimationManager();
    
    console.log('🎬 Animation managers initialized successfully!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationManager,
        AdvancedAnimationManager
    };
}

/**
 * AutoHire AI - Enhanced Animations JavaScript
 * Smooth and performant animations
 */

class EnhancedAnimations {
    constructor() {
        this.scrollObserver = null;
        this.init();
    }

    init() {
        this.initScrollReveal();
        this.initSmoothScroll();
        this.initTextReveal();
        this.initRippleEffect();
        this.initParallaxEffect();
        this.initMouseTracker();
        this.initIntersectionAnimations();
    }

    initScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            this.scrollObserver.observe(element);
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const targetPosition = target.offsetTop - 100;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initTextReveal() {
        const textElements = document.querySelectorAll('.text-reveal');

        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';

            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.animationDelay = `${index * 0.05}s`;
                element.appendChild(span);
            });
        });
    }

    initRippleEffect() {
        document.querySelectorAll('.ripple-effect').forEach(element => {
            element.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.className = 'ripple';

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    parallaxElements.forEach(element => {
                        const speed = element.dataset.speed || 0.5;
                        const yPos = -(scrolled * speed);
                        element.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    initMouseTracker() {
        const tracker = document.createElement('div');
        tracker.className = 'mouse-tracker';
        document.body.appendChild(tracker);

        let mouseX = 0, mouseY = 0;
        let trackerX = 0, trackerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateTracker = () => {
            const dx = mouseX - trackerX;
            const dy = mouseY - trackerY;

            trackerX += dx * 0.1;
            trackerY += dy * 0.1;

            tracker.style.left = trackerX + 'px';
            tracker.style.top = trackerY + 'px';

            requestAnimationFrame(updateTracker);
        };

        updateTracker();
    }

    initIntersectionAnimations() {
        const animatedElements = document.querySelectorAll('.fade-slide-in-up, .fade-slide-in-down');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            observer.observe(element);
        });
    }

    addStaggerAnimation(selector, animationClass, delay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    smoothScale(element, scale, duration = 300) {
        element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.transform = `scale(${scale})`;

        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration);
    }

    destroy() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
    }
}

window.EnhancedAnimations = EnhancedAnimations;

if (typeof initAnimations === 'undefined') {
    window.initAnimations = function() {
        window.enhancedAnimationsInstance = new EnhancedAnimations();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.enhancedAnimationsInstance) {
        window.enhancedAnimationsInstance = new EnhancedAnimations();
    }
});

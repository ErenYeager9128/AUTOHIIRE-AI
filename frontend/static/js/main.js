/**
 * AutoHire AI - Main JavaScript
 * 3D Interactive Elements and Dashboard Functionality
 */

// Global variables
let is3DEnabled = true;
let currentTheme = 'dark';
let isAnimating = false;

// Initialize main application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 AutoHire AI - Initializing 3D Career Hub...');
    
    // Initialize core functionality
    initCoreFeatures();
    
    // Initialize 3D effects
    if (is3DEnabled) {
        init3DEffects();
    }
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize theme system
    initThemeSystem();
    
    console.log('✅ AutoHire AI - 3D Career Hub initialized successfully!');
});

/**
 * Initialize core features
 */
function initCoreFeatures() {
    // Initialize navigation
    initNavigation();
    
    // Initialize notifications
    initNotificationSystem();
    
    // Initialize modals
    initModalSystem();
    
    // Initialize form handling
    initFormHandling();
}

/**
 * Initialize 3D effects
 */
function init3DEffects() {
    console.log('🎨 Initializing 3D effects...');
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize floating elements
    initFloatingElements();
    
    // Initialize 3D cards
    init3DCards();
    
    // Initialize particle system
    initParticleSystem();
    
    // Initialize custom cursor
    initCustomCursor();
}

/**
 * Initialize navigation
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentRoute = window.location.pathname;
    
    navLinks.forEach(link => {
        const route = link.getAttribute('data-route');
        if (route && currentRoute.includes(route)) {
            link.classList.add('active');
        }
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-3d');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('slow') ? 0.3 : 
                         element.classList.contains('fast') ? 0.8 : 0.5;
            
            element.style.transform = `translateZ(${rate * speed}px)`;
        });
    });
}

/**
 * Initialize floating elements
 */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-card, .floating-card-3d');
    
    floatingElements.forEach((element, index) => {
        // Set animation delay
        element.style.animationDelay = `${index * 0.5}s`;
        
        // Add mouse interaction
        element.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateZ(20px) rotateX(5deg) rotateY(5deg)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
        });
    });
}

/**
 * Initialize 3D cards
 */
function init3DCards() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            if (isAnimating) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

/**
 * Initialize particle system
 */
function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * Initialize custom cursor
 */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorRing = cursor.querySelector('.cursor-ring');
    const cursorTrail = cursor.querySelector('.cursor-trail');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorRing.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorTrail.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Add hover effects
    const interactiveElements = document.querySelectorAll('a, button, .card-3d, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover');
        });
    });
}

/**
 * Initialize notification system
 */
function initNotificationSystem() {
    window.showNotification = function(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification-3d ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    };
}

/**
 * Initialize modal system
 */
function initModalSystem() {
    window.showModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.hideModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
    
    // Close modal on backdrop click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-3d')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-3d.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
}

/**
 * Initialize form handling
 */
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                // Simulate form processing
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
}

/**
 * Initialize theme system
 */
function initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('autohire-theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('autohire-theme', newTheme);
    });
}

/**
 * Set theme
 */
function setTheme(theme) {
    currentTheme = theme;
    document.body.className = `cyberpunk-theme ${theme}-theme`;
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.btn-icon');
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    
    // Update CSS variables
    if (theme === 'light') {
        document.documentElement.style.setProperty('--bg-dark', '#f0f0f0');
        document.documentElement.style.setProperty('--bg-darker', '#e0e0e0');
        document.documentElement.style.setProperty('--text-primary', '#000000');
        document.documentElement.style.setProperty('--text-secondary', '#333333');
    } else {
        document.documentElement.style.setProperty('--bg-dark', '#0a0a0a');
        document.documentElement.style.setProperty('--bg-darker', '#050505');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#b0b0b0');
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Window resize
    window.addEventListener('resize', function() {
        // Recalculate 3D elements on resize
        if (is3DEnabled) {
            init3DEffects();
        }
    });
    
    // Scroll effects
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const nav = document.querySelector('.nav-3d');
        
        if (scrolled > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Performance optimization
    let ticking = false;
    
    function updateOnScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                // Update scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
}

/**
 * Utility functions
 */
window.utils = {
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Smooth scroll to element
    scrollTo: function(element, duration = 1000) {
        const targetPosition = element.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Generate random ID
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCoreFeatures,
        init3DEffects,
        initNavigation,
        initParallaxEffects,
        initFloatingElements,
        init3DCards,
        initParticleSystem,
        initCustomCursor,
        initNotificationSystem,
        initModalSystem,
        initFormHandling,
        initThemeSystem,
        utils
    };
}

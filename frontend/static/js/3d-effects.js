/**
 * AutoHire AI - 3D Effects JavaScript
 * Advanced 3D Transformations and Interactive Elements
 */

// 3D Effects Manager
class Effects3D {
    constructor() {
        this.isEnabled = true;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.elements = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        console.log('🎨 Initializing 3D Effects Manager...');
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);
        
        // Add event listeners
        document.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);
        
        // Start animation loop
        this.animate();
        
        // Initialize 3D elements
        this.init3DElements();
        
        console.log('✅ 3D Effects Manager initialized successfully!');
    }
    
    handleMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        
        // Update 3D elements based on mouse position
        this.updateElementsOnMouseMove();
    }
    
    handleResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        
        // Recalculate 3D element positions
        this.recalculateElementPositions();
    }
    
    updateElementsOnMouseMove() {
        this.elements.forEach(element => {
            if (element.type === 'parallax') {
                this.updateParallaxElement(element);
            } else if (element.type === 'tilt') {
                this.updateTiltElement(element);
            } else if (element.type === 'float') {
                this.updateFloatElement(element);
            }
        });
    }
    
    updateParallaxElement(element) {
        const rect = element.dom.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (this.mouseX - centerX) / this.windowWidth;
        const deltaY = (this.mouseY - centerY) / this.windowHeight;
        
        const translateX = deltaX * element.parallaxStrength;
        const translateY = deltaY * element.parallaxStrength;
        
        element.dom.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    }
    
    updateTiltElement(element) {
        const rect = element.dom.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (this.mouseX - centerX) / (rect.width / 2);
        const deltaY = (this.mouseY - centerY) / (rect.height / 2);
        
        const rotateX = deltaY * element.tiltStrength;
        const rotateY = -deltaX * element.tiltStrength;
        
        element.dom.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${element.depth}px)`;
    }
    
    updateFloatElement(element) {
        const time = Date.now() * 0.001;
        const floatX = Math.sin(time + element.offset) * element.floatStrength;
        const floatY = Math.cos(time + element.offset) * element.floatStrength;
        
        element.dom.style.transform = `translate3d(${floatX}px, ${floatY}px, ${element.depth}px)`;
    }
    
    recalculateElementPositions() {
        this.elements.forEach(element => {
            if (element.type === 'grid') {
                this.updateGridElement(element);
            }
        });
    }
    
    updateGridElement(element) {
        // Update grid positioning based on new window dimensions
        const columns = Math.floor(this.windowWidth / element.minWidth);
        const rows = Math.ceil(this.elements.length / columns);
        
        element.dom.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        element.dom.style.gridTemplateRows = `repeat(${rows}, auto)`;
    }
    
    animate() {
        // Update floating elements
        this.elements.forEach(element => {
            if (element.type === 'float') {
                this.updateFloatElement(element);
            }
        });
        
        // Continue animation loop
        this.animationId = requestAnimationFrame(this.animate);
    }
    
    init3DElements() {
        // Find and initialize 3D elements
        this.find3DElements();
        
        // Add 3D classes to elements
        this.add3DClasses();
        
        // Initialize element-specific effects
        this.initElementEffects();
    }
    
    find3DElements() {
        // Find parallax elements
        document.querySelectorAll('.parallax-3d').forEach(element => {
            this.elements.push({
                dom: element,
                type: 'parallax',
                parallaxStrength: parseInt(element.dataset.parallax) || 20
            });
        });
        
        // Find tilt elements
        document.querySelectorAll('.tilt-3d').forEach(element => {
            this.elements.push({
                dom: element,
                type: 'tilt',
                tiltStrength: parseInt(element.dataset.tilt) || 15,
                depth: parseInt(element.dataset.depth) || 10
            });
        });
        
        // Find float elements
        document.querySelectorAll('.float-3d').forEach(element => {
            this.elements.push({
                dom: element,
                type: 'float',
                floatStrength: parseInt(element.dataset.float) || 10,
                depth: parseInt(element.dataset.depth) || 5,
                offset: Math.random() * Math.PI * 2
            });
        });
        
        // Find grid elements
        document.querySelectorAll('.grid-3d').forEach(element => {
            this.elements.push({
                dom: element,
                type: 'grid',
                minWidth: parseInt(element.dataset.minWidth) || 300
            });
        });
    }
    
    add3DClasses() {
        this.elements.forEach(element => {
            element.dom.classList.add('three-d-element');
        });
    }
    
    initElementEffects() {
        this.elements.forEach(element => {
            switch (element.type) {
                case 'parallax':
                    this.initParallaxEffect(element);
                    break;
                case 'tilt':
                    this.initTiltEffect(element);
                    break;
                case 'float':
                    this.initFloatEffect(element);
                    break;
                case 'grid':
                    this.initGridEffect(element);
                    break;
            }
        });
    }
    
    initParallaxEffect(element) {
        element.dom.style.transition = 'transform 0.1s ease-out';
        element.dom.style.willChange = 'transform';
    }
    
    initTiltEffect(element) {
        element.dom.style.transition = 'transform 0.1s ease-out';
        element.dom.style.willChange = 'transform';
        element.dom.style.transformStyle = 'preserve-3d';
    }
    
    initFloatEffect(element) {
        element.dom.style.transition = 'transform 0.3s ease-out';
        element.dom.style.willChange = 'transform';
        element.dom.style.transformStyle = 'preserve-3d';
    }
    
    initGridEffect(element) {
        element.dom.style.display = 'grid';
        element.dom.style.gap = 'var(--spacing-lg)';
        element.dom.style.alignItems = 'start';
    }
    
    // Public methods for external use
    addElement(domElement, type, options = {}) {
        const element = {
            dom: domElement,
            type: type,
            ...options
        };
        
        this.elements.push(element);
        this.add3DClasses();
        
        switch (type) {
            case 'parallax':
                this.initParallaxEffect(element);
                break;
            case 'tilt':
                this.initTiltEffect(element);
                break;
            case 'float':
                this.initFloatEffect(element);
                break;
            case 'grid':
                this.initGridEffect(element);
                break;
        }
        
        return element;
    }
    
    removeElement(domElement) {
        const index = this.elements.findIndex(element => element.dom === domElement);
        if (index !== -1) {
            this.elements.splice(index, 1);
        }
    }
    
    enable() {
        this.isEnabled = true;
        if (!this.animationId) {
            this.animate();
        }
    }
    
    disable() {
        this.isEnabled = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.disable();
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);
        this.elements = [];
    }
}

// 3D Card Manager
class Card3DManager {
    constructor() {
        this.cards = [];
        this.init();
    }
    
    init() {
        this.findCards();
        this.initCardEffects();
    }
    
    findCards() {
        document.querySelectorAll('.card-3d').forEach(card => {
            this.cards.push({
                dom: card,
                isHovered: false,
                originalTransform: card.style.transform
            });
        });
    }
    
    initCardEffects() {
        this.cards.forEach(card => {
            this.addCardEventListeners(card);
        });
    }
    
    addCardEventListeners(card) {
        card.dom.addEventListener('mouseenter', () => {
            this.onCardHover(card);
        });
        
        card.dom.addEventListener('mouseleave', () => {
            this.onCardLeave(card);
        });
        
        card.dom.addEventListener('mousemove', (e) => {
            this.onCardMouseMove(card, e);
        });
    }
    
    onCardHover(card) {
        card.isHovered = true;
        card.dom.style.transition = 'transform 0.3s ease-out';
        card.dom.style.zIndex = '10';
    }
    
    onCardLeave(card) {
        card.isHovered = false;
        card.dom.style.transition = 'transform 0.3s ease-out';
        card.dom.style.zIndex = '1';
        card.dom.style.transform = card.originalTransform || 'none';
    }
    
    onCardMouseMove(card, event) {
        if (!card.isHovered) return;
        
        const rect = card.dom.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) / (rect.width / 2);
        const deltaY = (event.clientY - centerY) / (rect.height / 2);
        
        const rotateX = deltaY * 10;
        const rotateY = -deltaX * 10;
        const translateZ = 20;
        
        card.dom.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    }
    
    addCard(domElement) {
        const card = {
            dom: domElement,
            isHovered: false,
            originalTransform: domElement.style.transform
        };
        
        this.cards.push(card);
        this.addCardEventListeners(card);
        
        return card;
    }
    
    removeCard(domElement) {
        const index = this.cards.findIndex(card => card.dom === domElement);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }
}

// 3D Button Manager
class Button3DManager {
    constructor() {
        this.buttons = [];
        this.init();
    }
    
    init() {
        this.findButtons();
        this.initButtonEffects();
    }
    
    findButtons() {
        document.querySelectorAll('.btn-3d').forEach(button => {
            this.buttons.push({
                dom: button,
                isPressed: false,
                originalTransform: button.style.transform
            });
        });
    }
    
    initButtonEffects() {
        this.buttons.forEach(button => {
            this.addButtonEventListeners(button);
        });
    }
    
    addButtonEventListeners(button) {
        button.dom.addEventListener('mousedown', () => {
            this.onButtonPress(button);
        });
        
        button.dom.addEventListener('mouseup', () => {
            this.onButtonRelease(button);
        });
        
        button.dom.addEventListener('mouseleave', () => {
            this.onButtonRelease(button);
        });
    }
    
    onButtonPress(button) {
        button.isPressed = true;
        button.dom.style.transition = 'transform 0.1s ease-out';
        button.dom.style.transform = 'translateZ(5px) scale(0.95)';
    }
    
    onButtonRelease(button) {
        button.isPressed = false;
        button.dom.style.transition = 'transform 0.2s ease-out';
        button.dom.style.transform = button.originalTransform || 'none';
    }
    
    addButton(domElement) {
        const button = {
            dom: domElement,
            isPressed: false,
            originalTransform: domElement.style.transform
        };
        
        this.buttons.push(button);
        this.addButtonEventListeners(button);
        
        return button;
    }
    
    removeButton(domElement) {
        const index = this.buttons.findIndex(button => button.dom === domElement);
        if (index !== -1) {
            this.buttons.splice(index, 1);
        }
    }
}

// 3D Text Manager
class Text3DManager {
    constructor() {
        this.texts = [];
        this.init();
    }
    
    init() {
        this.findTexts();
        this.initTextEffects();
    }
    
    findTexts() {
        document.querySelectorAll('.text-3d, .text-3d-glow').forEach(text => {
            this.texts.push({
                dom: text,
                type: text.classList.contains('text-3d-glow') ? 'glow' : '3d',
                originalTextShadow: text.style.textShadow
            });
        });
    }
    
    initTextEffects() {
        this.texts.forEach(text => {
            if (text.type === 'glow') {
                this.initGlowEffect(text);
            } else {
                this.init3DTextEffect(text);
            }
        });
    }
    
    initGlowEffect(text) {
        // Glow effect is handled by CSS animations
        text.dom.style.transition = 'text-shadow 0.3s ease-out';
    }
    
    init3DTextEffect(text) {
        // 3D text effect is handled by CSS
        text.dom.style.transition = 'text-shadow 0.3s ease-out';
    }
    
    addText(domElement, type = '3d') {
        const text = {
            dom: domElement,
            type: type,
            originalTextShadow: domElement.style.textShadow
        };
        
        this.texts.push(text);
        
        if (type === 'glow') {
            this.initGlowEffect(text);
        } else {
            this.init3DTextEffect(text);
        }
        
        return text;
    }
    
    removeText(domElement) {
        const index = this.texts.findIndex(text => text.dom === domElement);
        if (index !== -1) {
            this.texts.splice(index, 1);
        }
    }
}

// Initialize 3D Effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D Effects Manager
    window.effects3D = new Effects3D();
    
    // Initialize 3D Card Manager
    window.card3DManager = new Card3DManager();
    
    // Initialize 3D Button Manager
    window.button3DManager = new Button3DManager();
    
    // Initialize 3D Text Manager
    window.text3DManager = new Text3DManager();
    
    console.log('🎨 3D Effects initialized successfully!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Effects3D,
        Card3DManager,
        Button3DManager,
        Text3DManager
    };
}

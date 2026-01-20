/* ==================================
   BIRTHDAY WEBSITE FOR SHINE 💖
   Pure JavaScript - No Frameworks
   ================================== */

(function() {
    'use strict';

    /* ╔════════════════════════════════════════╗
       ║ CONFIGURATION & CONSTANTS
       ╚════════════════════════════════════════╝ */

    const CONFIG = {
        parallax: {
            enabled: true,
            intensity: 0.5,
        },
        animations: {
            enabled: true,
            reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        },
        mobile: {
            breakpoint: 768,
            disableParallax: true,
        },
    };

    /* ╔════════════════════════════════════════╗
       ║ UTILITY FUNCTIONS
       ╚════════════════════════════════════════╝ */

    /**
     * Detect if user prefers reduced motion
     */
    function prefersReducedMotion() {
        return CONFIG.animations.reduceMotion;
    }

    /**
     * Check if device is mobile
     */
    function isMobile() {
        return window.innerWidth <= CONFIG.mobile.breakpoint;
    }

    /**
     * Throttle function for performance
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    /**
     * Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /* ╔════════════════════════════════════════╗
       ║ 1. PARALLAX SCROLLING EFFECT (Optimized)
       ╚════════════════════════════════════════╝ */

    function initParallax() {
        if (prefersReducedMotion() || (isMobile() && CONFIG.mobile.disableParallax)) {
            return;
        }

        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        let ticking = false;
        let lastScrollY = 0;

        const updateParallax = () => {
            parallaxElements.forEach((element) => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const offset = lastScrollY * speed;
                element.style.transform = `translate3d(0, ${offset}px, 0)`;
            });
            ticking = false;
        };

        const handleScroll = () => {
            lastScrollY = window.scrollY;

            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /* ╔════════════════════════════════════════╗
       ║ 2. LETTER ANIMATION ON PAGE LOAD
       ╚════════════════════════════════════════╝ */

    function initLetterAnimations() {
        const letters = document.querySelectorAll('.letter');

        letters.forEach((letter) => {
            const delay = letter.getAttribute('data-delay');
            if (delay) {
                letter.style.setProperty('--data-delay', delay);
            }
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 3. SCROLL REVEAL ANIMATIONS
       ╚════════════════════════════════════════╝ */

    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // Optional: Stop observing after reveal
                    if (entry.target.classList.contains('memory-card')) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.memory-card, .section-header').forEach((el) => {
            observer.observe(el);
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 4. MEMORY CARD HOVER EFFECTS (Optimized)
       ╚════════════════════════════════════════╝ */

    function initMemoryCardHover() {
        const memoryCards = document.querySelectorAll('.memory-card');

        memoryCards.forEach((card) => {
            const cardImage = card.querySelector('.card-image');

            // Prevent on mobile
            if (isMobile()) return;

            let animationFrame;

            const updateTilt = (x, y, centerX, centerY, rect) => {
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                cardImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            };

            card.addEventListener('mouseenter', () => {
                if (cardImage) {
                    cardImage.style.transform = 'rotateX(5deg) rotateY(-5deg) scale(1.05)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (cardImage) {
                    cardImage.style.transform = 'rotateX(0) rotateY(0) scale(1)';
                }
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            });

            card.addEventListener(
                'mousemove',
                (e) => {
                    if (!cardImage || isMobile()) return;

                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                    }

                    animationFrame = requestAnimationFrame(() => {
                        updateTilt(x, y, centerX, centerY, rect);
                    });
                },
                { passive: true }
            );
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 5. SMOOTH ANCHOR SCROLL
       ╚════════════════════════════════════════╝ */

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 6. FLOATING ELEMENTS GENERATOR
       ╚════════════════════════════════════════╝ */

    function initFloatingElements() {
        const heartsContainer = document.querySelector('.floating-hearts-bg');
        const sparklesContainer = document.querySelector('.floating-sparkles-bg');

        if (!heartsContainer || !sparklesContainer) return;

        /**
         * Create floating elements
         */
        function createElements(container, emoji, count) {
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < count; i++) {
                const element = document.createElement('div');
                element.innerHTML = emoji;
                element.style.position = 'absolute';
                element.style.left = Math.random() * 100 + '%';
                element.style.top = Math.random() * 100 + '%';
                element.style.fontSize = Math.random() * 20 + 15 + 'px';
                element.style.opacity = Math.random() * 0.5 + 0.2;
                element.style.pointerEvents = 'none';
                element.style.animation = `hero-float ${Math.random() * 20 + 20}s linear infinite`;
                element.setAttribute('aria-hidden', 'true');

                fragment.appendChild(element);
            }

            container.appendChild(fragment);
        }

        createElements(heartsContainer, '💖', 8);
        createElements(sparklesContainer, '✨', 6);
    }

    /* ╔════════════════════════════════════════╗
       ║ 7. HERO 3D TILT EFFECT (Optimized)
       ╚════════════════════════════════════════╝ */

    function initHeroTilt() {
        if (isMobile() || prefersReducedMotion()) return;

        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        let ticking = false;
        let lastX = 0;
        let lastY = 0;

        const updateTilt = () => {
            const x = lastX / window.innerWidth;
            const y = lastY / window.innerHeight;

            const rotateX = (y - 0.5) * 8;
            const rotateY = (x - 0.5) * 8;

            heroContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            ticking = false;
        };

        const handleMouseMove = (e) => {
            lastX = e.clientX;
            lastY = e.clientY;

            if (!ticking) {
                requestAnimationFrame(updateTilt);
                ticking = true;
            }
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 8. FADE-IN TEXT ON SCROLL
       ╚════════════════════════════════════════╝ */

    function initFadeInText() {
        const fadeInElements = document.querySelectorAll('.animate-fade-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        fadeInElements.forEach((el) => {
            observer.observe(el);
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 9. PAGE LOAD ANIMATION
       ╚════════════════════════════════════════╝ */

    function initPageLoad() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.8s ease-in';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.style.opacity = '1';
            });
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 10. RESPONSIVE ADJUSTMENTS
       ╚════════════════════════════════════════╝ */

    function handleResize() {
        // Add responsive adjustments here if needed
        const hero = document.querySelector('.hero-section');
        if (hero && isMobile()) {
            hero.style.minHeight = '120vh';
        }
    }

    const resizeHandler = debounce(handleResize, 250);
    window.addEventListener('resize', resizeHandler);

    /* ╔════════════════════════════════════════╗
       ║ 11. PERFORMANCE MONITORING
       ╚════════════════════════════════════════╝ */

    function logPerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    }

    /* ╔════════════════════════════════════════╗
       ║ 12. INITIALIZATION
       ╚════════════════════════════════════════╝ */

    /**
     * Initialize typewriter effect for birthday message (line by line)
     */
    function initTypewriter() {
        const typewriterElement = document.getElementById('typewriterText');
        if (!typewriterElement) return;

        const fullText = typewriterElement.getAttribute('data-full-text') || typewriterElement.textContent.trim();
        
        // Store the full text for reuse
        if (!typewriterElement.getAttribute('data-full-text')) {
            typewriterElement.setAttribute('data-full-text', fullText);
        }

        // Split text into lines
        const lines = fullText.split('\n').filter(line => line.trim());

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reset and start typing each time element comes into view
                    typewriterElement.textContent = '';
                    let lineIndex = 0;

                    function typeLineByLine() {
                        if (lineIndex < lines.length) {
                            typewriterElement.textContent += lines[lineIndex] + '\n';
                            lineIndex++;
                            setTimeout(typeLineByLine, 800); // Delay between lines (milliseconds)
                        } else {
                            // Stop blinking after typing is complete
                            typewriterElement.style.borderRightColor = 'transparent';
                        }
                    }

                    typeLineByLine();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(typewriterElement);
    }

    /**
     * Initialize image modal lightbox
     */
    function initImageModal() {
        const modal = document.getElementById('imageModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modalImage = document.getElementById('modalImage');
        const modalText = document.getElementById('modalText');
        const memoryCards = document.querySelectorAll('.memory-card');

        // Image captions mapping
        const captions = {
            1: "Your smile is pure sunshine ☀️",
            2: "Every moment with you is a blessing 🌸",
            3: "You inspire us all to be better 💫",
            4: "Your kindness lights up the world ✨",
            5: "Thank you for being wonderfully you 🌹",
            6: "Here's to more beautiful memories 🎉"
        };

        /**
         * Open modal with image
         */
        function openModal(imageSrc, index) {
            modalImage.src = imageSrc;
            modalText.textContent = captions[index] || "Special moment with you 💖";
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        /**
         * Close modal
         */
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Add click listeners to memory card images
        memoryCards.forEach(card => {
            const img = card.querySelector('img');
            const index = card.getAttribute('data-index');
            
            if (img) {
                img.addEventListener('click', () => {
                    openModal(img.src, index);
                });
            }
        });

        // Close modal on overlay click
        modalOverlay.addEventListener('click', closeModal);

        // Close modal on close button click
        modalClose.addEventListener('click', closeModal);

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /* ╔════════════════════════════════════════╗
       ║ 12. INITIALIZATION
       ╚════════════════════════════════════════╝ */

    /**
     * Initialize all features when DOM is ready
     */
    function init() {
        // Ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('Initializing Birthday Website...');

        // Initialize features
        initLetterAnimations();
        initParallax();
        initScrollReveal();
        initMemoryCardHover();
        initSmoothScroll();
        initFloatingElements();
        initHeroTilt();
        initFadeInText();
        initPageLoad();
        initImageModal();
        initTypewriter();
        handleResize();

        // Log performance
        window.addEventListener('load', logPerformance);

        console.log('Birthday Website initialized successfully! 🎉💖');
    }

    // Start initialization
    init();
})();

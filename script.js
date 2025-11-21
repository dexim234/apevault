// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    const navItems = document.querySelectorAll('.nav-item.dropdown');
    
    // Function to check if mobile view
    function isMobile() {
        return window.innerWidth <= 968;
    }
    
    // Mobile menu toggle
    function setupMobileMenu() {
        if (isMobile()) {
            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                const menu = item.querySelector('.dropdown-menu');
                
                if (link && menu) {
                    // Remove existing listeners by cloning
                    const newLink = link.cloneNode(true);
                    link.parentNode.replaceChild(newLink, link);
                    
                    newLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const isActive = item.classList.contains('active');
                        
                        // Close all other dropdowns
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                        
                        // Toggle current dropdown
                        if (isActive) {
                            item.classList.remove('active');
                        } else {
                            item.classList.add('active');
                            
                            // Scroll to dropdown if it's opening
                            setTimeout(() => {
                                const dropdownMenu = item.querySelector('.dropdown-menu');
                                if (dropdownMenu && window.innerWidth <= 968) {
                                    dropdownMenu.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'nearest',
                                        inline: 'nearest'
                                    });
                                }
                            }, 100);
                        }
                    });
                }
            });
        } else {
            // Remove active classes on desktop
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    // Initial setup
    setupMobileMenu();
    
    // Re-setup on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setupMobileMenu, 250);
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (isMobile() && !e.target.closest('.nav-item.dropdown')) {
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Animated counter for statistics with easing
    function animateCounter(element, target, duration = 2500) {
        if (!element) return;
        
        const start = 0;
        const startTime = performance.now();
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = Math.floor(start + (target - start) * easedProgress);
            
            if (element) {
                element.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (element) {
                    element.textContent = target;
                }
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Intersection Observer for counter animation
    function initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) {
            console.log('No stat numbers found');
            return;
        }
        
        console.log('Found', statNumbers.length, 'stat numbers');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const animated = statNumber.getAttribute('data-animated');
                    
                    if (!animated || animated !== 'true') {
                        const targetValue = statNumber.getAttribute('data-target');
                        const target = parseInt(targetValue);
                        
                        console.log('Animating counter:', targetValue, 'target:', target);
                        
                        if (!isNaN(target) && target > 0) {
                            statNumber.setAttribute('data-animated', 'true');
                            statNumber.textContent = '0';
                            
                            // Небольшая задержка для плавности
                            setTimeout(() => {
                                animateCounter(statNumber, target, 2500);
                            }, 100);
                        }
                    }
                }
            });
        }, observerOptions);
        
        // Наблюдаем за самими числами, а не за карточками
        statNumbers.forEach(statNumber => {
            statsObserver.observe(statNumber);
        });
        
        console.log('Counters initialized, observing', statNumbers.length, 'numbers');
    }
    
    // Инициализация счетчиков
    setTimeout(() => {
        initCounters();
    }, 100);
    
    // Mobile menu toggle - инициализация
    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const mobileOverlay = document.querySelector('.mobile-menu-overlay');
        const body = document.body;
        
        if (!mobileMenuToggle || !mainNav || !mobileOverlay) {
            console.log('Mobile menu elements not found:', {
                toggle: !!mobileMenuToggle,
                nav: !!mainNav,
                overlay: !!mobileOverlay
            });
            return;
        }
        
        console.log('Mobile menu initialized');
        
        function toggleMobileMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            const isActive = mainNav.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
        
        // Убеждаемся, что меню закрыто при загрузке
        closeMobileMenu();
        
        function openMobileMenu() {
            console.log('Opening menu');
            mainNav.classList.add('active');
            mobileMenuToggle.classList.add('active');
            mobileOverlay.classList.add('active');
            body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {
            console.log('Closing menu');
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
            
            // Close all dropdowns
            document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
        
        // Event listeners
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on any nav link or dropdown item
        function setupMenuClose() {
            // Все ссылки в основном меню
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 968) {
                        const isDropdown = this.closest('.dropdown');
                        const hasArrow = this.querySelector('.dropdown-arrow');
                        
                        // Если это не dropdown или нет стрелки - закрываем меню
                        if (!isDropdown || !hasArrow) {
                            setTimeout(closeMobileMenu, 300);
                        }
                    }
                });
            });
            
            // Все ссылки в выпадающих меню
            document.querySelectorAll('.dropdown-menu a').forEach(link => {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 968) {
                        setTimeout(closeMobileMenu, 300);
                    }
                });
            });
        }
        
        setupMenuClose();
        
        // Close menu on window resize if switching to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 968) {
                    closeMobileMenu();
                }
            }, 250);
        });
        
        // Close menu on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Инициализация мобильного меню
    initMobileMenu();
});


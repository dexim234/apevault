// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    const navItems = document.querySelectorAll('.nav-item.dropdown');
    
    // Function to check if mobile/tablet view
    function isMobile() {
        return window.innerWidth <= 968;
    }
    
    // Function to check if tablet view
    function isTablet() {
        return window.innerWidth > 968 && window.innerWidth <= 1024;
    }
    
    // Setup dropdown toggle for mobile and tablet
    function setupDropdownToggle() {
        const isMobileOrTablet = isMobile() || isTablet();
        
        // На десктопе не настраиваем click обработчики - используем только hover
        if (!isMobileOrTablet) {
            navItems.forEach(item => {
                item.classList.remove('active');
            });
            return;
        }
        
        if (isMobileOrTablet) {
            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                const menu = item.querySelector('.dropdown-menu');
                
                if (link && menu) {
                    // Remove existing listeners by cloning
                    const newLink = link.cloneNode(true);
                    link.parentNode.replaceChild(newLink, link);
                    
                    newLink.addEventListener('click', function(e) {
                        // На планшетах разрешаем и hover, и click
                        if (isTablet()) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const isActive = item.classList.contains('active');
                            
                            // Закрываем все другие dropdown
                            navItems.forEach(otherItem => {
                                if (otherItem !== item) {
                                    otherItem.classList.remove('active');
                                }
                            });
                            
                            // Toggle текущего dropdown
                            if (isActive) {
                                // Если уже активен - закрываем
                                item.classList.remove('active');
                            } else {
                                // Если не активен - открываем
                                item.classList.add('active');
                            }
                        } else {
                            // На мобильных - полный контроль через click
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
                                    const navList = item.closest('.nav-list');
                                    if (dropdownMenu && navList) {
                                        const menuRect = dropdownMenu.getBoundingClientRect();
                                        const navRect = navList.getBoundingClientRect();
                                        
                                        if (menuRect.bottom > navRect.bottom) {
                                            dropdownMenu.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'nearest',
                                                inline: 'nearest'
                                            });
                                        }
                                    }
                                }, 150);
                            }
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
    
    // Mobile menu toggle (для мобильного меню)
    function setupMobileMenu() {
        setupDropdownToggle();
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
    
    // Smooth scroll for anchor links (только для не-dropdown ссылок)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Пропускаем ссылки в dropdown меню на десктопе
        const isDropdownLink = anchor.closest('.dropdown-menu');
        const isDesktop = window.innerWidth > 1024;
        
        if (isDropdownLink && isDesktop) {
            // На десктопе для dropdown ссылок не перехватываем клики
            return;
        }
        
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
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.about-section, .community-section, .mission-section, .team-section, .wallets-section, .ecosystem-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Animate community cards on scroll
    const communityCards = document.querySelectorAll('.community-card');
    if (communityCards.length > 0) {
        // Cards will animate when section becomes visible
        const communitySection = document.querySelector('.community-section');
        if (communitySection) {
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Trigger card animations
                        communityCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.animationPlayState = 'running';
                            }, index * 100);
                        });
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            cardObserver.observe(communitySection);
        }
    }
    
    // Animate team cards on scroll
    const teamCards = document.querySelectorAll('.team-card');
    if (teamCards.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        teamCards.forEach((card, index) => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }
    
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


// Copy wallet address function
window.copyWallet = function(address, element) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(() => {
            showCopied(element);
        }).catch(() => {
            fallbackCopy(address, element);
        });
    } else {
        fallbackCopy(address, element);
    }
};

function fallbackCopy(address, element) {
    const tempInput = document.createElement('input');
    tempInput.value = address;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        showCopied(element);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    document.body.removeChild(tempInput);
}

function showCopied(element) {
    element.classList.add('copied', 'flash');
    setTimeout(() => element.classList.remove('flash'), 500);
    setTimeout(() => element.classList.remove('copied'), 2000);
}

// Ecosystem Section - Premium Modal and Animation
document.addEventListener('DOMContentLoaded', () => {
    // Premium staggered 3D reveal animation
    const ecosystemCards = document.querySelectorAll('.ecosystem-card');
    if (ecosystemCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                    const index = Array.from(ecosystemCards).indexOf(entry.target);
                    const delay = index * 120; // Stagger delay for premium effect
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        ecosystemCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // Premium magnetic hover effect for cards
    ecosystemCards.forEach(card => {
        const cardInner = card.querySelector('.card-inner');
        let isHovering = false;
        
        card.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        card.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            requestAnimationFrame(() => {
                cardInner.style.transform = `translate3d(${moveX}px, ${moveY - 8}px, 20px) scale(1.02)`;
            });
        });
        
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            requestAnimationFrame(() => {
                cardInner.style.transform = '';
            });
        });
    });

    // Initialize modals
    const modalTriggers = document.querySelectorAll('.card-info[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal .close');

    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    // Close on backdrop click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
});

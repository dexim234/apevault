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
        if (!element || isNaN(target) || target < 0) {
            console.error('animateCounter: invalid parameters', { element: !!element, target });
            return;
        }
        
        const start = 0;
        const startTime = performance.now();
        let animationId = null;
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function update(currentTime) {
            if (!element) {
                if (animationId) cancelAnimationFrame(animationId);
                return;
            }
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = Math.floor(start + (target - start) * easedProgress);
            
            element.textContent = current;
            
            if (progress < 1) {
                animationId = requestAnimationFrame(update);
            } else {
                element.textContent = target;
                console.log('Counter completed:', target);
            }
        }
        
        animationId = requestAnimationFrame(update);
    }
    
    // Счетчики теперь запускаются только после появления блока "В цифрах"
    // Автоматический запуск убран
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.community-section, .mission-section, .team-section, .wallets-section, .ecosystem-section');
    
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
    
    // Специальная анимация для секции "В цифрах" с отслеживанием направления скролла
    const statsSection = document.querySelector('#we-are');
    if (statsSection) {
        let isAnimating = false;
        let animationState = 'hidden'; // hidden, visible
        let hasAnimated = false; // Флаг для предотвращения зацикливания
        let countersStarted = false; // Флаг для запуска счетчиков
        
        // Находим контейнер внутри секции для анимации
        const statsContainer = statsSection.querySelector('.about-container');
        
        if (!statsContainer) {
            console.log('Stats: .about-container not found');
            return;
        }
        
        // Скрываем только контейнер, фон секции остается видимым
        statsContainer.style.opacity = '0';
        statsContainer.style.transform = 'translateX(100vw)';
        
        // Функция для запуска счетчиков
        function startCountersAnimation() {
            const statNumbers = document.querySelectorAll('.stat-number');
            
            if (statNumbers.length === 0) {
                console.log('Stats: No counters found');
                return;
            }
            
            console.log('Stats: Starting counters animation');
            statNumbers.forEach((statNumber, index) => {
                // Сбрасываем флаг анимации для повторного запуска
                statNumber.removeAttribute('data-animated');
                const targetValue = statNumber.getAttribute('data-target');
                const target = parseInt(targetValue, 10);
                
                if (!isNaN(target) && target >= 0) {
                    statNumber.setAttribute('data-animated', 'true');
                    statNumber.textContent = '0';
                    
                    setTimeout(() => {
                        animateCounter(statNumber, target, 2500);
                    }, index * 150);
                }
            });
        }
        
        // Функция для запуска анимации блока
        function triggerAnimation() {
            if (isAnimating || hasAnimated) {
                return;
            }
            
            console.log('Stats: Starting animation - triggered!');
            isAnimating = true;
            hasAnimated = true;
            
            // Убираем все классы анимации
            statsContainer.classList.remove('animate-in', 'animate-out');
            
            // Сбрасываем стили и устанавливаем начальную позицию - всегда справа
            requestAnimationFrame(() => {
                statsContainer.style.transform = 'translateX(100vw)';
                statsContainer.style.opacity = '0';
                
                requestAnimationFrame(() => {
                    console.log('Stats: Adding animate-in class');
                    statsContainer.classList.add('animate-in');
                    animationState = 'visible';
                    
                    // Запускаем счетчики после завершения анимации блока (4.5 секунды)
                    setTimeout(() => {
                        isAnimating = false;
                        console.log('Stats: Animation completed, starting counters');
                        
                        // Запускаем счетчики после полного появления блока
                        if (!countersStarted) {
                            countersStarted = true;
                            startCountersAnimation();
                        }
                    }, 4500);
                });
            });
        }
        
        // Проверяем позицию блока при скролле
        function checkBlockPosition() {
            const rect = statsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const isNearViewport = rect.top < windowHeight + 500 && rect.bottom > -500;
            
            if (isNearViewport && !hasAnimated && !isAnimating) {
                console.log('Stats: Block is near viewport, triggering animation');
                triggerAnimation();
            }
        }
        
        // Проверяем при скролле
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkBlockPosition, 100);
        }, { passive: true });
        
        // Проверяем сразу
        setTimeout(checkBlockPosition, 500);
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isVisible = entry.intersectionRatio >= 0.05; // Еще ниже порог
                const canAnimate = entry.isIntersecting && isVisible && !isAnimating && !hasAnimated;
                
                console.log('=== Stats Observer ===');
                console.log('isIntersecting:', entry.isIntersecting);
                console.log('intersectionRatio:', entry.intersectionRatio.toFixed(2));
                console.log('isVisible (>=0.05):', isVisible);
                console.log('isAnimating:', isAnimating);
                console.log('hasAnimated:', hasAnimated);
                console.log('animationState:', animationState);
                console.log('canAnimate:', canAnimate);
                
                // Дополнительная проверка через getBoundingClientRect
                const rect = statsSection.getBoundingClientRect();
                console.log('Block position:', {
                    top: rect.top.toFixed(0),
                    bottom: rect.bottom.toFixed(0),
                    windowHeight: window.innerHeight,
                    isNear: rect.top < window.innerHeight + 500 && rect.bottom > -500
                });
                console.log('====================');
                
                if (canAnimate) {
                    triggerAnimation();
                } else if (!entry.isIntersecting && animationState === 'visible' && !isAnimating) {
                    console.log('Stats: Hiding section - leaving viewport');
                    // Блок уходит из viewport - всегда уходит вправо
                    isAnimating = true;
                    statsContainer.classList.remove('animate-in');
                    statsContainer.classList.add('animate-out');
                    animationState = 'hidden';
                    hasAnimated = false; // Разрешаем повторную анимацию
                    countersStarted = false; // Сбрасываем флаг счетчиков
                    
                    setTimeout(() => {
                        isAnimating = false;
                        console.log('Stats: Hide animation completed');
                    }, 3500);
                }
            });
        }, {
            threshold: [0, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1],
            rootMargin: '500px 0px 500px 0px' // Еще больше отступ
        });
        
        statsObserver.observe(statsSection);
        console.log('Stats: Observer initialized for #we-are');
    } else {
        console.log('Stats: Section #we-are not found');
    }
    
    // Анимация для раздела "Наши ценности" - выезд слева
    const valuesSection = document.querySelector('#values');
    if (valuesSection) {
        const valuesContainer = valuesSection.querySelector('.values-container');
        
        if (valuesContainer) {
            let valuesAnimating = false;
            let valuesHasAnimated = false;
            let valuesAnimationState = 'hidden';
            
            // Скрываем только контейнер, фон секции остается видимым
            valuesContainer.style.opacity = '0';
            valuesContainer.style.transform = 'translateX(-100vw)';
            
            // Функция для запуска анимации
            function triggerValuesAnimation() {
                if (valuesAnimating || valuesHasAnimated) {
                    return;
                }
                
                valuesAnimating = true;
                valuesHasAnimated = true;
                
                // Убираем все классы анимации
                valuesContainer.classList.remove('animate-in', 'animate-out');
                
                // Сбрасываем стили и устанавливаем начальную позицию - всегда слева
                requestAnimationFrame(() => {
                    valuesContainer.style.transform = 'translateX(-100vw)';
                    valuesContainer.style.opacity = '0';
                    
                    requestAnimationFrame(() => {
                        valuesContainer.classList.add('animate-in');
                        valuesAnimationState = 'visible';
                        
                        setTimeout(() => {
                            valuesAnimating = false;
                        }, 4500);
                    });
                });
            }
            
            // Проверяем позицию блока при скролле
            function checkValuesPosition() {
                const rect = valuesSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const isNearViewport = rect.top < windowHeight + 500 && rect.bottom > -500;
                
                if (isNearViewport && !valuesHasAnimated && !valuesAnimating) {
                    triggerValuesAnimation();
                }
            }
            
            // Проверяем при скролле
            let valuesScrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(valuesScrollTimeout);
                valuesScrollTimeout = setTimeout(checkValuesPosition, 100);
            }, { passive: true });
            
            // Проверяем сразу
            setTimeout(checkValuesPosition, 500);
            
            const valuesObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const isVisible = entry.intersectionRatio >= 0.05;
                    const canAnimate = entry.isIntersecting && isVisible && !valuesAnimating && !valuesHasAnimated;
                    
                    if (canAnimate) {
                        triggerValuesAnimation();
                    } else if (!entry.isIntersecting && valuesAnimationState === 'visible' && !valuesAnimating) {
                        // Блок уходит из viewport - уходит влево
                        valuesAnimating = true;
                        valuesContainer.classList.remove('animate-in');
                        valuesContainer.classList.add('animate-out');
                        valuesAnimationState = 'hidden';
                        valuesHasAnimated = false;
                        
                        setTimeout(() => {
                            valuesAnimating = false;
                        }, 3500);
                    }
                });
            }, {
                threshold: [0, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1],
                rootMargin: '500px 0px 500px 0px'
            });
            
            valuesObserver.observe(valuesSection);
        }
    }
    
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
        
        let isToggling = false;
        
        function toggleMobileMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Защита от множественных вызовов
            if (isToggling) {
                return;
            }
            
            isToggling = true;
            
            const isActive = mainNav.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
            
            // Снимаем блокировку через небольшую задержку
            setTimeout(() => {
                isToggling = false;
            }, 300);
        }
        
        // Убеждаемся, что меню закрыто при загрузке
        closeMobileMenu();
        
        function openMobileMenu() {
            if (mainNav.classList.contains('active')) return;
            
            mainNav.classList.add('active');
            mobileMenuToggle.classList.add('active');
            mobileOverlay.classList.add('active');
            body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {
            if (!mainNav.classList.contains('active')) return;
            
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
    const closeButtons = document.querySelectorAll('.modal .close, .modal .modal-close');

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
    
    // Функция для открытия модального окна с информацией о кошельках
    window.openWalletsModal = function() {
        const walletsModal = document.getElementById('walletsModal');
        if (walletsModal) {
            walletsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Products Section - Plan Selection
    document.querySelectorAll('.plan').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const group = btn.closest('.price-options');
            if (group) {
                group.querySelectorAll('.plan').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });
    
    // Products Section - Select Button
    document.querySelectorAll('.select-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Проверяем, является ли это кнопкой для резервного пула
            if (this.getAttribute('data-product') === 'pool') {
                openPoolAmountModal();
                return;
            }
            
            const card = this.closest('.product-card');
            const productName = card.querySelector('.product-name')?.textContent || 'Продукт';
            const priceOptions = card.querySelector('.price-options');
            let selectedPrice = '';
            
            if (priceOptions) {
                const activePlan = priceOptions.querySelector('.plan.active');
                if (activePlan) {
                    selectedPrice = activePlan.textContent.trim();
                } else {
                    // Если нет активного плана, берем первый
                    const firstPlan = priceOptions.querySelector('.plan');
                    if (firstPlan) {
                        firstPlan.classList.add('active');
                        selectedPrice = firstPlan.textContent.trim();
                    }
                }
            } else {
                const priceSingle = card.querySelector('.price-single');
                if (priceSingle) {
                    selectedPrice = priceSingle.textContent.trim();
                }
            }
            
            // Здесь можно добавить логику для обработки выбора продукта
            console.log('Выбран продукт:', productName, 'Цена:', selectedPrice);
            
            // Временная анимация кнопки
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Pool Amount Modal Functionality
    function openPoolAmountModal() {
        const modal = document.getElementById('poolAmountModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Сброс выбранной суммы
            resetPoolModal();
        }
    }
    
    function closePoolAmountModal() {
        const modal = document.getElementById('poolAmountModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            resetPoolModal();
        }
    }
    
    function resetPoolModal() {
        // Сброс активных кнопок
        document.querySelectorAll('.pool-amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Очистка поля ввода
        const customInput = document.getElementById('customAmount');
        if (customInput) {
            customInput.value = '';
        }
        // Деактивация кнопки подтверждения
        const confirmBtn = document.querySelector('.pool-confirm-btn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
        }
    }
    
    function updateConfirmButton() {
        const confirmBtn = document.querySelector('.pool-confirm-btn');
        if (!confirmBtn) return;
        
        const hasActiveButton = document.querySelector('.pool-amount-btn.active');
        const customInput = document.getElementById('customAmount');
        const hasCustomValue = customInput && customInput.value && parseInt(customInput.value) >= 5000;
        
        confirmBtn.disabled = !(hasActiveButton || hasCustomValue);
    }
    
    function getSelectedAmount() {
        const activeButton = document.querySelector('.pool-amount-btn.active');
        if (activeButton) {
            return parseInt(activeButton.getAttribute('data-amount'));
        }
        
        const customInput = document.getElementById('customAmount');
        if (customInput && customInput.value) {
            const customAmount = parseInt(customInput.value);
            if (customAmount >= 5000) {
                return customAmount;
            }
        }
        
        return null;
    }
    
    // Инициализация модального окна выбора суммы пула
    const poolModal = document.getElementById('poolAmountModal');
    if (poolModal) {
        // Закрытие по клику на backdrop
        const backdrop = poolModal.querySelector('.pool-modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closePoolAmountModal);
        }
        
        // Закрытие по клику на кнопку закрытия
        const closeBtn = poolModal.querySelector('.pool-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closePoolAmountModal);
        }
        
        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && poolModal.classList.contains('active')) {
                closePoolAmountModal();
            }
        });
        
        // Обработка выбора суммы из кнопок
        document.querySelectorAll('.pool-amount-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Убираем активность с других кнопок
                document.querySelectorAll('.pool-amount-btn').forEach(b => b.classList.remove('active'));
                // Активируем текущую кнопку
                this.classList.add('active');
                // Очищаем поле ввода
                const customInput = document.getElementById('customAmount');
                if (customInput) {
                    customInput.value = '';
                }
                // Обновляем кнопку подтверждения
                updateConfirmButton();
            });
        });
        
        // Обработка ввода своей суммы
        const customInput = document.getElementById('customAmount');
        if (customInput) {
            customInput.addEventListener('input', function() {
                // Убираем активность с кнопок при вводе
                if (this.value) {
                    document.querySelectorAll('.pool-amount-btn').forEach(b => b.classList.remove('active'));
                }
                // Обновляем кнопку подтверждения
                updateConfirmButton();
            });
            
            // Валидация минимальной суммы
            customInput.addEventListener('blur', function() {
                const value = parseInt(this.value);
                if (this.value && value < 5000) {
                    alert('Минимальная сумма участия — 5 000₽');
                    this.value = '';
                    updateConfirmButton();
                }
            });
        }
        
        // Обработка подтверждения
        const confirmBtn = document.querySelector('.pool-confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                if (this.disabled) return;
                
                const amount = getSelectedAmount();
                if (amount) {
                    console.log('Выбрана сумма пула:', amount.toLocaleString('ru-RU') + '₽');
                    // Здесь можно добавить логику для обработки выбранной суммы
                    // Например, отправка на сервер или переход на страницу оплаты
                    alert('Выбрана сумма: ' + amount.toLocaleString('ru-RU') + '₽');
                    closePoolAmountModal();
                }
            });
        }
    }
    
    // Learning Features Section - Animation
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length > 0) {
        const featuresObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const index = Array.from(featureCards).indexOf(card);
                    const isDesktop = window.innerWidth >= 1400;
                    
                    let delay = 0;
                    
                    if (isDesktop) {
                        // На компе: по строкам (1 строка слева, 2 справа, 3 слева)
                        const row = Math.floor(index / 3); // 0, 1, 2
                        const positionInRow = index % 3; // 0, 1, 2
                        
                        // Задержка: строка * 300ms + позиция в строке * 100ms
                        delay = row * 300 + positionInRow * 100;
                    } else {
                        // На планшетах и мобильных: по порядку с задержкой
                        delay = index * 150;
                    }
                    
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, delay);
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        featureCards.forEach(card => featuresObserver.observe(card));
    }

    // Team Section - Animation
    const teamCards = document.querySelectorAll('.team-card');
    
    if (teamCards.length > 0) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const index = Array.from(teamCards).indexOf(card);
                    const delay = index * 200; // Staggered animation
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                } else {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '50px'
        });
        
        teamCards.forEach(card => {
            teamObserver.observe(card);
        });
    }
    
    // Function to update roadmap line gradient transition point
    function updateRoadmapLineTransition() {
        // Находим активный контейнер (PRO или BASE)
        const roadmapPro = document.querySelector('.roadmap-pro.active');
        const roadmapBase = document.querySelector('.roadmap-base.active');
        const activeContainer = roadmapPro || roadmapBase;
        
        if (!activeContainer) return;
        
        const roadmapLine = activeContainer.querySelector('.roadmap-line');
        if (!roadmapLine) return;
        
        const modules = activeContainer.querySelectorAll('.roadmap-module');
        if (modules.length === 0) return;
        
        const containerHeight = activeContainer.offsetHeight;
        
        // Для PRO академии (17 модулей: зеленые 1-5, желтые 6-12, фиолетовые 13-17)
        if (roadmapPro) {
            let module5 = null;
            let module12 = null;
            
            modules.forEach(module => {
                const header = module.querySelector('.roadmap-module-header');
                if (header && header.textContent.includes('Модуль 5')) {
                    module5 = module;
                }
                if (header && header.textContent.includes('Модуль 12')) {
                    module12 = module;
                }
            });
            
            // Переход с зеленого на желтый после модуля 5
            if (module5) {
                const module5Top = module5.offsetTop;
                const module5Height = module5.offsetHeight;
                const module5Bottom = module5Top + module5Height;
                const transitionPercent = (module5Bottom / containerHeight) * 100;
                roadmapLine.style.setProperty('--module5-end', transitionPercent + '%');
            }
            
            // Переход с желтого на фиолетовый после модуля 12
            if (module12) {
                const module12Top = module12.offsetTop;
                const module12Height = module12.offsetHeight;
                const module12Bottom = module12Top + module12Height;
                const purpleStartPercent = (module12Bottom / containerHeight) * 100;
                roadmapLine.style.setProperty('--module12-end', purpleStartPercent + '%');
            }
        }
        
        // Для BASE академии (12 модулей: зеленые 1-4, желтые 5-8, фиолетовые 9-12)
        if (roadmapBase) {
            let module4 = null; // Последний зеленый модуль
            let module8 = null; // Последний желтый модуль
            
            modules.forEach(module => {
                const header = module.querySelector('.roadmap-module-header');
                if (header && header.textContent.includes('Модуль 4')) {
                    module4 = module;
                }
                if (header && header.textContent.includes('Модуль 8')) {
                    module8 = module;
                }
            });
            
            // Переход с зеленого на желтый после модуля 4
            if (module4) {
                const module4Top = module4.offsetTop;
                const module4Height = module4.offsetHeight;
                const module4Bottom = module4Top + module4Height;
                const transitionPercent = (module4Bottom / containerHeight) * 100;
                roadmapLine.style.setProperty('--module4-end', transitionPercent + '%');
            }
            
            // Переход с желтого на фиолетовый после модуля 8
            if (module8) {
                const module8Top = module8.offsetTop;
                const module8Height = module8.offsetHeight;
                const module8Bottom = module8Top + module8Height;
                const purpleStartPercent = (module8Bottom / containerHeight) * 100;
                roadmapLine.style.setProperty('--module8-end', purpleStartPercent + '%');
            }
        }
    }
    
    // Roadmap toggle lessons
    const roadmapToggleButtons = document.querySelectorAll('.roadmap-toggle-lessons');
    roadmapToggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lessons = this.nextElementSibling;
            if (lessons && lessons.classList.contains('roadmap-lessons')) {
                if (lessons.style.display === 'block') {
                    lessons.style.display = 'none';
                    this.textContent = 'Показать уроки';
                } else {
                    lessons.style.display = 'block';
                    this.textContent = 'Скрыть уроки';
                }
                // Update line transition after module expansion/collapse
                // Use requestAnimationFrame to ensure DOM is updated
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        updateRoadmapLineTransition();
                    });
                });
            }
        });
    });
    
    // Update roadmap line transition on load and resize
    if (document.querySelector('.roadmap-line')) {
        // Initial update after DOM is ready
        setTimeout(updateRoadmapLineTransition, 100);
        
        // Also update after page load (for images and other resources)
        window.addEventListener('load', () => {
            setTimeout(updateRoadmapLineTransition, 200);
        });
        
        // Update on resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateRoadmapLineTransition, 150);
        });
        
        // Also update when modules are visible (for lazy loading)
        const roadmapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        setTimeout(updateRoadmapLineTransition, 200);
                    });
                    roadmapObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        const roadmapSection = document.querySelector('.roadmap-section');
        if (roadmapSection) {
            roadmapObserver.observe(roadmapSection);
        }
    }
    
    // FAQ toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Roadmap Academy Switcher
    function getBaseAcademyModules() {
        return [
            {
                title: 'Начало твоего пути',
                description: 'В этом модуле ты разберёшься, как устроен курс: кто тебя будет вести, какую поддержку получишь и как вообще всё здесь работает.',
                lessons: [
                    'Знакомство со спикерами и программой курса',
                    'FAQ'
                ],
                icon: 'fa-flag',
                color: 'green'
            },
            {
                title: 'Введение в крипту',
                description: 'В этом модуле ты разберёшься, что такое криптовалюта на самом деле: зачем она нужна, как работает и как в неё заходят с нуля.',
                lessons: [
                    'Личные цели и маршрут',
                    'Криптовалюта: основа основ',
                    'Как покупать и продавать криптовалюты',
                    'Базовая информация по стратегии и портфелю',
                    'Заводим свои первые кошельки',
                    'Риск и мани-менеджмент'
                ],
                icon: 'fa-coins',
                color: 'green'
            },
            {
                title: 'Безопасность операций с криптовалютой',
                description: 'В этом модуле ты узнаешь, как надёжно защищать свои средства и личные данные, а главное — как вовремя распознавать и обходить мошеннические схемы.',
                lessons: [
                    'Основы безопасности в криптовалюте'
                ],
                icon: 'fa-shield-halved',
                color: 'green'
            },
            {
                title: 'Биржи',
                description: 'В этом модуле ты разберёшься, как устроены криптобиржи и чем различаются их форматы.',
                lessons: [
                    'Основа основ',
                    'DEX-мониторы',
                    'Биржи для NFT',
                    'Блокчейн-сканеры'
                ],
                icon: 'fa-building-columns',
                color: 'green'
            },
            {
                title: 'Фундаментальный анализ',
                description: 'В этом модуле ты научишься разбираться в проектах до того, как вкладываешь деньги.',
                lessons: [
                    'Что такое ФА и почему это важно',
                    'Команда, ниша, новости и инвесторы'
                ],
                icon: 'fa-chart-line',
                color: 'yellow'
            },
            {
                title: 'Технический анализ и маржинальная торговля',
                description: 'В этом модуле ты освоишь основы технического анализа: научишься читать графики, видеть тренды и распознавать паттерны.',
                lessons: [
                    'Основа анализа',
                    'Маржинальная торговля'
                ],
                icon: 'fa-chart-area',
                color: 'yellow'
            },
            {
                title: 'Спот торговля и стейкинг проектов',
                description: 'В этом модуле ты разберёшься, как работать на спотовом рынке и грамотно стейкать проекты.',
                lessons: [
                    'Введение в спот-торговлю и стейкинг',
                    'Биржевой интерфейс и типы ордеров, чтение стакана и объемов'
                ],
                icon: 'fa-basket-shopping',
                color: 'yellow'
            },
            {
                title: 'Фьючерсная торговля',
                description: 'В этом модуле ты освоишь торговлю с плечом: поймёшь, как правильно открывать и защищать позиции.',
                lessons: [
                    'Основа про фьючерсы'
                ],
                icon: 'fa-scale-balanced',
                color: 'yellow'
            },
            {
                title: 'AIRDROP',
                description: 'В этом модуле ты разберёшься, что такое аирдропы и как получать «бесплатные токены» безопасно и эффективно.',
                lessons: [
                    'Airdrop: начало твоего пути',
                    'Где находить AirDrop'
                ],
                icon: 'fa-gift',
                color: 'purple'
            },
            {
                title: 'Арбитраж',
                description: 'В этом модуле ты узнаешь, как зарабатывать на разнице цен между биржами, торговыми парами и платформами.',
                lessons: [
                    'Основа арбитража (P2P)'
                ],
                icon: 'fa-exchange-alt',
                color: 'purple'
            },
            {
                title: 'NFT',
                description: 'В этом модуле ты научишься понимать, создавать и торговать NFT.',
                lessons: [
                    'Введение в NFT'
                ],
                icon: 'fa-image',
                color: 'purple'
            },
            {
                title: 'Мемкоины',
                description: 'В рамках этого модуля мы научим анализировать и торговать мемкоинами.',
                lessons: [
                    'Важно знать',
                    'Анализ токенов'
                ],
                icon: 'fa-face-smile-beam',
                color: 'purple'
            }
        ];
    }

    function generateBaseAcademyModules() {
        const container = document.getElementById('base-academy-modules-container');
        if (!container) return;

        const modules = getBaseAcademyModules();
        let html = '';

        modules.forEach((module, index) => {
            const moduleNumber = index + 1;
            const colorClass = module.color === 'green' ? 'roadmap-module-green' : 
                             module.color === 'yellow' ? 'roadmap-module-yellow' : 
                             'roadmap-module-purple';
            const markerClass = module.color === 'green' ? 'roadmap-marker-green' : 
                               module.color === 'yellow' ? 'roadmap-marker-yellow' : 
                               'roadmap-marker-purple';
            const toggleClass = module.color === 'green' ? 'roadmap-toggle-green' : 
                               module.color === 'yellow' ? 'roadmap-toggle-yellow' : 
                               'roadmap-toggle-purple';

            const lessonsHtml = module.lessons.map(lesson => `<li>${lesson}</li>`).join('');

            html += `
                <div class="roadmap-module ${colorClass}">
                    <div class="roadmap-module-decoration">
                        <div class="roadmap-module-corner roadmap-module-corner-tl"></div>
                        <div class="roadmap-module-corner roadmap-module-corner-tr"></div>
                        <div class="roadmap-module-corner roadmap-module-corner-bl"></div>
                        <div class="roadmap-module-corner roadmap-module-corner-br"></div>
                    </div>
                    <div class="roadmap-marker ${markerClass}"></div>
                    <div class="roadmap-module-icon"><i class="fa-solid ${module.icon}"></i></div>
                    <div class="roadmap-module-header">Модуль ${moduleNumber}: ${module.title}</div>
                    <p class="roadmap-module-desc">${module.description}</p>
                    <button class="roadmap-toggle-lessons ${toggleClass}">Показать уроки</button>
                    <ul class="roadmap-lessons">
                        ${lessonsHtml}
                    </ul>
                </div>
            `;
        });

        container.innerHTML = html;

        // Инициализируем toggle для новых модулей
        const newToggleButtons = container.querySelectorAll('.roadmap-toggle-lessons');
        newToggleButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const lessons = this.nextElementSibling;
                if (lessons && lessons.classList.contains('roadmap-lessons')) {
                    if (lessons.style.display === 'block') {
                        lessons.style.display = 'none';
                        this.textContent = 'Показать уроки';
                    } else {
                        lessons.style.display = 'block';
                        this.textContent = 'Скрыть уроки';
                    }
                    // Update line transition after module expansion/collapse
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            if (typeof updateRoadmapLineTransition === 'function') {
                                updateRoadmapLineTransition();
                            }
                        });
                    });
                }
            });
        });

        // Обновляем линию после генерации модулей
        setTimeout(() => {
            if (typeof updateRoadmapLineTransition === 'function') {
                updateRoadmapLineTransition();
            }
        }, 100);
    }

    // Инициализация переключателя академий
    const academySwitcher = document.querySelector('.roadmap-academy-switcher');
    if (academySwitcher) {
        const switchButtons = academySwitcher.querySelectorAll('.academy-switch-btn');
        const roadmapPro = document.querySelector('.roadmap-pro');
        const roadmapBase = document.querySelector('.roadmap-base');

        // Генерируем модули BASE при первой загрузке
        generateBaseAcademyModules();

        switchButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const academy = this.getAttribute('data-academy');

                // Обновляем активные кнопки
                switchButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Переключаем видимость академий
                if (academy === 'pro') {
                    if (roadmapPro) roadmapPro.classList.add('active');
                    if (roadmapBase) roadmapBase.classList.remove('active');
                } else if (academy === 'base') {
                    if (roadmapPro) roadmapPro.classList.remove('active');
                    if (roadmapBase) roadmapBase.classList.add('active');
                }

                // Обновляем подзаголовок
                const subtitle = document.querySelector('.roadmap-subtitle');
                if (subtitle) {
                    if (academy === 'pro') {
                        subtitle.textContent = 'От новичка до мастера DeFi и трейдинга — 17 модулей, пошаговая карта обучения';
                    } else {
                        subtitle.textContent = 'От новичка до мастера DeFi и трейдинга — 12 модулей, пошаговая карта обучения';
                    }
                }

                // Обновляем сноску
                const noteCard = document.querySelector('.roadmap-note-card');
                if (noteCard) {
                    if (academy === 'pro') {
                        noteCard.innerHTML = '<strong>Важно:</strong> программа не отражает все уроки, практику и вебинары. Домашние задания и дополнительные темы обсуждаются по факту обучения с участниками потока.';
                    } else {
                        noteCard.innerHTML = '<strong>Важно:</strong> программа не отражает практику и часть уроков, которые будут в формате бонусов и вебинаров "здесь и сейчас"';
                    }
                }

                // Обновляем линию после переключения
                setTimeout(() => {
                    if (typeof updateRoadmapLineTransition === 'function') {
                        updateRoadmapLineTransition();
                    }
                }, 100);
            });
        });
    }
});

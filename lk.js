// ===== АВТОРИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    // Переключение между входом и регистрацией
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form-wrapper');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });

    // Показать/скрыть пароль
    const togglePasswordBtns = document.querySelectorAll('.auth-toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Временно: сразу переходим в ЛК
            window.location.href = 'lk.html';
        });
    }

    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Временно: сразу переходим в ЛК
            window.location.href = 'lk.html';
        });
    }
});

// ===== ЛИЧНЫЙ КАБИНЕТ =====
if (document.querySelector('.lk-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        initAntiphishingKey();
        initLKNavigation();
        initLKModules();
        initLKEvents();
        initLKProducts();
        initLKFAQ();
        initCopyButtons();
        initLessonModal();
        updateBaseAcademyProgress();
    });
}

// Инициализация антифишингового ключа
function initAntiphishingKey() {
    const keyElement = document.getElementById('antiphishing-key-value');
    const copyBtn = document.getElementById('antiphishing-copy-btn');
    const keyContainer = document.getElementById('antiphishing-key');
    
    if (!keyElement || !copyBtn) return;
    
    // Генерируем или получаем существующий ключ
    let antiphishingKey = localStorage.getItem('antiphishing_key');
    
    if (!antiphishingKey) {
        // Генерируем случайный ключ (16 символов: буквы и цифры)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        antiphishingKey = '';
        for (let i = 0; i < 16; i++) {
            antiphishingKey += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        localStorage.setItem('antiphishing_key', antiphishingKey);
    }
    
    // Отображаем ключ
    keyElement.textContent = antiphishingKey;
    keyContainer.setAttribute('data-copy', antiphishingKey);
    copyBtn.setAttribute('data-copy', antiphishingKey);
    
    // Обработчик копирования
    copyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navigator.clipboard.writeText(antiphishingKey).then(() => {
            showCopySuccess();
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = antiphishingKey;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopySuccess();
        });
    });
}

// Обновление прогресса Base Academy в профиле
function updateBaseAcademyProgress() {
    const baseModules = getBaseAcademyModules();
    let totalLessons = 0;
    let completedLessons = 0;
    
    baseModules.forEach((module, moduleIndex) => {
        const moduleNumber = moduleIndex + 1;
        module.lessons.forEach((lesson, lessonIndex) => {
            totalLessons++;
            if (isLessonCompleted(moduleNumber, lessonIndex, true)) {
                completedLessons++;
            }
        });
    });
    
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Обновляем прогресс в профиле
    const progressPercent = document.getElementById('base-progress-percent');
    const progressFill = document.getElementById('base-progress-fill');
    const progressStats = document.getElementById('base-progress-stats');
    
    if (progressPercent) {
        progressPercent.textContent = `${percent}%`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }
    
    if (progressStats) {
        progressStats.innerHTML = `
            <span><i class="fa-solid fa-book"></i> ${completedLessons}/${totalLessons} уроков пройдено</span>
        `;
    }
}

// Навигация по разделам
function initLKNavigation() {
    const navItems = document.querySelectorAll('.lk-nav-item');
    const sections = document.querySelectorAll('.lk-section');
    const sidebarToggle = document.querySelector('.lk-sidebar-toggle');
    const sidebar = document.querySelector('.lk-sidebar');
    const mobileMenuBtn = document.querySelector('.lk-mobile-menu-btn');
    const overlay = document.querySelector('.lk-sidebar-overlay');

    // Функция открытия/закрытия меню
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        if (overlay) {
            overlay.classList.toggle('active');
        }
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    // Функция закрытия меню
    function closeSidebar() {
        sidebar.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');

            navItems.forEach(ni => ni.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(`${targetSection}-section`).classList.add('active');
            
            // На мобильных закрываем сайдбар
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });

    // Переключение сайдбара через кнопку в сайдбаре
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            closeSidebar();
        });
    }

    // Переключение сайдбара через мобильную кнопку
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Закрытие сайдбара при клике на overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeSidebar();
        });
    }

    // Закрытие сайдбара при клике вне его на мобильных
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && 
                !e.target.closest('.lk-sidebar-toggle') && 
                !e.target.closest('.lk-mobile-menu-btn') &&
                sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }
    });

    // Закрытие меню при изменении размера окна (если перешли на десктоп)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            closeSidebar();
        }
    });
}

// Копирование данных
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.lk-copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const textToCopy = this.getAttribute('data-copy') || this.closest('.copyable').getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopySuccess();
            }).catch(() => {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopySuccess();
            });
        });
    });
}

function showCopySuccess() {
    const success = document.createElement('div');
    success.className = 'lk-copy-success';
    success.innerHTML = '<i class="fa-solid fa-check"></i> Скопировано!';
    document.body.appendChild(success);
    
    setTimeout(() => {
        success.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => success.remove(), 300);
    }, 2000);
}

// ===== СИСТЕМА УПРАВЛЕНИЯ СОСТОЯНИЕМ УРОКОВ =====
function getLessonState(moduleNumber, lessonIndex) {
    const key = `lesson_${moduleNumber}_${lessonIndex}`;
    const state = localStorage.getItem(key);
    return state ? JSON.parse(state) : {
        videoWatched: false,
        materialsViewed: [],
        homeworkSubmitted: false,
        testCompleted: false,
        testScore: null,
        completed: false
    };
}

function saveLessonState(moduleNumber, lessonIndex, state) {
    const key = `lesson_${moduleNumber}_${lessonIndex}`;
    localStorage.setItem(key, JSON.stringify(state));
}

function isLessonUnlocked(moduleNumber, lessonIndex, allModules) {
    // Модуль 1 - все уроки доступны сразу
    if (moduleNumber === 1) {
        return true;
    }
    
    // Если это первый урок модуля - проверяем предыдущий модуль
    if (lessonIndex === 0) {
        const prevModule = allModules[moduleNumber - 2];
        if (!prevModule) return true;
        
        // Проверяем, что все уроки предыдущего модуля завершены
        for (let i = 0; i < prevModule.lessons.length; i++) {
            const state = getLessonState(moduleNumber - 1, i);
            if (!state.completed) {
                return false;
            }
        }
        return true;
    }
    
    // Для остальных уроков проверяем предыдущий урок
    const prevLessonState = getLessonState(moduleNumber, lessonIndex - 1);
    return prevLessonState.completed;
}

function isLessonCompleted(moduleNumber, lessonIndex, isBaseStructure = false) {
    const state = getLessonState(moduleNumber, lessonIndex);
    
    if (isBaseStructure) {
        const baseModules = getBaseAcademyModules();
        const module = baseModules[moduleNumber - 1];
        const lesson = module && module.lessons[lessonIndex];
        const hasTest = lesson && lesson.hasTest;
        
        if (hasTest) {
            const testQuestions = getTestQuestions(moduleNumber, lessonIndex);
            const testPassed = state.testCompleted && state.testScore !== null && (state.testScore / testQuestions.length) >= 0.8;
            return state.completed && state.videoWatched && testPassed;
        }
    }
    
    return state.completed && state.videoWatched && state.homeworkSubmitted;
}

function getModuleProgress(moduleNumber, allModules) {
    const module = allModules[moduleNumber - 1];
    if (!module) return { completed: 0, total: 0, percent: 0 };
    
    let completed = 0;
    const isBaseStructure = module.lessons && module.lessons.length > 0 && typeof module.lessons[0] === 'object';
    
    module.lessons.forEach((lesson, index) => {
        if (isLessonCompleted(moduleNumber, index, isBaseStructure)) {
            completed++;
        }
    });
    
    return {
        completed,
        total: module.lessons.length,
        percent: module.lessons.length > 0 ? Math.round((completed / module.lessons.length) * 100) : 0
    };
}

// Модули и уроки
function initLKModules() {
    // Base Academy - загружаем модули
    loadModules('base-academy-modules', 'Base', -1, -1, true); // Base Academy - отдельные модули
    
    // PRO Academy - все модули из крипто-карты (1-17)
    loadModules('pro-academy-modules', 'PRO', 0, 17); // Все модули 1-17 для PRO
}

function loadModules(containerId, academyType, startIndex, endIndex, isBase = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (isBase) {
        // Base Academy - загружаем модули
        const baseModules = getBaseAcademyModules();
        
        // Загружаем модули
        baseModules.forEach((module, index) => {
            const moduleNumber = index + 1;
            const moduleCard = createModuleCard(module, moduleNumber, academyType, baseModules);
            container.appendChild(moduleCard);
        });
        
        // Добавляем обработчики для уроков после создания модулей
        setTimeout(() => {
            const lessonCards = container.querySelectorAll('.lk-lesson-card.clickable');
            lessonCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.lk-lesson-btn')) return;
                    
                    const moduleNumber = parseInt(this.getAttribute('data-module'));
                    const lessonIndex = parseInt(this.getAttribute('data-lesson'));
                    const lessonTitle = this.getAttribute('data-lesson-title');
                    openLessonModal(lessonTitle, moduleNumber, lessonIndex, academyType);
                });
                
                const openBtn = card.querySelector('.open-lesson');
                if (openBtn) {
                    openBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const moduleNumber = parseInt(this.getAttribute('data-module'));
                        const lessonIndex = parseInt(this.getAttribute('data-lesson'));
                        const lessonTitle = this.getAttribute('data-lesson-title');
                        openLessonModal(lessonTitle, moduleNumber, lessonIndex, academyType);
                    });
                }
            });
        }, 100);
        return;
    }

    // PRO Academy - все модули из крипто-карты (1-17)
    const allModules = getModulesData();
    const modules = allModules.slice(startIndex, endIndex || allModules.length);
    
    modules.forEach((module, index) => {
        const moduleNumber = startIndex + index + 1;
        const moduleCard = createModuleCard(module, moduleNumber, academyType, allModules);
        container.appendChild(moduleCard);
    });
    
    // Добавляем обработчики для уроков после создания модулей
    setTimeout(() => {
        const lessonCards = container.querySelectorAll('.lk-lesson-card.clickable');
        lessonCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Не открываем модалку при клике на кнопку
                if (e.target.closest('.lk-lesson-btn')) return;
                
                const moduleNumber = parseInt(this.getAttribute('data-module'));
                const lessonIndex = parseInt(this.getAttribute('data-lesson'));
                const lessonTitle = this.getAttribute('data-lesson-title');
                openLessonModal(lessonTitle, moduleNumber, lessonIndex, academyType);
            });
            
            const openBtn = card.querySelector('.open-lesson');
            if (openBtn) {
                openBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const moduleNumber = parseInt(this.getAttribute('data-module'));
                    const lessonIndex = parseInt(this.getAttribute('data-lesson'));
                    const lessonTitle = this.getAttribute('data-lesson-title');
                    openLessonModal(lessonTitle, moduleNumber, lessonIndex, academyType);
                });
            }
        });
    }, 100);
}

// Получение данных модулей Base Academy
function getBaseAcademyModules() {
    return [
        {
            title: 'Начало твоего пути',
            description: 'В этом модуле ты разберёшься, как устроен курс: кто тебя будет вести, какую поддержку получишь и как вообще всё здесь работает.',
            lessons: [
                {
                    title: 'Знакомство со спикерами и программой курса',
                    hasTest: false,
                    materials: ['video']
                },
                {
                    title: 'FAQ',
                    hasTest: false,
                    materials: ['video']
                }
            ],
            icon: 'fa-flag'
        },
        {
            title: 'Введение в крипту',
            description: 'В этом модуле ты разберёшься, что такое криптовалюта на самом деле: зачем она нужна, как работает и как в неё заходят с нуля.',
            lessons: [
                {
                    title: 'Личные цели и маршрут',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Криптовалюта: основа основ',
                    hasTest: true,
                    materials: ['video', 'presentation', 'glossary']
                },
                {
                    title: 'Как покупать и продавать криптовалюты',
                    hasTest: true,
                    materials: ['video']
                },
                {
                    title: 'Базовая информация по стратегии и портфелю',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Заводим свои первые кошельки',
                    hasTest: true,
                    materials: ['video']
                },
                {
                    title: 'Риск и мани-менеджмент',
                    hasTest: true,
                    materials: ['video', 'presentation']
                }
            ],
            icon: 'fa-coins'
        },
        {
            title: 'Безопасность операций с криптовалютой',
            description: 'В этом модуле ты узнаешь, как надёжно защищать свои средства и личные данные, а главное — как вовремя распознавать и обходить мошеннические схемы.',
            lessons: [
                {
                    title: 'Основы безопасности в криптовалюте',
                    hasTest: true,
                    materials: ['video', 'presentation']
                }
            ],
            icon: 'fa-shield-halved'
        },
        {
            title: 'Биржи',
            description: 'В этом модуле ты разберёшься, как устроены криптобиржи и чем различаются их форматы.',
            lessons: [
                {
                    title: 'Основа основ',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'DEX-мониторы',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Биржи для NFT',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Блокчейн-сканеры',
                    hasTest: true,
                    materials: ['video']
                }
            ],
            icon: 'fa-building-columns'
        },
        {
            title: 'Фундаментальный анализ',
            description: 'В этом модуле ты научишься разбираться в проектах до того, как вкладываешь деньги.',
            lessons: [
                {
                    title: 'Что такое ФА и почему это важно',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Команда, ниша, новости и инвесторы',
                    hasTest: true,
                    materials: ['video', 'presentation']
                }
            ],
            icon: 'fa-chart-line'
        },
        {
            title: 'Технический анализ и маржинальная торговля',
            description: 'В этом модуле ты освоишь основы технического анализа: научишься читать графики, видеть тренды и распознавать паттерны.',
            lessons: [
                {
                    title: 'Основа анализа',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Маржинальная торговля',
                    hasTest: true,
                    materials: ['video']
                }
            ],
            icon: 'fa-chart-area'
        },
        {
            title: 'Спот торговля и стейкинг проектов',
            description: 'В этом модуле ты разберёшься, как работать на спотовом рынке и грамотно стейкать проекты.',
            lessons: [
                {
                    title: 'Введение в спот-торговлю и стейкинг',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Биржевой интерфейс и типы ордеров, чтение стакана и объемов',
                    hasTest: true,
                    materials: ['video']
                }
            ],
            icon: 'fa-basket-shopping'
        },
        {
            title: 'Фьючерсная торговля',
            description: 'В этом модуле ты освоишь торговлю с плечом: поймёшь, как правильно открывать и защищать позиции.',
            lessons: [
                {
                    title: 'Основа про фьючерсы',
                    hasTest: true,
                    materials: ['video', 'presentation']
                }
            ],
            icon: 'fa-scale-balanced'
        },
        {
            title: 'AIRDROP',
            description: 'В этом модуле ты разберёшься, что такое аирдропы и как получать «бесплатные токены» безопасно и эффективно.',
            lessons: [
                {
                    title: 'Airdrop: начало твоего пути',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Где находить AirDrop',
                    hasTest: true,
                    materials: ['video']
                }
            ],
            icon: 'fa-gift'
        },
        {
            title: 'Арбитраж',
            description: 'В этом модуле ты узнаешь, как зарабатывать на разнице цен между биржами, торговыми парами и платформами.',
            lessons: [
                {
                    title: 'Основа арбитража (P2P)',
                    hasTest: true,
                    materials: ['video', 'presentation']
                }
            ],
            icon: 'fa-exchange-alt'
        },
        {
            title: 'NFT',
            description: 'В этом модуле ты научишься понимать, создавать и торговать NFT.',
            lessons: [
                {
                    title: 'Введение в NFT',
                    hasTest: true,
                    materials: ['video', 'presentation']
                }
            ],
            icon: 'fa-image'
        },
        {
            title: 'Мемкоины',
            description: 'В рамках этого модуля мы научим анализировать и торговать мемкоинами.',
            lessons: [
                {
                    title: 'Важно знать',
                    hasTest: true,
                    materials: ['video', 'presentation']
                },
                {
                    title: 'Анализ токенов',
                    hasTest: true,
                    materials: ['video', 'presentation']
                }
            ],
            icon: 'fa-face-smile-beam'
        }
    ];
}

// Создание мотивационной плашки для PRO Academy
function createProAcademyBanner() {
    return `
        <div class="lk-pro-academy-banner">
            <div class="lk-pro-academy-banner-content">
                <div class="lk-pro-academy-banner-icon">
                    <i class="fa-solid fa-star"></i>
                </div>
                <div class="lk-pro-academy-banner-text">
                    <h3 class="lk-pro-academy-banner-title">Что мне даст PRO академия?</h3>
                    <ul class="lk-pro-academy-banner-list">
                        <li><i class="fa-solid fa-check"></i> Больше модулей и уроков</li>
                        <li><i class="fa-solid fa-check"></i> Стратегии</li>
                        <li><i class="fa-solid fa-check"></i> Больше материалов в указанных уроках</li>
                        <li><i class="fa-solid fa-check"></i> Сообщество с коллами, аналитикой и сервисами без оплаты на время обучения</li>
                        <li><i class="fa-solid fa-check"></i> Сумма для обучения</li>
                    </ul>
                    <a href="index.html#pricing" class="lk-pro-academy-banner-link" target="_blank">
                        Подробнее – в тарифах
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function getModulesData() {
    return [
        {
            title: 'Начало твоего пути',
            description: 'В этом модуле ты разберёшься, как устроен курс: кто тебя будет вести, какую поддержку получишь и как вообще всё здесь работает. Мы познакомим тебя со спикерами и экосистемой, проведём по программе, дадим честные советы новичкам и разберём частые страхи перед стартом — те самые, которые обычно никто не решается озвучить.',
            lessons: ['Знакомство со спикерами и программой курса', 'Знакомство с экосистемой', 'FAQ'],
            icon: 'fa-flag'
        },
        {
            title: 'Введение в крипту',
            description: 'В этом модуле ты разберёшься, что такое криптовалюта на самом деле: зачем она нужна, как работает и как в неё заходят с нуля. Мы простыми словами объясним ключевые термины, покажем надёжные способы покупки и продажи, разберём основы риск-менеджмента и логику построения инвестиционной стратегии.',
            lessons: ['Личные цели и маршрут', 'Криптовалюта: основы основ', 'Как покупать и продавать криптовалюту', 'Как выбрать свой путь и стратегию, как собирать портфель', 'Заводим свои первые кошельки', 'Риск и мани-менеджмент', 'Основы безопасности в криптовалюте', 'Биржевые кошельки'],
            icon: 'fa-coins'
        },
        {
            title: 'Безопасность операций с криптовалютой',
            description: 'В этом модуле ты узнаешь, как надёжно защищать свои средства и личные данные, а главное — как вовремя распознавать и обходить мошеннические схемы. Мы разберём риски разных типов криптокошельков, дадим рекомендации по тем инструментам, которые используем сами, и научим работать с ними на практике.',
            lessons: ['Основы безопасности в криптовалюте', 'Биржевые кошельки', 'Горячие кошельки', 'Холодные кошельки', 'Безопасность при совершении P2P-транзакций', 'Безопасность при совершении NFT-транзакций', 'Безопасность при совершении спотовых и фьючерсных-транзакций', 'Безопасность при стейкинге', 'Безопасность AirDrop', 'Безопасность при совершении сделок с мемкоинами', 'Безопасность при совершении сделок с цифровыми активами Telegram', 'Безопасность при совершении сделок от новостей и сигналов'],
            icon: 'fa-shield-halved'
        },
        {
            title: 'Все по биржам',
            description: 'В этом модуле ты разберёшься, как устроены криптобиржи и чем различаются их форматы. Мы подробно сравним централизованные (CEX) и децентрализованные (DEX) площадки, покажем, как пользоваться каждой из них на практике и какие возможности они дают.',
            lessons: ['Основа основ', 'CEX-биржа', 'DEX-биржа', 'DEX-мониторы', 'Launchpads и IDO-платформы', 'Биржи для NFT', 'Блокчейн-сканеры', 'Биржа внутри Telegram'],
            icon: 'fa-building-columns'
        },
        {
            title: 'Фундаментальный анализ',
            description: 'В этом модуле ты научишься разбираться в проектах до того, как вкладываешь деньги. Мы покажем, как объективно оценивать токеномику, команду, рынок и ключевые метрики, чтобы понимать реальный потенциал проекта, а не полагаться на шум и обещания.',
            lessons: ['Что такое ФА и почему это важно', 'Ключевые метрики', 'Токеномика и модель проекта', 'Финансовые показатели криптопроекта', 'Команда и инвесторы', 'Рынок и конкуренты', 'Сентимент и новости', 'Анализ дорожной карты (Roadmap) и выполнение обещаний'],
            icon: 'fa-chart-line'
        },
        {
            title: 'Технический анализ',
            description: 'В этом модуле ты освоишь основы технического анализа: научишься читать графики, видеть тренды и распознавать паттерны. Мы разберём ключевые индикаторы, покажем, как на их основе выстраивать рабочие торговые стратегии и принимать взвешенные решения.',
            lessons: ['Введение в технический анализ', 'Тренды и линии поддержки/сопротивления', 'Фигуры технического анализа', 'Индикаторы и осцилляторы, инструменты', 'Статистика позиций и психология трейдинга', 'Торговля по графикам и сигналы', 'Маржинальная торговля', 'Объединение ТА и сентимент-анализа', 'Математика прибыльности: win rate, expectancy, Kelly formula'],
            icon: 'fa-chart-area'
        },
        {
            title: 'Спот торговля и стейкинг проектов',
            description: 'В этом модуле ты разберёшься, как работать на спотовом рынке и грамотно стейкать проекты. Мы покажем, как торговать без плеча, читать стакан ордеров, подбирать монеты и использовать инструменты анализа, чтобы принимать взвешенные решения.',
            lessons: ['Введение в спот-торговлю и стейкинг', 'Биржевой интерфейс и типы ордеров, чтение стакана и объемов', 'Стратегии спот торговли', 'Анализ исторических данных и паттернов', 'Связь спот-торговли и стейкинга с фундаментальным и техническим анализом'],
            icon: 'fa-basket-shopping'
        },
        {
            title: 'Фьючерсная торговля',
            description: 'В этом модуле ты освоишь торговлю с плечом: поймёшь, как правильно открывать и защищать позиции, управлять рисками ликвидации и контролировать загрузку депозита. Мы разберём стратегии для разных рыночных сценариев, чтобы ты мог действовать уверенно и без хаоса.',
            lessons: ['Основа и практически всё о фьючерсах', 'Стратегии фьючерсной торговли'],
            icon: 'fa-scale-balanced'
        },
        {
            title: 'AIRDROP',
            description: 'В этом модуле ты разберёшься, что такое аирдропы и как получать «бесплатные токены» безопасно и эффективно. Мы покажем, где искать перспективные проекты, как правильно участвовать и на что обращать внимание, чтобы не попасть на мошенников или бессмысленные активности.',
            lessons: ['Airdrop: начало твоего пути', 'Где находить AirDrop', 'Как участвовать в AirDrop'],
            icon: 'fa-gift'
        },
        {
            title: 'DeFi',
            description: 'В этом модуле ты освоишь ключевые инструменты децентрализованных финансов. Мы покажем, как пользоваться ликвидными пулами, стейкингом, фармингом, займами и другими DeFi-платформами — шаг за шагом и на понятных примерах.',
            lessons: ['Введение в DeFi', 'Лендинг и заимствование', 'Стейкинг и Yield Farming', 'Governance и управление'],
            icon: 'fa-network-wired'
        },
        {
            title: 'Токенизированные системы',
            description: 'В этом модуле ты познакомишься с токенизированными системами и их применением в разных сферах. Мы разберём, как токены используются в финансах, играх, бизнесе и других индустриях, и покажем реальные примеры, где они создают ценность.',
            lessons: ['SocialFi', 'GameFi', 'ScienceFi'],
            icon: 'fa-cube'
        },
        {
            title: 'Ончейн-инфраструктура и реальные активы',
            description: 'В этом модуле ты познакомишься с децентрализованными физическими сетями и принципами токенизации реальных активов. Мы разберём, как цифровые токены могут представлять недвижимость, товары и другие материальные ресурсы, и какие возможности это открывает для инвестиций и участия в проектах.',
            lessons: ['DePIN — децентрализованные физические сети', 'RWA — токенизация реальных активов'],
            icon: 'fa-server'
        },
        {
            title: 'Арбитраж',
            description: 'В этом модуле ты узнаешь, как зарабатывать на разнице цен между биржами, торговыми парами и платформами. Мы покажем реальные стратегии арбитража, научим управлять комиссиями и минимизировать расходы.',
            lessons: ['Всё про арбитраж (P2P)', 'Стратегии заработка', 'Риски, что делать и ошибки'],
            icon: 'fa-exchange-alt'
        },
        {
            title: 'NFT',
            description: 'В этом модуле ты научишься понимать, создавать и торговать NFT. Мы разберём, как работает технология, где безопасно покупать токены, как анализировать коллекции и оценивать их потенциал.',
            lessons: ['Введение в NFT', 'NFT-рынки и биржи', 'Как выбирать NFT, покупать и продавать', 'Как создавать NFT и продвигать его'],
            icon: 'fa-image'
        },
        {
            title: 'Мемкоины',
            description: 'В рамках этого модуля мы научим анализировать и торговать мемкоинами — самыми волатильными и хайповыми токенами рынка. Поймёшь, как искать перспективные монеты и строить стратегии торговли, а главное – как избегать мусора в этом секторе.',
            lessons: ['Важно знать', 'Анализ токенов', 'Нарративы, соцсети, инфополе, kolscan', 'Глубокий ончейн-анализ и Cielo', 'Стратегия – флип от уровней', 'Стратегия – среднесрочная торговля и гемхантинг', 'Стратегия – флип на ПФ + быстрый холд + фиба', 'Стратегия – флип на секундном тайм-фрейме', 'Стратегия «копитрейдинг»', 'Инструменты для торговли'],
            icon: 'fa-face-smile-beam'
        },
        {
            title: 'Цифровой капитал Telegram',
            description: 'В рамках этого модуля мы объясним, как монетизировать активы в Telegram — от редких подарков до уникальных никнеймов. Покажем, как находить ценные теги, торговать ими и строить коллекции.',
            lessons: ['Подарки', 'Никнеймы'],
            icon: 'fa-comment-dollar'
        },
        {
            title: 'Polymarket — децентрализованные предсказательные рынки',
            description: 'В этом модуле ты освоишь торговлю на предсказательных рынках Polymarket. Мы покажем, как устроены рынки, как открывать и закрывать позиции, анализировать события и строить эффективные стратегии торговли.',
            lessons: ['Что такое Polymarket', 'Как устроены рынки на Polymarket', 'Как открывать позиции и закрывать их', 'Ликвидность, спреды, Impact', 'Как анализировать события', 'Стратегии торговли на Polymarket', 'Продвинутый уровень'],
            icon: 'fa-chart-pie'
        }
    ];
}

function createModuleCard(module, number, academyType, allModules) {
    const card = document.createElement('div');
    card.className = 'lk-module-card';
    
    // Получаем реальный прогресс модуля
    const moduleProgress = getModuleProgress(number, allModules);
    
    // Проверяем структуру уроков - для Base Academy это объекты, для PRO - строки
    const isBaseStructure = module.lessons && module.lessons.length > 0 && typeof module.lessons[0] === 'object';
    
    card.innerHTML = `
        <div class="lk-module-header">
            <div class="lk-module-title-wrapper">
                <div class="lk-module-number">
                    <i class="fa-solid ${module.icon || 'fa-book'}"></i>
                    Модуль ${number}
                </div>
                <h3 class="lk-module-title">${module.title}</h3>
            </div>
            <div class="lk-module-progress">
                <div class="lk-module-progress-value">${moduleProgress.percent}%</div>
                <div class="lk-module-progress-label">${moduleProgress.completed}/${moduleProgress.total} уроков</div>
            </div>
        </div>
        <p class="lk-module-description">${module.description}</p>
        <div class="lk-module-lessons">
            ${module.lessons.map((lesson, idx) => {
                const lessonTitle = isBaseStructure ? lesson.title : lesson;
                return createLessonCard(lesson, lessonTitle, idx, number, academyType, allModules, isBaseStructure);
            }).join('')}
        </div>
    `;
    
    return card;
}

function createLessonCard(lessonData, lessonTitle, lessonIndex, moduleNumber, academyType, allModules, isBaseStructure = false) {
    const isUnlocked = academyType === 'Base' || isLessonUnlocked(moduleNumber, lessonIndex, allModules);
    const state = getLessonState(moduleNumber, lessonIndex);
    const hasTest = isBaseStructure && lessonData.hasTest;
    const isCompleted = state.completed && state.videoWatched && (hasTest ? state.testCompleted : state.homeworkSubmitted);
    
    let status, statusText, lockedReason = '';
    
    if (isCompleted) {
        status = 'completed';
        statusText = '<i class="fa-solid fa-check-circle"></i> Пройдено';
    } else if (isUnlocked) {
        status = 'in-progress';
        statusText = '<i class="fa-solid fa-play-circle"></i> В процессе';
    } else {
        status = 'locked';
        if (moduleNumber === 1) {
            statusText = '<i class="fa-solid fa-lock"></i> Заблокировано';
        } else if (lessonIndex === 0) {
            statusText = '<i class="fa-solid fa-lock"></i> Завершите предыдущий модуль';
            lockedReason = 'Завершите все уроки предыдущего модуля для доступа к этому уроку.';
        } else {
            statusText = '<i class="fa-solid fa-lock"></i> Заблокировано';
            lockedReason = 'Завершите предыдущий урок для доступа к этому.';
        }
    }
    
    return `
        <div class="lk-lesson-card ${status !== 'locked' ? 'clickable' : ''}" 
             data-module="${moduleNumber}" 
             data-lesson="${lessonIndex}" 
             data-status="${status}"
             data-lesson-title="${lessonTitle}"
             data-has-test="${hasTest || false}">
            <div class="lk-lesson-header">
                <span class="lk-lesson-title">${lessonTitle}</span>
                <span class="lk-lesson-status ${status}">${statusText}</span>
            </div>
            ${lockedReason ? `
                <div class="lk-lesson-locked-hint">
                    <i class="fa-solid fa-info-circle"></i>
                    ${lockedReason}
                </div>
            ` : ''}
            ${status !== 'locked' ? `
                <div class="lk-lesson-actions">
                    <button class="lk-lesson-btn open-lesson" 
                            data-module="${moduleNumber}" 
                            data-lesson="${lessonIndex}"
                            data-lesson-title="${lessonTitle}">
                        <i class="fa-solid fa-play"></i>
                        Открыть урок
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// Мероприятия
function initLKEvents() {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    const events = [
        {
            title: 'AMA-сессия с основателями',
            description: 'Эксклюзивный эфир с инсайтами, живая торговля и ответы от основателей проекта',
            date: '15.01.2024, 20:00',
            status: 'upcoming',
            type: 'AMA'
        },
        {
            title: 'Совместная торговля',
            description: 'Присоединяйся к живой торговой сессии с опытными трейдерами сообщества',
            date: '12.01.2024, 19:00',
            status: 'active',
            type: 'Торговля'
        },
        {
            title: 'Разбор портфелей',
            description: 'Публичный разбор портфелей участников сообщества',
            date: '10.01.2024, 18:00',
            status: 'completed',
            type: 'Обучение'
        }
    ];

    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });

    // Фильтры мероприятий
    const filterBtns = document.querySelectorAll('.lk-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterEvents(filter);
        });
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'lk-event-card';
    card.setAttribute('data-status', event.status);
    
    const statusText = {
        'upcoming': 'Предстоящее',
        'active': 'Активно',
        'completed': 'Завершено'
    };
    
    card.innerHTML = `
        <div class="lk-event-status ${event.status}">${statusText[event.status]}</div>
        <h3 class="lk-event-title">${event.title}</h3>
        <p class="lk-event-description">${event.description}</p>
        <div class="lk-event-info">
            <div class="lk-event-info-item">
                <i class="fa-solid fa-calendar"></i>
                <span>${event.date}</span>
            </div>
            <div class="lk-event-info-item">
                <i class="fa-solid fa-tag"></i>
                <span>${event.type}</span>
            </div>
        </div>
        <div class="lk-event-actions">
            ${event.status === 'upcoming' || event.status === 'active' ? `
                <button class="lk-event-btn primary">
                    <i class="fa-solid fa-user-plus"></i>
                    Участвовать
                </button>
            ` : ''}
            <button class="lk-event-btn">
                <i class="fa-solid fa-info-circle"></i>
                Подробнее
            </button>
        </div>
    `;
    
    return card;
}

function filterEvents(filter) {
    const eventCards = document.querySelectorAll('.lk-event-card');
    eventCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-status') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Продукты
function initLKProducts() {
    const productsGrid = document.querySelector('.lk-products-grid');
    if (!productsGrid) return;

    const products = getProductsData();
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="lk-product-empty">
                <div class="lk-product-empty-icon">
                    <i class="fa-solid fa-shopping-cart"></i>
                </div>
                <h3 class="lk-product-empty-title">У вас пока нет продуктов</h3>
                <p class="lk-product-empty-text">Купите продукт, чтобы начать пользоваться дополнительными возможностями</p>
                <a href="index.html#products" class="lk-buy-link" target="_blank">
                    <i class="fa-solid fa-plus"></i>
                    Купить продукт
                </a>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function getProductsData() {
    // Возвращаем пустой массив по умолчанию - продукты будут подгружаться из данных пользователя
    // Для демонстрации можно оставить примеры продуктов
    return [];
    
    // Примеры продуктов (раскомментировать для тестирования):
    /*
    return [
        {
            number: '01',
            name: 'Бот с новостями',
            description: 'Следи за ключевыми инсайтами и событиями рынка в реальном времени',
            expiry: '2024-04-15',
            conditions: ['Доступ к новостям 24/7', 'Персональные уведомления', 'Фильтры по темам']
        },
        {
            number: '02',
            name: 'Бот с сигналами',
            description: 'Получай торговые сигналы и точки входа по нашим фильтрам',
            expiry: '2024-03-20',
            conditions: ['Торговые сигналы в реальном времени', 'Анализ точек входа', 'Рекомендации по управлению рисками']
        },
        {
            number: '03',
            name: 'Модули обучения',
            description: 'Выбери необходимое количество модулей для полноценного обучения',
            expiry: '2024-12-31',
            conditions: ['Доступ к выбранным модулям', 'Пожизненный доступ к материалам']
        },
        {
            number: '04',
            name: 'Разбор твоих сделок',
            description: 'Анализ твоих сделок в созвоне с профессиональным трейдером',
            expiry: '2024-06-30',
            conditions: ['Персональный разбор сделок', 'Рекомендации по улучшению']
        },
        {
            number: '05',
            name: 'Резервный пул сообщества',
            description: 'Минимальное участие — 5 000₽ в месяц. Защищай свой депозит',
            expiry: '2024-12-31',
            conditions: ['Защита депозита', 'Поддержка в случае ошибок']
        },
        {
            number: '06',
            name: 'Доступ к чату с опытными трейдерами',
            description: 'Сигналы, аналитика, совместные созвоны и общение',
            expiry: '2024-05-31',
            conditions: ['Доступ к закрытому чату', 'Эксклюзивные сигналы']
        },
        {
            number: '07',
            name: 'Участие в AMA-сессии',
            description: 'Эксклюзивные эфиры с инсайтами и живой торговлей',
            expiry: '2024-02-28',
            conditions: ['Участие в одной сессии', 'Запись доступна 30 дней']
        },
        {
            number: '08',
            name: 'Сборка / анализ портфеля',
            description: 'Индивидуальный анализ и стратегия под твои цели',
            expiry: '2024-12-31',
            conditions: ['Персональная консультация', 'Детальный анализ портфеля']
        }
    ];
    */
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'lk-product-card';
    
    const daysLeft = Math.floor((new Date(product.expiry) - new Date()) / (1000 * 60 * 60 * 24));
    const status = daysLeft > 0 ? 'active' : 'expired';
    
    card.innerHTML = `
        <div class="lk-product-header">
            <div class="lk-product-number">${product.number}</div>
            <div class="lk-product-status ${status}">${status === 'active' ? 'Активен' : 'Истёк'}</div>
        </div>
        <h3 class="lk-product-name">${product.name}</h3>
        <p class="lk-product-description">${product.description}</p>
        ${daysLeft > 0 ? `
            <div class="lk-product-expiry">
                <i class="fa-solid fa-clock"></i>
                <span>Осталось ${daysLeft} ${daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}</span>
            </div>
        ` : ''}
        ${product.conditions ? `
            <div class="lk-product-conditions">
                <div class="lk-product-conditions-title">Условия</div>
                <ul class="lk-product-conditions-list">
                    ${product.conditions.map(cond => `<li>${cond}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;
    
    return card;
}

// FAQ
function initLKFAQ() {
    const faqList = document.querySelector('.lk-faq-list');
    if (!faqList) return;

    const faqItems = [
        {
            question: 'Как получить доступ к PRO Academy?',
            answer: 'PRO Academy доступна только для участников, оплативших соответствующий тариф. После оплаты доступ открывается автоматически.'
        },
        {
            question: 'Как отправлять домашние задания?',
            answer: 'В каждом уроке есть раздел "Домашнее задание". Прикрепите файл с выполненным заданием и нажмите "Отправить".'
        },
        {
            question: 'Где посмотреть свой прогресс?',
            answer: 'Прогресс обучения отображается в разделе "Профиль", а также в карточках модулей в разделах академий.'
        }
    ];

    faqItems.forEach(item => {
        const faqItem = document.createElement('div');
        faqItem.className = 'lk-faq-item';
        faqItem.innerHTML = `
            <div class="lk-faq-question">
                <span>${item.question}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="lk-faq-answer">
                <div class="lk-faq-answer-content">${item.answer}</div>
            </div>
        `;
        
        faqItem.querySelector('.lk-faq-question').addEventListener('click', function() {
            faqItem.classList.toggle('active');
        });
        
        faqList.appendChild(faqItem);
    });
}

// Модальное окно урока
function initLessonModal() {
    const modal = document.getElementById('lesson-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.lk-modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Обработка загрузки домашнего задания
    document.addEventListener('change', function(e) {
        if (e.target.id === 'homework-file') {
            const file = e.target.files[0];
            if (file) {
                const uploadArea = document.querySelector('.lk-homework-upload');
                if (uploadArea) {
                    uploadArea.querySelector('.lk-homework-upload-text').textContent = `Выбран файл: ${file.name}`;
                }
            }
        }
    });
}

function openLessonModal(lessonTitle, moduleNumber, lessonIndex, academyType) {
    const modal = document.getElementById('lesson-modal');
    const modalBody = document.getElementById('lesson-modal-body');
    if (!modal || !modalBody) return;
    
    // Получаем состояние урока
    const lessonState = getLessonState(moduleNumber, lessonIndex);
    
    // Определяем тип академии и получаем данные урока
    let module, lessonData, lessonTitleFromData, hasTest = false, materials = [];
    
    if (academyType === 'Base') {
        const baseModules = getBaseAcademyModules();
        module = baseModules[moduleNumber - 1];
        if (module && module.lessons[lessonIndex]) {
            lessonData = module.lessons[lessonIndex];
            lessonTitleFromData = lessonData.title;
            hasTest = lessonData.hasTest || false;
            
            // Формируем материалы на основе lessonData.materials
            if (lessonData.materials) {
                materials = lessonData.materials.map(mat => {
                    if (mat === 'video') return null; // Видео обрабатывается отдельно
                    if (mat === 'presentation') return { name: 'Презентация к уроку', size: '2.5 МБ', type: 'pdf', url: '#' };
                    if (mat === 'glossary') return { name: 'Крипто-глоссарий', size: '1.8 МБ', type: 'pdf', url: '#' };
                    return null;
                }).filter(Boolean);
            }
        }
    } else {
        const allModules = getModulesData();
        module = allModules[moduleNumber - 1];
        lessonTitleFromData = module ? (typeof module.lessons[lessonIndex] === 'string' ? module.lessons[lessonIndex] : lessonTitle) : lessonTitle;
        materials = [
            { name: 'Презентация к уроку', size: '2.5 МБ', type: 'pdf', url: '#' },
            { name: 'Конспект урока', size: '1.2 МБ', type: 'word', url: '#' }
        ];
    }
    
    if (!lessonTitleFromData) lessonTitleFromData = lessonTitle;
    
    // Для PRO Academy добавляем предупреждение о правилах (кроме модуля 1)
    const showRulesWarning = academyType === 'PRO' && moduleNumber > 1;
    
    // Видео (временно заглушка, потом из данных)
    const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Временная заглушка
    const homeworkText = 'Выполните задание и прикрепите файл с решением. После проверки вы получите оценку и обратную связь.';
    
    modalBody.innerHTML = `
        <div class="lk-lesson-content-header">
            <h2 class="lk-lesson-content-title">${lessonTitleFromData}</h2>
            <div class="lk-lesson-content-meta">
                <span><i class="fa-solid fa-clock"></i> 45 минут</span>
                <span><i class="fa-solid fa-book"></i> Видео + материалы</span>
                ${showRulesWarning ? `
                    <div class="lk-lesson-rules-warning">
                        <i class="fa-solid fa-info-circle"></i>
                        <span>Видео необходимо досмотреть до конца полностью для зачета урока</span>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="lk-lesson-content-section">
            <h3 class="lk-lesson-content-section-title">
                <i class="fa-solid fa-video"></i>
                Видеоурок
                ${lessonState.videoWatched ? '<span class="lk-check-mark"><i class="fa-solid fa-check-circle"></i> Просмотрено</span>' : ''}
            </h3>
            <div class="lk-lesson-video" id="lesson-video-container" data-module="${moduleNumber}" data-lesson="${lessonIndex}">
                <div id="lesson-youtube-player"></div>
            </div>
            ${!lessonState.videoWatched ? `
                <div class="lk-video-warning">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <span>Важно: видео необходимо досмотреть до конца полностью, без перемотки. Урок не будет засчитан, если видео не просмотрено полностью.</span>
                </div>
            ` : ''}
        </div>
        
        <div class="lk-lesson-content-section">
            <h3 class="lk-lesson-content-section-title">
                <i class="fa-solid fa-file"></i>
                Материалы к уроку
                ${materials.length > 0 && lessonState.materialsViewed.length === materials.length ? 
                    '<span class="lk-check-mark"><i class="fa-solid fa-check-circle"></i> Все просмотрены</span>' : ''}
            </h3>
            <div class="lk-lesson-materials">
                <ul class="lk-lesson-materials-list">
                    ${materials.map((material, idx) => `
                        <li class="lk-material-item ${lessonState.materialsViewed.includes(idx) ? 'viewed' : ''}" 
                            data-material-index="${idx}"
                            data-module="${moduleNumber}"
                            data-lesson="${lessonIndex}">
                            <div class="lk-material-icon">
                                <i class="fa-solid fa-file-${material.type === 'pdf' ? 'pdf' : 'word'}"></i>
                            </div>
                            <div class="lk-material-info">
                                <div class="lk-material-name">${material.name}</div>
                                <div class="lk-material-size">${material.size}</div>
                            </div>
                            <a href="${material.url}" class="lk-material-download" target="_blank" rel="noopener">
                                <i class="fa-solid fa-download"></i>
                                Скачать
                            </a>
                            ${!lessonState.materialsViewed.includes(idx) ? `
                                <button class="lk-material-mark-viewed" 
                                        data-material-index="${idx}"
                                        data-module="${moduleNumber}"
                                        data-lesson="${lessonIndex}">
                                    <i class="fa-solid fa-check"></i>
                                    Отметить как просмотренное
                                </button>
                            ` : '<span class="lk-material-viewed-badge"><i class="fa-solid fa-check"></i> Просмотрено</span>'}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="lk-lesson-content-section">
            ${hasTest ? createTestSection(moduleNumber, lessonIndex, lessonState, materials) : (moduleNumber === 1 && academyType === 'Base' ? '' : `
            <div class="lk-homework-section">
                <h3 class="lk-homework-title">
                    <i class="fa-solid fa-tasks"></i>
                    Домашнее задание
                    ${lessonState.homeworkSubmitted ? '<span class="lk-check-mark"><i class="fa-solid fa-check-circle"></i> Отправлено</span>' : ''}
                </h3>
                <p class="lk-homework-description">${homeworkText}</p>
                ${!lessonState.homeworkSubmitted ? `
                    <div class="lk-homework-upload" onclick="document.getElementById('homework-file-${moduleNumber}-${lessonIndex}').click()">
                        <div class="lk-homework-upload-icon">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="lk-homework-upload-text">Нажмите для загрузки файла</div>
                        <div class="lk-homework-upload-hint">PDF, DOC, DOCX до 10 МБ</div>
                    </div>
                    <input type="file" id="homework-file-${moduleNumber}-${lessonIndex}" 
                           class="lk-homework-file-input" 
                           accept=".pdf,.doc,.docx"
                           data-module="${moduleNumber}"
                           data-lesson="${lessonIndex}">
                    <button class="lk-homework-submit-btn" 
                            data-module="${moduleNumber}"
                            data-lesson="${lessonIndex}"
                            ${!lessonState.videoWatched || lessonState.materialsViewed.length < materials.length ? 'disabled' : ''}>
                        <i class="fa-solid fa-paper-plane"></i>
                        Отправить домашнее задание
                    </button>
                    ${!lessonState.videoWatched || lessonState.materialsViewed.length < materials.length ? `
                        <div class="lk-homework-warning">
                            <i class="fa-solid fa-lock"></i>
                            <span>Для отправки ДЗ необходимо просмотреть видео полностью и все материалы</span>
                        </div>
                    ` : ''}
                ` : `
                    <div class="lk-homework-submitted">
                        <i class="fa-solid fa-check-circle"></i>
                        <span>Домашнее задание отправлено и ожидает проверки</span>
                    </div>
                `}
            </div>
            `)}
        </div>
    `;
    
    // Инициализируем YouTube плеер и обработчики
    initLessonVideo(moduleNumber, lessonIndex, videoUrl);
    initLessonMaterials(moduleNumber, lessonIndex);
    
    if (hasTest) {
        initTest(moduleNumber, lessonIndex);
    } else {
        // Для первого модуля базовой академии не инициализируем ДЗ
        if (!(moduleNumber === 1 && academyType === 'Base')) {
            const allModules = academyType === 'Base' ? getBaseAcademyModules() : getModulesData();
            initLessonHomework(moduleNumber, lessonIndex, allModules);
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Инициализация видео с отслеживанием просмотра
function initLessonVideo(moduleNumber, lessonIndex, videoUrl) {
    const container = document.getElementById('lesson-video-container');
    if (!container) return;
    
    // Парсим YouTube URL
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) {
        container.innerHTML = '<p>Видео будет загружено здесь</p>';
        return;
    }
    
    // Создаем iframe для YouTube
    container.innerHTML = `
        <div id="lesson-youtube-player-wrapper" style="width: 100%; aspect-ratio: 16/9;">
            <iframe id="lesson-youtube-iframe" 
                    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="width: 100%; height: 100%; border-radius: 12px;">
            </iframe>
        </div>
    `;
    
    // Загружаем YouTube IFrame API если еще не загружена
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = function() {
            createYouTubePlayer(videoId, moduleNumber, lessonIndex);
        };
    } else {
        createYouTubePlayer(videoId, moduleNumber, lessonIndex);
    }
}

function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

let youtubePlayer = null;
function createYouTubePlayer(videoId, moduleNumber, lessonIndex) {
    const container = document.getElementById('lesson-youtube-player-wrapper');
    if (!container) return;
    
    youtubePlayer = new YT.Player('lesson-youtube-iframe', {
        videoId: videoId,
        events: {
            'onStateChange': function(event) {
                // Отслеживаем окончание видео (state 0 = ended)
                if (event.data === YT.PlayerState.ENDED) {
                    markVideoAsWatched(moduleNumber, lessonIndex);
                }
            },
            'onError': function(event) {
                console.error('YouTube player error:', event.data);
            }
        },
        playerVars: {
            'rel': 0,
            'modestbranding': 1
        }
    });
}

function markVideoAsWatched(moduleNumber, lessonIndex) {
    const state = getLessonState(moduleNumber, lessonIndex);
    state.videoWatched = true;
    
    // Проверяем, можно ли завершить урок
    checkAndCompleteLesson(moduleNumber, lessonIndex);
    saveLessonState(moduleNumber, lessonIndex, state);
    
    // Обновляем UI
    updateVideoStatus(moduleNumber, lessonIndex, true);
}

function updateVideoStatus(moduleNumber, lessonIndex, watched) {
    const sectionTitle = document.querySelector(`#lesson-modal .lk-lesson-content-section:first-of-type h3`);
    if (sectionTitle && !watched) {
        const checkMark = sectionTitle.querySelector('.lk-check-mark');
        if (!checkMark) {
            sectionTitle.innerHTML += '<span class="lk-check-mark"><i class="fa-solid fa-check-circle"></i> Просмотрено</span>';
        }
    }
    
    // Скрываем предупреждение
    const warning = document.querySelector('.lk-video-warning');
    if (warning && watched) {
        warning.style.display = 'none';
    }
}

// Инициализация материалов
function initLessonMaterials(moduleNumber, lessonIndex) {
    const markButtons = document.querySelectorAll('.lk-material-mark-viewed');
    markButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialIndex = parseInt(this.getAttribute('data-material-index'));
            markMaterialAsViewed(moduleNumber, lessonIndex, materialIndex);
        });
    });
    
    // Отслеживаем скачивание материалов (клик на ссылку скачивания)
    const downloadLinks = document.querySelectorAll('.lk-material-download');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function() {
            const item = this.closest('.lk-material-item');
            if (item) {
                const materialIndex = parseInt(item.getAttribute('data-material-index'));
                const moduleNum = parseInt(item.getAttribute('data-module'));
                const lessonIdx = parseInt(item.getAttribute('data-lesson'));
                // Автоматически отмечаем как просмотренное при скачивании
                setTimeout(() => markMaterialAsViewed(moduleNum, lessonIdx, materialIndex), 500);
            }
        });
    });
}

function markMaterialAsViewed(moduleNumber, lessonIndex, materialIndex) {
    const state = getLessonState(moduleNumber, lessonIndex);
    if (!state.materialsViewed.includes(materialIndex)) {
        state.materialsViewed.push(materialIndex);
        saveLessonState(moduleNumber, lessonIndex, state);
        
        // Обновляем UI
        const materialItem = document.querySelector(`.lk-material-item[data-material-index="${materialIndex}"][data-module="${moduleNumber}"][data-lesson="${lessonIndex}"]`);
        if (materialItem) {
            materialItem.classList.add('viewed');
            const markBtn = materialItem.querySelector('.lk-material-mark-viewed');
            if (markBtn) {
                markBtn.outerHTML = '<span class="lk-material-viewed-badge"><i class="fa-solid fa-check"></i> Просмотрено</span>';
            }
        }
        
        // Проверяем, можно ли завершить урок
        checkAndCompleteLesson(moduleNumber, lessonIndex);
    }
}

// Инициализация домашнего задания
function initLessonHomework(moduleNumber, lessonIndex, allModules) {
    const fileInput = document.getElementById(`homework-file-${moduleNumber}-${lessonIndex}`);
    const submitBtn = document.querySelector(`.lk-homework-submit-btn[data-module="${moduleNumber}"][data-lesson="${lessonIndex}"]`);
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const uploadArea = document.querySelector(`#homework-file-${moduleNumber}-${lessonIndex}`).previousElementSibling;
                if (uploadArea) {
                    const textElement = uploadArea.querySelector('.lk-homework-upload-text');
                    if (textElement) {
                        textElement.textContent = `Выбран файл: ${file.name}`;
                    }
                }
                
                // Включаем кнопку отправки если файл выбран
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.style.opacity = '1';
                }
            }
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const fileInput = document.getElementById(`homework-file-${moduleNumber}-${lessonIndex}`);
            if (!fileInput || !fileInput.files[0]) {
                alert('Пожалуйста, выберите файл для отправки');
                return;
            }
            
            submitHomework(moduleNumber, lessonIndex, fileInput.files[0]);
        });
    }
}

function submitHomework(moduleNumber, lessonIndex, file) {
    const state = getLessonState(moduleNumber, lessonIndex);
    
    // Проверяем условия
    if (!state.videoWatched) {
        alert('Необходимо досмотреть видео до конца для отправки домашнего задания');
        return;
    }
    
    const allModules = getModulesData();
    const module = allModules[moduleNumber - 1];
    const materialsCount = module ? 2 : 0; // Временно 2 материала, потом из данных
    
    if (state.materialsViewed.length < materialsCount) {
        alert('Необходимо просмотреть все материалы для отправки домашнего задания');
        return;
    }
    
    // Отправляем ДЗ (здесь будет реальная отправка на сервер)
    state.homeworkSubmitted = true;
    state.homeworkFile = file.name; // Сохраняем имя файла
    saveLessonState(moduleNumber, lessonIndex, state);
    
    // Проверяем, можно ли завершить урок
    checkAndCompleteLesson(moduleNumber, lessonIndex);
    
    // Обновляем UI
    location.reload(); // Временно перезагружаем страницу для обновления состояния
}

// Проверка и завершение урока
function checkAndCompleteLesson(moduleNumber, lessonIndex) {
    const state = getLessonState(moduleNumber, lessonIndex);
    
    // Определяем тип академии и требования для завершения
    let materialsCount = 0;
    let hasTest = false;
    let allModules;
    
    // Проверяем, Base Academy это или PRO
    const baseModules = getBaseAcademyModules();
    if (baseModules[moduleNumber - 1]) {
        allModules = baseModules;
        const module = baseModules[moduleNumber - 1];
        if (module && module.lessons[lessonIndex]) {
            hasTest = module.lessons[lessonIndex].hasTest || false;
            materialsCount = module.lessons[lessonIndex].materials ? module.lessons[lessonIndex].materials.filter(m => m !== 'video').length : 0;
        }
    } else {
        allModules = getModulesData();
        const module = allModules[moduleNumber - 1];
        materialsCount = module ? 2 : 0; // Временно 2 материала для PRO
    }
    
    // Для первого модуля базовой академии не требуем ДЗ
    const isFirstModuleBase = moduleNumber === 1 && baseModules[moduleNumber - 1];
    
    // Урок завершен, если видео просмотрено, все материалы изучены и (ДЗ отправлено или тест пройден)
    const homeworkOrTestDone = hasTest ? (state.testCompleted && state.testScore !== null && (state.testScore / getTestQuestions(moduleNumber, lessonIndex).length) >= 0.8) : (isFirstModuleBase ? true : state.homeworkSubmitted);
    
    // Для первого модуля базовой академии не требуем просмотр видео и материалов
    const videoAndMaterialsDone = isFirstModuleBase ? true : (state.videoWatched && state.materialsViewed.length >= materialsCount);
    
    if (videoAndMaterialsDone && 
        homeworkOrTestDone && 
        !state.completed) {
        
        state.completed = true;
        saveLessonState(moduleNumber, lessonIndex, state);
        
        // Разблокируем следующий урок и перезагружаем модули
        setTimeout(() => {
            reloadModules();
        }, 500);
    }
}

// Создание секции теста для Base Academy
function createTestSection(moduleNumber, lessonIndex, lessonState, materials) {
    const testCompleted = lessonState.testCompleted || false;
    const testScore = lessonState.testScore !== undefined ? lessonState.testScore : null;
    const testQuestions = getTestQuestions(moduleNumber, lessonIndex);
    
    if (testCompleted && testScore !== null) {
        return `
            <div class="lk-test-section">
                <h3 class="lk-test-title">
                    <i class="fa-solid fa-clipboard-question"></i>
                    Тест по уроку
                    <span class="lk-check-mark"><i class="fa-solid fa-check-circle"></i> Пройден</span>
                </h3>
                <div class="lk-test-result">
                    <div class="lk-test-score">
                        <div class="lk-test-score-value">${testScore}/${testQuestions.length}</div>
                        <div class="lk-test-score-label">правильных ответов</div>
                        <div class="lk-test-score-percent">${Math.round((testScore / testQuestions.length) * 100)}%</div>
                    </div>
                    <p class="lk-test-result-text">Тест успешно пройден! Вы можете перейти к следующему уроку.</p>
                </div>
            </div>
        `;
    }
    
    // Для базовой академии тест доступен сразу
    const baseModules = getBaseAcademyModules();
    const isBaseAcademy = baseModules[moduleNumber - 1] !== undefined;
    const canTakeTest = isBaseAcademy ? true : (lessonState.videoWatched && lessonState.materialsViewed.length >= materials.length);
    
    return `
        <div class="lk-test-section">
            <h3 class="lk-test-title">
                <i class="fa-solid fa-clipboard-question"></i>
                Тест по уроку
            </h3>
            <p class="lk-test-description">Пройдите тест, чтобы закрепить полученные знания. Для успешного прохождения необходимо ответить правильно на все вопросы.</p>
            ${!canTakeTest ? `
                <div class="lk-test-warning">
                    <i class="fa-solid fa-lock"></i>
                    <span>Для прохождения теста необходимо просмотреть видео полностью и все материалы</span>
                </div>
            ` : `
                <div class="lk-test-container" id="test-container-${moduleNumber}-${lessonIndex}">
                    ${renderTestQuestions(testQuestions, moduleNumber, lessonIndex)}
                    <button class="lk-test-submit-btn" 
                            data-module="${moduleNumber}"
                            data-lesson="${lessonIndex}">
                        <i class="fa-solid fa-paper-plane"></i>
                        Отправить ответы
                    </button>
                </div>
            `}
        </div>
    `;
}

// Получение вопросов теста (пока заглушка, позже будут реальные вопросы)
function getTestQuestions(moduleNumber, lessonIndex) {
    // Временные вопросы для демонстрации - позже будут заменены реальными вопросами
    return [
        {
            id: 1,
            question: 'Что такое блокчейн?',
            type: 'single',
            options: [
                { id: 'a', text: 'База данных, хранящаяся на одном сервере' },
                { id: 'b', text: 'Распределенная база данных, состоящая из блоков транзакций', correct: true },
                { id: 'c', text: 'Централизованная платежная система' }
            ]
        },
        {
            id: 2,
            question: 'Что такое криптовалюта?',
            type: 'single',
            options: [
                { id: 'a', text: 'Цифровая валюта, использующая криптографию для безопасности', correct: true },
                { id: 'b', text: 'Обычные деньги в цифровом виде' },
                { id: 'c', text: 'Виртуальная валюта в играх' }
            ]
        },
        {
            id: 3,
            question: 'Какие преимущества у криптовалют?',
            type: 'multiple',
            options: [
                { id: 'a', text: 'Децентрализация', correct: true },
                { id: 'b', text: 'Прозрачность транзакций', correct: true },
                { id: 'c', text: 'Высокая скорость обработки', correct: true },
                { id: 'd', text: 'Полная анонимность' }
            ]
        }
    ];
}

// Отображение вопросов теста
function renderTestQuestions(questions, moduleNumber, lessonIndex) {
    return questions.map((q, idx) => `
        <div class="lk-test-question" data-question-id="${q.id}">
            <div class="lk-test-question-header">
                <span class="lk-test-question-number">Вопрос ${idx + 1}</span>
                <span class="lk-test-question-type">${q.type === 'single' ? 'Один ответ' : 'Несколько ответов'}</span>
            </div>
            <p class="lk-test-question-text">${q.question}</p>
            <div class="lk-test-options">
                ${q.options.map(opt => `
                    <label class="lk-test-option">
                        <input type="${q.type === 'single' ? 'radio' : 'checkbox'}" 
                               name="question-${q.id}" 
                               value="${opt.id}"
                               data-correct="${opt.correct || false}">
                        <span class="lk-test-option-text">${opt.text}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Инициализация теста
function initTest(moduleNumber, lessonIndex) {
    const submitBtn = document.querySelector(`.lk-test-submit-btn[data-module="${moduleNumber}"][data-lesson="${lessonIndex}"]`);
    if (!submitBtn) return;
    
    submitBtn.addEventListener('click', function() {
        submitTest(moduleNumber, lessonIndex);
    });
}

// Отправка теста и проверка ответов
function submitTest(moduleNumber, lessonIndex) {
    const testContainer = document.getElementById(`test-container-${moduleNumber}-${lessonIndex}`);
    if (!testContainer) return;
    
    const questions = getTestQuestions(moduleNumber, lessonIndex);
    let correctAnswers = 0;
    let totalQuestions = questions.length;
    const userAnswers = {};
    
    questions.forEach(q => {
        const selected = testContainer.querySelectorAll(`input[name="question-${q.id}"]:checked`);
        const selectedValues = Array.from(selected).map(input => input.value);
        userAnswers[q.id] = selectedValues;
        
        // Проверяем правильность ответа
        const correctOptions = q.options.filter(opt => opt.correct).map(opt => opt.id);
        const isCorrect = selectedValues.length === correctOptions.length &&
                         selectedValues.every(val => correctOptions.includes(val)) &&
                         correctOptions.every(val => selectedValues.includes(val));
        
        if (isCorrect) {
            correctAnswers++;
        }
        
        // Подсвечиваем правильные и неправильные ответы
        selected.forEach(input => {
            const option = input.closest('.lk-test-option');
            if (input.getAttribute('data-correct') === 'true') {
                option.classList.add('correct');
            } else {
                option.classList.add('incorrect');
            }
        });
        
        // Показываем правильные ответы, если не были выбраны
        q.options.forEach(opt => {
            if (opt.correct && !selectedValues.includes(opt.id)) {
                const correctInput = testContainer.querySelector(`input[name="question-${q.id}"][value="${opt.id}"]`);
                if (correctInput) {
                    correctInput.closest('.lk-test-option').classList.add('correct-missing');
                }
            }
        });
    });
    
    // Сохраняем результаты
    const state = getLessonState(moduleNumber, lessonIndex);
    state.testCompleted = true;
    state.testScore = correctAnswers;
    saveLessonState(moduleNumber, lessonIndex, state);
    
    // Показываем результат
    showTestResult(moduleNumber, lessonIndex, correctAnswers, totalQuestions);
}

// Показ результата теста
function showTestResult(moduleNumber, lessonIndex, score, total) {
    const testSection = document.querySelector(`#test-container-${moduleNumber}-${lessonIndex}`).closest('.lk-test-section');
    const percent = Math.round((score / total) * 100);
    const passed = percent >= 80; // 80% для прохождения
    
    const resultHTML = `
        <div class="lk-test-result">
            <div class="lk-test-score ${passed ? 'passed' : 'failed'}">
                <div class="lk-test-score-value">${score}/${total}</div>
                <div class="lk-test-score-label">правильных ответов</div>
                <div class="lk-test-score-percent">${percent}%</div>
            </div>
            <p class="lk-test-result-text ${passed ? 'success' : 'error'}">
                ${passed 
                    ? 'Поздравляем! Тест успешно пройден. Вы можете перейти к следующему уроку.' 
                    : 'Тест не пройден. Необходимо набрать минимум 80% правильных ответов. Просмотрите материалы еще раз и попробуйте снова.'}
            </p>
            ${passed ? `
                <button class="lk-test-next-btn" onclick="location.reload()">
                    Обновить страницу
                </button>
            ` : `
                <button class="lk-test-retry-btn" onclick="location.reload()">
                    Попробовать снова
                </button>
            `}
        </div>
    `;
    
    testSection.querySelector('.lk-test-container').innerHTML = resultHTML;
    
    // Проверяем, можно ли завершить урок
    if (passed) {
        checkAndCompleteLesson(moduleNumber, lessonIndex);
    }
}

function reloadModules() {
    // Перезагружаем модули для обновления статусов
    const baseContainer = document.getElementById('base-academy-modules');
    const proContainer = document.getElementById('pro-academy-modules');
    
    if (baseContainer) {
        baseContainer.innerHTML = '';
        loadModules('base-academy-modules', 'Base', -1, -1, true);
    }
    
    if (proContainer) {
        proContainer.innerHTML = '';
        loadModules('pro-academy-modules', 'PRO', 0, 17);
    }
    
    // Обновляем прогресс в профиле
    updateBaseAcademyProgress();
}

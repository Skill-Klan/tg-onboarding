/**
 * FAQ Mini App для Telegram
 * Відповідно до ТЗ: простий Mini App-FAQ з пошуком та акордеонами
 */

class FAQMiniApp {
    constructor() {
        this.tg = null;
        this.faqData = null;
        this.currentTheme = 'light';
        this.searchIndex = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Ініціалізація додатку
     */
    async init() {
        try {
            // Перевіряємо чи доступний Telegram WebApp
            if (typeof window.Telegram === 'undefined' || !window.Telegram.WebApp) {
                throw new Error('Telegram WebApp не доступний');
            }

            this.tg = window.Telegram.WebApp;
            
            // Ініціалізація Telegram WebApp
            this.initTelegramWebApp();
            
            // Завантаження FAQ даних
            await this.loadFAQData();
            
            // Налаштування UI
            this.setupUI();
            
            // Налаштування пошуку
            this.setupSearch();
            
            // Налаштування обробників подій
            this.setupEventHandlers();
            
            // Відображення контенту
            this.renderFAQ();
            
            this.isInitialized = true;
            console.log('FAQ Mini App успішно ініціалізовано');
            
        } catch (error) {
            console.error('Помилка ініціалізації FAQ Mini App:', error);
            this.showError('Помилка завантаження додатку');
        }
    }

    /**
     * Ініціалізація Telegram WebApp
     */
    initTelegramWebApp() {
        // Готовність додатку
        this.tg.ready();
        
        // Налаштування кнопки "Назад"
        this.tg.BackButton.show();
        
        // Встановлення теми
        this.updateTheme();
        
        // Перевірка режиму запуску
        this.checkLaunchMode();
        
        // Налаштування обробників подій Telegram
        this.setupTelegramEventHandlers();
    }

    /**
     * Перевірка режиму запуску
     */
    checkLaunchMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        
        // За замовчуванням запускаємо в compact режимі
        if (mode !== 'fullscreen' && !this.tg.isExpanded) {
            // Розгортаємо додаток для кращого UX
            this.tg.expand();
        }
    }

    /**
     * Налаштування обробників подій Telegram
     */
    setupTelegramEventHandlers() {
        // Кнопка "Назад"
        this.tg.onEvent('backButtonClicked', () => {
            this.handleBackButton();
        });

        // Зміна теми
        this.tg.onEvent('themeChanged', () => {
            this.updateTheme();
        });

        // Зміна розміру вікна
        this.tg.onEvent('viewportChanged', () => {
            this.handleViewportChange();
        });

        // Активація/деактивація
        this.tg.onEvent('activated', () => {
            console.log('Mini App активовано');
        });

        this.tg.onEvent('deactivated', () => {
            console.log('Mini App деактивовано');
        });
    }

    /**
     * Обробка кнопки "Назад"
     */
    handleBackButton() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.tg.close();
        }
    }

    /**
     * Оновлення теми
     */
    updateTheme() {
        const colorScheme = this.tg.colorScheme;
        this.currentTheme = colorScheme;
        
        // Встановлення CSS змінних
        document.documentElement.style.setProperty('--tg-color-scheme', colorScheme);
        document.documentElement.setAttribute('data-theme', colorScheme);
        
        // Оновлення CSS змінних з Telegram
        const themeParams = this.tg.themeParams;
        if (themeParams) {
            Object.entries(themeParams).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--tg-${key}`, value);
            });
        }
    }

    /**
     * Обробка зміни розміру вікна
     */
    handleViewportChange() {
        // Використовуємо стабільну висоту для уникнення мерехтіння
        const viewportHeight = this.tg.viewportStableHeight || this.tg.viewportHeight;
        const safeArea = this.tg.safeAreaInset || this.tg.contentSafeAreaInset;
        
        if (viewportHeight) {
            document.documentElement.style.setProperty('--tg-viewport-height', `${viewportHeight}px`);
        }
        
        if (safeArea) {
            Object.entries(safeArea).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--safe-area-${key}`, `${value}px`);
            });
        }
    }

    /**
     * Завантаження FAQ даних
     */
    async loadFAQData() {
        try {
            // Завантажуємо дані з локального файлу
            const response = await fetch('./faq-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.faqData = await response.json();
            
            // Створюємо індекс для пошуку
            this.createSearchIndex();
            
        } catch (error) {
            console.error('Помилка завантаження FAQ даних:', error);
            // Використовуємо тестові дані як fallback
            this.faqData = this.getFallbackFAQData();
            this.createSearchIndex();
        }
    }

    /**
     * Створення пошукового індексу
     */
    createSearchIndex() {
        this.searchIndex.clear();
        
        if (!this.faqData || !this.faqData.sections) return;
        
        this.faqData.sections.forEach(section => {
            // Індексуємо заголовок секції
            this.addToSearchIndex(section.title, section.id, 'section');
            
            // Індексуємо питання та відповіді
            if (section.items) {
                section.items.forEach(item => {
                    this.addToSearchIndex(item.q, `${section.id}-${item.id || Math.random()}`, 'question');
                    this.addToSearchIndex(item.a, `${section.id}-${item.id || Math.random()}`, 'answer');
                });
            }
        });
    }

    /**
     * Додавання тексту до пошукового індексу
     */
    addToSearchIndex(text, id, type) {
        if (!text) return;
        
        const words = text.toLowerCase()
            .replace(/[^\w\sа-яёіїє]/gi, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        words.forEach(word => {
            if (!this.searchIndex.has(word)) {
                this.searchIndex.set(word, []);
            }
            this.searchIndex.get(word).push({ id, type });
        });
    }

    /**
     * Fallback дані для FAQ
     */
    getFallbackFAQData() {
        return {
            sections: [
                {
                    id: "start",
                    title: "Початок роботи",
                    items: [
                        {
                            id: "how-to-start",
                            q: "Як розпочати роботу з SkillKlan?",
                            a: "SkillKlan - це платформа для навчання та розвитку навичок. Для початку роботи вам потрібно зареєструватися та вибрати курс, який вас цікавить.",
                            links: ["t.me/skillklan_bot?start=start"]
                        },
                        {
                            id: "registration",
                            q: "Як зареєструватися?",
                            a: "Реєстрація проста: натисніть кнопку 'Написати в бот' та слідуйте інструкціям бота.",
                            links: ["t.me/skillklan_bot?start=register"]
                        }
                    ]
                },
                {
                    id: "courses",
                    title: "Курси та навчання",
                    items: [
                        {
                            id: "course-types",
                            q: "Які типи курсів доступні?",
                            a: "У нас є курси з програмування, дизайну, маркетингу та багато інших напрямків. Кожен курс адаптований під різні рівні підготовки.",
                            links: ["t.me/skillklan_bot?start=courses"]
                        }
                    ]
                },
                {
                    id: "support",
                    title: "Підтримка",
                    items: [
                        {
                            id: "contact-support",
                            q: "Як зв'язатися з підтримкою?",
                            a: "Для зв'язку з підтримкою натисніть кнопку 'Написати в бот' внизу сторінки. Наші менеджери відповідають протягом 24 годин.",
                            links: ["t.me/skillklan_bot?start=support"]
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Налаштування UI
     */
    setupUI() {
        // Налаштування кнопки "Назад"
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.handleBackButton();
            });
        }

        // Налаштування головної кнопки
        const mainButton = document.getElementById('mainButton');
        if (mainButton) {
            mainButton.addEventListener('click', () => {
                this.openBotChat();
            });
        }
    }

    /**
     * Налаштування пошуку
     */
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            // Очищення пошуку при фокусі
            searchInput.addEventListener('focus', () => {
                if (searchInput.value === '') {
                    this.clearSearch();
                }
            });
        }
    }

    /**
     * Обробка пошуку
     */
    handleSearch(query) {
        if (!query || query.trim().length < 2) {
            this.clearSearch();
            return;
        }

        const searchQuery = query.toLowerCase().trim();
        const results = this.searchFAQ(searchQuery);
        this.renderSearchResults(results, searchQuery);
    }

    /**
     * Пошук по FAQ
     */
    searchFAQ(query) {
        const results = new Map();
        
        // Знаходимо всі слова, що відповідають запиту
        for (const [word, items] of this.searchIndex) {
            if (word.includes(query) || query.includes(word)) {
                items.forEach(item => {
                    if (!results.has(item.id)) {
                        results.set(item.id, { ...item, score: 0 });
                    }
                    results.get(item.id).score += 1;
                });
            }
        }
        
        // Сортуємо за релевантністю
        return Array.from(results.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 20); // Обмежуємо результати
    }

    /**
     * Відображення результатів пошуку
     */
    renderSearchResults(results, query) {
        const faqContent = document.getElementById('faqContent');
        if (!faqContent) return;

        if (results.length === 0) {
            faqContent.innerHTML = `
                <div class="empty-state">
                    <p>За запитом "${query}" нічого не знайдено</p>
                    <p>Спробуйте інші ключові слова</p>
                </div>
            `;
            return;
        }

        // Групуємо результати по секціях
        const groupedResults = this.groupSearchResults(results);
        
        let html = `<h2>Результати пошуку: "${query}"</h2>`;
        
        groupedResults.forEach(section => {
            html += `
                <div class="faq-section">
                    <div class="section-header">
                        <span>${section.title}</span>
                        <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="section-content">
                        <div class="section-items">
                            ${section.items.map(item => `
                                <div class="faq-item">
                                    <div class="faq-question">
                                        <span>${item.q}</span>
                                        <svg class="expand-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="faq-answer">
                                        <p>${item.a}</p>
                                        ${this.renderLinks(item.links)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        faqContent.innerHTML = html;
        this.setupAccordionHandlers();
    }

    /**
     * Групування результатів пошуку по секціях
     */
    groupSearchResults(results) {
        const grouped = new Map();
        
        results.forEach(result => {
            const [sectionId] = result.id.split('-');
            const section = this.faqData.sections.find(s => s.id === sectionId);
            
            if (section) {
                if (!grouped.has(sectionId)) {
                    grouped.set(sectionId, {
                        id: sectionId,
                        title: section.title,
                        items: []
                    });
                }
                
                // Знаходимо оригінальний item
                const originalItem = section.items.find(item => 
                    result.id.includes(item.id) || result.id === `${sectionId}-${item.id}`
                );
                
                if (originalItem) {
                    grouped.get(sectionId).items.push(originalItem);
                }
            }
        });
        
        return Array.from(grouped.values());
    }

    /**
     * Очищення пошуку
     */
    clearSearch() {
        this.renderFAQ();
    }

    /**
     * Відображення FAQ
     */
    renderFAQ() {
        const faqContent = document.getElementById('faqContent');
        if (!faqContent || !this.faqData) return;

        if (!this.faqData.sections || this.faqData.sections.length === 0) {
            faqContent.innerHTML = `
                <div class="empty-state">
                    <p>FAQ дані недоступні</p>
                </div>
            `;
            return;
        }

        let html = '';
        
        this.faqData.sections.forEach(section => {
            html += `
                <div class="faq-section" id="section-${section.id}">
                    <div class="section-header">
                        <span>${section.title}</span>
                        <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="section-content">
                        <div class="section-items">
                            ${section.items.map(item => `
                                <div class="faq-item" id="item-${section.id}-${item.id || Math.random()}">
                                    <div class="faq-question">
                                        <span>${item.q}</span>
                                        <svg class="expand-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="faq-answer">
                                        <p>${item.a}</p>
                                        ${this.renderLinks(item.links)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        faqContent.innerHTML = html;
        this.setupAccordionHandlers();
    }

    /**
     * Відображення посилань
     */
    renderLinks(links) {
        if (!links || links.length === 0) return '';
        
        return `
            <div class="faq-links">
                ${links.map(link => {
                    if (link.startsWith('t.me/')) {
                        return `<a href="#" class="faq-link" data-link="${link}">Перейти до бота</a>`;
                    }
                    return `<a href="${link}" class="faq-link" target="_blank">Детальніше</a>`;
                }).join('')}
            </div>
        `;
    }

    /**
     * Налаштування обробників акордеону
     */
    setupAccordionHandlers() {
        // Обробники для секцій
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.faq-section');
                const content = section.querySelector('.section-content');
                
                if (content.classList.contains('expanded')) {
                    content.classList.remove('expanded');
                    header.classList.remove('expanded');
                } else {
                    content.classList.add('expanded');
                    header.classList.add('expanded');
                }
            });
        });

        // Обробники для питань
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.closest('.faq-item');
                const answer = item.querySelector('.faq-answer');
                
                if (answer.classList.contains('expanded')) {
                    answer.classList.remove('expanded');
                    question.classList.remove('expanded');
                } else {
                    answer.classList.add('expanded');
                    question.classList.add('expanded');
                }
            });
        });

        // Обробники для посилань
        document.querySelectorAll('.faq-link[data-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('data-link');
                this.openTelegramLink(url);
            });
        });
    }

    /**
     * Відкриття посилання в Telegram
     */
    openTelegramLink(url) {
        if (this.tg && this.tg.openTelegramLink) {
            this.tg.openTelegramLink(url);
        } else if (this.tg && this.tg.openLink) {
            this.tg.openLink(url);
        } else {
            // Fallback - відкриваємо в новому вікні
            window.open(url, '_blank');
        }
    }

    /**
     * Відкриття чату з ботом
     */
    openBotChat() {
        const botUrl = 'https://t.me/skillklan_bot?start=faq';
        this.openTelegramLink(botUrl);
    }

    /**
     * Налаштування обробників подій
     */
    setupEventHandlers() {
        // Обробка клавіш
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleBackButton();
            }
        });

        // Обробка зміни розміру вікна
        window.addEventListener('resize', () => {
            this.handleViewportChange();
        });

        // Обробка прокрутки для sticky header
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    /**
     * Обробка прокрутки
     */
    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    /**
     * Показ помилки
     */
    showError(message) {
        const faqContent = document.getElementById('faqContent');
        if (faqContent) {
            faqContent.innerHTML = `
                <div class="empty-state">
                    <p>❌ ${message}</p>
                    <button onclick="location.reload()" class="main-button">Спробувати знову</button>
                </div>
            `;
        }
    }

    /**
     * Аналітика (опціонально)
     */
    trackEvent(eventName, data = {}) {
        try {
            // Простий клієнтський трекінг
            console.log(`Analytics: ${eventName}`, data);
            
            // Тут можна додати Google Analytics або інші сервіси
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, data);
            }
        } catch (error) {
            console.warn('Помилка трекінгу:', error);
        }
    }
}

// Ініціалізація додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    window.faqApp = new FAQMiniApp();
});

// Експорт для тестування
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FAQMiniApp;
}

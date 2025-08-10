/**
 * FAQ Mini App для Telegram - Оновлено відповідно до нових інструкцій
 * Використовує telegram-utils.js та нативні методи Telegram
 */

class FAQMiniApp {
    constructor() {
        this.tg = null;
        this.telegramUtils = null;
        this.faqData = null;
        this.currentTheme = 'light';
        this.searchIndex = new Map();
        this.isInitialized = false;
        this.searchActive = false;
        
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
            
            // Ініціалізація Telegram WebApp через telegram-utils.js
            this.telegramUtils = new TelegramUtils();
            
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
     * Налаштування UI елементів
     */
    setupUI() {
        // Налаштування кнопок в header
        this.setupHeaderButtons();
        
        // Налаштування пошуку
        this.setupSearchUI();
        
        // Налаштування швидких дій
        this.setupQuickActions();
        
        // Застосовуємо поточну тему
        this.updateTheme();
    }

    /**
     * Налаштування кнопок в header
     */
    setupHeaderButtons() {
        const searchToggle = document.getElementById('searchToggle');
        const menuToggle = document.getElementById('menuToggle');

        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                this.toggleSearch();
            });
        }

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.showMenu();
            });
        }
    }

    /**
     * Налаштування пошуку
     */
    setupSearchUI() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.toggleSearch();
                }
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }

    /**
     * Налаштування швидких дій
     */
    setupQuickActions() {
        const contactSupport = document.getElementById('contactSupport');
        const aboutSchool = document.getElementById('aboutSchool');

        if (contactSupport) {
            contactSupport.addEventListener('click', () => {
                this.contactSupport();
            });
        }

        if (aboutSchool) {
            aboutSchool.addEventListener('click', () => {
                this.showAboutSchool();
            });
        }
    }

    /**
     * Перемикання пошуку
     */
    toggleSearch() {
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.getElementById('searchInput');
        
        if (this.searchActive) {
            searchContainer.style.display = 'none';
            this.searchActive = false;
            this.clearSearch();
        } else {
            searchContainer.style.display = 'block';
            this.searchActive = true;
            if (searchInput) {
                searchInput.focus();
            }
        }
    }

    /**
     * Показати меню
     */
    showMenu() {
        if (this.telegramUtils) {
            this.telegramUtils.showPopup({
                title: 'Меню',
                message: 'Оберіть опцію:',
                buttons: [
                    {
                        id: 'search',
                        type: 'default',
                        text: '🔍 Пошук'
                    },
                    {
                        id: 'support',
                        type: 'default',
                        text: '💬 Підтримка'
                    },
                    {
                        id: 'about',
                        type: 'default',
                        text: 'ℹ️ Про школу'
                    },
                    {
                        id: 'cancel',
                        type: 'cancel',
                        text: 'Скасувати'
                    }
                ]
            }, (buttonId) => {
                switch (buttonId) {
                    case 'search':
                        this.toggleSearch();
                        break;
                    case 'support':
                        this.contactSupport();
                        break;
                    case 'about':
                        this.showAboutSchool();
                        break;
                }
            });
        }
    }

    /**
     * Завантаження FAQ даних
     */
    async loadFAQData() {
        try {
            const response = await fetch('faq-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.faqData = await response.json();
            this.createSearchIndex();
        } catch (error) {
            console.error('Помилка завантаження FAQ даних:', error);
            this.faqData = this.getFallbackFAQData();
            this.createSearchIndex();
        }
    }

    /**
     * Створення індексу для пошуку
     */
    createSearchIndex() {
        this.searchIndex.clear();
        
        if (!this.faqData || !this.faqData.sections) return;
        
        this.faqData.sections.forEach(section => {
            // Додаємо заголовок секції
            this.addToSearchIndex(section.title, section.id, 'section');
            
            // Додаємо питання та відповіді
            if (section.items) {
                section.items.forEach(item => {
                    this.addToSearchIndex(item.q, item.id, 'question');
                    this.addToSearchIndex(item.a, item.id, 'answer');
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
            .replace(/[^\w\sа-яіїєґ]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        words.forEach(word => {
            if (!this.searchIndex.has(word)) {
                this.searchIndex.set(word, new Set());
            }
            this.searchIndex.get(word).add({ id, type });
        });
    }

    /**
     * Fallback FAQ дані
     */
    getFallbackFAQData() {
        return {
            sections: [
                {
                    id: "general",
                    title: "Загальні питання",
                    items: [
                        {
                            id: "what-is-skillklan",
                            q: "Що таке SkillKlan?",
                            a: "SkillKlan - це інноваційна платформа для навчання та розвитку навичок у сфері технологій.",
                            links: ["t.me/skillklan_bot?start=about"]
                        },
                        {
                            id: "how-to-start",
                            q: "Як розпочати навчання?",
                            a: "Для початку навчання зареєструйтеся через бота та пройдіть безкоштовну консультацію.",
                            links: ["t.me/skillklan_bot?start=consultation"]
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Обробка пошуку
     */
    handleSearch(query) {
        if (!query || query.trim().length === 0) {
            this.renderFAQ();
            return;
        }

        const results = this.searchFAQ(query.trim());
        this.renderSearchResults(results, query);
    }

    /**
     * Пошук по FAQ
     */
    searchFAQ(query) {
        const results = new Map();
        const words = query.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
            if (this.searchIndex.has(word)) {
                this.searchIndex.get(word).forEach(item => {
                    if (!results.has(item.id)) {
                        results.set(item.id, { ...item, score: 0 });
                    }
                    results.get(item.id).score++;
                });
            }
        });
        
        // Сортуємо за релевантністю
        return Array.from(results.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);
    }

    /**
     * Відображення результатів пошуку
     */
    renderSearchResults(results, query) {
        const faqContent = document.getElementById('faqContent');
        
        if (results.length === 0) {
            faqContent.innerHTML = `
                <div class="empty-state">
                    <h3>🔍 Нічого не знайдено</h3>
                    <p>За запитом "${query}" нічого не знайдено.</p>
                    <p>Спробуйте інші ключові слова або зверніться до підтримки.</p>
                </div>
            `;
            return;
        }

        const groupedResults = this.groupSearchResults(results);
        let html = `<div class="search-results">
            <h3>🔍 Результати пошуку: "${query}"</h3>
            <p>Знайдено ${results.length} результатів</p>
        </div>`;

        groupedResults.forEach((sectionResults, sectionId) => {
            const section = this.faqData.sections.find(s => s.id === sectionId);
            if (section) {
                html += this.renderSearchSection(section, sectionResults);
            }
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
            const sectionId = this.findSectionId(result.id);
            if (!grouped.has(sectionId)) {
                grouped.set(sectionId, []);
            }
            grouped.get(sectionId).push(result);
        });
        
        return grouped;
    }

    /**
     * Пошук ID секції для елемента
     */
    findSectionId(itemId) {
        for (const section of this.faqData.sections) {
            if (section.items && section.items.find(item => item.id === itemId)) {
                return section.id;
            }
        }
        return 'unknown';
    }

    /**
     * Відображення секції результатів пошуку
     */
    renderSearchSection(section, results) {
        let html = `
            <div class="faq-section">
                <div class="section-header">
                    <h3>${section.title}</h3>
                    <svg class="expand-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="section-content">
                    <div class="section-items">
        `;

        results.forEach(result => {
            const item = this.findFAQItem(result.id);
            if (item) {
                html += this.renderFAQItem(item, true);
            }
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Пошук FAQ елемента за ID
     */
    findFAQItem(itemId) {
        for (const section of this.faqData.sections) {
            if (section.items) {
                const item = section.items.find(item => item.id === itemId);
                if (item) return item;
            }
        }
        return null;
    }

    /**
     * Очищення пошуку
     */
    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.renderFAQ();
    }

    /**
     * Відображення FAQ
     */
    renderFAQ() {
        const faqContent = document.getElementById('faqContent');
        
        if (!this.faqData || !this.faqData.sections) {
            faqContent.innerHTML = `
                <div class="empty-state">
                    <h3>❌ Помилка завантаження</h3>
                    <p>Не вдалося завантажити FAQ дані.</p>
                </div>
            `;
            return;
        }

        let html = '';
        
        this.faqData.sections.forEach(section => {
            html += `
                <div class="faq-section" data-section-id="${section.id}">
                    <div class="section-header">
                        <h3>${section.title}</h3>
                        <svg class="expand-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="section-content">
                        <div class="section-items">
            `;

            if (section.items) {
                section.items.forEach(item => {
                    html += this.renderFAQItem(item);
                });
            }

            html += `
                        </div>
                    </div>
                </div>
            `;
        });

        faqContent.innerHTML = html;
        this.setupAccordionHandlers();
    }

    /**
     * Відображення FAQ елемента
     */
    renderFAQItem(item, isSearchResult = false) {
        let html = `
            <div class="faq-item" data-item-id="${item.id}">
                <div class="faq-question">
                    <span>${item.q}</span>
                    <svg class="expand-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>${item.a}</p>
        `;

        if (item.links && item.links.length > 0) {
            html += this.renderLinks(item.links);
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Відображення посилань
     */
    renderLinks(links) {
        if (!links || links.length === 0) return '';
        
        let html = '<div class="faq-links">';
        
        links.forEach(link => {
            if (link.includes('t.me/')) {
                html += `
                    <a href="${link}" class="faq-link" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 13V19A2 2 0 0 1 16 21H8A2 2 0 0 1 6 19V13M18 13L13 8M18 13L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Відкрити
                    </a>
                `;
            } else {
                html += `
                    <a href="${link}" class="faq-link" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 13V19A2 2 0 0 1 16 21H8A2 2 0 0 1 6 19V13M18 13L13 8M18 13L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Детальніше
                    </a>
                `;
            }
        });
        
        html += '</div>';
        return html;
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
                const icon = header.querySelector('.expand-icon');
                
                if (content.classList.contains('expanded')) {
                    content.classList.remove('expanded');
                    header.classList.remove('expanded');
                } else {
                    content.classList.add('expanded');
                    header.classList.add('expanded');
                }
            });
        });

        // Обробники для питаннь
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.closest('.faq-item');
                const answer = item.querySelector('.faq-answer');
                const icon = question.querySelector('.expand-icon');
                
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
        document.querySelectorAll('.faq-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('href');
                this.openTelegramLink(url);
            });
        });
    }

    /**
     * Відкриття Telegram посилання
     */
    openTelegramLink(url) {
        if (this.telegramUtils) {
            this.telegramUtils.openTelegramLink(url);
        } else {
            window.open(url, '_blank');
        }
    }

    /**
     * Зв'язок з підтримкою
     */
    contactSupport() {
        if (this.telegramUtils) {
            this.telegramUtils.showConfirm(
                'Зв\'язатися з підтримкою?',
                'Натисніть "Так" щоб перейти до чату з підтримкою.',
                (confirmed) => {
                    if (confirmed) {
                        this.telegramUtils.contactSupport();
                    }
                }
            );
        }
    }

    /**
     * Показати інформацію про школу
     */
    showAboutSchool() {
        if (this.telegramUtils) {
            this.telegramUtils.showInfo(
                'Про школу SkillKlan',
                'SkillKlan - це інноваційна платформа для навчання та розвитку навичок у сфері технологій. Ми пропонуємо практичні курси, які допомагають студентам освоїти сучасні технології та знайти роботу в IT.'
            );
        }
    }

    /**
     * Налаштування обробників подій
     */
    setupEventHandlers() {
        // Обробка прокрутки для header
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Обробка зміни розміру вікна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Обробка прокрутки
     */
    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 10) {
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.boxShadow = 'none';
            }
        }
    }

    /**
     * Обробка зміни розміру вікна
     */
    handleResize() {
        // Адаптація при зміні розміру
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    /**
     * Показати помилку
     */
    showError(message) {
        if (this.telegramUtils) {
            this.telegramUtils.showAlert(message);
        } else {
            console.error(message);
        }
    }

    /**
     * Оновлення теми
     */
    updateTheme() {
        if (this.tg) {
            const themeParams = this.tg.themeParams;
            if (themeParams) {
                document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
                document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
                document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
                document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
                document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
                document.documentElement.style.setProperty('--tg-theme-link-color', themeParams.link_color);
                document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
            }
        }
    }

    /**
     * Відстеження подій
     */
    trackEvent(eventName, data = {}) {
        if (this.tg) {
            this.tg.sendData(JSON.stringify({
                event: eventName,
                data: data,
                timestamp: Date.now()
            }));
        }
    }
}

// Ініціалізація додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    new FAQMiniApp();
});


/**
 * Контролер пошуку для FAQ
 * Керує пошуком, debounce та відновленням стану
 */
class SearchController {
    constructor(searchEngine, appInstance) {
        this.searchEngine = searchEngine;
        this.appInstance = appInstance;
        this.searchInput = null;
        this.searchTimeout = null;
        this.debounceDelay = 200; // Debounce 200мс
        this.isSearchActive = false;
        this.expandedState = null; // Збережений стан розкриття
        this.originalData = null;
        this.isInitialized = false;
    }

    /**
     * Ініціалізація контролера
     * @param {Object} faqData - Дані FAQ
     */
    init(faqData) {
        try {
            this.originalData = faqData;
            this.searchEngine.buildIndex(faqData);
            this.findElements();
            this.addEventListeners();
            this.isInitialized = true;
            console.log('Контролер пошуку успішно ініціалізовано');
        } catch (error) {
            console.error('Помилка ініціалізації контролера пошуку:', error);
        }
    }

    /**
     * Знаходження необхідних DOM елементів
     */
    findElements() {
        this.searchInput = document.getElementById('search-input');
        if (!this.searchInput) {
            throw new Error('Поле пошуку не знайдено');
        }
    }

    /**
     * Додавання обробників подій
     */
    addEventListeners() {
        // Обробник введення тексту з debounce
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        // Обробник очищення поля
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        // Обробник фокусу для очищення при порожньому полі
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim() === '') {
                this.clearSearch();
            }
        });

        // Додаємо обробник для кнопки очищення
        const clearSearchButton = document.getElementById('clear-search-button');
        if (clearSearchButton) {
            clearSearchButton.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }

    /**
     * Обробка введення тексту в поле пошуку
     * @param {string} query - Пошуковий запит
     */
    handleSearchInput(query) {
        // Очищаємо попередній таймер
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Встановлюємо новий таймер для пошуку
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, this.debounceDelay);
    }

    /**
     * Виконання пошуку
     * @param {string} query - Пошуковий запит
     */
    performSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery === '') {
            this.clearSearch();
            return;
        }

        // Зберігаємо стан розкриття перед першим пошуком
        if (!this.isSearchActive) {
            this.saveExpandedState();
            this.isSearchActive = true;
        }

        // Виконуємо пошук
        const filteredData = this.searchEngine.getFilteredData(trimmedQuery);
        
        if (filteredData) {
            // Показуємо результати пошуку
            this.renderSearchResults(filteredData);
            
            // Показуємо статистику пошуку
            const stats = this.searchEngine.getSearchStats(trimmedQuery);
            console.log('Результати пошуку:', {
                query: trimmedQuery,
                matchedQuestions: stats.matchedQuestions,
                matchedCategories: stats.matchedCategories,
                totalQuestions: stats.totalQuestions
            });
        } else {
            // Показуємо повідомлення "Нічого не знайдено"
            this.showNoResultsMessage(trimmedQuery);
            console.log('Пошук не дав результатів:', trimmedQuery);
        }
    }

    /**
     * Рендеринг результатів пошуку
     * @param {Object} filteredData - Фільтровані дані
     */
    renderSearchResults(filteredData) {
        // Очищаємо контейнер FAQ
        const faqContainer = document.getElementById('faq-container');
        if (!faqContainer) return;

        faqContainer.innerHTML = '';

        // Рендеримо фільтровані категорії
        filteredData.categories.forEach(categoryData => {
            const categoryComponent = new CategoryComponent(categoryData, this.appInstance.questionComponent);
            const categoryElement = categoryComponent.createElement();
            
            // Автоматично відкриваємо категорію під час пошуку
            categoryComponent.openCategory();
            
            faqContainer.appendChild(categoryElement);
        });

        // Додаємо статистику пошуку
        this.addSearchStatistics(filteredData);

        // Очищаємо результати пошуку в SearchComponent
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }

    /**
     * Показ повідомлення "Нічого не знайдено"
     * @param {string} query - Пошуковий запит
     */
    showNoResultsMessage(query) {
        const faqContainer = document.getElementById('faq-container');
        if (!faqContainer) return;

        faqContainer.innerHTML = `
            <div class="no-results-message" style="
                text-align: center;
                padding: 60px 20px;
                color: #6c757d;
                font-size: 1.1rem;
            ">
                <div style="font-size: 3rem; margin-bottom: 20px;">🔍</div>
                <h3 style="color: #495057; margin-bottom: 15px;">Нічого не знайдено</h3>
                <p>За запитом "<strong>${this.escapeHtml(query)}</strong>" не знайдено жодного питання.</p>
                <p style="margin-top: 10px; font-size: 0.9rem;">
                    Спробуйте змінити пошуковий запит або перегляньте всі категорії.
                </p>
            </div>
        `;
    }

    /**
     * Додавання статистики пошуку
     * @param {Object} filteredData - Фільтровані дані
     */
    addSearchStatistics(filteredData) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'search-stats';
        statsContainer.style.cssText = `
            padding: 20px 30px;
            background: #e3f2fd;
            border-top: 1px solid #bbdefb;
            text-align: center;
            color: #1976d2;
            font-size: 0.9rem;
        `;

        const categoriesCount = filteredData.categories.length;
        const totalQuestions = filteredData.categories.reduce((total, cat) => total + cat.questions.length, 0);

        statsContainer.innerHTML = `
            <span>🔍 Результати пошуку:</span>
            <span style="margin: 0 15px;">|</span>
            <span>📚 ${categoriesCount} категорій</span>
            <span style="margin: 0 15px;">|</span>
            <span>❓ ${totalQuestions} питань</span>
        `;

        const faqContainer = document.getElementById('faq-container');
        if (faqContainer) {
            faqContainer.appendChild(statsContainer);
        }
    }

    /**
     * Збереження стану розкриття категорій та питань
     */
    saveExpandedState() {
        if (this.expandedState) return; // Вже збережено

        try {
            this.expandedState = {
                openCategories: new Set(this.appInstance.currentState.openCategories),
                openQuestions: new Set(this.appInstance.currentState.openQuestions),
                timestamp: Date.now()
            };
            console.log('Стан розкриття збережено:', {
                categories: this.expandedState.openCategories.size,
                questions: this.expandedState.openQuestions.size
            });
        } catch (error) {
            console.warn('Помилка збереження стану розкриття:', error);
            this.expandedState = null;
        }
    }

    /**
     * Відновлення збереженого стану розкриття
     */
    restoreExpandedState() {
        if (!this.expandedState) return;

        try {
            // Відновлюємо стан категорій
            this.expandedState.openCategories.forEach(categoryId => {
                const categoryComponent = this.appInstance.categoryComponents.find(comp => 
                    comp.getCategoryData().id === categoryId
                );
                if (categoryComponent && !categoryComponent.isCategoryOpen()) {
                    categoryComponent.toggleCategory();
                }
            });

            // Відновлюємо стан питань
            this.expandedState.openQuestions.forEach(questionId => {
                this.appInstance.questionComponent.openQuestionById(questionId);
            });

            console.log('Стан розкриття відновлено:', {
                categories: this.expandedState.openCategories.size,
                questions: this.expandedState.openQuestions.size
            });
        } catch (error) {
            console.warn('Помилка відновлення стану розкриття:', error);
        }
    }

    /**
     * Очищення пошуку та відновлення оригінального стану
     */
    clearSearch() {
        // Очищаємо поле пошуку
        if (this.searchInput) {
            this.searchInput.value = '';
        }

        // Відновлюємо оригінальні дані
        if (this.originalData) {
            this.renderOriginalFAQ();
        }

        // Відновлюємо збережений стан розкриття
        if (this.expandedState) {
            this.restoreExpandedState();
            this.expandedState = null;
        }

        // Очищаємо результати пошуку в SearchComponent
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '';
        }

        // Ховаємо кнопку очищення
        const clearSearchButton = document.getElementById('clear-search-button');
        if (clearSearchButton) {
            clearSearchButton.style.display = 'none';
        }

        this.isSearchActive = false;
        console.log('Пошук очищено, оригінальний стан відновлено');
    }

    /**
     * Рендеринг оригінального FAQ
     */
    renderOriginalFAQ() {
        if (!this.appInstance || !this.originalData) return;

        // Викликаємо оригінальний метод рендерингу
        this.appInstance.renderFAQ();

        // Відновлюємо збережений стан розкриття
        if (this.expandedState) {
            this.restoreExpandedState();
        }
    }

    /**
     * Екранування HTML для безпечного відображення
     * @param {string} text - Текст для екранування
     * @returns {string} Екранований текст
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Оновлення даних FAQ
     * @param {Object} newData - Нові дані
     */
    updateFAQData(newData) {
        this.originalData = newData;
        this.searchEngine.buildIndex(newData);
    }

    /**
     * Отримання статистики пошуку
     * @returns {Object} Статистика
     */
    getSearchStats() {
        return {
            isSearchActive: this.isSearchActive,
            isInitialized: this.isInitialized,
            debounceDelay: this.debounceDelay,
            hasExpandedState: !!this.expandedState
        };
    }

    /**
     * Знищення контролера
     */
    destroy() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchInput = null;
        this.searchTimeout = null;
        this.expandedState = null;
        this.originalData = null;
        this.isSearchActive = false;
        this.isInitialized = false;
    }
}

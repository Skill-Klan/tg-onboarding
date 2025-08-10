/**
 * Компонент пошуку для FAQ додатку
 * Забезпечує пошук по питаннях та відповідях
 */
class SearchComponent {
    constructor() {
        this.searchInput = null;
        this.searchButton = null;
        this.clearSearchButton = null;
        this.searchResults = null;
        this.faqData = null;
        this.searchTimeout = null;
        this.isInitialized = false;
    }

    /**
     * Ініціалізує компонент пошуку
     */
    init(faqData) {
        try {
            this.faqData = faqData;
            this.findElements();
            this.addEventListeners();
            this.isInitialized = true;
            console.log('Компонент пошуку успішно ініціалізовано');
        } catch (error) {
            console.error('Помилка ініціалізації компонента пошуку:', error);
        }
    }

    /**
     * Знаходить необхідні DOM елементи
     */
    findElements() {
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.clearSearchButton = document.getElementById('clear-search-button');
        this.searchResults = document.getElementById('search-results');

        if (!this.searchInput || !this.searchButton || !this.clearSearchButton || !this.searchResults) {
            throw new Error('Не знайдено необхідні елементи пошуку');
        }
    }

    /**
     * Додає обробники подій
     */
    addEventListeners() {
        // Пошук при введенні тексту
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        // Пошук при натисканні кнопки
        this.searchButton.addEventListener('click', () => {
            this.performSearch(this.searchInput.value);
        });

        // Пошук при натисканні Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(this.searchInput.value);
            }
        });

        // Очищення пошуку при фокусі
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim() === '') {
                this.clearSearch();
            }
        });

        // Кнопка очищення
        this.clearSearchButton.addEventListener('click', () => {
            this.clearSearch();
        });
    }

    /**
     * Обробляє введення тексту в поле пошуку
     * Тепер використовує нову систему пошуку через SearchController
     */
    handleSearchInput(query) {
        // Показуємо/ховаємо кнопку очищення
        if (query.trim() !== '') {
            this.clearSearchButton.style.display = 'flex';
        } else {
            this.clearSearchButton.style.display = 'none';
            this.clearSearch();
            return;
        }

        // Делегуємо пошук до SearchController
        if (window.faqApp && window.faqApp.searchController) {
            window.faqApp.searchController.handleSearchInput(query);
        } else {
            // Fallback до старої логіки, якщо SearchController недоступний
            this.performSearch(query);
        }
    }

    /**
     * Виконує пошук
     */
    performSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery === '') {
            this.clearSearch();
            return;
        }

        const results = this.searchInFAQ(trimmedQuery);
        this.displaySearchResults(results, trimmedQuery);
    }

    /**
     * Шукає в FAQ даних
     */
    searchInFAQ(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        if (!this.faqData || !this.faqData.categories) {
            return results;
        }

        this.faqData.categories.forEach(category => {
            if (category.questions) {
                category.questions.forEach(question => {
                    const questionText = question.question.toLowerCase();
                    const answerText = question.answer.toLowerCase();
                    const categoryName = category.name.toLowerCase();

                    // Перевіряємо, чи містить питання, відповідь або категорію пошуковий запит
                    if (questionText.includes(lowerQuery) || 
                        answerText.includes(lowerQuery) || 
                        categoryName.includes(lowerQuery)) {
                        
                        results.push({
                            question: question.question,
                            answer: question.answer,
                            category: category.name,
                            categoryId: category.id,
                            questionId: question.id
                        });
                    }
                });
            }
        });

        return results;
    }

    /**
     * Відображає результати пошуку
     */
    displaySearchResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>За запитом "${query}" нічого не знайдено.</p>
                    <p>Спробуйте змінити пошуковий запит або перегляньте всі категорії.</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result-item" data-category="${result.categoryId}" data-question="${result.questionId}">
                <div class="search-result-header">
                    <div class="search-result-question">${this.highlightText(result.question, query)}</div>
                    <div class="search-result-category">${result.category}</div>
                </div>
                <div class="search-result-answer">
                    ${this.highlightText(this.truncateText(result.answer, 150), query)}
                </div>
            </div>
        `).join('');

        this.searchResults.innerHTML = resultsHTML;

        // Додаємо обробники кліків для результатів пошуку
        this.addSearchResultEventListeners();
        this.addSearchAnimation(); // Додаємо анімацію
    }

    /**
     * Підсвічує знайдений текст
     */
    highlightText(text, query) {
        if (!query || query.trim() === '') {
            return text;
        }

        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    /**
     * Обрізає текст до вказаної довжини
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Екранує спеціальні символи для регулярних виразів
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Додає обробники подій для результатів пошуку
     */
    addSearchResultEventListeners() {
        const resultItems = this.searchResults.querySelectorAll('.search-result-item');
        
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const categoryId = item.dataset.category;
                const questionId = item.dataset.question;
                this.navigateToQuestion(categoryId, questionId);
            });
        });
    }

    /**
     * Переходить до питання в основному FAQ
     */
    navigateToQuestion(categoryId, questionId) {
        // Знаходимо категорію та питання
        const categoryElement = document.querySelector(`[data-category-id="${categoryId}"]`);
        const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);

        if (categoryElement && questionElement) {
            // Відкриваємо категорію
            const categoryHeader = categoryElement.querySelector('.category-header');
            if (categoryHeader && !categoryElement.classList.contains('active')) {
                categoryHeader.click();
            }

            // Прокручуємо до питання
            setTimeout(() => {
                questionElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });

                // Підсвічуємо питання
                questionElement.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    questionElement.style.backgroundColor = '';
                }, 2000);
            }, 300);

            // Очищаємо пошук
            this.clearSearch();
        } else {
            console.warn('Не знайдено елементи для навігації:', { categoryId, questionId });
        }
    }

    /**
     * Очищає результати пошуку
     */
    clearSearch() {
        this.searchResults.innerHTML = '';
        this.searchInput.value = '';
        this.clearSearchButton.style.display = 'none';
        
        // Делегуємо очищення до SearchController
        if (window.faqApp && window.faqApp.searchController) {
            window.faqApp.searchController.clearSearch();
        }
        
        this.searchInput.focus();
    }

    /**
     * Додає анімацію для результатів пошуку
     */
    addSearchAnimation() {
        const resultItems = this.searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Оновлює дані FAQ
     */
    updateFAQData(newData) {
        this.faqData = newData;
    }

    /**
     * Отримує статистику пошуку
     */
    getSearchStats() {
        return {
            totalSearches: this.totalSearches || 0,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Знищує компонент
     */
    destroy() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchInput = null;
        this.searchButton = null;
        this.clearSearchButton = null;
        this.searchResults = null;
        this.faqData = null;
        this.isInitialized = false;
    }
}

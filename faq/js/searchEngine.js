/**
 * Пошуковий двигун для FAQ
 * Забезпечує побудову індексу, нормалізацію та пошук
 */
class SearchEngine {
    constructor() {
        this.index = null;
        this.originalData = null;
        this.config = {
            SEARCH_IN_ANSWERS: false // Технічний перемикач для пошуку в відповідях
        };
    }

    /**
     * Побудова індексу для швидкого пошуку
     * @param {Object} data - Дані FAQ
     * @returns {Array} Плоский список з нормалізованими полями
     */
    buildIndex(data) {
        this.originalData = data;
        this.index = [];

        if (!data || !data.categories) {
            console.warn('Немає даних для побудови індексу');
            return this.index;
        }

        let totalQuestions = 0;
        data.categories.forEach(category => {
            if (category.questions) {
                category.questions.forEach(question => {
                    const indexItem = {
                        categoryId: category.id,
                        categoryTitle: category.title,
                        questionId: question.id,
                        questionText: question.question,
                        answerText: question.answer,
                        // Нормалізовані поля для пошуку
                        normalizedQuestion: this.normalize(question.question),
                        normalizedAnswer: this.normalize(question.answer),
                        normalizedCategory: this.normalize(category.title)
                    };
                    this.index.push(indexItem);
                    totalQuestions++;
                });
            }
        });

        console.log(`Індекс побудовано: ${this.index.length} питань в ${data.categories.length} категоріях`);
        return this.index;
    }

    /**
     * Нормалізація рядка для пошуку
     * @param {string} str - Рядок для нормалізації
     * @returns {string} Нормалізований рядок
     */
    normalize(str) {
        if (typeof str !== 'string') {
            return '';
        }

        try {
            return str
                .toLowerCase()
                .normalize('NFD') // Розкладає діакритики
                .replace(/[\u0300-\u036f]/g, '') // Видаляє діакритики
                .trim()
                .replace(/\s+/g, ' '); // Колапс множинних пробілів
        } catch (error) {
            console.warn('Помилка нормалізації рядка:', error, 'Рядок:', str);
            // Fallback до простої нормалізації
            return str.toLowerCase().trim().replace(/\s+/g, ' ');
        }
    }

    /**
     * Пошук по індексу
     * @param {string} query - Пошуковий запит
     * @returns {Set} Множина questionId, що відповідають запиту
     */
    match(query) {
        if (!this.index) {
            return new Set();
        }

        const normalizedQuery = this.normalize(query);
        
        // Порожній запит або тільки пробіли - повертаємо всі питання
        if (!normalizedQuery || normalizedQuery.trim() === '') {
            return new Set(this.index.map(item => item.questionId));
        }

        const matchedQuestionIds = new Set();

        this.index.forEach(item => {
            let isMatch = false;

            // Пошук в питанні (завжди включений)
            if (item.normalizedQuestion.includes(normalizedQuery)) {
                isMatch = true;
            }

            // Пошук в відповіді (тільки якщо увімкнено)
            if (this.config.SEARCH_IN_ANSWERS && item.normalizedAnswer.includes(normalizedQuery)) {
                isMatch = true;
            }

            // Пошук в назві категорії
            if (item.normalizedCategory.includes(normalizedQuery)) {
                isMatch = true;
            }

            if (isMatch) {
                matchedQuestionIds.add(item.questionId);
            }
        });

        // Логуємо результати пошуку для відладки
        if (normalizedQuery.length > 0) {
            console.log(`Пошук "${query}" (нормалізовано: "${normalizedQuery}"): знайдено ${matchedQuestionIds.size} питань`);
        }

        return matchedQuestionIds;
    }

    /**
     * Отримання фільтрованих даних для рендерингу
     * @param {string} query - Пошуковий запит
     * @returns {Object|null} Фільтровані дані або null якщо нічого не знайдено
     */
    getFilteredData(query) {
        if (!this.originalData || !this.index) {
            console.warn('Немає даних або індексу для фільтрації');
            return null;
        }

        const matchedQuestionIds = this.match(query);
        
        if (matchedQuestionIds.size === 0) {
            return null;
        }

        try {
            // Створюємо копію оригінальних даних
            const filteredData = JSON.parse(JSON.stringify(this.originalData));
            
            // Фільтруємо категорії та питання
            filteredData.categories = filteredData.categories.filter(category => {
                // Фільтруємо питання в категорії
                const filteredQuestions = category.questions.filter(question => 
                    matchedQuestionIds.has(question.id)
                );
                
                // Якщо в категорії немає відповідних питань, не показуємо її
                if (filteredQuestions.length === 0) {
                    return false;
                }
                
                // Замінюємо питання на фільтровані
                category.questions = filteredQuestions;
                return true;
            });

            console.log(`Фільтрація завершена: ${filteredData.categories.length} категорій з ${matchedQuestionIds.size} питаннями`);
            return filteredData;
        } catch (error) {
            console.error('Помилка фільтрації даних:', error);
            return null;
        }
    }

    /**
     * Отримання статистики пошуку
     * @param {string} query - Пошуковий запит
     * @returns {Object} Статистика пошуку
     */
    getSearchStats(query) {
        if (!this.index) {
            return { totalQuestions: 0, matchedQuestions: 0, matchedCategories: 0 };
        }

        try {
            const matchedQuestionIds = this.match(query);
            const matchedCategories = new Set();
            
            this.index.forEach(item => {
                if (matchedQuestionIds.has(item.questionId)) {
                    matchedCategories.add(item.categoryId);
                }
            });

            const stats = {
                totalQuestions: this.index.length,
                matchedQuestions: matchedQuestionIds.size,
                matchedCategories: matchedCategories.size
            };

            // Логуємо статистику для відладки
            if (query && query.trim() !== '') {
                console.log(`Статистика пошуку "${query}":`, stats);
            }

            return stats;
        } catch (error) {
            console.error('Помилка отримання статистики пошуку:', error);
            return { totalQuestions: 0, matchedQuestions: 0, matchedCategories: 0 };
        }
    }

    /**
     * Оновлення конфігурації
     * @param {Object} newConfig - Нова конфігурація
     */
    updateConfig(newConfig) {
        try {
            this.config = { ...this.config, ...newConfig };
            console.log('Конфігурація SearchEngine оновлена:', this.config);
        } catch (error) {
            console.error('Помилка оновлення конфігурації:', error);
        }
    }

    /**
     * Отримання поточної конфігурації
     * @returns {Object} Поточна конфігурація
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Очищення індексу
     */
    clearIndex() {
        try {
            this.index = null;
            this.originalData = null;
            console.log('Індекс SearchEngine очищено');
        } catch (error) {
            console.error('Помилка очищення індексу:', error);
        }
    }
}

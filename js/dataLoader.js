/**
 * Модуль для завантаження та парсингу JSON даних
 */
class DataLoader {
    constructor() {
        this.data = null;
        this.error = null;
    }

    /**
     * Завантажує дані з JSON файлу
     * @param {string} url - URL до JSON файлу
     * @returns {Promise<Object>} Promise з даними або помилкою
     */
    async loadData(url = 'data.json') {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP помилка! статус: ${response.status}`);
            }
            
            this.data = await response.json();
            this.error = null;
            
            // Валідація структури даних
            this.validateData(this.data);
            
            return this.data;
        } catch (error) {
            this.error = error;
            console.error('Помилка завантаження даних:', error);
            throw error;
        }
    }

    /**
     * Валідує структуру завантажених даних
     * @param {Object} data - Дані для валідації
     * @throws {Error} Якщо структура даних некоректна
     */
    validateData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Дані мають бути об\'єктом');
        }

        if (!Array.isArray(data.categories)) {
            throw new Error('Поле "categories" має бути масивом');
        }

        data.categories.forEach((category, index) => {
            if (!category.id || !category.title || !Array.isArray(category.questions)) {
                throw new Error(`Некоректна структура категорії з індексом ${index}`);
            }

            category.questions.forEach((question, qIndex) => {
                if (!question.id || !question.question || !question.answer) {
                    throw new Error(`Некоректна структура питання з індексом ${qIndex} в категорії ${index}`);
                }
            });
        });
    }

    /**
     * Отримує всі категорії
     * @returns {Array} Масив категорій
     */
    getCategories() {
        if (!this.data) {
            throw new Error('Дані не завантажені. Спочатку викличте loadData()');
        }
        return this.data.categories;
    }

    /**
     * Отримує всі дані FAQ
     * @returns {Object} Об'єкт з усіма даними
     */
    getData() {
        if (!this.data) {
            throw new Error('Дані не завантажені. Спочатку викличте loadData()');
        }
        return this.data;
    }

    /**
     * Отримує категорію за ID
     * @param {string} categoryId - ID категорії
     * @returns {Object|null} Категорія або null
     */
    getCategoryById(categoryId) {
        if (!this.data) {
            throw new Error('Дані не завантажені. Спочатку викличте loadData()');
        }
        return this.data.categories.find(category => category.id === categoryId) || null;
    }

    /**
     * Отримує питання за ID
     * @param {string} questionId - ID питання
     * @returns {Object|null} Питання або null
     */
    getQuestionById(questionId) {
        if (!this.data) {
            throw new Error('Дані не завантажені. Спочатку викличте loadData()');
        }

        for (const category of this.data.categories) {
            const question = category.questions.find(q => q.id === questionId);
            if (question) {
                return question;
            }
        }
        return null;
    }

    /**
     * Перевіряє, чи є помилка
     * @returns {boolean} true якщо є помилка
     */
    hasError() {
        return this.error !== null;
    }

    /**
     * Отримує поточну помилку
     * @returns {Error|null} Поточна помилка або null
     */
    getError() {
        return this.error;
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}

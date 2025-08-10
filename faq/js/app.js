/**
 * Основний файл додатку FAQ
 * Ініціалізує всі компоненти та керує загальною логікою
 */
class FAQApp {
    constructor() {
        this.dataLoader = null;
        this.questionComponent = null;
        this.searchComponent = null;
        this.searchEngine = null;
        this.searchController = null;
        this.categoryComponents = [];
        this.container = null;
        this.isInitialized = false;
        this.currentState = {
            openCategories: new Set(),
            openQuestions: new Set()
        };
    }

    /**
     * Ініціалізує додаток
     */
    async init() {
        try {
            // Перевіряємо, чи DOM готовий
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initApp());
            } else {
                this.initApp();
            }
        } catch (error) {
            console.error('Помилка ініціалізації додатку:', error);
            this.showError('Помилка ініціалізації додатку');
        }
    }

    /**
     * Основна логіка ініціалізації
     */
    async initApp() {
        try {
            // Ініціалізуємо компоненти
            this.initializeComponents();
            
            // Знаходимо контейнер
            this.container = document.getElementById('faq-container');
            if (!this.container) {
                throw new Error('Контейнер FAQ не знайдено');
            }

            // Показуємо завантаження
            this.showLoading();

            // Завантажуємо дані
            await this.loadData();

            // Рендеримо FAQ
            this.renderFAQ();

            // Відновлюємо стан (якщо є)
            this.restoreState();

            // Додаємо глобальні обробники подій
            this.addGlobalEventListeners();

            this.isInitialized = true;
            console.log('FAQ додаток успішно ініціалізовано');

        } catch (error) {
            console.error('Помилка ініціалізації:', error);
            this.showError('Помилка завантаження FAQ');
        }
    }

    /**
     * Ініціалізує компоненти
     */
    initializeComponents() {
        this.dataLoader = new DataLoader();
        this.questionComponent = new QuestionComponent();
        this.searchComponent = new SearchComponent();
        this.searchEngine = new SearchEngine();
        this.searchController = new SearchController(this.searchEngine, this);
    }

    /**
     * Завантажує дані FAQ
     */
    async loadData() {
        try {
            await this.dataLoader.loadData();
        } catch (error) {
            throw new Error(`Помилка завантаження даних: ${error.message}`);
        }
    }

    /**
     * Рендерить FAQ на сторінці
     */
    renderFAQ() {
        try {
            // Очищаємо контейнер
            this.container.innerHTML = '';

            // Отримуємо категорії
            const categories = this.dataLoader.getCategories();

            // Створюємо компоненти категорій
            this.categoryComponents = categories.map(categoryData => {
                const categoryComponent = new CategoryComponent(categoryData, this.questionComponent);
                const categoryElement = categoryComponent.createElement();
                this.container.appendChild(categoryElement);
                return categoryComponent;
            });

            // Ініціалізуємо компоненти пошуку
            this.searchComponent.init(this.dataLoader.getData());
            this.searchController.init(this.dataLoader.getData());

            // Додаємо статистику
            this.addStatistics();

        } catch (error) {
            console.error('Помилка рендерингу FAQ:', error);
            this.showError('Помилка відображення FAQ');
        }
    }

    /**
     * Додає статистику FAQ
     */
    addStatistics() {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'faq-stats';
        statsContainer.style.cssText = `
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 0.9rem;
        `;

        const categoriesCount = this.dataLoader.getCategories().length;
        const totalQuestions = this.dataLoader.getCategories().reduce((total, cat) => total + cat.questions.length, 0);

        statsContainer.innerHTML = `
            <span>📚 ${categoriesCount} категорій</span>
            <span style="margin: 0 15px;">|</span>
            <span>❓ ${totalQuestions} питань</span>
        `;

        this.container.appendChild(statsContainer);
    }

    /**
     * Показує індикатор завантаження
     */
    showLoading() {
        this.container.innerHTML = '<div class="loading">Завантаження FAQ...</div>';
    }

    /**
     * Показує помилку
     * @param {string} message - Повідомлення про помилку
     */
    showError(message) {
        this.container.innerHTML = `
            <div class="error">
                <h3>❌ Помилка</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Спробувати ще раз</button>
            </div>
        `;
    }

    /**
     * Додає глобальні обробники подій
     */
    addGlobalEventListeners() {
        // Обробник для клавіатури
        document.addEventListener('keydown', (event) => {
            // ESC - закрити всі питання
            if (event.key === 'Escape') {
                this.questionComponent.closeAllQuestions();
            }
            
            // Ctrl+A - відкрити всі категорії
            if (event.ctrlKey && event.key === 'a') {
                event.preventDefault();
                this.openAllCategories();
            }
            
            // Ctrl+Z - закрити всі категорії
            if (event.ctrlKey && event.key === 'z') {
                event.preventDefault();
                this.closeAllCategories();
            }
        });

        // Обробник для збереження стану при закритті сторінки
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });

        // Обробник для збереження стану при зміні видимості
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveState();
            }
        });
    }

    /**
     * Відкриває всі категорії
     */
    openAllCategories() {
        this.categoryComponents.forEach(categoryComponent => {
            if (!categoryComponent.isCategoryOpen()) {
                categoryComponent.toggleCategory();
            }
        });
    }

    /**
     * Закриває всі категорії
     */
    closeAllCategories() {
        this.categoryComponents.forEach(categoryComponent => {
            if (categoryComponent.isCategoryOpen()) {
                categoryComponent.toggleCategory();
            }
        });
    }

    /**
     * Зберігає поточний стан додатку
     */
    saveState() {
        try {
            const state = {
                openCategories: Array.from(this.currentState.openCategories),
                openQuestions: Array.from(this.currentState.openQuestions),
                timestamp: Date.now()
            };
            
            localStorage.setItem('faq-app-state', JSON.stringify(state));
        } catch (error) {
            console.warn('Не вдалося зберегти стан додатку:', error);
        }
    }

    /**
     * Відновлює збережений стан додатку
     */
    restoreState() {
        try {
            const savedState = localStorage.getItem('faq-app-state');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Перевіряємо, чи не застарів стан (старіше 1 години)
                if (Date.now() - state.timestamp < 3600000) {
                    this.currentState.openCategories = new Set(state.openCategories);
                    this.currentState.openQuestions = new Set(state.openQuestions);
                    
                    // Відновлюємо стан категорій
                    this.restoreCategoriesState();
                    
                    // Відновлюємо стан питань
                    this.restoreQuestionsState();
                }
            }
        } catch (error) {
            console.warn('Не вдалося відновити стан додатку:', error);
        }
    }

    /**
     * Відновлює стан категорій
     */
    restoreCategoriesState() {
        this.currentState.openCategories.forEach(categoryId => {
            const categoryComponent = this.categoryComponents.find(comp => 
                comp.getCategoryData().id === categoryId
            );
            if (categoryComponent && !categoryComponent.isCategoryOpen()) {
                categoryComponent.toggleCategory();
            }
        });
    }

    /**
     * Відновлює стан питань
     */
    restoreQuestionsState() {
        this.currentState.openQuestions.forEach(questionId => {
            this.questionComponent.openQuestionById(questionId);
        });
    }

    /**
     * Отримує статистику додатку
     * @returns {Object} Статистика додатку
     */
    getAppStats() {
        return {
            categoriesCount: this.categoryComponents.length,
            openCategoriesCount: this.currentState.openCategories.size,
            openQuestionsCount: this.questionComponent.getOpenQuestionsCount(),
            isInitialized: this.isInitialized
        };
    }

    /**
     * Очищає збережений стан
     */
    clearSavedState() {
        try {
            localStorage.removeItem('faq-app-state');
            this.currentState.openCategories.clear();
            this.currentState.openQuestions.clear();
        } catch (error) {
            console.warn('Не вдалося очистити збережений стан:', error);
        }
    }

    /**
     * Знищує додаток та очищає ресурси
     */
    destroy() {
        try {
            // Знищуємо компоненти категорій
            this.categoryComponents.forEach(component => {
                if (component.destroy) {
                    component.destroy();
                }
            });

            // Знищуємо компонент питань
            if (this.questionComponent && this.questionComponent.destroy) {
                this.questionComponent.destroy();
            }

            // Очищаємо масиви
            this.categoryComponents = [];
            this.currentState.openCategories.clear();
            this.currentState.openQuestions.clear();

            // Зберігаємо стан перед знищенням
            this.saveState();

            this.isInitialized = false;
            console.log('FAQ додаток знищено');

        } catch (error) {
            console.error('Помилка при знищенні додатку:', error);
        }
    }
}

// Ініціалізація додатку після завантаження сторінки
const faqApp = new FAQApp();

// Глобальні функції для використання в консолі браузера
window.FAQApp = {
    openAllCategories: () => faqApp.openAllCategories(),
    closeAllCategories: () => faqApp.closeAllCategories(),
    getStats: () => faqApp.getAppStats(),
    clearState: () => faqApp.clearSavedState(),
    destroy: () => faqApp.destroy()
};

// Робимо поточний екземпляр доступним глобально для SearchController
window.faqApp = faqApp;

// Запуск додатку
faqApp.init();

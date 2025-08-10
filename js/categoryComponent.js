/**
 * Компонент для рендерингу категорії FAQ
 */
class CategoryComponent {
    constructor(categoryData, questionComponent) {
        this.categoryData = categoryData;
        this.questionComponent = questionComponent;
        this.isOpen = false;
        this.element = null;
        this.questionsContainer = null;
        this.questionsList = null;
    }

    /**
     * Створює DOM елемент категорії
     * @returns {HTMLElement} DOM елемент категорії
     */
    createElement() {
        // Створюємо основний контейнер категорії
        this.element = document.createElement('div');
        this.element.className = 'category';
        this.element.setAttribute('data-category-id', this.categoryData.id);

        // Створюємо заголовок категорії
        const categoryHeader = this.createCategoryHeader();
        this.element.appendChild(categoryHeader);

        // Створюємо контейнер для питань
        this.questionsContainer = this.createQuestionsContainer();
        this.element.appendChild(this.questionsContainer);

        // Додаємо обробник подій
        this.addEventListeners();

        return this.element;
    }

    /**
     * Створює заголовок категорії
     * @returns {HTMLElement} Заголовок категорії
     */
    createCategoryHeader() {
        const header = document.createElement('div');
        header.className = 'category-header';
        header.dataset.categoryId = this.categoryData.id;

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = this.categoryData.title;

        const icon = document.createElement('span');
        icon.className = 'category-icon';
        icon.innerHTML = '&#9662;'; // Unicode стрілка вниз

        header.appendChild(title);
        header.appendChild(icon);

        return header;
    }

    /**
     * Створює контейнер для питань
     * @returns {HTMLElement} Контейнер питань
     */
    createQuestionsContainer() {
        this.questionsContainer = document.createElement('div');
        this.questionsContainer.className = 'questions-container';

        this.questionsList = document.createElement('ul');
        this.questionsList.className = 'questions-list';

        // Створюємо питання
        this.categoryData.questions.forEach(questionData => {
            const questionElement = this.questionComponent.createQuestionElement(questionData);
            const listItem = document.createElement('li');
            listItem.appendChild(questionElement);
            this.questionsList.appendChild(listItem);
        });

        this.questionsContainer.appendChild(this.questionsList);

        return this.questionsContainer;
    }

    /**
     * Додає обробники подій
     */
    addEventListeners() {
        const header = this.element.querySelector('.category-header');
        header.addEventListener('click', () => this.toggleCategory());
    }

    /**
     * Перемикає стан категорії (відкрити/закрити)
     */
    toggleCategory() {
        if (this.isOpen) {
            this.closeCategory();
        } else {
            this.openCategory();
        }
    }

    /**
     * Відкриває категорію
     */
    openCategory() {
        this.isOpen = true;
        
        const header = this.element.querySelector('.category-header');
        header.classList.add('active');
        
        this.questionsContainer.classList.add('open');
        
        // Анімація для плавного відкриття
        this.animateOpen();
    }

    /**
     * Закриває категорію
     */
    closeCategory() {
        this.isOpen = false;
        
        const header = this.element.querySelector('.category-header');
        header.classList.remove('active');
        
        this.questionsContainer.classList.remove('open');
        
        // Анімація для плавного закриття
        this.animateClose();
    }

    /**
     * Анімація відкриття категорії
     */
    animateOpen() {
        const questions = this.questionsContainer.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            question.style.opacity = '0';
            question.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                question.style.transition = 'all 0.3s ease';
                question.style.opacity = '1';
                question.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Анімація закриття категорії
     */
    animateClose() {
        const questions = this.questionsContainer.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            question.style.transition = 'all 0.2s ease';
            question.style.opacity = '0';
            question.style.transform = 'translateY(-10px)';
        });
    }

    /**
     * Отримує DOM елемент категорії
     * @returns {HTMLElement} DOM елемент категорії
     */
    getElement() {
        return this.element;
    }

    /**
     * Перевіряє, чи відкрита категорія
     * @returns {boolean} true якщо категорія відкрита
     */
    isCategoryOpen() {
        return this.isOpen;
    }

    /**
     * Отримує дані категорії
     * @returns {Object} Дані категорії
     */
    getCategoryData() {
        return this.categoryData;
    }

    /**
     * Оновлює дані категорії
     * @param {Object} newData - Нові дані категорії
     */
    updateCategoryData(newData) {
        this.categoryData = newData;
        
        // Оновлюємо заголовок
        const title = this.element.querySelector('.category-title');
        title.textContent = newData.title;
        
        // Оновлюємо питання
        this.updateQuestions();
    }

    /**
     * Оновлює питання в категорії
     */
    updateQuestions() {
        // Очищаємо поточний список питань
        this.questionsList.innerHTML = '';
        
        // Створюємо нові питання
        this.categoryData.questions.forEach(questionData => {
            const questionElement = this.questionComponent.createQuestionElement(questionData);
            const listItem = document.createElement('li');
            listItem.appendChild(questionElement);
            this.questionsList.appendChild(listItem);
        });
    }

    /**
     * Знищує компонент та очищає ресурси
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.questionsContainer = null;
        this.questionsList = null;
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryComponent;
}

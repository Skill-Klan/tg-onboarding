/**
 * Компонент для рендерингу питання та відповіді FAQ
 */
class QuestionComponent {
    constructor() {
        this.openQuestions = new Set(); // Зберігає ID відкритих питань
    }

    /**
     * Створює DOM елемент питання
     * @param {Object} questionData - Дані питання
     * @returns {HTMLElement} DOM елемент питання
     */
    createQuestionElement(questionData) {
        // Створюємо основний контейнер питання
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.setAttribute('data-question-id', questionData.id);

        // Створюємо заголовок питання
        const questionHeader = this.createQuestionHeader(questionData);
        questionItem.appendChild(questionHeader);

        // Створюємо контейнер для відповіді
        const answerContainer = this.createAnswerContainer(questionData);
        questionItem.appendChild(answerContainer);

        // Додаємо обробник подій
        this.addEventListeners(questionHeader, answerContainer, questionData.id);

        return questionItem;
    }

    /**
     * Створює заголовок питання
     * @param {Object} questionData - Дані питання
     * @returns {HTMLElement} Заголовок питання
     */
    createQuestionHeader(questionData) {
        const header = document.createElement('div');
        header.className = 'question-header';
        header.setAttribute('data-question-id', questionData.id);

        const questionText = document.createElement('h3');
        questionText.className = 'question-text';
        questionText.textContent = questionData.question;

        const icon = document.createElement('span');
        icon.className = 'question-icon';
        icon.innerHTML = '&#10010;'; // Unicode плюс

        header.appendChild(questionText);
        header.appendChild(icon);

        return header;
    }

    /**
     * Створює контейнер для відповіді
     * @param {Object} questionData - Дані питання
     * @returns {HTMLElement} Контейнер відповіді
     */
    createAnswerContainer(questionData) {
        const answerContainer = document.createElement('div');
        answerContainer.className = 'answer-container';
        answerContainer.setAttribute('data-question-id', questionData.id);

        const answerText = document.createElement('p');
        answerText.className = 'answer-text';
        answerText.textContent = questionData.answer;

        answerContainer.appendChild(answerText);

        return answerContainer;
    }

    /**
     * Додає обробники подій
     * @param {HTMLElement} header - Заголовок питання
     * @param {HTMLElement} answerContainer - Контейнер відповіді
     * @param {string} questionId - ID питання
     */
    addEventListeners(header, answerContainer, questionId) {
        header.addEventListener('click', () => this.toggleQuestion(header, answerContainer, questionId));
        
        // Додаємо обробник для клавіатури (доступність)
        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.toggleQuestion(header, answerContainer, questionId);
            }
        });
        
        // Додаємо атрибути для доступності
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', `answer-${questionId}`);
        
        answerContainer.setAttribute('id', `answer-${questionId}`);
        answerContainer.setAttribute('aria-labelledby', `question-${questionId}`);
    }

    /**
     * Перемикає стан питання (відкрити/закрити)
     * @param {HTMLElement} header - Заголовок питання
     * @param {HTMLElement} answerContainer - Контейнер відповіді
     * @param {string} questionId - ID питання
     */
    toggleQuestion(header, answerContainer, questionId) {
        const isOpen = this.openQuestions.has(questionId);
        
        if (isOpen) {
            this.closeQuestion(header, answerContainer, questionId);
        } else {
            this.openQuestion(header, answerContainer, questionId);
        }
    }

    /**
     * Відкриває питання
     * @param {HTMLElement} header - Заголовок питання
     * @param {HTMLElement} answerContainer - Контейнер відповіді
     * @param {string} questionId - ID питання
     */
    openQuestion(header, answerContainer, questionId) {
        this.openQuestions.add(questionId);
        
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        
        answerContainer.classList.add('open');
        
        // Анімація для плавного відкриття
        this.animateAnswerOpen(answerContainer);
        
        // Оновлюємо іконку
        const icon = header.querySelector('.question-icon');
        icon.innerHTML = '&#10005;'; // Unicode хрестик
    }

    /**
     * Закриває питання
     * @param {HTMLElement} header - Заголовок питання
     * @param {HTMLElement} answerContainer - Контейнер відповіді
     * @param {string} questionId - ID питання
     */
    closeQuestion(header, answerContainer, questionId) {
        this.openQuestions.delete(questionId);
        
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        
        answerContainer.classList.remove('open');
        
        // Анімація для плавного закриття
        this.animateAnswerClose(answerContainer);
        
        // Оновлюємо іконку
        const icon = header.querySelector('.question-icon');
        icon.innerHTML = '&#10010;'; // Unicode плюс
    }

    /**
     * Анімація відкриття відповіді
     * @param {HTMLElement} answerContainer - Контейнер відповіді
     */
    animateAnswerOpen(answerContainer) {
        const answerText = answerContainer.querySelector('.answer-text');
        
        // Початковий стан
        answerText.style.opacity = '0';
        answerText.style.transform = 'translateY(-10px)';
        
        // Анімація
        setTimeout(() => {
            answerText.style.transition = 'all 0.3s ease';
            answerText.style.opacity = '1';
            answerText.style.transform = 'translateY(0)';
        }, 50);
    }

    /**
     * Анімація закриття відповіді
     * @param {HTMLElement} answerContainer - Контейнер відповіді
     */
    animateAnswerClose(answerContainer) {
        const answerText = answerContainer.querySelector('.answer-text');
        
        answerText.style.transition = 'all 0.2s ease';
        answerText.style.opacity = '0';
        answerText.style.transform = 'translateY(-10px)';
    }

    /**
     * Перевіряє, чи відкрите питання
     * @param {string} questionId - ID питання
     * @returns {boolean} true якщо питання відкрите
     */
    isQuestionOpen(questionId) {
        return this.openQuestions.has(questionId);
    }

    /**
     * Закриває всі питання
     */
    closeAllQuestions() {
        this.openQuestions.clear();
        
        const allHeaders = document.querySelectorAll('.question-header.active');
        const allAnswers = document.querySelectorAll('.answer-container.open');
        
        allHeaders.forEach(header => {
            header.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
            
            const icon = header.querySelector('.question-icon');
            icon.innerHTML = '&#10010;';
        });
        
        allAnswers.forEach(answer => {
            answer.classList.remove('open');
        });
    }

    /**
     * Відкриває конкретне питання за ID
     * @param {string} questionId - ID питання для відкриття
     */
    openQuestionById(questionId) {
        const header = document.querySelector(`[data-question-id="${questionId}"].question-header`);
        const answerContainer = document.querySelector(`[data-question-id="${questionId}"].answer-container`);
        
        if (header && answerContainer) {
            this.openQuestion(header, answerContainer, questionId);
        }
    }

    /**
     * Закриває конкретне питання за ID
     * @param {string} questionId - ID питання для закриття
     */
    closeQuestionById(questionId) {
        const header = document.querySelector(`[data-question-id="${questionId}"].question-header`);
        const answerContainer = document.querySelector(`[data-question-id="${questionId}"].answer-container`);
        
        if (header && answerContainer) {
            this.closeQuestion(header, answerContainer, questionId);
        }
    }

    /**
     * Отримує кількість відкритих питань
     * @returns {number} Кількість відкритих питань
     */
    getOpenQuestionsCount() {
        return this.openQuestions.size;
    }

    /**
     * Отримує масив ID відкритих питань
     * @returns {Array<string>} Масив ID відкритих питань
     */
    getOpenQuestionsIds() {
        return Array.from(this.openQuestions);
    }

    /**
     * Знищує компонент та очищає ресурси
     */
    destroy() {
        this.openQuestions.clear();
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionComponent;
}

/**
 * Telegram Mini Apps Utilities
 * Відповідно до офіційної документації: https://core.telegram.org/bots/webapps
 */

class TelegramUtils {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.init();
    }

    /**
     * Ініціалізація Telegram Web App
     */
    init() {
        if (!this.tg) {
            console.error('Telegram Web App не знайдено');
            return;
        }

        // Основні налаштування - викликаємо ready() першим
        this.tg.ready();
        this.tg.expand();

        // Налаштування кнопок
        this.setupButtons();

        // Налаштування обробників подій
        this.setupEventHandlers();

        // Застосовуємо поточну тему
        this.updateTheme();
    }

    /**
     * Налаштування кнопок відповідно до документації
     */
    setupButtons() {
        // Main Button (основна кнопка) - для головної дії
        if (this.tg.MainButton) {
            this.tg.MainButton.setText('💬 Зв\'язатися з підтримкою');
            this.tg.MainButton.onClick(() => {
                this.contactSupport();
            });
            this.tg.MainButton.show();
        }

        // Back Button (кнопка "назад") - для навігації
        if (this.tg.BackButton) {
            this.tg.BackButton.onClick(() => {
                this.goBack();
            });
            // Показуємо тільки коли потрібно
            this.tg.BackButton.hide();
        }

        // Secondary Button (другорядна кнопка, Bot API 7.10+)
        if (this.tg.SecondaryButton) {
            this.tg.SecondaryButton.setText('📚 Про школу');
            this.tg.SecondaryButton.onClick(() => {
                this.showSchoolInfo();
            });
            this.tg.SecondaryButton.show();
        }

        // Settings Button (кнопка налаштувань, Bot API 7.0+)
        if (this.tg.SettingsButton) {
            this.tg.SettingsButton.onClick(() => {
                this.showSettings();
            });
            this.tg.SettingsButton.show();
        }
    }

    /**
     * Налаштування обробників подій
     */
    setupEventHandlers() {
        // Зміна теми
        this.tg.onEvent('themeChanged', () => {
            this.updateTheme();
        });

        // Зміна розміру вікна
        this.tg.onEvent('viewportChanged', () => {
            this.updateViewport();
        });

        // Підтвердження закриття
        this.tg.onEvent('closingConfirmationEnabled', () => {
            this.showClosingConfirmation();
        });

        // Зміна розміру вікна (новий API)
        this.tg.onEvent('viewportChanged', () => {
            this.updateViewport();
        });

        // Зміна теми (новий API)
        this.tg.onEvent('themeChanged', () => {
            this.updateTheme();
        });
    }

    /**
     * Показати інформаційне повідомлення
     * @param {string} title - Заголовок
     * @param {string} message - Повідомлення
     */
    showInfo(title, message) {
        this.tg.showAlert(message);
    }

    /**
     * Показати діалог підтвердження
     * @param {string} title - Заголовок
     * @param {string} message - Повідомлення
     * @param {Function} callback - Функція зворотного виклику
     */
    showConfirm(title, message, callback) {
        this.tg.showConfirm(message, callback);
    }

    /**
     * Показати діалог з полем вводу
     * @param {string} title - Заголовок
     * @param {string} message - Повідомлення
     * @param {string} placeholder - Плейсхолдер
     * @param {Function} callback - Функція зворотного виклику
     */
    showPrompt(title, message, placeholder, callback) {
        this.tg.showPopup({
            title: title,
            message: message,
            buttons: [
                {
                    id: 'ok',
                    type: 'ok',
                    text: 'OK'
                },
                {
                    id: 'cancel',
                    type: 'cancel',
                    text: 'Скасувати'
                }
            ]
        }, callback);
    }

    /**
     * Показати popup з кнопками
     * @param {Object} options - Опції popup
     * @param {Function} callback - Функція зворотного виклику
     */
    showPopup(options, callback) {
        this.tg.showPopup(options, callback);
    }

    /**
     * Зв'язатися з підтримкою через нативний Telegram
     */
    contactSupport() {
        // Використовуємо openTelegramLink для відкриття чату з ботом
        // Це краще ніж sendData, оскільки користувач залишається в Telegram
        const botUsername = this.getBotUsername();
        if (botUsername) {
            this.tg.openTelegramLink(`https://t.me/${botUsername}?start=support`);
        } else {
            // Fallback якщо не можемо отримати username бота
            this.showConfirm(
                'Зв\'язатися з підтримкою?',
                'Натисніть "Так" щоб перейти до чату з підтримкою.',
                (confirmed) => {
                    if (confirmed) {
                        // Спробуємо закрити WebApp і повернутися до бота
                        this.tg.close();
                    }
                }
            );
        }
    }

    /**
     * Показати інформацію про школу
     */
    showSchoolInfo() {
        this.showInfo(
            'Про SkillKlan',
            'SkillKlan — це IT школа, яка готує спеціалістів у сфері технологій. Ми навчаємо тестуванню (QA), бізнес-аналітиці та backend-розробці. Всі курси доступні онлайн та офлайн в Києві.'
        );
    }

    /**
     * Навігація назад
     */
    goBack() {
        // Тут можна додати логіку навігації назад
        // Наприклад, згорнути розгорнуту секцію
        const expandedSections = document.querySelectorAll('.section-content.expanded');
        if (expandedSections.length > 0) {
            expandedSections.forEach(section => {
                section.classList.remove('expanded');
            });
            this.tg.BackButton.hide();
        }
    }

    /**
     * Показати налаштування
     */
    showSettings() {
        this.showInfo('Налаштування', 'Тут можна налаштувати параметри додатку. Функція в розробці.');
    }

    /**
     * Отримати username бота з initData
     */
    getBotUsername() {
        // Спробуємо отримати username бота з різних джерел
        return this.tg.initDataUnsafe?.bot?.username || 
               this.tg.initDataUnsafe?.user?.username ||
               'SkillKlanBot'; // fallback
    }

    /**
     * Оновити тему
     */
    updateTheme() {
        const themeParams = this.tg.themeParams;
        
        // Встановлюємо CSS змінні для теми
        document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-link-color', themeParams.link_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color || '#f0f0f0');

        // Додатково встановлюємо кольори для кращої інтеграції
        if (themeParams.secondary_bg_color) {
            document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
        }
    }

    /**
     * Оновити viewport
     */
    updateViewport() {
        const viewportHeight = this.tg.viewportHeight;
        const viewportStableHeight = this.tg.viewportStableHeight;
        
        // Адаптуємо інтерфейс при зміні розміру
        if (viewportHeight < 500) {
            document.body.style.fontSize = '14px';
        } else {
            document.body.style.fontSize = '16px';
        }

        // Встановлюємо CSS змінну для viewport
        document.documentElement.style.setProperty('--tg-viewport-height', `${viewportHeight}px`);
        document.documentElement.style.setProperty('--tg-viewport-stable-height', `${viewportStableHeight}px`);
    }

    /**
     * Показати підтвердження закриття
     */
    showClosingConfirmation() {
        this.showConfirm(
            'Закрити FAQ?',
            'Ви впевнені, що хочете закрити сторінку?',
            (confirmed) => {
                if (confirmed) {
                    this.tg.close();
                }
            }
        );
    }

    /**
     * Встановити колір заголовка
     * @param {string} color - Колір у форматі hex
     */
    setHeaderColor(color) {
        if (this.tg.setHeaderColor) {
            this.tg.setHeaderColor(color);
        }
    }

    /**
     * Встановити колір нижньої панелі
     * @param {string} color - Колір у форматі hex
     */
    setBottomBarColor(color) {
        if (this.tg.setBottomBarColor) {
            this.tg.setBottomBarColor(color);
        }
    }

    /**
     * Включити/виключити вертикальні свайпи
     * @param {boolean} enabled - Чи включені свайпи
     */
    setVerticalSwipes(enabled) {
        if (enabled) {
            this.tg.enableVerticalSwipes();
        } else {
            this.tg.disableVerticalSwipes();
        }
    }

    /**
     * Включити/виключити підтвердження закриття
     * @param {boolean} enabled - Чи включене підтвердження
     */
    setClosingConfirmation(enabled) {
        if (enabled) {
            this.tg.enableClosingConfirmation();
        } else {
            this.tg.disableClosingConfirmation();
        }
    }

    /**
     * Отримати інформацію про користувача
     * @returns {Object} Інформація про користувача
     */
    getUserInfo() {
        return {
            id: this.tg.initDataUnsafe?.user?.id,
            firstName: this.tg.initDataUnsafe?.user?.first_name,
            lastName: this.tg.initDataUnsafe?.user?.last_name,
            username: this.tg.initDataUnsafe?.user?.username,
            languageCode: this.tg.initDataUnsafe?.user?.language_code,
            isPremium: this.tg.initDataUnsafe?.user?.is_premium,
            photoUrl: this.tg.initDataUnsafe?.user?.photo_url
        };
    }

    /**
     * Отримати інформацію про Web App
     * @returns {Object} Інформація про Web App
     */
    getWebAppInfo() {
        return {
            platform: this.tg.platform,
            version: this.tg.version,
            colorScheme: this.tg.colorScheme,
            themeParams: this.tg.themeParams,
            isExpanded: this.tg.isExpanded,
            viewportHeight: this.tg.viewportHeight,
            viewportStableHeight: this.tg.viewportStableHeight,
            headerColor: this.tg.headerColor,
            backgroundColor: this.tg.backgroundColor
        };
    }

    /**
     * Відправити дані в бот
     * @param {string} data - Дані для відправки
     */
    sendData(data) {
        this.tg.sendData(data);
    }

    /**
     * Закрити Web App
     */
    close() {
        this.tg.close();
    }

    /**
     * Відкрити посилання
     * @param {string} url - URL для відкриття
     * @param {Object} options - Опції (Bot API 6.4+)
     */
    openLink(url, options = {}) {
        this.tg.openLink(url, options);
    }

    /**
     * Відкрити Telegram посилання
     * @param {string} url - Telegram URL
     */
    openTelegramLink(url) {
        this.tg.openTelegramLink(url);
    }

    /**
     * Переключитися на inline запит
     * @param {string} query - Запит
     * @param {Array} chatTypes - Типи чатів
     */
    switchInlineQuery(query, chatTypes = []) {
        this.tg.switchInlineQuery(query, chatTypes);
    }

    /**
     * Показати BackButton коли потрібно
     */
    showBackButton() {
        if (this.tg.BackButton) {
            this.tg.BackButton.show();
        }
    }

    /**
     * Приховати BackButton
     */
    hideBackButton() {
        if (this.tg.BackButton) {
            this.tg.BackButton.hide();
        }
    }
}

// Експортуємо для використання
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramUtils;
} else {
    window.TelegramUtils = TelegramUtils;
}

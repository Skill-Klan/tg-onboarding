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

        // Основні налаштування
        this.tg.ready();
        this.tg.expand();

        // Налаштування кнопок
        this.setupButtons();

        // Налаштування обробників подій
        this.setupEventHandlers();
    }

    /**
     * Налаштування кнопок відповідно до документації
     */
    setupButtons() {
        // Main Button (основна кнопка)
        if (this.tg.MainButton) {
            this.tg.MainButton.setText('📚 Відкрити FAQ');
            this.tg.MainButton.show();
        }

        // Secondary Button (другорядна кнопка, Bot API 7.10+)
        if (this.tg.SecondaryButton) {
            this.tg.SecondaryButton.setText('💬 Підтримка');
            this.tg.SecondaryButton.show();
        }

        // Settings Button (кнопка налаштувань, Bot API 7.0+)
        if (this.tg.SettingsButton) {
            this.tg.SettingsButton.show();
        }
    }

    /**
     * Налаштування обробників подій
     */
    setupEventHandlers() {
        // Основна кнопка
        this.tg.onEvent('mainButtonClicked', () => {
            this.showInfo('FAQ SkillKlan', 'Це сторінка з часто запитуваними питаннями про SkillKlan. Використовуйте пошук або розгортайте секції для знаходження потрібної інформації.');
        });

        // Другорядна кнопка
        if (this.tg.SecondaryButton) {
            this.tg.onEvent('secondaryButtonClicked', () => {
                this.contactSupport();
            });
        }

        // Кнопка налаштувань
        if (this.tg.SettingsButton) {
            this.tg.onEvent('settingsButtonClicked', () => {
                this.showSettings();
            });
        }

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
     * Зв'язатися з підтримкою
     */
    contactSupport() {
        this.showConfirm(
            'Зв\'язатися з підтримкою?',
            'Натисніть "Так" щоб перейти до чату з підтримкою або "Ні" щоб залишитися на сторінці FAQ.',
            (confirmed) => {
                if (confirmed) {
                    // Відправляємо дані в бот
                    this.tg.sendData('contact_support');
                    // Показуємо повідомлення про успіх
                    this.showInfo('Переходимо до чату з підтримкою...');
                    // Закриваємо Web App
                    setTimeout(() => {
                        this.tg.close();
                    }, 1500);
                }
            }
        );
    }

    /**
     * Показати налаштування
     */
    showSettings() {
        this.showInfo('Налаштування', 'Тут можна налаштувати параметри додатку. Функція в розробці.');
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
    }

    /**
     * Оновити viewport
     */
    updateViewport() {
        const viewportHeight = this.tg.viewportHeight;
        
        // Адаптуємо інтерфейс при зміні розміру
        if (viewportHeight < 500) {
            document.body.style.fontSize = '14px';
        } else {
            document.body.style.fontSize = '16px';
        }
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
}

// Експортуємо для використання
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramUtils;
} else {
    window.TelegramUtils = TelegramUtils;
}

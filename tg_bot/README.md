# SkillKlan FAQ Mini App

Telegram Mini App для відображення часто запитуваних питань про SkillKlan - IT школу з курсами QA, бізнес-аналітики та backend-розробки.

## 🚀 Особливості

- **Нативна інтеграція з Telegram** - використовує офіційний WebApp API
- **Адаптивний дизайн** - автоматично підлаштовується під тему Telegram
- **Швидкий пошук** - пошук по питаннях та відповідях
- **Нативні кнопки оболонки** - MainButton, BackButton, SecondaryButton
- **Напівмодальне відображення** - Compact Mode для кращого UX
- **Плавні анімації** - сучасний інтерфейс з плавними переходами

## 📱 Як це працює

1. **Запуск** - користувач натискає кнопку FAQ у боті
2. **Відкриття** - Mini App відкривається як напівмодальне вікно
3. **Навігація** - користувач може переглядати секції та шукати питання
4. **Зв'язок** - кнопка "Зв'язатися з підтримкою" відкриває чат з ботом
5. **Закриття** - WebApp закривається та повертає користувача до бота

## 🛠 Технології

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Telegram API**: telegram-web-app.js
- **Стилізація**: CSS змінні для теми, адаптивний дизайн
- **Анімації**: CSS transitions та keyframes
- **Пошук**: Клієнтський пошук з debouncing

## 📁 Структура проекту

```
tg_bot/
├── public/
│   ├── faq.html          # Головна сторінка FAQ
│   ├── telegram-utils.js # Утиліти для роботи з Telegram API
│   └── botfather-setup.md # Інструкції по налаштуванню
├── README.md             # Цей файл
└── requirements.txt      # Залежності Python (якщо потрібно)
```

## ⚙️ Налаштування

### 1. Створення Mini App у BotFather

```bash
# Відкрийте @BotFather в Telegram
/newapp
# Виберіть бота
# Назва: SkillKlan FAQ
# Опис: FAQ та відповіді на питання про SkillKlan
```

### 2. Налаштування режиму

```bash
/setappmode
# Виберіть бота
# Режим: Main або Direct
# Compact Mode: включено
```

### 3. Налаштування кнопки меню

```bash
/setmenubutton
# Виберіть бота
# Текст: 📚 FAQ
# URL: https://your-domain.com/faq.html
```

### 4. Додавання домену

```bash
/setdomain
# Виберіть бота
# Домен: your-domain.com
```

## 🔧 Розробка

### Локальне тестування

1. Запустіть локальний сервер:
```bash
cd tg_bot/public
python -m http.server 8000
```

2. Відкрийте `http://localhost:8000/faq.html`

3. Для тестування Telegram функцій використовуйте [@WebAppBot](https://t.me/WebAppBot)

### Структура коду

#### telegram-utils.js
- `TelegramUtils` клас для роботи з WebApp API
- Налаштування кнопок оболонки
- Обробка подій (themeChanged, viewportChanged)
- Методи для роботи з темою та viewport

#### faq.html
- Основна структура FAQ
- Пошук по питаннях
- Анімації та переходи
- Інтеграція з Telegram утилітами

## 🎨 Кастомізація

### Зміна кольорів теми

```css
:root {
    --tg-theme-bg-color: #ffffff;
    --tg-theme-text-color: #000000;
    --tg-theme-button-color: #2481cc;
    /* ... інші кольори */
}
```

### Додавання нових секцій

```javascript
const faqData = {
    sections: {
        newSection: {
            title: '🆕 Нова секція',
            questions: [
                {
                    question: 'Нове питання?',
                    answer: 'Нова відповідь!'
                }
            ]
        }
    }
};
```

### Зміна поведінки кнопок

```javascript
// В telegram-utils.js
setupButtons() {
    if (this.tg.MainButton) {
        this.tg.MainButton.setText('Новий текст');
        this.tg.MainButton.onClick(() => {
            // Нова логіка
        });
    }
}
```

## 🧪 Тестування

### Перевірка функціональності

- [ ] Mini App відкривається як напівмодальне вікно
- [ ] Тема автоматично застосовується
- [ ] Пошук працює коректно
- [ ] Кнопки оболонки функціонують
- [ ] Анімації плавні
- [ ] Адаптивність на різних екранах

### Тестування на різних пристроях

- **iOS**: Telegram iOS клієнт
- **Android**: Telegram Android клієнт
- **Desktop**: Telegram Desktop
- **Web**: Telegram Web

## 🚀 Розгортання

### 1. Завантаження файлів

```bash
# Завантажте файли на ваш хостинг
scp -r public/* user@your-domain.com:/var/www/html/
```

### 2. Налаштування HTTPS

```bash
# SSL сертифікат обов'язковий для Telegram Web Apps
sudo certbot --nginx -d your-domain.com
```

### 3. Перевірка доступності

```bash
# Перевірте доступність
curl -I https://your-domain.com/faq.html
```

## 📚 Документація

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [WebApp API](https://core.telegram.org/bots/webapps#initializing-web-apps)
- [Bot API](https://core.telegram.org/bots/api)

## 🤝 Внесок

1. Fork проекту
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push до branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проект розповсюджується під ліцензією MIT. Дивіться `LICENSE` файл для деталей.

## 📞 Підтримка

Якщо у вас є питання або проблеми:

1. Створіть Issue в цьому репозиторії
2. Зверніться до [@SkillKlanBot](https://t.me/SkillKlanBot)
3. Напишіть на email: support@skillklan.com

## 🔄 Оновлення

### v1.0.0 (Поточна)
- Базова функціональність FAQ
- Інтеграція з Telegram WebApp API
- Адаптивний дизайн
- Нативні кнопки оболонки

### Плани на майбутнє
- [ ] Мультимовність (EN, RU)
- [ ] Категорії та теги
- [ ] Статистика використання
- [ ] Адміністративна панель
- [ ] Інтеграція з CRM

---

**SkillKlan FAQ Mini App** - сучасне рішення для надання швидкої допомоги користувачам прямо в Telegram! 🚀

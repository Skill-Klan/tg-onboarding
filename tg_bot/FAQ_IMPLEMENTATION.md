# 📚 FAQ Напівмодалка - Документація реалізації

## 🎯 Опис

FAQ (Часто запитують) напівмодалка — це вбудований Web App у Telegram боті, який дозволяє користувачам отримувати відповіді на популярні питання про SkillKlan безпосередньо в чаті.

## ✨ Особливості

- **Напівмодальний дизайн** - займає 60% висоти екрану
- **Адаптивний інтерфейс** - автоматично підлаштовується під тему Telegram
- **Пошук по питаннях** - швидкий пошук по ключових словах
- **Згортання/розгортання** - секції та питання можна згортати
- **Інтеграція з ботом** - дані передаються назад у чат

## 🏗️ Архітектура

### Файли проекту

```
tg_bot/
├── public/
│   └── faq.html          # HTML файл FAQ Web App
├── src/
│   ├── texts/
│   │   └── faq.js        # Тексти та дані для FAQ
│   ├── config/
│   │   └── webapp.js     # Конфігурація Web App
│   └── handlers/
│       └── shared/
│           └── webappHandler.js  # Обробник Web App
├── server.js              # Веб-сервер для обслуговування HTML
└── package.json           # Залежності та скрипти
```

### Компоненти

1. **HTML/CSS/JS** - фронтенд частина Web App
2. **Express сервер** - обслуговує статичні файли
3. **Telegram Web App API** - інтеграція з Telegram
4. **Бот хендлери** - обробка подій з Web App

## 🚀 Запуск

### 1. Встановлення залежностей
```bash
npm install
```

### 2. Запуск веб-сервера
```bash
npm run server
```

### 3. Запуск бота
```bash
npm run dev
```

## 📱 Використання

### Для користувачів

1. **Відкриття FAQ**: Натисніть кнопку "📚 FAQ" у боті
2. **Навігація**: Використовуйте секції для групування питань
3. **Пошук**: Введіть ключові слова у поле пошуку
4. **Читання**: Натисніть на питання для розгортання відповіді
5. **Підтримка**: Натисніть "💬 Зв'язатися з підтримкою"

### Для розробників

#### Додавання нових питань

1. Відредагуйте `src/texts/faq.js`:
```javascript
export default {
  questions: {
    new_question: {
      question: 'Нове питання?',
      answer: 'Нова відповідь.'
    }
  }
}
```

2. Оновіть `public/faq.html` - додайте дані у `faqData`

#### Зміна стилів

1. Відредагуйте CSS у `public/faq.html`
2. Використовуйте CSS змінні Telegram теми:
   - `--tg-theme-bg-color` - колір фону
   - `--tg-theme-text-color` - колір тексту
   - `--tg-theme-button-color` - колір кнопок

## 🔧 Налаштування

### Змінні середовища

```bash
# .env файл
FAQ_WEBAPP_URL=http://localhost:3000/faq.html
FAQ_FALLBACK_URL=http://localhost:3000/faq.html
PORT=3000
```

### Конфігурація Web App

```javascript
// src/config/webapp.js
export const WEBAPP_CONFIG = {
  faq: {
    url: process.env.FAQ_WEBAPP_URL || 'http://localhost:3000/faq.html',
    fallbackUrl: process.env.FAQ_FALLBACK_URL || 'http://localhost:3000/faq.html'
  },
  settings: {
    viewport: {
      height: 0.6,    // 60% висоти екрану
      width: 0.95,    // 95% ширини
      is_expanded: false
    }
  }
}
```

## 📊 Аналітика

### Події, що відстежуються

- `FAQ_Click` - користувач натиснув кнопку FAQ
- `FAQ_WebApp_Opened` - Web App відкрито
- `FAQ_Fallback_Used` - використано fallback URL
- `WebApp_Data_Received` - отримано дані з Web App

### Дані аналітики

```javascript
{
  user_id: 123456789,
  username: 'username',
  state: 'contact_given', // або 'contact_not_given'
  has_name: true,
  has_phone: true,
  is_premium: false
}
```

## 🎨 Кастомізація

### Кольори теми

```css
/* Світла тема */
--tg-theme-bg-color: #ffffff
--tg-theme-text-color: #000000
--tg-theme-hint-color: #999999
--tg-theme-link-color: #2481cc
--tg-theme-button-color: #2481cc
--tg-theme-button-text-color: #ffffff

/* Темна тема */
--tg-theme-bg-color: #212121
--tg-theme-text-color: #ffffff
--tg-theme-hint-color: #aaaaaa
--tg-theme-link-color: #64baf0
--tg-theme-button-color: #64baf0
--tg-theme-button-text-color: #ffffff
```

### Розміри напівмодалки

```javascript
viewport: {
  height: 0.6,        // 60% висоти екрану
  width: 0.95,        // 95% ширини
  is_expanded: false, // не розгортати на весь екран
  is_closed: false    // не закривати автоматично
}
```

## 🐛 Відладка

### Перевірка роботи сервера

```bash
# Перевірка статусу
curl http://localhost:3000/

# Перевірка FAQ
curl http://localhost:3000/faq.html

# Логи сервера
npm run server
```

### Перевірка Web App

1. Відкрийте бота
2. Натисніть "📚 FAQ"
3. Перевірте, чи відкривається Web App
4. Перевірте консоль браузера на помилки

### Поширені проблеми

- **Сервер не запускається**: перевірте порт 3000
- **Web App не відкривається**: перевірте URL у конфігурації
- **Помилки JavaScript**: перевірте консоль браузера
- **Проблеми з темою**: перевірте CSS змінні

## 📈 Розширення функціональності

### Можливі покращення

1. **Категорії питань** - додати фільтрацію по категоріях
2. **Історія пошуку** - зберігати останні пошукові запити
3. **Улюблені питання** - можливість зберігати важливі питання
4. **Відгуки** - оцінка корисності відповідей
5. **Мультимовність** - підтримка різних мов

### Інтеграція з базою даних

```javascript
// Приклад збереження даних
export async function saveFAQData(ctx, data) {
  try {
    await db.faqInteractions.create({
      userId: ctx.from.id,
      questionId: data.questionId,
      action: data.action,
      timestamp: new Date()
    });
  } catch (error) {
    logger.error('Error saving FAQ data', error);
  }
}
```

## 🔒 Безпека

### Рекомендації

1. **Валідація даних** - перевіряйте всі вхідні дані
2. **Обмеження доступу** - налаштуйте CORS та безпеку
3. **Логування** - ведіть логи всіх дій користувачів
4. **Оновлення** - регулярно оновлюйте залежності

### CORS налаштування

```javascript
// server.js
app.use(cors({
  origin: ['https://web.telegram.org', 'https://t.me'],
  credentials: true
}));
```

## 📝 Ліцензія

Цей проект розроблено для SkillKlan IT школи. Всі права захищені.

---

**Автор**: SkillKlan Team  
**Версія**: 1.0.0  
**Дата**: Серпень 2024

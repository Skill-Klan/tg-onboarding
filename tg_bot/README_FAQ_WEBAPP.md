# 📱 FAQ Web App - Telegram Mini App

## 🎯 Опис проекту

FAQ Web App - це Telegram Mini App, який надає користувачам зручний доступ до часто запитуваних питань про SkillKlan. Додаток інтегрований з Telegram Bot API та працює як вбудована сторінка прямо в месенджері.

## ✨ Особливості

- **🌐 Вбудований в Telegram** - відкривається прямо в месенджері
- **📱 Адаптивний дизайн** - автоматично підлаштовується під тему Telegram
- **🔍 Пошук по FAQ** - швидкий пошук по ключових словах
- **📚 Структуровані секції** - зручна навігація по категоріях
- **🎨 Сучасний UI/UX** - красивий та зручний інтерфейс
- **⚡ Швидка робота** - оптимізована продуктивність

## 🚀 Швидкий старт

### 1. Клонування проекту
```bash
git clone <repository-url>
cd tg-onboarding/tg_bot
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Налаштування змінних середовища
```bash
cp .env.example .env
# Відредагуйте .env файл та додайте BOT_TOKEN
```

### 4. Запуск проекту
```bash
# Автоматичний запуск всього проекту
./start_all.sh

# Або ручний запуск:
npm run server    # Запуск FAQ сервера
npm run dev       # Запуск Telegram бота
```

## 🔧 Конфігурація

### Змінні середовища (.env)
```bash
# Обов'язково
BOT_TOKEN=your_telegram_bot_token

# Web App налаштування
FAQ_WEBAPP_URL=http://localhost:3000/faq.html
FAQ_FALLBACK_URL=http://localhost:3000/faq.html

# Опціонально
NODE_ENV=development
LOG_LEVEL=info
```

### Отримання BOT_TOKEN
1. Відправте `/newbot` боту @BotFather
2. Введіть назву бота
3. Введіть username (має закінчуватися на 'bot')
4. Скопіюйте отриманий токен

## 📱 Використання

### В Telegram
1. **Відправте команду** `/start` боту
2. **Натисніть кнопку** "📚 FAQ"
3. **Web App відкриється** прямо в Telegram
4. **Переглядайте FAQ** по секціях або використовуйте пошук

### Локальне тестування
- **FAQ сторінка**: http://localhost:3000/faq.html
- **Головна сторінка**: http://localhost:3000/

## 🧪 Тестування

### Тест FAQ Web App
```bash
node test_faq_webapp.js
```

### Тест бота
```bash
node test_bot_webapp.js
```

### Тест конфігурації
```bash
npm run validate
npm run check-token
```

## 📊 Структура проекту

```
tg_bot/
├── 📁 src/                    # Основний код
│   ├── 📁 config/            # Конфігурація
│   │   ├── environment.js    # Змінні середовища
│   │   └── webapp.js         # Web App налаштування
│   ├── 📁 handlers/          # Обробники команд
│   │   └── 📁 shared/
│   │       └── webappHandler.js # Web App хендлер
│   └── index.mjs             # Основний файл бота
├── 📁 public/                # Статичні файли
│   ├── faq.html              # FAQ HTML сторінка
│   ├── faq-data.json         # FAQ дані
│   ├── faq-mini-app.css      # Стилі
│   └── telegram-utils.js     # Telegram утиліти
├── server.js                  # Express сервер
├── start_all.sh               # Скрипт запуску
└── .env                       # Змінні середовища
```

## 🌐 Розгортання

### Локальна розробка
```bash
NODE_ENV=development
FAQ_WEBAPP_URL=http://localhost:3000/faq.html
```

### Продакшн
```bash
NODE_ENV=production
FAQ_WEBAPP_URL=https://yourdomain.com/faq.html
WEBHOOK_URL=https://yourdomain.com
WEBHOOK_PORT=443
```

## 🔍 Діагностика

### Перевірка статусу
```bash
# Перевірка сервера
curl http://localhost:3000/

# Перевірка бота
ps aux | grep "node.*index.mjs"

# Перевірка конфігурації
npm run validate
```

### Логи
- **Сервер**: консоль Express
- **Бот**: консоль Telegraf
- **Web App**: консоль браузера

## 🚨 Вирішення проблем

### Бот не запускається
1. Перевірте BOT_TOKEN
2. Перевірте .env файл
3. Запустіть `npm run validate`

### Web App не відкривається
1. Перевірте FAQ_WEBAPP_URL
2. Переконайтеся, що сервер запущений
3. Перевірте доступність http://localhost:3000

### Помилки в консолі
1. Перевірте логи сервера
2. Перевірте логи бота
3. Запустіть тестові скрипти

## 📚 Документація

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web App](https://core.telegram.org/bots/webapps)
- [Telegraf.js](https://telegraf.js.org/)
- [Express.js](https://expressjs.com/)

## 🤝 Підтримка

Якщо виникли питання:
1. Перевірте цю документацію
2. Запустіть тестові скрипти
3. Перевірте логи та помилки
4. Створіть issue в репозиторії

## 📄 Ліцензія

Цей проект розповсюджується під ліцензією ISC.

---

**Версія**: 1.0.0  
**Останнє оновлення**: $(date)  
**Статус**: 🟢 Готово до використання

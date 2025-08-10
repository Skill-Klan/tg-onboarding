# 🤖 Налаштування Telegram Бота

## ❌ Поточна проблема
Бот не реагує на стандартний флоу через неправильний токен.

## 🔧 Кроки для виправлення

### 1. Створення нового бота
1. Відкрийте Telegram
2. Знайдіть @BotFather: https://t.me/BotFather
3. Відправте команду `/newbot`
4. Введіть назву бота (наприклад: "SkillKlan Onboarding Bot")
5. Введіть username бота (наприклад: "skillklan_onboarding_bot")
6. Скопіюйте отриманий токен

### 2. Оновлення токена
1. Відкрийте файл `.env` в папці `tg_bot`
2. Замініть `BOT_TOKEN=your_bot_token_here` на ваш токен
3. Збережіть файл

### 3. Тестування підключення
```bash
cd tg_bot
node test-connection.js
```

### 4. Запуск бота
```bash
npm run dev
```

## 📋 Приклад .env файлу
```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890

# Web App URLs
PUBLIC_URL=https://yourdomain.com
FAQ_WEBAPP_URL=https://yourdomain.com/faq.html
FAQ_FALLBACK_URL=https://yourdomain.com/faq.html

# Налаштування сервера
PORT=3000
NODE_ENV=development

# Логування
LOG_LEVEL=info
DEBUG=true
```

## 🚨 Важливо
- Токен має формат: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890`
- Не діліться токеном з іншими
- Якщо токен потрапив до сторонніх осіб, негайно змініть його через @BotFather

## 🔍 Перевірка роботи
Після налаштування бот повинен:
1. Успішно підключитися до Telegram API
2. Реагувати на команду `/start`
3. Показувати кнопки з напрямами (Тестування, Бізнес аналітика, Backend)
4. Обробляти всі стандартні флоу

## 📞 Підтримка
Якщо виникли проблеми, перевірте:
- Правильність токена
- Інтернет з'єднання
- Логи бота в терміналі

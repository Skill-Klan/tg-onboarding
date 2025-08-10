# 📚 Документація по налаштуванню SkillKlan Telegram Bot

## 🎯 Огляд проекту

SkillKlan Telegram Bot - це автоматизована система реєстрації та розподілу тестових завдань для IT школи. Бот допомагає:
- Реєструвати нових студентів
- Збирати контактну інформацію
- Розподіляти по напрямках навчання (QA, Бізнес аналітика, Backend)
- Автоматично видавати тестові завдання у форматі PDF
- Відстежувати прогрес через webhook систему

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

### 3. Налаштування середовища
```bash
npm run setup
```

### 4. Редагування .env файлу
```bash
nano .env
```
Додайте ваш токен бота:
```
BOT_TOKEN=your_telegram_bot_token_here
NODE_ENV=development
```

### 5. Валідація конфігурації
```bash
npm run validate
npm run check-token
```

### 6. Запуск бота
```bash
# Розробка (з auto-reload)
npm run dev

# Продакшн
npm start
```

## 🔧 Детальне налаштування

### Створення Telegram Bot

1. **Знайдіть @BotFather в Telegram**
2. **Створіть нового бота:**
   ```
   /newbot
   ```
3. **Вкажіть назву та username для бота**
4. **Отримайте токен** (виглядає як `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. **Налаштуйте команди:**
   ```
   /setcommands
   
   start - Почати роботу з ботом
   help - Допомога
   ```

### Налаштування webhook (опціонально)

Для продакшн середовища рекомендується налаштувати webhook:

```bash
# Встановлення webhook
curl -F "url=https://your-domain.com/webhook" \
     -F "certificate=@/path/to/cert.pem" \
     "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook"

# Перевірка webhook
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

### Налаштування середовища

Створіть файл `.env` в корені проекту:

```env
# Обов'язкові змінні
BOT_TOKEN=your_telegram_bot_token_here

# Опціональні змінні
NODE_ENV=development
PORT=3000
WEBHOOK_URL=https://your-domain.com/webhook
CERT_PATH=/path/to/cert.pem

# Логування
LOG_LEVEL=info
LOG_FILE=bot.log

# Безпека
SESSION_SECRET=your_random_secret_here
```

## 📁 Структура проекту

```
tg_bot/
├── src/                          # Основний код
│   ├── config/                   # Конфігурація
│   │   ├── environment.js        # Налаштування середовища
│   │   ├── errorHandler.js       # Обробка помилок
│   │   └── webapp.js            # Налаштування webapp
│   ├── handlers/                 # Обробники повідомлень
│   │   ├── shared/              # Спільні обробники
│   │   ├── qa/                  # Обробники для QA
│   │   ├── ba/                  # Обробники для Бізнес аналітики
│   │   ├── backend/             # Обробники для Backend
│   │   └── startHandler.js      # Початковий обробник
│   ├── middleware/               # Middleware функції
│   ├── texts/                    # Тексти бота
│   ├── utils/                    # Утиліти
│   └── index.mjs                # Точка входу
├── public/                       # Статичні файли
│   ├── faq-mini-app.html        # FAQ міні-додаток
│   ├── faq-data.json            # Дані для FAQ
│   └── pdf/                     # PDF файли завдань
├── server.js                     # Express сервер для webapp
├── package.json                  # Залежності та скрипти
└── .env                         # Змінні середовища
```

## 🛠 Доступні команди

### Основні команди
```bash
npm start          # Запуск в продакшн режимі
npm run dev        # Запуск в режимі розробки (з auto-reload)
npm run server     # Запуск Express сервера
npm run dev:server # Запуск сервера в режимі розробки
```

### Утиліти
```bash
npm run setup      # Створення .env файлу
npm run validate   # Валідація конфігурації
npm run check-token # Перевірка токена бота
```

### Розробка
```bash
npm run dev        # Запуск з auto-reload
npm run dev:server # Запуск сервера з auto-reload
```

## 🔒 Безпека

### Захист токена
- ✅ Токен зберігається в `.env` файлі
- ✅ `.env` додано до `.gitignore`
- ✅ Токен маскується в логах
- ✅ Валідація токена при запуску

### Рекомендації
1. **Ніколи не комітьте `.env` файл**
2. **Використовуйте різні токени для dev/prod**
3. **Регулярно змінюйте токени**
4. **Обмежте доступ до сервера**

## 📊 Моніторинг та логування

### Логування
```javascript
// Включення логування
LOG_LEVEL=debug
LOG_FILE=bot.log
```

### Перевірка статусу
```bash
# Перевірка роботи бота
curl "https://api.telegram.org/bot<BOT_TOKEN>/getMe"

# Перевірка webhook
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

## 🚨 Розв'язання проблем

### Поширені помилки

#### 1. "Bot token is invalid"
```bash
# Перевірте токен
npm run check-token

# Перевірте .env файл
cat .env
```

#### 2. "Cannot find module"
```bash
# Перевстановіть залежності
rm -rf node_modules package-lock.json
npm install
```

#### 3. "Permission denied"
```bash
# Перевірте права доступу
chmod +x deploy.sh
chmod 600 .env
```

#### 4. "Port already in use"
```bash
# Змініть порт в .env
PORT=3001

# Або знайдіть процес
lsof -i :3000
kill -9 <PID>
```

### Діагностика

#### Перевірка конфігурації
```bash
npm run validate
```

#### Тестування бота
```bash
# Створіть тестовий файл
node test_bot.js
```

#### Перевірка логів
```bash
tail -f bot.log
```

## 🌐 Розгортання

### Локальне тестування
```bash
# Запуск бота
npm run dev

# Тестування в Telegram
# Знайдіть вашого бота та відправте /start
```

### Продакшн розгортання
```bash
# Підготовка
npm run validate
npm run check-token

# Запуск
npm start

# Або з PM2
pm2 start src/index.mjs --name "skillklan-bot"
```

### Docker (опціонально)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Додаткові ресурси

### Документація
- [BOT_FLOW.md](BOT_FLOW.md) - Логіка роботи бота
- [FLOW_DIAGRAM.md](FLOW_DIAGRAM.md) - Діаграма flow
- [FAQ_IMPLEMENTATION.md](FAQ_IMPLEMENTATION.md) - FAQ система
- [TELEGRAM_MODAL_IMPLEMENTATION.md](TELEGRAM_MODAL_IMPLEMENTATION.md) - Модальні вікна

### Корисні посилання
- [Telegraf.js Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Підтримка

### Структура команди
- **Розробники:** Основна розробка та підтримка
- **QA:** Тестування та валідація
- **DevOps:** Розгортання та моніторинг

### Контакти
- **GitHub Issues:** Для баг-репортів та feature requests
- **Telegram:** @support_channel для термінових питань
- **Email:** tech@skillklan.com для ділових питань

---

## ✅ Чек-лист налаштування

- [ ] Клоновано репозиторій
- [ ] Встановлено залежності (`npm install`)
- [ ] Створено `.env` файл (`npm run setup`)
- [ ] Додано токен бота в `.env`
- [ ] Валідовано конфігурацію (`npm run validate`)
- [ ] Перевірено токен (`npm run check-token`)
- [ ] Запущено бота (`npm run dev`)
- [ ] Протестовано в Telegram (`/start`)
- [ ] Налаштовано webhook (опціонально)
- [ ] Налаштовано логування
- [ ] Протестовано всі функції

**🎉 Вітаємо! Ваш SkillKlan Telegram Bot готовий до роботи!**

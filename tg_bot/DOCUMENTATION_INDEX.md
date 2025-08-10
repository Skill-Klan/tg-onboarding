# 📚 Індекс документації SkillKlan Telegram Bot

## 🎯 Огляд проекту

SkillKlan Telegram Bot - це автоматизована система реєстрації та розподілу тестових завдань для IT школи. Бот допомагає реєструвати нових студентів, збирати контактну інформацію та автоматично видавати тестові завдання у форматі PDF.

## 📖 Структура документації

### 🚀 Швидкий старт
- **[SETUP_DOCUMENTATION.md](SETUP_DOCUMENTATION.md)** - Повна документація по налаштуванню
- **[README.md](README.md)** - Основна інформація про проект

### 👨‍💻 Для розробників
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Детальний гід для розробників
- **[BOT_FLOW.md](BOT_FLOW.md)** - Логіка роботи бота
- **[FLOW_DIAGRAM.md](FLOW_DIAGRAM.md)** - Візуальна діаграма flow
- **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)** - Звіт про рефакторинг

### 🚀 Для DevOps
- **[DEVOPS_DEPLOYMENT.md](DEVOPS_DEPLOYMENT.md)** - DevOps та розгортання
- **[deploy.sh](deploy.sh)** - Скрипт автоматичного розгортання
- **[DEPLOYMENT_SETUP.md](../DEPLOYMENT_SETUP.md)** - Налаштування розгортання

### 📱 Функціональність
- **[FAQ_IMPLEMENTATION.md](FAQ_IMPLEMENTATION.md)** - FAQ система
- **[FAQ_MINI_APP_SETUP.md](FAQ_MINI_APP_SETUP.md)** - Налаштування FAQ міні-додатку
- **[TELEGRAM_MODAL_IMPLEMENTATION.md](TELEGRAM_MODAL_IMPLEMENTATION.md)** - Модальні вікна

### 🔒 Безпека
- **[TOKEN_SECURITY.md](TOKEN_SECURITY.md)** - Безпека токенів
- **[SSH_TROUBLESHOOTING.md](../SSH_TROUBLESHOOTING.md)** - Розв'язання проблем з SSH

## 🎯 Швидкий старт (5 хвилин)

### 1. Клонування та встановлення
```bash
git clone <repository-url>
cd tg-onboarding/tg_bot
npm install
```

### 2. Налаштування
```bash
npm run setup
# Відредагуйте .env файл та додайте BOT_TOKEN
```

### 3. Запуск
```bash
npm run dev
```

### 4. Тестування
Знайдіть вашого бота в Telegram та відправте `/start`

## 🔧 Основні компоненти

### Структура проекту
```
src/
├── handlers/          # Обробники повідомлень
├── config/            # Конфігурація
├── middleware/        # Middleware функції
├── texts/             # Тексти бота
├── utils/             # Утиліти
└── index.mjs          # Точка входу
```

### Ключові файли
- **`src/index.mjs`** - Головний файл бота
- **`src/handlers/shared/baseHandler.js`** - Базовий handler для всіх напрямків
- **`src/config/environment.js`** - Налаштування середовища
- **`package.json`** - Залежності та скрипти

## 📱 Функціональність

### Основні можливості
- ✅ Реєстрація користувачів
- ✅ Збір контактної інформації
- ✅ Розподіл по напрямках (QA, BA, Backend)
- ✅ Автоматична видача PDF завдань
- ✅ FAQ система з міні-додатком
- ✅ Webhook для відстеження прогресу

### Напрямки навчання
1. **📚 QA** - Тестування програмного забезпечення
2. **📊 Бізнес аналітика** - Аналіз бізнес-процесів
3. **💻 Backend** - Розробка серверної частини

## 🛠 Доступні команди

### Розробка
```bash
npm run dev          # Запуск з auto-reload
npm run dev:server   # Запуск сервера з auto-reload
```

### Продакшн
```bash
npm start            # Запуск в продакшн режимі
npm run server       # Запуск Express сервера
```

### Утиліти
```bash
npm run setup        # Створення .env файлу
npm run validate     # Валідація конфігурації
npm run check-token  # Перевірка токена бота
```

## 🔒 Безпека

### Захист токена
- ✅ Токен зберігається в `.env` файлі
- ✅ `.env` додано до `.gitignore`
- ✅ Токен маскується в логах
- ✅ Валідація токена при запуску

### Рекомендації
1. Ніколи не комітьте `.env` файл
2. Використовуйте різні токени для dev/prod
3. Регулярно змінюйте токени
4. Обмежте доступ до сервера

## 🚀 Розгортання

### Локальне тестування
```bash
npm run dev
# Протестуйте в Telegram
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
```bash
docker build -t skillklan-bot .
docker run -p 3000:3000 skillklan-bot
```

## 📊 Моніторинг

### Health check
```bash
curl http://localhost:3000/health
```

### Метрики
```bash
curl http://localhost:3000/metrics
```

### Логи
```bash
# PM2 логи
pm2 logs skillklan-bot

# Файлові логи
tail -f /var/log/skillklan-bot/bot.log
```

## 🧪 Тестування

### Запуск тестів
```bash
npm test              # Всі тести
npm run test:unit     # Unit тести
npm run test:e2e      # E2E тести
```

### Тестові файли
- **`test_bot.js`** - Тестування основної функціональності
- **`test_faq.js`** - Тестування FAQ системи
- **`test_telegram_utils.html`** - Тестування утиліт

## 🔍 Діагностика

### Поширені проблеми

#### 1. "Bot token is invalid"
```bash
npm run check-token
cat .env
```

#### 2. "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. "Port already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### Корисні команди
```bash
# Перевірка конфігурації
npm run validate

# Перевірка статусу бота
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# Перевірка webhook
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

## 📚 Додаткові ресурси

### Офіційна документація
- [Telegraf.js](https://telegraf.js.org/) - Telegram Bot API для Node.js
- [Telegram Bot API](https://core.telegram.org/bots/api) - Офіційна документація
- [Node.js](https://nodejs.org/) - JavaScript runtime

### Корисні посилання
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Configuration](https://nginx.org/en/docs/)

## 🤝 Підтримка

### Структура команди
- **Розробники:** Основна розробка та підтримка
- **QA:** Тестування та валідація
- **DevOps:** Розгортання та моніторинг

### Контакти
- **GitHub Issues:** Для баг-репортів та feature requests
- **Telegram:** @support_channel для термінових питань
- **Email:** tech@skillklan.com для ділових питань

## 📈 Розвиток проекту

### Завершені етапи
- ✅ Базова функціональність бота
- ✅ Рефакторинг за принципом DRY
- ✅ FAQ система з міні-додатком
- ✅ Документація по налаштуванню
- ✅ DevOps та розгортання

### Плани на майбутнє
- [ ] Покращення логування
- [ ] Додавання тестів (покриття >80%)
- [ ] Моніторинг та метрики
- [ ] CI/CD pipeline
- [ ] API документація (Swagger/OpenAPI)
- [ ] Performance optimization

## 🎯 Швидкі посилання

### Налаштування
- [🚀 Швидкий старт](SETUP_DOCUMENTATION.md#швидкий-старт)
- [🔧 Детальне налаштування](SETUP_DOCUMENTATION.md#детальне-налаштування)
- [🔐 SSL сертифікати](DEVOPS_DEPLOYMENT.md#ssl-сертифікати-з-lets-encrypt)

### Розробка
- [🏗 Архітектура](DEVELOPER_GUIDE.md#архітектура-проекту)
- [🔧 Основні компоненти](DEVELOPER_GUIDE.md#основні-компоненти)
- [🧪 Тестування](DEVELOPER_GUIDE.md#тестування)

### Розгортання
- [🚀 Розгортання](DEVOPS_DEPLOYMENT.md#розгортання-додатку)
- [🌐 Nginx](DEVOPS_DEPLOYMENT.md#налаштування-nginx)
- [📊 Моніторинг](DEVOPS_DEPLOYMENT.md#моніторинг-та-логування)

---

## ✅ Чек-лист для нових користувачів

- [ ] Клоновано репозиторій
- [ ] Встановлено залежності
- [ ] Створено `.env` файл з токеном
- [ ] Валідовано конфігурацію
- [ ] Запущено бота
- [ ] Протестовано в Telegram
- [ ] Ознайомлено з документацією

**🎉 Вітаємо! Ви готові працювати з SkillKlan Telegram Bot!**

---

*Останнє оновлення: $(date)*
*Версія документації: 1.0*

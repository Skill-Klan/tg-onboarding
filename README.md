# 🚀 Telegram Onboarding Bot - Автоматичний Деплой

## 📋 Опис проекту

Telegram бот для онбордингу з автоматичним деплоєм через GitHub Actions та локальним скриптом деплою.

## 🚀 Швидкий старт

### 1. Налаштування змінних середовища

```bash
cd tg_bot
cp .env.example .env
# Відредагуйте .env файл, додавши ваш BOT_TOKEN
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Валідація конфігурації

```bash
npm run validate
```

### 4. Запуск бота

```bash
npm start
```

## 🔄 Автоматичний деплой

### GitHub Actions (рекомендовано)

1. **Додайте секрети в GitHub:**
   - `BOT_TOKEN` - токен вашого Telegram бота
   - `HOST` - IP адреса сервера
   - `USERNAME` - користувач на сервері
   - `SSH_PRIVATE_KEY` - приватний SSH ключ

2. **Деплой автоматично запуститься при:**
   - Push в гілку `main`
   - Злитті Pull Request в `main`

### Локальний деплой

```bash
# Налаштування змінних
export BOT_TOKEN="ваш_токен"
export DEPLOY_HOST="ip_сервера"
export DEPLOY_USER="користувач"

# Запуск деплою
./deploy.sh deploy

# Перевірка статусу
./deploy.sh status

# Перегляд логів
./deploy.sh logs
```

## 🛠️ Структура проекту

```
tg_bot/
├── src/                    # Код бота
│   ├── handlers/          # Обробники команд
│   ├── config/            # Конфігурація
│   └── utils/             # Утиліти
├── public/                # Веб-додаток FAQ
├── .github/workflows/     # GitHub Actions
├── deploy.sh              # Локальний скрипт деплою
└── package.json           # Залежності
```

## 🔧 Налаштування сервера

### Вимоги
- Node.js 18+
- Git
- SSH доступ

### Підготовка сервера

```bash
# Встановлення Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Створення директорії
sudo mkdir -p /home/ubuntu/apps/tg-onboarding
sudo chown $USER:$USER /home/ubuntu/apps/tg-onboarding
```

## 📚 Документація

- [Налаштування деплою](DEPLOYMENT_SETUP.md)
- [Інструкції по розробці](tg_bot/DEVELOPER_GUIDE.md)
- [FAQ веб-додаток](tg_bot/README_FAQ_WEBAPP.md)
- [Архітектура бота](tg_bot/ARCHITECTURE_ANALYSIS.md)

## 🚨 Troubleshooting

### Проблеми з деплоєм
```bash
# Перевірка SSH підключення
ssh username@your-server-ip

# Перевірка логів
tail -f /home/ubuntu/apps/tg-onboarding/bot.log

# Перезапуск бота
pkill -f "node.*index.mjs"
cd /home/ubuntu/apps/tg-onboarding/tg_bot
nohup npm start > ../bot.log 2>&1 &
```

### Проблеми з токеном
```bash
# Перевірка .env файлу
cat tg_bot/.env

# Валідація конфігурації
cd tg_bot && npm run validate
```

## 🤝 Внесок

1. Fork репозиторію
2. Створіть feature гілку
3. Зробіть commit змін
4. Push в гілку
5. Створіть Pull Request

## 📄 Ліцензія

MIT License

## 🆘 Підтримка

Якщо у вас виникли питання:
1. Перевірте [FAQ](tg_bot/FAQ_IMPLEMENTATION.md)
2. Подивіться [логі помилок](tg_bot/DEVOPS_DEPLOYMENT.md)
3. Створіть Issue в GitHub

---

🎉 **Готово до деплою!** Налаштуйте секрети в GitHub та зробіть push в main гілку.

# 🚀 SkillKlan Telegram Bot - Onboarding Project

## 📋 Каталог проекту

### 🏗️ Основна структура
```
tg-onboarding/
├── 📁 faq/                    # FAQ система з пошуком
├── 📁 systemd/                # Системні сервіси та скрипти
├── 📁 tg_bot/                 # Telegram бот
├── 📁 .github/workflows/      # GitHub Actions конфігурації
└── 📄 README.md               # Цей файл
```

### 🚀 Розгортання та налаштування

#### Швидке налаштування
```bash
# Встановлення залежностей
cd tg_bot
npm install

# Налаштування змінних середовища
cp env.example .env
# Відредагуйте .env файл

# Запуск бота
npm start
```

#### Встановлення як системний сервіс
```bash
# Встановлення systemd сервісу
cd systemd
sudo ./install-service.sh

# Управління сервісом
sudo ./manage-service.sh start|stop|restart|status
```

### 🔧 Основні функції

1. **Telegram бот** - онбординг для різних напрямків (BA, Backend, QA)
2. **FAQ система** - пошук та навігація по питаннях
3. **Systemd інтеграція** - автоматичне управління сервісом
4. **PDF документація** - матеріали для кожного напрямку

### 📚 Технології

- **Backend:** Node.js, Express, Telegraf
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Система:** Linux, systemd, bash скрипти
- **Розгортання:** GitHub Pages, Netlify

### 🤝 Підтримка

Проект призначений для автоматизації онбордингу нових співробітників у SkillKlan через Telegram бота з інтегрованою FAQ системою.
# Test commit for auto-deploy

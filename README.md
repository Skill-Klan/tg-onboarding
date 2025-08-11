# 🚀 SkillKlan Telegram Bot - Onboarding Project

## 📋 Каталог проекту

### 🏗️ Основна структура
```
tg-onboarding/
├── 📁 faq/                    # FAQ система з пошуком
├── 📁 systemd/                # Системні сервіси та скрипти
├── 📁 tg_bot/                 # Telegram бот
└── 📄 README.md               # Цей файл
```

### 📁 FAQ система (`faq/`)
- **HTML/CSS/JS веб-додаток** з пошуком та категоріями
- **Файли:**
  - `index.html` - головна сторінка
  - `css/style.css` - стилі
  - `js/` - JavaScript модулі
    - `app.js` - головний файл
    - `searchComponent.js` - компонент пошуку
    - `categoryComponent.js` - компонент категорій
    - `questionComponent.js` - компонент питань
    - `dataLoader.js` - завантаження даних
    - `searchEngine.js` - пошуковий двигун
    - `searchController.js` - контролер пошуку
  - `data.json` - дані FAQ
  - `deploy-netlify.sh` - скрипт розгортання на Netlify

### 📁 Systemd сервіси (`systemd/`)
- **Системні скрипти для управління ботом:**
  - `skillklan-bot.service` - systemd сервіс
  - `install-service.sh` - встановлення сервісу
  - `manage-service.sh` - управління сервісом
  - `uninstall-service.sh` - видалення сервісу
  - `check-dependencies.sh` - перевірка залежностей
  - `validate-config.sh` - валідація конфігурації
  - `common.sh` - спільні функції

### 📁 Telegram бот (`tg_bot/`)
- **Node.js бот з Express сервером:**
  - **Основні файли:**
    - `server.js` - головний сервер
    - `index.mjs` - точка входу
    - `package.json` - залежності
    - `env.example` - приклад змінних середовища
    - `setup-bot.sh` - скрипт налаштування
    - `test-connection.js` - тест з'єднання
  
  - **Структура src/:**
    - `config/` - конфігурація та обробка помилок
    - `handlers/` - обробники повідомлень
      - `ba/` - обробники для BA напрямку
      - `backend/` - обробники для Backend напрямку
      - `qa/` - обробники для QA напрямку
      - `shared/` - спільні обробники
    - `middleware/` - проміжне програмне забезпечення
    - `texts/` - тексти для різних напрямків
    - `utils/` - утиліти та допоміжні функції
  
  - **PDF файли:**
    - `BA.pdf` - документація для BA
    - `Backend.pdf` - документація для Backend
    - `QA.pdf` - документація для QA

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

#### Розгортання FAQ на Netlify
```bash
cd faq
./deploy-netlify.sh
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
- **Розгортання:** Netlify, GitHub Pages

### 🤝 Підтримка

Проект призначений для автоматизації онбордингу нових співробітників у SkillKlan через Telegram бота з інтегрованою FAQ системою.

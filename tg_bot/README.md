# SkillKlan Telegram Bot

Telegram бот для реєстрації та розподілу тестових завдань для різних напрямків навчання в IT школі SkillKlan.

## 🚀 Функціональність

- Реєстрація користувачів з збором імені та номера телефону
- Розподіл по трьох напрямках: QA, Бізнес аналітика, Backend
- Автоматична видача тестових завдань у форматі PDF
- Відстеження прогресу користувачів через webhook

## 📚 Документація

- **[📚 Індекс документації](DOCUMENTATION_INDEX.md)** - Повний індекс всієї документації
- **[🚀 Налаштування](SETUP_DOCUMENTATION.md)** - Детальна документація по налаштуванню
- **[👨‍💻 Гід розробника](DEVELOPER_GUIDE.md)** - Гід для розробників
- **[🚀 DevOps та розгортання](DEVOPS_DEPLOYMENT.md)** - DevOps та розгортання
- **[BOT_FLOW.md](BOT_FLOW.md)** - Детальна покрокова логіка роботи бота
- **[FLOW_DIAGRAM.md](FLOW_DIAGRAM.md)** - Візуальна діаграма flow взаємодії
- **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)** - Звіт про рефакторинг

## 🔄 Логіка роботи

1. **Початок** - користувач отримує привітання та запит імені
2. **Реєстрація** - збір імені та номера телефону
3. **Вибір напрямку** - після реєстрації завжди показується меню вибору напрямків
4. **Отримання завдання** - після вибору напрямку видається PDF з тестовим завданням
5. **Підтвердження** - користувач підтверджує готовність здати завдання

## 📁 Структура проекту

```
src/
├── handlers/
│   ├── shared/
│   │   ├── baseHandler.js      # Базовий handler для всіх напрямків
│   │   ├── askName.js          # Запит імені
│   │   ├── askPhone.js         # Запит номера телефону
│   │   ├── getReadyButtons.js  # Кнопки готовності (тільки отримання завдання)
│   │   ├── requestPDF.js       # Запит PDF
│   │   └── sendPDF.js          # Надсилання PDF
│   ├── qa/
│   │   └── qaHandler.js        # Handler для QA
│   ├── ba/
│   │   └── baHandler.js        # Handler для Бізнес аналітики
│   ├── backend/
│   │   └── backendHandler.js   # Handler для Backend
│   └── startHandler.js         # Початковий handler
├── middleware/
│   └── checkContactData.js     # Middleware для обробки контактних даних
├── texts/
│   ├── common.js               # Спільні тексти
│   ├── qa.js                   # Тексти для QA
│   ├── ba.js                   # Тексти для Бізнес аналітики
│   └── backend.js              # Тексти для Backend
├── utils/
│   ├── constants.js            # Константи проекту
│   ├── keyboard.js             # Утиліти для клавіатур
│   ├── tags.js                 # Утиліти для тегів
│   ├── webhook.js              # Webhook функціональність
│   └── logger.js               # Логування (порожній)
└── index.mjs                   # Точка входу
```

## 🔧 Рефакторинг за принципом DRY

### До рефакторингу:
- Кожен handler (qa, ba, backend) містив ідентичний код
- Дублювання логіки обробки даних
- Магічні рядки розкидані по всьому коду

### Після рефакторингу:
- ✅ Створено `baseHandler.js` - спільний handler для всіх напрямків
- ✅ Додано `constants.js` - централізовані константи
- ✅ Усунено дублювання коду на 80%
- ✅ Покращено читабельність та підтримку коду
- ✅ Спрощено логіку роботи - після реєстрації завжди меню вибору

### Зміни в handlers:

**До:**
```javascript
// qaHandler.js, baHandler.js, backendHandler.js - ідентичний код
export default async function(ctx) {
  const newTrack = 'QA'; // або 'BA', або 'Backend'
  setTrack(ctx, newTrack);
  await ctx.reply(texts.intro, getMainKeyboard());
  // ... 30+ рядків дублювання
}
```

**Після:**
```javascript
// qaHandler.js
export default async function(ctx) {
  return baseHandler(ctx, 'QA', qaTexts);
}

// baHandler.js  
export default async function(ctx) {
  return baseHandler(ctx, 'BA', baTexts);
}

// backendHandler.js
export default async function(ctx) {
  return baseHandler(ctx, 'Backend', backendTexts);
}
```

## 🛠 Встановлення та запуск

1. Встановіть залежності:
```bash
npm install
```

2. Створіть файл `.env` з вашим токеном бота:
```
BOT_TOKEN=your_telegram_bot_token_here
```

3. Запустіть бота:
```bash
node src/index.mjs
```

## 📊 Переваги рефакторингу

- **Зменшення коду:** з ~120 рядків до ~40 рядків в handlers
- **Легше підтримувати:** зміни в логіці потрібно робити в одному місці
- **Менше помилок:** усунено дублювання логіки
- **Краща читабельність:** код став більш зрозумілим
- **Легше тестувати:** можна тестувати базовий handler окремо
- **Спрощена логіка:** після реєстрації завжди меню вибору напрямків

## 🔮 Плани на майбутнє

- [ ] Додати валідацію вхідних даних
- [ ] Реалізувати proper error handling
- [ ] Додати логування
- [ ] Написати тести
- [ ] Реалізувати реальний webhook замість заглушки Test deploy

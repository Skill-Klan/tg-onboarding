# 👨‍💻 Гід розробника SkillKlan Telegram Bot

## 🏗 Архітектура проекту

### Загальна структура
```
src/
├── index.mjs              # Точка входу - ініціалізація бота
├── config/                 # Конфігурація та налаштування
├── handlers/               # Обробники повідомлень
├── middleware/             # Middleware функції
├── texts/                  # Тексти та локалізація
└── utils/                  # Утиліти та допоміжні функції
```

### Принципи архітектури

1. **Модульність** - кожен handler окремий модуль
2. **DRY (Don't Repeat Yourself)** - використання базових класів
3. **Separation of Concerns** - розділення логіки та даних
4. **Middleware Pattern** - ланцюжок обробки повідомлень

## 🔧 Основні компоненти

### 1. Точка входу (`src/index.mjs`)

```javascript
import { Telegraf } from 'telegraf';
import { config } from './config/environment.js';
import { setupHandlers } from './handlers/index.js';
import { setupMiddleware } from './middleware/index.js';

const bot = new Telegraf(config.bot.token);

// Налаштування middleware
setupMiddleware(bot);

// Налаштування handlers
setupHandlers(bot);

// Запуск бота
bot.launch();
```

### 2. Конфігурація (`src/config/`)

#### `environment.js`
```javascript
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  bot: {
    token: process.env.BOT_TOKEN,
    maskedToken: process.env.BOT_TOKEN?.slice(-4) || 'N/A'
  },
  server: {
    port: process.env.PORT || 3000,
    webhookUrl: process.env.WEBHOOK_URL
  },
  environment: process.env.NODE_ENV || 'development'
};
```

#### `errorHandler.js`
```javascript
export function handleError(error, ctx) {
  console.error('Bot error:', error);
  
  // Логування помилки
  logger.error('Bot error', { error: error.message, ctx });
  
  // Відповідь користувачу
  ctx.reply('Вибачте, сталася помилка. Спробуйте ще раз.');
}
```

### 3. Handlers (`src/handlers/`)

#### Базовий handler (`src/handlers/shared/baseHandler.js`)

```javascript
import { setTrack, getTrack } from '../../utils/tags.js';
import { getMainKeyboard } from '../../utils/keyboard.js';

export async function baseHandler(ctx, trackName, texts) {
  try {
    // Встановлення напрямку
    setTrack(ctx, trackName);
    
    // Отримання поточного напрямку
    const currentTrack = getTrack(ctx);
    
    // Відправка вступного повідомлення
    await ctx.reply(texts.intro, getMainKeyboard());
    
    // Логування
    logger.info(`User ${ctx.from.id} selected track: ${trackName}`);
    
    return true;
  } catch (error) {
    logger.error('Base handler error:', error);
    throw error;
  }
}
```

#### Специфічні handlers

```javascript
// src/handlers/qa/qaHandler.js
import { baseHandler } from '../shared/baseHandler.js';
import { qaTexts } from '../../texts/qa.js';

export default async function(ctx) {
  return baseHandler(ctx, 'QA', qaTexts);
}

// src/handlers/ba/baHandler.js
import { baseHandler } from '../shared/baseHandler.js';
import { baTexts } from '../../texts/ba.js';

export default async function(ctx) {
  return baseHandler(ctx, 'BA', baTexts);
}
```

### 4. Middleware (`src/middleware/`)

#### `checkContactData.js`
```javascript
export function checkContactData() {
  return async (ctx, next) => {
    // Перевірка наявності контактних даних
    const hasName = ctx.session?.userName;
    const hasPhone = ctx.session?.userPhone;
    
    if (!hasName || !hasPhone) {
      // Перенаправлення на реєстрацію
      return ctx.scene.enter('registration');
    }
    
    await next();
  };
}
```

### 5. Тексти (`src/texts/`)

#### `common.js`
```javascript
export const commonTexts = {
  welcome: 'Вітаю! Я бот SkillKlan. Давайте познайомимось!',
  askName: 'Як вас звати?',
  askPhone: 'Введіть ваш номер телефону:',
  error: 'Вибачте, сталася помилка. Спробуйте ще раз.',
  success: 'Дякуємо! Дані збережено.',
  back: '⬅️ Назад',
  mainMenu: '🏠 Головне меню'
};
```

#### `qa.js`
```javascript
export const qaTexts = {
  intro: 'Вітаю в розділі QA! Тут ви дізнаєтесь про тестування програмного забезпечення.',
  description: 'QA (Quality Assurance) - це процес забезпечення якості продукту.',
  task: 'Ваше тестове завдання готове!',
  ready: 'Готові почати?'
};
```

### 6. Утиліти (`src/utils/`)

#### `keyboard.js`
```javascript
import { Markup } from 'telegraf';

export function getMainKeyboard() {
  return Markup.keyboard([
    ['📚 QA', '📊 Бізнес аналітика'],
    ['💻 Backend', '❓ FAQ'],
    ['👤 Мій профіль', '🆘 Допомога']
  ]).resize();
}

export function getReadyKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Готовий!', 'ready'),
      Markup.button.callback('⏰ Пізніше', 'later')
    ]
  ]);
}
```

#### `tags.js`
```javascript
export function setTrack(ctx, track) {
  if (!ctx.session) ctx.session = {};
  ctx.session.track = track;
}

export function getTrack(ctx) {
  return ctx.session?.track || null;
}

export function clearTrack(ctx) {
  if (ctx.session) {
    delete ctx.session.track;
  }
}
```

## 🔄 Flow обробки повідомлень

### 1. Структура flow
```
Повідомлення → Middleware → Handler → Response
     ↓              ↓         ↓         ↓
  Валідація → Перевірка → Обробка → Відповідь
```

### 2. Приклад обробки команди `/start`

```javascript
// 1. Middleware перевіряє сесію
checkContactData() → 

// 2. Handler обробляє команду
startHandler(ctx) → 
  - Перевіряє наявність даних
  - Якщо немає - запитує ім'я
  - Якщо є - показує меню

// 3. Відправка відповіді
ctx.reply(text, keyboard)
```

## 🧪 Тестування

### Структура тестів
```
tests/
├── unit/           # Unit тести
├── integration/    # Integration тести
├── e2e/           # End-to-end тести
└── fixtures/      # Тестові дані
```

### Приклад unit тесту

```javascript
// tests/unit/handlers/baseHandler.test.js
import { baseHandler } from '../../../src/handlers/shared/baseHandler.js';
import { mockContext, mockTexts } from '../../fixtures/mocks.js';

describe('BaseHandler', () => {
  it('should set track and send intro message', async () => {
    const ctx = mockContext();
    const texts = mockTexts();
    
    await baseHandler(ctx, 'QA', texts);
    
    expect(ctx.session.track).toBe('QA');
    expect(ctx.reply).toHaveBeenCalledWith(texts.intro, expect.any(Object));
  });
});
```

### Запуск тестів
```bash
# Всі тести
npm test

# Unit тести
npm run test:unit

# Integration тести
npm run test:integration

# E2E тести
npm run test:e2e
```

## 🚀 Розробка нових функцій

### 1. Створення нового handler

```javascript
// src/handlers/newFeature/newFeatureHandler.js
import { baseHandler } from '../shared/baseHandler.js';
import { newFeatureTexts } from '../../texts/newFeature.js';

export default async function(ctx) {
  // Логіка обробки
  const result = await processNewFeature(ctx);
  
  if (result.success) {
    return baseHandler(ctx, 'NEW_FEATURE', newFeatureTexts);
  } else {
    throw new Error('Feature processing failed');
  }
}
```

### 2. Додавання нових текстів

```javascript
// src/texts/newFeature.js
export const newFeatureTexts = {
  intro: 'Вітаю в новому розділі!',
  description: 'Опис нової функції...',
  success: 'Операція виконана успішно!',
  error: 'Помилка виконання операції'
};
```

### 3. Реєстрація handler

```javascript
// src/handlers/index.js
import newFeatureHandler from './newFeature/newFeatureHandler.js';

export function setupHandlers(bot) {
  // Існуючі handlers...
  
  // Новий handler
  bot.action('new_feature', newFeatureHandler);
  bot.hears(/нов.*функц.*/i, newFeatureHandler);
}
```

## 🔍 Діагностика та дебаг

### Логування
```javascript
import { logger } from '../utils/logger.js';

// Різні рівні логування
logger.debug('Debug info');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');

// Логування з контекстом
logger.info('User action', {
  userId: ctx.from.id,
  action: 'button_click',
  data: ctx.callbackQuery?.data
});
```

### Перевірка стану
```javascript
// Перевірка сесії
console.log('Session:', ctx.session);

// Перевірка контексту
console.log('Context:', {
  from: ctx.from,
  chat: ctx.chat,
  message: ctx.message
});

// Перевірка стану бота
console.log('Bot state:', bot.context);
```

## 📊 Моніторинг та метрики

### Основні метрики
```javascript
// Кількість активних користувачів
const activeUsers = new Set();

// Час відповіді
const responseTimes = [];

// Статистика використання
const usageStats = {
  totalCommands: 0,
  successfulCommands: 0,
  failedCommands: 0
};
```

### Експорт метрик
```javascript
// /metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    activeUsers: activeUsers.size,
    averageResponseTime: calculateAverage(responseTimes),
    successRate: usageStats.successfulCommands / usageStats.totalCommands,
    uptime: process.uptime()
  });
});
```

## 🔒 Безпека

### Валідація вхідних даних
```javascript
export function validateInput(input) {
  // Перевірка довжини
  if (input.length < 2 || input.length > 100) {
    throw new Error('Invalid input length');
  }
  
  // Перевірка на XSS
  if (/<script|javascript:/i.test(input)) {
    throw new Error('Invalid input content');
  }
  
  return input.trim();
}
```

### Rate limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 100, // максимум 100 запитів
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

## 📚 Корисні ресурси

### Документація
- [Telegraf.js API Reference](https://telegraf.js.org/classes/Telegraf.html)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Інструменти розробки
- **VS Code Extensions:**
  - ESLint
  - Prettier
  - Node.js Extension Pack
- **Terminal Tools:**
  - nodemon (auto-reload)
  - pm2 (process manager)
  - docker (containerization)

### Патерни проектування
- **Middleware Pattern** - для обробки запитів
- **Factory Pattern** - для створення handlers
- **Strategy Pattern** - для різних типів обробки
- **Observer Pattern** - для подій та логування

---

## 🎯 Наступні кроки розробки

1. **Покращення логування** - структуровані логи
2. **Додавання тестів** - покриття коду >80%
3. **Моніторинг** - метрики та алерти
4. **CI/CD** - автоматичне розгортання
5. **Документація API** - Swagger/OpenAPI
6. **Performance optimization** - кешування та оптимізація

**💡 Порада:** Почніть з малого - додайте логування, потім тести, потім моніторинг. Крок за кроком покращуйте якість коду!

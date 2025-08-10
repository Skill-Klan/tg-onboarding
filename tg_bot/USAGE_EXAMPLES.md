# 💡 Приклади використання SkillKlan Telegram Bot

## 🎯 Основні сценарії

### 1. Реєстрація нового користувача

#### Сценарій: Користувач вперше запускає бота
```
Користувач: /start
Бот: 👋 Вітаю! Я бот SkillKlan. Давайте познайомимось!
      Як вас звати?

Користувач: Іван Петренко
Бот: Приємно познайомитися, Іван! 
      Тепер введіть ваш номер телефону:

Користувач: +380991234567
Бот: Дякуємо за реєстрацію! 
      Тепер виберіть напрямок навчання:
      
      📚 QA - Тестування програмного забезпечення
      📊 Бізнес аналітика - Аналіз бізнес-процесів  
      💻 Backend - Розробка серверної частини
```

#### Код для цього сценарію:
```javascript
// src/handlers/startHandler.js
export default async function(ctx) {
  const userName = ctx.message.text;
  
  // Збереження імені
  setUserName(ctx, userName);
  
  // Запит номера телефону
  await ctx.reply('Тепер введіть ваш номер телефону:');
}
```

### 2. Вибір напрямку навчання

#### Сценарій: Користувач обирає QA
```
Користувач: 📚 QA
Бот: 🎯 Вітаю в розділі QA!
      
      QA (Quality Assurance) - це процес забезпечення 
      якості програмного забезпечення.
      
      Ваше тестове завдання готове! 
      Готові почати?

      [✅ Готовий!] [⏰ Пізніше]
```

#### Код для цього сценарію:
```javascript
// src/handlers/qa/qaHandler.js
import { baseHandler } from '../shared/baseHandler.js';
import { qaTexts } from '../../texts/qa.js';

export default async function(ctx) {
  return baseHandler(ctx, 'QA', qaTexts);
}
```

### 3. Отримання тестового завдання

#### Сценарій: Користувач готовий отримати завдання
```
Користувач: [✅ Готовий!]
Бот: 📋 Ваше тестове завдання для QA:
      
      🎯 Завдання: Створіть тест-план для 
      веб-додатку електронної комерції
      
      📄 Детальний опис завдання надіслано 
      у PDF файлі.
      
      ⏰ Час виконання: 2-3 години
      📧 Відправте готове завдання на: 
      qa@skillklan.com
```

#### Код для цього сценарію:
```javascript
// src/handlers/shared/sendPDF.js
export async function sendPDF(ctx, trackName) {
  const pdfPath = `./public/pdf/${trackName}.pdf`;
  
  await ctx.reply('📄 Ваше тестове завдання:');
  await ctx.replyWithDocument({
    source: pdfPath,
    filename: `${trackName}_task.pdf`
  });
}
```

## 🔧 Технічні приклади

### 1. Створення клавіатури

#### Основна клавіатура
```javascript
// src/utils/keyboard.js
import { Markup } from 'telegraf';

export function getMainKeyboard() {
  return Markup.keyboard([
    ['📚 QA', '📊 Бізнес аналітика'],
    ['💻 Backend', '❓ FAQ'],
    ['👤 Мій профіль', '🆘 Допомога']
  ]).resize();
}
```

#### Inline клавіатура
```javascript
export function getReadyKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Готовий!', 'ready'),
      Markup.button.callback('⏰ Пізніше', 'later')
    ],
    [
      Markup.button.callback('❓ Питання', 'question')
    ]
  ]);
}
```

### 2. Обробка callback кнопок

#### Обробник для кнопки "Готовий"
```javascript
// src/handlers/shared/requestPDF.js
export async function handleReadyButton(ctx) {
  const track = getTrack(ctx);
  
  if (!track) {
    return ctx.reply('Спочатку виберіть напрямок навчання.');
  }
  
  // Відправка PDF
  await sendPDF(ctx, track);
  
  // Оновлення статусу
  updateUserStatus(ctx, 'task_sent');
}
```

### 3. Робота з сесією

#### Збереження даних користувача
```javascript
// src/utils/tags.js
export function setUserName(ctx, name) {
  if (!ctx.session) ctx.session = {};
  ctx.session.userName = name;
}

export function setUserPhone(ctx, phone) {
  if (!ctx.session) ctx.session = {};
  ctx.session.userPhone = phone;
}

export function getUserData(ctx) {
  return {
    name: ctx.session?.userName,
    phone: ctx.session?.userPhone,
    track: ctx.session?.track,
    status: ctx.session?.status
  };
}
```

## 📱 FAQ міні-додаток

### 1. Відкриття FAQ

#### Сценарій: Користувач натискає FAQ
```
Користувач: ❓ FAQ
Бот: 📚 Часті питання та відповіді:
      
      [Відкрити FAQ] - Завантажить міні-додаток
      з детальною інформацією
```

#### Код для відкриття FAQ:
```javascript
// src/handlers/shared/webappHandler.js
export async function openFAQ(ctx) {
  await ctx.reply('📚 FAQ система', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '📖 Відкрити FAQ',
          web_app: { url: 'https://your-domain.com/faq-mini-app.html' }
        }
      ]]
    }
  });
}
```

### 2. FAQ міні-додаток HTML
```html
<!-- public/faq-mini-app.html -->
<!DOCTYPE html>
<html>
<head>
    <title>SkillKlan FAQ</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <link rel="stylesheet" href="faq-mini-app.css">
</head>
<body>
    <div class="faq-container">
        <h1>❓ Часті питання</h1>
        
        <div class="faq-item">
            <h3>Як почати навчання?</h3>
            <p>Відправте /start та слідуйте інструкціям бота</p>
        </div>
        
        <div class="faq-item">
            <h3>Скільки коштує навчання?</h3>
            <p>Перше заняття безкоштовне. Деталі у менеджера</p>
        </div>
    </div>
    
    <script src="faq-mini-app.js"></script>
</body>
</html>
```

## 🚀 Розширені можливості

### 1. Webhook для відстеження прогресу

#### Налаштування webhook
```javascript
// src/utils/webhook.js
export async function setupWebhook(bot, url) {
  try {
    await bot.telegram.setWebhook(url);
    console.log('Webhook встановлено:', url);
  } catch (error) {
    console.error('Помилка встановлення webhook:', error);
  }
}
```

#### Обробка webhook подій
```javascript
// src/middleware/webhookHandler.js
export function handleWebhook() {
  return async (ctx, next) => {
    // Логування події
    logger.info('Webhook event', {
      userId: ctx.from?.id,
      action: ctx.message?.text || ctx.callbackQuery?.data,
      timestamp: new Date().toISOString()
    });
    
    await next();
  };
}
```

### 2. Статистика користувачів

#### Збір статистики
```javascript
// src/utils/analytics.js
export class UserAnalytics {
  constructor() {
    this.stats = {
      totalUsers: 0,
      activeUsers: 0,
      trackDistribution: {
        QA: 0,
        BA: 0,
        Backend: 0
      }
    };
  }
  
  trackUserAction(userId, action, track) {
    // Збір статистики по діях користувачів
    if (track) {
      this.stats.trackDistribution[track]++;
    }
  }
  
  getStats() {
    return this.stats;
  }
}
```

### 3. Автоматичні нагадування

#### Система нагадувань
```javascript
// src/utils/reminders.js
export class ReminderSystem {
  constructor() {
    this.reminders = new Map();
  }
  
  scheduleReminder(userId, message, delay) {
    const reminder = setTimeout(() => {
      this.sendReminder(userId, message);
    }, delay);
    
    this.reminders.set(userId, reminder);
  }
  
  async sendReminder(userId, message) {
    try {
      await bot.telegram.sendMessage(userId, message);
    } catch (error) {
      logger.error('Помилка відправки нагадування:', error);
    }
  }
}
```

## 🧪 Тестування

### 1. Unit тест для handler
```javascript
// tests/unit/handlers/qaHandler.test.js
import { jest } from '@jest/globals';
import qaHandler from '../../../src/handlers/qa/qaHandler.js';

describe('QA Handler', () => {
  it('should set QA track and send intro message', async () => {
    const mockCtx = {
      session: {},
      reply: jest.fn()
    };
    
    await qaHandler(mockCtx);
    
    expect(mockCtx.session.track).toBe('QA');
    expect(mockCtx.reply).toHaveBeenCalled();
  });
});
```

### 2. Integration тест
```javascript
// tests/integration/botFlow.test.js
import { Telegraf } from 'telegraf';

describe('Bot Flow Integration', () => {
  let bot;
  
  beforeEach(() => {
    bot = new Telegraf('test-token');
    // Налаштування тестового бота
  });
  
  it('should complete full registration flow', async () => {
    // Тестування повного flow реєстрації
  });
});
```

## 🔍 Діагностика та дебаг

### 1. Логування дій користувача
```javascript
// src/middleware/logging.js
export function userActionLogger() {
  return async (ctx, next) => {
    const startTime = Date.now();
    
    await next();
    
    const duration = Date.now() - startTime;
    
    logger.info('User action', {
      userId: ctx.from?.id,
      username: ctx.from?.username,
      action: ctx.message?.text || ctx.callbackQuery?.data,
      duration,
      timestamp: new Date().toISOString()
    });
  };
}
```

### 2. Перевірка стану бота
```javascript
// src/utils/healthCheck.js
export async function healthCheck() {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    activeUsers: getActiveUsersCount(),
    botStatus: await checkBotStatus()
  };
  
  return health;
}
```

## 📊 Моніторинг

### 1. Метрики продуктивності
```javascript
// src/utils/metrics.js
export class PerformanceMetrics {
  constructor() {
    this.responseTimes = [];
    this.errorCount = 0;
    this.requestCount = 0;
  }
  
  recordResponseTime(time) {
    this.responseTimes.push(time);
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }
  
  getAverageResponseTime() {
    if (this.responseTimes.length === 0) return 0;
    return this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }
}
```

### 2. Експорт метрик
```javascript
// src/server.js
app.get('/metrics', (req, res) => {
  const metrics = {
    performance: performanceMetrics.getStats(),
    users: userAnalytics.getStats(),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  };
  
  res.json(metrics);
});
```

---

## 🎯 Швидкі команди для тестування

### Локальне тестування
```bash
# Запуск бота
npm run dev

# Тестування в Telegram
# Знайдіть бота та відправте /start
```

### Перевірка статусу
```bash
# Валідація конфігурації
npm run validate

# Перевірка токена
npm run check-token

# Health check
curl http://localhost:3000/health
```

### Логи та діагностика
```bash
# PM2 логи
pm2 logs skillklan-bot

# Перевірка процесів
pm2 status

# Перезапуск
pm2 restart skillklan-bot
```

---

**💡 Порада:** Почніть з простих сценаріїв та поступово додавайте складнішу функціональність. Тестуйте кожну нову функцію в Telegram перед розгортанням в продакшн!

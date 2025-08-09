import { Telegraf, session } from 'telegraf';

// 🔧 Централізована конфігурація з валідацією токена
import { BOT_TOKEN, config, logEnvironmentInfo } from './config/environment.js';
import { 
  TokenErrorHandler, 
  RetryManager, 
  setupGlobalErrorHandling 
} from './config/errorHandler.js';

// Handlers
import startHandler from './handlers/startHandler.js';
import qaHandler from './handlers/qa/qaHandler.js';
import baHandler from './handlers/ba/baHandler.js';
import backendHandler from './handlers/backend/backendHandler.js';
import checkContactData from './middleware/checkContactData.js';
import requestPDF from './handlers/shared/requestPDF.js';
import changeDirection from './handlers/shared/changeDirection.js';
import { faqQA, faqBA, faqBackend, closeFaq } from './handlers/shared/faqHandler.js';
import bookInterview from './handlers/shared/bookInterview.js';

// 🛡️ Налаштування глобальної обробки помилок
setupGlobalErrorHandling();

// 🤖 Створення бота з безпечним токеном
const bot = new Telegraf(BOT_TOKEN);

// Ініціалізація сесії
bot.use(session({ defaultSession: () => ({ tags: {} }) }));

// Команда /start
bot.start(startHandler);

// Основні напрями
bot.hears('Тестування', qaHandler);
bot.hears('Бізнес аналітика', baHandler);
bot.hears('Backend', backendHandler);

bot.on('text', checkContactData);
bot.on('callback_query', checkContactData);
bot.on('contact', checkContactData);

// Callback actions
bot.action('get_test_task', requestPDF);
bot.action('change_direction', changeDirection);
bot.action('faq_qa', faqQA);
bot.action('faq_ba', faqBA);
bot.action('faq_backend', faqBackend);
bot.action('close_faq', closeFaq);
bot.action('book_interview', bookInterview);

// 🚀 Безпечний запуск бота з обробкою помилок
async function startBot() {
  try {
    // Показуємо інформацію про конфігурацію
    logEnvironmentInfo();
    
    // Запускаємо бота з retry механізмом
    await RetryManager.withRetry(async () => {
      if (config.webhook.enabled) {
        // Продакшн режим з webhook
        await bot.launch({
          webhook: {
            domain: config.webhook.url,
            port: config.webhook.port
          }
        });
        console.log(`🌐 Бот запущено з webhook: ${config.webhook.url}:${config.webhook.port}`);
      } else {
        // Режим розробки з polling
        await bot.launch();
        console.log('🤖 SkillKlan бот запущено (polling mode)');
      }
    });

    console.log('✅ Бот успішно запущено та готовий до роботи!\n');
    
  } catch (error) {
    // Обробка різних типів помилок
    if (error.response?.error_code === 401) {
      TokenErrorHandler.handleAuthError(error);
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      TokenErrorHandler.handleNetworkError(error);
    } else {
      TokenErrorHandler.handleStartupError(error);
    }
  }
}

// Запуск бота
startBot();
/**
 * 🔧 Централізована система конфігурації
 * DRY принцип: Одне місце для всіх налаштувань середовища
 */

import dotenv from 'dotenv';

// Завантажуємо змінні середовища
dotenv.config();

/**
 * 🔐 Безпечне отримання та валідація токена
 */
class TokenManager {
  static #instance = null;
  #token = null;
  #isValidated = false;

  constructor() {
    if (TokenManager.#instance) {
      return TokenManager.#instance;
    }
    TokenManager.#instance = this;
  }

  /**
   * Отримання токена з валідацією (Singleton)
   */
  getToken() {
    if (this.#isValidated && this.#token) {
      return this.#token;
    }

    this.#token = this.#loadAndValidateToken();
    this.#isValidated = true;
    return this.#token;
  }

  /**
   * Завантаження та валідація токена
   */
  #loadAndValidateToken() {
    const token = process.env.BOT_TOKEN;
    
    // Перевірка наявності
    if (!token) {
      this.#throwTokenError(
        'BOT_TOKEN не знайдено!',
        [
          '💡 Рішення:',
          '1. Створи .env файл: cp .env.example .env',
          '2. Додай токен від @BotFather',
          '3. Або встанови змінну середовища: export BOT_TOKEN=your_token'
        ]
      );
    }

    // Перевірка формату
    const tokenPattern = /^\d{8,10}:[A-Za-z0-9_-]{35}$/;
    if (!tokenPattern.test(token)) {
      this.#throwTokenError(
        'Неправильний формат токена!',
        [
          '💡 Правильний формат: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
          '📖 Отримати токен: https://t.me/BotFather'
        ]
      );
    }

    return token;
  }

  /**
   * Виведення помилки з деталями
   */
  #throwTokenError(message, solutions = []) {
    console.error(`\n❌ ${message}`);
    solutions.forEach(solution => console.error(`   ${solution}`));
    console.error('\n📋 Детальна інструкція: README.md\n');
    process.exit(1);
  }

  /**
   * Маскування токена для логів
   */
  getMaskedToken() {
    if (!this.#token) return 'NOT_SET';
    const parts = this.#token.split(':');
    return `${parts[0]}:${'*'.repeat(20)}...${parts[1]?.slice(-4) || ''}`;
  }
}

/**
 * 🌍 Менеджер конфігурації середовища
 */
class EnvironmentConfig {
  static #instance = null;
  #config = null;

  constructor() {
    if (EnvironmentConfig.#instance) {
      return EnvironmentConfig.#instance;
    }
    EnvironmentConfig.#instance = this;
    this.#initConfig();
  }

  #initConfig() {
    const tokenManager = new TokenManager();
    
    this.#config = {
      // 🔑 Токен (з валідацією)
      bot: {
        token: tokenManager.getToken(),
        maskedToken: tokenManager.getMaskedToken()
      },

      // 🌍 Середовище
      env: {
        nodeEnv: process.env.NODE_ENV || 'development',
        isDevelopment: process.env.NODE_ENV !== 'production',
        isProduction: process.env.NODE_ENV === 'production'
      },

      // 📝 Логування
      logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableDebug: process.env.DEBUG === 'true'
      },

      // 🔗 Webhook (продакшн)
      webhook: {
        url: process.env.WEBHOOK_URL,
        port: this.#parsePort(process.env.WEBHOOK_PORT || process.env.PORT),
        enabled: !!process.env.WEBHOOK_URL
      },

      // ⚙️ Додаткові налаштування
      app: {
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 3600000, // 1 година
        maxRetries: parseInt(process.env.MAX_RETRIES) || 3
      }
    };
  }

  #parsePort(port) {
    const parsed = parseInt(port);
    return isNaN(parsed) ? 3000 : parsed;
  }

  /**
   * Отримання конфігурації
   */
  get() {
    return this.#config;
  }

  /**
   * Отримання конкретних секцій
   */
  getBot() { return this.#config.bot; }
  getEnv() { return this.#config.env; }
  getLogging() { return this.#config.logging; }
  getWebhook() { return this.#config.webhook; }
  getApp() { return this.#config.app; }
}

/**
 * 📊 Логування конфігурації (безпечно)
 */
export function logEnvironmentInfo() {
  const config = new EnvironmentConfig().get();
  
  console.log('\n🔧 Конфігурація завантажена:');
  console.log(`   Середовище: ${config.env.nodeEnv}`);
  console.log(`   Логування: ${config.logging.level}`);
  console.log(`   Токен: ${config.bot.maskedToken}`);
  
  if (config.webhook.enabled) {
    console.log(`   Webhook: ${config.webhook.url}:${config.webhook.port}`);
  } else {
    console.log('   Режим: Polling (розробка)');
  }
  
  if (config.env.isDevelopment) {
    console.log('   Debug: Увімкнено додаткове логування');
  }
  console.log('');
}

/**
 * 🎯 Основний експорт - Singleton конфігурації
 */
const environmentConfig = new EnvironmentConfig();
export const config = environmentConfig.get();

// Експорт окремих менеджерів для специфічних потреб
export { TokenManager, EnvironmentConfig };

// Швидкий доступ до найчастіше використовуваних значень
export const {
  bot: { token: BOT_TOKEN },
  env: { isDevelopment, isProduction },
  logging: { level: LOG_LEVEL }
} = config;

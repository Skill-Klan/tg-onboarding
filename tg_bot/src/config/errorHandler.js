/**
 * 🚨 Централізована обробка помилок
 * DRY принцип: Одне місце для всієї логіки обробки помилок
 */

import { config } from './environment.js';

/**
 * 🔐 Обробник помилок токена
 */
export class TokenErrorHandler {
  /**
   * Обробка помилок авторизації
   */
  static handleAuthError(error) {
    console.error('\n🚨 Помилка авторизації бота:');
    
    if (error.response?.error_code === 401) {
      console.error('❌ Неправильний токен бота');
      console.error('💡 Рішення:');
      console.error('   1. Перевір токен в .env файлі');
      console.error('   2. Переконайся що токен отриманий від @BotFather');
      console.error('   3. Токен має формат: 1234567890:ABCdefGHI...');
    } else if (error.response?.error_code === 404) {
      console.error('❌ Бот не знайдений');
      console.error('💡 Можливі причини:');
      console.error('   1. Токен застарілий або видалений');
      console.error('   2. Бот був деактивований в @BotFather');
    } else {
      console.error(`❌ Помилка: ${error.message}`);
    }
    
    console.error('\n📋 Детальна інструкція: README.md\n');
    process.exit(1);
  }

  /**
   * Обробка мережевих помилок
   */
  static handleNetworkError(error) {
    console.error('\n🌐 Мережева помилка:');
    console.error(`❌ ${error.message}`);
    console.error('💡 Перевір інтернет-з\'єднання та спробуй ще раз\n');
    
    if (config.env.isDevelopment) {
      console.error('🔍 Детальна помилка:', error);
    }
  }

  /**
   * Обробка помилок запуску
   */
  static handleStartupError(error) {
    console.error('\n⚠️ Помилка запуску бота:');
    console.error(`❌ ${error.message}`);
    
    if (error.code === 'EADDRINUSE') {
      console.error('💡 Порт вже зайнятий. Змініть WEBHOOK_PORT в .env');
    }
    
    console.error('');
    process.exit(1);
  }
}

/**
 * 🔄 Система retry для нестабільних з'єднань
 */
export class RetryManager {
  static async withRetry(operation, maxRetries = config.app.maxRetries) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff
        console.warn(`⚠️ Спроба ${attempt}/${maxRetries} не вдалась. Повтор через ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

/**
 * 🛡️ Глобальний обробник неочікуваних помилок
 */
export function setupGlobalErrorHandling() {
  // Обробка неперехоплених помилок
  process.on('uncaughtException', (error) => {
    console.error('\n💥 Критична помилка:');
    console.error(error);
    console.error('\n🔄 Перезапуск бота...\n');
    process.exit(1);
  });

  // Обробка неперехоплених промісів
  process.on('unhandledRejection', (reason, promise) => {
    console.error('\n⚠️ Неперехоплена помилка проміса:', reason);
    
    if (config.env.isDevelopment) {
      console.error('🔍 Проміс:', promise);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Отримано сигнал завершення. Зупинка бота...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n👋 Отримано сигнал термінації. Зупинка бота...');
    process.exit(0);
  });
}

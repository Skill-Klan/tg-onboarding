/**
 * 🤖 Тестовий скрипт для перевірки бота з Web App
 */

import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './src/config/environment.js';

console.log('🤖 Тестування бота з Web App...\n');

// Створюємо тестовий екземпляр бота
const bot = new Telegraf(BOT_TOKEN);

// Тестуємо Web App кнопку
console.log('📱 Тестування Web App кнопки...');
const webAppButton = {
  text: '📚 FAQ',
  web_app: {
    url: 'http://localhost:3000/faq.html'
  }
};

console.log('   Web App кнопка створена:', webAppButton);

// Тестуємо відправку повідомлення
console.log('\n📤 Тестування відправки повідомлення...');

try {
  // Створюємо тестовий контекст
  const testContext = {
    from: { id: 123456789, username: 'test_user' },
    reply: async (text, options) => {
      console.log('   ✅ Повідомлення відправлено:');
      console.log(`      Текст: ${text}`);
      console.log(`      Опції:`, options);
      return { message_id: 1 };
    }
  };

  // Імітуємо обробку FAQ команди
  console.log('   🧪 Імітація обробки FAQ команди...');
  
  // Тут можна додати тестування реальних хендлерів
  console.log('   ✅ Тестовий контекст створено');
  
} catch (error) {
  console.log(`   ❌ Помилка: ${error.message}`);
}

console.log('\n✅ Тестування завершено!');
console.log('\n💡 Для повного тестування:');
console.log('   1. Відправте боту команду /start');
console.log('   2. Натисніть "📚 FAQ"');
console.log('   3. Перевірте, чи відкривається Web App');

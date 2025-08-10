/**
 * 🧪 Тестовий скрипт для FAQ Web App
 * Перевіряє всі компоненти FAQ Mini App
 */

import { config } from './src/config/environment.js';
import { getFAQWebAppButton, getFAQFallbackURL } from './src/config/webapp.js';

console.log('🧪 Тестування FAQ Web App...\n');

// Перевірка конфігурації
console.log('📋 Конфігурація:');
console.log(`   BOT_TOKEN: ${config.bot.maskedToken}`);
console.log(`   NODE_ENV: ${config.env.nodeEnv}`);
console.log(`   LOG_LEVEL: ${config.logging.level}`);

// Перевірка Web App налаштувань
console.log('\n🌐 Web App налаштування:');
console.log(`   FAQ_WEBAPP_URL: ${process.env.FAQ_WEBAPP_URL || 'не встановлено'}`);
console.log(`   FAQ_FALLBACK_URL: ${process.env.FAQ_FALLBACK_URL || 'не встановлено'}`);

// Перевірка функцій
console.log('\n🔧 Функції Web App:');
const webAppButton = getFAQWebAppButton();
console.log(`   Web App кнопка:`, webAppButton);

const fallbackUrl = getFAQFallbackURL();
console.log(`   Fallback URL: ${fallbackUrl}`);

// Перевірка доступності сервера
console.log('\n🌐 Перевірка доступності сервера...');
try {
  const response = await fetch('http://localhost:3000/faq.html');
  if (response.ok) {
    console.log('   ✅ FAQ сервер доступний');
    console.log(`   📱 FAQ доступний за адресою: http://localhost:3000/faq.html`);
  } else {
    console.log(`   ❌ Помилка сервера: ${response.status}`);
  }
} catch (error) {
  console.log(`   ❌ Сервер недоступний: ${error.message}`);
  console.log('   💡 Запустіть сервер: npm run server');
}

console.log('\n✅ Тестування завершено!');

import { getFAQWebAppButton, getFAQFallbackURL } from './src/config/webapp.js';

console.log('🧪 Тестування FAQ конфігурації...\n');

// Тест 1: Перевірка Web App кнопки
console.log('1️⃣ Тест Web App кнопки:');
const button = getFAQWebAppButton();
console.log('   Текст кнопки:', button.text);
console.log('   URL:', button.web_app.url);
console.log('   ✅ Кнопка створена успішно\n');

// Тест 2: Перевірка fallback URL
console.log('2️⃣ Тест fallback URL:');
const fallbackUrl = getFAQFallbackURL();
console.log('   Fallback URL:', fallbackUrl);
console.log('   ✅ Fallback URL отримано успішно\n');

// Тест 3: Перевірка доступності сервера
console.log('3️⃣ Тест доступності сервера:');
try {
  const response = await fetch('http://localhost:3000/');
  if (response.ok) {
    console.log('   🌐 Сервер доступний на порту 3000');
    console.log('   ✅ Статус:', response.status);
  } else {
    console.log('   ⚠️ Сервер відповідає з помилкою:', response.status);
  }
} catch (error) {
  console.log('   ❌ Помилка підключення до сервера:', error.message);
  console.log('   💡 Переконайтеся, що сервер запущено: npm run server');
}
console.log('');

// Тест 4: Перевірка FAQ HTML
console.log('4️⃣ Тест FAQ HTML:');
try {
  const response = await fetch('http://localhost:3000/faq.html');
  if (response.ok) {
    const html = await response.text();
    if (html.includes('📚 Часто запитують')) {
      console.log('   📱 FAQ HTML завантажено успішно');
      console.log('   ✅ Заголовок знайдено');
    } else {
      console.log('   ⚠️ FAQ HTML не містить очікуваний контент');
    }
  } else {
    console.log('   ❌ Помилка завантаження FAQ HTML:', response.status);
  }
} catch (error) {
  console.log('   ❌ Помилка підключення до FAQ:', error.message);
}
console.log('');

// Тест 5: Перевірка структури даних
console.log('5️⃣ Тест структури даних:');
import faqTexts from './src/texts/faq.js';

if (faqTexts.sections && faqTexts.questions && faqTexts.ui) {
  console.log('   📚 Секції:', Object.keys(faqTexts.sections).length);
  console.log('   ❓ Питання:', Object.keys(faqTexts.questions).length);
  console.log('   🎨 UI елементи:', Object.keys(faqTexts.ui).length);
  console.log('   ✅ Структура даних коректна');
} else {
  console.log('   ❌ Структура даних неправильна');
}
console.log('');

console.log('🎯 Результати тестування:');
console.log('   🌐 Веб-сервер: http://localhost:3000/');
console.log('   📱 FAQ Web App: http://localhost:3000/faq.html');
console.log('   🤖 Бот: npm run dev');
console.log('   📚 Документація: FAQ_IMPLEMENTATION.md');
console.log('');
console.log('💡 Для тестування FAQ у боті:');
console.log('   1. Запустіть бота: npm run dev');
console.log('   2. Відправте команду /start');
console.log('   3. Натисніть кнопку "📚 FAQ"');
console.log('   4. Перевірте, чи відкривається Web App');

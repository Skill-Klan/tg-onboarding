import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Завантажуємо змінні середовища
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Тестова команда
bot.command('test', (ctx) => {
  console.log('✅ Тестова команда отримана!');
  ctx.reply('🤖 Бот працює! Тест успішний.');
});

// Тестова команда для перевірки FAQ
bot.command('faq_test', (ctx) => {
  console.log('✅ FAQ тест отримано!');
  
  // Тестуємо різні стани
  const hasContact = ctx.session?.name && ctx.session?.phone;
  const state = hasContact ? 'contact_given' : 'contact_not_given';
  
  console.log(`📊 Стан користувача: ${state}`);
  
  ctx.reply(`🧪 FAQ Тест\n\n📊 Стан: ${state}\n👤 Ім'я: ${ctx.session?.name || 'Не вказано'}\n📱 Телефон: ${ctx.session?.phone || 'Не вказано'}`);
});

// Запуск бота
bot.launch()
  .then(() => {
    console.log('🤖 Тестовий бот запущений!');
    console.log('📱 Відправ команди /test або /faq_test в Telegram');
  })
  .catch((error) => {
    console.error('❌ Помилка запуску тестового бота:', error.message);
  });

// Обробка завершення
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

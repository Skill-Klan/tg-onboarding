import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Завантажуємо змінні середовища
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log('🔑 Токен:', BOT_TOKEN ? `${BOT_TOKEN.substring(0, 10)}...` : 'НЕ ЗНАЙДЕНО');

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не знайдено в .env файлі');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔄 Тестуємо підключення до Telegram API...');
    
    const bot = new Telegraf(BOT_TOKEN);
    
    // Отримуємо інформацію про бота
    const botInfo = await bot.telegram.getMe();
    console.log('✅ Підключення успішне!');
    console.log('🤖 Інформація про бота:');
    console.log(`   ID: ${botInfo.id}`);
    console.log(`   Ім'я: ${botInfo.first_name}`);
    console.log(`   Username: @${botInfo.username}`);
    console.log(`   Може читати групи: ${botInfo.can_read_all_group_messages}`);
    console.log(`   Може приєднатися до груп: ${botInfo.can_join_groups}`);
    
    // Зупиняємо бота
    bot.stop();
    
  } catch (error) {
    console.error('❌ Помилка підключення:');
    console.error('   Код:', error.response?.error_code);
    console.error('   Опис:', error.response?.description);
    console.error('   Повідомлення:', error.message);
    
    if (error.response?.error_code === 401) {
      console.error('\n💡 Це означає, що токен неправильний або бот був видалений');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Проблема з мережею - перевірте інтернет з\'єднання');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Telegram API недоступне - можливо, блокування');
    }
  }
}

testConnection();

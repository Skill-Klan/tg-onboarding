import { Telegraf, session } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

import startHandler from './handlers/startHandler.js';
import qaHandler from './handlers/qa/qaHandler.js';
import baHandler from './handlers/ba/baHandler.js';
import backendHandler from './handlers/backend/backendHandler.js';
import checkContactData from './middleware/checkContactData.js';
import requestPDF from './handlers/shared/requestPDF.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.action('get_test_task', requestPDF);

bot.launch();
console.log('🤖 SkillKlan бот запущено');
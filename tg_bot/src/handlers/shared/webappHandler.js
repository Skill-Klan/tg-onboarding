import { getFAQWebAppButton, getFAQFallbackURL } from '../../config/webapp.js';
import { logger } from '../../utils/logger.js';

/**
 * Хендлер для відкриття FAQ Web App
 * @param {Object} ctx - контекст Telegraf
 */
export async function handleFAQWebApp(ctx) {
  try {
    // Визначаємо стан користувача для аналітики
    const hasContact = ctx.session?.name && ctx.session?.phone;
    const state = hasContact ? 'contact_given' : 'contact_not_given';
    
    // Аналітика: FAQ_Click {state}
    logger.info('FAQ_Click', { 
      user_id: ctx.from.id,
      username: ctx.from.username,
      state: state,
      has_name: !!ctx.session?.name,
      has_phone: !!ctx.session?.phone
    });
    
    // Перевіряємо, чи підтримує клієнт Web App
    if (ctx.from && ctx.from.is_premium !== undefined) {
      // Сучасний клієнт - відкриваємо Web App прямо в Telegram
      await ctx.reply('📚 <b>Часто запитують</b>\n\nВідкриваю FAQ у зручному форматі...', {
        parse_mode: 'HTML'
      });
      
      // Аналітика: FAQ_WebApp_Opened
      logger.info('FAQ_WebApp_Opened', { 
        user_id: ctx.from.id,
        username: ctx.from.username,
        state: state,
        is_premium: ctx.from.is_premium
      });
      
      // Відправляємо Web App кнопку, яка відкриється прямо в Telegram
      await ctx.reply('Натисніть кнопку нижче, щоб відкрити FAQ:', {
        reply_markup: {
          inline_keyboard: [[getFAQWebAppButton()]]
        }
      });
      
    } else {
      // Старий клієнт - fallback на веб-версію
      const fallbackUrl = getFAQFallbackURL();
      
      await ctx.reply(
        `📚 <b>Часто запитують</b>\n\n` +
        `Ваш клієнт не підтримує вбудований FAQ.\n\n` +
        `🌐 Відкрийте FAQ у браузері:\n` +
        `<a href="${fallbackUrl}">${fallbackUrl}</a>`, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
      
      // Аналітика: FAQ_Fallback_Used
      logger.info('FAQ_Fallback_Used', { 
        user_id: ctx.from.id,
        username: ctx.from.username,
        state: state,
        fallback_url: fallbackUrl
      });
    }
    
  } catch (error) {
    logger.error('Error opening FAQ Web App', { 
      user_id: ctx.from?.id,
      error: error.message 
    });
    
    // Fallback при помилці
    const fallbackUrl = getFAQFallbackURL();
    await ctx.reply(
      `❌ Помилка відкриття FAQ\n\n` +
      `🌐 Відкрийте FAQ у браузері:\n` +
      `<a href="${fallbackUrl}">${fallbackUrl}</a>`, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
  }
}

/**
 * Обробка подій з Web App
 * @param {Object} ctx - контекст Telegraf
 */
export async function handleWebAppData(ctx) {
  try {
    const webAppData = ctx.message?.web_app_data;
    
    if (webAppData) {
      // Аналітика: WebApp_Data_Received
      logger.info('WebApp_Data_Received', { 
        user_id: ctx.from.id,
        data: webAppData.data,
        button_text: webAppData.button_text
      });
      
      // Тут можна обробити дані з Web App
      // Наприклад, зберегти вибрані категорії або питання
      
      await ctx.reply('✅ Дані з FAQ збережено!', {
        reply_markup: {
          keyboard: [
            ['Тестування'],
            ['Бізнес аналітика'],
            ['Backend'],
            ['📚 FAQ']
          ],
          resize_keyboard: true
        }
      });
    }
    
  } catch (error) {
    logger.error('Error handling Web App data', { 
      user_id: ctx.from?.id,
      error: error.message 
    });
  }
}

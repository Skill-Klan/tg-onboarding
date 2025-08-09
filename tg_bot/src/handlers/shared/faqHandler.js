import { CALLBACK_DATA } from '../../utils/constants.js';

/**
 * Handlers для FAQ модальних вікон
 */

// Поки що заглушки для FAQ - контент буде додано пізніше
const FAQ_TEXTS = {
  QA: `
💬 <b>Часто запитують про QA (Тестування):</b>

❓ <i>FAQ контент буде додано пізніше</i>

Якщо у вас є питання, звертайтесь до наших менеджерів.
  `.trim(),
  
  BA: `
💬 <b>Часто запитують про BA (Бізнес аналітика):</b>

❓ <i>FAQ контент буде додано пізніше</i>

Якщо у вас є питання, звертайтесь до наших менеджерів.
  `.trim(),
  
  Backend: `
💬 <b>Часто запитують про Backend:</b>

❓ <i>FAQ контент буде додано пізніше</i>

Якщо у вас є питання, звертайтесь до наших менеджерів.
  `.trim()
};

export async function faqQA(ctx) {
  try {
    await ctx.reply(FAQ_TEXTS.QA, { 
      parse_mode: 'HTML',
              reply_markup: {
        inline_keyboard: [[
          { text: '✕ Закрити', callback_data: CALLBACK_DATA.CLOSE_FAQ }
        ]]
      }
    });
    await ctx.answerCbQuery();
  } catch (error) {
    console.error('Помилка FAQ QA:', error);
    await ctx.answerCbQuery('❌ Виникла помилка');
  }
}

export async function faqBA(ctx) {
  try {
    await ctx.reply(FAQ_TEXTS.BA, { 
      parse_mode: 'HTML',
              reply_markup: {
        inline_keyboard: [[
          { text: '✕ Закрити', callback_data: CALLBACK_DATA.CLOSE_FAQ }
        ]]
      }
    });
    await ctx.answerCbQuery();
  } catch (error) {
    console.error('Помилка FAQ BA:', error);
    await ctx.answerCbQuery('❌ Виникла помилка');
  }
}

export async function faqBackend(ctx) {
  try {
    await ctx.reply(FAQ_TEXTS.Backend, { 
      parse_mode: 'HTML',
              reply_markup: {
        inline_keyboard: [[
          { text: '✕ Закрити', callback_data: CALLBACK_DATA.CLOSE_FAQ }
        ]]
      }
    });
    await ctx.answerCbQuery();
  } catch (error) {
    console.error('Помилка FAQ Backend:', error);
    await ctx.answerCbQuery('❌ Виникла помилка');
  }
}

export async function closeFaq(ctx) {
  try {
    await ctx.deleteMessage();
    await ctx.answerCbQuery('✅ Закрито');
  } catch (error) {
    console.error('Помилка закриття FAQ:', error);
    await ctx.answerCbQuery();
  }
}

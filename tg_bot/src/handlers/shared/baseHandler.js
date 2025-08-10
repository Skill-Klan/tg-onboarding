import askName from './askName.js';
import askPhone from './askPhone.js';
import { setTrack } from '../../utils/tags.js';
import { getMainKeyboard } from '../../utils/keyboard.js';
import { AWAITING_STATES, KEYBOARD_BUTTONS } from '../../utils/constants.js';

/**
 * Базовий handler для всіх напрямків навчання
 * @param {Object} ctx - контекст Telegraf
 * @param {string} track - назва напрямку (QA, BA, Backend)
 * @param {Object} texts - тексти для конкретного напрямку
 */
export default async function baseHandler(ctx, track, texts) {
  // Встановлюємо напрямок
  setTrack(ctx, track);

  // Привітання з інформацією про напрямок
  await ctx.reply(texts.intro, {
    ...getMainKeyboard(),
    parse_mode: 'HTML'
  });

  // Якщо є всі дані → показуємо меню вибору напрямків
  if (ctx.session.name && ctx.session.phone) {
    ctx.session.start_DateTime = new Date().toISOString();
    
    return ctx.reply(
      `✅ Реєстрація успішна.\n\nОбери напрям, що тобі цікавий 👇`,
      {
        reply_markup: {
          keyboard: [
            [KEYBOARD_BUTTONS.TESTING],
            [KEYBOARD_BUTTONS.BUSINESS_ANALYTICS],
            [KEYBOARD_BUTTONS.BACKEND],
            [KEYBOARD_BUTTONS.FAQ]
          ],
          resize_keyboard: true
        },
        parse_mode: 'HTML'
      }
    );
  }

  // Якщо бракує даних → повідомляємо і запитуємо
  if (texts.missingData) {
    await ctx.reply(texts.missingData, { parse_mode: 'HTML' });
  }

  // Запитуємо відсутні дані
  if (!ctx.session.name) {
    ctx.session.awaiting = AWAITING_STATES.NAME;
    return askName(ctx);
  }

  if (!ctx.session.phone) {
    ctx.session.awaiting = AWAITING_STATES.PHONE;
    return askPhone(ctx);
  }
} 
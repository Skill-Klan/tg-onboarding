import commonTexts from '../texts/common.js';
import { KEYBOARD_BUTTONS } from '../utils/constants.js';
import { isDevelopment } from '../config/environment.js';

export default async (ctx) => {
  ctx.session = { tags: {} }; // повне очищення
  const name = ctx.from.first_name || 'друже';
  const now = new Date();
  ctx.session.tags.start_date = now.toLocaleDateString('uk-UA');
  ctx.session.tags.start_time = now.toLocaleTimeString('uk-UA');

  // Якщо це локальне тестування, показуємо повідомлення про це першим
  if (isDevelopment) {
    await ctx.reply(commonTexts.localTesting, { parse_mode: 'HTML' });
  }

  // Привітання без запиту реєстрації
  ctx.reply(
    commonTexts.startGreeting(name),
    {
      reply_markup: {
        keyboard: [
          [KEYBOARD_BUTTONS.TESTING],
          [KEYBOARD_BUTTONS.BUSINESS_ANALYTICS],
          [KEYBOARD_BUTTONS.BACKEND]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      },
      parse_mode: 'HTML'
    }
  );
};
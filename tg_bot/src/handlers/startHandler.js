import commonTexts from '../texts/common.js';
import askName from './shared/askName.js';
import { KEYBOARD_BUTTONS } from '../utils/constants.js';

export default (ctx) => {
  ctx.session = { tags: {} }; // повне очищення
  const name = ctx.from.first_name || 'друже';
  const now = new Date();
  ctx.session.tags.start_date = now.toLocaleDateString('uk-UA');
  ctx.session.tags.start_time = now.toLocaleTimeString('uk-UA');

  // Привітання + запрошення до реєстрації
  ctx.reply(
    `${commonTexts.startGreeting(name)}\n\nЯкщо цікаво — пройди коротку реєстрацію.`,
    {
      reply_markup: {
        keyboard: [
          [KEYBOARD_BUTTONS.TESTING],
          [KEYBOARD_BUTTONS.BUSINESS_ANALYTICS],
          [KEYBOARD_BUTTONS.BACKEND]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      },
      parse_mode: 'HTML'
    }
  );

  // Після привітання одразу запитуємо ім'я
  ctx.session.awaiting = 'name';
  askName(ctx);
};
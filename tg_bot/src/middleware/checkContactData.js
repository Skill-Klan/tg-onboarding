import askPhone from '../handlers/shared/askPhone.js';
import { sendWebhook } from '../utils/webhook.js';
import { AWAITING_STATES, CALLBACK_DATA, KEYBOARD_BUTTONS } from '../utils/constants.js';

function canProceed(ctx) {
  return ctx.session.name && ctx.session.phone && ctx.session.tags?.track;
}

function showMainMenu(ctx) {
  return ctx.reply(
    `✅ Реєстрація успішна.\n\nОбери напрям, що тобі цікавий 👇`,
    {
      reply_markup: {
        keyboard: [
          [KEYBOARD_BUTTONS.TESTING],
          [KEYBOARD_BUTTONS.BUSINESS_ANALYTICS],
          [KEYBOARD_BUTTONS.BACKEND]
        ],
        resize_keyboard: true
      },
      parse_mode: 'HTML'
    }
  );
}

export default async function (ctx, next) {
  const awaiting = ctx.session.awaiting;
  const text = ctx.message?.text?.trim();
  const contact = ctx.message?.contact;

  // 🟢 Обробка імені
  if (awaiting === AWAITING_STATES.NAME && text) {
    ctx.session.name = text;
    ctx.session.awaiting = null;

    if (!ctx.session.phone) {
      ctx.session.awaiting = AWAITING_STATES.PHONE;
      return askPhone(ctx);
    }

    // Після введення імені завжди показуємо меню вибору напрямків
    return showMainMenu(ctx);
  }

  // 🟢 Обробка номера через кнопку
  if (contact?.phone_number) {
    ctx.session.phone = contact.phone_number;
    ctx.session.awaiting = null;

    if (!ctx.session.name) {
      ctx.session.awaiting = AWAITING_STATES.NAME;
      return ctx.reply('Ще потрібно ввести ім\'я.', { parse_mode: 'HTML' });
    }

    // Після надсилання контакту завжди показуємо меню вибору напрямків
    return showMainMenu(ctx);
  }

  // 🟡 Обробка номера текстом
  if (awaiting === AWAITING_STATES.PHONE && text) {
    const digits = text.replace(/\D/g, '');
    if (digits.length < 10) {
      return ctx.reply(
        '⚠️ Це схоже не на номер телефону. Введи, будь ласка, уважніше (мінімум 10 цифр).',
        { parse_mode: 'HTML' }
      );
    }

    ctx.session.phone = text;
    ctx.session.awaiting = null;

    // Після введення номера текстом завжди показуємо меню вибору напрямків
    return showMainMenu(ctx);
  }

  // 🔵 Обробка кнопки «Я готовий здати тестове»
  if (
    awaiting === AWAITING_STATES.READY_TO_SUBMIT &&
    ctx.callbackQuery?.data === CALLBACK_DATA.SUBMIT_READY
  ) {
    ctx.session.awaiting = null;

    await ctx.answerCbQuery();
    await ctx.reply('✅ Ми передали твої дані менеджеру. Очікуй дзвінка.', {
      reply_markup: { remove_keyboard: true },
      parse_mode: 'HTML'
    });
    return sendWebhook(ctx);
  }

  return next();
}
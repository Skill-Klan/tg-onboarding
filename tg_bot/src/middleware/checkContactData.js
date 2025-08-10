import askPhone from '../handlers/shared/askPhone.js';
import sendPDF from '../handlers/shared/sendPDF.js';
import { sendWebhook } from '../utils/webhook.js';
import { AWAITING_STATES, CALLBACK_DATA, KEYBOARD_BUTTONS } from '../utils/constants.js';

function canProceed(ctx) {
  return ctx.session.name && ctx.session.phone && ctx.session.tags?.track;
}

// Функція showRegistrationSuccess видалена, оскільки повідомлення більше не потрібне

// Функція showMainMenu видалена, оскільки меню напрямків тепер постійно відображається

async function executePendingAction(ctx) {
  const pendingAction = ctx.session.pendingAction;
  if (!pendingAction) return null;

  // Очищаємо pending action
  delete ctx.session.pendingAction;

  switch (pendingAction) {
    case 'request_pdf':
      const track = ctx.session.tags?.track;
      if (track) {
        const now = new Date();
        ctx.session.tags.start_datetime = now.toISOString();
        return sendPDF(ctx, track);
      }
      break;
    case 'book_interview':
      // Показуємо повідомлення про успішне бронювання
      return ctx.reply(
        `📅 <b>Заявка на інтерв'ю прийнята!</b>

Ваші дані:
👤 Ім'я: ${ctx.session.name}
📱 Телефон: ${ctx.session.phone}
💻 Напрям: Backend

Наші менеджери зв'яжуться з вами найближчим часом для узгодження зручного часу інтерв'ю.

Дякуємо за ваш інтерес до SkillKlan! 🚀`,
        { parse_mode: 'HTML' }
      );
      break;
  }
  return null;
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

    // Якщо всі дані є, виконуємо pending action
    const pendingResult = await executePendingAction(ctx);
    if (pendingResult) return pendingResult;
    
    // Меню напрямків вже постійно відображається, тому не потрібно додаткове повідомлення
    return;
  }

  // 🟢 Обробка номера через кнопку
  if (contact?.phone_number) {
    ctx.session.phone = contact.phone_number;
    ctx.session.awaiting = null;

    if (!ctx.session.name) {
      ctx.session.awaiting = AWAITING_STATES.NAME;
      return ctx.reply('Ще потрібно ввести ім\'я.', { parse_mode: 'HTML' });
    }

    // Якщо всі дані є, виконуємо pending action
    const pendingResult = await executePendingAction(ctx);
    if (pendingResult) return pendingResult;
    
    // Меню напрямків вже постійно відображається, тому не потрібно додаткове повідомлення
    return;
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

    // Якщо всі дані є, виконуємо pending action
    const pendingResult = await executePendingAction(ctx);
    if (pendingResult) return pendingResult;
    
    // Меню напрямків вже постійно відображається, тому не потрібно додаткове повідомлення
    return;
  }

  // 🔵 Обробка кнопки «Я готовий здати тестове»
  if (
    awaiting === AWAITING_STATES.READY_TO_SUBMIT &&
    ctx.callbackQuery?.data === CALLBACK_DATA.SUBMIT_READY
  ) {
    ctx.session.awaiting = null;

    await ctx.answerCbQuery();
    return sendWebhook(ctx);
  }

  return next();
}
import sendPDF from './sendPDF.js';
import askName from './askName.js';
import askPhone from './askPhone.js';
import commonTexts from '../../texts/common.js';
import { AWAITING_STATES } from '../../utils/constants.js';

export default async function(ctx) {
  const track = ctx.session.tags?.track;

  if (!track) {
    return ctx.reply(commonTexts.noTrackSelected, { parse_mode: 'HTML' });
  }

  // Валідація: перевіряємо наявність контактних даних
  if (!ctx.session.name) {
    // Починаємо послідовний збір даних - спочатку ім'я
    ctx.session.awaiting = AWAITING_STATES.NAME;
    ctx.session.pendingAction = 'request_pdf'; // зберігаємо що потрібно зробити після збору даних
    await ctx.reply('📝 Для отримання тестового завдання потрібні контактні дані.\n\nДавайте знайомитися!', { parse_mode: 'HTML' });
    return askName(ctx);
  }

  if (!ctx.session.phone) {
    // Якщо ім'я є, але немає телефону
    ctx.session.awaiting = AWAITING_STATES.PHONE;
    ctx.session.pendingAction = 'request_pdf';
    await ctx.reply('📱 Тепер потрібен номер телефону для зв\'язку.', { parse_mode: 'HTML' });
    return askPhone(ctx);
  }

  // Якщо всі дані є - надсилаємо PDF
  const now = new Date();
  ctx.session.tags.start_datetime = now.toISOString();

  // Очищаємо pending action
  delete ctx.session.pendingAction;
  
  return sendPDF(ctx, track);
}
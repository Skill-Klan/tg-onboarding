import askName from './askName.js';
import askPhone from './askPhone.js';
import { AWAITING_STATES } from '../../utils/constants.js';

/**
 * Handler для бронювання інтерв'ю (Backend напрям)
 */
export default async function bookInterview(ctx) {
  try {
    // Валідація: перевіряємо наявність контактних даних
    if (!ctx.session.name) {
      // Починаємо послідовний збір даних - спочатку ім'я
      ctx.session.awaiting = AWAITING_STATES.NAME;
      ctx.session.pendingAction = 'book_interview'; // зберігаємо що потрібно зробити після збору даних
      await ctx.reply('📝 Для бронювання інтерв\'ю потрібні контактні дані.\n\nДавайте знайомитися!', { parse_mode: 'HTML' });
      await ctx.answerCbQuery('📝 Потрібні контактні дані');
      return askName(ctx);
    }

    if (!ctx.session.phone) {
      // Якщо ім'я є, але немає телефону
      ctx.session.awaiting = AWAITING_STATES.PHONE;
      ctx.session.pendingAction = 'book_interview';
      await ctx.reply('📱 Тепер потрібен номер телефону для зв\'язку.', { parse_mode: 'HTML' });
      await ctx.answerCbQuery('📱 Потрібен номер телефону');
      return askPhone(ctx);
    }

    // Якщо всі дані є - показуємо повідомлення про успішне бронювання
    await ctx.reply(
      `📅 <b>Заявка на інтерв'ю прийнята!</b>

Ваші дані:
👤 Ім'я: ${ctx.session.name}
📱 Телефон: ${ctx.session.phone}
💻 Напрям: Backend

Наші менеджери зв'яжуться з вами найближчим часом для узгодження зручного часу інтерв'ю.

Дякуємо за ваш інтерес до SkillKlan! 🚀`,
      { parse_mode: 'HTML' }
    );

    await ctx.answerCbQuery('✅ Заявку подано!');
    
    // Очищаємо pending action
    delete ctx.session.pendingAction;
    
    // TODO: Тут можна додати логіку відправки даних в CRM або базу даних
    
  } catch (error) {
    console.error('Помилка бронювання інтерв\'ю:', error);
    await ctx.answerCbQuery('❌ Виникла помилка. Спробуйте ще раз.');
  }
}

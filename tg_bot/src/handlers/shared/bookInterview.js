/**
 * Handler для бронювання інтерв'ю (Backend напрям)
 */
export default async function bookInterview(ctx) {
  try {
    // Перевіряємо чи є всі необхідні дані
    if (!ctx.session.name || !ctx.session.phone) {
      await ctx.reply(
        '📝 Для бронювання інтерв\'ю потрібно завершити реєстрацію.\n\nБудь ласка, надайте ваші контактні дані.',
        { parse_mode: 'HTML' }
      );
      await ctx.answerCbQuery('⚠️ Потрібна реєстрація');
      return;
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
    
    // TODO: Тут можна додати логіку відправки даних в CRM або базу даних
    
  } catch (error) {
    console.error('Помилка бронювання інтерв\'ю:', error);
    await ctx.answerCbQuery('❌ Виникла помилка. Спробуйте ще раз.');
  }
}

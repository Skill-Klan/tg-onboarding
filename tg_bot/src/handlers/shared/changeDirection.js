import { getMainKeyboard } from '../../utils/keyboard.js';

/**
 * Handler для зміни напряму навчання
 * Показує головне меню з трьома напрямами, зберігаючи дані користувача
 */
export default async function changeDirection(ctx) {
  try {
    // Відповідаємо на callback query
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
    }
    
    // Видаляємо inline кнопки з попереднього повідомлення
    if (ctx.callbackQuery) {
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    }
    
    // Показуємо головне меню
    await ctx.reply(
      '🔄 Оберіть напрям, що вас цікавить:',
      {
        ...getMainKeyboard(),
        parse_mode: 'HTML'
      }
    );

    // Відповідаємо на callback query
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery('✅ Повертаємось до вибору напряму');
    }
    
  } catch (error) {
    console.error('Помилка при зміні напряму:', error);
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery('❌ Виникла помилка. Спробуйте ще раз.');
    }
  }
}

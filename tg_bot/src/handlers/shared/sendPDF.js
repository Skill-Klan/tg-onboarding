import commonTexts from '../../texts/common.js';
import { AWAITING_STATES, CALLBACK_DATA } from '../../utils/constants.js';
import { getMainKeyboard } from '../../utils/keyboard.js';
import fs from 'fs';
import path from 'path';

export default async function sendPDF(ctx, track) {
  try {
    console.log(`🚀 Початок надсилання PDF для напрямку: ${track}`);
    
    // 1. Повідомлення про надсилання тесту
    console.log('📝 Надсилаю повідомлення про надсилання тесту...');
    await ctx.reply(commonTexts.sendingTest, {
      parse_mode: 'HTML'
    });
    console.log('✅ Повідомлення про надсилання тесту надіслано');

    // 2. Імітація дії
    console.log('⏳ Імітую дію завантаження...');
    await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_document');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Дія завантаження завершена');

    // 3. Перевірка існування PDF файлу
    const pdfPath = path.join(process.cwd(), 'pdf', `${track}.pdf`);
    console.log(`🔍 Перевіряю шлях до PDF: ${pdfPath}`);
    
    if (!fs.existsSync(pdfPath)) {
      console.error(`❌ PDF файл не знайдено: ${pdfPath}`);
      await ctx.reply(
        '⚠️ Вибачте, тестове завдання тимчасово недоступне. Спробуйте пізніше або зверніться до підтримки.',
        { parse_mode: 'HTML' }
      );
      return;
    }
    console.log('✅ PDF файл знайдено');

    // 4. Надсилання PDF
    console.log('📄 Надсилаю PDF документ...');
    await ctx.replyWithDocument({ source: pdfPath });
    console.log('✅ PDF документ надіслано');

    // 5. Скидаємо стан очікування
    console.log('🔄 Скидаю стан очікування...');
    ctx.session.awaiting = null;
    console.log('✅ Стан очікування скинуто');

    // 6. Показуємо повідомлення з нативним меню внизу
    console.log('⌨️ Показую повідомлення з нативним меню...');
    await ctx.reply(
      '📚 Ось тестове завдання, можеш сміливо ознайомлюватися!',
      {
        ...getMainKeyboard(),
        parse_mode: 'HTML'
      }
    );
    console.log('✅ Повідомлення з нативним меню показано');

    console.log(`🎉 PDF успішно надіслано для напрямку: ${track}`);
    
  } catch (error) {
    console.error(`❌ Помилка при надсиланні PDF для напрямку ${track}:`, error);
    console.error('📍 Stack trace:', error.stack);
    
    // Не показуємо помилку користувачу, якщо PDF вже надіслано
    if (ctx.session.awaiting === null) {
      console.log('✅ PDF вже надіслано, помилка в показі меню - ігноруємо');
      return;
    }
    
    await ctx.reply(
      '⚠️ Виникла помилка при надсиланні тестового завдання. Спробуйте ще раз або зверніться до підтримки.',
      { parse_mode: 'HTML' }
    );
  }
}
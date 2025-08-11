import commonTexts from '../../texts/common.js';
import { AWAITING_STATES, CALLBACK_DATA } from '../../utils/constants.js';
import { getMainKeyboard } from '../../utils/keyboard.js';
import fs from 'fs';
import path from 'path';

export default async function sendPDF(ctx, track) {
  try {
    // 1. Повідомлення про надсилання тесту
    await ctx.reply(commonTexts.sendingTest, {
      parse_mode: 'HTML'
    });

    // 2. Імітація дії
    await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_document');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Перевірка існування PDF файлу
    const pdfPath = path.join(process.cwd(), 'pdf', `${track}.pdf`);
    
    if (!fs.existsSync(pdfPath)) {
      console.error(`❌ PDF файл не знайдено: ${pdfPath}`);
      await ctx.reply(
        '⚠️ Вибачте, тестове завдання тимчасово недоступне. Спробуйте пізніше або зверніться до підтримки.',
        { parse_mode: 'HTML' }
      );
      return;
    }

    // 4. Надсилання PDF
    await ctx.replyWithDocument({ source: pdfPath });

    // 5. Скидаємо стан очікування
    ctx.session.awaiting = null;

    // 6. Показуємо меню вибору напрямків
    await ctx.reply(
      '🔄 Оберіть напрям, що вас цікавить:',
      {
        ...getMainKeyboard(),
        parse_mode: 'HTML'
      }
    );

    console.log(`✅ PDF успішно надіслано для напрямку: ${track}`);
    
  } catch (error) {
    console.error(`❌ Помилка при надсиланні PDF для напрямку ${track}:`, error);
    
    await ctx.reply(
      '⚠️ Виникла помилка при надсиланні тестового завдання. Спробуйте ще раз або зверніться до підтримки.',
      { parse_mode: 'HTML' }
    );
  }
}
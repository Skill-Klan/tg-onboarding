import commonTexts from '../../texts/common.js';
import { AWAITING_STATES, CALLBACK_DATA } from '../../utils/constants.js';

export default async function sendPDF(ctx, track) {
  // 1. Повідомлення про надсилання тесту
  await ctx.reply(commonTexts.sendingTest, {
    parse_mode: 'HTML'
  });

  // 2. Імітація дії
  await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_document');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Надсилання PDF
  await ctx.replyWithDocument({ source: `./pdf/${track}.pdf` });

  // 4. Кнопка окремо
  ctx.session.awaiting = AWAITING_STATES.READY_TO_SUBMIT;

  await ctx.reply(
    commonTexts.readyToSubmit,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: commonTexts.submitButton, callback_data: CALLBACK_DATA.SUBMIT_READY }]
        ]
      },
      parse_mode: 'HTML'
    }
  );
}
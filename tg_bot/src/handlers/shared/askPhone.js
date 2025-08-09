import commonTexts from '../../texts/common.js';
import { AWAITING_STATES } from '../../utils/constants.js';

export default (ctx) => {
  ctx.session.awaiting = AWAITING_STATES.PHONE;
  ctx.reply(commonTexts.requestPhone, {
    reply_markup: {
      keyboard: [
        [
          {
            text: commonTexts.sendPhoneButton,
            request_contact: true
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    },
    parse_mode: 'HTML'
  });
};
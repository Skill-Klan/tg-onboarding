import { KEYBOARD_BUTTONS } from './constants.js';

export function getMainKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [KEYBOARD_BUTTONS.TESTING],
        [KEYBOARD_BUTTONS.BUSINESS_ANALYTICS],
        [KEYBOARD_BUTTONS.BACKEND]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}
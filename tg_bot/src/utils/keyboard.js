import { KEYBOARD_BUTTONS, CALLBACK_DATA } from './constants.js';

export function getMainKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [KEYBOARD_BUTTONS.TESTING],
        [KEYBOARD_BUTTONS.BUSINESS_ANALYTICS],
        [KEYBOARD_BUTTONS.BACKEND]
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
      persistent: true
    }
  };
}

export function getMainInlineKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: KEYBOARD_BUTTONS.TESTING, callback_data: CALLBACK_DATA.CHOOSE_TRACK }],
        [{ text: KEYBOARD_BUTTONS.BUSINESS_ANALYTICS, callback_data: CALLBACK_DATA.CHOOSE_TRACK }],
        [{ text: KEYBOARD_BUTTONS.BACKEND, callback_data: CALLBACK_DATA.CHOOSE_TRACK }]
      ]
    }
  };
}

export function getDirectionActionButtons(track, showChangeDirection = true) {
  const buttons = [];
  
  // CTA кнопка
  if (track === 'Backend') {
    buttons.push([{
      text: '📅 Забронювати інтерв\'ю',
      callback_data: CALLBACK_DATA.BOOK_INTERVIEW
    }]);
  } else {
    buttons.push([{
      text: '📝 Спробувати пройти тестове завдання',
      callback_data: CALLBACK_DATA.GET_TEST_TASK
    }]);
  }
  
  // Кнопка "Змінити напрям" - показуємо тільки якщо потрібно
  if (showChangeDirection) {
    buttons.push([{
      text: '🔄 Змінити напрям',
      callback_data: CALLBACK_DATA.CHANGE_DIRECTION
    }]);
  }
  
  return {
    reply_markup: {
      inline_keyboard: buttons
    }
  };
}
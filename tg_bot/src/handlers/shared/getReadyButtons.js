import { CALLBACK_DATA } from '../../utils/constants.js';

export default function getReadyButtons() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📨 Отримати тестове завдання', callback_data: CALLBACK_DATA.GET_TEST_TASK }],
        [{ text: '💬 Часто запитують', callback_data: 'faq_general' }]
      ]
    }
  };
}
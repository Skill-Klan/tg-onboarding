import { AWAITING_STATES } from '../../utils/constants.js';

export default (ctx) => {
  ctx.session.awaiting = AWAITING_STATES.NAME;
  ctx.reply('Введи своє імʼя:');
};

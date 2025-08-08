import baseHandler from '../shared/baseHandler.js';
import qaTexts from '../../texts/qa.js';

export default async function(ctx) {
  return baseHandler(ctx, 'QA', qaTexts);
}
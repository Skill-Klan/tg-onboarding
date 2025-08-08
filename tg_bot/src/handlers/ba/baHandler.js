import baseHandler from '../shared/baseHandler.js';
import baTexts from '../../texts/ba.js';

export default async function(ctx) {
  return baseHandler(ctx, 'BA', baTexts);
}
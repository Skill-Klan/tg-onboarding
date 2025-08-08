import baseHandler from '../shared/baseHandler.js';
import backendTexts from '../../texts/backend.js';

export default async function(ctx) {
  return baseHandler(ctx, 'Backend', backendTexts);
}
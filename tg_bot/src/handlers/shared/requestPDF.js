import sendPDF from './sendPDF.js';
import commonTexts from '../../texts/common.js';

export default async function(ctx) {
  const track = ctx.session.tags?.track;

  if (!track) {
    return ctx.reply(commonTexts.noTrackSelected, { parse_mode: 'HTML' });
  }

  const now = new Date();
  ctx.session.tags.start_datetime = now.toISOString();

  return sendPDF(ctx, track);
}
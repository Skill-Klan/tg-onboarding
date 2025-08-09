import { setTrack } from '../../utils/tags.js';
import { getDirectionActionButtons } from '../../utils/keyboard.js';

/**
 * Базовий handler для всіх напрямків навчання
 * @param {Object} ctx - контекст Telegraf
 * @param {string} track - назва напрямку (QA, BA, Backend)
 * @param {Object} texts - тексти для конкретного напрямку
 */
export default async function baseHandler(ctx, track, texts) {
  // Встановлюємо напрямок
  setTrack(ctx, track);

  // Привітання з інформацією про напрямок та inline кнопки
  // Не показуємо кнопку "Змінити напрям" оскільки меню напрямів вже є на екрані
  await ctx.reply(texts.intro, {
    ...getDirectionActionButtons(track, false),
    parse_mode: 'HTML'
  });
} 
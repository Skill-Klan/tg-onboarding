import askName from '../handlers/shared/askName.js';
import askPhone from '../handlers/shared/askPhone.js';

export async function checkAndRequestContactData(ctx) {
  if (!ctx.session.name) {
    ctx.session.awaiting = 'name';
    await askName(ctx);
    return true; // зупини флоу, чекаємо імʼя
  }

  if (!ctx.session.phone) {
    ctx.session.awaiting = 'phone';
    await askPhone(ctx);
    return true; // зупини флоу, чекаємо номер
  }

  return false; // усе є, можна йти далі
}
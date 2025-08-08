export const sendWebhook = (ctx, status = 'готовий до здачі') => {
  const payload = {
    name: ctx.session.name,
    phone: ctx.session.phone,
    track: ctx.session.tags.track,
    status,
    datetime: new Date().toISOString()
  };

  // 💤 Тимчасовий мок — замість реального запиту
  console.log('📡 [ЗАГЛУШКА] Вебхук не відправлено. Дані:', payload);

  // При потребі — можна загорнути в try-catch або повністю вимкнути
  // try {
  //   // await axios.post('https://your.webhook.url', payload);
  // } catch (e) {
  //   console.error('❌ Webhook error:', e.message);
  // }
};
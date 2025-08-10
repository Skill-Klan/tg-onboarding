import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Статичні файли
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>SkillKlan FAQ Server</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <h1>🚀 SkillKlan FAQ Server</h1>
        <p>Сервер запущено успішно!</p>
        <p>FAQ доступний за адресою: <a href="/faq.html">/faq.html</a></p>
        <p>Порт: ${PORT}</p>
    </body>
    </html>
  `);
});

// Маршрут для FAQ
app.get('/faq', (req, res) => {
  res.redirect('/faq.html');
});

// Запуск сервера
// ✅ ЗМІНЕНО ДЛЯ ДЕПЛОЮ: додано '0.0.0.0' для зовнішнього доступу
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 FAQ сервер запущено на порту ${PORT}`);
  console.log(`📱 FAQ доступний за адресою: http://localhost:${PORT}/faq.html`);
  console.log(`🌍 FAQ доступний зовнішньо: http://0.0.0.0:${PORT}/faq.html`);
  console.log(`🏠 Головна сторінка: http://localhost:${PORT}/`);
});

export default app;

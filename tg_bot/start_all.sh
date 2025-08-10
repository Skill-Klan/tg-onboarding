#!/bin/bash

# 🚀 Скрипт для швидкого запуску FAQ Web App проекту
# Автоматично запускає сервер та бота

echo "🚀 Запуск FAQ Web App проекту..."
echo "=================================="

# Перевіряємо, чи знаходимося в правильній папці
if [ ! -f "package.json" ]; then
    echo "❌ Помилка: package.json не знайдено!"
    echo "💡 Перейдіть в папку tg_bot та запустіть скрипт знову"
    exit 1
fi

# Перевіряємо, чи встановлені залежності
if [ ! -d "node_modules" ]; then
    echo "📦 Встановлення залежностей..."
    npm install
fi

# Перевіряємо конфігурацію
echo "🔧 Перевірка конфігурації..."
if npm run validate > /dev/null 2>&1; then
    echo "✅ Конфігурація валідна"
else
    echo "❌ Помилка конфігурації!"
    echo "💡 Перевірте .env файл"
    exit 1
fi

# Запускаємо сервер у фоновому режимі
echo "🌐 Запуск FAQ сервера..."
npm run server &
SERVER_PID=$!

# Чекаємо, поки сервер запуститься
echo "⏳ Очікування запуску сервера..."
sleep 3

# Перевіряємо, чи сервер запущений
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ FAQ сервер запущений на http://localhost:3000"
else
    echo "❌ Помилка запуску сервера!"
    exit 1
fi

# Запускаємо бота
echo "🤖 Запуск Telegram бота..."
npm run dev &
BOT_PID=$!

# Чекаємо, поки бот запуститься
echo "⏳ Очікування запуску бота..."
sleep 5

# Перевіряємо, чи бот запущений
if ps -p $BOT_PID > /dev/null; then
    echo "✅ Telegram бот запущений"
else
    echo "❌ Помилка запуску бота!"
    exit 1
fi

echo ""
echo "🎉 Проект успішно запущено!"
echo "=================================="
echo "🌐 FAQ сервер: http://localhost:3000"
echo "📱 FAQ сторінка: http://localhost:3000/faq.html"
echo "🤖 Бот: працює в режимі розробки"
echo ""
echo "💡 Для тестування:"
echo "   1. Відкрийте http://localhost:3000/faq.html у браузері"
echo "   2. Відправте боту команду /start"
echo "   3. Натисніть '📚 FAQ' для відкриття Web App"
echo ""
echo "🛑 Для зупинки: натисніть Ctrl+C"

# Функція очищення при завершенні
cleanup() {
    echo ""
    echo "🛑 Зупинка проекту..."
    kill $SERVER_PID 2>/dev/null
    kill $BOT_PID 2>/dev/null
    echo "✅ Проект зупинено"
    exit 0
}

# Обробка сигналу завершення
trap cleanup SIGINT SIGTERM

# Очікування завершення
wait

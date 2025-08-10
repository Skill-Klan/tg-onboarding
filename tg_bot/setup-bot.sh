#!/bin/bash

echo "🤖 Налаштування SkillKlan Telegram Бота"
echo "========================================"
echo ""

# Перевірка наявності .env файлу
if [ ! -f .env ]; then
    echo "📝 Створюю .env файл..."
    cp env.example .env
    echo "✅ .env файл створено!"
else
    echo "📝 .env файл вже існує"
fi

echo ""
echo "🔑 Тепер потрібно налаштувати токен бота:"
echo "1. Відкрийте Telegram та знайдіть @BotFather"
echo "2. Відправте команду /newbot"
echo "3. Створіть нового бота та отримайте токен"
echo "4. Відредагуйте .env файл та вставте токен"
echo ""

# Перевірка токена
if grep -q "your_bot_token_here" .env; then
    echo "⚠️  Токен не налаштований!"
    echo "   Відредагуйте .env файл та замініть 'your_bot_token_here' на ваш токен"
    echo ""
    echo "📝 Відкрити .env файл:"
    echo "   nano .env"
    echo "   або"
    echo "   code .env"
else
    echo "✅ Токен налаштований!"
    echo ""
    echo "🧪 Тестуємо підключення..."
    node test-connection.js
fi

echo ""
echo "🚀 Після налаштування токена запустіть бота:"
echo "   npm run dev"
echo ""
echo "📖 Детальна інструкція: BOT_SETUP.md"

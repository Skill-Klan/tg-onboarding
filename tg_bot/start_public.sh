#!/bin/bash

echo "🚀 Запуск Telegram Bot з публічною IP..."

# Функція для очищення при завершенні
cleanup() {
    echo -e "\n🛑 Зупинка сервера..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        echo "✅ Сервер зупинено"
    fi
    exit 0
}

# Налаштовуємо обробник сигналів
trap cleanup SIGINT SIGTERM

# Отримуємо публічну IP
echo "🌐 Отримання публічної IP..."
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null)

if [ -z "$PUBLIC_IP" ]; then
    echo "❌ Помилка: Не вдалося отримати публічну IP"
    exit 1
fi

echo "✅ Публічна IP: $PUBLIC_IP"

# Встановлюємо змінні середовища
export PUBLIC_URL="http://$PUBLIC_IP:3000"
export FAQ_WEBAPP_URL="http://$PUBLIC_IP:3000/faq.html"

echo "🔧 Налаштування змінних середовища:"
echo "   PUBLIC_URL: $PUBLIC_URL"
echo "   FAQ_WEBAPP_URL: $FAQ_WEBAPP_URL"

# Перевіряємо чи порт доступний
echo "🔍 Перевірка доступності порту 3000..."
if netstat -tuln 2>/dev/null | grep -q ":3000 "; then
    echo "❌ Помилка: Порт 3000 вже зайнятий"
    echo "💡 Зупиніть інші сервіси або змініть порт"
    exit 1
fi

echo "✅ Порт 3000 вільний"

# Запускаємо сервер
echo "📡 Запуск сервера..."
npm start &
SERVER_PID=$!

# Чекаємо поки сервер запуститься
echo "⏳ Очікування запуску сервера..."
sleep 5

# Перевіряємо чи сервер запущений
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Помилка: Сервер не запустився"
    cleanup
fi

echo "✅ Сервер запущено на порту 3000"
echo "🌐 Локальний доступ: http://localhost:3000"
echo "🌍 Публічний доступ: $PUBLIC_URL"
echo "📱 Web App URL: $FAQ_WEBAPP_URL"
echo ""
echo "⚠️  Важливо:"
echo "   1. Переконайтеся що порт 3000 відкритий у файрволі"
echo "   2. Налаштуйте проброс порту на роутері"
echo "   3. Перевірте налаштування бота в @BotFather"
echo ""
echo "💡 Для зупинки натисніть Ctrl+C"
echo ""

# Очікуємо завершення
wait

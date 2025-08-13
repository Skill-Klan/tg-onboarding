#!/bin/bash

echo "🚀 Запуск локального тестування FAQ додатку..."
echo "================================================"

# Перевіряємо чи запущений сервер
if ! netstat -tlnp | grep -q ":8081"; then
    echo "🌐 Запуск HTTP сервера на порту 8081..."
    python3 -m http.server 8081 &
    SERVER_PID=$!
    echo "✅ Сервер запущено з PID: $SERVER_PID"
    sleep 2
else
    echo "✅ HTTP сервер вже запущений на порту 8081"
fi

# Запускаємо тести
echo ""
echo "🧪 Запуск тестів..."
node run-tests.js

echo ""
echo "🌐 Відкрийте браузер та перейдіть на:"
echo "   📱 Основний додаток: http://localhost:8081"
echo "   🧪 Сторінка тестування: http://localhost:8081/test-search.html"
echo ""
echo "📋 Інструкції:"
echo "   1. Відкрийте test-search.html"
echo "   2. Натисніть кнопки тестування"
echo "   3. Перевірте консоль браузера"
echo ""
echo "🛑 Для зупинки натисніть Ctrl+C"

# Чекаємо сигнал завершення
trap 'echo ""; echo "🛑 Зупинка сервера..."; kill $SERVER_PID 2>/dev/null; exit 0' INT

# Тримаємо скрипт активним
while true; do
    sleep 1
done

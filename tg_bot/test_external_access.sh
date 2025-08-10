#!/bin/bash

echo "🌐 Тестування зовнішньої доступності Web App..."

# Отримуємо публічну IP
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null)

if [ -z "$PUBLIC_IP" ]; then
    echo "❌ Помилка: Не вдалося отримати публічну IP"
    exit 1
fi

echo "✅ Публічна IP: $PUBLIC_IP"
echo "🔍 Тестування доступу до порту 3000..."

# Тестуємо з'єднання з зовнішньої точки
if timeout 5 bash -c "</dev/tcp/$PUBLIC_IP/3000" 2>/dev/null; then
    echo "✅ Порт 3000 доступний ззовні!"
    echo "🌐 Web App повинен працювати в Telegram"
    
    # Тестуємо HTTP відповідь
    echo "📡 Тестування HTTP відповіді..."
    HTTP_RESPONSE=$(curl -s --max-time 10 "http://$PUBLIC_IP:3000" | head -5)
    
    if [ ! -z "$HTTP_RESPONSE" ]; then
        echo "✅ HTTP відповідь отримано:"
        echo "$HTTP_RESPONSE"
        echo ""
        echo "🎉 Web App готовий до роботи!"
        echo "📱 Протестуйте в Telegram: натисніть кнопку '📚 FAQ'"
    else
        echo "❌ HTTP відповідь не отримано"
        echo "💡 Перевірте чи сервер запущений: npm start"
    fi
    
else
    echo "❌ Порт 3000 недоступний ззовні"
    echo ""
    echo "🔧 Потрібно налаштувати проброс порту на роутері:"
    echo ""
    echo "1️⃣ Відкрийте роутер: http://192.168.0.1"
    echo "2️⃣ Знайдіть розділ 'Port Forwarding' або 'Проброс портів'"
    echo "3️⃣ Додайте правило:"
    echo "   🌐 Service Name: Telegram Bot"
    echo "   🔗 Protocol: TCP"
    echo "   🚪 External Port: 3000"
    echo "   🏠 Internal Port: 3000"
    echo "   💻 Internal IP: 192.168.0.110"
    echo "   ✅ Status: Enabled"
    echo ""
    echo "4️⃣ Збережіть налаштування"
    echo "5️⃣ Перезапустіть сервер: npm start"
    echo "6️⃣ Запустіть цей тест знову: ./test_external_access.sh"
    echo ""
    echo "📖 Детальна інструкція: ROUTER_SETUP.md"
fi

echo ""
echo "📊 Поточна конфігурація:"
echo "   Локальна IP: 192.168.0.110"
echo "   Публічна IP: $PUBLIC_IP"
echo "   Порт: 3000"
echo "   Web App URL: http://$PUBLIC_IP:3000/faq.html"

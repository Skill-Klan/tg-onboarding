#!/bin/bash

echo "🌐 Отримання публічної IP адреси..."

# Спробуємо різні сервіси для отримання IP
echo "📡 Перевірка через різні сервіси..."

# Сервіс 1: ifconfig.me
echo "1️⃣ ifconfig.me:"
PUBLIC_IP_1=$(curl -s --max-time 5 ifconfig.me 2>/dev/null)
if [ ! -z "$PUBLIC_IP_1" ]; then
    echo "   ✅ $PUBLIC_IP_1"
else
    echo "   ❌ Не вдалося отримати"
fi

# Сервіс 2: ipinfo.io
echo "2️⃣ ipinfo.io:"
PUBLIC_IP_2=$(curl -s --max-time 5 ipinfo.io/ip 2>/dev/null)
if [ ! -z "$PUBLIC_IP_2" ]; then
    echo "   ✅ $PUBLIC_IP_2"
else
    echo "   ❌ Не вдалося отримати"
fi

# Сервіс 3: icanhazip.com
echo "3️⃣ icanhazip.com:"
PUBLIC_IP_3=$(curl -s --max-time 5 icanhazip.com 2>/dev/null)
if [ ! -z "$PUBLIC_IP_3" ]; then
    echo "   ✅ $PUBLIC_IP_3"
else
    echo "   ❌ Не вдалося отримати"
fi

# Вибираємо першу доступну IP
if [ ! -z "$PUBLIC_IP_1" ]; then
    PUBLIC_IP=$PUBLIC_IP_1
elif [ ! -z "$PUBLIC_IP_2" ]; then
    PUBLIC_IP=$PUBLIC_IP_2
elif [ ! -z "$PUBLIC_IP_3" ]; then
    PUBLIC_IP=$PUBLIC_IP_3
else
    echo "❌ Не вдалося отримати публічну IP"
    exit 1
fi

echo ""
echo "🎯 Вибрана публічна IP: $PUBLIC_IP"
echo "🔗 Web App URL: http://$PUBLIC_IP:3000/faq.html"
echo ""
echo "💡 Для використання виконайте:"
echo "export PUBLIC_URL=http://$PUBLIC_IP:3000"
echo "export FAQ_WEBAPP_URL=http://$PUBLIC_IP:3000/faq.html"
echo ""
echo "⚠️  Увага: Це рішення працює тільки якщо:"
echo "   1. Порт 3000 відкритий у файрволі"
echo "   2. Роутер налаштований для пробросу порту"
echo "   3. Провайдер не блокує вхідні з'єднання"

#!/bin/bash

echo "🔥 Перевірка та налаштування файрвола..."

# Перевіряємо чи ufw встановлений
if command -v ufw >/dev/null 2>&1; then
    echo "✅ UFW встановлено"
    
    # Перевіряємо статус
    UFW_STATUS=$(sudo ufw status | grep "Status")
    echo "📊 Статус UFW: $UFW_STATUS"
    
    # Перевіряємо чи порт 3000 відкритий
    if sudo ufw status | grep -q "3000"; then
        echo "✅ Порт 3000 вже відкритий у UFW"
    else
        echo "🔒 Порт 3000 закритий у UFW"
        echo "💡 Для відкриття виконайте: sudo ufw allow 3000"
        
        read -p "🔓 Відкрити порт 3000 зараз? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo ufw allow 3000
            echo "✅ Порт 3000 відкрито"
        fi
    fi
else
    echo "❌ UFW не встановлено"
    echo "💡 Встановіть: sudo apt install ufw"
fi

echo ""

# Перевіряємо чи iptables доступний
if command -v iptables >/dev/null 2>&1; then
    echo "✅ iptables доступний"
    
    # Перевіряємо правила для порту 3000
    if sudo iptables -L INPUT -n | grep -q ":3000"; then
        echo "✅ Порт 3000 відкритий у iptables"
    else
        echo "🔒 Порт 3000 закритий у iptables"
        echo "💡 Для відкриття виконайте: sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT"
    fi
else
    echo "❌ iptables недоступний"
fi

echo ""

# Перевіряємо чи netfilter-persistent встановлений
if command -v netfilter-persistent >/dev/null 2>&1; then
    echo "✅ netfilter-persistent встановлено"
    echo "💡 Правила iptables будуть збережені після перезавантаження"
else
    echo "⚠️  netfilter-persistent не встановлено"
    echo "💡 Встановіть: sudo apt install netfilter-persistent"
fi

echo ""

# Перевіряємо чи порт прослуховується
echo "🔍 Перевірка прослуховування порту 3000..."
if netstat -tuln 2>/dev/null | grep -q ":3000 "; then
    echo "✅ Порт 3000 прослуховується"
    LISTENING_PROCESS=$(netstat -tuln 2>/dev/null | grep ":3000 " | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$LISTENING_PROCESS" ]; then
        PROCESS_NAME=$(ps -p $LISTENING_PROCESS -o comm= 2>/dev/null)
        echo "📱 Процес: $PROCESS_NAME (PID: $LISTENING_PROCESS)"
    fi
else
    echo "❌ Порт 3000 не прослуховується"
    echo "💡 Запустіть сервер: npm start"
fi

echo ""

# Перевіряємо зовнішню доступність
echo "🌐 Перевірка зовнішньої доступності..."
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null)

if [ ! -z "$PUBLIC_IP" ]; then
    echo "✅ Публічна IP: $PUBLIC_IP"
    
    # Тестуємо з'єднання з зовнішньої точки
    echo "🔍 Тестування з'єднання з зовнішньої точки..."
    if timeout 5 bash -c "</dev/tcp/$PUBLIC_IP/3000" 2>/dev/null; then
        echo "✅ Порт 3000 доступний ззовні"
    else
        echo "❌ Порт 3000 недоступний ззовні"
        echo "💡 Можливі причини:"
        echo "   1. Файрвол блокує з'єднання"
        echo "   2. Роутер не налаштований для пробросу порту"
        echo "   3. Провайдер блокує вхідні з'єднання"
    fi
else
    echo "❌ Не вдалося отримати публічну IP"
fi

echo ""
echo "📋 Рекомендації:"
echo "   1. Переконайтеся що порт 3000 відкритий у файрволі"
echo "   2. Налаштуйте проброс порту 3000 на роутері"
echo "   3. Перевірте налаштування провайдера"
echo "   4. Для тестування використовуйте: telnet $PUBLIC_IP 3000"

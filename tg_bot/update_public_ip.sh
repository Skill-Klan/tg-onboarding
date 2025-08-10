#!/bin/bash

# Скрипт для оновлення публічної IP адреси
echo "🔍 Визначаю публічну IP адресу..."

# Отримуємо публічну IP
PUBLIC_IP=$(curl -s ifconfig.me)

if [ -z "$PUBLIC_IP" ]; then
    echo "❌ Не вдалося отримати публічну IP"
    exit 1
fi

echo "✅ Публічна IP: $PUBLIC_IP"

# Оновлюємо .env файл
if [ -f ".env" ]; then
    # Видаляємо стару PUBLIC_IP якщо є
    sed -i '/^PUBLIC_IP=/d' .env
    # Додаємо нову
    echo "PUBLIC_IP=$PUBLIC_IP" >> .env
    echo "✅ .env файл оновлено"
else
    # Створюємо .env файл якщо не існує
    echo "PUBLIC_IP=$PUBLIC_IP" > .env
    echo "✅ .env файл створено"
fi

# Оновлюємо конфігурацію веб-додатку
echo "🌐 Оновлюю конфігурацію веб-додатку..."

# Створюємо тимчасовий файл з оновленою конфігурацією
cat > src/config/webapp_temp.js << EOF
/**
 * 🌐 Telegram Web App конфігурація
 */

// Функція для отримання публічної URL
function getPublicURL() {
  // Перевіряємо чи є публічна IP або домен
  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL;
  }
  
  // Перевіряємо чи є збережена публічна IP
  if (process.env.PUBLIC_IP) {
    return \`http://\${process.env.PUBLIC_IP}:3000\`;
  }
  
  // Для розробки - localhost
  return 'http://localhost:3000';
}

export const WEBAPP_CONFIG = {
  // URL для FAQ Web App
  faq: {
    url: process.env.FAQ_WEBAPP_URL || \`\${getPublicURL()}/faq.html\`,
    fallbackUrl: process.env.FAQ_FALLBACK_URL || \`\${getPublicURL()}/faq.html\`,
    title: 'Часто запитують',
    description: 'Відповіді на популярні питання про SkillKlan'
  },
  
  // Налаштування Web App для "напівмодалки"
  settings: {
    // Кольори теми
    theme: {
      light: {
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff'
      },
      dark: {
        bg_color: '#212121',
        text_color: '#ffffff',
        hint_color: '#aaaaaa',
        link_color: '#64baf0',
        button_color: '#64baf0',
        button_text_color: '#ffffff'
      }
    },
    
    // Розміри та поведінка для "напівмодалки"
    viewport: {
      height: 0.6, // 60% висоти екрану (як напівмодалка)
      width: 0.95, // 95% ширини (трохи менше за повну ширину)
      is_expanded: false, // Не розгортати на весь екран
      is_closed: false
    }
  }
};

/**
 * Отримання Web App кнопки для FAQ
 */
export function getFAQWebAppButton() {
  return {
    text: '📚 FAQ',
    web_app: {
      url: WEBAPP_CONFIG.faq.url
    }
  };
}

/**
 * Отримання fallback URL для старих клієнтів
 */
export function getFAQFallbackURL() {
  return WEBAPP_CONFIG.faq.fallbackUrl;
}

/**
 * Оновлення URL після отримання публічної адреси
 */
export function updateWebAppURL(newURL) {
  if (newURL && newURL.startsWith('https://')) {
    WEBAPP_CONFIG.faq.url = \`\${newURL}/faq.html\`;
    WEBAPP_CONFIG.faq.fallbackUrl = \`\${newURL}/faq.html\`;
    console.log(\`✅ Web App URL оновлено: \${WEBAPP_CONFIG.faq.url}\`);
  }
}
EOF

# Замінюємо оригінальний файл
mv src/config/webapp_temp.js src/config/webapp.js

echo "✅ Конфігурація веб-додатку оновлена"
echo "🌐 FAQ Web App URL: http://$PUBLIC_IP:3000/faq.html"

# Перевіряємо доступність
echo "🔍 Перевіряю доступність сервера..."
if curl -s --connect-timeout 5 "http://$PUBLIC_IP:3000/faq.html" > /dev/null; then
    echo "✅ Сервер доступний зовнішньо!"
else
    echo "⚠️  Сервер не доступний зовнішньо. Перевірте налаштування файрвола та перезапустіть сервер."
fi

echo ""
echo "📋 Для застосування змін:"
echo "1. Перезапустіть сервер: npm run dev або node server.js"
echo "2. Перезапустіть бота: npm start або node src/index.mjs"
echo "3. Перевірте FAQ в Telegram боті"

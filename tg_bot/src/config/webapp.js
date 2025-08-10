/**
 * 🌐 Telegram Web App конфігурація
 */

// Функція для отримання публічної URL
// ✅ ЗМІНЕНО ДЛЯ ДЕПЛОЮ: додано підтримку PUBLIC_IP з .env файлу
function getPublicURL() {
  // Перевіряємо чи є публічна IP або домен
  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL;
  }
  
  // Перевіряємо чи є збережена публічна IP
  if (process.env.PUBLIC_IP) {
    return `http://${process.env.PUBLIC_IP}:3000`;
  }
  
  // Для розробки - localhost
  return 'http://localhost:3000';
}

export const WEBAPP_CONFIG = {
  // URL для FAQ Web App
  faq: {
    url: process.env.FAQ_WEBAPP_URL || `${getPublicURL()}/faq.html`,
    fallbackUrl: process.env.FAQ_FALLBACK_URL || `${getPublicURL()}/faq.html`,
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
    WEBAPP_CONFIG.faq.url = `${newURL}/faq.html`;
    WEBAPP_CONFIG.faq.fallbackUrl = `${newURL}/faq.html`;
    console.log(`✅ Web App URL оновлено: ${WEBAPP_CONFIG.faq.url}`);
  }
}

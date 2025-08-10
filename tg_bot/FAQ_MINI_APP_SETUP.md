# FAQ Mini App - Налаштування та розгортання

## Огляд

FAQ Mini App - це простий веб-додаток для Telegram, який відображає структурований FAQ з пошуком та акордеонами. Додаток відповідає всім вимогам ТЗ та готовий до розгортання.

## Структура файлів

```
tg_bot/public/
├── faq-mini-app.html          # Основний HTML файл Mini App
├── faq-mini-app.css           # Стилі з тематизацією
├── faq-mini-app.js            # JavaScript логіка
├── faq-data.json              # Дані FAQ
└── test-faq-mini-app.html     # Тестова сторінка
```

## Налаштування BotFather

### 1. Увімкнення Mini App

1. Відкрийте [@BotFather](https://t.me/botfather) в Telegram
2. Відправте команду `/mybots`
3. Виберіть вашого бота
4. Натисніть "Bot Settings"
5. Виберіть "Mini Apps"
6. Натисніть "Add Mini App"
7. Введіть назву: `FAQ`
8. Введіть опис: `Часто запитувані питання про SkillKlan`
9. Введіть URL: `https://your-domain.com/faq-mini-app.html`

### 2. Налаштування Menu Button

1. У налаштуваннях бота виберіть "Menu Button"
2. Встановіть текст кнопки: `📚 FAQ`
3. Встановіть URL: `https://your-domain.com/faq-mini-app.html?startapp=faq&mode=compact`

### 3. Налаштування Main Mini App (опціонально)

1. У налаштуваннях бота виберіть "Main Mini App"
2. Встановіть URL: `https://your-domain.com/faq-mini-app.html`
3. Додайте опис та прев'юшки

## Розгортання

### 1. Завантаження файлів на сервер

```bash
# Створіть директорію на сервері
mkdir -p /var/www/faq-mini-app

# Завантажте файли
scp tg_bot/public/faq-mini-app.* user@your-server:/var/www/faq-mini-app/
scp tg_bot/public/faq-data.json user@your-server:/var/www/faq-mini-app/
```

### 2. Налаштування веб-сервера

#### Nginx конфігурація

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/faq-mini-app;
    index faq-mini-app.html;
    
    # Безпека
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Кешування статичних файлів
    location ~* \.(css|js|json)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Основна сторінка
    location / {
        try_files $uri $uri/ /faq-mini-app.html;
    }
    
    # FAQ дані
    location /faq-data.json {
        add_header Content-Type "application/json";
        add_header Access-Control-Allow-Origin "*";
    }
}
```

#### Apache конфігурація

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/faq-mini-app
    
    <Directory /var/www/faq-mini-app>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Безпека
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Кешування
    <FilesMatch "\.(css|js|json)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
</VirtualHost>
```

### 3. SSL сертифікат (обов'язково)

```bash
# Встановлення Certbot
sudo apt install certbot python3-certbot-nginx

# Отримання сертифіката
sudo certbot --nginx -d your-domain.com

# Автоматичне оновлення
sudo crontab -e
# Додайте рядок:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Тестування

### 1. Локальне тестування

```bash
# Запуск локального сервера
cd tg_bot/public
python3 -m http.server 8000

# Відкрийте http://localhost:8000/test-faq-mini-app.html
```

### 2. Тестування в Telegram

1. Відкрийте вашого бота
2. Натисніть кнопку "📚 FAQ" в меню
3. Перевірте:
   - Відображення в compact режимі
   - Розгортання на повний екран
   - Пошук по FAQ
   - Роботу акордеонів
   - Кнопку "Написати в бот"

### 3. Тестування посилань

1. Відкрийте FAQ Mini App
2. Перевірте посилання на бота
3. Переконайтеся, що Mini App не закривається

## Налаштування контенту

### 1. Редагування FAQ даних

Відредагуйте файл `faq-data.json`:

```json
{
  "sections": [
    {
      "id": "section-id",
      "title": "Назва секції",
      "items": [
        {
          "id": "item-id",
          "q": "Питання",
          "a": "Відповідь",
          "links": ["t.me/your_bot?start=action"]
        }
      ]
    }
  ]
}
```

### 2. Додавання нових секцій

1. Додайте нову секцію в `faq-data.json`
2. Перезавантажте файл на сервер
3. Очистіть кеш браузера

### 3. Локалізація

Для додавання інших мов:

1. Створіть файли `faq-data-en.json`, `faq-data-ru.json`
2. Модифікуйте `faq-mini-app.js` для визначення мови
3. Додайте перемикач мов в UI

## Моніторинг та аналітика

### 1. Логи сервера

```bash
# Nginx логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Apache логи
sudo tail -f /var/log/apache2/access.log
sudo tail -f /var/log/apache2/error.log
```

### 2. Google Analytics (опціонально)

Додайте в `faq-mini-app.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Власна аналітика

Додайте в `faq-mini-app.js`:

```javascript
// Відправка подій на ваш сервер
trackEvent('faq_open', { section: 'start' });
trackEvent('search_query', { query: 'курс' });
```

## Безпека

### 1. HTTPS обов'язково

- Mini App не працює без HTTPS
- Використовуйте HSTS заголовки
- Регулярно оновлюйте SSL сертифікати

### 2. Заголовки безпеки

```nginx
# Додайте в nginx.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline';" always;
```

### 3. Валідація вхідних даних

- FAQ дані завантажуються тільки з `faq-data.json`
- Пошукові запити обробляються клієнтською стороною
- Немає серверної обробки користувацьких даних

## Оптимізація продуктивності

### 1. Кешування

```nginx
# Nginx кешування
location ~* \.(css|js|json)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}
```

### 2. Стиснення

```nginx
# Gzip стиснення
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 3. CDN (опціонально)

- Використовуйте Cloudflare або інші CDN
- Налаштуйте кешування статичних файлів
- Включіть Brotli стиснення

## Troubleshooting

### 1. Mini App не відкривається

- Перевірте HTTPS
- Перевірте URL в BotFather
- Перевірте логи сервера
- Перевірте консоль браузера

### 2. Помилки завантаження

- Перевірте доступність `faq-data.json`
- Перевірте CORS налаштування
- Перевірте права доступу до файлів

### 3. Проблеми з темою

- Перевірте CSS змінні
- Перевірте `themeParams` в Telegram WebApp
- Перевірте `colorScheme`

### 4. Проблеми з пошуком

- Перевірте JavaScript консоль
- Перевірте створення пошукового індексу
- Перевірте обробку пошукових запитів

## Контакти та підтримка

- **Розробник**: [Ваше ім'я]
- **Email**: [your-email@domain.com]
- **Telegram**: [@your-username]
- **Документація**: [Посилання на документацію]

## Ліцензія

Цей проект розповсюджується під ліцензією [MIT/ISC]. Дивіться файл LICENSE для деталей.

---

**Примітка**: Цей документ оновлюється регулярно. Останнє оновлення: 2024-01-15

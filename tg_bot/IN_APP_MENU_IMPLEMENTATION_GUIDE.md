# Детальний гід по реалізації In-App меню з кнопкою для Telegram Web App

## Огляд проекту

Цей проект демонструє реалізацію повноцінного in-app меню для Telegram бота з можливістю замовлення їжі. Проект використовує PHP для backend логіки та HTML/CSS/JavaScript для frontend інтерфейсу.

## Архітектура проекту

```
durger-king/
├── src/                    # PHP backend код
│   ├── App.php            # Головний клас додатку
│   └── Plugins/           # Плагіни для обробки команд та web-запитів
├── public/                 # Frontend файли
│   ├── index.php          # Головна сторінка меню
│   ├── demo.php           # Демо сторінка
│   ├── css/               # Стилі
│   ├── js/                # JavaScript логіка
│   └── img/               # Зображення та анімації
└── service.php            # Webhook обробник
```

## Ключові компоненти

### 1. Telegram Web App Integration

#### Основні файли:
- `public/index.php` - головна сторінка меню
- `public/js/cafe.js` - основна логіка Web App
- `public/css/cafe.css` - стилізація

#### Ініціалізація Web App:
```javascript
// Ініціалізація Telegram Web App
Telegram.WebApp.ready();

// Налаштування головної кнопки
Telegram.WebApp.MainButton.setParams({
    text_color: "#fff",
}).onClick(Cafe.mainBtnClicked);
```

### 2. Структура меню

#### HTML структура товару:
```html
<div class="cafe-item js-item" data-item-id="1" data-item-price="4990">
    <div class="cafe-item-counter js-item-counter">1</div>
    <div class="cafe-item-photo">
        <picture class="cafe-item-lottie js-item-lottie">
            <source type="application/x-tgsticker" srcset="./img/tgs/Burger.tgs">
            <img src="./img/Burger_148.png" alt="Burger">
        </picture>
    </div>
    <div class="cafe-item-label">
        <span class="cafe-item-title">Burger</span>
        <span class="cafe-item-price">$4.99</span>
    </div>
    <div class="cafe-item-buttons">
        <button class="cafe-item-decr-button js-item-decr-btn button-item ripple-handler">
            <span class="ripple-mask"><span class="ripple"></span></span>
        </button>
        <button class="cafe-item-incr-button js-item-incr-btn button-item ripple-handler">
            <span class="button-item-label">Add</span>
            <span class="ripple-mask"><span class="ripple"></span></span>
        </button>
    </div>
</div>
```

### 3. JavaScript логіка

#### Основний об'єкт Cafe:
```javascript
var Cafe = {
    canPay: false,
    modeOrder: false,
    totalPrice: 0,
    
    init: function (options) {
        // Ініціалізація Web App
        Telegram.WebApp.ready();
        
        // Налаштування обробників подій
        $(".js-item-incr-btn").on("click", Cafe.eIncrClicked);
        $(".js-item-decr-btn").on("click", Cafe.eDecrClicked);
        
        // Налаштування головної кнопки
        Telegram.WebApp.MainButton.setParams({
            text_color: "#fff",
        }).onClick(Cafe.mainBtnClicked);
    }
};
```

#### Обробка кліків по кнопках:
```javascript
eIncrClicked: function (e) {
    e.preventDefault();
    var itemEl = $(this).parents(".js-item");
    Cafe.incrClicked(itemEl, 1);
},

eDecrClicked: function (e) {
    e.preventDefault();
    var itemEl = $(this).parents(".js-item");
    Cafe.incrClicked(itemEl, -1);
}
```

### 4. Стилізація та анімації

#### CSS змінні для теми:
```css
body {
    --default-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    --block-bg-color: var(--tg-theme-bg-color);
    --accent-color: #31b545;
    --main-color: #f8a917;
    --text-color: #222;
}
```

#### Анімації для лічильників:
```css
@keyframes badge-incr {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

@keyframes badge-decr {
    0% { transform: scale(1); }
    50% { transform: scale(0.8); }
    100% { transform: scale(1); }
}
```

### 5. Backend обробка

#### PHP плагін для обробки замовлень:
```php
class WebService extends \TelegramBot\Plugin
{
    public function onWebAppData(WebAppData $webAppData): \Generator
    {
        if ($webAppData->getRawData()['method'] == "makeOrder") {
            // Обробка замовлення
            yield Request::sendMessage([
                'chat_id' => $webAppData->getUser()->getId(),
                'text' => "Your order has been placed successfully! 🍟"
            ]);
        }
    }
}
```

## Покрокова інструкція по реалізації

### Крок 1: Створення структури проекту

1. Створіть директорію для проекту
2. Встановіть залежності через Composer:
```bash
composer require telegram-bot-php/core
composer require utilities-php/routing
```

### Крок 2: Налаштування Telegram Bot

1. Створіть бота через @BotFather
2. Отримайте токен бота
3. Налаштуйте webhook на `https://your-domain.com/telegram`

### Крок 3: Створення HTML структури

1. Створіть `index.php` з базовою структурою
2. Додайте мета-теги для мобільних пристроїв
3. Підключіть Telegram Web App SDK:
```html
<script src="https://tg.dev/js/telegram-web-app.js"></script>
```

### Крок 4: Реалізація JavaScript логіки

1. Створіть основний об'єкт для управління додатком
2. Реалізуйте ініціалізацію Web App
3. Додайте обробники подій для кнопок
4. Реалізуйте логіку лічильників та кошика

### Крок 5: Стилізація

1. Створіть CSS файл з базовими стилями
2. Додайте CSS змінні для теми Telegram
3. Реалізуйте адаптивний дизайн
4. Додайте анімації та переходи

### Крок 6: Backend логіка

1. Створіть PHP клас для обробки webhook'ів
2. Реалізуйте обробку замовлень
3. Додайте валідацію даних
4. Налаштуйте відправку повідомлень

## Ключові особливості реалізації

### 1. Інтеграція з Telegram Web App

- Використання `Telegram.WebApp.ready()` для ініціалізації
- Налаштування головної кнопки через `Telegram.WebApp.MainButton`
- Адаптація до теми користувача через CSS змінні

### 2. Адаптивний дизайн

- Використання CSS Grid та Flexbox
- Адаптація до різних розмірів екрану
- Підтримка темної/світлої теми

### 3. Анімації та інтерактивність

- Ripple ефекти для кнопок
- Анімації лічильників товарів
- Плавні переходи між станами

### 4. Безпека

- Валідація даних на backend
- Перевірка автентичності через Telegram
- Захист від XSS атак

## Приклади використання

### Додавання нового товару:

1. Додайте HTML структуру в `index.php`
2. Оновіть масив `store_items` в `WebService.php`
3. Додайте відповідні зображення в `img/` директорію

### Зміна функціональності кнопок:

1. Модифікуйте JavaScript обробники в `cafe.js`
2. Оновіть CSS стилі в `cafe.css`
3. Протестуйте на різних пристроях

### Додавання нових методів API:

1. Створіть новий case в `onWebAppData` методі
2. Додайте відповідну логіку обробки
3. Оновіть frontend для використання нового API

## Тестування та налагодження

### Локальне тестування:

1. Використовуйте ngrok для створення тунелю
2. Налаштуйте webhook на локальну адресу
3. Тестуйте через @BotFather

### Налагодження:

1. Використовуйте `console.log()` для JavaScript
2. Перевіряйте логи PHP помилок
3. Використовуйте Telegram Web App Inspector

## Висновок

Цей проект демонструє повноцінну реалізацію in-app меню для Telegram бота з використанням сучасних веб-технологій. Ключові аспекти включають:

- Інтеграцію з Telegram Web App API
- Адаптивний дизайн та анімації
- Безпечну обробку замовлень
- Модульну архітектуру коду

Використовуючи цей гід, ви можете створити власне in-app меню для будь-якого Telegram бота, адаптувавши код під ваші потреби.

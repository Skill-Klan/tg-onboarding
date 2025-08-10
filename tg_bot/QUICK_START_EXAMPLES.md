# Швидкий старт: Практичні приклади коду

## 1. Базова структура HTML

### index.php
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Web App Menu</title>
    <script src="https://tg.dev/js/telegram-web-app.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="css/app.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1>🍔 Restaurant Menu</h1>
        </header>
        
        <main class="menu-container">
            <!-- Товари будуть додані через JavaScript -->
        </main>
        
        <footer class="app-footer">
            <div class="total-price">
                Total: $<span id="total-price">0.00</span>
            </div>
        </footer>
    </div>
    
    <script src="js/app.js"></script>
</body>
</html>
```

## 2. JavaScript логіка

### app.js
```javascript
class TelegramMenuApp {
    constructor() {
        this.items = [];
        this.totalPrice = 0;
        this.init();
    }
    
    init() {
        // Ініціалізація Telegram Web App
        if (typeof Telegram !== 'undefined') {
            Telegram.WebApp.ready();
            this.setupMainButton();
        }
        
        // Завантаження товарів
        this.loadItems();
        this.bindEvents();
    }
    
    setupMainButton() {
        Telegram.WebApp.MainButton.setParams({
            text: 'Place Order',
            color: '#31b545',
            text_color: '#ffffff'
        });
        
        Telegram.WebApp.MainButton.onClick(() => {
            this.placeOrder();
        });
    }
    
    loadItems() {
        // Приклад товарів
        this.items = [
            { id: 1, name: 'Burger', price: 4.99, image: 'burger.png' },
            { id: 2, name: 'Pizza', price: 8.99, image: 'pizza.png' },
            { id: 3, name: 'Fries', price: 2.99, image: 'fries.png' }
        ];
        
        this.renderItems();
    }
    
    renderItems() {
        const container = document.querySelector('.menu-container');
        container.innerHTML = this.items.map(item => `
            <div class="menu-item" data-item-id="${item.id}">
                <div class="item-image">
                    <img src="img/${item.image}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price}</p>
                </div>
                <div class="item-controls">
                    <button class="btn-decrease" data-item-id="${item.id}">-</button>
                    <span class="quantity" data-item-id="${item.id}">0</span>
                    <button class="btn-increase" data-item-id="${item.id}">+</button>
                </div>
            </div>
        `).join('');
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-increase')) {
                this.increaseQuantity(e.target.dataset.itemId);
            } else if (e.target.classList.contains('btn-decrease')) {
                this.decreaseQuantity(e.target.dataset.dataset.itemId);
            }
        });
    }
    
    increaseQuantity(itemId) {
        const quantityEl = document.querySelector(`[data-item-id="${itemId}"].quantity`);
        let quantity = parseInt(quantityEl.textContent) || 0;
        quantity++;
        quantityEl.textContent = quantity;
        
        this.updateTotal();
        this.updateMainButton();
    }
    
    decreaseQuantity(itemId) {
        const quantityEl = document.querySelector(`[data-item-id="${itemId}"].quantity`);
        let quantity = parseInt(quantityEl.textContent) || 0;
        if (quantity > 0) {
            quantity--;
            quantityEl.textContent = quantity;
            this.updateTotal();
            this.updateMainButton();
        }
    }
    
    updateTotal() {
        this.totalPrice = 0;
        this.items.forEach(item => {
            const quantity = parseInt(document.querySelector(`[data-item-id="${item.id}"].quantity`).textContent) || 0;
            this.totalPrice += item.price * quantity;
        });
        
        document.getElementById('total-price').textContent = this.totalPrice.toFixed(2);
    }
    
    updateMainButton() {
        if (this.totalPrice > 0) {
            Telegram.WebApp.MainButton.show();
        } else {
            Telegram.WebApp.MainButton.hide();
        }
    }
    
    placeOrder() {
        const order = {
            items: this.items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: parseInt(document.querySelector(`[data-item-id="${item.id}"].quantity`).textContent) || 0,
                price: item.price
            })).filter(item => item.quantity > 0),
            total: this.totalPrice
        };
        
        // Відправка замовлення через Telegram Web App
        Telegram.WebApp.sendData(JSON.stringify(order));
        
        // Показ повідомлення про успіх
        Telegram.WebApp.showAlert('Order placed successfully! 🎉');
    }
}

// Ініціалізація додатку
document.addEventListener('DOMContentLoaded', () => {
    new TelegramMenuApp();
});
```

## 3. CSS стилі

### app.css
```css
:root {
    --tg-theme-bg-color: #ffffff;
    --tg-theme-text-color: #000000;
    --tg-theme-button-color: #31b545;
    --tg-theme-button-text-color: #ffffff;
    --accent-color: #f8a917;
    --border-color: #e0e0e0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--tg-theme-bg-color);
    color: var(--tg-theme-text-color);
    line-height: 1.6;
}

.app-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
}

.app-header {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
}

.app-header h1 {
    font-size: 24px;
    font-weight: 600;
}

.menu-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: var(--tg-theme-bg-color);
    transition: all 0.2s ease;
}

.menu-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
    width: 80px;
    height: 80px;
    margin-right: 16px;
    border-radius: 8px;
    overflow: hidden;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-info {
    flex: 1;
}

.item-info h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.price {
    color: var(--accent-color);
    font-weight: 600;
    font-size: 16px;
}

.item-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-decrease,
.btn-increase {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: var(--tg-theme-button-color);
    color: var(--tg-theme-button-text-color);
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-decrease:hover,
.btn-increase:hover {
    transform: scale(1.1);
}

.quantity {
    min-width: 24px;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
}

.app-footer {
    margin-top: 32px;
    padding: 20px;
    border-top: 1px solid var(--border-color);
    text-align: center;
}

.total-price {
    font-size: 20px;
    font-weight: 600;
    color: var(--accent-color);
}

/* Адаптивність */
@media (max-width: 480px) {
    .app-container {
        padding: 12px;
    }
    
    .menu-item {
        flex-direction: column;
        text-align: center;
    }
    
    .item-image {
        margin-right: 0;
        margin-bottom: 12px;
    }
    
    .item-controls {
        margin-top: 12px;
    }
}

/* Анімації */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.menu-item {
    animation: fadeIn 0.3s ease-out;
}

/* Ripple ефект для кнопок */
.btn-decrease,
.btn-increase {
    position: relative;
    overflow: hidden;
}

.btn-decrease::after,
.btn-increase::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
}

.btn-decrease:active::after,
.btn-increase:active::after {
    width: 100px;
    height: 100px;
}
```

## 4. PHP Backend

### webhook.php
```php
<?php
require_once 'vendor/autoload.php';

use TelegramBot\Bot;
use TelegramBot\Plugin;
use TelegramBot\Request;
use TelegramBot\Types\WebAppData;

class MenuWebhook extends Plugin {
    
    public function onWebAppData(WebAppData $webAppData): \Generator {
        $data = $webAppData->getRawData();
        $user = $webAppData->getUser();
        
        try {
            $orderData = json_decode($data['data'], true);
            
            if ($orderData && isset($orderData['items'])) {
                // Обробка замовлення
                $orderText = $this->formatOrder($orderData);
                
                yield Request::sendMessage([
                    'chat_id' => $user->getId(),
                    'text' => $orderText,
                    'parse_mode' => 'HTML'
                ]);
                
                // Показ повідомлення про успіх
                yield Request::answerWebAppQuery([
                    'web_app_query_id' => $webAppData->getQueryId(),
                    'result' => [
                        'type' => 'article',
                        'id' => 'order_success',
                        'title' => 'Order Placed! 🎉',
                        'input_message_content' => [
                            'message_text' => 'Your order has been placed successfully!'
                        ]
                    ]
                ]);
            }
        } catch (Exception $e) {
            yield Request::answerWebAppQuery([
                'web_app_query_id' => $webAppData->getQueryId(),
                'result' => [
                    'type' => 'article',
                    'id' => 'order_error',
                    'title' => 'Error ❌',
                    'input_message_content' => [
                        'message_text' => 'Sorry, there was an error processing your order.'
                    ]
                ]
            ]);
        }
    }
    
    private function formatOrder($orderData): string {
        $text = "🍽 <b>New Order</b>\n\n";
        $text .= "📋 <b>Items:</b>\n";
        
        foreach ($orderData['items'] as $item) {
            $text .= "• {$item['name']} x{$item['quantity']} - \${$item['price']}\n";
        }
        
        $text .= "\n💰 <b>Total: \${$orderData['total']}</b>";
        
        return $text;
    }
}

// Налаштування бота
$bot = new Bot('YOUR_BOT_TOKEN');
$bot->addPlugin(new MenuWebhook());

// Обробка webhook
$bot->handleWebhook();
?>
```

## 5. Налаштування webhook

### set_webhook.php
```php
<?php
$token = 'YOUR_BOT_TOKEN';
$webhook_url = 'https://your-domain.com/webhook.php';

$url = "https://api.telegram.org/bot{$token}/setWebhook";
$data = [
    'url' => $webhook_url,
    'allowed_updates' => ['message', 'callback_query', 'web_app_data']
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo "Webhook response: " . $response;
?>
```

## 6. Composer.json

```json
{
    "require": {
        "telegram-bot-php/core": "^1.0",
        "utilities-php/routing": "^1.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

## 7. Створення кнопки в боті

```php
<?php
// Створення inline кнопки для відкриття Web App
$keyboard = [
    'inline_keyboard' => [
        [
            [
                'text' => '🍔 Open Menu',
                'web_app' => [
                    'url' => 'https://your-domain.com/index.php'
                ]
            ]
        ]
    ]
];

yield Request::sendMessage([
    'chat_id' => $chatId,
    'text' => 'Welcome to our restaurant! Click the button below to open the menu.',
    'reply_markup' => json_encode($keyboard)
]);
?>
```

## Швидкий старт:

1. **Скопіюйте файли** у відповідні директорії
2. **Встановіть залежності**: `composer install`
3. **Налаштуйте webhook**: `php set_webhook.php`
4. **Замініть `YOUR_BOT_TOKEN`** на ваш токен
5. **Оновіть URL** на ваш домен
6. **Протестуйте** через @BotFather

Цей код надає повнофункціональну основу для створення in-app меню в Telegram Web App!

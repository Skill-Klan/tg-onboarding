# Налаштування Mini App у BotFather

## Крок 1: Створення Mini App

1. Відкрийте [@BotFather](https://t.me/botfather) в Telegram
2. Відправте команду `/newapp`
3. Виберіть вашого бота зі списку
4. Введіть назву Mini App: `SkillKlan FAQ`
5. Введіть короткий опис: `Часто запитувані питання про SkillKlan`

## Крок 2: Налаштування параметрів

### Основні налаштування:
- **Short Name**: `skillklan-faq`
- **Description**: `FAQ та відповіді на питання про SkillKlan`
- **Photo**: Завантажте логотип SkillKlan (рекомендовано 640x360px)

### Розширені налаштування:

#### Menu Button:
```
/setmenubutton
```
- Виберіть вашого бота
- Введіть текст кнопки: `📚 FAQ`
- Введіть URL: `https://your-domain.com/faq.html`

#### Mini App Settings:
```
/setapp
```
- Виберіть вашого бота
- Виберіть Mini App: `skillklan-faq`

#### Налаштування режиму:
```
/setappmode
```
- Виберіть вашого бота
- Виберіть режим: `Main` або `Direct`
- Включіть `Compact Mode` для напівмодального відображення

## Крок 3: Налаштування кнопок

### Inline Keyboard для запуску Mini App:
```javascript
const keyboard = {
    inline_keyboard: [
        [{
            text: "📚 Відкрити FAQ",
            web_app: {
                url: "https://your-domain.com/faq.html"
            }
        }]
    ]
};
```

### Reply Keyboard з кнопкою Mini App:
```javascript
const keyboard = {
    keyboard: [
        [{
            text: "📚 FAQ",
            web_app: {
                url: "https://your-domain.com/faq.html"
            }
        }]
    ],
    resize_keyboard: true
};
```

## Крок 4: Перевірка роботи

1. **Тестування на мобільному клієнті:**
   - Mini App повинен відкриватися як напівмодальне вікно
   - Кнопки оболонки повинні працювати коректно
   - Тема повинна автоматично застосовуватися

2. **Перевірка функціональності:**
   - Пошук по FAQ
   - Розгортання/згортання секцій
   - Кнопка "Зв'язатися з підтримкою"
   - Нативні кнопки Telegram

## Крок 5: Додаткові налаштування

### Webhook URL:
```
https://your-domain.com/telegram
```

### Дозволені домени:
Додайте ваш домен до списку дозволених у BotFather:
```
/setdomain
```

## Приклад коду для бота:

```python
from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters

async def start(update: Update, context):
    keyboard = [
        [KeyboardButton("📚 FAQ", web_app=WebAppInfo(url="https://your-domain.com/faq.html"))]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(
        "Вітаю! Я бот SkillKlan. Натисніть кнопку FAQ для отримання відповідей на популярні питання.",
        reply_markup=reply_markup
    )

async def handle_webapp_data(update: Update, context):
    # Обробка даних з Mini App (якщо потрібно)
    data = update.effective_message.web_app_data.data
    await update.message.reply_text(f"Отримано дані: {data}")

def main():
    application = Application.builder().token("YOUR_BOT_TOKEN").build()
    
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_webapp_data))
    
    application.run_polling()

if __name__ == "__main__":
    main()
```

## Важливі моменти:

1. **Compact Mode** - ключ до напівмодального відображення
2. **Main/Direct режим** - забезпечує кращий UX
3. **Нативні кнопки** - використовуйте `MainButton`, `BackButton` замість власних
4. **Тема** - автоматично застосовується з Telegram
5. **Viewport** - адаптується до розміру вікна

## Тестування:

- Тестуйте на різних пристроях
- Перевіряйте роботу в різних темах (світла/темна)
- Тестуйте на різних розмірах екрану
- Перевіряйте роботу кнопок оболонки

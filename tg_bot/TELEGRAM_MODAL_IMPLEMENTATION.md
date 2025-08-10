# Правильна реалізація модалок в Telegram Mini Apps

## Огляд змін

Цей документ описує правильну реалізацію модальних вікон та повідомлень в Telegram Mini Apps відповідно до [офіційної документації](https://core.telegram.org/bots/webapps).

## Основні проблеми попередньої реалізації

1. **Кастомні модалки** - використання HTML/CSS для створення власних модальних вікон
2. **Некоректне використання API** - відсутність належної ініціалізації та обробки подій
3. **Відсутність адаптації до теми** - не враховувалися налаштування теми користувача
4. **Некоректна робота з кнопками** - відсутність налаштування MainButton та SecondaryButton

## Правильні методи відповідно до документації

### 1. Нативні методи для модалок

#### `showAlert(message)`
```javascript
// Показати просте повідомлення
tg.showAlert('Ваше повідомлення');
```

#### `showConfirm(message, callback)`
```javascript
// Показати діалог підтвердження
tg.showConfirm(
    'Ви впевнені?',
    (confirmed) => {
        if (confirmed) {
            // Користувач натиснув "Так"
        } else {
            // Користувач натиснув "Ні"
        }
    }
);
```

#### `showPopup(options, callback)`
```javascript
// Показати popup з кнопками
tg.showPopup({
    title: 'Заголовок',
    message: 'Повідомлення',
    buttons: [
        {
            id: 'ok',
            type: 'ok',
            text: 'OK'
        },
        {
            id: 'cancel',
            type: 'cancel',
            text: 'Скасувати'
        }
    ]
}, (buttonId) => {
    console.log('Натиснута кнопка:', buttonId);
});
```

### 2. Правильна ініціалізація

```javascript
// Ініціалізація Web App
let tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Налаштування кнопок
tg.MainButton.setText('Текст кнопки');
tg.MainButton.show();

// Secondary Button (Bot API 7.10+)
if (tg.SecondaryButton) {
    tg.SecondaryButton.setText('Другорядна кнопка');
    tg.SecondaryButton.show();
}
```

### 3. Обробка подій

```javascript
// Основна кнопка
tg.onEvent('mainButtonClicked', () => {
    // Обробка натискання основної кнопки
});

// Другорядна кнопка
tg.onEvent('secondaryButtonClicked', () => {
    // Обробка натискання другорядної кнопки
});

// Зміна теми
tg.onEvent('themeChanged', () => {
    // Оновлення кольорів при зміні теми
});

// Зміна розміру вікна
tg.onEvent('viewportChanged', () => {
    // Адаптація при зміні розміру
});
```

### 4. Робота з темою

```javascript
// Отримання параметрів теми
const themeParams = tg.themeParams;

// Встановлення CSS змінних
document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
```

## Створені файли

### 1. `telegram-utils.js`
Утилітарний клас для роботи з Telegram Mini Apps API, який включає:
- Правильну ініціалізацію
- Налаштування кнопок
- Обробку подій
- Методи для роботи з модалками
- Адаптацію до теми

### 2. Оновлений `faq.html`
FAQ сторінка, яка використовує:
- Нативні методи Telegram замість кастомних модалок
- Правильну ініціалізацію Web App
- Адаптацію до теми користувача
- Обробку всіх необхідних подій

## Переваги нової реалізації

1. **Нативний досвід** - модалки виглядають та поводяться як нативні елементи Telegram
2. **Автоматична адаптація** - автоматичне налаштування під тему користувача
3. **Кращий UX** - консистентний інтерфейс з рештою додатку
4. **Підтримка всіх платформ** - коректна робота на iOS, Android та Desktop
5. **Майбутня сумісність** - автоматичне оновлення при оновленні Telegram

## Приклади використання

### Показати діалог підтвердження
```javascript
telegramUtils.showConfirm(
    'Зв\'язатися з підтримкою?',
    'Натисніть "Так" щоб перейти до чату з підтримкою.',
    (confirmed) => {
        if (confirmed) {
            // Дія при підтвердженні
        }
    }
);
```

### Показати інформаційне повідомлення
```javascript
telegramUtils.showInfo('Успіх', 'Операція виконана успішно!');
```

### Налаштувати кнопки
```javascript
telegramUtils.setupButtons();
```

## Висновок

Нова реалізація повністю відповідає офіційній документації Telegram Mini Apps та забезпечує:
- Правильну роботу з модалками
- Автоматичну адаптацію до теми
- Консистентний користувацький досвід
- Майбутню сумісність з оновленнями API

Всі кастомні модалки замінені на нативні методи Telegram, що забезпечує кращу інтеграцію з платформою та більш професійний вигляд додатку.

# SkillKlan Telegram Bot - Systemd Service Setup

Цей документ описує налаштування автозапуску Telegram бота через systemd сервіс.

## 📋 Вимоги

- Linux система з systemd (Ubuntu 16.04+, CentOS 7+, Debian 8+)
- Node.js 16+ встановлений
- Права root (sudo) для встановлення сервісу
- Telegram Bot Token налаштований

## 🚀 Швидке встановлення

### 1. Клонування репозиторію
```bash
git clone <repository-url>
cd tg-onboarding
git checkout feature/autostart-systemd
```

### 2. Запуск скрипта встановлення
```bash
sudo systemd/install-service.sh
```

Скрипт автоматично:
- Створить користувача `skillklan-bot`
- Створить необхідні директорії
- Скопіює файли проекту
- Встановить залежності
- Налаштує systemd сервіс
- Налаштує логування

## 📁 Структура файлів

```
systemd/
├── skillklan-bot.service      # Файл systemd сервісу
├── install-service.sh         # Скрипт встановлення
├── manage-service.sh          # Скрипт управління сервісом
├── uninstall-service.sh       # Скрипт видалення сервісу
├── validate-config.sh         # Скрипт перевірки конфігурації
└── README.md                  # Цей файл
```

## 🎮 Управління сервісом

### Використання скрипта управління
```bash
# Запуск сервісу
sudo systemd/manage-service.sh start

# Зупинка сервісу
sudo systemd/manage-service.sh stop

# Перезапуск сервісу
sudo systemd/manage-service.sh restart

# Перевірка статусу
sudo systemd/manage-service.sh status

# Перегляд логів
sudo systemd/manage-service.sh logs 100

# Слідкування за логами в реальному часі
sudo systemd/manage-service.sh follow

# Перевірка конфігурації
sudo systemd/manage-service.sh config

# Перевірка автозапуску
sudo systemd/manage-service.sh autostart

# Перевірка залежностей
sudo systemd/manage-service.sh deps

# Перевірка ресурсів
sudo systemd/manage-service.sh resources
```

### Прямі команди systemctl
```bash
# Запуск
sudo systemctl start skillklan-bot.service

# Зупинка
sudo systemctl stop skillklan-bot.service

# Перезапуск
sudo systemctl restart skillklan-bot.service

# Перевірка статусу
sudo systemctl status skillklan-bot.service

# Перегляд логів
sudo journalctl -u skillklan-bot.service -f

# Перезавантаження конфігурації
sudo systemctl reload skillklan-bot.service
```

## 🔍 Перевірка та валідація

### Перевірка конфігурації
```bash
# Повна перевірка
sudo systemd/validate-config.sh

# Генерація звіту
sudo systemd/validate-config.sh report

# Довідка
sudo systemd/validate-config.sh help
```

### Що перевіряється
- Наявність systemd
- Наявність сервісу
- Валідність конфігурації
- Статус сервісу
- Налаштування автозапуску
- Користувач та група
- Директорії та файли
- Залежності Node.js
- Логування
- Мережеві налаштування
- Використання ресурсів

## 🗑️ Видалення сервісу

### Використання скрипта видалення
```bash
# Звичайне видалення з підтвердженням
sudo systemd/uninstall-service.sh

# Примусове видалення без підтвердження
sudo systemd/uninstall-service.sh --force

# Довідка
sudo systemd/uninstall-service.sh --help
```

### Що видаляється
- Systemd сервіс
- Користувач skillklan-bot
- Група skillklan-bot
- Директорія /opt/skillklan-bot
- Logrotate конфігурація
- Всі логи та дані

## 📊 Моніторинг та логування

### Перегляд логів
```bash
# Останні 50 рядків
sudo journalctl -u skillklan-bot.service -n 50

# Логи за сьогодні
sudo journalctl -u skillklan-bot.service --since today

# Логи за конкретну дату
sudo journalctl -u skillklan-bot.service --since "2024-01-01" --until "2024-01-02"

# Логи з фільтрацією по рівню
sudo journalctl -u skillklan-bot.service -p err
```

### Автоматична ротація логів
Скрипт встановлення автоматично створює logrotate конфігурацію:
- Щоденна ротація
- Збереження 7 файлів
- Стиснення старих логів
- Автоматичне перезавантаження сервісу

## 🔧 Налаштування конфігурації

### Змінні середовища
Основні змінні в файлі `.env`:
```bash
BOT_TOKEN=your_telegram_bot_token
NODE_ENV=production
PORT=3000
```

### Налаштування systemd
Файл сервісу знаходиться в `/etc/systemd/system/skillklan-bot.service`

Основні параметри:
- `Restart=always` - автоматичний перезапуск при збоях
- `RestartSec=10` - затримка перед перезапуском
- `User=skillklan-bot` - користувач для запуску
- `WorkingDirectory=/opt/skillklan-bot` - робочий каталог

## 🚨 Вирішення проблем

### Сервіс не запускається
```bash
# Перевірка статусу
sudo systemctl status skillklan-bot.service

# Перегляд детальних логів
sudo journalctl -u skillklan-bot.service -n 100 --no-pager

# Перевірка конфігурації
sudo systemctl cat skillklan-bot.service

# Перевірка через скрипт валідації
sudo systemd/validate-config.sh
```

### Проблеми з правами доступу
```bash
# Перевірка власника файлів
sudo ls -la /opt/skillklan-bot/

# Виправлення прав доступу
sudo chown -R skillklan-bot:skillklan-bot /opt/skillklan-bot
sudo chmod 755 /opt/skillklan-bot
sudo chmod 600 /opt/skillklan-bot/config/.env
```

### Проблеми з Node.js
```bash
# Перевірка версії Node.js
node --version

# Перевірка шляху
which node

# Перевірка залежностей
cd /opt/skillklan-bot
npm list
```

## 🔒 Безпека

### Обмеження прав доступу
Сервіс налаштований з обмеженнями безпеки:
- `NoNewPrivileges=true` - заборона отримання нових привілеїв
- `PrivateTmp=true` - приватна /tmp директорія
- `ProtectSystem=strict` - захист системних файлів
- `ProtectHome=true` - захист домашніх директорій

### Ізоляція процесу
- Запуск від окремого користувача
- Обмеження доступу до файлової системи
- Обмеження ресурсів (файлові дескриптори, процеси)

## 📈 Масштабування

### Кілька екземплярів
Для запуску кількох екземплярів бота:
1. Скопіювати файл сервісу з новою назвою
2. Змінити порт та шляхи
3. Налаштувати балансування навантаження

### Кластеризація
Для високої доступності:
1. Налаштувати keepalived
2. Налаштувати haproxy
3. Синхронізувати конфігурацію між серверами

## 🔄 Оновлення

### Оновлення коду
```bash
# Зупинка сервісу
sudo systemctl stop skillklan-bot.service

# Оновлення файлів
sudo cp -r new_src /opt/skillklan-bot/src

# Встановлення нових залежностей
cd /opt/skillklan-bot
sudo -u skillklan-bot npm ci --production

# Запуск сервісу
sudo systemctl start skillklan-bot.service
```

### Оновлення конфігурації
```bash
# Копіювання нової конфігурації
sudo cp new_config /opt/skillklan-bot/config/

# Перезавантаження сервісу
sudo systemctl reload skillklan-bot.service
```

## 📚 Корисні команди

### Перевірка системи
```bash
# Статус всіх сервісів
sudo systemctl list-units --type=service --state=running

# Залежності сервісу
sudo systemctl list-dependencies skillklan-bot.service

# Використання ресурсів
sudo systemctl show skillklan-bot.service --property=MainPID
```

### Діагностика
```bash
# Перевірка мережі
sudo netstat -tlnp | grep :3000

# Перевірка процесів
sudo ps aux | grep skillklan-bot

# Перевірка файлів
sudo find /opt/skillklan-bot -type f -exec ls -la {} \;
```

## 🤝 Підтримка

При виникненні проблем:
1. Перевірте логи: `sudo journalctl -u skillklan-bot.service -f`
2. Перевірте статус: `sudo systemctl status skillklan-bot.service`
3. Перевірте конфігурацію: `sudo systemctl cat skillklan-bot.service`
4. Запустіть валідацію: `sudo systemd/validate-config.sh`
5. Створіть Issue в репозиторії з деталями помилки

## 📋 Чек-лист встановлення

- [ ] Клоновано репозиторій
- [ ] Переключено на гілку `feature/autostart-systemd`
- [ ] Запущено скрипт встановлення: `sudo systemd/install-service.sh`
- [ ] Перевірено статус сервісу: `sudo systemctl status skillklan-bot.service`
- [ ] Перевірено автозапуск: `sudo systemctl is-enabled skillklan-bot.service`
- [ ] Запущено сервіс: `sudo systemctl start skillklan-bot.service`
- [ ] Перевірено логи: `sudo journalctl -u skillklan-bot.service -f`
- [ ] Протестовано роботу бота

---

**SkillKlan Telegram Bot** - надійний автозапуск з systemd! 🚀

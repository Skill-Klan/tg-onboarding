# SkillKlan Telegram Bot - Огляд скриптів Systemd

Цей документ містить огляд всіх скриптів, створених для налаштування автозапуску Telegram бота через systemd.

## 📁 Структура файлів

```
systemd/
├── skillklan-bot.service      # Файл systemd сервісу
├── install-service.sh         # Скрипт встановлення
├── manage-service.sh          # Скрипт управління сервісом
├── uninstall-service.sh       # Скрипт видалення сервісу
├── validate-config.sh         # Скрипт перевірки конфігурації
├── check-dependencies.sh      # Скрипт перевірки залежностей
├── README.md                  # Основна документація
└── SCRIPTS_OVERVIEW.md       # Цей файл
```

## 🔧 Детальний опис скриптів

### 1. `skillklan-bot.service`
**Призначення**: Основний файл systemd сервісу

**Функції**:
- Визначає параметри запуску сервісу
- Налаштовує автоматичний перезапуск при збоях
- Встановлює обмеження безпеки
- Налаштовує логування через journald
- Визначає залежності та ресурси

**Ключові параметри**:
- `Restart=always` - автоматичний перезапуск
- `RestartSec=10` - затримка перед перезапуском
- `User=skillklan-bot` - користувач для запуску
- `WorkingDirectory=/opt/skillklan-bot` - робочий каталог

### 2. `install-service.sh`
**Призначення**: Автоматичне встановлення та налаштування сервісу

**Функції**:
- Перевіряє системні вимоги
- Створює користувача та групу `skillklan-bot`
- Створює необхідні директорії
- Копіює файли проекту
- Встановлює залежності Node.js
- Налаштовує systemd сервіс
- Налаштовує logrotate для ротації логів

**Використання**:
```bash
sudo systemd/install-service.sh
```

**Перевірки**:
- Права root (sudo)
- Наявність Node.js
- Доступність директорій
- Валідність конфігурації

### 3. `manage-service.sh`
**Призначення**: Управління встановленим сервісом

**Функції**:
- Запуск/зупинка/перезапуск сервісу
- Перевірка статусу
- Перегляд логів
- Перевірка конфігурації
- Моніторинг ресурсів
- Перевірка залежностей

**Команди**:
```bash
sudo systemd/manage-service.sh start      # Запуск
sudo systemd/manage-service.sh stop       # Зупинка
sudo systemd/manage-service.sh restart    # Перезапуск
sudo systemd/manage-service.sh status     # Статус
sudo systemd/manage-service.sh logs 100   # Логи (100 рядків)
sudo systemd/manage-service.sh follow     # Логи в реальному часі
sudo systemd/manage-service.sh config     # Конфігурація
sudo systemd/manage-service.sh autostart  # Автозапуск
sudo systemd/manage-service.sh deps       # Залежності
sudo systemd/manage-service.sh resources  # Ресурси
```

### 4. `uninstall-service.sh`
**Призначення**: Повне видалення сервісу та всіх пов'язаних файлів

**Функції**:
- Зупинка та видалення сервісу
- Видалення користувача та групи
- Очищення директорій та файлів
- Видалення logrotate конфігурації
- Очищення логів
- Перевірка залишків

**Використання**:
```bash
sudo systemd/uninstall-service.sh         # З підтвердженням
sudo systemd/uninstall-service.sh --force # Без підтвердження
```

**Безпека**:
- Запитує підтвердження перед видаленням
- Показує список того, що буде видалено
- Можна примусово видалити без підтвердження

### 5. `validate-config.sh`
**Призначення**: Перевірка та валідація всіх налаштувань

**Функції**:
- Перевірка наявності systemd
- Валідація конфігурації сервісу
- Перевірка статусу сервісу
- Перевірка налаштувань автозапуску
- Перевірка користувача та групи
- Перевірка директорій та файлів
- Перевірка залежностей Node.js
- Перевірка логування
- Перевірка мережевих налаштувань
- Перевірка використання ресурсів

**Використання**:
```bash
sudo systemd/validate-config.sh           # Повна перевірка
sudo systemd/validate-config.sh report    # Генерація звіту
sudo systemd/validate-config.sh help      # Довідка
```

**Звіт**:
- Генерує детальний звіт у `/tmp/skillklan-bot-validation-report.txt`
- Містить результати всіх перевірок
- Показує помилки та попередження

### 6. `check-dependencies.sh`
**Призначення**: Перевірка системних залежностей та вимог

**Функції**:
- Перевірка операційної системи
- Перевірка наявності systemd
- Перевірка Node.js та npm
- Перевірка системних утиліт
- Перевірка прав доступу
- Перевірка мережевих налаштувань
- Перевірка файлової системи
- Перевірка системних ресурсів
- Перевірка безпеки (SELinux, AppArmor, firewall)

**Використання**:
```bash
sudo systemd/check-dependencies.sh        # Перевірка
sudo systemd/check-dependencies.sh report # Звіт
sudo systemd/check-dependencies.sh help   # Довідка
```

**Перевірки безпеки**:
- SELinux статус
- AppArmor активність
- Firewall налаштування
- Мережеві порти
- Системні ресурси

## 🚀 Послідовність використання

### 1. Підготовка
```bash
# Перевірка залежностей
sudo systemd/check-dependencies.sh

# Перевірка системних вимог
sudo systemd/check-dependencies.sh report
```

### 2. Встановлення
```bash
# Автоматичне встановлення
sudo systemd/install-service.sh

# Перевірка встановлення
sudo systemd/validate-config.sh
```

### 3. Управління
```bash
# Запуск сервісу
sudo systemd/manage-service.sh start

# Перевірка статусу
sudo systemd/manage-service.sh status

# Перегляд логів
sudo systemd/manage-service.sh follow
```

### 4. Моніторинг
```bash
# Перевірка ресурсів
sudo systemd/manage-service.sh resources

# Перевірка залежностей
sudo systemd/manage-service.sh deps

# Валідація конфігурації
sudo systemd/validate-config.sh
```

### 5. Видалення (за потреби)
```bash
# Видалення з підтвердженням
sudo systemd/uninstall-service.sh

# Примусове видалення
sudo systemd/uninstall-service.sh --force
```

## 🔍 Діагностика та налагодження

### Перевірка статусу
```bash
# Системний статус
sudo systemctl status skillklan-bot.service

# Детальна інформація
sudo systemctl show skillklan-bot.service

# Логи в реальному часі
sudo journalctl -u skillklan-bot.service -f
```

### Перевірка конфігурації
```bash
# Валідація всіх налаштувань
sudo systemd/validate-config.sh

# Перевірка залежностей
sudo systemd/check-dependencies.sh

# Генерація звітів
sudo systemd/validate-config.sh report
sudo systemd/check-dependencies.sh report
```

### Вирішення проблем
```bash
# Перезапуск сервісу
sudo systemd/manage-service.sh restart

# Перезавантаження конфігурації
sudo systemd/manage-service.sh reload

# Перевірка ресурсів
sudo systemd/manage-service.sh resources
```

## 📊 Моніторинг та логування

### Автоматичне логування
- Всі логи зберігаються в systemd journal
- Автоматична ротація через logrotate
- Стиснення старих логів
- Збереження 7 файлів логів

### Перегляд логів
```bash
# Останні логи
sudo journalctl -u skillklan-bot.service -n 50

# Логи за період
sudo journalctl -u skillklan-bot.service --since "1 hour ago"

# Логи з фільтрацією
sudo journalctl -u skillklan-bot.service -p err
```

## 🔒 Безпека

### Обмеження прав доступу
- Запуск від окремого користувача
- Ізоляція процесу
- Обмеження доступу до файлової системи
- Обмеження системних ресурсів

### Налаштування безпеки
- `NoNewPrivileges=true`
- `PrivateTmp=true`
- `ProtectSystem=strict`
- `ProtectHome=true`

## 📈 Масштабування

### Кілька екземплярів
1. Скопіювати файл сервісу
2. Змінити назву та порт
3. Налаштувати балансування

### Кластеризація
1. Налаштувати keepalived
2. Налаштувати haproxy
3. Синхронізувати конфігурацію

## 🤝 Підтримка

### При виникненні проблем
1. Запустити валідацію: `sudo systemd/validate-config.sh`
2. Перевірити залежності: `sudo systemd/check-dependencies.sh`
3. Переглянути логи: `sudo systemd/manage-service.sh follow`
4. Створити Issue в репозиторії

### Корисні команди
```bash
# Повна діагностика
sudo systemd/validate-config.sh && sudo systemd/check-dependencies.sh

# Генерація звітів
sudo systemd/validate-config.sh report
sudo systemd/check-dependencies.sh report

# Перегляд звітів
cat /tmp/skillklan-bot-validation-report.txt
cat /tmp/skillklan-bot-dependencies-report.txt
```

---

**SkillKlan Telegram Bot** - комплексне рішення для автозапуску з systemd! 🚀

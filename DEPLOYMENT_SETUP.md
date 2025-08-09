# 🚀 Налаштування автоматичного деплою

## 🔐 Секрети які потрібно додати в GitHub

Перейдіть до: **Repository → Settings → Secrets and variables → Actions**

### Обов'язкові секрети:

| Назва | Опис | Приклад |
|-------|------|---------|
| `BOT_TOKEN` | Токен Telegram бота | `1234567890:ABCdef...` |
| `HOST` | IP адреса або домен сервера | `192.168.1.100` або `yourdomain.com` |
| `USERNAME` | Ім'я користувача на сервері | `ubuntu` або `root` |
| `SSH_PRIVATE_KEY` | Приватний SSH ключ | (див. інструкцію нижче) |

## 🔑 Налаштування SSH ключів

### 1. Генерація SSH ключів (на вашій машині)
```bash
# Створити новий SSH ключ для деплою
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Або RSA якщо ed25519 не підтримується
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy
```

### 2. Додавання публічного ключа на сервер
```bash
# Скопіювати публічний ключ на сервер
ssh-copy-id -i ~/.ssh/github_deploy.pub username@your-server-ip

# Або вручну додати до authorized_keys
cat ~/.ssh/github_deploy.pub | ssh username@your-server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3. Додавання приватного ключа в GitHub Secrets
```bash
# Показати приватний ключ для копіювання
cat ~/.ssh/github_deploy

# Скопіювати весь вміст (включно з -----BEGIN і -----END)
# і вставити в GitHub Secret SSH_PRIVATE_KEY
```

## 🖥️ Підготовка сервера

### 1. Встановлення необхідних пакетів
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm git

# Перевірка версій
node --version  # Має бути 18+
npm --version
git --version
```

### 2. Створення директорії для деплою
```bash
# Створити директорію (змініть шлях в deploy.yml якщо потрібно)
sudo mkdir -p /home/ubuntu/apps/tg-onboarding
sudo chown $USER:$USER /home/ubuntu/apps/tg-onboarding
```

### 3. Налаштування Git (якщо потрібно)
```bash
git config --global user.name "Deploy Bot"
git config --global user.email "deploy@yourdomain.com"
```

## 🔄 Як працює автодеплой

### Тригери:
- ✅ Push в гілку `main` або `master`
- ✅ Злиття Pull Request в main

### Процес:
1. **Тестування** - валідація коду та конфігурації
2. **SSH підключення** - безпечне з'єднання з сервером
3. **Оновлення коду** - git pull останніх змін
4. **Встановлення залежностей** - npm ci
5. **Налаштування середовища** - створення .env
6. **Перезапуск бота** - зупинка старого, запуск нового
7. **Health check** - перевірка що бот працює

### Логування:
- Логи деплою: GitHub Actions
- Логи бота: `/home/ubuntu/apps/tg-onboarding/bot.log`

## 🛠️ Корисні команди для сервера

```bash
# Перевірити статус бота
ps aux | grep "node.*index.mjs"

# Подивитись логи
tail -f /home/ubuntu/apps/tg-onboarding/bot.log

# Перезапустити бота вручну
cd /home/ubuntu/apps/tg-onboarding/tg_bot
pkill -f "node.*index.mjs"
nohup npm start > ../bot.log 2>&1 &

# Перевірити порти
netstat -tlnp | grep :3000
```

## 🔧 Налаштування змінних в deploy.yml

Відредагуйте ці змінні в `.github/workflows/deploy.yml`:

```yaml
env:
  NODE_VERSION: '18'                                    # Версія Node.js
  APP_NAME: 'tg-onboarding-bot'                        # Назва додатку  
  DEPLOY_PATH: '/home/ubuntu/apps/tg-onboarding'       # Шлях на сервері
```

## 🚨 Troubleshooting

### SSH помилки:
```bash
# Перевірити SSH підключення
ssh -i ~/.ssh/github_deploy username@your-server-ip

# Перевірити права на ключі
chmod 600 ~/.ssh/github_deploy
chmod 644 ~/.ssh/github_deploy.pub
```

### Проблеми з ботом:
```bash
# Перевірити логи
tail -20 /home/ubuntu/apps/tg-onboarding/bot.log

# Перевірити змінні середовища
cd /home/ubuntu/apps/tg-onboarding/tg_bot
cat .env
npm run validate
```

### Проблеми з портами:
```bash
# Звільнити порт якщо зайнятий
sudo lsof -i :3000
sudo kill -9 PID
```

## ✅ Готово!

Після налаштування всіх секретів та SSH:
1. Зробіть push в main гілку
2. Перевірте GitHub Actions
3. Бот автоматично деплоїться на ваш сервер!

🎉 **Автоматичний деплой налаштовано!**

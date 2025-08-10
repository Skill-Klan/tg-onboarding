# 🔐 Налаштування секретів GitHub для автоматичного деплою

## 📍 Де знайти секрети

Перейдіть до вашого репозиторію на GitHub:
1. **Settings** → **Secrets and variables** → **Actions**
2. Натисніть **New repository secret**
3. Додайте кожен секрет окремо

## 🔑 Обов'язкові секрети

### 1. BOT_TOKEN
**Опис:** Токен вашого Telegram бота від @BotFather

**Як отримати:**
1. Відкрийте Telegram
2. Знайдіть @BotFather
3. Відправте `/newbot` (якщо бота ще немає)
4. Введіть назву бота
5. Введіть username (має закінчуватися на 'bot')
6. Скопіюйте отриманий токен

**Приклад:** `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

---

### 2. HOST
**Опис:** IP адреса або домен вашого сервера

**Як знайти:**
```bash
# На сервері
curl ifconfig.me
# або
hostname -I
```

**Приклад:** `192.168.1.100` або `yourdomain.com`

---

### 3. USERNAME
**Опис:** Ім'я користувача на сервері

**Як знайти:**
```bash
# На сервері
whoami
```

**Приклад:** `ubuntu`, `root`, `deploy`

---

### 4. SSH_PRIVATE_KEY
**Опис:** Приватний SSH ключ для підключення до сервера

**Як створити:**
```bash
# На вашій локальній машині
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Або RSA (якщо ed25519 не підтримується)
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy
```

**Як додати в GitHub:**
```bash
# Показати приватний ключ
cat ~/.ssh/github_deploy

# Скопіювати ВСЕ (включно з -----BEGIN і -----END)
# і вставити в GitHub Secret SSH_PRIVATE_KEY
```

## 🔧 Налаштування SSH на сервері

### 1. Додавання публічного ключа
```bash
# Скопіювати публічний ключ на сервер
ssh-copy-id -i ~/.ssh/github_deploy.pub username@your-server-ip

# Або вручну
cat ~/.ssh/github_deploy.pub | ssh username@your-server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 2. Перевірка прав доступу
```bash
# На сервері
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/authorized_keys
```

### 3. Тестування SSH підключення
```bash
# З вашої машини
ssh -i ~/.ssh/github_deploy username@your-server-ip
```

## 📋 Перевірка налаштувань

### 1. Перевірка секретів
```bash
# В GitHub репозиторії
Settings → Secrets and variables → Actions
# Переконайтеся що всі 4 секрети додані
```

### 2. Тестування деплою
```bash
# Зробіть невелику зміну в коді
echo "# test" >> README.md

# Commit та push
git add README.md
git commit -m "test deployment"
git push origin main
```

### 3. Перевірка GitHub Actions
1. Перейдіть до **Actions** в репозиторії
2. Знайдіть workflow "🚀 Auto Deploy Bot to Server"
3. Перевірте що всі кроки пройшли успішно

## 🚨 Поширені помилки

### SSH помилки
```
❌ SSH connection failed!
💡 Possible solutions:
   1. Check HOST secret is correct IP: 192.168.1.100
   2. Check USERNAME secret: ubuntu
   3. Check SSH_PRIVATE_KEY is complete
   4. Ensure server is accessible from GitHub Actions
```

**Рішення:**
- Перевірте що IP адреса правильна
- Переконайтеся що SSH ключ доданий на сервер
- Перевірте що сервер доступний з інтернету

### Помилки з токеном
```
❌ BOT_TOKEN не знайдено!
```

**Рішення:**
- Перевірте що BOT_TOKEN доданий в GitHub Secrets
- Переконайтеся що токен правильний (включає двоокрапку)
- Перевірте що бот не заблокований

### Помилки з правами доступу
```
❌ Permission denied (publickey)
```

**Рішення:**
- Перевірте що публічний ключ доданий в `~/.ssh/authorized_keys`
- Перевірте права доступу на файли SSH
- Переконайтеся що користувач має доступ до директорії деплою

## ✅ Чек-лист налаштування

- [ ] Створено SSH ключі
- [ ] Публічний ключ додано на сервер
- [ ] BOT_TOKEN додано в GitHub Secrets
- [ ] HOST додано в GitHub Secrets
- [ ] USERNAME додано в GitHub Secrets
- [ ] SSH_PRIVATE_KEY додано в GitHub Secrets
- [ ] Протестовано SSH підключення
- [ ] Зроблено тестовий push
- [ ] GitHub Actions workflow пройшов успішно

## 🆘 Отримання допомоги

Якщо у вас виникли проблеми:

1. **Перевірте логи GitHub Actions** - вони покажуть детальну інформацію про помилку
2. **Перевірте SSH підключення** - спробуйте підключитися вручну
3. **Перевірте права доступу** - на сервері та в GitHub
4. **Створіть Issue** - з детальним описом проблеми

---

🎯 **Після налаштування всіх секретів ваш бот буде автоматично деплоїтися при кожному push в main гілку!**

# 🔧 SSH Troubleshooting для GitHub Actions

## ❌ Помилка: "Add Server to Known Hosts failed"

### 🚨 **Що сталося:**
GitHub Actions не може підключитися до вашого сервера для додавання до known_hosts.

### 🔍 **Можливі причини:**

#### 1. **Сервер недоступний з інтернету**
Ваш IP `192.168.0.110` - це локальний IP, недоступний з GitHub Actions.

**Рішення:**
```bash
# Дізнатися зовнішній IP
curl ifconfig.me
# Або
curl ipinfo.io/ip

# Використовувати цей IP в GitHub Secret HOST
```

#### 2. **Firewall блокує підключення**
```bash
# Перевірити чи SSH відкритий
sudo ufw status
sudo ufw allow 22

# Перевірити SSH сервіс
sudo systemctl status ssh
sudo systemctl enable ssh
sudo systemctl start ssh
```

#### 3. **SSH не налаштований для зовнішніх підключень**
```bash
# Відредагувати SSH конфігурацію
sudo nano /etc/ssh/sshd_config

# Перевірити/додати:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 22

# Перезапустити SSH
sudo systemctl restart ssh
```

## 🛠️ **Альтернативні рішення:**

### Варіант 1: **Локальний деплой**
Якщо сервер доступний тільки локально:
```bash
# Використовувати локальний скрипт замість GitHub Actions
BOT_TOKEN=ваш_токен ./deploy.sh deploy
```

### Варіант 2: **ngrok для тестування**
```bash
# Встановити ngrok
sudo snap install ngrok

# Відкрити SSH тунель
ngrok tcp 22

# Використовувати ngrok URL в GitHub Secret HOST
# Наприклад: 0.tcp.ngrok.io:12345
```

### Варіант 3: **VPN або хмарний сервер**
- Використовувати VPS (DigitalOcean, AWS, etc.)
- Налаштувати VPN для доступу до локального сервера

## ✅ **Перевірка SSH доступу**

### З локальної машини:
```bash
# Тест підключення
ssh -i ~/.ssh/github_deploy roman@192.168.0.110 'echo OK'

# Тест з зовнішнього IP
ssh -i ~/.ssh/github_deploy roman@ваш_зовнішній_ip 'echo OK'
```

### З GitHub Actions (симуляція):
```bash
# Тест ssh-keyscan
ssh-keyscan -H ваш_ip

# Має повернути публічний ключ сервера
```

## 🔄 **Виправлення в deploy.yml**

Файл вже оновлено з:
- ✅ Обробка помилок ssh-keyscan
- ✅ StrictHostKeyChecking=no як fallback
- ✅ Тест SSH підключення перед деплоєм
- ✅ Детальні повідомлення про помилки

## 📋 **Швидке рішення:**

1. **Дізнатися зовнішній IP:**
   ```bash
   curl ifconfig.me
   ```

2. **Оновити GitHub Secret HOST** на зовнішній IP

3. **Переконатися що SSH доступний:**
   ```bash
   sudo ufw allow 22
   sudo systemctl enable ssh
   ```

4. **Протестувати ще раз** GitHub Actions

## 🆘 **Якщо нічого не допомагає:**

Використовуйте **локальний деплой** замість GitHub Actions:
```bash
BOT_TOKEN=ваш_токен ./deploy.sh deploy
```

Це працюватиме навіть без зовнішнього доступу до сервера!

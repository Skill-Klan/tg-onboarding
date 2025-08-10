# 🚀 DevOps та розгортання SkillKlan Telegram Bot

## 🎯 Огляд розгортання

Цей документ описує процес розгортання SkillKlan Telegram Bot в різних середовищах:
- **Development** - локальна розробка
- **Staging** - тестування перед продакшн
- **Production** - робоче середовище

## 🏗 Інфраструктура

### Рекомендована архітектура
```
Internet → Load Balancer → Web Server → Node.js App → Database
    ↓           ↓           ↓           ↓           ↓
  HTTPS     Nginx      PM2/Systemd   Bot API    Redis/PostgreSQL
```

### Системні вимоги
- **OS:** Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM:** Мінімум 2GB, рекомендовано 4GB+
- **CPU:** 2 ядра, рекомендовано 4 ядра
- **Disk:** 20GB+ для системи + 10GB+ для логів
- **Network:** Стабільне інтернет-з'єднання

## 🔧 Підготовка сервера

### 1. Оновлення системи
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
# або
sudo dnf update -y
```

### 2. Встановлення Node.js
```bash
# Використання NodeSource репозиторію
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Перевірка версії
node --version  # Повинно бути v18.x.x
npm --version   # Повинно бути 8.x.x+
```

### 3. Встановлення PM2
```bash
sudo npm install -g pm2

# Налаштування автозапуску
pm2 startup
# Виконайте команду, яку видасть PM2
```

### 4. Встановлення Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# Запуск та автозапуск
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Налаштування файрвола
```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 📦 Розгортання додатку

### 1. Клонування репозиторію
```bash
# Створення директорії
sudo mkdir -p /var/www/skillklan-bot
sudo chown $USER:$USER /var/www/skillklan-bot

# Клонування
cd /var/www/skillklan-bot
git clone <repository-url> .
```

### 2. Встановлення залежностей
```bash
# Встановлення залежностей
npm ci --only=production

# Створення .env файлу
cp .env.example .env
nano .env
```

### 3. Налаштування змінних середовища
```bash
# .env файл для продакшн
BOT_TOKEN=your_production_bot_token
NODE_ENV=production
PORT=3000
WEBHOOK_URL=https://your-domain.com/webhook
CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
LOG_LEVEL=info
LOG_FILE=/var/log/skillklan-bot/bot.log
SESSION_SECRET=your_very_long_random_secret_here
```

### 4. Налаштування логування
```bash
# Створення директорії для логів
sudo mkdir -p /var/log/skillklan-bot
sudo chown $USER:$USER /var/log/skillklan-bot

# Створення logrotate конфігурації
sudo nano /etc/logrotate.d/skillklan-bot
```

```bash
# /etc/logrotate.d/skillklan-bot
/var/log/skillklan-bot/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 🌐 Налаштування Nginx

### 1. Створення конфігурації сайту
```bash
sudo nano /etc/nginx/sites-available/skillklan-bot
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL сертифікати
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL налаштування
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Безпека
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Логи
    access_log /var/log/nginx/skillklan-bot.access.log;
    error_log /var/log/nginx/skillklan-bot.error.log;
    
    # Проксування до Node.js додатку
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Статичні файли
    location /public/ {
        alias /var/www/skillklan-bot/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
    
    # Метрики (захищені)
    location /metrics {
        auth_basic "Metrics";
        auth_basic_user_file /etc/nginx/.htpasswd;
        proxy_pass http://127.0.0.1:3000;
    }
}
```

### 2. Активація сайту
```bash
# Створення символічного посилання
sudo ln -s /etc/nginx/sites-available/skillklan-bot /etc/nginx/sites-enabled/

# Перевірка конфігурації
sudo nginx -t

# Перезавантаження Nginx
sudo systemctl reload nginx
```

## 🔐 SSL сертифікати з Let's Encrypt

### 1. Встановлення Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### 2. Отримання сертифіката
```bash
# Автоматичне налаштування
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Або тільки сертифікат
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

### 3. Автоматичне оновлення
```bash
# Тестування auto-renewal
sudo certbot renew --dry-run

# Додавання в crontab
sudo crontab -e

# Додайте рядок:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Запуск з PM2

### 1. Створення PM2 конфігурації
```bash
# Створення ecosystem.config.js
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'skillklan-bot',
    script: 'src/index.mjs',
    cwd: '/var/www/skillklan-bot',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env',
    log_file: '/var/log/skillklan-bot/combined.log',
    out_file: '/var/log/skillklan-bot/out.log',
    error_file: '/var/log/skillklan-bot/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log'],
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 8000
  }]
};
```

### 2. Запуск додатку
```bash
# Запуск з конфігурацією
pm2 start ecosystem.config.js

# Збереження конфігурації
pm2 save

# Налаштування автозапуску
pm2 startup
```

### 3. Корисні PM2 команди
```bash
# Статус
pm2 status

# Логи
pm2 logs skillklan-bot
pm2 logs skillklan-bot --lines 100

# Перезапуск
pm2 restart skillklan-bot

# Оновлення
pm2 reload skillklan-bot

# Зупинка
pm2 stop skillklan-bot

# Видалення
pm2 delete skillklan-bot
```

## 📊 Моніторинг та логування

### 1. Налаштування логування
```javascript
// src/utils/logger.js
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: '/var/log/skillklan-bot/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

### 2. Health check endpoint
```javascript
// src/server.js
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  };
  
  res.json(health);
});
```

### 3. Метрики
```javascript
// src/utils/metrics.js
class Metrics {
  constructor() {
    this.requests = 0;
    this.errors = 0;
    this.startTime = Date.now();
  }
  
  incrementRequests() {
    this.requests++;
  }
  
  incrementErrors() {
    this.errors++;
  }
  
  getStats() {
    return {
      requests: this.requests,
      errors: this.errors,
      uptime: Date.now() - this.startTime,
      errorRate: this.requests > 0 ? (this.errors / this.requests * 100).toFixed(2) : 0
    };
  }
}

export const metrics = new Metrics();
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/skillklan-bot
          git pull origin main
          npm ci --only=production
          pm2 reload skillklan-bot
```

### 2. Docker deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  bot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
```

## 🚨 Розв'язання проблем

### 1. Бот не відповідає
```bash
# Перевірка статусу
pm2 status
pm2 logs skillklan-bot

# Перевірка токена
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# Перевірка webhook
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

### 2. Помилки Nginx
```bash
# Перевірка конфігурації
sudo nginx -t

# Перевірка логів
sudo tail -f /var/log/nginx/error.log

# Перезавантаження
sudo systemctl reload nginx
```

### 3. Проблеми з SSL
```bash
# Перевірка сертифіката
sudo certbot certificates

# Оновлення сертифіката
sudo certbot renew

# Перевірка терміну дії
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -text -noout | grep "Not After"
```

### 4. Високе навантаження
```bash
# Перевірка процесів
htop
ps aux | grep node

# Перевірка пам'яті
free -h
df -h

# Перезапуск з обмеженням ресурсів
pm2 restart skillklan-bot --max-memory-restart 1G
```

## 📈 Масштабування

### 1. Горизонтальне масштабування
```bash
# Запуск кількох інстансів
pm2 start ecosystem.config.js -i max

# Балансування навантаження
pm2 start ecosystem.config.js -i 4
```

### 2. Load Balancer
```nginx
# nginx.conf
upstream bot_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    location / {
        proxy_pass http://bot_backend;
    }
}
```

### 3. Redis для сесій
```javascript
// src/config/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0
});

export default redis;
```

## 🔒 Безпека

### 1. Налаштування fail2ban
```bash
# Встановлення
sudo apt install fail2ban -y

# Конфігурація
sudo nano /etc/fail2ban/jail.local
```

```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-bot-requests]
enabled = true
filter = nginx-bot-requests
logpath = /var/log/nginx/skillklan-bot.access.log
maxretry = 100
bantime = 3600
```

### 2. Регулярні оновлення
```bash
# Автоматичні оновлення безпеки
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades

# Налаштування cron для оновлень
sudo crontab -e
# 0 2 * * 0 /usr/bin/apt-get update && /usr/bin/apt-get upgrade -y
```

## 📚 Корисні ресурси

### Документація
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

### Інструменти
- **Моніторинг:** PM2, New Relic, DataDog
- **Логування:** ELK Stack, Graylog, Papertrail
- **SSL:** Let's Encrypt, Certbot
- **Процес менеджер:** PM2, Forever, Systemd

---

## ✅ Чек-лист розгортання

- [ ] Сервер підготовлено (Node.js, PM2, Nginx)
- [ ] Домен налаштовано та DNS налаштовано
- [ ] SSL сертифікат отримано
- [ ] Додаток розгорнуто та запущено
- [ ] Nginx налаштовано та протестовано
- [ ] Логування налаштовано
- [ ] Моніторинг налаштовано
- [ ] Автозапуск налаштовано
- [ ] Безпека налаштована (fail2ban, firewall)
- [ ] Тестування всіх функцій пройдено
- [ ] Документація оновлена

**🎉 Вітаємо! Ваш SkillKlan Telegram Bot успішно розгорнуто в продакшн!**

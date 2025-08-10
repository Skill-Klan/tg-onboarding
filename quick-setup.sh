#!/bin/bash

# 🚀 Швидкий скрипт налаштування та запуску Telegram бота
# Використовуйте цей скрипт для швидкого старту

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "🚀 Швидке налаштування Telegram бота"
echo "======================================"

# Перевірка наявності токена
if [ -z "$BOT_TOKEN" ]; then
    log_warning "BOT_TOKEN не встановлений"
    echo ""
    echo "Встановіть токен бота одним з способів:"
    echo ""
    echo "1. Встановіть змінну середовища:"
    echo "   export BOT_TOKEN='ваш_токен_бота'"
    echo ""
    echo "2. Або запустіть скрипт з токеном:"
    echo "   BOT_TOKEN='ваш_токен_бота' ./quick-setup.sh"
    echo ""
    echo "3. Або введіть токен зараз:"
    read -p "Введіть токен бота: " BOT_TOKEN
    
    if [ -z "$BOT_TOKEN" ]; then
        log_error "Токен не введено. Вихід."
        exit 1
    fi
fi

log_success "Токен бота встановлено"

# Перехід в директорію бота
cd tg_bot

# Перевірка наявності node_modules
if [ ! -d "node_modules" ]; then
    log_info "Встановлення залежностей..."
    npm ci --only=production
    log_success "Залежності встановлено"
else
    log_info "Залежності вже встановлені"
fi

# Створення .env файлу
log_info "Створення .env файлу..."
cat > .env << EOF
BOT_TOKEN=$BOT_TOKEN
NODE_ENV=production
LOG_LEVEL=info
PORT=3000
EOF
log_success ".env файл створено"

# Валідація конфігурації
log_info "Валідація конфігурації..."
if npm run validate; then
    log_success "Конфігурація валідна"
else
    log_warning "Помилка валідації, але продовжуємо..."
fi

# Зупинка старого процесу
log_info "Зупинка старого процесу..."
pkill -f "node.*index.mjs" || log_warning "Старий процес не знайдений"

# Запуск бота
log_info "Запуск бота..."
nohup npm start > ../bot.log 2>&1 &
BOT_PID=$!

# Перевірка запуску
sleep 3
if ps -p $BOT_PID > /dev/null; then
    log_success "Бот успішно запущений (PID: $BOT_PID)"
    echo ""
    echo "📋 Корисні команди:"
    echo "  ./deploy.sh status  - Перевірити статус бота"
    echo "  ./deploy.sh logs    - Подивитися логи"
    echo "  ./deploy.sh         - Запустити повний деплой"
    echo ""
    echo "📁 Файли:"
    echo "  Логи: ../bot.log"
    echo "  Конфігурація: .env"
    echo "  PID: $BOT_PID"
else
    log_error "Помилка запуску бота"
    echo ""
    echo "Останні логи:"
    tail -10 ../bot.log
    echo ""
    echo "Спробуйте запустити вручну:"
    echo "  cd tg_bot && npm start"
    exit 1
fi

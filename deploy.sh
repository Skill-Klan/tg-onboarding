#!/bin/bash

# 🚀 Локальний скрипт деплою для швидкого тестування
# Використовуйте цей скрипт для деплою без GitHub Actions

set -e  # Зупинити при помилці

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфігурація (відредагуйте під свої потреби)
SERVER_HOST="${DEPLOY_HOST:-localhost}"
SERVER_USER="${DEPLOY_USER:-$USER}"
DEPLOY_PATH="${DEPLOY_PATH:-/home/roman/apps/tg-onboarding}"
BOT_TOKEN="${BOT_TOKEN:-}"

# Функції для виводу
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

# Перевірка змінних середовища
check_requirements() {
    log_info "Перевірка вимог..."
    
    if [ -z "$BOT_TOKEN" ]; then
        log_error "BOT_TOKEN не встановлений!"
        log_info "Встановіть: export BOT_TOKEN='ваш_токен'"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        log_error "SSH не знайдено!"
        exit 1
    fi
    
    log_success "Всі вимоги виконані"
}

# Деплой на локальний сервер
deploy_local() {
    log_info "Деплой на локальний сервер..."
    
    # Створити директорію якщо не існує
    mkdir -p "$DEPLOY_PATH"
    cd "$DEPLOY_PATH"
    
    # Клонувати або оновити код
    if [ -d ".git" ]; then
        log_info "Оновлення існуючого репозиторію..."
        git pull origin main
    else
        log_info "Клонування репозиторію..."
        git clone https://github.com/Skill-Klan/tg-onboarding.git .
    fi
    
    # Перейти в директорію бота
    cd tg_bot
    
    # Встановити залежності
    log_info "Встановлення залежностей..."
    npm ci --only=production
    
    # Створити .env файл
    log_info "Налаштування середовища..."
    cat > .env << EOF
BOT_TOKEN=$BOT_TOKEN
NODE_ENV=production
LOG_LEVEL=info
EOF
    
    # Валідація конфігурації
    log_info "Валідація конфігурації..."
    npm run validate
    
    # Зупинити старий процес
    log_info "Зупинка старого процесу..."
    pkill -f "node.*index.mjs" || log_warning "Старий процес не знайдений"
    
    # Запустити новий процес
    log_info "Запуск нового процесу..."
    nohup npm start > ../bot.log 2>&1 &
    BOT_PID=$!
    
    # Перевірка запуску
    sleep 3
    if ps -p $BOT_PID > /dev/null; then
        log_success "Бот успішно запущений (PID: $BOT_PID)"
    else
        log_error "Помилка запуску бота"
        log_info "Останні логи:"
        tail -10 ../bot.log
        exit 1
    fi
}

# Деплой на віддалений сервер
deploy_remote() {
    log_info "Деплой на віддалений сервер $SERVER_USER@$SERVER_HOST..."
    
    # Перевірка SSH підключення
    if ! ssh -o ConnectTimeout=5 "$SERVER_USER@$SERVER_HOST" "echo 'SSH OK'"; then
        log_error "Не вдається підключитися до сервера"
        exit 1
    fi
    
    # Виконання деплою на сервері
    ssh "$SERVER_USER@$SERVER_HOST" << REMOTE_SCRIPT
        set -e
        
        echo "📁 Перехід до директорії деплою..."
        mkdir -p "$DEPLOY_PATH"
        cd "$DEPLOY_PATH"
        
        echo "📥 Оновлення коду..."
        if [ -d ".git" ]; then
            git pull origin main
        else
            git clone https://github.com/Skill-Klan/tg-onboarding.git .
        fi
        
        echo "📦 Встановлення залежностей..."
        cd tg_bot
        npm ci --only=production
        
        echo "🔧 Налаштування середовища..."
        echo "BOT_TOKEN=$BOT_TOKEN" > .env
        echo "NODE_ENV=production" >> .env
        echo "LOG_LEVEL=info" >> .env
        
        echo "✅ Валідація..."
        npm run validate
        
        echo "🔄 Перезапуск бота..."
        pkill -f "node.*index.mjs" || echo "Старий процес не знайдений"
        nohup npm start > ../bot.log 2>&1 &
        
        echo "✅ Деплой завершено!"
REMOTE_SCRIPT
    
    log_success "Віддалений деплой завершено!"
}

# Показ логів
show_logs() {
    if [ "$SERVER_HOST" = "localhost" ]; then
        tail -f "$DEPLOY_PATH/bot.log"
    else
        ssh "$SERVER_USER@$SERVER_HOST" "tail -f $DEPLOY_PATH/bot.log"
    fi
}

# Показ статусу
show_status() {
    log_info "Перевірка статусу бота..."
    
    if [ "$SERVER_HOST" = "localhost" ]; then
        if pgrep -f "node.*index.mjs" > /dev/null; then
            log_success "Бот працює"
            ps aux | grep "node.*index.mjs" | grep -v grep
        else
            log_warning "Бот не працює"
        fi
    else
        ssh "$SERVER_USER@$SERVER_HOST" << 'REMOTE_STATUS'
            if pgrep -f "node.*index.mjs" > /dev/null; then
                echo "✅ Бот працює"
                ps aux | grep "node.*index.mjs" | grep -v grep
            else
                echo "⚠️ Бот не працює"
            fi
REMOTE_STATUS
    fi
}

# Головне меню
case "${1:-deploy}" in
    "deploy")
        check_requirements
        if [ "$SERVER_HOST" = "localhost" ]; then
            deploy_local
        else
            deploy_remote
        fi
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "help")
        echo "Використання: $0 [команда]"
        echo ""
        echo "Команди:"
        echo "  deploy  - Деплой бота (за замовчуванням)"
        echo "  logs    - Показати логи бота"
        echo "  status  - Показати статус бота"
        echo "  help    - Показати цю довідку"
        echo ""
        echo "Змінні середовища:"
        echo "  BOT_TOKEN    - Токен Telegram бота (обов'язково)"
        echo "  DEPLOY_HOST  - Хост сервера (за замовчуванням: localhost)"
        echo "  DEPLOY_USER  - Користувач на сервері (за замовчуванням: \$USER)"
        echo "  DEPLOY_PATH  - Шлях деплою (за замовчуванням: /home/\$USER/apps/tg-onboarding)"
        ;;
    *)
        log_error "Невідома команда: $1"
        log_info "Використовуйте: $0 help"
        exit 1
        ;;
esac

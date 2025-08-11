#!/bin/bash

# SkillKlan Telegram Bot - Systemd Service Installer
# Цей скрипт встановлює та налаштовує systemd сервіс для автозапуску бота

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функція для логування
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Перевірка прав доступу
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "Цей скрипт повинен запускатися з правами root (sudo)"
        exit 1
    fi
}

# Перевірка наявності Node.js
check_nodejs() {
    if ! command -v node &> /dev/null; then
        error "Node.js не знайдено. Встановіть Node.js перед продовженням."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    log "Знайдено Node.js: $NODE_VERSION"
}

# Створення користувача та групи
create_user() {
    if ! id "skillklan-bot" &>/dev/null; then
        log "Створення користувача skillklan-bot..."
        useradd --system --shell /bin/false --home-dir /opt/skillklan-bot skillklan-bot
        success "Користувач skillklan-bot створено"
    else
        log "Користувач skillklan-bot вже існує"
    fi
    
    if ! getent group "skillklan-bot" &>/dev/null; then
        log "Створення групи skillklan-bot..."
        groupadd skillklan-bot
        success "Група skillklan-bot створено"
    else
        log "Група skillklan-bot вже існує"
    fi
}

# Створення директорій
create_directories() {
    log "Створення директорій для бота..."
    
    mkdir -p /opt/skillklan-bot/{logs,data,config}
    mkdir -p /opt/skillklan-bot/src
    
    # Встановлення прав доступу
    chown -R skillklan-bot:skillklan-bot /opt/skillklan-bot
    chmod 755 /opt/skillklan-bot
    chmod 750 /opt/skillklan-bot/{logs,data,config}
    
    success "Директорії створено та налаштовано"
}

# Копіювання файлів проекту
copy_project_files() {
    log "Копіювання файлів проекту..."
    
    # Отримуємо шлях до поточної директорії проекту
    PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
    
    # Копіюємо основні файли
    cp -r "$PROJECT_DIR/tg_bot/src" /opt/skillklan-bot/
    cp -r "$PROJECT_DIR/tg_bot/package.json" /opt/skill-bot/
    cp -r "$PROJECT_DIR/tg_bot/package-lock.json" /opt/skillklan-bot/
    
    # Копіюємо конфігурацію
    if [[ -f "$PROJECT_DIR/tg_bot/.env" ]]; then
        cp "$PROJECT_DIR/tg_bot/.env" /opt/skillklan-bot/config/
        chown skillklan-bot:skillklan-bot /opt/skillklan-bot/config/.env
        chmod 600 /opt/skillklan-bot/config/.env
    else
        warning "Файл .env не знайдено. Створіть його вручну в /opt/skillklan-bot/config/"
    fi
    
    success "Файли проекту скопійовано"
}

# Встановлення залежностей
install_dependencies() {
    log "Встановлення залежностей Node.js..."
    
    cd /opt/skillklan-bot
    npm ci --production
    
    success "Залежності встановлено"
}

# Встановлення systemd сервісу
install_systemd_service() {
    log "Встановлення systemd сервісу..."
    
    # Копіюємо файл сервісу
    cp "$(dirname "${BASH_SOURCE[0]}")/skillklan-bot.service" /etc/systemd/system/
    
    # Перезавантажуємо systemd
    systemctl daemon-reload
    
    # Включаємо автозапуск
    systemctl enable skillklan-bot.service
    
    success "Systemd сервіс встановлено та налаштовано"
}

# Налаштування логування
setup_logging() {
    log "Налаштування логування..."
    
    # Створюємо logrotate конфігурацію
    cat > /etc/logrotate.d/skillklan-bot << EOF
/opt/skillklan-bot/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 skillklan-bot skillklan-bot
    postrotate
        systemctl reload skillklan-bot.service
    endscript
}
EOF
    
    success "Логування налаштовано"
}

# Перевірка встановлення
verify_installation() {
    log "Перевірка встановлення..."
    
    # Перевіряємо статус сервісу
    if systemctl is-enabled skillklan-bot.service &>/dev/null; then
        success "Сервіс увімкнено для автозапуску"
    else
        error "Сервіс не увімкнено для автозапуску"
    fi
    
    # Перевіряємо конфігурацію
    if systemctl cat skillklan-bot.service &>/dev/null; then
        success "Конфігурація сервісу валідна"
    else
        error "Помилка в конфігурації сервісу"
    fi
    
    log "Встановлення завершено!"
    log "Для запуску сервісу виконайте: systemctl start skillklan-bot.service"
    log "Для перевірки статусу: systemctl status skillklan-bot.service"
    log "Для перегляду логів: journalctl -u skillklan-bot.service -f"
}

# Головна функція
main() {
    log "Початок встановлення SkillKlan Telegram Bot systemd сервісу..."
    
    check_permissions
    check_nodejs
    create_user
    create_directories
    copy_project_files
    install_dependencies
    install_systemd_service
    setup_logging
    verify_installation
    
    success "Встановлення завершено успішно!"
}

# Запуск головної функції
main "$@"

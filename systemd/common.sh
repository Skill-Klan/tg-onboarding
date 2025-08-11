#!/bin/bash

# SkillKlan Telegram Bot - Common Utilities
# Спільні функції та змінні для всіх скриптів

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Константи
SERVICE_NAME="skillklan-bot.service"
SERVICE_USER="skillklan-bot"
SERVICE_GROUP="skillklan-bot"
INSTALL_DIR="/opt/skillklan-bot"
PROJECT_NAME="SkillKlan Telegram Bot"

# Функції для логування
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

# Перевірка наявності systemd
check_systemd() {
    if ! command -v systemctl &> /dev/null; then
        error "systemctl не знайдено. Цей скрипт працює тільки з systemd."
        exit 1
    fi
}

# Перевірка наявності Node.js
check_nodejs() {
    if ! command -v node &> /dev/null; then
        error "Node.js не знайдено. Встановіть Node.js перед продовженням."
        return 1
    fi
    
    NODE_VERSION=$(node --version)
    log "Знайдено Node.js: $NODE_VERSION"
    return 0
}

# Перевірка наявності сервісу
check_service() {
    if ! systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
        error "Сервіс $SERVICE_NAME не знайдено. Спочатку встановіть його."
        return 1
    fi
    return 0
}

# Отримання шляху до проекту
get_project_dir() {
    echo "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
}

# Перевірка існування директорії
check_directory() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        error "Директорія не існує: $dir"
        return 1
    fi
    return 0
}

# Безпечне створення директорії
safe_mkdir() {
    local dir="$1"
    local owner="$2"
    local perms="$3"
    
    if [[ ! -d "$dir" ]]; then
        mkdir -p "$dir"
        if [[ $? -eq 0 ]]; then
            success "Директорія створена: $dir"
        else
            error "Помилка створення директорії: $dir"
            return 1
        fi
    fi
    
    if [[ -n "$owner" ]]; then
        chown "$owner" "$dir"
    fi
    
    if [[ -n "$perms" ]]; then
        chmod "$perms" "$dir"
    fi
    
    return 0
}

# Валідація конфігурації
validate_config() {
    if systemctl cat "$SERVICE_NAME" &>/dev/null; then
        success "Конфігурація сервісу $SERVICE_NAME валідна"
        return 0
    else
        error "Помилка в конфігурації сервісу $SERVICE_NAME"
        return 1
    fi
}

# Перевірка статусу сервісу
check_service_status() {
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        success "Сервіс $SERVICE_NAME активний"
        return 0
    else
        warning "Сервіс $SERVICE_NAME неактивний"
        return 1
    fi
}

# Перевірка автозапуску
check_autostart() {
    if systemctl is-enabled "$SERVICE_NAME" &>/dev/null; then
        success "Сервіс $SERVICE_NAME увімкнено для автозапуску"
        return 0
    else
        warning "Сервіс $SERVICE_NAME не увімкнено для автозапуску"
        return 1
    fi
}

# Функція очищення при виході
cleanup_on_exit() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        error "Скрипт завершився з помилкою (код: $exit_code)"
    fi
    exit $exit_code
}

# Встановлення обробника помилок
trap cleanup_on_exit EXIT

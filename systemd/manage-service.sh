#!/bin/bash

# SkillKlan Telegram Bot - Systemd Service Manager
# Скрипт для управління systemd сервісом

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Назва сервісу
SERVICE_NAME="skillklan-bot.service"

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

# Перевірка наявності systemd
check_systemd() {
    if ! command -v systemctl &> /dev/null; then
        error "systemctl не знайдено. Цей скрипт працює тільки з systemd."
        exit 1
    fi
}

# Перевірка наявності сервісу
check_service() {
    if ! systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
        error "Сервіс $SERVICE_NAME не знайдено. Спочатку встановіть його."
        exit 1
    fi
}

# Функція запуску сервісу
start_service() {
    log "Запуск сервісу $SERVICE_NAME..."
    
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        warning "Сервіс вже запущено"
        return 0
    fi
    
    if systemctl start "$SERVICE_NAME"; then
        success "Сервіс успішно запущено"
    else
        error "Помилка запуску сервісу"
        return 1
    fi
}

# Функція зупинки сервісу
stop_service() {
    log "Зупинка сервісу $SERVICE_NAME..."
    
    if ! systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        warning "Сервіс вже зупинено"
        return 0
    fi
    
    if systemctl stop "$SERVICE_NAME"; then
        success "Сервіс успішно зупинено"
    else
        error "Помилка зупинки сервісу"
        return 1
    fi
}

# Функція перезапуску сервісу
restart_service() {
    log "Перезапуск сервісу $SERVICE_NAME..."
    
    if systemctl restart "$SERVICE_NAME"; then
        success "Сервіс успішно перезапущено"
    else
        error "Помилка перезапуску сервісу"
        return 1
    fi
}

# Функція перезавантаження конфігурації
reload_service() {
    log "Перезавантаження конфігурації сервісу $SERVICE_NAME..."
    
    if systemctl reload "$SERVICE_NAME"; then
        success "Конфігурація сервісу перезавантажена"
    else
        error "Помилка перезавантаження конфігурації"
        return 1
    fi
}

# Функція перевірки статусу
status_service() {
    log "Статус сервісу $SERVICE_NAME:"
    echo "----------------------------------------"
    systemctl status "$SERVICE_NAME" --no-pager -l
    echo "----------------------------------------"
}

# Функція перегляду логів
view_logs() {
    local lines=${1:-50}
    log "Останні $lines рядків логів сервісу $SERVICE_NAME:"
    echo "----------------------------------------"
    journalctl -u "$SERVICE_NAME" -n "$lines" --no-pager
    echo "----------------------------------------"
}

# Функція перегляду логів в реальному часі
follow_logs() {
    log "Перегляд логів сервісу $SERVICE_NAME в реальному часі (Ctrl+C для виходу):"
    echo "----------------------------------------"
    journalctl -u "$SERVICE_NAME" -f
}

# Функція перевірки конфігурації
check_config() {
    log "Перевірка конфігурації сервісу $SERVICE_NAME..."
    
    if systemctl cat "$SERVICE_NAME" &>/dev/null; then
        success "Конфігурація сервісу валідна"
        echo "----------------------------------------"
        systemctl cat "$SERVICE_NAME"
        echo "----------------------------------------"
    else
        error "Помилка в конфігурації сервісу"
        return 1
    fi
}

# Функція перевірки автозапуску
check_autostart() {
    log "Перевірка налаштувань автозапуску..."
    
    if systemctl is-enabled "$SERVICE_NAME" &>/dev/null; then
        success "Сервіс увімкнено для автозапуску"
    else
        warning "Сервіс не увімкнено для автозапуску"
        echo "Для увімкнення виконайте: systemctl enable $SERVICE_NAME"
    fi
}

# Функція перевірки залежностей
check_dependencies() {
    log "Перевірка залежностей сервісу..."
    
    echo "Залежності сервісу:"
    systemctl list-dependencies "$SERVICE_NAME" --no-pager
}

# Функція перевірки ресурсів
check_resources() {
    log "Перевірка використання ресурсів..."
    
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        local pid=$(systemctl show "$SERVICE_NAME" --property=MainPID --value)
        if [[ -n "$pid" && "$pid" != "0" ]]; then
            echo "PID: $pid"
            echo "Використання пам'яті:"
            ps -o pid,ppid,cmd,%mem,%cpu --pid="$pid"
        else
            warning "Не вдалося отримати PID сервісу"
        fi
    else
        warning "Сервіс не запущено"
    fi
}

# Функція допомоги
show_help() {
    cat << EOF
Використання: $0 [КОМАНДА]

Команди:
    start       - Запустити сервіс
    stop        - Зупинити сервіс
    restart     - Перезапустити сервіс
    reload      - Перезавантажити конфігурацію
    status      - Показати статус сервісу
    logs        - Показати останні логи
    follow      - Слідкувати за логами в реальному часі
    config      - Перевірити конфігурацію
    autostart   - Перевірити налаштування автозапуску
    deps        - Показати залежності
    resources   - Показати використання ресурсів
    help        - Показати цю довідку

Приклади:
    $0 start          # Запустити сервіс
    $0 status         # Перевірити статус
    $0 logs 100       # Показати останні 100 рядків логів
    $0 follow         # Слідкувати за логами

EOF
}

# Головна функція
main() {
    check_systemd
    check_service
    
    case "${1:-help}" in
        start)
            start_service
            ;;
        stop)
            stop_service
            ;;
        restart)
            restart_service
            ;;
        reload)
            reload_service
            ;;
        status)
            status_service
            ;;
        logs)
            view_logs "$2"
            ;;
        follow)
            follow_logs
            ;;
        config)
            check_config
            ;;
        autostart)
            check_autostart
            ;;
        deps)
            check_dependencies
            ;;
        resources)
            check_resources
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "Невідома команда: $1"
            show_help
            exit 1
            ;;
    esac
}

# Запуск головної функції
main "$@"

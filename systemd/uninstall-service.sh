#!/bin/bash

# SkillKlan Telegram Bot - Systemd Service Uninstaller
# Цей скрипт видаляє systemd сервіс та всі пов'язані файли

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

# Перевірка прав доступу
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "Цей скрипт повинен запускатися з правами root (sudo)"
        exit 1
    fi
}

# Підтвердження видалення
confirm_uninstall() {
    echo -e "${YELLOW}⚠️  УВАГА! Цей скрипт видалить:${NC}"
    echo "   - Systemd сервіс: $SERVICE_NAME"
    echo "   - Користувача: skillklan-bot"
    echo "   - Групу: skillklan-bot"
    echo "   - Директорію: /opt/skillklan-bot"
    echo "   - Logrotate конфігурацію"
    echo ""
    echo -e "${RED}Це дія незворотна!${NC}"
    echo ""
    read -p "Ви впевнені, що хочете продовжити? (yes/no): " confirm
    
    if [[ "$confirm" != "yes" ]]; then
        log "Видалення скасовано користувачем"
        exit 0
    fi
}

# Зупинка та видалення сервісу
remove_service() {
    log "Видалення systemd сервісу..."
    
    # Зупиняємо сервіс якщо він запущений
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        log "Зупинка сервісу $SERVICE_NAME..."
        systemctl stop "$SERVICE_NAME"
        success "Сервіс зупинено"
    fi
    
    # Видаляємо автозапуск
    if systemctl is-enabled "$SERVICE_NAME" &>/dev/null; then
        log "Видалення автозапуску сервісу..."
        systemctl disable "$SERVICE_NAME"
        success "Автозапуск видалено"
    fi
    
    # Видаляємо файл сервісу
    if [[ -f "/etc/systemd/system/$SERVICE_NAME" ]]; then
        log "Видалення файлу сервісу..."
        rm -f "/etc/systemd/system/$SERVICE_NAME"
        success "Файл сервісу видалено"
    fi
    
    # Перезавантажуємо systemd
    log "Перезавантаження systemd..."
    systemctl daemon-reload
    success "Systemd перезавантажено"
}

# Видалення користувача та групи
remove_user() {
    log "Видалення користувача та групи..."
    
    # Видаляємо користувача
    if id "skillklan-bot" &>/dev/null; then
        log "Видалення користувача skillklan-bot..."
        userdel -r skillklan-bot 2>/dev/null || userdel skillklan-bot
        success "Користувач skillklan-bot видалено"
    else
        log "Користувач skillklan-bot не знайдено"
    fi
    
    # Видаляємо групу
    if getent group "skillklan-bot" &>/dev/null; then
        log "Видалення групи skillklan-bot..."
        groupdel skillklan-bot
        success "Група skillklan-bot видалено"
    else
        log "Група skillklan-bot не знайдено"
    fi
}

# Видалення директорій та файлів
remove_files() {
    log "Видалення файлів та директорій..."
    
    # Видаляємо основну директорію
    if [[ -d "/opt/skillklan-bot" ]]; then
        log "Видалення директорії /opt/skillklan-bot..."
        rm -rf /opt/skillklan-bot
        success "Директорія /opt/skillklan-bot видалено"
    else
        log "Директорія /opt/skillklan-bot не знайдено"
    fi
    
    # Видаляємо logrotate конфігурацію
    if [[ -f "/etc/logrotate.d/skillklan-bot" ]]; then
        log "Видалення logrotate конфігурації..."
        rm -f /etc/logrotate.d/skillklan-bot
        success "Logrotate конфігурацію видалено"
    fi
}

# Очищення логів
cleanup_logs() {
    log "Очищення логів..."
    
    # Очищаємо journalctl логи
    if command -v journalctl &> /dev/null; then
        log "Очищення journalctl логів..."
        journalctl --vacuum-time=1s --unit="$SERVICE_NAME" 2>/dev/null || true
        success "Journalctl логи очищено"
    fi
    
    # Очищаємо системні логи
    if [[ -d "/var/log" ]]; then
        log "Очищення системних логів..."
        find /var/log -name "*skillklan-bot*" -delete 2>/dev/null || true
        success "Системні логи очищено"
    fi
}

# Перевірка залишків
check_remnants() {
    log "Перевірка залишків..."
    
    local found_remnants=false
    
    # Перевіряємо залишки сервісу
    if systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
        warning "Залишився сервіс: $SERVICE_NAME"
        found_remnants=true
    fi
    
    # Перевіряємо залишки користувача
    if id "skillklan-bot" &>/dev/null; then
        warning "Залишився користувач: skillklan-bot"
        found_remnants=true
    fi
    
    # Перевіряємо залишки групи
    if getent group "skillklan-bot" &>/dev/null; then
        warning "Залишилася група: skillklan-bot"
        found_remnants=true
    fi
    
    # Перевіряємо залишки файлів
    if [[ -d "/opt/skillklan-bot" ]]; then
        warning "Залишилася директорія: /opt/skillklan-bot"
        found_remnants=true
    fi
    
    if [[ -f "/etc/logrotate.d/skillklan-bot" ]]; then
        warning "Залишилася logrotate конфігурація"
        found_remnants=true
    fi
    
    if [[ "$found_remnants" == "false" ]]; then
        success "Всі компоненти успішно видалено"
    else
        warning "Знайдено залишки. Можливо, потрібно ручне очищення"
    fi
}

# Функція допомоги
show_help() {
    cat << EOF
Використання: $0 [ОПЦІЇ]

Опції:
    --force     - Примусове видалення без підтвердження
    --help      - Показати цю довідку

Приклади:
    $0              # Звичайне видалення з підтвердженням
    $0 --force      # Примусове видалення
    $0 --help       # Показати довідку

EOF
}

# Головна функція
main() {
    local force=false
    
    # Обробка аргументів командного рядка
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force)
                force=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                error "Невідома опція: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    log "Початок видалення SkillKlan Telegram Bot systemd сервісу..."
    
    check_permissions
    
    if [[ "$force" != "true" ]]; then
        confirm_uninstall
    fi
    
    remove_service
    remove_user
    remove_files
    cleanup_logs
    check_remnants
    
    success "Видалення завершено!"
    log "Всі компоненти сервісу успішно видалено з системи"
}

# Запуск головної функції
main "$@"

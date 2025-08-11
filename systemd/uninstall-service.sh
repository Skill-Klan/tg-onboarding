#!/bin/bash

# SkillKlan Telegram Bot - Systemd Service Uninstaller
# Цей скрипт видаляє systemd сервіс та всі пов'язані файли

set -e

# Підключення спільних утиліт
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

# Функція зупинки сервісу
stop_service() {
    log "Зупинка сервісу $SERVICE_NAME..."
    
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        if systemctl stop "$SERVICE_NAME"; then
            success "Сервіс успішно зупинено"
        else
            warning "Не вдалося зупинити сервіс"
        fi
    else
        log "Сервіс вже зупинено"
    fi
}

# Функція вимкнення автозапуску
disable_service() {
    log "Вимкнення автозапуску сервісу $SERVICE_NAME..."
    
    if systemctl is-enabled "$SERVICE_NAME" &>/dev/null; then
        if systemctl disable "$SERVICE_NAME"; then
            success "Автозапуск сервісу вимкнено"
        else
            warning "Не вдалося вимкнути автозапуск сервісу"
        fi
    else
        log "Сервіс вже не увімкнено для автозапуску"
    fi
}

# Функція видалення systemd сервісу
remove_systemd_service() {
    log "Видалення systemd сервісу $SERVICE_NAME..."
    
    if [[ -f "/etc/systemd/system/$SERVICE_NAME" ]]; then
        if rm -f "/etc/systemd/system/$SERVICE_NAME"; then
            success "Файл сервісу видалено"
            
            # Перезавантажуємо systemd
            if systemctl daemon-reload; then
                success "Systemd перезавантажено"
            else
                warning "Не вдалося перезавантажити systemd"
            fi
        else
            error "Не вдалося видалити файл сервісу"
            return 1
        fi
    else
        log "Файл сервісу не знайдено"
    fi
    
    return 0
}

# Функція видалення користувача та групи
remove_user_group() {
    log "Видалення користувача та групи..."
    
    # Видаляємо користувача
    if id "$SERVICE_USER" &>/dev/null; then
        log "Видалення користувача $SERVICE_USER..."
        userdel -r "$SERVICE_USER" 2>/dev/null || userdel "$SERVICE_USER"
        success "Користувач $SERVICE_USER видалено"
    else
        log "Користувач $SERVICE_USER не знайдено"
    fi
    
    # Видаляємо групу
    if getent group "$SERVICE_GROUP" &>/dev/null; then
        log "Видалення групи $SERVICE_GROUP..."
        groupdel "$SERVICE_GROUP"
        success "Група $SERVICE_GROUP видалено"
    else
        log "Група $SERVICE_GROUP не знайдено"
    fi
}

# Функція видалення директорій
remove_directories() {
    log "Видалення директорій проекту..."
    
    if [[ -d "$INSTALL_DIR" ]]; then
        log "Видалення директорії $INSTALL_DIR..."
        if rm -rf "$INSTALL_DIR"; then
            success "Директорія $INSTALL_DIR видалено"
        else
            error "Не вдалося видалити директорію $INSTALL_DIR"
            return 1
        fi
    else
        log "Директорія $INSTALL_DIR не знайдено"
    fi
    
    return 0
}

# Функція видалення логів
remove_logs() {
    log "Видалення логів та конфігурації логування..."
    
    # Видаляємо logrotate конфігурацію
    if [[ -f "/etc/logrotate.d/$SERVICE_USER" ]]; then
        if rm -f "/etc/logrotate.d/$SERVICE_USER"; then
            success "Logrotate конфігурація видалена"
        else
            warning "Не вдалося видалити logrotate конфігурацію"
        fi
    fi
    
    # Видаляємо системні логи
    log "Видалення системних логів..."
    find /var/log -name "*$SERVICE_USER*" -delete 2>/dev/null || true
    success "Системні логи очищено"
    
    return 0
}

# Функція перевірки залишків
check_remnants() {
    log "Перевірка залишків після видалення..."
    
    local found_remnants=false
    
    # Перевіряємо користувача
    if id "$SERVICE_USER" &>/dev/null; then
        warning "Залишився користувач: $SERVICE_USER"
        found_remnants=true
    fi
    
    # Перевіряємо групу
    if getent group "$SERVICE_GROUP" &>/dev/null; then
        warning "Залишилася група: $SERVICE_GROUP"
        found_remnants=true
    fi
    
    # Перевіряємо директорію
    if [[ -d "$INSTALL_DIR" ]]; then
        warning "Залишилася директорія: $INSTALL_DIR"
        found_remnants=true
    fi
    
    # Перевіряємо файл сервісу
    if [[ -f "/etc/systemd/system/$SERVICE_NAME" ]]; then
        warning "Залишився файл сервісу: /etc/systemd/system/$SERVICE_NAME"
        found_remnants=true
    fi
    
    # Перевіряємо logrotate конфігурацію
    if [[ -f "/etc/logrotate.d/$SERVICE_USER" ]]; then
        warning "Залишилася logrotate конфігурація: /etc/logrotate.d/$SERVICE_USER"
        found_remnants=true
    fi
    
    if [[ "$found_remnants" == "false" ]]; then
        success "Всі компоненти успішно видалено"
    else
        warning "Знайдено залишки. Можливо, потрібно видалити їх вручну."
    fi
    
    return 0
}

# Функція підтвердження
confirm_uninstall() {
    echo "Цей скрипт видалить:"
    echo "   - Сервіс: $SERVICE_NAME"
    echo "   - Користувача: $SERVICE_USER"
    echo "   - Групу: $SERVICE_GROUP"
    echo "   - Директорію: $INSTALL_DIR"
    echo "   - Всі логи та конфігурацію"
    echo ""
    echo "Це дія незворотна!"
    echo ""
    
    read -p "Продовжити видалення? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Видалення скасовано користувачем"
        exit 0
    fi
}

# Функція допомоги
show_help() {
    cat << EOF
Використання: $0 [ОПЦІЯ]

Опції:
    -y, --yes       - Автоматично підтвердити видалення
    -f, --force     - Примусове видалення (ігнорувати помилки)
    -h, --help      - Показати цю довідку

Приклади:
    $0              # Інтерактивне видалення
    $0 -y           # Автоматичне видалення
    $0 --force      # Примусове видалення

EOF
}

# Головна функція
main() {
    local auto_confirm=false
    local force=false
    
    # Обробка аргументів командного рядка
    while [[ $# -gt 0 ]]; do
        case $1 in
            -y|--yes)
                auto_confirm=true
                shift
                ;;
            -f|--force)
                force=true
                shift
                ;;
            -h|--help)
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
    
    log "Початок видалення $PROJECT_NAME systemd сервісу..."
    
    # Перевіряємо права доступу
    check_permissions
    
    # Перевіряємо наявність systemd
    check_systemd
    
    # Підтверджуємо видалення (якщо не автоматичне)
    if [[ "$auto_confirm" == "false" ]]; then
        confirm_uninstall
    fi
    
    # Виконуємо видалення
    stop_service
    disable_service
    remove_systemd_service
    remove_directories
    remove_user_group
    remove_logs
    
    # Перевіряємо залишки
    check_remnants
    
    success "Видалення завершено!"
}

# Запуск головної функції
main "$@"

#!/bin/bash

# SkillKlan Telegram Bot - Systemd Service Installer
# Цей скрипт встановлює та налаштовує systemd сервіс для автозапуску бота

set -e

# Підключення спільних утиліт
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

# Створення користувача та групи
create_user() {
    if ! id "$SERVICE_USER" &>/dev/null; then
        log "Створення користувача $SERVICE_USER..."
        useradd --system --shell /bin/false --home-dir "$INSTALL_DIR" "$SERVICE_USER"
        success "Користувач $SERVICE_USER створено"
    else
        log "Користувач $SERVICE_USER вже існує"
    fi
    
    if ! getent group "$SERVICE_GROUP" &>/dev/null; then
        log "Створення групи $SERVICE_GROUP..."
        groupadd "$SERVICE_GROUP"
        success "Група $SERVICE_GROUP створено"
    else
        log "Група $SERVICE_GROUP вже існує"
    fi
}

# Створення директорій
create_directories() {
    log "Створення директорій для бота..."
    
    safe_mkdir "$INSTALL_DIR" "$SERVICE_USER:$SERVICE_GROUP" "755"
    safe_mkdir "$INSTALL_DIR/logs" "$SERVICE_USER:$SERVICE_GROUP" "750"
    safe_mkdir "$INSTALL_DIR/data" "$SERVICE_USER:$SERVICE_GROUP" "750"
    safe_mkdir "$INSTALL_DIR/config" "$SERVICE_USER:$SERVICE_GROUP" "750"
    safe_mkdir "$INSTALL_DIR/src" "$SERVICE_USER:$SERVICE_GROUP" "755"
    
    success "Директорії створено та налаштовано"
}

# Копіювання файлів проекту
copy_project_files() {
    log "Копіювання файлів проекту..."
    
    # Отримуємо шлях до поточної директорії проекту
    PROJECT_DIR="$(get_project_dir)"
    
    # Перевіряємо існування директорії tg_bot
    if ! check_directory "$PROJECT_DIR/tg_bot"; then
        error "Директорія tg_bot не знайдена в $PROJECT_DIR"
        return 1
    fi
    
    # Копіюємо основні файли
    cp -r "$PROJECT_DIR/tg_bot/src" "$INSTALL_DIR/"
    cp "$PROJECT_DIR/tg_bot/package.json" "$INSTALL_DIR/"
    cp "$PROJECT_DIR/tg_bot/package-lock.json" "$INSTALL_DIR/"
    
    # Копіюємо конфігурацію в кореневу директорію (для dotenv)
    if [[ -f "$PROJECT_DIR/tg_bot/.env" ]]; then
        cp "$PROJECT_DIR/tg_bot/.env" "$INSTALL_DIR/"
        chown "$SERVICE_USER:$SERVICE_GROUP" "$INSTALL_DIR/.env"
        chmod 600 "$INSTALL_DIR/.env"
        success ".env файл скопійовано в кореневу директорію"
    else
        warning "Файл .env не знайдено. Створіть його вручну в $INSTALL_DIR/"
    fi
    
    # Копіюємо .env також в config директорію для зворотної сумісності
    if [[ -f "$PROJECT_DIR/tg_bot/.env" ]]; then
        cp "$PROJECT_DIR/tg_bot/.env" "$INSTALL_DIR/config/"
        chown "$SERVICE_USER:$SERVICE_GROUP" "$INSTALL_DIR/config/.env"
        chmod 600 "$INSTALL_DIR/config/.env"
        success ".env файл скопійовано в config директорію"
    fi
    
    success "Файли проекту скопійовано"
}

# Встановлення залежностей
install_dependencies() {
    log "Встановлення залежностей Node.js..."
    
    cd "$INSTALL_DIR"
    npm ci --production
    cd - > /dev/null  # Повертаємося в початкову директорію
    
    success "Залежності встановлено"
}

# Встановлення systemd сервісу
install_systemd_service() {
    log "Встановлення systemd сервісу..."
    
    # Зберігаємо шлях до поточної директорії
    local current_dir="$(pwd)"
    
    # Копіюємо файл сервісу
    cp "$(dirname "${BASH_SOURCE[0]}")/skillklan-bot.service" /etc/systemd/system/
    
    # Перезавантажуємо systemd
    systemctl daemon-reload
    
    # Включаємо автозапуск
    systemctl enable "$SERVICE_NAME"
    
    success "Systemd сервіс встановлено та налаштовано"
}

# Налаштування логування
setup_logging() {
    log "Налаштування логування..."
    
    # Створюємо logrotate конфігурацію
    cat > "/etc/logrotate.d/$SERVICE_USER" << EOF
$INSTALL_DIR/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $SERVICE_USER $SERVICE_GROUP
    postrotate
        systemctl reload $SERVICE_NAME
    endscript
}
EOF
    
    success "Логування налаштовано"
}

# Перевірка встановлення
verify_installation() {
    log "Перевірка встановлення..."
    
    # Перевіряємо статус сервісу
    if check_autostart; then
        success "Сервіс увімкнено для автозапуску"
    else
        error "Сервіс не увімкнено для автозапуску"
    fi
    
    # Перевіряємо конфігурацію
    if validate_config; then
        success "Конфігурація сервісу валідна"
    else
        error "Помилка в конфігурації сервісу"
    fi
    
    log "Встановлення завершено!"
    log "Для запуску сервісу виконайте: systemctl start $SERVICE_NAME"
    log "Для перевірки статусу: systemctl status $SERVICE_NAME"
    log "Для перегляду логів: journalctl -u $SERVICE_NAME -f"
}

# Головна функція
main() {
    log "Початок встановлення $PROJECT_NAME systemd сервісу..."
    
    check_permissions
    check_systemd
    if ! check_nodejs; then
        error "Node.js не встановлено. Встановіть Node.js перед продовженням."
        exit 1
    fi
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

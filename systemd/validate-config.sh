#!/bin/bash

# SkillKlan Telegram Bot - Configuration Validator
# Цей скрипт перевіряє конфігурацію systemd сервісу та налаштування

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
    log "Перевірка наявності systemd..."
    
    if ! command -v systemctl &> /dev/null; then
        error "systemctl не знайдено. Цей скрипт працює тільки з systemd."
        return 1
    fi
    
    success "Systemd знайдено"
    return 0
}

# Перевірка наявності сервісу
check_service_exists() {
    log "Перевірка наявності сервісу $SERVICE_NAME..."
    
    if systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
        success "Сервіс $SERVICE_NAME знайдено"
        return 0
    else
        error "Сервіс $SERVICE_NAME не знайдено"
        return 1
    fi
}

# Перевірка конфігурації сервісу
check_service_config() {
    log "Перевірка конфігурації сервісу..."
    
    if systemctl cat "$SERVICE_NAME" &>/dev/null; then
        success "Конфігурація сервісу валідна"
        
        # Показуємо конфігурацію
        echo "----------------------------------------"
        systemctl cat "$SERVICE_NAME"
        echo "----------------------------------------"
        return 0
    else
        error "Помилка в конфігурації сервісу"
        return 1
    fi
}

# Перевірка статусу сервісу
check_service_status() {
    log "Перевірка статусу сервісу..."
    
    local status=$(systemctl is-active "$SERVICE_NAME" 2>/dev/null || echo "inactive")
    
    case "$status" in
        "active")
            success "Сервіс активний (запущений)"
            ;;
        "inactive")
            warning "Сервіс неактивний (зупинений)"
            ;;
        "activating")
            warning "Сервіс запускається"
            ;;
        "deactivating")
            warning "Сервіс зупиняється"
            ;;
        "failed")
            error "Сервіс не вдався"
            ;;
        *)
            warning "Невідомий статус: $status"
            ;;
    esac
    
    return 0
}

# Перевірка автозапуску
check_autostart() {
    log "Перевірка налаштувань автозапуску..."
    
    if systemctl is-enabled "$SERVICE_NAME" &>/dev/null; then
        success "Сервіс увімкнено для автозапуску"
        return 0
    else
        warning "Сервіс не увімкнено для автозапуску"
        return 1
    fi
}

# Перевірка користувача та групи
check_user_group() {
    log "Перевірка користувача та групи..."
    
    # Перевіряємо користувача
    if id "skillklan-bot" &>/dev/null; then
        success "Користувач skillklan-bot існує"
        
        # Перевіряємо групу
        if getent group "skillklan-bot" &>/dev/null; then
            success "Група skillklan-bot існує"
            
            # Перевіряємо членство користувача в групі
            if groups "skillklan-bot" | grep -q "skillklan-bot"; then
                success "Користувач skillklan-bot є членом групи skillklan-bot"
            else
                warning "Користувач skillklan-bot не є членом групи skillklan-bot"
            fi
        else
            error "Група skillklan-bot не знайдено"
            return 1
        fi
    else
        error "Користувач skillklan-bot не знайдено"
        return 1
    fi
    
    return 0
}

# Перевірка директорій
check_directories() {
    log "Перевірка директорій..."
    
    local base_dir="/opt/skillklan-bot"
    local required_dirs=("src" "logs" "data" "config")
    local all_exist=true
    
    for dir in "${required_dirs[@]}"; do
        local full_path="$base_dir/$dir"
        if [[ -d "$full_path" ]]; then
            success "Директорія $full_path існує"
            
            # Перевіряємо власника
            local owner=$(stat -c '%U:%G' "$full_path")
            if [[ "$owner" == "skillklan-bot:skillklan-bot" ]]; then
                success "Правильний власник: $owner"
            else
                warning "Неправильний власник: $owner (очікується skillklan-bot:skillklan-bot)"
                all_exist=false
            fi
        else
            error "Директорія $full_path не знайдено"
            all_exist=false
        fi
    done
    
    if [[ "$all_exist" == "true" ]]; then
        return 0
    else
        return 1
    fi
}

# Перевірка файлів проекту
check_project_files() {
    log "Перевірка файлів проекту..."
    
    local base_dir="/opt/skillklan-bot"
    local required_files=("src/index.mjs" "package.json" "package-lock.json")
    local all_exist=true
    
    for file in "${required_files[@]}"; do
        local full_path="$base_dir/$file"
        if [[ -f "$full_path" ]]; then
            success "Файл $full_path існує"
        else
            error "Файл $full_path не знайдено"
            all_exist=false
        fi
    done
    
    # Перевіряємо .env файл
    local env_file="$base_dir/config/.env"
    if [[ -f "$env_file" ]]; then
        success "Файл .env знайдено"
        
        # Перевіряємо права доступу
        local perms=$(stat -c '%a' "$env_file")
        if [[ "$perms" == "600" ]]; then
            success "Правильні права доступу: $perms"
        else
            warning "Неправильні права доступу: $perms (очікується 600)"
        fi
    else
        warning "Файл .env не знайдено"
    fi
    
    if [[ "$all_exist" == "true" ]]; then
        return 0
    else
        return 1
    fi
}

# Перевірка залежностей Node.js
check_node_dependencies() {
    log "Перевірка залежностей Node.js..."
    
    local base_dir="/opt/skillklan-bot"
    
    if [[ -d "$base_dir/node_modules" ]]; then
        success "Директорія node_modules існує"
        
        # Перевіряємо package.json
        if [[ -f "$base_dir/package.json" ]]; then
            success "package.json знайдено"
            
            # Перевіряємо основні залежності
            local deps=("telegraf" "dotenv" "express")
            for dep in "${deps[@]}"; do
                if [[ -d "$base_dir/node_modules/$dep" ]]; then
                    success "Залежність $dep встановлено"
                else
                    warning "Залежність $dep не знайдено"
                fi
            done
        fi
    else
        error "Директорія node_modules не знайдено"
        return 1
    fi
    
    return 0
}

# Перевірка логування
check_logging() {
    log "Перевірка налаштувань логування..."
    
    # Перевіряємо logrotate конфігурацію
    if [[ -f "/etc/logrotate.d/skillklan-bot" ]]; then
        success "Logrotate конфігурація знайдено"
    else
        warning "Logrotate конфігурація не знайдено"
    fi
    
    # Перевіряємо можливість логування
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        local log_output=$(journalctl -u "$SERVICE_NAME" -n 1 --no-pager 2>/dev/null || echo "")
        if [[ -n "$log_output" ]]; then
            success "Логування працює"
        else
            warning "Логування не працює або логи порожні"
        fi
    else
        warning "Сервіс не запущений, логування не можна перевірити"
    fi
    
    return 0
}

# Перевірка мережі
check_network() {
    log "Перевірка мережевих налаштувань..."
    
    # Перевіряємо чи слухає сервіс на порту
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        local pid=$(systemctl show "$SERVICE_NAME" --property=MainPID --value)
        if [[ -n "$pid" && "$pid" != "0" ]]; then
            success "PID сервісу: $pid"
            
            # Перевіряємо відкриті порти
            local ports=$(netstat -tlnp 2>/dev/null | grep "$pid" || echo "")
            if [[ -n "$ports" ]]; then
                success "Відкриті порти:"
                echo "$ports"
            else
                warning "Не знайдено відкритих портів"
            fi
        else
            warning "Не вдалося отримати PID сервісу"
        fi
    else
        warning "Сервіс не запущений, мережу не можна перевірити"
    fi
    
    return 0
}

# Перевірка ресурсів
check_resources() {
    log "Перевірка використання ресурсів..."
    
    if systemctl is-active "$SERVICE_NAME" &>/dev/null; then
        local pid=$(systemctl show "$SERVICE_NAME" --property=MainPID --value)
        if [[ -n "$pid" && "$pid" != "0" ]]; then
            success "Перевірка ресурсів для PID: $pid"
            
            # Перевіряємо використання пам'яті та CPU
            local resources=$(ps -o pid,ppid,cmd,%mem,%cpu --pid="$pid" 2>/dev/null || echo "")
            if [[ -n "$resources" ]]; then
                echo "Використання ресурсів:"
                echo "$resources"
            else
                warning "Не вдалося отримати інформацію про ресурси"
            fi
        else
            warning "Не вдалося отримати PID сервісу"
        fi
    else
        warning "Сервіс не запущений, ресурси не можна перевірити"
    fi
    
    return 0
}

# Генерація звіту
generate_report() {
    local report_file="/tmp/skillklan-bot-validation-report.txt"
    
    log "Генерація звіту в $report_file..."
    
    {
        echo "SkillKlan Telegram Bot - Звіт перевірки конфігурації"
        echo "Дата: $(date)"
        echo "=================================================="
        echo ""
        
        # Виконуємо всі перевірки та збираємо результати
        check_systemd
        check_service_exists
        check_service_config
        check_service_status
        check_autostart
        check_user_group
        check_directories
        check_project_files
        check_node_dependencies
        check_logging
        check_network
        check_resources
        
    } > "$report_file" 2>&1
    
    success "Звіт згенеровано: $report_file"
    echo "Для перегляду звіту виконайте: cat $report_file"
}

# Функція допомоги
show_help() {
    cat << EOF
Використання: $0 [КОМАНДА]

Команди:
    validate     - Виконати повну перевірку (за замовчуванням)
    report       - Згенерувати звіт перевірки
    help         - Показати цю довідку

Приклади:
    $0              # Виконати повну перевірку
    $0 validate     # Виконати повну перевірку
    $0 report       # Згенерувати звіт
    $0 help         # Показати довідку

EOF
}

# Головна функція
main() {
    case "${1:-validate}" in
        validate)
            log "Початок перевірки конфігурації SkillKlan Telegram Bot..."
            
            check_systemd
            check_service_exists
            check_service_config
            check_service_status
            check_autostart
            check_user_group
            check_directories
            check_project_files
            check_node_dependencies
            check_logging
            check_network
            check_resources
            
            log "Перевірка завершена!"
            ;;
        report)
            generate_report
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

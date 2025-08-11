#!/bin/bash

# SkillKlan Telegram Bot - Dependency Checker
# Цей скрипт перевіряє всі залежності необхідні для роботи systemd сервісу

set -e

# Підключення спільних утиліт
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

# Перевірка операційної системи
check_os() {
    log "Перевірка операційної системи..."
    
    if [[ -f /etc/os-release ]]; then
        source /etc/os-release
        success "ОС: $NAME $VERSION"
        
        # Перевіряємо чи це Linux
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            success "Тип ОС: Linux"
        else
            warning "Тип ОС: $OSTYPE (можливі проблеми з systemd)"
        fi
        
        # Перевіряємо версію ядра
        local kernel_version=$(uname -r)
        success "Версія ядра: $kernel_version"
        
        return 0
    else
        error "Не вдалося визначити операційну систему"
        return 1
    fi
}

# Перевірка версії Node.js
check_nodejs_version() {
    local node_version=$(node --version)
    local major_version=$(echo "$node_version" | cut -d'v' -f2 | cut -d'.' -f1)
    
    if [[ "$major_version" -ge 16 ]]; then
        success "Версія Node.js відповідає вимогам (>= 16)"
        return 0
    else
        warning "Версія Node.js застаріла: $node_version (потрібно >= 16)"
        return 1
    fi
}

# Перевірка NPM
check_npm() {
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        success "NPM знайдено: $npm_version"
        return 0
    else
        error "NPM не знайдено"
        return 1
    fi
}

# Перевірка системних залежностей
check_system_dependencies() {
    log "Перевірка системних залежностей..."
    
    local deps=("curl" "wget" "git" "tar" "gzip")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if command -v "$dep" &> /dev/null; then
            success "$dep знайдено"
        else
            warning "$dep не знайдено"
            missing_deps+=("$dep")
        fi
    done
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        warning "Відсутні системні залежності: ${missing_deps[*]}"
        return 1
    fi
    
    return 0
}

# Перевірка мережевих залежностей
check_network_dependencies() {
    log "Перевірка мережевих залежностей..."
    
    # Перевірка DNS
    if nslookup google.com &>/dev/null; then
        success "DNS роботає"
    else
        warning "Проблеми з DNS"
        return 1
    fi
    
    # Перевірка HTTP
    if curl -s --connect-timeout 5 https://httpbin.org/get &>/dev/null; then
        success "HTTP з'єднання працює"
    else
        warning "Проблеми з HTTP з'єднанням"
        return 1
    fi
    
    return 0
}

# Перевірка прав доступу
check_permissions() {
    log "Перевірка прав доступу..."
    
    if [[ $EUID -eq 0 ]]; then
        success "Скрипт запущено з правами root"
    else
        warning "Скрипт запущено без прав root (можливі проблеми з встановленням)"
    fi
    
    # Перевірка прав на запис в системні директорії
    if [[ -w /etc/systemd/system ]]; then
        success "Є права на запис в /etc/systemd/system"
    else
        warning "Немає прав на запис в /etc/systemd/system"
    fi
    
    return 0
}

# Перевірка конфігурації
check_configuration() {
    log "Перевірка конфігурації..."
    
    # Перевірка наявності файлу сервісу
    if [[ -f "$(dirname "${BASH_SOURCE[0]}")/skillklan-bot.service" ]]; then
        success "Файл сервісу знайдено"
    else
        error "Файл сервісу не знайдено"
        return 1
    fi
    
    # Перевірка наявності директорії проекту
    local project_dir=$(get_project_dir)
    if [[ -d "$project_dir/tg_bot" ]]; then
        success "Директорія проекту знайдена: $project_dir/tg_bot"
    else
        error "Директорія проекту не знайдена: $project_dir/tg_bot"
        return 1
    fi
    
    return 0
}

# Генерація звіту
generate_report() {
    local report_file="/tmp/${SERVICE_USER}-dependencies-report.txt"
    
    log "Генерація звіту про залежності..."
    
    {
        echo "=== ЗВІТ ПРО ЗАЛЕЖНОСТІ $PROJECT_NAME ==="
        echo "Дата: $(date)"
        echo "ОС: $(uname -a)"
        echo ""
        
        echo "=== СИСТЕМНІ ЗАЛЕЖНОСТІ ==="
        echo "Systemd: $(systemctl --version | head -n1)"
        echo "Node.js: $(node --version 2>/dev/null || echo 'НЕ ЗНАЙДЕНО')"
        echo "NPM: $(npm --version 2>/dev/null || echo 'НЕ ЗНАЙДЕНО')"
        echo ""
        
        echo "=== МЕРЕЖЕВІ ЗАЛЕЖНОСТІ ==="
        echo "DNS: $(nslookup google.com &>/dev/null && echo 'ПРАЦЮЄ' || echo 'НЕ ПРАЦЮЄ')"
        echo "HTTP: $(curl -s --connect-timeout 5 https://httpbin.org/get &>/dev/null && echo 'ПРАЦЮЄ' || echo 'НЕ ПРАЦЮЄ')"
        echo ""
        
        echo "=== ПРАВА ДОСТУПУ ==="
        echo "Root: $(if [[ $EUID -eq 0 ]]; then echo 'ТАК'; else echo 'НІ'; fi)"
        echo "Systemd: $(if [[ -w /etc/systemd/system ]]; then echo 'ТАК'; else echo 'НІ'; fi)"
        echo ""
        
        echo "=== РЕКОМЕНДАЦІЇ ==="
        if ! command -v node &>/dev/null; then
            echo "- Встановіть Node.js версії 16 або вище"
        fi
        if ! command -v npm &>/dev/null; then
            echo "- Встановіть NPM"
        fi
        if [[ $EUID -ne 0 ]]; then
            echo "- Запустіть скрипт з правами root (sudo)"
        fi
        if [[ ! -w /etc/systemd/system ]]; then
            echo "- Перевірте права доступу до /etc/systemd/system"
        fi
        
    } > "$report_file"
    
    success "Звіт згенеровано: $report_file"
    echo "Зміст звіту:"
    cat "$report_file"
}

# Головна функція
main() {
    log "Початок перевірки залежностей для $PROJECT_NAME..."
    
    local exit_code=0
    
    # Виконуємо всі перевірки
    check_os || exit_code=1
    check_systemd || exit_code=1
    if check_nodejs; then
        check_nodejs_version || exit_code=1
    else
        exit_code=1
    fi
    check_npm || exit_code=1
    check_system_dependencies || exit_code=1
    check_network_dependencies || exit_code=1
    check_permissions || exit_code=1
    check_configuration || exit_code=1
    
    # Генеруємо звіт
    generate_report
    
    if [[ $exit_code -eq 0 ]]; then
        success "Всі залежності перевірено успішно!"
    else
        warning "Знайдено проблеми з залежностями. Перегляньте звіт вище."
    fi
    
    exit $exit_code
}

# Запуск головної функції
main "$@"

#!/bin/bash

# SkillKlan Telegram Bot - Configuration Validator
# Цей скрипт перевіряє валідність всієї конфігурації systemd сервісу

set -e

# Підключення спільних утиліт
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

# Перевірка користувача та групи
check_user_group() {
    log "Перевірка користувача та групи..."
    
    if id "$SERVICE_USER" &>/dev/null; then
        success "Користувач $SERVICE_USER існує"
        
        # Перевіряємо групу користувача
        if getent group "$SERVICE_GROUP" &>/dev/null; then
            success "Група $SERVICE_GROUP існує"
            
            # Перевіряємо чи користувач є членом групи
            if groups "$SERVICE_USER" | grep -q "$SERVICE_GROUP"; then
                success "Користувач $SERVICE_USER є членом групи $SERVICE_GROUP"
            else
                warning "Користувач $SERVICE_USER не є членом групи $SERVICE_GROUP"
                return 1
            fi
        else
            error "Група $SERVICE_GROUP не знайдено"
            return 1
        fi
    else
        error "Користувач $SERVICE_USER не знайдено"
        return 1
    fi
    
    return 0
}

# Перевірка директорій
check_directories() {
    log "Перевірка директорій..."
    
    local base_dir="$INSTALL_DIR"
    local required_dirs=("logs" "data" "config" "src")
    
    # Перевіряємо основну директорію
    if [[ -d "$base_dir" ]]; then
        success "Основна директорія існує: $base_dir"
        
        # Перевіряємо власника
        local owner=$(stat -c "%U:%G" "$base_dir")
        if [[ "$owner" == "$SERVICE_USER:$SERVICE_GROUP" ]]; then
            success "Правильний власник: $owner"
        else
            warning "Неправильний власник: $owner (очікується $SERVICE_USER:$SERVICE_GROUP)"
            return 1
        fi
        
        # Перевіряємо права доступу
        local perms=$(stat -c "%a" "$base_dir")
        if [[ "$perms" == "755" ]]; then
            success "Правильні права доступу: $perms"
        else
            warning "Неправильні права доступу: $perms (очікується 755)"
        fi
    else
        error "Основна директорія не існує: $base_dir"
        return 1
    fi
    
    # Перевіряємо піддиректорії
    for dir in "${required_dirs[@]}"; do
        local full_path="$base_dir/$dir"
        if [[ -d "$full_path" ]]; then
            success "Директорія існує: $full_path"
            
            # Перевіряємо власника
            local owner=$(stat -c "%U:%G" "$full_path")
            if [[ "$owner" == "$SERVICE_USER:$SERVICE_GROUP" ]]; then
                success "Правильний власник: $owner"
            else
                warning "Неправильний власник: $owner (очікується $SERVICE_USER:$SERVICE_GROUP)"
            fi
        else
            error "Директорія не існує: $full_path"
            return 1
        fi
    done
    
    return 0
}

# Перевірка файлів проекту
check_project_files() {
    log "Перевірка файлів проекту..."
    
    local base_dir="$INSTALL_DIR"
    local required_files=("package.json" "package-lock.json")
    
    # Перевіряємо package.json
    if [[ -f "$base_dir/package.json" ]]; then
        success "package.json знайдено"
        
        # Перевіряємо валідність JSON
        if python3 -m json.tool "$base_dir/package.json" &>/dev/null; then
            success "package.json є валідним JSON"
        else
            warning "package.json не є валідним JSON"
        fi
    else
        error "package.json не знайдено"
        return 1
    fi
    
    # Перевіряємо package-lock.json
    if [[ -f "$base_dir/package-lock.json" ]]; then
        success "package-lock.json знайдено"
    else
        warning "package-lock.json не знайдено"
    fi
    
    # Перевіряємо директорію src
    if [[ -d "$base_dir/src" ]]; then
        success "Директорія src знайдена"
        
        # Перевіряємо наявність основних файлів
        if [[ -f "$base_dir/src/index.mjs" ]]; then
            success "Основний файл index.mjs знайдено"
        else
            error "Основний файл index.mjs не знайдено"
            return 1
        fi
    else
        error "Директорія src не знайдена"
        return 1
    fi
    
    return 0
}

# Перевірка конфігурації
check_config_files() {
    log "Перевірка конфігураційних файлів..."
    
    local config_dir="$INSTALL_DIR/config"
    
    # Перевіряємо .env файл
    if [[ -f "$config_dir/.env" ]]; then
        success "Файл .env знайдено"
        
        # Перевіряємо права доступу
        local perms=$(stat -c "%a" "$config_dir/.env")
        if [[ "$perms" == "600" ]]; then
            success "Правильні права доступу для .env: $perms"
        else
            warning "Неправильні права доступу для .env: $perms (очікується 600)"
        fi
        
        # Перевіряємо власника
        local owner=$(stat -c "%U:%G" "$config_dir/.env")
        if [[ "$owner" == "$SERVICE_USER:$SERVICE_GROUP" ]]; then
            success "Правильний власник для .env: $owner"
        else
            warning "Неправильний власник для .env: $owner (очікується $SERVICE_USER:$SERVICE_GROUP)"
        fi
    else
        warning "Файл .env не знайдено (може бути створений вручну)"
    fi
    
    return 0
}

# Перевірка systemd сервісу
check_systemd_service() {
    log "Перевірка systemd сервісу..."
    
    # Перевіряємо наявність файлу сервісу
    if [[ -f "/etc/systemd/system/$SERVICE_NAME" ]]; then
        success "Файл сервісу знайдено: /etc/systemd/system/$SERVICE_NAME"
        
        # Перевіряємо валідність конфігурації
        if validate_config; then
            success "Конфігурація сервісу валідна"
        else
            error "Конфігурація сервісу невалідна"
            return 1
        fi
        
        # Перевіряємо права доступу
        local perms=$(stat -c "%a" "/etc/systemd/system/$SERVICE_NAME")
        if [[ "$perms" == "644" ]]; then
            success "Правильні права доступу для сервісу: $perms"
        else
            warning "Неправильні права доступу для сервісу: $perms (очікується 644)"
        fi
    else
        error "Файл сервісу не знайдено: /etc/systemd/system/$SERVICE_NAME"
        return 1
    fi
    
    return 0
}

# Перевірка логування
check_logging() {
    log "Перевірка налаштувань логування..."
    
    # Перевіряємо logrotate конфігурацію
    if [[ -f "/etc/logrotate.d/$SERVICE_USER" ]]; then
        success "Logrotate конфігурація знайдена"
        
        # Перевіряємо права доступу
        local perms=$(stat -c "%a" "/etc/logrotate.d/$SERVICE_USER")
        if [[ "$perms" == "644" ]]; then
            success "Правильні права доступу для logrotate: $perms"
        else
            warning "Неправильні права доступу для logrotate: $perms (очікується 644)"
        fi
    else
        warning "Logrotate конфігурація не знайдена"
    fi
    
    # Перевіряємо директорію логів
    local logs_dir="$INSTALL_DIR/logs"
    if [[ -d "$logs_dir" ]]; then
        success "Директорія логів існує: $logs_dir"
        
        # Перевіряємо права доступу
        local perms=$(stat -c "%a" "$logs_dir")
        if [[ "$perms" == "750" ]]; then
            success "Правильні права доступу для логів: $perms"
        else
            warning "Неправильні права доступу для логів: $perms (очікується 750)"
        fi
    else
        error "Директорія логів не існує: $logs_dir"
        return 1
    fi
    
    return 0
}

# Перевірка залежностей
check_dependencies() {
    log "Перевірка залежностей..."
    
    local base_dir="$INSTALL_DIR"
    
    # Перевіряємо наявність node_modules
    if [[ -d "$base_dir/node_modules" ]]; then
        success "Директорія node_modules знайдена"
        
        # Перевіряємо власника
        local owner=$(stat -c "%U:%G" "$base_dir/node_modules")
        if [[ "$owner" == "$SERVICE_USER:$SERVICE_GROUP" ]]; then
            success "Правильний власник для node_modules: $owner"
        else
            warning "Неправильний власник для node_modules: $owner (очікується $SERVICE_USER:$SERVICE_GROUP)"
        fi
    else
        error "Директорія node_modules не знайдена"
        return 1
    fi
    
    return 0
}

# Генерація звіту
generate_report() {
    local report_file="/tmp/${SERVICE_USER}-validation-report.txt"
    
    log "Генерація звіту про валідацію..."
    
    {
        echo "=== ЗВІТ ПРО ВАЛІДАЦІЮ $PROJECT_NAME ==="
        echo "Дата: $(date)"
        echo "Сервіс: $SERVICE_NAME"
        echo "Користувач: $SERVICE_USER"
        echo "Група: $SERVICE_GROUP"
        echo "Директорія: $INSTALL_DIR"
        echo ""
        
        echo "=== СТАТУС ПЕРЕВІРОК ==="
        echo "Користувач та група: $(if check_user_group &>/dev/null; then echo 'ОК'; else echo 'ПОМИЛКА'; fi)"
        echo "Директорії: $(if check_directories &>/dev/null; then echo 'ОК'; else echo 'ПОМИЛКА'; fi)"
        echo "Файли проекту: $(if check_project_files &>/dev/null; then echo 'ОК'; else echo 'ПОМИЛКА'; fi)"
        echo "Конфігурація: $(if check_config_files &>/dev/null; then echo 'ОК'; else echo 'ПОМИЛКА'; fi)"
        echo "Systemd сервіс: $(if check_systemd_service &>/dev/null; then echo 'ОК'; else echo 'ПОМИЛКА'; fi)"
        echo "Логування: $(if check_logging &>/dev/null; then echo 'ОК'; else echo 'ПОМИЛКА'; fi)"
        echo "Залежності: $(if check_dependencies &>/dev/null; then echo 'ОК'; else echo 'ПОМИЛКА'; fi)"
        echo ""
        
        echo "=== РЕКОМЕНДАЦІЇ ==="
        if ! check_user_group &>/dev/null; then
            echo "- Перевірте налаштування користувача та групи"
        fi
        if ! check_directories &>/dev/null; then
            echo "- Перевірте структуру директорій та права доступу"
        fi
        if ! check_project_files &>/dev/null; then
            echo "- Перевірте наявність файлів проекту"
        fi
        if ! check_systemd_service &>/dev/null; then
            echo "- Перевірте конфігурацію systemd сервісу"
        fi
        
    } > "$report_file"
    
    success "Звіт згенеровано: $report_file"
    echo "Зміст звіту:"
    cat "$report_file"
}

# Головна функція
main() {
    log "Початок валідації конфігурації для $PROJECT_NAME..."
    
    local exit_code=0
    
    # Виконуємо всі перевірки
    check_user_group || exit_code=1
    check_directories || exit_code=1
    check_project_files || exit_code=1
    check_config_files || exit_code=1
    check_systemd_service || exit_code=1
    check_logging || exit_code=1
    check_dependencies || exit_code=1
    
    # Генеруємо звіт
    generate_report
    
    if [[ $exit_code -eq 0 ]]; then
        success "Всі перевірки пройшли успішно!"
    else
        warning "Знайдено проблеми з конфігурацією. Перегляньте звіт вище."
    fi
    
    exit $exit_code
}

# Запуск головної функції
main "$@"

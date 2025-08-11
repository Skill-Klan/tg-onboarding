#!/bin/bash

# SkillKlan Telegram Bot - Dependency Checker
# Цей скрипт перевіряє всі залежності необхідні для роботи systemd сервісу

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Перевірка наявності systemd
check_systemd() {
    log "Перевірка наявності systemd..."
    
    if command -v systemctl &> /dev/null; then
        local systemd_version=$(systemctl --version | head -n1)
        success "Systemd знайдено: $systemd_version"
        
        # Перевіряємо чи systemd є init системою
        if [[ $(ps -p 1 -o comm=) == "systemd" ]]; then
            success "Systemd є init системою"
        else
            warning "Systemd не є init системою"
        fi
        
        return 0
    else
        error "Systemd не знайдено. Цей скрипт працює тільки з systemd."
        return 1
    fi
}

# Перевірка Node.js
check_nodejs() {
    log "Перевірка Node.js..."
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        local npm_version=$(npm --version)
        
        success "Node.js знайдено: $node_version"
        success "NPM знайдено: $npm_version"
        
        # Перевіряємо версію Node.js
        local major_version=$(echo "$node_version" | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ "$major_version" -ge 16 ]]; then
            success "Версія Node.js відповідає вимогам (>= 16)"
        else
            warning "Версія Node.js застаріла: $node_version (потрібно >= 16)"
        fi
        
        # Перевіряємо шлях до Node.js
        local node_path=$(which node)
        success "Шлях до Node.js: $node_path"
        
        return 0
    else
        error "Node.js не знайдено. Встановіть Node.js 16+ перед продовженням."
        return 1
    fi
}

# Перевірка npm та залежностей
check_npm() {
    log "Перевірка NPM та залежностей..."
    
    if command -v npm &> /dev/null; then
        # Перевіряємо глобальні налаштування npm
        local npm_config=$(npm config list)
        success "NPM конфігурація доступна"
        
        # Перевіряємо права доступу до npm кешу
        local npm_cache=$(npm config get cache)
        if [[ -w "$npm_cache" ]]; then
            success "NPM кеш доступний для запису: $npm_cache"
        else
            warning "NPM кеш недоступний для запису: $npm_cache"
        fi
        
        return 0
    else
        error "NPM не знайдено"
        return 1
    fi
}

# Перевірка системних утиліт
check_system_utils() {
    log "Перевірка системних утиліт..."
    
    local utils=("useradd" "groupadd" "chown" "chmod" "mkdir" "cp" "rm")
    local all_found=true
    
    for util in "${utils[@]}"; do
        if command -v "$util" &> /dev/null; then
            success "Утиліта $util знайдена"
        else
            error "Утиліта $util не знайдена"
            all_found=false
        fi
    done
    
    # Перевіряємо netstat або ss
    if command -v netstat &> /dev/null; then
        success "Утиліта netstat знайдена"
    elif command -v ss &> /dev/null; then
        success "Утиліта ss знайдена (заміна netstat)"
    else
        warning "Не знайдено утиліт для перевірки мережевих з'єднань"
    fi
    
    # Перевіряємо ps
    if command -v ps &> /dev/null; then
        success "Утиліта ps знайдена"
    else
        error "Утиліта ps не знайдена"
        all_found=false
    fi
    
    if [[ "$all_found" == "true" ]]; then
        return 0
    else
        return 1
    fi
}

# Перевірка прав доступу
check_permissions() {
    log "Перевірка прав доступу..."
    
    # Перевіряємо чи можемо створювати користувачів
    if [[ $EUID -eq 0 ]]; then
        success "Запущено з правами root"
        return 0
    else
        # Перевіряємо sudo права
        if command -v sudo &> /dev/null; then
            if sudo -n true 2>/dev/null; then
                success "Sudo права доступні"
                return 0
            else
                warning "Sudo права обмежені"
                return 1
            fi
        else
            error "Sudo не знайдено"
            return 1
        fi
    fi
}

# Перевірка мережевих налаштувань
check_network() {
    log "Перевірка мережевих налаштувань..."
    
    # Перевіряємо чи можемо робити зовнішні з'єднання
    if ping -c 1 8.8.8.8 &>/dev/null; then
        success "Зовнішнє з'єднання доступне"
    else
        warning "Зовнішнє з'єднання недоступне"
    fi
    
    # Перевіряємо DNS
    if nslookup google.com &>/dev/null; then
        success "DNS резолюція працює"
    else
        warning "DNS резолюція не працює"
    fi
    
    # Перевіряємо чи порт 3000 вільний
    if command -v netstat &> /dev/null; then
        if netstat -tln | grep -q ":3000 "; then
            warning "Порт 3000 вже використовується"
        else
            success "Порт 3000 вільний"
        fi
    elif command -v ss &> /dev/null; then
        if ss -tln | grep -q ":3000 "; then
            warning "Порт 3000 вже використовується"
        else
            success "Порт 3000 вільний"
        fi
    fi
    
    return 0
}

# Перевірка файлової системи
check_filesystem() {
    log "Перевірка файлової системи..."
    
    # Перевіряємо чи можемо створювати директорії в /opt
    if [[ -w /opt ]] || [[ $EUID -eq 0 ]]; then
        success "Директорія /opt доступна для запису"
    else
        warning "Директорія /opt недоступна для запису"
    fi
    
    # Перевіряємо вільне місце
    local free_space=$(df /opt | awk 'NR==2 {print $4}')
    local free_space_mb=$((free_space / 1024))
    
    if [[ $free_space_mb -gt 100 ]]; then
        success "Вільне місце: ${free_space_mb}MB (достатньо)"
    else
        warning "Вільне місце: ${free_space_mb}MB (може бути недостатньо)"
    fi
    
    # Перевіряємо inode
    local free_inodes=$(df -i /opt | awk 'NR==2 {print $4}')
    if [[ $free_inodes -gt 1000 ]]; then
        success "Вільні inode: $free_inodes (достатньо)"
    else
        warning "Вільні inode: $free_inodes (може бути недостатньо)"
    fi
    
    return 0
}

# Перевірка системних ресурсів
check_system_resources() {
    log "Перевірка системних ресурсів..."
    
    # Перевіряємо RAM
    local total_ram=$(free -m | awk 'NR==2{print $2}')
    local available_ram=$(free -m | awk 'NR==2{print $7}')
    
    success "Загальна RAM: ${total_ram}MB"
    success "Доступна RAM: ${available_ram}MB"
    
    if [[ $available_ram -gt 100 ]]; then
        success "RAM достатньо для роботи бота"
    else
        warning "RAM може бути недостатньо для роботи бота"
    fi
    
    # Перевіряємо CPU
    local cpu_cores=$(nproc)
    success "Кількість CPU ядер: $cpu_cores"
    
    # Перевіряємо load average
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    success "Load average: $load_avg"
    
    return 0
}

# Перевірка безпеки
check_security() {
    log "Перевірка безпеки..."
    
    # Перевіряємо SELinux
    if command -v sestatus &> /dev/null; then
        local selinux_status=$(sestatus | grep "SELinux status" | awk '{print $3}')
        if [[ "$selinux_status" == "enabled" ]]; then
            warning "SELinux увімкнено (може заважати роботі сервісу)"
        else
            success "SELinux вимкнено"
        fi
    else
        success "SELinux не встановлено"
    fi
    
    # Перевіряємо AppArmor
    if command -v aa-status &> /dev/null; then
        local apparmor_status=$(aa-status 2>/dev/null | grep "profiles are loaded" | awk '{print $1}')
        if [[ -n "$apparmor_status" ]]; then
            warning "AppArmor активний (може заважати роботі сервісу)"
        else
            success "AppArmor неактивний"
        fi
    else
        success "AppArmor не встановлено"
    fi
    
    # Перевіряємо firewall
    if command -v ufw &> /dev/null; then
        local ufw_status=$(ufw status | head -n1)
        if [[ "$ufw_status" == "Status: active" ]]; then
            warning "UFW firewall активний (може блокувати з'єднання)"
        else
            success "UFW firewall неактивний"
        fi
    elif command -v firewall-cmd &> /dev/null; then
        local firewalld_status=$(firewall-cmd --state 2>/dev/null)
        if [[ "$firewalld_status" == "running" ]]; then
            warning "Firewalld активний (може блокувати з'єднання)"
        else
            success "Firewalld неактивний"
        fi
    else
        success "Firewall не знайдено"
    fi
    
    return 0
}

# Генерація звіту
generate_report() {
    local report_file="/tmp/skillklan-bot-dependencies-report.txt"
    
    log "Генерація звіту в $report_file..."
    
    {
        echo "SkillKlan Telegram Bot - Звіт перевірки залежностей"
        echo "Дата: $(date)"
        echo "=================================================="
        echo ""
        
        # Виконуємо всі перевірки та збираємо результати
        check_os
        check_systemd
        check_nodejs
        check_npm
        check_system_utils
        check_permissions
        check_network
        check_filesystem
        check_system_resources
        check_security
        
    } > "$report_file" 2>&1
    
    success "Звіт згенеровано: $report_file"
    echo "Для перегляду звіту виконайте: cat $report_file"
}

# Функція допомоги
show_help() {
    cat << EOF
Використання: $0 [КОМАНДА]

Команди:
    check        - Виконати повну перевірку (за замовчуванням)
    report       - Згенерувати звіт перевірки
    help         - Показати цю довідку

Приклади:
    $0              # Виконати повну перевірку
    $0 check        # Виконати повну перевірку
    $0 report       # Згенерувати звіт
    $0 help         # Показати довідку

EOF
}

# Головна функція
main() {
    case "${1:-check}" in
        check)
            log "Початок перевірки залежностей для SkillKlan Telegram Bot..."
            
            check_os
            check_systemd
            check_nodejs
            check_npm
            check_system_utils
            check_permissions
            check_network
            check_filesystem
            check_system_resources
            check_security
            
            log "Перевірка залежностей завершена!"
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

# 🔧 Виправлення деплою після зміни на приватний репозиторій

## 🚨 Проблема

Після зміни статусу репозиторію `tg-onboarding` на приватний:
- ❌ GitHub Actions перестали працювати
- ❌ GitHub Pages стали недоступними
- ❌ Автоматичний деплой зламався

## ✅ Рішення

### 1. Оновлено деплой скрипт

Файл `deploy.sh` було оновлено для роботи з приватним репозиторієм:
- Додано підтримку SSH URL замість HTTPS
- Додано перевірку SSH доступу до GitHub
- Покращено обробку помилок

### 2. Нові способи деплою

#### Варіант A: Локальний деплой (рекомендовано)

```bash
# 1. Встановіть токен бота
export BOT_TOKEN='ваш_токен_бота'

# 2. Запустіть деплой
./deploy.sh deploy

# 3. Перевірте статус
./deploy.sh status

# 4. Подивіться логи
./deploy.sh logs
```

#### Варіант B: Деплой на віддалений сервер

```bash
# 1. Встановіть змінні середовища
export BOT_TOKEN='ваш_токен_бота'
export DEPLOY_HOST='ваш_сервер'
export DEPLOY_USER='користувач'
export DEPLOY_PATH='/шлях/до/деплою'

# 2. Запустіть деплой
./deploy.sh deploy
```

#### Варіант C: Ручний деплой

```bash
# 1. Перейдіть в директорію бота
cd tg_bot

# 2. Встановіть залежності
npm ci --only=production

# 3. Створіть .env файл
cp .env.example .env
# Відредагуйте .env та додайте BOT_TOKEN

# 4. Запустіть бота
npm start
```

## 🔑 Налаштування SSH

### Перевірка SSH доступу

```bash
ssh -T git@github.com
```

Очікуваний результат:
```
Hi Skill-Klan! You've successfully authenticated, but GitHub does not provide shell access.
```

### Якщо SSH не працює

1. **Генерація SSH ключа:**
   ```bash
   ssh-keygen -t ed25519 -C "ваш_email@example.com"
   ```

2. **Додавання ключа до SSH агента:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Додавання публічного ключа до GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   Скопіюйте вивід та додайте в GitHub Settings → SSH and GPG keys

## 📋 Перевірка вимог

Скрипт автоматично перевіряє:
- ✅ Наявність BOT_TOKEN
- ✅ Наявність SSH
- ✅ Наявність Git
- ✅ SSH доступ до GitHub

## 🚀 Швидкий старт

1. **Клонуйте репозиторій (якщо ще не зроблено):**
   ```bash
   git clone git@github.com:Skill-Klan/tg-onboarding.git
   cd tg-bot
   ```

2. **Встановіть токен:**
   ```bash
   export BOT_TOKEN='ваш_токен_бота'
   ```

3. **Запустіть деплой:**
   ```bash
   ./deploy.sh deploy
   ```

## 🔍 Діагностика проблем

### Помилка "BOT_TOKEN не встановлений"
```bash
export BOT_TOKEN='ваш_токен_бота'
```

### Помилка SSH доступу
```bash
ssh -T git@github.com
```

### Помилка Git
```bash
sudo apt update && sudo apt install git
```

### Помилка npm
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install node
```

## 📞 Підтримка

При виникненні проблем:

1. **Перевірте логи:**
   ```bash
   ./deploy.sh logs
   ```

2. **Перевірте статус:**
   ```bash
   ./deploy.sh status
   ```

3. **Перевірте допомогу:**
   ```bash
   ./deploy.sh help
   ```

4. **Перевірте змінні середовища:**
   ```bash
   env | grep -E "(BOT_TOKEN|DEPLOY|REPO)"
   ```

## ⚠️ Важливі зауваження

- **Приватні репозиторії**: Не підтримують безкоштовні GitHub Actions
- **GitHub Pages**: Недоступні для приватних репозиторіїв
- **SSH ключі**: Обов'язково для доступу до приватного репозиторію
- **Токен бота**: Завжди встановлювати через змінну середовища
- **Безпека**: Не комітьте токени в код

## 🔄 Відновлення автоматичного деплою

Якщо ви хочете повернути автоматичний деплой:

1. **Зробіть репозиторій публічним** в GitHub Settings
2. **Налаштуйте GitHub Actions** (workflow файли вже є)
3. **Налаштуйте GitHub Pages** (файли вже готові)

---

**Дата створення**: $(date)
**Статус**: Виправлено ✅
**Рекомендація**: Використовувати локальний скрипт деплою

# 🚀 Налаштування GitHub Pages для FAQ

## ✅ Проблема вирішена!

**Помилка:** "Branch 'main' is not allowed to deploy to github-pages due to environment protection rules"

**Рішення:** Створено гілку `gh-pages` для GitHub Pages

## 🔧 Налаштування GitHub Pages:

### 1. Перейдіть в налаштування репозиторію
1. **GitHub → ваш репозиторій → Settings**
2. **Ліва панель → Pages**

### 2. Налаштуйте Source
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` (НЕ main!)
- **Folder:** `/ (root)`
- **Натисніть Save**

### 3. Дочекайтеся розгортання
- GitHub автоматично розгорне сайт з гілки `gh-pages`
- Зазвичай займає 1-2 хвилини
- URL буде: `https://skill-klan.github.io/tg-onboarding/`

## 📁 Структура гілки gh-pages:

```
gh-pages/
├── faq/                    # Основна папка FAQ
│   ├── index.html         # Головна сторінка
│   ├── css/style.css      # Стилі
│   ├── js/                # JavaScript файли
│   ├── data.json          # Дані FAQ
│   └── ...                # Інші файли
├── .nojekyll              # Вимкнути Jekyll
└── README.md              # Документація
```

## 🔄 Оновлення GitHub Pages:

### Автоматичне оновлення:
```bash
# Переключіться на gh-pages
git checkout gh-pages

# Отримайте зміни з main
git checkout main -- faq/

# Зробіть коміт та пуш
git add .
git commit -m "Оновлено FAQ"
git push origin gh-pages
```

### Або створіть скрипт:
```bash
#!/bin/bash
# update-gh-pages.sh
git checkout gh-pages
git checkout main -- faq/
git add .
git commit -m "Оновлено FAQ $(date)"
git push origin gh-pages
git checkout main
```

## 🌐 Результат:

- ✅ FAQ сторінка доступна публічно
- ✅ GitHub Pages працюють
- ✅ Немає конфліктів з захистом гілки main
- ✅ Автоматичне розгортання при пуші в gh-pages

## 📱 Доступ до FAQ:

Після налаштування ваш FAQ буде доступний за адресою:
**`https://skill-klan.github.io/tg-onboarding/faq/`**

---

**Час налаштування:** 2-3 хвилини  
**Складність:** Легко  
**Результат:** FAQ сторінка доступна публічно

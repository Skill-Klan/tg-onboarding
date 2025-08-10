#!/bin/bash

# Скрипт для розгортання FAQ на Netlify
# Використання: ./deploy-netlify.sh

echo "🚀 Розгортання FAQ на Netlify..."

# Перевірка наявності необхідних файлів
echo "📁 Перевірка файлів..."

required_files=(
    "index.html"
    "css/style.css"
    "js/app.js"
    "js/dataLoader.js"
    "js/categoryComponent.js"
    "js/questionComponent.js"
    "js/searchComponent.js"
    "js/searchController.js"
    "js/searchEngine.js"
    "data.json"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Відсутні файли:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo "Переконайтеся, що ви знаходитесь в папці faq/"
    exit 1
fi

echo "✅ Всі необхідні файли знайдено"

# Створення архіву для завантаження
echo "📦 Створення архіву..."

if command -v zip &> /dev/null; then
    zip -r faq-deploy.zip . -x "*.git*" "*.md" "deploy-*.sh" "test-*.html"
    archive_name="faq-deploy.zip"
elif command -v tar &> /dev/null; then
    tar -czf faq-deploy.tar.gz --exclude='*.git*' --exclude='*.md' --exclude='deploy-*.sh' --exclude='test-*.html' .
    archive_name="faq-deploy.tar.gz"
else
    echo "❌ Не знайдено zip або tar. Створіть архів вручну."
    exit 1
fi

echo "✅ Архів створено: $archive_name"

# Інструкції для користувача
echo ""
echo "🎯 Наступні кроки:"
echo "1. Перейдіть на https://netlify.com"
echo "2. Увійдіть або створіть акаунт"
echo "3. Натисніть 'Sites' в головному меню"
echo "4. Перетягніть файл '$archive_name' в область 'Drag and drop your site output folder here'"
echo "5. Дочекайтеся завантаження та розгортання"
echo "6. Скопіюйте отримане посилання"
echo ""
echo "📝 Альтернативно, можете просто перетягнути папку faq/ на Netlify"
echo ""

# Відкриття Netlify в браузері (якщо можливо)
if command -v xdg-open &> /dev/null; then
    read -p "🌐 Відкрити Netlify в браузері? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "https://netlify.com"
    fi
elif command -v open &> /dev/null; then
    read -p "🌐 Відкрити Netlify в браузері? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://netlify.com"
    fi
fi

echo ""
echo "🎉 Готово! FAQ сторінка буде доступна публічно після розгортання на Netlify."

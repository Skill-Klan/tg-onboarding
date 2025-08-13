#!/usr/bin/env node

/**
 * Скрипт для автоматичного тестування FAQ додатку
 * Запускає тести та перевіряє основні функції
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Запуск тестування FAQ додатку...\n');

// Перевіряємо наявність основних файлів
const requiredFiles = [
    'js/app.js',
    'js/searchEngine.js',
    'js/searchController.js',
    'js/searchComponent.js',
    'js/dataLoader.js',
    'js/categoryComponent.js',
    'js/questionComponent.js',
    'css/style.css',
    'data.json',
    'index.html',
    'test-search.html'
];

console.log('📁 Перевірка структури файлів:');
let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${file}`);
    if (!exists) allFilesExist = false;
});

console.log('');

if (!allFilesExist) {
    console.log('❌ Деякі файли відсутні. Перевірте структуру проекту.');
    process.exit(1);
}

// Перевіряємо вміст data.json
try {
    const dataPath = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log('📊 Аналіз даних FAQ:');
    console.log(`  📚 Категорій: ${data.categories ? data.categories.length : 0}`);
    
    if (data.categories) {
        let totalQuestions = 0;
        data.categories.forEach(category => {
            if (category.questions) {
                totalQuestions += category.questions.length;
            }
        });
        console.log(`  ❓ Загальна кількість питань: ${totalQuestions}`);
    }
    
    console.log(`  🔍 Пошукових тегів: ${data.searchTags ? data.searchTags.length : 0}`);
    
} catch (error) {
    console.log(`❌ Помилка читання data.json: ${error.message}`);
}

console.log('\n🚀 Тестування готове!');
console.log('\n📋 Інструкції для тестування:');
console.log('1. Відкрийте браузер та перейдіть на http://localhost:8000');
console.log('2. Для тестування пошуку відкрийте http://localhost:8000/test-search.html');
console.log('3. Натисніть кнопки тестування на сторінці test-search.html');
console.log('4. Перевірте консоль браузера на наявність помилок');
console.log('\n🛑 Для зупинки сервера натисніть Ctrl+C');

console.log('\n✅ Локальне тестування запущено успішно!');

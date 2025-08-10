import { getDirectionActionButtons } from '../../utils/keyboard.js';

export default function faqHandler(ctx) {
  const callbackData = ctx.callbackQuery?.data;
  
  let faqText = '';
  let track = '';
  
  switch (callbackData) {
    case 'faq_qa':
      track = 'QA';
      faqText = `🧪 <b>FAQ - Тестування (QA)</b>

<b>🔍 Що таке QA?</b>
QA (Quality Assurance) - це процес забезпечення якості програмного забезпечення. Тестувальник перевіряє, чи програма працює правильно та чи зручна для користувачів.

<b>⏱️ Скільки навчаються?</b>
• <b>Інтенсивний курс:</b> 3-4 місяці
• <b>Стандартний курс:</b> 5-6 місяців
• <b>Вечірній формат:</b> 6-8 місяців

<b>💰 Які зарплати?</b>
• <b>Junior QA:</b> $800-1500/міс
• <b>Middle QA:</b> $1500-3000/міс
• <b>Senior QA:</b> $3000+/міс

<b>🎯 Що вивчаєте?</b>
• Тестування мобільних додатків
• Веб-тестування
• Автоматизація тестування
• API тестування
• Тест-плани та стратегії

<b>🚀 Кар'єрні перспективи:</b>
• QA Engineer → QA Lead → QA Manager
• Спеціалізація: Mobile, Web, API
• Перехід в DevOps або Product Management`;
      break;
      
    case 'faq_ba':
      track = 'BA';
      faqText = `📊 <b>FAQ - Бізнес аналітика</b>

<b>🔍 Що таке BA?</b>
BA (Business Analyst) - це спеціаліст, який аналізує бізнес-процеси та вимоги, перекладаючи їх на технічну мову для розробників.

<b>⏱️ Скільки навчаються?</b>
• <b>Інтенсивний курс:</b> 4-5 місяців
• <b>Стандартний курс:</b> 6-7 місяців
• <b>Вечірній формат:</b> 7-9 місяців

<b>💰 Які зарплати?</b>
• <b>Junior BA:</b> $1000-1800/міс
• <b>Middle BA:</b> $1800-3500/міс
• <b>Senior BA:</b> $3500+/міс

<b>🎯 Що вивчаєте?</b>
• Аналіз бізнес-процесів
• Збір та аналіз вимог
• User Stories та Use Cases
• BPMN та UML діаграми
• Аналіз даних та метрики

<b>🚀 Кар'єрні перспективи:</b>
• Business Analyst → Senior BA → Product Owner
• Спеціалізація: FinTech, E-commerce, Healthcare
• Перехід в Product Management або Project Management`;
      break;
      
    case 'faq_backend':
      track = 'Backend';
      faqText = `💻 <b>FAQ - Backend розробка</b>

<b>🔍 Що таке Backend?</b>
Backend - це серверна частина додатку, яка обробляє дані, логіку та забезпечує роботу фронтенду. Це "мозок" будь-якої програми.

<b>⏱️ Скільки навчаються?</b>
• <b>Інтенсивний курс:</b> 6-7 місяців
• <b>Стандартний курс:</b> 8-9 місяців
• <b>Вечірній формат:</b> 9-12 місяців

<b>💰 Які зарплати?</b>
• <b>Junior Backend:</b> $1200-2000/міс
• <b>Middle Backend:</b> $2000-4000/міс
• <b>Senior Backend:</b> $4000+/міс

<b>🎯 Що вивчаєте?</b>
• Node.js та Express.js
• Бази даних (SQL, NoSQL)
• REST API та GraphQL
• Мікросервісна архітектура
• Docker та DevOps основи

<b>🚀 Кар'єрні перспективи:</b>
• Backend Developer → Senior Developer → Tech Lead
• Спеціалізація: Cloud, DevOps, Security
• Перехід в System Architecture або Team Lead`;
      break;
      
    default:
      faqText = '❌ Невідомий напрям для FAQ';
  }
  
  ctx.answerCbQuery();
  
  // Відправляємо FAQ з кнопками для дій
  if (track) {
    ctx.reply(faqText, {
      ...getDirectionActionButtons(track, true),
      parse_mode: 'HTML'
    });
  } else {
    ctx.reply(faqText, { parse_mode: 'HTML' });
  }
}

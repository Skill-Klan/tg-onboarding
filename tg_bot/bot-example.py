#!/usr/bin/env python3
"""
Приклад бота для запуску SkillKlan FAQ Mini App
Використовує python-telegram-bot v20+
"""

import os
import logging
from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv

# Завантажуємо змінні середовища
load_dotenv()

# Налаштування логування
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Конфігурація
BOT_TOKEN = os.getenv('BOT_TOKEN')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://your-domain.com/faq.html')
BOT_USERNAME = os.getenv('BOT_USERNAME', 'SkillKlanBot')

class SkillKlanBot:
    def __init__(self):
        self.application = Application.builder().token(BOT_TOKEN).build()
        self.setup_handlers()
    
    def setup_handlers(self):
        """Налаштування обробників команд"""
        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(CommandHandler("faq", self.faq_command))
        self.application.add_handler(CommandHandler("help", self.help_command))
        self.application.add_handler(CommandHandler("menu", self.menu_command))
        
        # Обробка даних з Mini App
        self.application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, self.handle_webapp_data))
        
        # Обробка звичайних повідомлень
        self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обробка команди /start"""
        user = update.effective_user
        
        # Створюємо клавіатуру з кнопкою FAQ
        keyboard = [
            [KeyboardButton("📚 FAQ", web_app=WebAppInfo(url=WEBAPP_URL))],
            [KeyboardButton("💬 Зв'язатися з підтримкою")],
            [KeyboardButton("ℹ️ Про школу")]
        ]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=False)
        
        welcome_text = f"""
👋 Вітаю, {user.first_name}!

Я бот SkillKlan - IT школа з курсами:
• 🧪 QA (Тестування) - 3 місяці
• 📊 Бізнес-аналітика - 4 місяці  
• ⚙️ Backend розробка - 6 місяців

📚 Натисніть кнопку FAQ для отримання відповідей на популярні питання!
        """
        
        await update.message.reply_text(
            welcome_text.strip(),
            reply_markup=reply_markup
        )
    
    async def faq_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обробка команди /faq - запуск Mini App"""
        # Створюємо inline клавіатуру для запуску FAQ
        keyboard = [
            [InlineKeyboardButton("📚 Відкрити FAQ", web_app=WebAppInfo(url=WEBAPP_URL))]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            "📚 Натисніть кнопку нижче, щоб відкрити FAQ з часто запитуваними питаннями про SkillKlan!",
            reply_markup=reply_markup
        )
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обробка команди /help"""
        help_text = """
🔧 Доступні команди:

/start - Почати роботу з ботом
/faq - Відкрити FAQ
/menu - Показати головне меню
/help - Ця довідка

📱 Кнопки:
• 📚 FAQ - Відкрити часто запитувані питання
• 💬 Зв'язатися з підтримкою
• ℹ️ Про школу

🌐 Веб-сайт: https://skillklan.com
📧 Email: info@skillklan.com
        """
        
        await update.message.reply_text(help_text.strip())
    
    async def menu_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обробка команди /menu - показати головне меню"""
        await self.start_command(update, context)
    
    async def handle_webapp_data(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обробка даних з Mini App"""
        data = update.effective_message.web_app_data.data
        user = update.effective_user
        
        logger.info(f"Отримано дані з WebApp від користувача {user.id}: {data}")
        
        # Обробка різних типів даних
        if data == "contact_support":
            await update.message.reply_text(
                "💬 Дякую за звернення! Наш менеджер зв'яжеться з вами найближчим часом."
            )
        elif data == "course_info":
            await update.message.reply_text(
                "📚 Ось інформація про наші курси:\n\n"
                "🧪 QA (Тестування) - 3 місяці\n"
                "📊 Бізнес-аналітика - 4 місяці\n"
                "⚙️ Backend розробка - 6 місяців"
            )
        else:
            await update.message.reply_text(
                f"📥 Отримано ваш запит: {data}\n\n"
                "Наш менеджер обробить його та зв'яжеться з вами!"
            )
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обробка звичайних текстових повідомлень"""
        text = update.message.text.lower()
        
        if "faq" in text or "питання" in text or "допомога" in text:
            await self.faq_command(update, context)
        elif "підтримка" in text or "допомога" in text or "зв'язатися" in text:
            await update.message.reply_text(
                "💬 Для зв'язку з підтримкою:\n\n"
                "📧 Email: support@skillklan.com\n"
                "📱 Telegram: @SkillKlanSupport\n"
                "🌐 Сайт: https://skillklan.com/support"
            )
        elif "школа" in text or "курси" in text or "навчання" in text:
            await update.message.reply_text(
                "🏫 SkillKlan - це IT школа, яка готує спеціалістів у сфері технологій!\n\n"
                "🎯 Наші напрямки:\n"
                "• 🧪 QA (Тестування) - 3 місяці\n"
                "• 📊 Бізнес-аналітика - 4 місяці\n"
                "• ⚙️ Backend розробка - 6 місяців\n\n"
                "💻 Всі курси доступні онлайн та офлайн в Києві!\n\n"
                "📚 Детальніше в FAQ: /faq"
            )
        elif "ціни" in text or "вартість" in text or "оплата" in text:
            await update.message.reply_text(
                "💳 Інформація про оплату:\n\n"
                "💰 Вартість залежить від напрямку та тривалості\n"
                "💳 Приймаємо оплату картою, наличними або банківським переказом\n"
                "📅 Можна оплатити весь курс одразу або розбити на частини\n\n"
                "📞 Для отримання точних цін зверніться до менеджера: /start"
            )
        else:
            await update.message.reply_text(
                "🤔 Не розумію ваш запит. Спробуйте:\n\n"
                "• /faq - для пошуку відповідей\n"
                "• /help - для довідки\n"
                "• /menu - для головного меню\n\n"
                "Або просто натисніть кнопку 📚 FAQ!"
            )
    
    def run(self):
        """Запуск бота"""
        logger.info("Запуск бота SkillKlan...")
        
        # Запускаємо бота
        self.application.run_polling(
            allowed_updates=Update.ALL_TYPES,
            drop_pending_updates=True
        )

def main():
    """Головна функція"""
    if not BOT_TOKEN:
        logger.error("BOT_TOKEN не знайдено в змінних середовища!")
        return
    
    try:
        bot = SkillKlanBot()
        bot.run()
    except Exception as e:
        logger.error(f"Помилка запуску бота: {e}")

if __name__ == "__main__":
    main()

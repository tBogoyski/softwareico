from io import BytesIO

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw, ImageFont

from products.models import Category, Tag, Product, ProductLink, ProductContact


CATEGORIES = [
    {
        "name_en": "CRM",
        "name_bg": "CRM системи",
        "slug": "crm",
        "description_en": "Customer Relationship Management software",
        "description_bg": "Софтуер за управление на взаимоотношенията с клиенти",
        "icon": "fa-users",
        "order": 1,
    },
    {
        "name_en": "ERP",
        "name_bg": "ERP системи",
        "slug": "erp",
        "description_en": "Enterprise Resource Planning software",
        "description_bg": "Софтуер за планиране на ресурсите на предприятието",
        "icon": "fa-building",
        "order": 2,
    },
    {
        "name_en": "AI Chatbot",
        "name_bg": "AI Чатботове",
        "slug": "ai-chatbot",
        "description_en": "AI-powered chatbot and conversational tools",
        "description_bg": "AI чатботове и инструменти за разговори",
        "icon": "fa-robot",
        "order": 3,
    },
    {
        "name_en": "E-commerce",
        "name_bg": "Електронна търговия",
        "slug": "e-commerce",
        "description_en": "Online store and e-commerce platforms",
        "description_bg": "Платформи за онлайн магазини и електронна търговия",
        "icon": "fa-shopping-cart",
        "order": 4,
    },
    {
        "name_en": "Accounting",
        "name_bg": "Счетоводство",
        "slug": "accounting",
        "description_en": "Accounting and financial management software",
        "description_bg": "Софтуер за счетоводство и финансово управление",
        "icon": "fa-calculator",
        "order": 5,
    },
    {
        "name_en": "Project Management",
        "name_bg": "Управление на проекти",
        "slug": "project-management",
        "description_en": "Tools for managing projects, tasks, and teams",
        "description_bg": "Инструменти за управление на проекти, задачи и екипи",
        "icon": "fa-tasks",
        "order": 6,
    },
    {
        "name_en": "HR",
        "name_bg": "Човешки ресурси",
        "slug": "hr",
        "description_en": "Human resources",
        "description_bg": "Човешки ресурси",
        "icon": "fa-id-badge",
        "order": 7,
    },
    {
        "name_en": "Marketing",
        "name_bg": "Маркетинг",
        "slug": "marketing",
        "description_en": "Digital marketing and automation tools",
        "description_bg": "Дигитален маркетинг и инструменти за автоматизация",
        "icon": "fa-bullhorn",
        "order": 8,
    },
]

TAGS = [
    {"name_en": "Transportation", "name_bg": "Транспорт", "slug": "transportation"},
    {"name_en": "E-commerce", "name_bg": "Електронна търговия", "slug": "e-commerce"},
    {"name_en": "AI", "name_bg": "AI", "slug": "ai"},
    {"name_en": "Automation", "name_bg": "Автоматизация", "slug": "automation"},
    {"name_en": "Bulgarian Language", "name_bg": "Български език", "slug": "bulgarian-language"},
    {"name_en": "Cloud-based", "name_bg": "Облачен", "slug": "cloud-based"},
    {"name_en": "On-premise", "name_bg": "Локална инсталация", "slug": "on-premise"},
    {"name_en": "Mobile App", "name_bg": "Мобилно приложение", "slug": "mobile-app"},
    {"name_en": "API Available", "name_bg": "Достъпно API", "slug": "api-available"},
    {"name_en": "Free Trial", "name_bg": "Безплатен пробен период", "slug": "free-trial"},
    {"name_en": "Small Business", "name_bg": "Малък бизнес", "slug": "small-business"},
    {"name_en": "Enterprise", "name_bg": "Корпоративен", "slug": "enterprise"},
    {"name_en": "Integration Ready", "name_bg": "Готов за интеграция", "slug": "integration-ready"},
    {"name_en": "GDPR Compliant", "name_bg": "GDPR съвместим", "slug": "gdpr-compliant"},
    {"name_en": "Open Source", "name_bg": "Отворен код", "slug": "open-source"},
]

PRODUCTS = [
    {
        "name": "CloudCart",
        "slug": "cloudcart",
        "tagline_en": "The Bulgarian e-commerce platform built for growth",
        "tagline_bg": "Българската платформа за електронна търговия, създадена за растеж",
        "description_en": "CloudCart is a Bulgarian SaaS e-commerce platform that lets businesses launch online stores quickly without technical expertise. It offers integrated payments, shipping, and marketing tools tailored for the Bulgarian market.",
        "description_bg": "CloudCart е българска SaaS платформа за електронна търговия, която позволява на бизнеса бързо да стартира онлайн магазин без технически познания. Предлага интегрирани плащания, доставки и маркетинг инструменти, пригодени за българския пазар.",
        "website_url": "https://cloudcart.com",
        "pricing_type": "freemium",
        "pricing_details_en": "Free plan available. Paid plans start at 29 BGN/month.",
        "pricing_details_bg": "Безплатен план. Платените планове започват от 29 лв./месец.",
        "category_slug": "e-commerce",
        "tag_slugs": ["e-commerce", "bulgarian-language", "cloud-based", "small-business", "free-trial"],
        "is_featured": True,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://cloudcart.com"},
            {"link_type": "demo", "label_en": "Try Free Demo", "label_bg": "Безплатно демо", "url": "https://cloudcart.com/demo"},
            {"link_type": "documentation", "label_en": "Help Center", "label_bg": "Помощен център", "url": "https://help.cloudcart.com"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "info@cloudcart.com", "label": "Общи запитвания"},
            {"contact_type": "phone", "value": "+359 2 123 4567", "label": "Продажби"},
            {"contact_type": "facebook", "value": "https://facebook.com/cloudcart", "label": "Facebook"},
        ],
    },
    {
        "name": "Chatbot.bg",
        "slug": "chatbot-bg",
        "tagline_en": "AI-powered customer support for Bulgarian businesses",
        "tagline_bg": "AI базирана клиентска поддръжка за български бизнеси",
        "description_en": "Chatbot.bg provides an AI chatbot solution specifically designed for the Bulgarian market. It understands Bulgarian language, integrates with popular Bulgarian e-commerce platforms, and can handle customer inquiries 24/7.",
        "description_bg": "Chatbot.bg предоставя AI чатбот решение, специално създадено за българския пазар. Разбира български език, интегрира се с популярни български платформи за електронна търговия и може да обработва клиентски запитвания 24/7.",
        "website_url": "https://chatbot.bg",
        "pricing_type": "paid",
        "pricing_details_en": "Plans start at 49 BGN/month. Custom enterprise plans available.",
        "pricing_details_bg": "Плановете започват от 49 лв./месец. Персонализирани корпоративни планове.",
        "category_slug": "ai-chatbot",
        "tag_slugs": ["ai", "automation", "bulgarian-language", "cloud-based", "e-commerce", "integration-ready"],
        "is_featured": True,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://chatbot.bg"},
            {"link_type": "demo", "label_en": "Live Demo", "label_bg": "Демо на живо", "url": "https://chatbot.bg/demo"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "hello@chatbot.bg", "label": "Продажби"},
            {"contact_type": "linkedin", "value": "https://linkedin.com/company/chatbot-bg", "label": "LinkedIn"},
        ],
    },
    {
        "name": "Microinvest",
        "slug": "microinvest",
        "tagline_en": "Complete ERP and accounting for Bulgarian enterprises",
        "tagline_bg": "Цялостна ERP и счетоводна система за български предприятия",
        "description_en": "Microinvest offers a comprehensive suite of ERP and accounting software widely used across Bulgaria. From warehouse management to financial reporting, it covers the full range of business operations with support for Bulgarian regulatory requirements.",
        "description_bg": "Микроинвест предлага цялостен пакет от ERP и счетоводен софтуер, широко използван в цяла България. От управление на склад до финансова отчетност, покрива пълния спектър бизнес операции с поддръжка на българските нормативни изисквания.",
        "website_url": "https://microinvest.net",
        "pricing_type": "paid",
        "pricing_details_en": "License-based pricing. Contact for a quote.",
        "pricing_details_bg": "Лицензионно ценообразуване. Свържете се за оферта.",
        "category_slug": "erp",
        "tag_slugs": ["bulgarian-language", "on-premise", "enterprise", "integration-ready"],
        "is_featured": True,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://microinvest.net"},
            {"link_type": "documentation", "label_en": "Documentation", "label_bg": "Документация", "url": "https://microinvest.net/docs"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "sales@microinvest.net", "label": "Продажби"},
            {"contact_type": "phone", "value": "+359 2 987 6543", "label": "Поддръжка"},
        ],
    },
    {
        "name": "Planfy",
        "slug": "planfy",
        "tagline_en": "Smart scheduling for service businesses",
        "tagline_bg": "Интелигентно планиране за бизнеси с услуги",
        "description_en": "Planfy is an online appointment scheduling platform that helps service businesses manage bookings, send reminders, and accept online payments. Simple setup with no technical knowledge required.",
        "description_bg": "Planfy е онлайн платформа за планиране на срещи, която помага на бизнеси с услуги да управляват резервации, да изпращат напомняния и да приемат онлайн плащания. Лесна настройка без необходимост от технически познания.",
        "website_url": "https://planfy.com",
        "pricing_type": "freemium",
        "pricing_details_en": "Free for single users. Pro plan at 19 BGN/month.",
        "pricing_details_bg": "Безплатно за единични потребители. Pro план за 19 лв./месец.",
        "category_slug": "project-management",
        "tag_slugs": ["cloud-based", "small-business", "mobile-app", "free-trial"],
        "is_featured": False,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://planfy.com"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "support@planfy.com", "label": "Поддръжка"},
        ],
    },
    {
        "name": "Omnilinx",
        "slug": "omnilinx",
        "tagline_en": "Omnichannel communication platform",
        "tagline_bg": "Омниканална комуникационна платформа",
        "description_en": "Omnilinx is a Bulgarian omnichannel platform that unifies customer communications across chat, email, social media, and phone into a single dashboard. Built for customer support teams that need to manage high volumes efficiently.",
        "description_bg": "Omnilinx е българска омниканална платформа, която обединява клиентските комуникации от чат, имейл, социални медии и телефон в единен панел. Създадена за екипи за поддръжка, които трябва ефективно да управляват голям обем заявки.",
        "website_url": "https://omnilinx.com",
        "pricing_type": "paid",
        "pricing_details_en": "Starting at 99 BGN/month per agent.",
        "pricing_details_bg": "Започва от 99 лв./месец на агент.",
        "category_slug": "crm",
        "tag_slugs": ["cloud-based", "automation", "integration-ready", "enterprise"],
        "is_featured": False,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://omnilinx.com"},
            {"link_type": "demo", "label_en": "Request Demo", "label_bg": "Заявете демо", "url": "https://omnilinx.com/demo"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "sales@omnilinx.com", "label": "Продажби"},
            {"contact_type": "linkedin", "value": "https://linkedin.com/company/omnilinx", "label": "LinkedIn"},
        ],
    },
    {
        "name": "Plovdev HR",
        "slug": "plovdev-hr",
        "tagline_en": "HR and payroll management made easy",
        "tagline_bg": "Лесно управление на човешки ресурси и заплати",
        "description_en": "Plovdev HR is an HR and payroll platform designed for small to medium Bulgarian businesses. It handles employee records, leave management, payroll calculation compliant with Bulgarian labor law, and generates all required documents.",
        "description_bg": "Пловдев HR е платформа за управление на човешки ресурси и заплати, предназначена за малки и средни български фирми. Обработва досиета на служители, управление на отпуски, изчисляване на заплати съгласно българското трудово законодателство и генерира всички необходими документи.",
        "website_url": "https://plovdev-hr.bg",
        "pricing_type": "paid",
        "pricing_details_en": "From 5 BGN/employee/month. Minimum 10 employees.",
        "pricing_details_bg": "От 5 лв./служител/месец. Минимум 10 служители.",
        "category_slug": "hr-payroll",
        "tag_slugs": ["bulgarian-language", "cloud-based", "small-business", "gdpr-compliant"],
        "is_featured": False,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://plovdev-hr.bg"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "info@plovdev-hr.bg", "label": "Информация"},
            {"contact_type": "phone", "value": "+359 32 654 321", "label": "Поддръжка"},
        ],
    },
    {
        "name": "Balkan Accounting Online",
        "slug": "balkan-accounting-online",
        "tagline_en": "Cloud accounting built for Bulgarian regulations",
        "tagline_bg": "Облачно счетоводство, създадено за българските регулации",
        "description_en": "Balkan Accounting Online is a cloud-based accounting platform that understands Bulgarian tax regulations, VAT requirements, and National Revenue Agency reporting. Automate your bookkeeping and focus on growing your business.",
        "description_bg": "Балкан Счетоводство Онлайн е облачна счетоводна платформа, която разбира българските данъчни регулации, ДДС изисквания и отчетността към НАП. Автоматизирайте счетоводството си и се фокусирайте върху растежа на бизнеса.",
        "website_url": "https://balkan-accounting.bg",
        "pricing_type": "freemium",
        "pricing_details_en": "Free for sole traders. Business plans from 39 BGN/month.",
        "pricing_details_bg": "Безплатно за еднолични търговци. Бизнес планове от 39 лв./месец.",
        "category_slug": "accounting",
        "tag_slugs": ["bulgarian-language", "cloud-based", "small-business", "free-trial", "gdpr-compliant"],
        "is_featured": True,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://balkan-accounting.bg"},
            {"link_type": "documentation", "label_en": "Knowledge Base", "label_bg": "База знания", "url": "https://help.balkan-accounting.bg"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "support@balkan-accounting.bg", "label": "Поддръжка"},
            {"contact_type": "facebook", "value": "https://facebook.com/balkanaccounting", "label": "Facebook"},
        ],
    },
    {
        "name": "LogiTrack",
        "slug": "logitrack",
        "tagline_en": "Fleet management and logistics for transport companies",
        "tagline_bg": "Управление на автопарк и логистика за транспортни компании",
        "description_en": "LogiTrack is a fleet management and logistics platform specifically designed for Bulgarian transport and courier companies. Track vehicles in real-time, optimize routes, manage fuel costs, and generate digital CMR documents.",
        "description_bg": "ЛогиТрак е платформа за управление на автопарк и логистика, специално създадена за български транспортни и куриерски компании. Проследявайте превозните средства в реално време, оптимизирайте маршрути, управлявайте разходите за гориво и генерирайте дигитални CMR документи.",
        "website_url": "https://logitrack.bg",
        "pricing_type": "paid",
        "pricing_details_en": "From 15 BGN/vehicle/month.",
        "pricing_details_bg": "От 15 лв./превозно средство/месец.",
        "category_slug": "erp",
        "tag_slugs": ["transportation", "bulgarian-language", "cloud-based", "mobile-app", "api-available"],
        "is_featured": False,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://logitrack.bg"},
            {"link_type": "demo", "label_en": "Book a Demo", "label_bg": "Заявете демо", "url": "https://logitrack.bg/demo"},
            {"link_type": "video", "label_en": "Product Tour", "label_bg": "Представяне на продукта", "url": "https://youtube.com/watch?v=logitrack-tour"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "sales@logitrack.bg", "label": "Продажби"},
            {"contact_type": "phone", "value": "+359 2 555 1234", "label": "Продажби"},
        ],
    },
    {
        "name": "MailBG",
        "slug": "mailbg",
        "tagline_en": "Email marketing made simple for Bulgarian businesses",
        "tagline_bg": "Лесен имейл маркетинг за български бизнеси",
        "description_en": "MailBG is an email marketing platform with built-in Bulgarian templates, GDPR-compliant subscriber management, and analytics. Send newsletters, automate drip campaigns, and grow your audience.",
        "description_bg": "МейлБГ е платформа за имейл маркетинг с вградени български шаблони, GDPR-съвместимо управление на абонати и анализи. Изпращайте бюлетини, автоматизирайте drip кампании и разраствайте аудиторията си.",
        "website_url": "https://mailbg.com",
        "pricing_type": "freemium",
        "pricing_details_en": "Free up to 500 subscribers. Paid plans from 19 BGN/month.",
        "pricing_details_bg": "Безплатно до 500 абоната. Платени планове от 19 лв./месец.",
        "category_slug": "marketing",
        "tag_slugs": ["automation", "bulgarian-language", "cloud-based", "small-business", "free-trial", "gdpr-compliant"],
        "is_featured": False,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://mailbg.com"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "hello@mailbg.com", "label": "Общи запитвания"},
        ],
    },
    {
        "name": "TaskForge",
        "slug": "taskforge",
        "tagline_en": "Open-source project management for dev teams",
        "tagline_bg": "Проджект мениджмънт с отворен код за екипи от разработчици",
        "description_en": "TaskForge is an open-source project management tool designed for software development teams. It features kanban boards, sprint planning, time tracking, and Git integration. Self-host it or use the cloud version.",
        "description_bg": "TaskForge е инструмент за управление на проекти с отворен код, създаден за екипи от софтуерни разработчици. Включва канбан дъски, планиране на спринтове, проследяване на време и Git интеграция. Хостнете го сами или използвайте облачната версия.",
        "website_url": "https://taskforge.dev",
        "pricing_type": "free",
        "pricing_details_en": "Free and open source. Cloud hosting available at 9 EUR/month per team.",
        "pricing_details_bg": "Безплатен и с отворен код. Облачен хостинг на 9 EUR/месец на екип.",
        "category_slug": "project-management",
        "tag_slugs": ["open-source", "cloud-based", "api-available", "small-business", "integration-ready"],
        "is_featured": False,
        "links": [
            {"link_type": "website", "label_en": "Official Website", "label_bg": "Официален уебсайт", "url": "https://taskforge.dev"},
            {"link_type": "github", "label_en": "GitHub Repository", "label_bg": "GitHub хранилище", "url": "https://github.com/taskforge/taskforge"},
            {"link_type": "documentation", "label_en": "Docs", "label_bg": "Документация", "url": "https://docs.taskforge.dev"},
        ],
        "contacts": [
            {"contact_type": "email", "value": "team@taskforge.dev", "label": "Екип"},
        ],
    },
]

LOGO_COLORS = [
    "#4A90D9",  # blue
    "#7B68EE",  # medium slate blue
    "#2ECC71",  # emerald
    "#F39C12",  # orange
    "#E74C3C",  # red
    "#1ABC9C",  # turquoise
    "#8E44AD",  # purple
    "#34495E",  # dark blue-grey
    "#D35400",  # burnt orange
    "#27AE60",  # green
]


def generate_product_logo(name, color_index):
    size = 256
    color = LOGO_COLORS[color_index % len(LOGO_COLORS)]
    letter = name[0].upper()

    img = Image.new("RGB", (size, size), color)
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default(size=120)
    draw.text((size / 2, size / 2), letter, fill="white", font=font, anchor="mm")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return ContentFile(buffer.getvalue())


class Command(BaseCommand):
    help = "Seed the database with sample categories, tags, and products"

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete all existing data before seeding",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write("Flushing existing data...")
            ProductContact.objects.all().delete()
            ProductLink.objects.all().delete()
            Product.objects.all().delete()
            Tag.objects.all().delete()
            Category.objects.all().delete()

        # Create categories
        categories = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults=cat_data,
            )
            categories[cat.slug] = cat
            status = "Created" if created else "Exists"
            self.stdout.write(f"  {status}: Category '{cat.name}'")

        # Create tags
        tags = {}
        for tag_data in TAGS:
            tag, created = Tag.objects.get_or_create(
                slug=tag_data["slug"],
                defaults=tag_data,
            )
            tags[tag.slug] = tag
            status = "Created" if created else "Exists"
            self.stdout.write(f"  {status}: Tag '{tag.name}'")

        # Create products
        for idx, prod_data in enumerate(PRODUCTS):
            category_slug = prod_data.pop("category_slug")
            tag_slugs = prod_data.pop("tag_slugs")
            links_data = prod_data.pop("links")
            contacts_data = prod_data.pop("contacts")

            product, created = Product.objects.get_or_create(
                slug=prod_data["slug"],
                defaults={
                    **prod_data,
                    "category": categories.get(category_slug),
                },
            )

            if created:
                product.tags.set([tags[s] for s in tag_slugs if s in tags])

                for link in links_data:
                    ProductLink.objects.create(product=product, **link)

                for contact in contacts_data:
                    ProductContact.objects.create(product=product, **contact)

            if not product.logo:
                logo = generate_product_logo(prod_data["name"], idx)
                product.logo.save("logo.png", logo, save=True)
                self.stdout.write(f"    Generated logo for '{product.name}'")

            status = "Created" if created else "Exists"
            self.stdout.write(f"  {status}: Product '{product.name}'")

        self.stdout.write(self.style.SUCCESS(
            f"\nDone! {Product.objects.count()} products, "
            f"{Category.objects.count()} categories, "
            f"{Tag.objects.count()} tags in the database."
        ))

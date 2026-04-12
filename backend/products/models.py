from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class name (e.g. Font Awesome)")
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower = first)")

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    class PricingType(models.TextChoices):
        FREE = "free", "Free"
        FREEMIUM = "freemium", "Freemium"
        PAID = "paid", "Paid"
        CONTACT = "contact_for_pricing", "Contact for Pricing"

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    tagline = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to="products/logos/", blank=True)
    website_url = models.URLField(blank=True)
    pricing_type = models.CharField(
        max_length=20,
        choices=PricingType.choices,
        default=PricingType.FREE,
    )
    pricing_details = models.TextField(blank=True, help_text="Free-form pricing info")
    tags = models.ManyToManyField(Tag, blank=True, related_name="products")
    is_featured = models.BooleanField(default=False, help_text="Show on the hero/index page")
    is_active = models.BooleanField(default=True, help_text="Inactive products are hidden from the public site")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="products/images/")
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductLink(models.Model):
    class LinkType(models.TextChoices):
        WEBSITE = "website", "Website"
        DEMO = "demo", "Demo"
        DOCUMENTATION = "documentation", "Documentation"
        VIDEO = "video", "Video"
        GITHUB = "github", "GitHub"

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="links",
    )
    label = models.CharField(max_length=100, blank=True)
    url = models.URLField()
    link_type = models.CharField(
        max_length=20,
        choices=LinkType.choices,
        default=LinkType.WEBSITE,
    )

    def __str__(self):
        return f"{self.product.name} - {self.get_link_type_display()}"


class ProductContact(models.Model):
    class ContactType(models.TextChoices):
        EMAIL = "email", "Email"
        PHONE = "phone", "Phone"
        FACEBOOK = "facebook", "Facebook"
        LINKEDIN = "linkedin", "LinkedIn"
        OTHER = "other", "Other"

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="contacts",
    )
    contact_type = models.CharField(
        max_length=20,
        choices=ContactType.choices,
        default=ContactType.EMAIL,
    )
    value = models.CharField(max_length=300)
    label = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.product.name} - {self.get_contact_type_display()}: {self.value}"

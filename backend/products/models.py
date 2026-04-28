import uuid

from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone
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
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


def product_logo_path(instance, filename):
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "png"
    return f"products/{instance.slug}/logo.{ext}"


def product_image_path(instance, filename):
    return f"products/{instance.product.slug}/{filename}"


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
    logo = models.FileField(
        upload_to=product_logo_path,
        blank=True,
        validators=[FileExtensionValidator(["png", "jpg", "jpeg", "webp", "svg"])],
    )
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
    image = models.ImageField(upload_to=product_image_path)
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


def request_logo_path(instance, filename):
    return f"product_requests/{instance.product_name}/logo_{filename}"


def request_image_path(instance, filename):
    return f"product_requests/{instance.request.product_name}/{filename}"


class ProductSubmissionInvitation(models.Model):
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    revoked = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return str(self.token)

    def is_valid(self):
        if self.revoked or self.used_at:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True


class ProductDataRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending review"
        REVIEWED = "reviewed", "Reviewed"
        ARCHIVED = "archived", "Archived"

    invitation = models.ForeignKey(
        ProductSubmissionInvitation,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="submissions",
    )
    submitter_email = models.EmailField()

    product_name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    logo = models.FileField(
        upload_to=request_logo_path,
        validators=[FileExtensionValidator(["png", "jpg", "jpeg", "webp", "svg"])],
    )
    website_url = models.URLField(blank=True)
    pricing_type = models.CharField(
        max_length=20,
        choices=Product.PricingType.choices,
        default=Product.PricingType.FREE,
    )
    pricing_details = models.TextField(
        blank=True,
        help_text="Optional. Can be left empty for free products.",
    )
    suggested_category = models.ForeignKey(
        Category,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="product_data_requests",
    )
    suggested_tags = models.ManyToManyField(Tag, blank=True, related_name="product_data_requests")

    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return self.product_name


class ProductDataRequestImage(models.Model):
    request = models.ForeignKey(
        ProductDataRequest,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to=request_image_path)

class ProductDataRequestLink(models.Model):
    request = models.ForeignKey(
        ProductDataRequest,
        on_delete=models.CASCADE,
        related_name="links",
    )
    label = models.CharField(max_length=100, blank=True)
    url = models.URLField()
    link_type = models.CharField(
        max_length=20,
        choices=ProductLink.LinkType.choices,
        default=ProductLink.LinkType.WEBSITE,
    )


class ProductDataRequestContact(models.Model):
    request = models.ForeignKey(
        ProductDataRequest,
        on_delete=models.CASCADE,
        related_name="contacts",
    )
    contact_type = models.CharField(
        max_length=20,
        choices=ProductContact.ContactType.choices,
        default=ProductContact.ContactType.EMAIL,
    )
    value = models.CharField(max_length=300)
    label = models.CharField(max_length=100, blank=True)

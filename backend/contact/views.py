import logging

from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import ContactSerializer

logger = logging.getLogger(__name__)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def contact_view(request):
    """
    POST /api/contact/ - validate form data and send email.
    """
    serializer = ContactSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    validated_data = serializer.validated_data
    name = validated_data["name"]
    email = validated_data["email"]
    phone = validated_data.get("phone", "")
    message = validated_data["message"]

    try:
        EmailMessage(
            subject=f"Ново съобщение от {name}",
            body=(
                f"Име: {name}\n"
                f"Имейл: {email}\n"
                f"Телефон: {phone}\n"
                f"Съобщение: {message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL_TO],
            reply_to=[email],
        ).send()
    except Exception:
        logger.exception("Contact form send_mail failed")
        return Response(
            {"detail": "Failed to send message. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response({"detail": "Message sent successfully."})

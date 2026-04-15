from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import ContactSerializer


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
        send_mail(
            subject=f"Ново съобщение от {name}",
            message=(
                f"Име: {name}\n"
                f"Имейл: {email}\n"
                f"Телефон: {phone}\n"
                f"Съобщение: {message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_EMAIL_TO],
        )
    except Exception:
        return Response(
            {"detail": "Failed to send message. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response({"detail": "Message sent successfully."})

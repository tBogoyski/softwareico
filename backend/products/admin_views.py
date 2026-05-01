from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.http import Http404, HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML

from .pitch_copy import COPY


@staff_member_required
def download_pitch_pdf(request, lang):
    if lang not in COPY:
        raise Http404("Unsupported language")

    html = render_to_string(
        "admin/pitch.html",
        {
            "frontend_origin": settings.FRONTEND_ORIGIN,
            "lang": lang,
            "t": COPY[lang],
        },
    )
    pdf_bytes = HTML(
        string=html,
        base_url=request.build_absolute_uri("/"),
    ).write_pdf()

    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="softwareico-{lang}.pdf"'
    return response

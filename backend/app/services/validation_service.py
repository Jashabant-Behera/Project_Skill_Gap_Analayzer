import bleach
from typing import Optional

ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'code', 'pre', 'p', 'br', 'ul', 'ol', 'li']
ALLOWED_ATTRIBUTES = {}

class ValidationService:
    @staticmethod
    def sanitize_html(text: str) -> str:
        """Sanitize HTML input to prevent XSS"""
        if not text:
            return ""
        
        return bleach.clean(
            text,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )

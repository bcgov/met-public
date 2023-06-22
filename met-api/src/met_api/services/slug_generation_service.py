"""Service for generating slugs."""
from slugify import slugify


class SlugGenerationService:
    """Service for generating slugs."""

    @staticmethod
    def generate_slug(text: str) -> str:
        """Generate a slug from the provided text."""
        normalized_text = slugify(text, lowercase=True, max_length=100)
        return normalized_text

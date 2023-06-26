"""Service for generating slugs."""
from slugify import slugify
from met_api.config import _Config


class SlugGenerationService:
    """Service for generating slugs."""

    @staticmethod
    def generate_slug(text: str) -> str:
        """Generate a slug from the provided text."""
        normalized_text = slugify(
            text,
            to_lower=True,  # NOSONAR # to_lower is a valid paramter for awesome-slugify
            max_length=_Config.SLUG_MAX_CHARACTERS
        )
        return normalized_text

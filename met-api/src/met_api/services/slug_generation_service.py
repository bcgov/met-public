"""Service for generating slugs."""
from slugify import UniqueSlugify
from met_api.config import _Config


class SlugGenerationService:
    """Service for generating slugs."""

    @staticmethod
    def generate_slug(text: str) -> str:
        """Generate a slug from the provided text."""
        slugify = SlugGenerationService.create_custom_unique_slugify()
        normalized_text = slugify(text)
        return normalized_text

    # used by the migration script 88aba309bc23, has to return unique slugify
    @staticmethod
    def create_custom_unique_slugify():
        slugify = UniqueSlugify(
            to_lower=True,  # NOSONAR # to_lower is a valid paramter for awesome-slugify
            max_length=_Config.SLUG_MAX_CHARACTERS
        )
        return slugify

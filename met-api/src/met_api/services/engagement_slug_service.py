"""Service for engagement slug management."""
import re
from met_api.models.engagement_slug import EngagementSlug as EngagementSlugModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.constants.engagement_status import Status
from met_api.services.slug_generation_service import SlugGenerationService


class EngagementSlugService:
    """Service for engagement slug management."""

    slug_generation_service: SlugGenerationService

    def __init__(self, slug_generation_service=SlugGenerationService()):
        """Initialize the EngagementSlugService."""
        self.slug_generation_service = slug_generation_service

    @classmethod
    def get_engagement_slug(cls, slug: str) -> EngagementSlugModel:
        """Get an engagement slug by slug."""
        engagement_slug = EngagementSlugModel.find_by_slug(slug)
        if not engagement_slug:
            raise ValueError(f'No engagement slug found for {slug}')
        return engagement_slug

    @classmethod
    def create_engagement_slug(cls, engagement_id: int) -> EngagementSlugModel:
        """Create an engagement slug."""
        existing_slug = EngagementSlugModel.find_by_engagement_id(engagement_id)
        if existing_slug:
            raise ValueError(f'Engagement slug already exists for engagement {engagement_id}')

        engagement = cls._verify_engagement(engagement_id)
        slug = cls.generate_unique_slug(engagement.name)
        engagement_slug = EngagementSlugModel(engagement_id=engagement_id, slug=slug)
        engagement_slug.save()
        return engagement_slug


    @classmethod
    def generate_unique_slug(cls, text: str) -> str:
        """Generate a unique slug."""
        normalized_slug = cls.slug_generation_service.generate_slug(text)

        similar_slugs = EngagementSlugModel.find_similar_slugs(normalized_slug)

        if not similar_slugs:
            return normalized_slug

        suffix_separator = '-'
        suffix_numbers = [
            int(re.search(r'(\d+)$', s.slug.split(normalized_slug + suffix_separator)[-1], re.ASCII).group(1))
            for s in similar_slugs
            if re.search(r'(\d+)$', s.slug.split(normalized_slug + suffix_separator)[-1], re.ASCII)
        ]

        counter = max(suffix_numbers) + 1 if suffix_numbers else 1

        unique_slug = f"{normalized_slug}{suffix_separator}{counter}"
        return unique_slug



    @classmethod
    def update_engagement_slug(cls, slug: str, engagement_id: int) -> EngagementSlugModel:
        """Update an engagement slug."""
        engagement_slug = EngagementSlugModel.find_by_engagement_id(engagement_id)
        if not engagement_slug:
            raise ValueError(f'No engagement found for {slug}')

        cls._verify_engagement(engagement_id)

        engagement_slug.slug = slug
        engagement_slug.save()
        return engagement_slug

    @staticmethod
    def _verify_engagement(engagement_id):
        """Verify the engagement."""
        if not engagement_id:
            raise KeyError('engagement_id is required')
        engagement = EngagementModel.find_by_id(engagement_id)
        if not engagement:
            raise ValueError(f'No engagement found for {engagement_id}')
        if engagement.status_id != Status.Draft:
            raise ValueError(f'Engagement {engagement_id} is not in draft status')
        return engagement

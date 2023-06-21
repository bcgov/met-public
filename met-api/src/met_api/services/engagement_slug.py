"""Service for engagement slug management."""
from met_api.models.engagement_slug import EngagementSlug as EngagementSlugModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.constants.engagement_status import Status


class EngagementSlugService:
    """Service for engagement slug management."""

    @staticmethod
    def get_engagement_slug(slug: str) -> EngagementSlugModel:
        """Get an engagement slug by slug."""
        engagement_slug = EngagementSlugModel.find_by_slug(slug)
        if not engagement_slug:
            raise ValueError(f'No engagement slug found for {slug}')
        return engagement_slug

    @staticmethod
    def create_engagement_slug(engagement_id: int, slug: str) -> EngagementSlugModel:
        """Create an engagement slug."""
        existing_slug = EngagementSlugModel.find_by_engagement_id(engagement_id)
        if existing_slug:
            raise ValueError(f'Engagement slug already exists for engagement {engagement_id}')

        EngagementSlugService.verify_engagement(engagement_id)

        engagement_slug = EngagementSlugModel(engagement_id=engagement_id, slug=slug)
        engagement_slug.save()
        return engagement_slug

    @staticmethod
    def update_engagement_slug(slug: str, engagement_id: int) -> EngagementSlugModel:
        """Update an engagement slug."""
        engagement_slug = EngagementSlugModel.find_by_engagement_id(engagement_id)
        if not engagement_slug:
            raise ValueError(f'No engagement found for {slug}')

        EngagementSlugService.verify_engagement(engagement_id)

        engagement_slug.slug = slug
        engagement_slug.save()
        return engagement_slug

    @staticmethod
    def _verify_engagement(engagement_id):
        if not engagement_id:
            raise KeyError('engagement_id is required')
        engagement = EngagementModel.find_by_id(engagement_id)
        if not engagement:
            raise ValueError(f'No engagement found for {engagement_id}')
        if engagement.status_id != Status.Draft:
            raise ValueError(f'Engagement {engagement_id} is not in draft status')

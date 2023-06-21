"""Service for engagement slug management."""
import re
from met_api.models.engagement_slug import EngagementSlug as EngagementSlugModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.constants.engagement_status import Status
from met_api.services.slug_generation_service import SlugGenerationService


class EngagementSlugService:
    """Service for engagement slug management."""

    def __init__(self, slug_generation_service):
        self.slug_generation_service = slug_generation_service

    def get_engagement_slug(self, slug: str) -> EngagementSlugModel:
        """Get an engagement slug by slug."""
        engagement_slug = EngagementSlugModel.find_by_slug(slug)
        if not engagement_slug:
            raise ValueError(f'No engagement slug found for {slug}')
        return engagement_slug

    def create_engagement_slug(self, engagement_id: int) -> EngagementSlugModel:
        """Create an engagement slug."""
        existing_slug = EngagementSlugModel.find_by_engagement_id(engagement_id)
        if existing_slug:
            raise ValueError(f'Engagement slug already exists for engagement {engagement_id}')

        engagement = self._verify_engagement(engagement_id)
        slug = self._generate_unique_slug(engagement.name)
        engagement_slug = EngagementSlugModel(engagement_id=engagement_id, slug=slug)
        engagement_slug.save()
        return engagement_slug

    def _generate_unique_slug(self, text: str):
        # Generate a normalized slug from the provided text
        normalized_slug = self.slug_generation_service.generate_slug(text)

        # Find similar slugs in the database that have similar name and pattern
        similar_slugs = EngagementSlugModel.find_similar_slugs(normalized_slug)

        # If no similar slugs exist, return the normalized slug as is
        if not similar_slugs:
            return normalized_slug

        # Set the separator for appending the counter suffix to the slug
        suffix_separator = '-'

        # Extract the suffix numbers from the existing similar slugs
        # e.g. ['example-slug', 'example-slug-1', 'example-slug-2'] extract [1, 2]
        suffix_numbers = [
            int(re.search(r'\d+$', s.slug.split(normalized_slug + suffix_separator)[-1]).group())
            for s in similar_slugs
            if re.search(r'\d+$', s.slug.split(normalized_slug + suffix_separator)[-1])
        ]

        # Determine the counter for generating the unique slug
        counter = max(suffix_numbers) + 1 if suffix_numbers else 1

        # Construct the unique slug by appending the counter suffix
        # e.g. if we had ['example-slug-1', 'example-slug-2'] in the DB our new one will be 'example-slug-3'
        unique_slug = f"{normalized_slug}{suffix_separator}{counter}"

        return unique_slug


    def update_engagement_slug(self, slug: str, engagement_id: int) -> EngagementSlugModel:
        """Update an engagement slug."""
        engagement_slug = EngagementSlugModel.find_by_engagement_id(engagement_id)
        if not engagement_slug:
            raise ValueError(f'No engagement found for {slug}')

        self._verify_engagement(engagement_id)

        engagement_slug.slug = slug
        engagement_slug.save()
        return engagement_slug

    def _verify_engagement(self, engagement_id):
        if not engagement_id:
            raise KeyError('engagement_id is required')
        engagement = EngagementModel.find_by_id(engagement_id)
        if not engagement:
            raise ValueError(f'No engagement found for {engagement_id}')
        if engagement.status_id != Status.Draft:
            raise ValueError(f'Engagement {engagement_id} is not in draft status')
        return engagement

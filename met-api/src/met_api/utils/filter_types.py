"""Filters used to filter by metadata contents in various ways."""

from met_api.models.engagement_metadata import EngagementMetadata, MetadataTaxonFilterType
from sqlalchemy import func


def list_match_all(query, values):
    """Create and return a subquery selecting engagements that have all of the provided values."""
    # Create a subquery to find engagements that have the required number of matching metadata entries
    values_count = len(values)
    subquery = query.filter(
        EngagementMetadata.value.in_(values)
    ).group_by(
        # Group by engagement_id to count the number of matching values
        EngagementMetadata.engagement_id
    ).having(
        # Ensure that the number of matching values is equal to the number of values provided
        func.count('*') == values_count
    ) .subquery()
    return subquery


def list_match_any(query, values):
    """Create and return a subquery selecting engagements that have any of the provided values."""
    metadata_subq = query.filter(
        EngagementMetadata.value.in_(values)
    ).subquery()

    return metadata_subq


"""
Provide a mapping from each filter type to the function that should be used
to filter by that type.
"""
filter_map = {
    MetadataTaxonFilterType.CHIPS_ALL: list_match_all,
    MetadataTaxonFilterType.CHIPS_ANY: list_match_any,
}

"""This module holds data classes."""

from typing import List
from attr import dataclass


@dataclass
class EngagementScopeOptions:  # pylint: disable=too-many-instance-attributes
    """Used to store survey engagement scope options."""

    include_assigned: bool = False
    engagement_status_ids: List[int] = []
    restricted: bool = True
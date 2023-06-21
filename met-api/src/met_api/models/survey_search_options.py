"""This module holds data classes."""

from typing import List
from attr import dataclass


@dataclass
class SurveySearchOptions:  # pylint: disable=too-many-instance-attributes
    """Used to store survey search options."""

    exclude_hidden: bool
    exclude_template: bool
    assigned_engagements: List[int] = None
    search_text: str = ''
    unlinked: bool = False
    can_view_all_engagements: bool = True

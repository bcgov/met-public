"""This module holds data classes."""

from typing import List
from attr import dataclass
from typing import Optional


@dataclass
class SurveySearchOptions:  # pylint: disable=too-many-instance-attributes
    """Used to store survey search options."""

    exclude_hidden: bool
    exclude_template: bool
    assigned_engagements: List[int] = Optional[List[int]]
    search_text: str = ''
    can_view_all_engagements: bool = True
    is_unlinked: bool = False
    is_linked: bool = False
    is_hidden: bool = False
    is_template: bool = False
    created_from_date: str = Optional[str]
    created_to_date: str = Optional[str]
    published_from_data: str = Optional[str]
    published_to_date: str = Optional[str]

"""This module holds data classes."""

from attr import dataclass


@dataclass
class SurveySearchOptions:  # pylint: disable=too-many-instance-attributes
    """Used to store survey search options."""

    exclude_hidden: bool
    exclude_template: bool
    assigned_engagements: list[int] = None
    search_text: str = ''
    unlinked: bool = False

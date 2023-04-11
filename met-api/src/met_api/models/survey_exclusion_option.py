"""This module holds data classes."""

from attr import dataclass


@dataclass
class SurveyExclusionOptions:  # pylint: disable=too-many-instance-attributes
    """Used to store survey exclusion options."""

    exclude_hidden: bool
    exclude_template: bool

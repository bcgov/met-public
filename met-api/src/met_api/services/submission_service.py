
"""Service for submission management."""
from met_api.models.submission import Submission
from met_api.schemas.submission import SubmissionSchema


class SubmissionService:
    """Submission management service."""

    otherdateformat = '%Y-%m-%d'

    @classmethod
    def get(cls, submission_id):
        """Get submission by the id."""
        db_data = Submission.get_survey(submission_id)
        return db_data

    @classmethod
    def get_by_survey_id(cls, survey_id):
        """Get all surveys."""
        db_data = Submission.get_by_survey_id(survey_id)
        return db_data

    @classmethod
    def create(cls, data: SubmissionSchema):
        """Create submission."""
        cls.validate_fields(data)
        return Submission.create(data)

    @classmethod
    def update(cls, data: SubmissionSchema):
        """Update submission."""
        cls.validate_fields(data)
        return Submission.update(data)

    @staticmethod
    def validate_fields(data):
        # TODO: Validate against survey form_json
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['submission_json', 'survey_id']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

"""Schema for Widget Poll."""
from met_api.models.widget_poll import Poll as PollModel
from met_api.models.poll_answers import PollAnswer as PollAnswerModel
from marshmallow import Schema
from marshmallow_sqlalchemy.fields import Nested


class PollAnswerSchema(Schema):
    """
    Schema for serializing and deserializing Poll Answer data.

    This schema is used to represent poll answers in a structured format,
    facilitating operations like loading from and dumping to JSON.
    """

    class Meta:
        """Meta class for PollAnswerSchema options."""

        model = PollAnswerModel  # The model representing Poll Answer.
        fields = ('id', 'answer_text', 'poll_id')  # Fields to include in the schema.


class WidgetPollSchema(Schema):
    """
    Schema for serializing and deserializing Widget Poll data.

    This schema is designed to handle Widget Poll data, enabling easy conversion
    between Python objects and JSON representation, specifically for Widget Polls.
    """

    class Meta:
        """Meta class for WidgetPollSchema options."""

        model = PollModel  # The model representing Widget Poll.
        fields = ('id', 'title', 'description', 'status', 'widget_id', 'engagement_id', 'answers')

    answers = Nested(PollAnswerSchema, many=True)
    """Nested field for Poll Answers.

    This field represents a collection of Poll Answers associated with a Widget Poll,
    allowing for the inclusion of related Poll Answer data within a Widget Poll's serialized form.
    """

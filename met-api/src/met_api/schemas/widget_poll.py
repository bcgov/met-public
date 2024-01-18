"""Schema for WidgetPoll."""
from met_api.models.widget_poll import Poll as PollModel
from met_api.models.poll_answers import PollAnswer as PollAnswerModel
from marshmallow import Schema
from marshmallow_sqlalchemy.fields import Nested

class PollAnswerSchema(Schema):
    class Meta:
        model = PollAnswerModel
        fields = ('id', 'answer_text', 'poll_id')

class WidgetPollSchema(Schema):
    class Meta:
        model = PollModel
        fields = ('id', 'title', 'description', 'status', 'widget_id', 'engagement_id', 'answers')

    answers = Nested(PollAnswerSchema, many=True)

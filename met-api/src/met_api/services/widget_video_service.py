"""Service for Widget Video management."""
from http import HTTPStatus

from met_api.exceptions.business_exception import BusinessException
from met_api.models.widget_video import WidgetVideo as WidgetVideoModel


class WidgetVideoService:
    """Widget Video management service."""

    @staticmethod
    def get_video(widget_id):
        """Get video by widget id."""
        widget_video = WidgetVideoModel.get_video(widget_id)
        return widget_video

    @staticmethod
    def create_video(widget_id, video_details: dict):
        """Create video for the widget."""
        video_data = dict(video_details)
        widget_video = WidgetVideoService._create_video_model(widget_id, video_data)
        widget_video.commit()
        return widget_video

    @staticmethod
    def update_video(widget_id, request_json):
        """Update video widget."""
        widget_video: WidgetVideoModel = WidgetVideoModel.get_video(widget_id)
        if widget_video.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and video',
                status_code=HTTPStatus.BAD_REQUEST)
        return WidgetVideoModel.update_video(widget_id, request_json)

    @staticmethod
    def _create_video_model(widget_id, video_data: dict):
        video_model: WidgetVideoModel = WidgetVideoModel()
        video_model.widget_id = widget_id
        video_model.engagement_id = video_data.get('engagement_id')
        video_model.video_url = video_data.get('video_url')
        video_model.description = video_data.get('description')
        video_model.flush()
        return video_model

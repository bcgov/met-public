"""Service for Widget Video management."""
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
    def update_video(widget_id, video_widget_id, video_data):
        """Update video widget."""
        widget_video: WidgetVideoModel = WidgetVideoModel.find_by_id(video_widget_id)
        if not widget_video:
            raise KeyError('Video widget not found')

        if widget_video.widget_id != widget_id:
            raise ValueError('Invalid widgets and video')

        return WidgetVideoModel.update_video(widget_video.id, video_data)

    @staticmethod
    def _create_video_model(widget_id, video_data: dict):
        video_model: WidgetVideoModel = WidgetVideoModel()
        video_model.widget_id = widget_id
        video_model.engagement_id = video_data.get('engagement_id')
        video_model.video_url = video_data.get('video_url')
        video_model.description = video_data.get('description')
        video_model.flush()
        return video_model

# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""MET Comments Redact Event Logs."""
from datetime import datetime

from met_cron.services.comment_redact_service import CommentRedactService


class MetCommentRedact:  # pylint:disable=too-few-public-methods
    """Task to redact comments of closed engagements."""

    @classmethod
    def do_redact(cls):
        """Comment redaction event logs."""
        print('Starting comments redaction event logs at------------------------', datetime.now())

        CommentRedactService.do_redact_comments()

# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Check Subscription decorator.

A simple decorator to check the subscription for a user.
"""
from met_api.constants.subscription_type import SubscriptionType
# from met_api.models.engagement_metadata import EngagementMetadataModel

class CheckSubscription:
    """Template helper class."""

    @staticmethod
    def check_subscription(subscriber, engagement_id):
        """Send mail only if user has a valid subscription.

            1. If user is subscribed to a tenant, send all notification emails
            2. If user is subscribed to a project, send notifications for engagements related to the project
            3. If user is subscribed to a engagement, send notifications related to the engagement

        """
        if subscriber.type == SubscriptionType.TENANT.value:
            return True
        elif subscriber.type == SubscriptionType.PROJECT.value:
            # TODO should be re-visited once the engagement metadata functionality of completed
            # engagement_metadata: EngagementMetadataModel = EngagementMetadataModel.find_by_id(engagement_id)
            # if subscriber.project_id == engagement_metadata.project_id:
            #     return True
            if subscriber.engagement_id == engagement_id:
                return True
        elif subscriber.type == SubscriptionType.ENGAGEMENT.value:
            if subscriber.engagement_id == engagement_id:
                return True
        else:
            return None

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
"""Datetime object helper."""
from datetime import datetime

import pytz


def local_datetime():
    """Get the local (Pacific Timezone) datetime."""
    utcmoment = datetime.utcnow().replace(tzinfo=pytz.utc)
    now = utcmoment.astimezone(pytz.timezone('America/Vancouver'))
    return now


def utc_datetime():
    """Get the UTC datetime."""
    utcmoment = datetime.utcnow().replace(tzinfo=pytz.utc)
    now = utcmoment.astimezone(pytz.timezone('UTC'))
    return now

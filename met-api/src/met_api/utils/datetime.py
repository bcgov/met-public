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
import pytz
from flask import current_app

from datetime import datetime


def local_datetime():
    """Get the local (Pacific Timezone) datetime."""
    utcmoment = datetime.utcnow().replace(tzinfo=pytz.utc)
    now = utcmoment.astimezone(pytz.timezone('US/Pacific'))
    return now


def utc_datetime():
    """Get the UTC datetime."""
    utcmoment = datetime.utcnow().replace(tzinfo=pytz.utc)
    now = utcmoment.astimezone(pytz.timezone('UTC'))
    return now


def convert_and_format_to_utc_str(date_val: datetime, dt_format='%Y-%m-%d %H:%M:%S', timezone_override=None):
    """Convert a datetime object to UTC and format it as a string."""
    tz_name = timezone_override or current_app.config['LEGISLATIVE_TIMEZONE']
    tz_local = pytz.timezone(tz_name)

    # Assume the input datetime is in the local time zone
    date_val = tz_local.localize(date_val)

    # Convert to UTC
    date_val_utc = date_val.astimezone(pytz.UTC)

    # Format as a string
    utc_datetime_str = date_val_utc.strftime(dt_format)

    return utc_datetime_str

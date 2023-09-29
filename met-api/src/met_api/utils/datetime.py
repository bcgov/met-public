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


def get_local_time(date_val: datetime, timezone_override=None):
    """Return local time value."""
    tz_name = timezone_override or current_app.config['LEGISLATIVE_TIMEZONE']
    tz_local = pytz.timezone(tz_name)
    date_val = date_val.astimezone(tz_local)
    return date_val


def get_local_formatted_date_time(date_val: datetime, dt_format: str = '%Y-%m-%d %H:%M:%S'):
    """Return formatted local time."""
    return get_local_time(date_val).strftime(dt_format)


def get_local_formatted_date(date_val: datetime, dt_format: str = '%Y-%m-%d'):
    """Return formatted local time."""
    return get_local_time(date_val).strftime(dt_format)

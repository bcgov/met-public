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
"""Service to do maintenance on Database."""

from met_api.models.db import db

class DatabaseService:  # pylint: disable=too-few-public-methods
    """Database maintenance Service."""

    @staticmethod
    def purge_event_logs():
        """Perform the purge of dagster event logs"""
        with db.engine.connect() as con:
            con.execute('delete from dagster.event_logs where timestamp < current_timestamp + interval \'-15\' day;')
            con.execution_options(isolation_level="AUTOCOMMIT").execute('VACUUM dagster.event_logs;')
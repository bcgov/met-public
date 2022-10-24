from typing import Dict, List

import psycopg2.extras as p
from dagster import op
from utils.config import (
    get_met_db_creds,
    get_met_analytics_db_creds,
)
from utils.db import WarehouseConnection

@op
def extract_user_data() -> List[Dict[str, str]]:
    with WarehouseConnection(get_met_db_creds()).managed_cursor() as curr:
        curr.execute(
            '''
            select 
                'Y' as is_active,
                email_id as name,
                1 as runcycle_id
            from public.user where id = 8
            '''
        )
        user_data = curr.fetchall()
    return [
        {
            "is_active": str(d[0]),
            "name": str(d[1]),
            "runcycle_id": str(d[2]),
        }
        for d in user_data
    ]

@op
def load_user_data(user_data_to_load: List[Dict[str, str]]):
    ins_qry = """
    INSERT INTO public.user_details(
        is_active,
        name,
        runcycle_id
    )
    VALUES (
        %(is_active)s,
        %(name)s,
        %(runcycle_id)s
    )
    """
    with WarehouseConnection(get_met_analytics_db_creds()).managed_cursor() as curr:
        p.execute_batch(curr, ins_qry, user_data_to_load)


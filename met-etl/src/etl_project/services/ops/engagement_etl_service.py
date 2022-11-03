from dagster import Out, Output, op
from met_api.models.engagement import Engagement as MetEngagementModel
from met_cron.models.engagement import Engagement as EtlEngagementModel
from sqlalchemy.orm import sessionmaker
from utils.config import get_met_db_creds, get_met_analytics_db_creds
from datetime import datetime

def _get_met_session():
    engine = get_met_db_creds()
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


def _get_met_etl_session():
    engine = get_met_analytics_db_creds()
    Session = sessionmaker(bind=engine)
    session = Session()
    return session

@op(out={"newengagement": Out()})
def extract_engagement(context, engagementrunsequence):
    session = _get_met_session()
    default_datetime = datetime(1900, 1, 1, 0, 0, 0, 0)
    new_engagement = session.query(MetEngagementModel).filter(MetEngagementModel.created_date > default_datetime).all()
    yield Output(new_engagement, "newengagement")
    session.commit()
    session.close()

@op(out={"currentruncycleid": Out()})
def load_engagement(context, newengagement):
    session = _get_met_etl_session()
    if len(newengagement) > 0:
        for engagement in newengagement:
            engagement_model = EtlEngagementModel(name=engagement.name, 
            source_engagement_id = engagement.id,
            start_date = engagement.start_date,
            end_date = engagement.end_date,
            is_active = True,
            published_date = engagement.published_date,
            runcycle_id = 1,
            created_date = engagement.created_date,
            updated_date = engagement.updated_date
            )
            session.add(engagement_model)
            session.commit()
    session.close()

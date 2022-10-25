FROM python:3.7.13-slim

ARG DAGSTER_VERSION=0.16.13

# ==> Add Dagster layer
RUN \
    pip install \
        dagster==1.0.13 \
        dagster-postgres==0.16.13 \
        dagster-celery[flower,redis,kubernetes]==${DAGSTER_VERSION} \
        dagster-aws==${DAGSTER_VERSION} \
        dagster-k8s==${DAGSTER_VERSION} \
        dagster-celery-k8s==${DAGSTER_VERSION}

# ==> Add user code layer
# Example pipelines
COPY src/ /
RUN chmod -R g+rwX /opt
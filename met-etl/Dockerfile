FROM python:3.8.5-buster

ARG DAGSTER_LIBRARIES_VERSION=0.23.15

RUN pip install --upgrade pip
# ==> Add Dagster layer
RUN \
    pip install \
        dagster==1.7.15 \
        dagster-postgres==${DAGSTER_LIBRARIES_VERSION} \
        dagster-celery[flower,redis,kubernetes]==${DAGSTER_LIBRARIES_VERSION} \
        dagster-aws==${DAGSTER_LIBRARIES_VERSION} \
        dagster-k8s==${DAGSTER_LIBRARIES_VERSION} \
        dagster-celery-k8s==${DAGSTER_LIBRARIES_VERSION}

# Install the requirements
COPY ./requirements.txt .

RUN apt-get update && apt-get install -y git
RUN pip install --no-cache-dir -r requirements.txt

# ==> Add user code layer
# Example pipelines
COPY src/ /
RUN chmod -R g+rwX /opt

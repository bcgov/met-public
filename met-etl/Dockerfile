FROM python:3.9.23-bullseye

ARG DAGSTER_LIBRARIES_VERSION=0.23.15

# Install the requirements
COPY ./requirements.txt .

# Install git for Dagster dependencies
RUN apt-get update && apt-get install -y git && \
    # Clean cache after install
    apt-get clean && \
    # Upgrade pip to the latest version
    pip install --upgrade pip && \
    # ==> Add Dagster layer
    pip install \
    dagster-aws==${DAGSTER_LIBRARIES_VERSION} \
    dagster-celery-k8s==${DAGSTER_LIBRARIES_VERSION} \
    dagster-celery[flower,redis,kubernetes]==${DAGSTER_LIBRARIES_VERSION} \
    dagster-k8s==${DAGSTER_LIBRARIES_VERSION} \
    dagster-postgres==${DAGSTER_LIBRARIES_VERSION} \
    dagster==1.7.15 && \
    # ==> Install other dependencies
    pip install --no-cache-dir -r requirements.txt

# ==> Add user code layer
# Example pipelines
COPY src/ /
RUN chmod -R g+rwX /opt

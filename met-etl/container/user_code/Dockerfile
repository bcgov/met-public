FROM python:3.9-slim-bullseye

ARG DAGSTER_LIBRARIES_VERSION=0.26.16

RUN pip install --upgrade pip
# Dagster + celery + k8s dependencies
RUN \
    pip install \
    dagster==1.10.16 \
    dagster-postgres==${DAGSTER_LIBRARIES_VERSION} \
    dagster-celery[flower,redis,kubernetes]==${DAGSTER_LIBRARIES_VERSION} \
    dagster-aws==${DAGSTER_LIBRARIES_VERSION} \
    dagster-k8s==${DAGSTER_LIBRARIES_VERSION} \
    dagster-celery-k8s==${DAGSTER_LIBRARIES_VERSION}

WORKDIR /opt/dagster/app

# Install project requirements from repository root
COPY requirements.txt ./requirements.txt
RUN apt-get update && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

# Copy the full ETL project so imports like `etl_project.*` resolve
COPY src/etl_project/ /etl_project/
ENV PYTHONPATH=/etl_project

WORKDIR /etl_project

# Run dagster gRPC server on the service port used by the deployment
EXPOSE 4000
CMD ["dagster", "api", "grpc", "-h", "0.0.0.0", "-p", "4000", "-d", "/etl_project", "-f", "/etl_project/services/repo.py"]
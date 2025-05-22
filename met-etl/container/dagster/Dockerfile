# Dagster libraries to run both dagit and the dagster-daemon. Does not
# need to have access to any pipeline code.

FROM python:3.8.5-buster

ARG DAGSTER_LIBRARIES_VERSION=0.23.15

RUN pip install \
    dagster==1.7.15 \
    dagster-graphql==1.7.15 \
    dagit==1.7.15 \
    dagster-postgres==${DAGSTER_LIBRARIES_VERSION} \
    dagster-docker==${DAGSTER_LIBRARIES_VERSION}

# Set $DAGSTER_HOME and copy dagster instance and workspace YAML there
ENV DAGSTER_HOME=/opt/dagster/dagster_home/

RUN mkdir -p $DAGSTER_HOME

COPY dagster.yaml workspace.yaml $DAGSTER_HOME

WORKDIR $DAGSTER_HOME
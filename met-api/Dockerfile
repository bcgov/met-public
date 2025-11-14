FROM python:3.12.2-bullseye

USER root

# Create working directory
RUN mkdir /opt/app-root && chmod 755 /opt/app-root
WORKDIR /opt/app-root

# Accept build arguments for version information
ARG MET_BUILD_COMMIT_HASH=unknown
ARG MET_BUILD_DATE=unknown
ARG MET_BUILD_BRANCH=unknown
ARG MET_GITHUB_REPO=https://github.com/bcgov/met-public

# Set environment variables from build arguments
ENV MET_BUILD_COMMIT_HASH=${MET_BUILD_COMMIT_HASH}
ENV MET_BUILD_DATE=${MET_BUILD_DATE}
ENV MET_BUILD_BRANCH=${MET_BUILD_BRANCH}
ENV MET_GITHUB_REPO=${MET_GITHUB_REPO}

# Install the requirements
COPY ./requirements.txt .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN pip install .

USER 1001

# Set Python path
ENV PYTHONPATH=/opt/app-root/src

ENTRYPOINT ["bash", "docker-entrypoint.sh"]

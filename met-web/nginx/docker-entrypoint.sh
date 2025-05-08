#!/usr/bin/env bash

CONFIG_FILE=/etc/nginx/nginx.conf
MOUNTED_CONFIG_FILE=/nginx.conf

if [ -f "$MOUNTED_CONFIG_FILE" ]; then
    echo "Using root configuration file $MOUNTED_CONFIG_FILE."
    cp $MOUNTED_CONFIG_FILE $CONFIG_FILE
else 
    ENV_FILE=/etc/nginx/nginx.$ENV.conf
    if [ -f "$ENV_FILE" ]; then
        echo "Root configuration file not found, using environment template $ENV_FILE."
        cp $ENV_FILE $CONFIG_FILE
    else 
        echo "Root configuration file not found and environment template not found, using default."
    fi
fi

# At startup, generate the JavaScript file that sets the environment variables
# for the React app. This env variable will be used in a substitution by Nginx
# when serving the static file /config.js.
export REACT_APP_VARS_JS = $(
    # For each environment variable
    env |
    # that starts with REACT_APP_,
    grep -E '^REACT_APP_' |
    # Create a string of the form "window['_env_'].REACT_APP_VAR_NAME' = 'REACT_APP_VAR_VALUE';"
    sed -E "s/^(REACT_APP_[^=]+)=(.*)/window['_env_'].\1 = '\2';/" |
    # Join the lines with a newline character,
    awk '{printf "%s\\n", $0}' |
    # then remove the last newline character
    sed 's/\\n$//'
);

nginx -g 'daemon off;'
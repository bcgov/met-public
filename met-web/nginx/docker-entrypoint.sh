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
nginx -g 'daemon off;'
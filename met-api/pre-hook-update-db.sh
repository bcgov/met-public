#! /bin/sh
cd /opt/app-root
echo 'starting upgrade'
python3 -m flask db upgrade
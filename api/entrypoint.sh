#!/bin/bash


python3 -m flask db upgrade && python wsgi.py
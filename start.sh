#!/bin/sh
python -m venv .venv
source ./.venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
cd ./frontend
npm install
cd ..
python manage.py runserver & cd ./frontend && npm start
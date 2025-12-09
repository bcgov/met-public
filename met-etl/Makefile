PYTHON := python3.12
VENV := venv
PY := $(VENV)/bin/python
PIP := $(PY) -m pip
DEV_REQ := requirements/dev.txt

.PHONY: setup clean lint test install-dev run

setup: $(VENV)/bin/activate ## Create venv and install base + dev deps

$(VENV)/bin/activate: requirements.txt $(DEV_REQ)
	$(PYTHON) -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	$(PIP) install -r $(DEV_REQ)
	@touch $(VENV)/bin/activate

install-dev: $(VENV)/bin/activate ## Alias for setup

clean: ## Remove virtualenv
	rm -rf $(VENV)

lint: $(VENV)/bin/activate ## Run pylint/flake8 error-level checks
	PYTHONPATH=./src:./src/etl_project/services $(PY) -m pylint --disable=all --enable=E,F --disable=E1120 src
	PYTHONPATH=./src $(PY) -m flake8 src tests --select E9,F63,F7,F82

test: $(VENV)/bin/activate ## Run smoke tests
	PYTHONPATH=./src:./src/etl_project/services $(PY) -m pytest tests/smoke_test.py -q --maxfail=1

run: $(VENV)/bin/activate ## Run Dagster dev server
	PYTHONPATH=./src:./src/etl_project/services $(PY) -m dagster dev -h 0.0.0.0
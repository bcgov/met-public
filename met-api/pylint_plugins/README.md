# Pylint Plugins

This directory contains custom Pylint checkers for the MET API.

## no_print_checker

**Purpose:** Prevents use of `print()` statements which bypass sensitive data masking.

**Why:** Print statements output directly to stdout/stderr and bypass the logging system's `SensitiveDataFilter`. This creates a security risk where passwords, tokens, API keys, and other credentials could be exposed in logs.

**What it does:**
- Flags any use of `print()` function with error code **W9001**
- Exception: Allows print in `config.py` for startup messages before logging is initialized

**Usage:**
Instead of:
```python
print(f'User ID: {user_id}')
print(f'Database URL: {db_url}')
```

Use:
```python
from flask import current_app
current_app.logger.info('User ID: %s', user_id)

# or
import logging
logger = logging.getLogger(__name__)
logger.info('Database URL: %s', db_url)
```

**Configuration:**
The checker is automatically loaded via `.pylintrc`:
```ini
load-plugins=pylint_plugins.no_print_checker
```

**Testing:**
```bash
# Test with a file containing print statements
pylint --rcfile=.pylintrc path/to/file.py

# Should show:
# W9001: Print statement found - use logging to ensure sensitive data masking
```

## Adding New Checkers

1. Create a new file in this directory (e.g., `my_checker.py`)
2. Implement a class that inherits from `pylint.checkers.BaseChecker`
3. Define your messages and visit methods
4. Add a `register()` function
5. Update `.pylintrc` to load your plugin:
   ```ini
   load-plugins=pylint_plugins.no_print_checker,pylint_plugins.my_checker
   ```

See [Pylint documentation](https://pylint.readthedocs.io/en/latest/development_guide/how_tos/custom_checkers.html) for more details.

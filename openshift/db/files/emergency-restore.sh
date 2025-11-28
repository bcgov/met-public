#!/bin/bash
#
# Emergency Database Restore Script
# Use this for restoring to a completely fresh PostgreSQL instance
# that doesn't have any existing roles.
#
# Usage: ./emergency-restore.sh <backup-file.sql.gz> <database-name>
#

set -e

if [[ $# -ne 2 ]]; then
    echo "Usage: $0 <backup-file.sql.gz> <database-name>"
    echo "Example: $0 /backups/daily/2025-11-25/met-patroni-app_2025-11-25_10-34-33.sql.gz app"
    exit 1
fi

BACKUP_FILE="$1"
DATABASE="$2"

source /vault/secrets/met-patroni
export PGPASSWORD="$MET_PATRONI_PASSWORD"
export DB_HOST="${DATABASE_SERVICE_NAME:-met-patroni}"

# Check the file exists
if [[ ! -f "$BACKUP_FILE" ]]; then
    echo "Error: Backup file '$BACKUP_FILE' does not exist."
    exit 1
fi

echo "========================================"
echo "Emergency Database Restore"
echo "========================================"
echo "Backup file: $BACKUP_FILE"
echo "Target database: $DATABASE"
echo ""


# Check if target database already exists and has data
DB_EXISTS=$(psql -h $DB_HOST -U "$MET_PATRONI_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DATABASE'" | grep -q 1 && echo "yes" || echo "no")

if [[ "$DB_EXISTS" = "yes" ]]; then
    TABLE_COUNT=$(psql -h $DB_HOST -U "$MET_PATRONI_USER" -d "$DATABASE" -tc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema')" 2>/dev/null | xargs)
    
    if [[ "$TABLE_COUNT" -gt 0 ]]; then
        echo "⚠️  WARNING: Database '$DATABASE' already exists with $TABLE_COUNT table(s)"
        echo ""
        echo "This script is designed for recovery from CATASTROPHIC scenarios:"
        echo "  - Restoring to a fresh PostgreSQL cluster"
        echo "  - Disaster recovery where the database is completely lost"
        echo ""
        echo "For restoring to an existing database with existing roles, use:"
        echo "  ./backup.sh -I -s -r postgres=$DB_HOST:5432/$DATABASE"
        echo ""
        echo "This restore will:"
        echo "  1. Drop and recreate the database"
        echo "  2. Attempt to create all roles (may cause errors if roles exist)"
        echo "  3. Restore all data with ownership references"
        echo ""
        read -p "Are you sure you want to proceed with restore? (yes/no): " CONFIRM
        
        if [[ "$CONFIRM" != "yes" ]]; then
            echo "Restore cancelled."
            exit 1
        fi
        echo ""
        echo "Proceeding with emergency restore..."
        echo ""
    fi
fi

# Step 0: Create the database if it doesn't exist
echo "Step 0: Creating database if needed..."
psql -h $DB_HOST -U "$MET_PATRONI_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DATABASE'" | grep -q 1 || \
psql -h $DB_HOST -U "$MET_PATRONI_USER" -d postgres -c "CREATE DATABASE $DATABASE;"
echo "✓ Database ready"
echo ""

# Step 1: Extract and create roles first
echo "Step 1: Extracting and creating roles..."
export PGPASSWORD="$MET_PATRONI_PASSWORD"
gunzip -c "$BACKUP_FILE" | \
    sed -n '/^CREATE ROLE/,/^-- User Configurations/p' | \
    grep -E '^(CREATE ROLE|ALTER ROLE|GRANT)' | \
    psql -h $DB_HOST -U "$MET_PATRONI_USER" -d postgres

echo "✓ Roles created"
echo ""

# Step 2: Restore the emergency backup (ignoring role creation errors at the end)
echo "Step 2: Restoring database..."
gunzip -c "$BACKUP_FILE" | \
    psql -h $DB_HOST -U "$MET_PATRONI_USER" -d "$DATABASE" -v ON_ERROR_STOP=0

echo ""
echo "======================================"
echo "✓ Emergency restore complete"
echo "======================================"
echo ""
echo "Note: Role creation errors at the end are expected"
echo "(roles were already created in step 1)"

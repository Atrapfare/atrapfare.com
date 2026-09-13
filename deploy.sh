#!/usr/bin/env bash
# Deploys www/ to the web root served by the nginx container (see docker-compose.yml).
# No container restart needed: the directory is bind-mounted read-only.
set -euo pipefail
cd "$(dirname "$0")"
rsync -a --delete --exclude '.DS_Store' www/ /var/www/atrapfare/
chmod -R a+rX /var/www/atrapfare
echo "deployed $(git rev-parse --short HEAD) to /var/www/atrapfare"

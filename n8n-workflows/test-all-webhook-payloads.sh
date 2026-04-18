#!/usr/bin/env bash

set -euo pipefail

ENVIRONMENT="${1:-staging}"
BASE_URL="${2:-http://localhost:5678}"
DRY_RUN="${DRY_RUN:-0}"

PAYLOAD_FILE="$(cd "$(dirname "$0")" && pwd)/KOPRINDO-FOX-webhook-intake-payload-examples.json"

if [[ ! -f "$PAYLOAD_FILE" ]]; then
  echo "Payload examples file not found: $PAYLOAD_FILE" >&2
  exit 1
fi

case "$ENVIRONMENT" in
  single) WEBHOOK_PATH="/webhook/koprindo-fox-e2e-intake" ;;
  staging) WEBHOOK_PATH="/webhook/koprindo-fox-e2e-intake-staging" ;;
  production) WEBHOOK_PATH="/webhook/koprindo-fox-e2e-intake-prod" ;;
  *)
    echo "Unknown environment: $ENVIRONMENT" >&2
    echo "Use one of: single, staging, production" >&2
    exit 1
    ;;
esac

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to run this script." >&2
  exit 1
fi

TARGET_URL="${BASE_URL%/}${WEBHOOK_PATH}"
echo "Target environment : $ENVIRONMENT"
echo "Target webhook     : $TARGET_URL"
echo "Dry run            : $DRY_RUN"

for name in sell_out sell_in inventory payment; do
  echo
  echo "=== Sending payload: $name ==="
  BODY="$(jq ".examples.${name}" "$PAYLOAD_FILE")"

  if [[ "$DRY_RUN" == "1" ]]; then
    echo "$BODY"
    continue
  fi

  curl --silent --show-error \
    --request POST "$TARGET_URL" \
    --header "Content-Type: application/json" \
    --data "$BODY"
  echo
done

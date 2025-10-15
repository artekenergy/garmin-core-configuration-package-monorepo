#!/bin/bash

# Script to sync the correct schema.json to the Garmin device
# Usage: ./sync-schema-to-device.sh [device-ip] [device-path]

DEVICE_IP="${1:-172.16.11.7}"
DEVICE_PATH="${2:-/opt/victron/www}"

SCHEMA_SOURCE="packages/web-configurator/public/deployment-package/web/schema.json"

echo "🔄 Syncing schema.json to Garmin device"
echo "  Device: $DEVICE_IP"
echo "  Path: $DEVICE_PATH"
echo "  Source: $SCHEMA_SOURCE"
echo ""

if [ ! -f "$SCHEMA_SOURCE" ]; then
  echo "❌ Source schema not found: $SCHEMA_SOURCE"
  exit 1
fi

# Show first few lines of source schema
echo "Schema preview (first 20 lines):"
head -20 "$SCHEMA_SOURCE"
echo ""
echo "..."
echo ""

# Count outputs
OUTPUT_COUNT=$(cat "$SCHEMA_SOURCE" | python3 -c "import json, sys; print(len(json.load(sys.stdin).get('hardware', {}).get('outputs', [])))" 2>/dev/null || echo "?")
echo "Output count in source schema: $OUTPUT_COUNT"
echo ""

echo "To copy to device, run one of these commands:"
echo ""
echo "Option 1 - SCP (if you have SSH access):"
echo "  scp $SCHEMA_SOURCE root@$DEVICE_IP:$DEVICE_PATH/schema.json"
echo ""
echo "Option 2 - Use web-configurator export:"
echo "  1. Open http://localhost:3000/export"
echo "  2. Click 'Generate Deployment Package'"
echo "  3. Upload to Garmin device"
echo ""

#!/bin/bash

# Deploy HMI UI to garmin-bundle/web directory
# This script builds the HMI UI and copies it to the garmin-bundle/web directory for device deployment

set -e  # Exit on error

echo "🔨 Building HMI UI..."
pnpm build

echo ""
echo "📦 Deploying to garmin-bundle/web directory..."

# Define paths
DIST_DIR="./dist"
WEB_DIR="../../garmin-bundle/web"
GARMIN_BUNDLE_DIR="../../garmin-bundle"

# Copy the main HTML file to index1.html
echo "  → Copying index.html to index1.html"
cp "$DIST_DIR/index.html" "$WEB_DIR/index1.html"

# Copy all assets
echo "  → Copying assets directory"
rm -rf "$WEB_DIR/hmi-assets"
cp -r "$DIST_DIR/assets" "$WEB_DIR/hmi-assets"

# Copy schema.json
echo "  → Copying schema.json"
cp "$DIST_DIR/schema.json" "$WEB_DIR/schema.json"

# Copy icon library from web-configurator
ICONS_SOURCE="../web-configurator/public/icons"
if [ -d "$ICONS_SOURCE" ]; then
  echo "  → Copying icon library"
  rm -rf "$WEB_DIR/icons"
  cp -r "$ICONS_SOURCE" "$WEB_DIR/icons"
else
  echo "  ⚠ Icon library not found at $ICONS_SOURCE - skipping"
fi

# Generate cache-busting timestamp
CACHE_BUST=$(date +%s)

# Update asset paths in index1.html to point to hmi-assets with cache busting
echo "  → Updating asset paths with cache busting..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS - Add cache-busting parameter to all asset URLs
  sed -i '' "s|/assets/\([^\"]*\)\"|/hmi-assets/\1?v=$CACHE_BUST\"|g" "$WEB_DIR/index1.html"
else
  # Linux
  sed -i "s|/assets/\([^\"]*\)\"|/hmi-assets/\1?v=$CACHE_BUST\"|g" "$WEB_DIR/index1.html"
fi

echo ""
echo "📦 Creating deployment package..."

# Define output paths
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_FILENAME="garmin-hmi-deployment-$TIMESTAMP.zip"

# Get absolute paths
ABS_WEB_DIR=$(cd "$WEB_DIR" && pwd)
PROJECT_ROOT=$(dirname "$ABS_WEB_DIR")
ZIP_FILE="$PROJECT_ROOT/$ZIP_FILENAME"

# Create zip file including web, services, and configuration directories
echo "  → Packaging garmin-bundle/web directory..."
echo "  → Packaging garmin-bundle/services directory..."
echo "  → Packaging garmin-bundle/configuration directory..."
(cd "$GARMIN_BUNDLE_DIR" && zip -r "$ZIP_FILE" \
  web \
  services \
  configuration \
  -x "*.DS_Store" -x "*.map" > /dev/null 2>&1)

ZIP_SIZE=$(du -h "$ZIP_FILE" | cut -f1)

echo ""
echo "🔄 Syncing with web-configurator deployment package..."

# Update web-configurator's deployment package so exports include latest HMI UI
WEB_CONFIGURATOR_DIR="../web-configurator"
if [ -d "$WEB_CONFIGURATOR_DIR" ]; then
  echo "  → Running web-configurator prebuild to sync deployment assets..."
  (cd "$WEB_CONFIGURATOR_DIR" && pnpm run prebuild > /dev/null 2>&1)
  echo "  ✓ Web-configurator deployment package updated"
else
  echo "  ⚠ Web-configurator not found - skipping sync"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Files deployed to:"
echo "  - $WEB_DIR/index1.html"
echo "  - $WEB_DIR/hmi-assets/"
echo "  - $WEB_DIR/schema.json"
echo ""
echo "📦 Deployment package created:"
echo "  - Location: $ZIP_FILE"
echo "  - Size: $ZIP_SIZE"
echo "  - Includes: garmin-bundle/web/, garmin-bundle/services/, garmin-bundle/configuration/"
echo ""
echo "🔄 Web-configurator export package synced with latest HMI UI"
echo ""
echo "Next steps:"
echo "  1. Upload the ZIP file to your Garmin display"
echo "  2. Extract/install on the device"
echo "  3. Access the HMI UI from the Garmin menu"
echo ""
echo "Or use web-configurator export:"
echo "  1. Open http://localhost:3000/export"
echo "  2. Click 'Generate Deployment Package'"
echo "  3. Download includes this latest HMI UI build"

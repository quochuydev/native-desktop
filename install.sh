#!/usr/bin/env bash
# Download the latest Native Desktop release, install it to /Applications,
# and open it. macOS only. Usage:
#   curl -fsSL https://raw.githubusercontent.com/quochuydev/native-desktop/main/install.sh | bash
set -euo pipefail

REPO="quochuydev/native-desktop"

echo "Finding the latest release…"
URL=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
  | grep -o '"browser_download_url": *"[^"]*\.zip"' | head -1 | cut -d'"' -f4)
[ -n "$URL" ] || { echo "No release asset found." >&2; exit 1; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "Downloading $URL"
curl -fsSL "$URL" -o "$TMP/app.zip"
unzip -oq "$TMP/app.zip" -d "$TMP"

APP=$(find "$TMP" -maxdepth 1 -name '*.app' | head -1)
[ -n "$APP" ] || { echo "No .app found in the archive." >&2; exit 1; }

DEST="/Applications/$(basename "$APP")"
rm -rf "$DEST"
cp -R "$APP" "$DEST"
xattr -dr com.apple.quarantine "$DEST" 2>/dev/null || true   # unsigned build: clear Gatekeeper

echo "Installed to $DEST"
open "$DEST"

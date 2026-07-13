# Native Desktop

A small native macOS app built with the [Native SDK](https://native-sdk.dev).

## Install & run (macOS)

```sh
gh release download --repo quochuydev/native-desktop --pattern "*.zip"
unzip -o native-desktop-macos-*.zip
APP="$(ls -d *.app | head -1)"
xattr -dr com.apple.quarantine "$APP"   # unsigned build: clear Gatekeeper
open "$APP"
```

Or download the `.zip` from the [latest release](https://github.com/quochuydev/native-desktop/releases/latest) and right-click → Open.

## Updates

Checks on launch and every 20s; shows **"Update available: vX.Y.Z"** when a newer release exists. See the current published version:

```sh
curl -s https://raw.githubusercontent.com/quochuydev/native-desktop/main/latest.txt
```

## Develop

```sh
native dev      # build and run (hot reload)
native check    # validate core + markup + app.zon
native build    # release binary
```

Releases are automated with release-please — see [RELEASING.md](./RELEASING.md). Requires Node.js 22+.

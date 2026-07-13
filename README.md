# Native Desktop

A small native macOS app built with the [Native SDK](https://native-sdk.dev).

## Install & run (macOS)

1. Download the `.zip` from the [latest release](https://github.com/quochuydev/native-desktop/releases/latest).
2. Double-click the `.zip` to unzip it.
3. **Right-click** the app → **Open** (needed the first time, since the app isn't signed yet).

## Updates

The app checks automatically and shows **"Update available: vX.Y.Z"** in the bottom-left corner when a newer release exists. To update, download the new release the same way.

## Develop

```sh
native dev      # build and run (hot reload)
native check    # validate core + markup + app.zon
native build    # release binary
```

Releases are automated with release-please — see [RELEASING.md](./RELEASING.md). Requires Node.js 22+.

# Releasing

Releases are cut by pushing a semver tag. A GitHub Actions workflow
(`.github/workflows/release.yml`) does the rest: it builds and packages the
macOS app, publishes a GitHub Release with the bundle and a machine-readable
manifest, and bumps `latest.txt` on `main` so installed apps detect the
update.

## Version sources (keep them in sync)

Three places carry the version and must move together **before** you tag:

| File | What to change |
| --- | --- |
| `app.zon` | `.version = "X.Y.Z"` |
| `src/core.ts` | the two `asciiBytes("X.Y.Z")` literals in `initialModel` |
| `latest.txt` | `X.Y.Z` (the workflow rewrites this on release, but keep it honest) |

Then move the `## [Unreleased]` notes in `CHANGELOG.md` under a new
`## [X.Y.Z]` heading.

## Cut a release

```bash
# 1. Bump the version in app.zon, src/core.ts, CHANGELOG.md (and latest.txt).
# 2. Commit.
git commit -am "release: v0.2.0"
git push origin main

# 3. Tag and push — this triggers the release workflow.
git tag v0.2.0
git push origin v0.2.0
```

The workflow fails fast if the tag and `app.zon` `.version` disagree.

## What ships

- `native-desktop-macos-vX.Y.Z.zip` — the packaged `.app` bundle.
- `latest.json` — `{ version, notes, platform, url, sha256 }`, the manifest an
  in-app updater downloads to decide whether to update.
- `latest.txt` — the bare version string, committed back to `main`; the app's
  boot-time update check reads it from `raw.githubusercontent.com`.

## Auto-update

The app checks for updates on boot: `src/core.ts` fetches
`https://raw.githubusercontent.com/quochuydev/native-desktop/main/latest.txt`,
compares it to the built-in version, and surfaces "update available" when they
differ. See [AUTO_UPDATE.md](./AUTO_UPDATE.md) for the design and the path to a
full download-verify-relaunch installer.

## Code signing (not yet configured)

The macOS build is currently **unsigned**. For distribution outside your own
machine, add a Developer ID certificate and notarization to the workflow, and
have the in-app updater verify the downloaded bundle's signature before
applying it — hosting alone is never the trust anchor.

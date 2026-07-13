# Changelog

All notable changes to this project are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The version in `app.zon`, the `asciiBytes(...)` literal in `src/core.ts`, and
`latest.txt` must move together on every release — see [RELEASING.md](./RELEASING.md).

## [Unreleased]

## [0.0.1] - 2026-07-13

### Added
- Initial Native SDK desktop app scaffolded with `native init`.
- App version shown bottom-right; update-check status shown bottom-left.
- In-app update check: on boot the app fetches `latest.txt` from the default
  branch and surfaces "update available" when a newer version is published.
- GitHub Actions release workflow (`.github/workflows/release.yml`): builds and
  packages the macOS app on a `v*` tag, publishes a GitHub Release with the
  bundle and `latest.json`, and updates `latest.txt` so installed apps detect
  the release.

[Unreleased]: https://github.com/quochuydev/native-desktop/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/quochuydev/native-desktop/releases/tag/v0.0.1

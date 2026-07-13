# Changelog

## [0.1.0](https://github.com/quochuydev/native-desktop/compare/v0.0.1...v0.1.0) (2026-07-13)


### Features

* add welcome message to main UI ([#1](https://github.com/quochuydev/native-desktop/issues/1)) ([551b274](https://github.com/quochuydev/native-desktop/commit/551b2749ef9197bf84ad3489affcad9000861316))
* Native SDK desktop app with version display, release workflow, and auto-update check ([d1efe38](https://github.com/quochuydev/native-desktop/commit/d1efe38befdf007ec240a260ae462cb335281ca0))

## [0.0.1](https://github.com/quochuydev/native-desktop/releases/tag/v0.0.1) (2026-07-13)


### Features

* Initial Native SDK desktop app scaffolded with `native init`.
* App version shown bottom-right; update-check status shown bottom-left.
* In-app update check on boot and every 20s: fetches `latest.txt` and surfaces "update available" when a newer version is published.
* Releases automated with release-please: merging the release PR cuts a GitHub Release, builds the macOS app, and bumps `latest.txt`.

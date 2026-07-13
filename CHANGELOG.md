# Changelog

## [0.0.1](https://github.com/quochuydev/native-desktop/releases/tag/v0.0.1) (2026-07-13)


### Features

* Initial Native SDK desktop app scaffolded with `native init`.
* App version shown bottom-right; update-check status shown bottom-left.
* In-app update check on boot and every 20s: fetches `latest.txt` and surfaces "update available" when a newer version is published.
* Releases automated with release-please: merging the release PR cuts a GitHub Release, builds the macOS app, and bumps `latest.txt`.

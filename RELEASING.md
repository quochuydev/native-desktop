# Releasing

Releases are automated with
[release-please](https://github.com/googleapis/release-please-action). You
never tag by hand: you merge feature/fix PRs written as
[Conventional Commits](https://www.conventionalcommits.org/), and release-please
maintains a **release PR** that bumps the version and updates the changelog.

## Flow

1. Open a PR whose commits follow Conventional Commits:
   - `feat: ...` → minor bump
   - `fix: ...` → patch bump
   - `feat!:` / `BREAKING CHANGE:` → major bump
2. Merge it to `main`. The `release-please` workflow runs and opens (or updates)
   a **release PR** titled `chore(main): release X.Y.Z`.
3. Merge the release PR. release-please then:
   - tags `vX.Y.Z` and cuts a GitHub Release with generated notes,
   - bumps `.version` in `app.zon` and the `asciiBytes(...)` literals in
     `src/core.ts` (via the `x-release-please-version` annotations),
   - updates `CHANGELOG.md`,
   - and the workflow builds + packages the macOS `.app`, uploads it plus
     `latest.json` to the release, and bumps `latest.txt` on `main`.

## Version sources

release-please keeps these in sync automatically:

| File | How |
| --- | --- |
| `.release-please-manifest.json` | source of truth for the current version |
| `app.zon`, `src/core.ts` | `x-release-please-version` annotations |
| `CHANGELOG.md` | generated from commits |
| `latest.txt` | bumped by the workflow after the release is cut |

## Auto-update

The app checks `latest.txt` on boot and every 20 seconds and surfaces "update
available" when it differs from the built-in version — so once the release PR
merges and `latest.txt` bumps, a running app flips to "update available"
within ~20s. See [AUTO_UPDATE.md](./AUTO_UPDATE.md) for the download-verify-
relaunch apply path and signing notes.

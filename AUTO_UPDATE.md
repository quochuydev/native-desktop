# Auto-update

Native SDK has **no built-in auto-updater** (unlike Electron's `autoUpdater`).
But the TypeScript app-core subset exposes the effects needed to build one:
`Cmd.fetch` (HTTP), `Cmd.writeFile` (stage the download), and `Cmd.spawn`
(run an installer / relaunch). This app implements the **check + notify** half
today; the **download + apply** half is designed below.

## What's implemented (check + notify)

On boot, `initialModel` returns a `Cmd.fetch` for `latest.txt`:

```
raw.githubusercontent.com/quochuydev/native-desktop/main/latest.txt
```

- `checked` (ok arm: `{ status, body }`) — trims the body and compares it to
  the built-in version. Different → `updateReady = true`, status
  "update available". Same → "up to date". Non-200 → "update check
  unavailable".
- `checkFailed` (err arm: `{ reason }`) — offline / DNS / TLS failure →
  "offline - update check failed".

The view (`src/app.native`) shows the update status bottom-left and the
current version bottom-right. Test the logic without a network under node:

```bash
printf '%s\n' '{"kind":"checked","status":200,"body":{"$bytes":"0.2.0\n"}}' | native dev --core
```

## What's designed (download + apply)

The apply path uses the same effects channel. Sketch:

1. **User confirms** an update (a button dispatching an `install` Msg).
2. **Download** the release asset with `Cmd.fetch` (the `url` from
   `latest.json`), then `Cmd.writeFile` the bytes to a temp path.
3. **Verify** the download against the `sha256` in `latest.json` **and** the
   macOS code signature before touching the installed app. This is the trust
   anchor — hosting/transport is not.
4. **Apply + relaunch** with `Cmd.spawn`: run a small installer script that
   unzips the new `.app` over the old one and relaunches, then the current
   process exits.

```
fetch latest.txt ──▶ compare ──▶ [updateReady]
       │
   user clicks install
       ▼
fetch asset (latest.json url) ──▶ writeFile temp.zip
       ▼
verify sha256 + code signature   ← MUST pass before apply
       ▼
spawn installer (unzip + swap + relaunch) ──▶ exit
```

## Security

- **Verify the artifact, not the channel.** Check the `sha256` from
  `latest.json` and the OS code signature against a trusted key before
  applying. A compromised host/CDN must not be able to install a forged build.
- **Sign + notarize** the macOS bundle (see [RELEASING.md](./RELEASING.md));
  the current build is unsigned and for local use only.
- For private distribution, put an authenticated proxy in front of the release
  assets and keep any token server-side — never embedded in the app.

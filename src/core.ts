// The app core: Model, Msg, update - plain TypeScript in the app-core
// subset, compiled to native Zig at build time. On boot it fetches the
// latest published version from the repo's `latest.txt` and compares it
// to this build's version, surfacing an "update available" status. The
// current version shows bottom-right; the update status shows bottom-left.

import { Cmd, asciiBytes } from "@native-sdk/core";

// The current build version ("0.1.0") and the latest.txt URL are inlined
// into asciiBytes(...) below: the intrinsic folds only literal/template
// arguments (not const references). Keep the version literal in sync with
// `.version` in app.zon and `latest.txt` on the default branch (the
// release workflow bumps all three together).

export interface Model {
  // Model text is bytes in the app-core subset, not a JS string.
  readonly version: Uint8Array; // this build, shown bottom-right
  readonly latest: Uint8Array; // newest published version (from latest.txt)
  readonly updateReady: boolean; // latest differs from this build
  readonly statusMsg: Uint8Array; // human-readable check status
}

export type Msg =
  // the buffered fetch result: one number field (HTTP status) + one bytes
  // field (body), matched by type
  | { readonly kind: "checked"; readonly status: number; readonly body: Uint8Array }
  // the fetch error arm: one bytes field (machine-readable reason)
  | { readonly kind: "checkFailed"; readonly reason: Uint8Array };

// Both arms are dispatched by the host (the boot fetch), never from
// markup - this keeps `native check`'s unbound lint honest about that.
export const viewUnbound = ["checked", "checkFailed"] as const;

export function initialModel(): [Model, Cmd<Msg>] {
  const model: Model = {
    version: asciiBytes("0.0.1"),
    latest: asciiBytes("0.0.1"),
    updateReady: false,
    statusMsg: asciiBytes("checking for updates..."),
  };
  // Effects are inert data: the host performs this fetch after the model
  // commits and dispatches `checked` (or `checkFailed`) with the result.
  return [
    model,
    Cmd.fetch(
      { url: asciiBytes("https://raw.githubusercontent.com/quochuydev/native-desktop/main/latest.txt") },
      { key: "update-check", ok: "checked", err: "checkFailed" },
    ),
  ];
}

export function update(model: Model, msg: Msg): Model {
  switch (msg.kind) {
    case "checked": {
      if (msg.status !== 200) {
        return { ...model, updateReady: false, statusMsg: asciiBytes("update check unavailable") };
      }
      const latest = msg.body.trim();
      const same =
        latest.length === model.version.length && latest.startsWith(model.version);
      if (same) {
        return { ...model, latest: latest, updateReady: false, statusMsg: asciiBytes("up to date") };
      }
      return { ...model, latest: latest, updateReady: true, statusMsg: asciiBytes("update available") };
    }
    case "checkFailed":
      return { ...model, updateReady: false, statusMsg: asciiBytes("offline - update check failed") };
  }
}

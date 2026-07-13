// The app core: Model, Msg, update - plain TypeScript in the app-core
// subset, compiled to native Zig at build time. On boot (and then every
// 20s) it fetches the latest published version from the repo's
// `latest.txt` and compares it to this build's version, surfacing an
// "update available" status. The current version shows bottom-right; the
// update status shows bottom-left.

import { Cmd, Sub, asciiBytes } from "@native-sdk/core";

// The version literals below are bumped by release-please via the
// `x-release-please-version` annotations (see release-please-config.json).
// Keep them consistent with `.version` in app.zon.

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
  | { readonly kind: "checkFailed"; readonly reason: Uint8Array }
  // the recurring re-check tick: one number field (the fire time)
  | { readonly kind: "recheck"; readonly at: number };

// These arms are dispatched by the host (the boot fetch, the fetch result,
// and the re-check timer), never from markup - keep the unbound lint honest.
export const viewUnbound = ["checked", "checkFailed", "recheck"] as const;

export function initialModel(): [Model, Cmd<Msg>] {
  const model: Model = {
    version: asciiBytes("0.0.1"), // x-release-please-version
    latest: asciiBytes("0.0.1"), // x-release-please-version
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

export function update(model: Model, msg: Msg): Model | [Model, Cmd<Msg>] {
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
    case "recheck":
      // Re-issue the fetch on every tick; the same key replaces any
      // in-flight check. This is what makes the running app pick up a new
      // release without a restart.
      return [
        model,
        Cmd.fetch(
          { url: asciiBytes("https://raw.githubusercontent.com/quochuydev/native-desktop/main/latest.txt") },
          { key: "update-check", ok: "checked", err: "checkFailed" },
        ),
      ];
  }
}

// Re-check for updates every 20 seconds while the app runs.
export function subscriptions(model: Model): Sub<Msg> {
  return Sub.timer("recheck", 20000, "recheck");
}

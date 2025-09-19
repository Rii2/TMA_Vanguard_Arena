// File: tests/game-scripts.test.mjs | Purpose: Ensure bundled browser scripts stay syntactically valid. | Notes: Guards against silent UI failures when scripts refuse to parse.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scripts = [
  ["game.js", new URL("../game.js", import.meta.url)],
  ["game-data.js", new URL("../game-data.js", import.meta.url)]
].map(([label, url]) => [label, fileURLToPath(url)]);

test("browser scripts pass node --check", () => {
  for (const [label, absolutePath] of scripts) {
    const result = spawnSync(process.execPath, ["--check", absolutePath], { encoding: "utf8" });
    assert.equal(result.status, 0, `${label} failed syntax check:\n${result.stderr || result.stdout}`);
  }
});

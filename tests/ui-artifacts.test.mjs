// File: tests/ui-artifacts.test.mjs | Purpose: Prevent escaped newline artifacts from leaking into the UI copy. | Notes: Guards hero section and guide text for stray literals.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const projectRoot = new URL('..', import.meta.url);

function readText(relativePath) {
  return readFileSync(new URL(relativePath, projectRoot), 'utf8');
}

test('styles.css does not contain literal \n sequences', () => {
  const css = readText('styles.css');
  assert.equal(css.includes('\\n'), false, 'styles.css still includes literal \n sequences');
});

test("index.html does not leak the string 'n", () => {
  const html = readText('index.html');
  assert.equal(html.includes("'n"), false, "index.html still renders the text 'n");
});

test('index.html uses TMA icon header', () => {
  const html = readText('index.html');
  assert.equal(html.includes('src="TMA icon_01.png"'), true, 'index.html should reference TMA icon_01.png');
  assert.equal(html.includes('assets/top-hero.png'), false, 'Remove legacy assets/top-hero.png reference from header image');
});

test(''index.html exposes action summary'', () => {
  const html = readText(''index.html'');
  assert.ok(html.includes(''class="action-summary"''), ''index.html should render action-summary container'');
  assert.ok(html.includes(''id="player-action"''), ''player action slot missing'');
  assert.ok(html.includes(''id="enemy-action"''), ''enemy action slot missing'');
});

test(''battle command order is attack-guard-break-skill'', () => {
  const html = readText(''index.html'');
  const order = [''attack'', ''guard'', ''break'', ''skill''];
  let lastIndex = -1;
  for (const cmd of order) {
    const marker = `data-command="${cmd}"`;
    const idx = html.indexOf(marker);
    assert.ok(idx > -1, `command ${cmd} missing`);
    assert.ok(idx > lastIndex, `command ${cmd} rendered out of requested order`);
    lastIndex = idx;
  }
});

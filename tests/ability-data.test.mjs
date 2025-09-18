// File: tests/ability-data.test.mjs | Purpose: Validates mafia roster data and SP costs. | Notes: Ensures ability costs and stat totals stay within configured bounds.
import test from 'node:test';
import assert from 'node:assert/strict';

import { animals } from '../animals.mjs';
import { CONFIG } from '../config.mjs';

const HEALING_ABILITIES = new Set(['arborealBalance', 'bambooPulse', 'eucalyptusDream', 'playingDead', 'gluttonCharge', 'howlOfPack', 'cloudGuard']);

test('every ability declares a valid SP cost', () => {
  for (const beast of animals) {
    const { spCost } = beast.ability;
    assert.equal(typeof spCost, 'number', `${beast.slug} lacks numeric spCost`);
    assert.ok(spCost > 0, `${beast.slug} spCost must be positive`);
    assert.ok(spCost <= CONFIG.sp.max, `${beast.slug} spCost exceeds max SP`);
    if (HEALING_ABILITIES.has(beast.ability.type)) {
      assert.ok(spCost >= 4, `${beast.slug} healing ability should cost at least 4 SP`);
      if (beast.ability.type === 'eucalyptusDream') {
        assert.ok(spCost >= 5, `${beast.slug} eucalyptusDream should cost at least 5 SP`);
      }
    }
  }
});

test('display names include english animal names', () => {
  for (const beast of animals) {
    const displayLower = beast.displayName.toLowerCase();
    const englishLower = beast.englishName.toLowerCase();
    assert.ok(displayLower.includes(englishLower), `${beast.slug} name must include '${beast.englishName}'`);
  }
});

test('stat totals remain within balanced spread', () => {
  const totals = animals.map(({ stats }) => stats.hp + stats.attack + stats.defense + stats.speed);
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  assert.ok(max - min <= 80, `Stat spread too wide: ${min} - ${max}`);
});

// File: config.mjs | Purpose: Centralizes tunable gameplay constants for TMA Vanguard Arena. | Notes: Defines SP resource pacing and log limits for reuse.
export const CONFIG = {
  sp: {
    max: 10,
    gainPerTurn: 1,
    defaultSkillCost: 3,
    guardBonus: 2
  },
  combat: {
    logLimit: 60,
    baseMinDamage: 4,
    maxDamageReduction: 0.8,
    minDamageReduction: -0.4
  }
};

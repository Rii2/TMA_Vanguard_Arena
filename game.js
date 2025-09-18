// File: game.js | Purpose: Runs battle flow, UI rendering, and turn resolution for TMA Vanguard Arena. | Notes: Updated for SP resource system and mafia-themed roster.
const dataSource = window.TMA_DATA;
if (!dataSource) {
  throw new Error('TMA_DATA missing. Ensure game-data.js is loaded before game.js.');
}
const { animals, CONFIG } = dataSource;

const dom = {

  stageProgress: document.getElementById("stage-progress"),

  playerName: document.getElementById("player-name"),

  playerImage: document.getElementById("player-image"),

  playerImageFrame: document.getElementById("player-image-frame"),

  playerHp: document.getElementById("player-hp"),

  playerSpBar: document.getElementById("player-sp"),

  playerSpCount: document.getElementById("player-sp-count"),

  playerStats: document.getElementById("player-stats"),

  playerStatus: document.getElementById("player-status"),

  playerAbilityName: document.getElementById("player-ability-name"),

  playerAbilityDesc: document.getElementById("player-ability-desc"),

  enemyName: document.getElementById("enemy-name"),

  enemyImage: document.getElementById("enemy-image"),

  enemyImageFrame: document.getElementById("enemy-image-frame"),

  enemyHp: document.getElementById("enemy-hp"),

  enemySpBar: document.getElementById("enemy-sp"),

  enemySpCount: document.getElementById("enemy-sp-count"),

  enemyStats: document.getElementById("enemy-stats"),

  enemyStatus: document.getElementById("enemy-status"),

  enemyAbilityName: document.getElementById("enemy-ability-name"),

  enemyAbilityDesc: document.getElementById("enemy-ability-desc"),

  turnBanner: document.getElementById("turn-banner"),

  turnIndicator: document.getElementById("turn-indicator"),

  commandPanel: document.getElementById("command-panel"),

  log: document.getElementById("game-log"),

  nextStage: document.getElementById("next-stage"),

  nextStageMessage: document.getElementById("next-stage-message"),

  nextStageBtn: document.getElementById("next-stage-btn"),

  gameOver: document.getElementById("game-over"),

  gameOverTitle: document.getElementById("game-over-title"),

  gameOverMessage: document.getElementById("game-over-message"),

  restartBtn: document.getElementById("restart-btn"),

  startBtn: document.getElementById("start-btn"),

  abilityGrid: document.getElementById("ability-grid"),

  skillButton: document.querySelector('.command[data-command="skill"]')

};



const stages = [

  { label: "EASY", modifier: 0.9, aiEdge: 0.8 },

  { label: "NORMAL", modifier: 1, aiEdge: 1 },

  { label: "HARD", modifier: 1.15, aiEdge: 1.25 }

];



const COMMAND_LABELS = {

  attack: "攻撃",

  guard: "守り",

  skill: "特技",

  break: "崩し"

};



const gameState = {

  active: false,

  awaitingNext: false,

  stageIndex: 0,

  turn: 1,

  player: null,

  enemy: null,

  log: []

};



const abilityHandlers = {

  dashStrike({ combatant, effect }) {

    effect.attackMultiplier = 1.1;

    effect.attackBonus = 0.3;

    effect.speedMod += 6;

    effect.evasionChance = Math.max(effect.evasionChance, 0.35);

    effect.log.push(`${combatant.displayName}は影走りで一気に距離を詰めた！`);

  },

  arborealBalance({ combatant, effect }) {

    const heal = Math.round(combatant.maxHp * 0.16);

    effect.heal += heal;

    effect.damageReduction = Math.max(effect.damageReduction, 0.45);

    effect.applyStatuses.push({ target: "self", key: "regen", value: Math.max(4, Math.round(combatant.maxHp * 0.06)), turns: 2, stack: true });

    effect.log.push(`${combatant.displayName}はフォレストリズムで${heal}回復し、再生効果を得た。`);

  },

  ironBulwark({ combatant, effect }) {

    effect.guard = true;

    effect.damageReduction = Math.max(effect.damageReduction, 0.7);

    effect.attackMultiplier = 0.9;

    effect.counterMultiplier = Math.max(effect.counterMultiplier, 0.4);

    effect.applyStatuses.push({ target: "self", key: "thorns", value: 0.3, turns: 1 });

    effect.log.push(`${combatant.displayName}は鉄壁の構えで反撃態勢に入った。`);

  },

  bambooPulse({ combatant, effect }) {

    const heal = Math.round(combatant.maxHp * 0.18);

    effect.heal += heal;

    effect.attackMultiplier = 0.9;

    effect.applyStatuses.push({ target: "self", key: "attackUp", value: 0.15, turns: 2 });

    effect.log.push(`${combatant.displayName}は竹気功で${heal}回復し、闘志を高めた。`);

  },

  illusionDance({ combatant, effect, target }) {

    effect.attackMultiplier = 1.0;

    effect.evasionChance = Math.max(effect.evasionChance, 0.25);

    effect.speedMod += 4;

    effect.targetStatuses.push({ key: "attackDown", value: 0.15, turns: 2 });

    effect.log.push(`${combatant.displayName}は幻惑ステップで${target.displayName}の視界を揺さぶった。`);

  },

  razorClaw({ combatant, effect }) {

    effect.attackMultiplier = 1.55;

    effect.flatDamage = 6;

    effect.ignoreGuard = true;

    effect.selfDamage = 8;

    effect.log.push(`${combatant.displayName}は切り裂きの爪で装甲を切り裂く！`);

  },

  eucalyptusDream({ combatant, effect }) {

    const heal = Math.round(combatant.maxHp * 0.2);

    effect.heal += heal;

    effect.damageReduction = Math.max(effect.damageReduction, 0.4);

    effect.applyStatuses.push({ target: "self", key: "regen", value: Math.max(5, Math.round(combatant.maxHp * 0.07)), turns: 3, stack: true });

    effect.log.push(`${combatant.displayName}はユーカリの香りで${heal}回復し、持久戦に備える。`);

  },

  stubbornStand({ combatant, effect }) {

    effect.guard = true;

    effect.damageReduction = Math.max(effect.damageReduction, 0.7);

    effect.counterMultiplier = Math.max(effect.counterMultiplier, 0.25);

    effect.applyStatuses.push({ target: "self", key: "attackUp", value: 0.12, turns: 2 });

    effect.log.push(`${combatant.displayName}は踏ん張り、反撃の力を蓄えた。`);

  },

  bananaTrick({ combatant, effect, target }) {

    effect.attackMultiplier = 1.1;

    effect.speedMod += 3;

    effect.targetStatuses.push({ key: "defenseDown", value: 0.2, turns: 2 });

    effect.log.push(`${combatant.displayName}はトリックバナナで${target.displayName}の体勢を崩した！`);

  },

  earthshatter({ combatant, effect, target }) {

    effect.attackMultiplier = 1.45;

    effect.flatDamage = 8;

    effect.targetStatuses.push({ key: "speedDown", value: 4, turns: 2 });

    effect.applyStatuses.push({ target: "self", key: "speedDown", value: 2, turns: 1 });

    effect.log.push(`${combatant.displayName}の大地震動！${target.displayName}の動きが鈍る。`);

  },

  swarmRush({ combatant, effect }) {

    effect.attackMultiplier = 1.0;

    effect.ignoreGuard = true;

    effect.flatDamage = 4;

    effect.applyStatuses.push({ target: "self", key: "speedUp", value: 4, turns: 2, stack: true });

    effect.log.push(`${combatant.displayName}はチーズラッシュで守りをすり抜けた！`);

  },

  playingDead({ combatant, effect }) {

    const heal = Math.round(combatant.maxHp * 0.12);

    effect.guard = true;

    effect.damageReduction = Math.max(effect.damageReduction, 0.8);

    effect.heal += heal;

    effect.applyStatuses.push({ target: "self", key: "attackUp", value: 0.25, turns: 1 });

    effect.log.push(`${combatant.displayName}は死んだふりで${heal}回復し、反撃の機をうかがう。`);

  },

  gluttonCharge({ combatant, effect }) {

    const heal = Math.round(combatant.maxHp * 0.16);

    effect.heal += heal;

    effect.applyStatuses.push({ target: "self", key: "charge", value: 0.6, turns: 2 });

    effect.log.push(`${combatant.displayName}は満腹チャージで${heal}回復し、力を溜め込んだ。`);

  },

  rapidStep({ combatant, effect }) {

    effect.attackMultiplier = 1.05;

    effect.speedMod += 8;

    effect.evasionChance = Math.max(effect.evasionChance, 0.25);

    effect.log.push(`${combatant.displayName}はラピッドステップで一瞬にして懐へ潜る。`);

  },

  cleverSwipe({ combatant, effect, target }) {

    effect.attackMultiplier = 1.0;

    effect.lifeSteal = 0.5;

    effect.targetStatuses.push({ key: "attackDown", value: 0.1, turns: 2 });

    effect.log.push(`${combatant.displayName}は${target.displayName}の力を巧みに奪い取った！`);

  },

  crushingHorn({ combatant, effect }) {

    effect.attackMultiplier = 1.6;

    effect.flatDamage = 10;

    effect.applyStatuses.push({ target: "self", key: "speedDown", value: 3, turns: 2 });

    effect.log.push(`${combatant.displayName}は貫角突進で装甲を粉砕する！`);

  },

  howlOfPack({ combatant, effect }) {

    const heal = Math.round(combatant.maxHp * 0.12);

    effect.heal += heal;

    effect.applyStatuses.push({ target: "self", key: "attackUp", value: 0.16, turns: 2 });

    effect.applyStatuses.push({ target: "self", key: "defenseUp", value: 0.12, turns: 2 });

    effect.log.push(`${combatant.displayName}は雄叫びで士気を高め、${heal}回復した。`);

  },

  cloudGuard({ combatant, effect }) {

    effect.guard = true;

    effect.damageReduction = Math.max(effect.damageReduction, 0.7);

    effect.applyStatuses.push({ target: "self", key: "regen", value: 14, turns: 3, stack: true });

    effect.log.push(`${combatant.displayName}は雲綿バリアで身を包んだ。`);

  },

  huntersEye({ combatant, effect }) {

    effect.attackMultiplier = 1.1;

    effect.ignoreGuard = true;

    effect.speedMod += 5;

    effect.applyStatuses.push({ target: "self", key: "attackUp", value: 0.22, turns: 2 });

    effect.log.push(`${combatant.displayName}は急所を見据えた！防御を無視する構えだ。`);

  },

  counterLeap({ combatant, effect }) {

    effect.guard = true;

    effect.damageReduction = Math.max(effect.damageReduction, 0.6);

    effect.counterMultiplier = Math.max(effect.counterMultiplier, 0.5);

    effect.attackMultiplier = 0.8;

    effect.speedMod += 2;

    effect.log.push(`${combatant.displayName}はカウンタージャンプで受け流しの構え。`);

  },

  savageRoar({ combatant, effect, target }) {

    effect.attackMultiplier = 1.35;

    effect.flatDamage = 8;

    effect.lifeSteal = 0.2;

    effect.targetStatuses.push({ key: "attackDown", value: 0.2, turns: 2 });

    effect.log.push(`${combatant.displayName}は咆哮連撃で${target.displayName}を萎縮させた！`);

  }

};

// SP resource helpers keep per-combatant state consistent.
function getSkillCost(combatant) {
  if (!combatant?.animal?.ability) return CONFIG.sp.defaultSkillCost;
  return combatant.animal.ability.spCost ?? CONFIG.sp.defaultSkillCost;
}

function canUseSkill(combatant) {
  if (!combatant) return false;
  return combatant.sp >= getSkillCost(combatant);
}

function spendSp(combatant, amount) {
  if (!combatant || !amount) return;
  combatant.sp = Math.max(0, combatant.sp - amount);
}

function gainSp(combatant, amount = CONFIG.sp.gainPerTurn) {
  if (!combatant || !amount) return 0;
  const before = combatant.sp;
  combatant.sp = Math.min(combatant.maxSp, combatant.sp + amount);
  return combatant.sp - before;
}

function commitSkillCost(combatant, effect) {
  if (!effect?.spCost || !combatant) return;
  spendSp(combatant, effect.spCost);
  pushLog(`${combatant.displayName}はSPを${effect.spCost}消費した。`);
}

};

function populateAbilityGrid() {

  if (!dom.abilityGrid) return;

  dom.abilityGrid.innerHTML = "";

  animals.forEach((animal) => {

    const shortName = animal.displayName.length > 7 ? `${animal.displayName.slice(0, 7)}…` : animal.displayName;

    const card = document.createElement("article");

    card.className = "ability-card";

    card.innerHTML = `

      <div class="ability-card__header">

        <span class="ability-card__name">${shortName}</span>

      </div>

      <img src="${animal.image}" alt="${animal.displayName}" class="ability-card__image">

      <div class="ability-card__body">

        <div class="ability-card__meta">HP ${animal.stats.hp} / ATK ${animal.stats.attack} / DEF ${animal.stats.defense} / SPD ${animal.stats.speed}</div>

        <div class="ability-card__ability">${animal.ability.name}<span class="ability-card__cost">SP${animal.ability.spCost}</span></div>

        <p class="ability-card__desc">${animal.ability.description}</p>

        <p class="ability-card__desc">${animal.flavor}</p>

      </div>

    `;

    dom.abilityGrid.appendChild(card);

  });

}



function resetCombatantPanels() {

  dom.playerName.textContent = "---";

  dom.playerImage.removeAttribute("src");

  dom.playerImageFrame.classList.remove("has-image");

  dom.playerStats.innerHTML = "";

  dom.playerStatus.innerHTML = "";

  dom.playerHp.style.width = "0%";

  renderResourceBar(dom.playerSpBar, dom.playerSpCount, 0, CONFIG.sp.max);

  dom.playerAbilityName.textContent = "特技: ---";

  dom.playerAbilityDesc.textContent = "特技は戦闘開始後に表示されます。";

  updateSkillButtonCopy(null);



  dom.enemyName.textContent = "---";

  dom.enemyImage.removeAttribute("src");

  dom.enemyImageFrame.classList.remove("has-image");

  dom.enemyStats.innerHTML = "";

  dom.enemyStatus.innerHTML = "";

  dom.enemyHp.style.width = "0%";

  renderResourceBar(dom.enemySpBar, dom.enemySpCount, 0, CONFIG.sp.max);

  dom.enemyAbilityName.textContent = "特技: ---";

  dom.enemyAbilityDesc.textContent = "特技は戦闘開始後に表示されます。";



}



function resetGameState() {

  gameState.active = false;

  gameState.awaitingNext = false;

  gameState.stageIndex = 0;

  gameState.turn = 1;

  gameState.player = null;

  gameState.enemy = null;

  gameState.log = [];

  dom.gameOver.hidden = true;

  dom.nextStage.hidden = true;

  dom.gameOverMessage.textContent = "";

  dom.gameOverTitle.textContent = "RESULT";

  resetCombatantPanels();

  renderLog();

  renderProgress();

  updateSkillButtonState();

}



function startGame() {

  resetGameState();

  const playerAnimal = getRandomAnimal();

  gameState.player = createCombatant(playerAnimal, 1);

  gameState.active = true;

  dom.nextStage.hidden = true;

  dom.gameOver.hidden = true;

  pushLog(`あなたの相棒は【${gameState.player.displayName}】だ！`);

  setupStage(0);

  setCommandsDisabled(false);

}



function setupStage(index) {

  gameState.stageIndex = index;

  gameState.turn = 1;

  gameState.awaitingNext = false;

  const stage = stages[index];

  const enemyAnimal = getRandomAnimal(gameState.player.animal.slug);

  gameState.enemy = createCombatant(enemyAnimal, stage.modifier);

  pushLog(`第${index + 1}戦（${stage.label}）開始！相手は【${gameState.enemy.displayName}】。`);

  dom.turnBanner.querySelector(".turn-banner__label").textContent = `第${index + 1}戦: ${stage.label}`;

  renderAll();

}



function getRandomAnimal(excludeSlug) {

  const pool = excludeSlug ? animals.filter((a) => a.slug !== excludeSlug) : animals;

  return pool[Math.floor(Math.random() * pool.length)];

}



function createCombatant(animal, modifier = 1) {

  const hp = Math.round(animal.stats.hp * modifier);

  const attack = Math.round(animal.stats.attack * modifier);

  const defense = Math.round(animal.stats.defense * modifier);

  const speed = Math.round(animal.stats.speed * (modifier > 1 ? 1 + (modifier - 1) * 0.6 : 1));

  return {

    animal,

    displayName: animal.displayName,

    slug: animal.slug,

    image: animal.image,

    maxHp: hp,

    hp,

    stats: {

      attack,

      defense,

      speed

    },

    baseStats: {

      attack,

      defense,

      speed

    },

    status: {},

    sp: 0,

    maxSp: CONFIG.sp.max

  };

}



function setCommandsDisabled(disabled) {

  const buttons = dom.commandPanel.querySelectorAll(".command");

  buttons.forEach((btn) => {

    btn.disabled = disabled;

    if (!disabled) {

      btn.classList.remove("is-selected");

    }

  });

  dom.commandPanel.classList.toggle("is-locked", disabled);

  updateSkillButtonState();

}



function handleCommand(event) {

  if (!gameState.active || gameState.awaitingNext) return;

  const command = event.currentTarget.dataset.command;

  if (command === "skill" && !canUseSkill(gameState.player)) {

    pushLog("SPが足りません。");

    updateSkillButtonState();

    return;

  }

  executeTurn(command);

}



function highlightSelectedCommand(command) {

  const buttons = dom.commandPanel.querySelectorAll(".command");

  buttons.forEach((btn) => {

    btn.classList.toggle("is-selected", btn.dataset.command === command);

  });

}



function executeTurn(playerCommand) {

  setCommandsDisabled(true);

  highlightSelectedCommand(playerCommand);

  const enemyCommand = chooseEnemyCommand(playerCommand);

  pushLog(`>> あなた: ${COMMAND_LABELS[playerCommand]} / 敵: ${COMMAND_LABELS[enemyCommand]}`);



  const playerEffect = prepareEffect(gameState.player, playerCommand, gameState.enemy);

  const enemyEffect = prepareEffect(gameState.enemy, enemyCommand, gameState.player);

  commitSkillCost(gameState.player, playerEffect);

  commitSkillCost(gameState.enemy, enemyEffect);



  const playerSpeed = getEffectiveSpeed(gameState.player) + playerEffect.speedMod;

  const enemySpeed = getEffectiveSpeed(gameState.enemy) + enemyEffect.speedMod;

  const order = playerSpeed === enemySpeed

    ? (Math.random() < 0.5 ? [

        { actor: gameState.player, target: gameState.enemy, effect: playerEffect, targetEffect: enemyEffect },

        { actor: gameState.enemy, target: gameState.player, effect: enemyEffect, targetEffect: playerEffect }

      ] : [

        { actor: gameState.enemy, target: gameState.player, effect: enemyEffect, targetEffect: playerEffect },

        { actor: gameState.player, target: gameState.enemy, effect: playerEffect, targetEffect: enemyEffect }

      ])

    : (playerSpeed > enemySpeed ? [

        { actor: gameState.player, target: gameState.enemy, effect: playerEffect, targetEffect: enemyEffect },

        { actor: gameState.enemy, target: gameState.player, effect: enemyEffect, targetEffect: playerEffect }

      ] : [

        { actor: gameState.enemy, target: gameState.player, effect: enemyEffect, targetEffect: playerEffect },

        { actor: gameState.player, target: gameState.enemy, effect: playerEffect, targetEffect: enemyEffect }

      ]);



  let battleEnded = false;

  for (const action of order) {

    if (gameState.player.hp <= 0 || gameState.enemy.hp <= 0) {

      battleEnded = true;

      break;

    }

    const ended = performAction(action);

    if (ended) {

      battleEnded = true;

      break;

    }

  }



  if (!battleEnded) {

    endOfTurn();

  }



  renderAll();



  if (gameState.player.hp <= 0) {

    handleDefeat();

  } else if (gameState.enemy.hp <= 0) {

    handleStageClear();

  } else {

    highlightSelectedCommand(null);

    setCommandsDisabled(false);

  }

}

function chooseEnemyCommand(playerCommand) {

  const stage = stages[gameState.stageIndex];

  const enemy = gameState.enemy;

  const hpRate = enemy.hp / enemy.maxHp;

  const playerHpRate = gameState.player.hp / gameState.player.maxHp;

  const canSkill = canUseSkill(enemy);

  const weights = [

    { cmd: "attack", weight: 1.1 },

    { cmd: "guard", weight: hpRate < 0.45 ? 1.4 : 0.8 },

    { cmd: "skill", weight: canSkill ? 1.0 + (1 - hpRate) + (stage.aiEdge - 1) * 0.5 : 0 },

    { cmd: "break", weight: playerCommand === "guard" ? 1.4 : 0.7 }

  ];

  if (canSkill) {

    const skillWeight = weights.find((w) => w.cmd === "skill");

    skillWeight.weight += (enemy.sp / enemy.maxSp) * 0.6;

  }



  if (getStatusValue(enemy, "charge") > 0) {

    weights.find((w) => w.cmd === "attack").weight += 1.2;

    if (canSkill) {

      weights.find((w) => w.cmd === "skill").weight *= 0.6;

    }

  }



  if (playerHpRate < 0.35) {

    weights.find((w) => w.cmd === "attack").weight += 0.8;

  }



  if (canSkill && hpRate < 0.3) {

    weights.find((w) => w.cmd === "skill").weight += 0.8;

  }



  if (stage.key === "hard") {

    weights.forEach((w) => {

      if (w.cmd === "break") {

        w.weight *= 1.2;

      } else if (w.cmd === "skill" && canSkill) {

        w.weight *= 1.2;

      }

    });

  }



  const total = weights.reduce((sum, item) => sum + item.weight, 0);

  let random = Math.random() * total;

  for (const item of weights) {

    if (random < item.weight) {

      return item.cmd;

    }

    random -= item.weight;

  }

  return "attack";

}



function prepareEffect(combatant, command, target) {

  const effect = {

    command,

    spCost: command === "skill" ? getSkillCost(combatant) : 0,

    attackMultiplier: command === "attack" ? 1 : command === "skill" ? 0.7 : command === "break" ? 0.95 : 0,

    attackBonus: 0,

    flatDamage: 0,

    heal: 0,

    guard: command === "guard",

    damageReduction: command === "guard" ? 0.65 : 0,

    counterMultiplier: command === "guard" ? 0.35 : 0,

    ignoreGuard: command === "break",

    lifeSteal: 0,

    evasionChance: 0,

    speedMod: command === "break" ? -2 : 0,

    applyStatuses: [],

    targetStatuses: [],

    log: [],

    selfDamage: 0

  };



  if (command === "skill") {

    const handler = abilityHandlers[combatant.animal.ability.type];

    if (handler) {

      handler({ combatant, target, effect });

    }

  } else if (command === "attack") {

    effect.log.push(`${combatant.displayName}の攻撃！`);

  } else if (command === "guard") {

    effect.log.push(`${combatant.displayName}は身を固めた。`);

  } else if (command === "break") {

    effect.log.push(`${combatant.displayName}は防御を崩す構えで突っ込む！`);

  }



  return effect;

}



function performAction({ actor, target, effect, targetEffect }) {

  effect.log.forEach((msg) => pushLog(msg));



  if (effect.heal > 0) {

    applyHeal(actor, effect.heal, `${actor.displayName}は${effect.heal}回復した。`);

  }



  if (effect.attackMultiplier > 0) {

    if (target.hp <= 0) {

      return true;

    }

    let evasion = targetEffect.evasionChance || 0;

    evasion += getStatusValue(target, "evasion");

    evasion = Math.min(0.75, evasion);

    if (Math.random() < evasion) {

      pushLog(`${target.displayName}は巧みにかわした！`);

    } else {

      const damage = calculateDamage(actor, target, effect, targetEffect);

      if (damage <= 0) {

        pushLog(`${target.displayName}へのダメージは通らなかった。`);

      } else {

        applyDamage(target, damage, `${target.displayName}に${damage}のダメージ！`);

        if (effect.lifeSteal > 0) {

          const leech = Math.max(1, Math.round(damage * effect.lifeSteal));

          applyHeal(actor, leech, `${actor.displayName}は吸収で${leech}回復した。`);

        }

        const thorns = getStatusValue(target, "thorns");

        if (thorns > 0) {

          const thornDamage = Math.max(3, Math.round(damage * thorns));

          applyDamage(actor, thornDamage, `${target.displayName}の反射で${actor.displayName}が${thornDamage}の反動！`, true);

        }

        if (targetEffect.guard && targetEffect.counterMultiplier > 0 && effect.attackMultiplier > 0) {

          const counter = Math.max(3, Math.round(getEffectiveAttack(target) * targetEffect.counterMultiplier));

          applyDamage(actor, counter, `${target.displayName}の反撃！${actor.displayName}に${counter}のダメージ。`);

        }

      }

      if (effect.selfDamage > 0) {

        applyDamage(actor, effect.selfDamage, `${actor.displayName}は反動で${effect.selfDamage}のダメージ。`, true);

      }

    }

  }



  effect.applyStatuses.forEach((status) => {

    const receiver = status.target === "target" ? target : actor;

    applyStatus(receiver, status.key, status.value, status.turns, status.stack);

  });

  effect.targetStatuses.forEach((status) => {

    applyStatus(target, status.key, status.value, status.turns, status.stack);

  });



  if (actor.hp <= 0) {

    pushLog(`${actor.displayName}は力尽きた…`);

    return true;

  }

  if (target.hp <= 0) {

    pushLog(`${target.displayName}を倒した！`);

    return true;

  }



  return false;

}



function applyStatus(combatant, key, value, turns, stack = false) {

  if (!value || !turns) return;

  const current = combatant.status[key];

  if (current) {

    if (stack) {

      current.value += value;

      current.turns = Math.max(current.turns, turns);

    } else {

      current.value = Math.max(current.value, value);

      current.turns = Math.max(current.turns, turns);

    }

  } else {

    combatant.status[key] = { value, turns };

  }

}



function getStatusValue(combatant, key) {

  const status = combatant.status[key];

  return status ? status.value : 0;

}



function consumeStatus(combatant, key) {

  const status = combatant.status[key];

  if (status) {

    delete combatant.status[key];

  }

}



function getEffectiveAttack(combatant) {

  let value = combatant.stats.attack;

  value *= 1 + getStatusValue(combatant, "attackUp") - getStatusValue(combatant, "attackDown");

  return value;

}



function getEffectiveDefense(combatant) {

  let value = combatant.stats.defense;

  value *= 1 + getStatusValue(combatant, "defenseUp") - getStatusValue(combatant, "defenseDown");

  return value;

}



function getEffectiveSpeed(combatant) {

  let value = combatant.stats.speed;

  value += getStatusValue(combatant, "speedUp") - getStatusValue(combatant, "speedDown");

  return value;

}



function calculateDamage(attacker, defender, effect, defenderEffect = {}) {

  let multiplier = effect.attackMultiplier + (effect.attackBonus || 0);



  const charge = getStatusValue(attacker, "charge");

  if (charge > 0) {

    multiplier += charge;

    pushLog(`${attacker.displayName}のチャージが解放された！`);

    consumeStatus(attacker, "charge");

  }



  const baseAttack = getEffectiveAttack(attacker);

  const randomFactor = 0.92 + Math.random() * 0.16;

  let raw = baseAttack * multiplier * randomFactor + (effect.flatDamage || 0);

  const defense = getEffectiveDefense(defender);

  raw -= defense * 0.45;

  let damage = Math.max(CONFIG.combat.baseMinDamage, Math.round(raw));

  let reduction = 0;

  reduction += defenderEffect.damageReduction || 0;

  reduction += getStatusValue(defender, "defenseUp");

  reduction -= getStatusValue(defender, "defenseDown");

  reduction = Math.min(CONFIG.combat.maxDamageReduction, Math.max(reduction, CONFIG.combat.minDamageReduction));

  if (defenderEffect.guard && !effect.ignoreGuard) {

    reduction = Math.max(reduction, defenderEffect.damageReduction || 0.65);

  }

  if (effect.ignoreGuard) {

    reduction = Math.max(0, reduction - 0.2);

  }

  damage = Math.round(damage * (1 - reduction));

  return Math.max(0, damage);

}



function applyDamage(combatant, amount, message, silent = false) {

  combatant.hp = Math.max(0, combatant.hp - amount);

  if (!silent) {

    pushLog(message);

  }

}



function applyHeal(combatant, amount, message) {

  const before = combatant.hp;

  combatant.hp = Math.min(combatant.maxHp, combatant.hp + amount);

  const actual = combatant.hp - before;

  if (actual > 0) {

    pushLog(message.replace(String(amount), String(actual)));

  }

}



function endOfTurn() {

  [gameState.player, gameState.enemy].forEach((combatant) => {

    const regen = getStatusValue(combatant, "regen");

    if (regen > 0) {

      applyHeal(combatant, regen, `${combatant.displayName}は再生効果で${regen}回復した。`);

    }

    tickStatuses(combatant);

    gainSp(combatant);

  });

  gameState.turn += 1;

  dom.turnIndicator.textContent = `ターン ${gameState.turn}`;

  updateSkillButtonState();

  pulseTurnBanner();

}



function pulseTurnBanner() {

  dom.turnBanner.classList.remove("is-pulse");

  void dom.turnBanner.offsetWidth;

  dom.turnBanner.classList.add("is-pulse");

}



function tickStatuses(combatant) {

  for (const key of Object.keys(combatant.status)) {

    const status = combatant.status[key];

    status.turns -= 1;

    if (status.turns <= 0) {

      delete combatant.status[key];

    }

  }

}



function handleStageClear() {

  setCommandsDisabled(true);

  gameState.awaitingNext = true;

  const stage = stages[gameState.stageIndex];

  markStageState(gameState.stageIndex, "complete");

  if (gameState.stageIndex < stages.length - 1) {

    dom.nextStageMessage.textContent = `${stage.label} クリア！`;

    dom.nextStage.hidden = false;

  } else {

    showGameOver(true);

  }

}



function handleDefeat() {

  setCommandsDisabled(true);

  gameState.active = false;

  showGameOver(false);

}



function showGameOver(isVictory) {

  dom.nextStage.hidden = true;

  dom.gameOver.hidden = false;

  if (isVictory) {

    dom.gameOverTitle.textContent = "FULL CLEAR";

    dom.gameOverMessage.textContent = "三連戦を制覇！あなたの戦略が栄光をつかんだ。";

  } else {

    dom.gameOverTitle.textContent = "DEFEAT";

    dom.gameOverMessage.textContent = "相棒は倒れてしまった…。戦術を練り直して再挑戦しよう。";

  }

}



function proceedNextStage() {

  dom.nextStage.hidden = true;

  const nextIndex = gameState.stageIndex + 1;

  if (nextIndex < stages.length) {

    setupStage(nextIndex);

    setCommandsDisabled(false);

  }

}



function markStageState(index, state) {

  const items = dom.stageProgress.querySelectorAll(".stage-progress__item");

  items.forEach((item, idx) => {

    item.classList.toggle("is-active", idx === index && state === "active");

    item.classList.toggle("is-complete", idx < index || (idx === index && state === "complete"));

  });

}



function renderAll() {

  renderCombatants();

  renderProgress();

  renderLog();

  dom.turnIndicator.textContent = `ターン ${gameState.turn}`;
  updateSkillButtonState();

}



function renderCombatants() {

  const player = gameState.player;

  const enemy = gameState.enemy;

  if (!player || !enemy) {

    resetCombatantPanels();

    return;

  }



  dom.playerName.textContent = player.displayName;

  dom.playerImage.src = player.image;

  dom.playerImage.alt = `${player.displayName}のカード`;

  dom.playerImageFrame.classList.add("has-image");

  dom.playerHp.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;

  renderResourceBar(dom.playerSpBar, dom.playerSpCount, player.sp, player.maxSp);

  dom.playerStats.innerHTML = createStatList(player);

  dom.playerStatus.innerHTML = createStatusBadges(player);

  dom.playerAbilityName.textContent = `特技: ${player.animal.ability.name} (SP${getSkillCost(player)})`;

  dom.playerAbilityDesc.textContent = player.animal.ability.description;

  updateSkillButtonCopy(player);



  dom.enemyName.textContent = enemy.displayName;

  dom.enemyImage.src = enemy.image;

  dom.enemyImage.alt = `${enemy.displayName}のカード`;

  dom.enemyImageFrame.classList.add("has-image");

  dom.enemyHp.style.width = `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`;

  renderResourceBar(dom.enemySpBar, dom.enemySpCount, enemy.sp, enemy.maxSp);

  dom.enemyStats.innerHTML = createStatList(enemy);

  dom.enemyStatus.innerHTML = createStatusBadges(enemy);

  dom.enemyAbilityName.textContent = `���Z: ${enemy.animal.ability.name} (SP${getSkillCost(enemy)})`;

  dom.enemyAbilityDesc.textContent = enemy.animal.ability.description;

}



function createStatList(combatant) {

  const attack = Math.round(getEffectiveAttack(combatant));

  const defense = Math.round(getEffectiveDefense(combatant));

  const speed = Math.round(getEffectiveSpeed(combatant));

  return `

    <dt>HP</dt><dd>${combatant.hp} / ${combatant.maxHp}</dd>

    <dt>ATK</dt><dd>${attack}</dd>

    <dt>DEF</dt><dd>${defense}</dd>

    <dt>SPD</dt><dd>${speed}</dd>

  `;

}

function renderResourceBar(barElement, countElement, value, max) {
  if (!barElement || !countElement || !Number.isFinite(max) || max <= 0) return;
  const clampedValue = Math.max(0, Math.min(max, value));
  const ratio = Math.max(0, Math.min(1, clampedValue / max));
  barElement.style.width = `${Math.round(ratio * 100)}%`;
  countElement.textContent = `${Math.round(clampedValue)} / ${max}`;
}

function updateSkillButtonCopy(combatant) {
  if (!dom.skillButton) return;
  const label = dom.skillButton.querySelector('.command__desc');
  if (!label) return;
  const cost = combatant ? getSkillCost(combatant) : CONFIG.sp.defaultSkillCost;
  label.textContent = `SP${cost}を消費して特技を放つ。`;
}

function updateSkillButtonState() {
  if (!dom.skillButton) return;
  const locked = dom.commandPanel ? dom.commandPanel.classList.contains('is-locked') : false;
  const active = !!(gameState.active && gameState.player);
  const cost = active ? getSkillCost(gameState.player) : CONFIG.sp.defaultSkillCost;
  dom.skillButton.dataset.spCost = String(cost);
  if (!active) {
    dom.skillButton.disabled = true;
    dom.skillButton.classList.add('is-unavailable');
    return;
  }
  const hasSp = canUseSkill(gameState.player);
  if (!locked) {
    dom.skillButton.disabled = !hasSp;
  }
  dom.skillButton.classList.toggle('is-unavailable', !hasSp);
}

function statusLabel(key) {

  const labels = {

    attackUp: "攻+",

    attackDown: "攻-",

    defenseUp: "守+",

    defenseDown: "守-",

    speedUp: "速+",

    speedDown: "速-",

    regen: "再生",

    charge: "チャージ",

    thorns: "反射",

    evasion: "回避"

  };

  return labels[key] || key;

}



function createStatusBadges(combatant) {

  const entries = Object.entries(combatant.status);

  if (!entries.length) return "";

  return entries.map(([key, value]) => `<li>${statusLabel(key)} x${value.turns}</li>`).join("");

}



function renderProgress() {

  const items = dom.stageProgress.querySelectorAll(".stage-progress__item");

  items.forEach((item, index) => {

    item.classList.toggle("is-active", index === gameState.stageIndex && gameState.active && !gameState.awaitingNext);

    item.classList.toggle("is-complete", index < gameState.stageIndex || (index === gameState.stageIndex && gameState.awaitingNext));

  });

}



function renderLog() {

  dom.log.innerHTML = gameState.log.map((line) => `<p>${line}</p>`).join("");

  dom.log.scrollTop = dom.log.scrollHeight;

}



function pushLog(message) {

  if (!message) return;

  gameState.log.push(message);

  if (gameState.log.length > CONFIG.combat.logLimit) {

    gameState.log.shift();

  }

}



populateAbilityGrid();

renderInitial();



dom.commandPanel?.querySelectorAll(".command").forEach((button) => {

  button.addEventListener("click", handleCommand);

});



dom.startBtn?.addEventListener("click", () => {

  startGame();

});



dom.nextStageBtn?.addEventListener("click", () => {

  proceedNextStage();

});



dom.restartBtn?.addEventListener("click", () => {

  startGame();

});

function renderInitial() {

  setCommandsDisabled(true);

  resetCombatantPanels();

  renderProgress();

  renderLog();

  updateSkillButtonState();

}
















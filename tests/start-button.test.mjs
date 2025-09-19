// File: tests/start-button.test.mjs | Purpose: Guard the game start flow wiring. | Notes: Uses VM with DOM stubs to ensure init attaches handler and populates UI.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

class ElementStub {
  constructor(id) {
    this.id = id;
    this.textContent = "---";
    this.innerHTML = "";
    this.dataset = {};
    this.style = {};
    this.hidden = false;
    this.children = [];
    this.listeners = {};
    const classes = new Set();
    this.classList = {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      toggle: (name, force) => {
        if (force === undefined) {
          if (classes.has(name)) {
            classes.delete(name);
            return false;
          }
          classes.add(name);
          return true;
        }
        if (force) {
          classes.add(name);
        } else {
          classes.delete(name);
        }
        return !!force;
      },
      contains: (name) => classes.has(name)
    };
  }

  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }

  dispatch(type, event = {}) {
    if (this.listeners[type]) {
      this.listeners[type]({ currentTarget: this, ...event });
    }
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
  }

  appendChild(node) {
    this.children.push(node);
    return node;
  }

  removeAttribute(name) {
    delete this[name];
  }

  setAttribute(name, value) {
    this[name] = value;
  }
}

function buildDomEnvironment() {
  const elements = new Map();

  const register = (id, element) => {
    elements.set(id, element);
    return element;
  };

  const make = (id) => register(id, new ElementStub(id));

  const stageItems = [0, 1, 2].map((index) => new ElementStub(`stage-${index}`));
  const commandPanel = new ElementStub("command-panel");
  const commandButtons = ["attack", "guard", "skill", "break"].map((command) => {
    const btn = new ElementStub(`command-${command}`);
    btn.dataset.command = command;
    return btn;
  });

  const skillLabel = new ElementStub("skill-desc");
  commandButtons[2].querySelector = (selector) => (selector === ".command__desc" ? skillLabel : null);

  commandPanel.querySelectorAll = () => commandButtons;

  const stageProgress = new ElementStub("stage-progress");
  stageProgress.querySelectorAll = () => stageItems;

  const abilityGrid = new ElementStub("ability-grid");
  abilityGrid.appendChild = (child) => {
    abilityGrid.children.push(child);
    return child;
  };

  register("stage-progress", stageProgress);
  register("ability-grid", abilityGrid);
  register("command-panel", commandPanel);
  register("start-btn", new ElementStub("start-btn"));
  register("restart-btn", new ElementStub("restart-btn"));
  register("next-stage-btn", new ElementStub("next-stage-btn"));
  register("next-stage", new ElementStub("next-stage"));
  register("game-over", new ElementStub("game-over"));
  register("game-over-title", new ElementStub("game-over-title"));
  register("game-over-message", new ElementStub("game-over-message"));

  const ids = [
    "player-name",
    "enemy-name",
    "player-image",
    "enemy-image",
    "player-image-frame",
    "enemy-image-frame",
    "player-hp",
    "enemy-hp",
    "player-sp",
    "enemy-sp",
    "player-sp-count",
    "enemy-sp-count",
    "player-stats",
    "enemy-stats",
    "player-status",
    "enemy-status",
    "player-ability-name",
    "enemy-ability-name",
    "player-ability-desc",
    "enemy-ability-desc",
    "turn-banner",
    "turn-indicator",
    "game-log"
  ];

  ids.forEach((id) => {
    const el = make(id);
    if (id === "player-image" || id === "enemy-image") {
      el.removeAttribute = () => {
        el.src = undefined;
      };
    }
    if (id === "turn-banner") {
      el.classList.add = () => {};
      el.classList.remove = () => {};
    }
  });

  const skillButton = commandButtons[2];
  register("skill-button-internal", skillButton);

  const documentStub = {
    readyState: "complete",
    createElement(tag) {
      const node = new ElementStub(tag);
      node.className = "";
      return node;
    },
    getElementById(id) {
      if (!elements.has(id)) {
        make(id);
      }
      return elements.get(id);
    },
    querySelector(selector) {
      if (selector === ".command[data-command=\"skill\"]") {
        return skillButton;
      }
      return null;
    },
    addEventListener() {
      // no-op: readyState is complete so init runs immediately
    }
  };

  return { document: documentStub, elements, commandButtons };
}

function buildWindowData() {
  return {
    TMA_DATA: {
      animals: [
        {
          slug: "fox",
          displayName: "フォックス",
          englishName: "Fox",
          role: "trickster",
          image: "soldier/fox.png",
          stats: { hp: 100, attack: 20, defense: 12, speed: 18 },
          ability: {
            name: "幻惑ステップ",
            type: "illusionDance",
            spCost: 3,
            description: "敵の攻撃を鈍らせる幻影で翻弄する。"
          },
          flavor: "都会の影を疾走する狡猾な情報屋。"
        },
        {
          slug: "bear",
          displayName: "グリズリー",
          englishName: "Bear",
          role: "bruiser",
          image: "soldier/bear.png",
          stats: { hp: 140, attack: 24, defense: 20, speed: 10 },
          ability: {
            name: "豪腕クラッシュ",
            type: "razorClaw",
            spCost: 4,
            description: "防御を無視した一撃で敵を怯ませる。"
          },
          flavor: "沈黙の執行者。ファミリー随一の怪力を誇る。"
        }
      ],
      CONFIG: {
        sp: { max: 10, gainPerTurn: 1, defaultSkillCost: 3 },
        combat: { logLimit: 50, baseMinDamage: 4, maxDamageReduction: 0.8, minDamageReduction: -0.4 }
      }
    }
  };
}

function createContextOverrides(documentStub, windowStub) {
  const mathClone = Object.create(Math);
  mathClone.random = () => 0.01;

  return {
    window: windowStub,
    document: documentStub,
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Math: mathClone,
    performance,
    globalThis: null
  };
}

const gameJsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../game.js");
const gameScript = readFileSync(gameJsPath, "utf8");

function evaluateGameScript(context) {
  context.globalThis = context;
  vm.runInNewContext(gameScript, context, { filename: "game.js" });
}

test("start button initializes combatants", () => {
  const { document, elements } = buildDomEnvironment();
  const windowStub = buildWindowData();
  const context = createContextOverrides(document, windowStub);

  evaluateGameScript(context);

  const startBtn = elements.get("start-btn");
  assert.ok(startBtn, "start button stub exists");
  assert.ok(startBtn.listeners.click, "start button listener registered");

  startBtn.listeners.click({ currentTarget: startBtn });

  const playerName = elements.get("player-name").textContent;
  assert.notEqual(playerName, "---", "player name should update after start");

  assert.equal(startBtn.disabled, true, "start button is disabled while battle is active");

  const logHtml = elements.get("game-log").innerHTML;
  assert.ok(logHtml.includes("<p>"), "log renders HTML entries after start");
});

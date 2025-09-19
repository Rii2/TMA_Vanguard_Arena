// File: game-data.js | Purpose: Provides browser globals for animals and config without ES modules. | Notes: Auto-generated via scripts/build-game-data.mjs.
window.TMA_DATA = {
  "animals": [
    {
      "slug": "bear",
      "displayName": "クマゴロウ",
      "englishName": "Bear",
      "role": "重量タンク",
      "image": "soldier/bear.png",
      "stats": {
        "hp": 145,
        "attack": 24,
        "defense": 22,
        "speed": 14
      },
      "ability": {
        "name": "荒爪乱舞",
        "type": "savageRoar",
        "spCost": 4,
        "description": "怒涛の爪で防御を裂き、少量のHPを奪う。"
      },
      "flavor": "山岳で鍛えたグリズリー。荒々しい連撃で前に出る。"
    },
    {
      "slug": "bull",
      "displayName": "ギュウタ",
      "englishName": "Bull",
      "role": "防壁粉砕",
      "image": "soldier/bull.png",
      "stats": {
        "hp": 132,
        "attack": 27,
        "defense": 19,
        "speed": 17
      },
      "ability": {
        "name": "貫角突進",
        "type": "crushingHorn",
        "spCost": 4,
        "description": "角を低く構え、ガードを貫く一撃を叩き込む。"
      },
      "flavor": "蓄えた力を一気に解き放ち、壁ごと敵陣を押し崩す。"
    },
    {
      "slug": "cat",
      "displayName": "ネコミヤ",
      "englishName": "Cat",
      "role": "高速アタッカー",
      "image": "soldier/cat.png",
      "stats": {
        "hp": 106,
        "attack": 23,
        "defense": 16,
        "speed": 26
      },
      "ability": {
        "name": "影走り",
        "type": "dashStrike",
        "spCost": 3,
        "description": "回避力と速度を高め、鋭い連撃を放つ。"
      },
      "flavor": "街路を駆け抜ける斥候。初手の速さで主導権を握る。"
    },
    {
      "slug": "donkey",
      "displayName": "ロバキチ",
      "englishName": "Donkey",
      "role": "粘りの守護",
      "image": "soldier/donkey.png",
      "stats": {
        "hp": 126,
        "attack": 20,
        "defense": 21,
        "speed": 15
      },
      "ability": {
        "name": "頑固な踏ん張り",
        "type": "stubbornStand",
        "spCost": 3,
        "description": "このターンの被ダメージを抑え、次の攻撃力を高める。"
      },
      "flavor": "決して諦めず、じわじわと勝利を引き寄せる。"
    },
    {
      "slug": "elephant",
      "displayName": "ゾウベエ",
      "englishName": "Elephant",
      "role": "重装突撃",
      "image": "soldier/elephant.png",
      "stats": {
        "hp": 158,
        "attack": 23,
        "defense": 26,
        "speed": 11
      },
      "ability": {
        "name": "大地震動",
        "type": "earthshatter",
        "spCost": 4,
        "description": "地面を揺らして大ダメージと鈍足を与える。"
      },
      "flavor": "動き出したら止まらない重戦車。"
    },
    {
      "slug": "fox",
      "displayName": "キツネロウ",
      "englishName": "Fox",
      "role": "攪乱アタッカー",
      "image": "soldier/fox.png",
      "stats": {
        "hp": 112,
        "attack": 24,
        "defense": 17,
        "speed": 24
      },
      "ability": {
        "name": "幻惑ステップ",
        "type": "illusionDance",
        "spCost": 3,
        "description": "幻惑の動きで敵の攻撃力を下げ、自身の回避を高める。"
      },
      "flavor": "華麗な足さばきで敵を翻弄するトリックスター。"
    },
    {
      "slug": "french_bulldog",
      "displayName": "ブルドン",
      "englishName": "French Bulldog",
      "role": "士気支援",
      "image": "soldier/french_bulldog.png",
      "stats": {
        "hp": 128,
        "attack": 21,
        "defense": 20,
        "speed": 15
      },
      "ability": {
        "name": "士気の遠吠え",
        "type": "howlOfPack",
        "spCost": 4,
        "description": "HPを回復し、攻撃と防御を同時に高める雄叫びをあげる。"
      },
      "flavor": "小柄ながら、仲間の心を奮い立たせる指揮官気質。"
    },
    {
      "slug": "koala",
      "displayName": "コアラミ",
      "englishName": "Koala",
      "role": "持久サポート",
      "image": "soldier/koala.png",
      "stats": {
        "hp": 122,
        "attack": 18,
        "defense": 21,
        "speed": 15
      },
      "ability": {
        "name": "ユーカリドリーム",
        "type": "eucalyptusDream",
        "spCost": 5,
        "description": "癒しの香りで大きく回復し、継続再生を付与する。"
      },
      "flavor": "マイペースだが粘り強い癒やし手。"
    },
    {
      "slug": "lion",
      "displayName": "ライオウ",
      "englishName": "Lion",
      "role": "急所狙い",
      "image": "soldier/lion.png",
      "stats": {
        "hp": 136,
        "attack": 26,
        "defense": 20,
        "speed": 22
      },
      "ability": {
        "name": "ソブリンサイト",
        "type": "huntersEye",
        "spCost": 3,
        "description": "敵の弱点を見抜き、防御無視の一撃と速度上昇を得る。"
      },
      "flavor": "王者の風格で戦況を掌握する。"
    },
    {
      "slug": "lynx",
      "displayName": "リンクス",
      "englishName": "Lynx",
      "role": "クリティカル",
      "image": "soldier/lynx.png",
      "stats": {
        "hp": 112,
        "attack": 25,
        "defense": 18,
        "speed": 25
      },
      "ability": {
        "name": "切り裂きの爪",
        "type": "razorClaw",
        "spCost": 4,
        "description": "ガードを貫く高威力の斬撃。反動で自傷ダメージを受ける。"
      },
      "flavor": "一点集中で装甲を切り裂く暗殺者。"
    },
    {
      "slug": "monkey",
      "displayName": "サルゾー",
      "englishName": "Monkey",
      "role": "状況対応",
      "image": "soldier/monkey.png",
      "stats": {
        "hp": 118,
        "attack": 22,
        "defense": 18,
        "speed": 23
      },
      "ability": {
        "name": "トリックバナナ",
        "type": "bananaTrick",
        "spCost": 3,
        "description": "敵の足元をすくい、防御力を低下させる。"
      },
      "flavor": "臨機応変な戦術で戦い方を変えていく。"
    },
    {
      "slug": "mouse",
      "displayName": "ネズチカ",
      "englishName": "Mouse",
      "role": "スピードスター",
      "image": "soldier/mouse.png",
      "stats": {
        "hp": 96,
        "attack": 19,
        "defense": 14,
        "speed": 28
      },
      "ability": {
        "name": "チーズラッシュ",
        "type": "swarmRush",
        "spCost": 3,
        "description": "守りをすり抜ける小刻みな連撃で、自身の速度を上げる。"
      },
      "flavor": "小さな身体で戦場を縦横無尽に走り抜ける。"
    },
    {
      "slug": "opossum",
      "displayName": "ポサムン",
      "englishName": "Opossum",
      "role": "逆転守備",
      "image": "soldier/opossum.png",
      "stats": {
        "hp": 114,
        "attack": 19,
        "defense": 19,
        "speed": 18
      },
      "ability": {
        "name": "死んだふり",
        "type": "playingDead",
        "spCost": 4,
        "description": "被ダメージを大きく抑えつつ回復し、次の攻撃力を高める。"
      },
      "flavor": "土壇場での逆転劇を得意とする策士。"
    },
    {
      "slug": "panda",
      "displayName": "パンダム",
      "englishName": "Panda",
      "role": "場持ちヒーラー",
      "image": "soldier/panda.png",
      "stats": {
        "hp": 148,
        "attack": 21,
        "defense": 23,
        "speed": 12
      },
      "ability": {
        "name": "竹気功",
        "type": "bambooPulse",
        "spCost": 4,
        "description": "大きくHPを回復し、攻撃力にバフを得る。"
      },
      "flavor": "穏やかだが芯は強く、立て直しからの反撃が得意。"
    },
    {
      "slug": "pig",
      "displayName": "ブターノ",
      "englishName": "Pig",
      "role": "チャージャー",
      "image": "soldier/pig.png",
      "stats": {
        "hp": 126,
        "attack": 21,
        "defense": 19,
        "speed": 17
      },
      "ability": {
        "name": "満腹チャージ",
        "type": "gluttonCharge",
        "spCost": 4,
        "description": "HPを回復し、次の攻撃に大きなボーナスを蓄える。"
      },
      "flavor": "食べた分だけ力になる元気いっぱいの戦士。"
    },
    {
      "slug": "pug",
      "displayName": "パグミ",
      "englishName": "Pug",
      "role": "守護サポート",
      "image": "soldier/pug.png",
      "stats": {
        "hp": 123,
        "attack": 20,
        "defense": 19,
        "speed": 16
      },
      "ability": {
        "name": "バブルガード",
        "type": "cloudGuard",
        "spCost": 4,
        "description": "衝撃を吸収する泡で身を包み、継続回復を得る。"
      },
      "flavor": "仲間のためならどこまでも盾になる忠犬。"
    },
    {
      "slug": "rabbit",
      "displayName": "ウサギン",
      "englishName": "Rabbit",
      "role": "奇襲ファイター",
      "image": "soldier/rabbit.png",
      "stats": {
        "hp": 106,
        "attack": 22,
        "defense": 15,
        "speed": 27
      },
      "ability": {
        "name": "ラピッドステップ",
        "type": "rapidStep",
        "spCost": 3,
        "description": "瞬時に距離を詰め、回避力を上げながら攻撃する。"
      },
      "flavor": "跳躍からのラッシュで敵陣を切り裂く。"
    },
    {
      "slug": "raccoon",
      "displayName": "アラグマ",
      "englishName": "Raccoon",
      "role": "吸収アタッカー",
      "image": "soldier/raccoon.png",
      "stats": {
        "hp": 119,
        "attack": 22,
        "defense": 18,
        "speed": 22
      },
      "ability": {
        "name": "盗人のひらめき",
        "type": "cleverSwipe",
        "spCost": 3,
        "description": "敵から活力を盗み、自身を回復しつつ攻撃力を削ぐ。"
      },
      "flavor": "素早い手先で敵のリソースを奪い取る。"
    },
    {
      "slug": "rhino",
      "displayName": "サイゴロ",
      "englishName": "Rhino",
      "role": "反射突撃",
      "image": "soldier/rhino.png",
      "stats": {
        "hp": 152,
        "attack": 25,
        "defense": 25,
        "speed": 12
      },
      "ability": {
        "name": "鉄壁突進",
        "type": "ironBulwark",
        "spCost": 4,
        "description": "身を固めて被ダメージを減らし、反撃態勢に入る。"
      },
      "flavor": "鎧のような皮膚で攻防一体の突進を繰り出す。"
    },
    {
      "slug": "sheep",
      "displayName": "ヒツジナ",
      "englishName": "Sheep",
      "role": "継続防御",
      "image": "soldier/sheep.png",
      "stats": {
        "hp": 121,
        "attack": 19,
        "defense": 20,
        "speed": 16
      },
      "ability": {
        "name": "雲綿バリア",
        "type": "cloudGuard",
        "spCost": 4,
        "description": "膨らんだ毛で衝撃を吸収し、継続回復を得る。"
      },
      "flavor": "柔らかな毛並みで味方を包む温厚な守護者。"
    },
    {
      "slug": "shiba_inu",
      "displayName": "シバノス",
      "englishName": "Shiba Inu",
      "role": "士気鼓舞",
      "image": "soldier/shiba_inu.png",
      "stats": {
        "hp": 122,
        "attack": 23,
        "defense": 19,
        "speed": 19
      },
      "ability": {
        "name": "隊列号令",
        "type": "howlOfPack",
        "spCost": 4,
        "description": "鋭い号令でHPを回復し、攻守を同時に底上げする。"
      },
      "flavor": "明朗な号令で戦列を整える頼れる隊長。"
    },
    {
      "slug": "spotted_hyena",
      "displayName": "ハイエナミ",
      "englishName": "Spotted Hyena",
      "role": "連撃捕食者",
      "image": "soldier/spotted_hyena.png",
      "stats": {
        "hp": 132,
        "attack": 25,
        "defense": 18,
        "speed": 23
      },
      "ability": {
        "name": "哄笑乱撃",
        "type": "savageRoar",
        "spCost": 4,
        "description": "凶悪な笑い声と共に連続攻撃を繰り出し、敵を萎縮させる。"
      },
      "flavor": "混沌を好み、戦闘が長引くほど勢いを増す。"
    },
    {
      "slug": "squirrel",
      "displayName": "リスゾー",
      "englishName": "Squirrel",
      "role": "支援斥候",
      "image": "soldier/squirrel.png",
      "stats": {
        "hp": 110,
        "attack": 20,
        "defense": 17,
        "speed": 24
      },
      "ability": {
        "name": "フォレストリズム",
        "type": "arborealBalance",
        "spCost": 4,
        "description": "俊敏な動きでHPを回復し、再生効果を付与する。"
      },
      "flavor": "木々を渡り歩き、仲間の再生を手助けする斥候。"
    },
    {
      "slug": "tiger",
      "displayName": "トラジロ",
      "englishName": "Tiger",
      "role": "連撃アタッカー",
      "image": "soldier/tiger.png",
      "stats": {
        "hp": 136,
        "attack": 27,
        "defense": 21,
        "speed": 24
      },
      "ability": {
        "name": "咆哮連撃",
        "type": "savageRoar",
        "spCost": 4,
        "description": "咆哮と共に連続攻撃を叩き込み、敵の攻撃力を下げる。"
      },
      "flavor": "百獣の王。攻め続けることで主導権を握る。"
    }
  ],
  "CONFIG": {
    "sp": {
      "max": 10,
      "gainPerTurn": 1,
      "defaultSkillCost": 3
    },
    "combat": {
      "logLimit": 60,
      "baseMinDamage": 4,
      "maxDamageReduction": 0.8,
      "minDamageReduction": -0.4
    }
  }
};

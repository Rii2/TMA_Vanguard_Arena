<!-- Location: docs/ui-troubleshooting.md -->
<!-- Purpose: Document quick checks when the UI fails to render expected sections. -->
<!-- Rationale: Capture regression fixes so future contributors can diagnose missing cards or buttons. -->

# UI トラブルシューティング

- 動物図鑑やボタンが表示されない場合は、`npm test` を実行して `browser scripts pass node --check` が成功することを確認してください。
- `game.js` と `game-data.js` が HTML から正しい順序で読み込まれているか確認し、`game-data.js` が先に評価されて `window.TMA_DATA` が定義されていることを確かめます。
- ブラウザのコンソールで `TMA_DATA` を確認し、`animals` 配列にエントリが存在するか、`CONFIG` が期待通りに設定されているかを点検してください。
- ターン進行はカードの発光とターンバナーで可視化されます。イベントが発火しない場合は `setPhase` と `performAction` の処理を確認してください。


- 2025-09-18: Startボタンが反応しない場合は、``initGameUI`` が DOMContentLoaded 後に ``startGame`` を登録しているか、``resetGameState`` / ``startGame`` がトップレベル関数として定義されているかを確認してください。
- 2025-09-18: Startボタンが無反応でブラウザコンソールに`ReferenceError: cost is not defined`が出る場合、`setupStage`で`.turn-banner__label`へ`stage.label`を代入しているかを確認する。
- 2025-09-18: TOPヒーロー画像のコピーで`\n`や`'n`が出るときは、`styles.css`の該当セクションで`\n`が撥ねられていないかを見直す。
- 2025-09-18: タイトル横のロゴが`top.png`のまま写らない場合は、`index.html`で`hero__logo`が`TMA icon_01.png`を指しているかを確認する。
- 2025-09-19: バトル行動バーが更新されない場合は `renderTurnActions` / `resetTurnActions` の呼び出し順と `index.html` の `.action-summary` が一致しているかを確認してください。コマンドボタンが縦積みになるときは `styles.css` の `.command-panel` メディアクエリを見直します。

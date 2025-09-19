<!-- Location: docs/ui-troubleshooting.md -->
<!-- Purpose: Document quick checks when the UI fails to render expected sections. -->
<!-- Rationale: Capture regression fixes so future contributors can diagnose missing cards or buttons. -->

# UI トラブルシューティング

- 動物図鑑やボタンが表示されない場合は、`npm test` を実行して `browser scripts pass node --check` が成功することを確認してください。
- `game.js` と `game-data.js` が HTML から正しい順序で読み込まれているか確認し、`game-data.js` が先に評価されて `window.TMA_DATA` が定義されていることを確かめます。
- ブラウザのコンソールで `TMA_DATA` を確認し、`animals` 配列にエントリが存在するか、`CONFIG` が期待通りに設定されているかを点検してください。
- ターン進行はカードの発光とターンバナーで可視化されます。イベントが発火しない場合は `setPhase` と `performAction` の処理を確認してください。

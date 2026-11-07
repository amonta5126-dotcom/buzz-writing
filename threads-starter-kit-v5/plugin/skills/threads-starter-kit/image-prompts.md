---
title: 画像生成プロンプト集・検品チェック
doc-type: 教材同梱ドキュメント
---

# 画像生成のやり方（v2で追記: 横長4:3・「1行目を証明する1点」）

v2の変更点は3つ。①画像は横長（4:3）を標準にする（縦長は流れる画面で切れる）②「生き物・物が写る」だけでは足りず、本文1行目の主張を1枚で証明する「え、何それ」の1点を必ず入れる（例: 「羽は治らない」→擦り切れた羽の逆光、「荷物が多い」→花粉団子をぶら下げて飛ぶ姿）③人の顔は写さない（手・後ろ姿・遠景シルエットまで）。以下はv1の内容に上記を反映したもの。

Threadsの投稿画像は「実写風のドアップ」が基本です。フラットイラスト・絵本調・いかにもAI生成という見た目は避けてください（プロフィール画像・サムネイルのような「顔」になる画像だけは例外でイラストでも構いません）。

## 標準プロンプト（英語・末尾に毎回付ける）

画風を実写に寄せるための文言です。どの投稿画像にもコピペで付け足してください。

```
photorealistic, documentary-style photography, natural light, muted realistic colors, shallow depth of field, real photo grain, no perfect bokeh, not a painting, not an illustration
```

文字が写り込むのを防ぐため、これも毎回続けて入れてください。

```
no text, no letters, no words, no logos, no watermarks, no numbers
```

## 構図の指定の仕方

1. **本文の主題をプロンプトの主語にする。** 「〇〇のクローズアップ」「〇〇のマクロ写真」のように、被写体が画面の大部分を占める指定を必ず入れる。
2. **本文の主張（意外性のポイント）を、画像が視覚的に証明する構図にする。** 例えば「違いを語る本文」なら「違いが一目で分かる対比構図」を指定する。
3. **遠景・全景・雰囲気カットの指定はしない。** `wide shot`・`scenery` のような単語は避ける（画角は横長4:3＝`landscape 4:3 aspect ratio` を指定してよいが、被写体は画面いっぱいのドアップにする）。

## プロンプトの組み立てテンプレート

```
[主題], [構図の指定: close-up / macro shot / side-by-side comparison など], [主題の状態や動作], photorealistic, documentary-style photography, natural light, muted realistic colors, shallow depth of field, real photo grain, no perfect bokeh, not a painting, not an illustration, no text, no letters, no words, no logos, no watermarks, no numbers
```

### 記入例（ジャンル: 観葉植物）

```
extreme close-up of a monstera leaf with a yellowing edge, water droplets visible on the surface, shallow depth of field, photorealistic, documentary-style photography, natural light, muted realistic colors, real photo grain, no perfect bokeh, not a painting, not an illustration, no text, no letters, no words, no logos, no watermarks, no numbers
```

### 記入例（ジャンル: 手芸・比較構図）

```
side-by-side comparison of two hand-knitted stitches, one tight and even, one loose and uneven, macro shot showing yarn texture, photorealistic, documentary-style photography, natural light, muted realistic colors, shallow depth of field, real photo grain, no perfect bokeh, not a painting, not an illustration, no text, no letters, no words, no logos, no watermarks, no numbers
```

## 使うツール

Midjourney・DALL-E・Stable Diffusion・Nano Banana（Google）・Claude Codeから呼べる画像生成MCP（Codex等）など、手元で使えるものでよく、特定のツールを指定する必要はありません。Claude Codeで画像生成ツールが使える場合は、AIに直接プロンプトを渡して生成させても構いません。

## 生成後の検品（毎回必ず確認する）

投稿する前に、この4つを目で見て確認してください。AIが「生成しました」と言っても鵜呑みにせず、必ず自分の目で見ます。

1. **文字・ロゴ・ウォーターマークが写り込んでいないか。** 文字禁止を指定しても紛れ込むことがあります。
2. **主題が画面の半分以上を占め、主役として写っているか。** 遠景や添え物になっていないか確認する。
3. **実写に見えるか。** フラットイラスト・絵本調・いかにもAI生成という見た目になっていないか確認する。
4. **同じ日の複数投稿で、同じ画像を使い回していないか。** プラットフォームによっては重複コンテンツとして扱われる懸念があるため、投稿ごとに別の構図で生成する。

## イラスト調を使ってよい例外

プロフィール画像やサムネイルのような、アカウントの「顔」になる画像だけは、統一されたキャラクターデザインのイラストでよいです。本文に添える投稿画像は実写風で統一してください。

## よくある不具合と対策

- **画像生成ツールが「準備はできているが実際には生成しない」ことがある。** 特にAIエージェント経由でツールを呼ぶ場合、プロンプトを読んだだけで生成コマンドを実行し忘れることがあります。プロンプトの冒頭に「今すぐ画像生成ツールを呼んでください」のような明示的な実行指示を加えると改善します。
- **1回で理想の構図が出ないことがある。** 2〜3枚生成して一番条件を満たすものを選ぶ運用にすると安定します。

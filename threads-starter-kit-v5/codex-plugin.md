---
title: Codexにプラグインとして入れるやり方
doc-type: 配布ドキュメント
created: 2026-10-30
---

# Codexにプラグインとして入れるやり方

このフォルダは、そのまま **Codexのプラグイン** として入れられる形になっています。入れておくと、どの作業フォルダを開いていても「Threadsの投稿を作って」と頼むだけで、このキットの手順（SKILL.md）が使われます。

## 入れ方（3つのコマンド）

ZIPを展開したら、ターミナル（Windowsならコマンドプロンプト/PowerShell）で次を順に打ちます。`<展開したフォルダ>` は、このファイルがあるフォルダの場所です。

```
codex plugin marketplace add "<展開したフォルダ>"
codex plugin add threads-starter-kit@threads-starter-kit
codex plugin list
```

- 1行目：このフォルダを「プラグインの置き場」として登録します
- 2行目：その中の threads-starter-kit を入れます
- 3行目：入ったかを確認します（一覧に出ればOK）

入れたら、Codexのアプリを開き直してください。

コマンドが苦手なら、Codexに「このフォルダ（<展開したフォルダ>）をプラグインとして入れて」と頼めば、同じことをやってくれます。

## 入れたあとの使い方

- 初回：「Threadsの運用を始めたい。まずジャンルを聞いて」
- 毎日：「今日のThreadsの3本作って」
- 画像：「さっきの3本の画像を作って」（Codexの画像生成で、`image-kata.md` の型に沿って作ります）

## Claude Code で使う場合

`plugin/skills/threads-starter-kit/` フォルダを、`~/.claude/skills/` の中にフォルダごとコピーします。以後は「Threadsの投稿を作って」で読み込まれます。

## 元アカでの使い方（参考）

- 文章：Claude Code（定額プラン）にこの手順で作らせる
- 画像：Codex（ChatGPTの定額）に作らせる。Claude Code から `codex exec "（画像の指示）"` で呼ぶこともできる
- 投稿：Meta公式APIで決めた時刻に自動投稿（`meta-api-memo.md`）。始めたばかりなら手で投稿で十分

## 消したいとき

```
codex plugin remove threads-starter-kit@threads-starter-kit
```

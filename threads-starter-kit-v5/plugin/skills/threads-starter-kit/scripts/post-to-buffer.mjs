#!/usr/bin/env node
/**
 * post-to-buffer.mjs
 *
 * Threadsスターターキット付属の最小限の予約投稿スクリプト。
 * Bufferの公式REST API（https://buffer.com/developers/api）を使い、
 * 1本のテキスト投稿（画像URLは任意）をThreadsチャネルへ予約する。
 *
 * 事前準備（buffer-setup.md を参照）:
 *   1. Bufferアカウントを作成しThreadsを接続する
 *   2. アクセストークンとProfileIDを取得する
 *   3. ~/.config/threads-starter-kit/.env に以下を保存する
 *        BUFFER_ACCESS_TOKEN=xxxxx
 *        BUFFER_THREADS_PROFILE_ID=xxxxx
 *
 * 使い方:
 *   # 予約せずに内容を確認するだけ（本番投稿はしない）
 *   node scripts/post-to-buffer.mjs --text "本文テキスト" --dry-run
 *
 *   # 指定した日時（ISO形式・JSTでもUTCでもよい）に予約する
 *   node scripts/post-to-buffer.mjs --text "本文テキスト" --at "2026-08-20T06:00:00+09:00"
 *
 *   # 画像URLを付けて予約する（ローカルファイルではなく、公開されたURLを渡す）
 *   node scripts/post-to-buffer.mjs --text "本文テキスト" --at "2026-08-20T06:00:00+09:00" --image "https://example.com/image.jpg"
 *
 *   # 今すぐ投稿する（予約なし。テスト時以外は基本的に --at を使うことを推奨）
 *   node scripts/post-to-buffer.mjs --text "本文テキスト" --now
 *
 * 注意:
 *   - このスクリプトは「予約登録」までを行う。実際に世に出す最終判断は必ず人間が行うこと。
 *     Bufferのダッシュボード上で予約内容を一度確認してから公開されるのを待つ運用を推奨する。
 *   - ProfileIDが分からない場合は、下部の listProfiles() 関数を使うと確認できる
 *     （`node scripts/post-to-buffer.mjs --list-profiles` で実行可能）。
 *   - アクセストークンは絶対に他人に見せない・公開リポジトリへコミットしない。
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const BUFFER_API_BASE = "https://api.bufferapp.com/1";
const CONFIG_PATH = path.join(os.homedir(), ".config", "threads-starter-kit", ".env");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }
  return env;
}

function parseArgs(argv) {
  const args = { dryRun: false, now: false, listProfiles: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--text") args.text = argv[++i];
    else if (a === "--at") args.at = argv[++i];
    else if (a === "--image") args.image = argv[++i];
    else if (a === "--profile-id") args.profileId = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--now") args.now = true;
    else if (a === "--list-profiles") args.listProfiles = true;
  }
  return args;
}

async function listProfiles(accessToken) {
  const url = `${BUFFER_API_BASE}/profiles.json?access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`profiles取得に失敗しました（HTTP ${res.status}）。トークンを確認してください。`);
  }
  const profiles = await res.json();
  console.log("接続中のチャネル一覧:");
  for (const p of profiles) {
    console.log(`  - service=${p.service} / id=${p.id} / name=${p.formatted_username || p.service_username || "(不明)"}`);
  }
  console.log("\nThreadsのidを ~/.config/threads-starter-kit/.env の BUFFER_THREADS_PROFILE_ID に設定してください。");
}

async function createUpdate({ accessToken, profileId, text, image, at, now }) {
  const params = new URLSearchParams();
  params.append("access_token", accessToken);
  params.append("profile_ids[]", profileId);
  params.append("text", text);
  if (image) {
    params.append("media[photo]", image);
  }
  if (now) {
    params.append("now", "true");
  } else if (at) {
    const scheduledAtUnix = Math.floor(new Date(at).getTime() / 1000);
    if (Number.isNaN(scheduledAtUnix)) {
      throw new Error(`--at の日時を解釈できませんでした: ${at}（例: 2026-08-20T06:00:00+09:00）`);
    }
    params.append("scheduled_at", String(scheduledAtUnix));
  } else {
    // 何も指定しなければBuffer側のデフォルトキュー（次の空き枠）に入る
  }

  const res = await fetch(`${BUFFER_API_BASE}/updates/create.json`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const body = await res.json();
  if (!res.ok || body.success === false) {
    throw new Error(`Buffer APIへの投稿予約に失敗しました: ${JSON.stringify(body)}`);
  }
  return body;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = { ...loadEnvFile(CONFIG_PATH), ...process.env };
  const accessToken = env.BUFFER_ACCESS_TOKEN;
  const profileId = args.profileId || env.BUFFER_THREADS_PROFILE_ID;

  if (!accessToken) {
    console.error(
      `BUFFER_ACCESS_TOKENが見つかりません。${CONFIG_PATH} を作成してください（buffer-setup.mdのステップ4参照）。`
    );
    process.exit(1);
  }

  if (args.listProfiles) {
    await listProfiles(accessToken);
    return;
  }

  if (!args.text) {
    console.error("投稿する本文を --text で指定してください。例: node scripts/post-to-buffer.mjs --text \"本文\" --dry-run");
    process.exit(1);
  }

  if (!profileId) {
    console.error(
      "投稿先のProfileIDが分かりません。まず `node scripts/post-to-buffer.mjs --list-profiles` を実行して確認してください。"
    );
    process.exit(1);
  }

  if (args.dryRun) {
    console.log("[dry-run] 実際には投稿しません。予定される内容は以下のとおりです。");
    console.log(`  profileId: ${profileId}`);
    console.log(`  text: ${args.text}`);
    console.log(`  image: ${args.image || "(なし)"}`);
    console.log(`  予約日時: ${args.now ? "今すぐ" : args.at || "(Bufferの次の空き枠)"}`);
    return;
  }

  const result = await createUpdate({
    accessToken,
    profileId,
    text: args.text,
    image: args.image,
    at: args.at,
    now: args.now,
  });
  console.log("予約が完了しました。Bufferのダッシュボードで内容を確認してください。");
  console.log(JSON.stringify(result, null, 2));
}

// importガード: このファイルが直接実行されたときだけmain()を呼ぶ
// （他のスクリプトからimportされたときに誤って実行されるのを防ぐ）
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isDirectRun) {
  main().catch((err) => {
    console.error("エラーが発生しました:", err.message);
    process.exit(1);
  });
}

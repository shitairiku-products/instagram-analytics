import 'dotenv/config';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const FB_API = 'https://graph.facebook.com/v18.0';

/* ---------- 共通ラッパー ---------- */
async function fetchJson(url, label) {
  console.log(`\n======= ${label} =======`);
  console.log(`GET ${url}\n`);
  const res = await fetch(url);
  const text = await res.text();
  console.log(`[status] ${res.status}`);
  console.log(`[raw]    ${text}\n`);
  try {
    const json = JSON.parse(text);
    return json;
  } catch {
    throw new Error(`[${label}] JSON解析失敗`);
  }
}

async function exchangeToken(appId, appSecret, shortLivedToken, label) {
  return await fetchJson(
    `${FB_API}/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${appId}` +
      `&client_secret=${appSecret}` +
      `&fb_exchange_token=${shortLivedToken}`,
    label
  );
}

async function getAllPages(accessToken) {
  let allPages = [];
  let url = `${FB_API}/me/accounts?access_token=${accessToken}`;

  while (url) {
    const response = await fetchJson(url, 'me/accounts');
    allPages = allPages.concat(response.data);
    
    // 次のページがあれば、URLを更新
    url = response.paging?.next || null;
  }

  return allPages;
}

/* ---------- メイン ---------- */
async function getInstagramAccountInfo() {
  try {
    const { FB_APP_ID, FB_APP_SECRET, FB_SHORT_LIVED_TOKEN } = process.env;
    if (!FB_APP_ID || !FB_APP_SECRET || !FB_SHORT_LIVED_TOKEN) {
      throw new Error(
        '環境変数 FB_APP_ID / FB_APP_SECRET / FB_SHORT_LIVED_TOKEN を設定してください。'
      );
    }

    // 1) ユーザーの長期アクセストークン取得
    const userLongLivedTokenData = await exchangeToken(
      FB_APP_ID,
      FB_APP_SECRET,
      FB_SHORT_LIVED_TOKEN,
      'user_exchange_token'
    );

    const userLongLivedToken = userLongLivedTokenData.access_token;
    if (!userLongLivedToken) {
      throw new Error('ユーザーの長期アクセストークンの取得に失敗');
    }

    // 2) Facebookページ一覧取得（ページネーション対応）
    const pages = await getAllPages(userLongLivedToken);

    if (!pages?.length) {
      throw new Error('Facebookページが見つかりませんでした');
    }

    console.log(`取得したページ数: ${pages.length}`);

    // 3) 各ページのIGビジネスアカウント確認とDB保存
    for (const page of pages) {
      // 3-1) ページの短期トークンを長期トークンに交換
      const pageLongLivedTokenData = await exchangeToken(
        FB_APP_ID,
        FB_APP_SECRET,
        page.access_token,
        `page_${page.id}_exchange_token`
      );

      if (!pageLongLivedTokenData.access_token) {
        console.error(`ページ ${page.name} の長期トークン取得に失敗`);
        continue;
      }

      // 3-2) IGアカウント情報取得
      const igData = await fetchJson(
        `${FB_API}/${page.id}` +
          `?fields=instagram_business_account{id,username,name}` +
          `&access_token=${pageLongLivedTokenData.access_token}`,
        `page_${page.id}_ig_info`
      );

      if (igData.instagram_business_account) {
        const { 
          id: igId, 
          username,
          name = username // nameが取得できない場合は、usernameをフォールバックとして使用
        } = igData.instagram_business_account;
        
        // 3-3) DB保存（Upsert）
        await prisma.company.upsert({
          where: { igId },
          update: {
            name,
            longToken: pageLongLivedTokenData.access_token,
          },
          create: {
            name,
            igId,
            longToken: pageLongLivedTokenData.access_token,
          },
        });
        
        console.log(`✓ 保存完了: ${name} (${username})`);
      }
    }

    console.log('\n処理が完了しました');
  } catch (error) {
    console.error('エラー:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

getInstagramAccountInfo();

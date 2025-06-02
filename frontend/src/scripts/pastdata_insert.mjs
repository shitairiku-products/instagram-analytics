import { PrismaClient } from '@prisma/client';
import path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

const prisma = new PrismaClient();

async function insertPastData() {
  try {
    // 全てのcompanyを取得
    const companies = await prisma.company.findMany();
    const companyMap = companies.reduce((acc, company) => {
      acc[company.igId] = company.id;
      return acc;
    }, {});

    console.log(`${Object.keys(companyMap).length}社の企業データを読み込みました`);

    // CSVファイルの読み込み
    const dataPath = path.join(__dirname, '../data/IG_insight_combineSheert - combine_insight.csv');
    let successCount = 0;
    let errorCount = 0;

    // CSVパーサーの設定
    const parser = createReadStream(dataPath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true
      })
    );

    for await (const row of parser) {
      try {
        // IGアカウントIDから引用符を削除
        const cleanIgId = row.igId.replace(/"/g, '');
        const companyId = companyMap[cleanIgId];
        
        if (!companyId) {
          console.error(`IGアカウントID: ${cleanIgId} に対応する企業が見つかりません`);
          errorCount++;
          continue;
        }

        await prisma.accountInsight.create({
          data: {
            companyId,
            igId: cleanIgId,
            date: new Date(row.date),
            followers: parseInt(row.followers) || 0,
            follows: parseInt(row.follows) || 0,
            posts: parseInt(row.posts) || 0,
            reachTotal: parseInt(row.reach_total) || 0,
            reachFollower: parseInt(row.reach_follower) || 0,
            reachNonFollower: parseInt(row.reach_non_follower) || 0,
            reachUnknown: parseInt(row.reach_unknown) || 0,
            impressions: parseInt(row.impressions) || 0,
            profileVisits: parseInt(row.profile_visits) || 0,
            webTaps: parseInt(row.website_taps) || 0,
            likesTotal: parseInt(row.likes_total) || 0,
            commentsTotal: parseInt(row.comments_total) || 0,
            savesTotal: parseInt(row.saves_total) || 0,
            sharesTotal: parseInt(row.shares_total) || 0,
            // メディアタイプ別のメトリクス
            adReach: parseInt(row.ad_reach) || 0,
            adLikes: parseInt(row.ad_likes) || 0,
            adComments: parseInt(row.ad_comments) || 0,
            adSaves: parseInt(row.ad_saves) || 0,
            adShares: parseInt(row.ad_shares) || 0,
            feedReach: parseInt(row.feed_reach) || 0,
            feedLikes: parseInt(row.feed_likes) || 0,
            feedComments: parseInt(row.feed_comments) || 0,
            feedSaves: parseInt(row.feed_saves) || 0,
            feedShares: parseInt(row.feed_shares) || 0,
            storyReach: parseInt(row.story_reach) || 0,
            storyLikes: parseInt(row.story_likes) || 0,
            storyComments: parseInt(row.story_comments) || 0,
            storySaves: parseInt(row.story_saves) || 0,
            storyShares: parseInt(row.story_shares) || 0,
            reelReach: parseInt(row.reel_reach) || 0,
            reelLikes: parseInt(row.reel_likes) || 0,
            reelComments: parseInt(row.reel_comments) || 0,
            reelSaves: parseInt(row.reel_saves) || 0,
            reelShares: parseInt(row.reel_shares) || 0,
            carouselReach: parseInt(row.carousel_reach) || 0,
            carouselLikes: parseInt(row.carousel_likes) || 0,
            carouselComments: parseInt(row.carousel_comments) || 0,
            carouselSaves: parseInt(row.carousel_saves) || 0,
            carouselShares: parseInt(row.carousel_shares) || 0,
          }
        });
        successCount++;

        if (successCount % 100 === 0) {
          console.log(`${successCount}件のデータを挿入しました`);
        }
      } catch (error) {
        console.error(`データの挿入に失敗しました:`, error);
        errorCount++;
      }
    }

    console.log('\n=== 処理完了 ===');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);

  } catch (error) {
    console.error('スクリプトの実行中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトの実行
insertPastData(); 
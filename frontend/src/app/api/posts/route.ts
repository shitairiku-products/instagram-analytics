import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const types = searchParams.get('types')?.split(',') || [];

    console.log('クエリパラメータ:', { companyId, startDate, endDate, types });

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // クエリ条件を作成
    const where: Prisma.PostInsightWhereInput = { companyId };

    // 日付フィルター
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // タイプフィルター
    if (types.length > 0) {
      where.mediaProductType = {
        in: types,
      };
    }

    // クエリ実行
    const posts = await prisma.postInsight.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
    });

    console.log(`取得した投稿数: ${posts.length}`);
    if (posts.length === 0) {
      console.log('投稿が見つかりませんでした。データベースを確認してください。');
    }

    return NextResponse.json(posts);
  } catch (error: unknown) {
    console.error('Error fetching posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 
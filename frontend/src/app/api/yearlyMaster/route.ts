import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!companyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    const insights = await prisma.accountInsight.findMany({
      where: {
        companyId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching yearly feed insights:', error);
    return NextResponse.json(
      { error: 'データの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/with-auth';
import { User } from 'better-auth';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest, session: { user: User }) {
  try {
    const body = await req.json();

    const { adapter_type, accessKeyId, accessKeySecret, region, username, arn, userId } = body;

    const emptyEntry = Object.entries({
      adapter_type,
      accessKeyId,
      accessKeySecret,
      region,
      username,
      arn,
      userId,
    }).find(([_, value]) => value === '' || value === null);

    if (emptyEntry) {
      const [key] = emptyEntry;

      return NextResponse.json({
        success: false,
        message: `${key} is required`,
      });
    }

    await prisma.adapter.create({
      data: {
        adapter_type: 'AWS_S3',
        name: `${username}`,
        providerId: userId,
        userId: session.user.id,
        accessKeyId,
        accessKeySecret,
        region,
        adapterAccountInfo: {
          create: {
            arn,
            name: username,
            avatar: '/icons/s3.svg',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Connected Successfully',
    });
  } catch (error) {
    console.error('Error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
}

export const POST = withAuth(handler);

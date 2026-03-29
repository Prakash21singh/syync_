import { findAdapter } from '@/lib/queries';
import { withAuth } from '@/lib/with-auth';
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

async function handler(req: NextRequest, session: any) {
  try {
    const body = await req.json();

    if (!body.sourceAdapterId)
      return Response.json(
        {
          success: false,
          message: 'Invalid source adapter',
        },
        {
          status: 400,
        },
      );

    const adapter = await findAdapter({
      id: body.sourceAdapterId,
      userId: session.user.id,
    });

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: adapter?.accessKeyId!,
        secretAccessKey: adapter?.accessKeySecret!,
      },
      region: adapter?.region!,
    });

    const res = await s3Client.send(new ListBucketsCommand({}));

    const buckets = res.Buckets?.map((bucket) => ({ name: bucket.Name }));

    return Response.json({
      buckets,
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong!',
      },
      {
        status: 500,
      },
    );
  }
}

export const POST = withAuth(handler);

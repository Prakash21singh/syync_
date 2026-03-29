import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { IAMClient, GetUserCommand } from '@aws-sdk/client-iam';
import { AWSCredentials } from '@/types';

type AWSUserSuccess = {
  success: true;
  data: {
    username: string;
    arn: string;
    userId: string;
  };
};

type AWSUserError = {
  success: false;
  error: string;
};

type Response = AWSUserSuccess | AWSUserError;

export async function getAWSUserInfo({
  accessKeyId,
  secretAccessKey,
  region,
}: AWSCredentials): Promise<Response> {
  try {
    const sts = new STSClient({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });

    const identity = await sts.send(new GetCallerIdentityCommand({}));

    if (identity && identity.Arn && !isIAMUser(identity.Arn)) {
      throw new Error('RootUserFound');
    }

    const iam = new IAMClient({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });

    const user = await iam.send(new GetUserCommand({}));

    return {
      success: true,
      data: {
        arn: user.User?.Arn!,
        userId: user.User?.UserId!,
        username: user.User?.UserName!,
      },
    };
  } catch (error: any) {
    console.error('Error:', error.name);

    if (error.name === 'InvalidClientTokenId') {
      return {
        success: false,
        error: 'Provided Credentials are wrong!',
      };
    }

    if (error.name === 'RootUserFound') {
      return {
        success: false,
        error: 'We recommend you to use IAM User not the root user for this operation!',
      };
    }

    return {
      success: false,
      error: 'Invalid credentials provided!',
    };
  }
}

function isIAMUser(ARN: string) {
  if (ARN.includes(':user/')) {
    return true;
  }
  return false;
}

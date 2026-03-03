import AdapterSelection from '@/components/adapter';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

type Props = {};

const RootPage = async (props: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <AdapterSelection isLoggedIn={!!session?.user} userId={session?.user.id!} />
    </div>
  );
};

export default RootPage;

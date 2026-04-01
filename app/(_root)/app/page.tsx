import AdapterSelection from '@/components/adapter';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getUserAdapters } from '@/lib/queries';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Sync',
  description:
    'Sync is a tool to help you migrate your data between different cloud storage providers. With Sync, you can easily transfer your files from one provider to another without any hassle.',
};
type Props = {};

const AppPage = async (props: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Fetch user's existing adapters on server-side
  const userAdapters = await getUserAdapters(session.user.id);

  return (
    <div className="font-sarabun">
      <AdapterSelection isLoggedIn={true} userId={session.user.id} initialAdapters={userAdapters} />
    </div>
  );
};

export default AppPage;

import Head from 'next/head';
import Home from '../components/Home';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default function HomePage({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="chat with all your friends" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Home isMobile={isMobile} />
      </main>
    </>
  );
}

type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export async function getServerSideProps({ req, res }: Context) {
  const session = await getServerSession(req, res, authOptions);
  let isMobile = (req ? req.headers['user-agent'] : navigator.userAgent)?.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session, isMobile },
  };
}

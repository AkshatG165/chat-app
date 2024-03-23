import Head from 'next/head';
import Home from '../components/Home';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="chat with all your friends" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Home />
      </main>
    </>
  );
}

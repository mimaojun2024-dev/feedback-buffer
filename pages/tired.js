import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function TiredRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tired/care');
  }, [router]);

  return (
    <>
      <Head>
        <title>我只是累了</title>
      </Head>
      <main className="shell">
        <section className="panel">
          <div className="stack phaseCard">
            <p className="body">正在进入照顾自己的方式。</p>
          </div>
        </section>
      </main>
    </>
  );
}

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MainAxisRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/axis/today');
  }, [router]);

  return (
    <>
      <Head>
        <title>主轴</title>
      </Head>
      <main className="shell">
        <section className="panel">
          <div className="stack phaseCard">
            <p className="body">正在回到今天最重要的事。</p>
          </div>
        </section>
      </main>
    </>
  );
}

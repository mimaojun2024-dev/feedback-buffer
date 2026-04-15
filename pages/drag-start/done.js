import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import HomeShortcut from '../../components/HomeShortcut';
import { incrementStoredFlowStat } from '../../lib/buffer';

export default function DragStartDonePage({ initialTask = '' }) {
  const hasTrackedCompletionRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedCompletionRef.current) {
      hasTrackedCompletionRef.current = true;
      incrementStoredFlowStat('drag-start.completed');
    }
  }, []);

  return (
    <>
      <Head>
        <title>这 2 分钟已经算数</title>
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">两分钟到了</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">这 2 分钟</span>
              <span className="titleLine accentLine">已经算数</span>
            </h1>
            <p className="body">
              你已经不是完全没启动了。哪怕只是碰上去一点点，也已经比刚才更靠近事情本身。
            </p>
            {initialTask ? (
              <section className="focusSummary compactSummary" aria-label="刚才做的事情">
                <p className="focusLabel">你刚才碰的是</p>
                <p className="focusTask">{initialTask}</p>
              </section>
            ) : null}
          </div>

          <div className="screenBottom buttonGroup">
            <Link
              href={{
                pathname: '/drag-start/countdown',
                query: initialTask ? { task: initialTask } : undefined
              }}
              className="primaryButton buttonLink"
            >
              再做 2 分钟
            </Link>
            <Link href="/" className="secondaryButton buttonLink">
              回到主页
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const rawTask =
    typeof context.query.task === 'string' ? context.query.task : '';
  const initialTask = rawTask.replace(/\s+/g, ' ').trim();

  return {
    props: {
      initialTask
    }
  };
}

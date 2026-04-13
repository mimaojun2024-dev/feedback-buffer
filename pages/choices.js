import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import HomeShortcut from '../components/HomeShortcut';
import {
  COUNTDOWN_SECONDS,
  getStoredCount,
  incrementStoredFlowStat,
  getStoredPriorityTask,
  setStoredPriorityTask,
  XIAOHONGSHU_URL
} from '../lib/buffer';

export default function ChoicesPage({ initialTask = '' }) {
  const [dailyCount, setDailyCount] = useState(0);
  const [priorityTask, setPriorityTask] = useState(initialTask);

  useEffect(() => {
    setDailyCount(getStoredCount());
    const storedTask = getStoredPriorityTask();
    const resolvedTask = initialTask ? setStoredPriorityTask(initialTask) : storedTask;

    setPriorityTask(resolvedTask);
  }, [initialTask]);

  return (
    <>
      <Head>
        <title>Feedback Buffer</title>
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Feedback Buffer</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">今天已缓冲 {dailyCount} 次</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">{COUNTDOWN_SECONDS} 秒到了</span>
              <span className="titleLine accentLine">现在再决定</span>
            </h1>
            <p className="body">
              如果现在还是要去看，就带着清醒去看；如果没那么急，也算把注意力拿回来了一点。
            </p>
            {priorityTask ? (
              <section className="focusSummary compactSummary" aria-label="当前最重要的事情">
                <p className="focusLabel">你刚才想守住的是</p>
                <p className="focusTask">{priorityTask}</p>
              </section>
            ) : null}
          </div>

          <div className="screenBottom buttonGroup">
            <a
              className="primaryButton buttonLink"
              href={XIAOHONGSHU_URL}
              onClick={() => incrementStoredFlowStat('escape.checked-feedback')}
            >
              我还是想去看
            </a>
            <Link
              href="/escape?focus=1"
              className="secondaryButton buttonLink"
              onClick={() => incrementStoredFlowStat('escape.returned-focus')}
            >
              先回去做 5 分钟
            </Link>
            <Link href="/escape?edit=1&next=choices" className="textLink">
              修改这件事
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

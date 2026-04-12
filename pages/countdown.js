import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import {
  COUNTDOWN_SECONDS,
  getStoredPriorityTask,
  getStoredCount,
  incrementStoredCount,
  setStoredPriorityTask
} from '../lib/buffer';

export default function CountdownPage({ initialTask = '' }) {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS);
  const [progressPercent, setProgressPercent] = useState(100);
  const [dailyCount, setDailyCount] = useState(0);
  const [priorityTask, setPriorityTask] = useState(initialTask);
  const deadlineRef = useRef(null);
  const hasIncrementedCountRef = useRef(false);

  useEffect(() => {
    const storedTask = getStoredPriorityTask();
    const resolvedTask = initialTask ? setStoredPriorityTask(initialTask) : storedTask;

    if (!resolvedTask) {
      router.replace('/?edit=1');
      return undefined;
    }

    setPriorityTask(resolvedTask);
    setRemainingSeconds(COUNTDOWN_SECONDS);
    setProgressPercent(100);

    if (!hasIncrementedCountRef.current) {
      hasIncrementedCountRef.current = true;
      const nextCount = incrementStoredCount();
      setDailyCount(nextCount || getStoredCount());
    } else {
      setDailyCount(getStoredCount());
    }

    deadlineRef.current = Date.now() + COUNTDOWN_SECONDS * 1000;

    function tick() {
      const millisecondsLeft = Math.max(0, deadlineRef.current - Date.now());
      const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
      const nextProgress = (millisecondsLeft / (COUNTDOWN_SECONDS * 1000)) * 100;

      setRemainingSeconds(nextSeconds);
      setProgressPercent(nextProgress);

      if (nextSeconds === 0) {
        window.clearInterval(intervalId);
        router.replace({
          pathname: '/choices',
          query: { task: resolvedTask }
        });
      }
    }

    const intervalId = window.setInterval(() => {
      tick();
    }, 100);

    tick();

    return () => window.clearInterval(intervalId);
  }, [initialTask, router]);

  return (
    <>
      <Head>
        <title>Feedback Buffer</title>
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Feedback Buffer</p>
            <p className="counter counterBadge">今天已缓冲 {dailyCount} 次</p>
          </div>

          <div className="stack phaseCard timerStage">
            <p className="stageLabel">先稳一下</p>
            <section className="focusCenter" aria-label="当前最重要的事情">
              <p className="focusLabel centerLabel">我当前最重要的事情是</p>
              <p className="focusTask focusCenterTask">{priorityTask}</p>
            </section>
            <h1 className="timer" aria-live="polite">
              {remainingSeconds}
            </h1>
            <p className="timerLabel">秒</p>
            <div className="progressTrack" aria-hidden="true">
              <span
                className="progressBar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="body timerBody">
              你不是不能看，只是在给大脑一点缓冲。等这 23 秒过去，再决定也不迟。
            </p>
          </div>

          <div className="screenBottom">
            <Link href="/?edit=1&next=countdown" className="textLink">
              修改当前最重要的事
            </Link>
            <p className="microCopy">如果数字没动，页面也会在 23 秒后自动进入下一步。</p>
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

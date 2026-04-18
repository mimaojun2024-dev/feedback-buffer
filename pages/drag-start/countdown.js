import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import HomeShortcut from '../../components/HomeShortcut';
import {
  START_COUNTDOWN_SECONDS,
  getStoredStartTask,
  incrementStoredFlowStat,
  setStoredStartTask
} from '../../lib/buffer';

function formatRemainingTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${`${seconds}`.padStart(2, '0')}`;
}

export default function DragStartCountdownPage({ initialTask = '' }) {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(START_COUNTDOWN_SECONDS);
  const [progressPercent, setProgressPercent] = useState(100);
  const [startTask, setStartTask] = useState(initialTask);
  const deadlineRef = useRef(null);
  const hasTrackedStartRef = useRef(false);

  useEffect(() => {
    const storedTask = getStoredStartTask();
    const resolvedTask = initialTask ? setStoredStartTask(initialTask) : storedTask;

    if (!resolvedTask) {
      router.replace('/drag-start?edit=1');
      return undefined;
    }

    setStartTask(resolvedTask);
    setRemainingSeconds(START_COUNTDOWN_SECONDS);
    setProgressPercent(100);
    deadlineRef.current = Date.now() + START_COUNTDOWN_SECONDS * 1000;

    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      incrementStoredFlowStat('drag-start.started');
    }

    function tick() {
      const millisecondsLeft = Math.max(0, deadlineRef.current - Date.now());
      const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
      const nextProgress = (millisecondsLeft / (START_COUNTDOWN_SECONDS * 1000)) * 100;

      setRemainingSeconds(nextSeconds);
      setProgressPercent(nextProgress);

      if (nextSeconds === 0) {
        window.clearInterval(intervalId);
        router.replace({
          pathname: '/drag-start/done',
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
        <title>只做两分钟</title>
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">只做这两分钟</p>
            </div>
          </div>

          <div className="stack phaseCard timerStage">
            <p className="stageLabel">现在不要想太多</p>
            <section className="focusCenter" aria-label="当前应该做什么">
              <p className="focusLabel centerLabel">我现在要做的是</p>
              <p className="focusTask focusCenterTask">{startTask}</p>
            </section>
            <h1 className="timer timerWide" aria-live="polite">
              {formatRemainingTime(remainingSeconds)}
            </h1>
            <p className="timerLabel">只做两分钟</p>
            <div className="progressTrack" aria-hidden="true">
              <span
                className="progressBar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="body timerBody">
              不用解决全部。只要把这两分钟交给眼前这件事，让自己先真正碰上去。
            </p>
          </div>

          <div className="screenBottom">
            <Link href="/drag-start?edit=1" className="textLink">
              重写这一步
            </Link>
            <p className="microCopy">
              就算只推进了一点点，这两分钟也已经算数。
            </p>
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

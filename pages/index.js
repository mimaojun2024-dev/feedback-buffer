import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  COUNTDOWN_SECONDS,
  getStoredCount,
  getStoredPriorityTask,
  setStoredPriorityTask
} from '../lib/buffer';

export default function HomePage() {
  const router = useRouter();
  const [dailyCount, setDailyCount] = useState(0);
  const [showReturnMessage, setShowReturnMessage] = useState(false);
  const [priorityTask, setPriorityTask] = useState('');
  const [draftTask, setDraftTask] = useState('');
  const [isEditingTask, setIsEditingTask] = useState(true);
  const [nextPath, setNextPath] = useState('');

  useEffect(() => {
    setDailyCount(getStoredCount());
    const storedTask = getStoredPriorityTask();
    const searchParams = new URLSearchParams(window.location.search);
    const isEditMode = searchParams.get('edit') === '1';
    const requestedNextPath = searchParams.get('next') || '';

    setPriorityTask(storedTask);
    setDraftTask(storedTask);
    setShowReturnMessage(searchParams.get('focus') === '1');
    setIsEditingTask(!storedTask || isEditMode);
    setNextPath(requestedNextPath);
  }, []);

  function handleTaskSubmit(event) {
    const nextTask = setStoredPriorityTask(draftTask);
    if (!nextTask) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setPriorityTask(nextTask);
    setDraftTask(nextTask);
    setIsEditingTask(false);

    const target = !priorityTask
      ? '/countdown'
      : nextPath === 'countdown'
        ? '/countdown'
        : nextPath === 'choices'
          ? '/choices'
          : '/';

    if (target === '/') {
      router.push('/');
      return;
    }

    router.push({
      pathname: target,
      query: { task: nextTask }
    });
  }

  const submitTarget = !priorityTask
    ? '/countdown'
    : nextPath === 'countdown'
      ? '/countdown'
      : nextPath === 'choices'
        ? '/choices'
        : '/';

  return (
    <>
      <Head>
        <meta property="og:title" content="Feedback Buffer" />
        <meta
          property="og:description"
          content="Wait twenty-three quiet seconds before checking feedback."
        />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Feedback Buffer</p>
            <p className="counter counterBadge">今天已缓冲 {dailyCount} 次</p>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">先别去看红点</span>
              <span className="titleLine accentLine">先稳 23 秒</span>
            </h1>
            <p className="body">
              你不是要永远不看，只是先给自己留一小段缓冲，再决定要不要过去。
            </p>
            {isEditingTask ? (
              <form
                className="taskEditor"
                action={submitTarget}
                method="get"
                onSubmit={handleTaskSubmit}
              >
                <label className="taskLabel" htmlFor="priorityTask">
                  我当前最重要的事情是
                </label>
                <textarea
                  id="priorityTask"
                  name="task"
                  className="taskInput"
                  rows="3"
                  value={draftTask}
                  onChange={(event) => setDraftTask(event.target.value)}
                  placeholder="比如：先把今天最关键的那件事往前推进一点"
                />
                <button type="submit" className="taskSubmitButton">
                  记住这件事
                </button>
              </form>
            ) : (
              <section className="focusSummary" aria-label="当前最重要的事情">
                <div className="focusHeader">
                  <p className="focusLabel">我当前最重要的事情是</p>
                  <button
                    type="button"
                    className="textButton"
                    onClick={() => setIsEditingTask(true)}
                  >
                    修改
                  </button>
                </div>
                <p className="focusTask">{priorityTask}</p>
              </section>
            )}
          </div>

          <div className="screenBottom">
            {!isEditingTask && priorityTask ? (
              <Link
                href={{
                  pathname: '/countdown',
                  query: { task: priorityTask }
                }}
                passHref
              >
                <a className="primaryButton buttonLink steadyButton">
                  <span className="steadyWord">稳住</span>
                </a>
              </Link>
            ) : null}
            {showReturnMessage ? (
              <p className="note">好，先回去做 5 分钟正事。小红点可以等一会。</p>
            ) : (
              <p className="microCopy">
                {isEditingTask
                  ? '这件事会保存在当前浏览器里，之后可以随时修改。'
                  : `点下去以后，页面会直接开始 ${COUNTDOWN_SECONDS} 秒倒计时。`}
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

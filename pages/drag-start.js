import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HomeShortcut from '../components/HomeShortcut';
import {
  START_COUNTDOWN_SECONDS,
  getStoredStartTask,
  setStoredStartTask
} from '../lib/buffer';

export default function DragStartPage() {
  const router = useRouter();
  const [startTask, setStartTask] = useState('');
  const [draftTask, setDraftTask] = useState('');
  const [isEditingTask, setIsEditingTask] = useState(true);

  useEffect(() => {
    const storedTask = getStoredStartTask();
    const searchParams = new URLSearchParams(window.location.search);
    const isEditMode = searchParams.get('edit') === '1';

    setStartTask(storedTask);
    setDraftTask(storedTask);
    setIsEditingTask(!storedTask || isEditMode);
  }, []);

  function handleTaskSubmit(event) {
    const nextTask = setStoredStartTask(draftTask);
    if (!nextTask) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setStartTask(nextTask);
    setDraftTask(nextTask);
    setIsEditingTask(false);

    router.push({
      pathname: '/drag-start/countdown',
      query: { task: nextTask }
    });
  }

  return (
    <>
      <Head>
        <title>我不想启动</title>
        <meta property="og:title" content="我不想启动" />
        <meta
          name="description"
          content="先把眼前这两分钟该做什么写下来，然后只做这两分钟。"
        />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">不想启动</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">我应该做什么</span>
              <span className="titleLine accentLine">只写眼前这一步</span>
            </h1>
            <p className="body">
              先不要想整件事。只写下你现在真正应该碰的那一件事，然后给它两分钟。
            </p>
            {isEditingTask ? (
              <form
                className="taskEditor"
                action="/drag-start/countdown"
                method="get"
                onSubmit={handleTaskSubmit}
              >
                <label className="taskLabel" htmlFor="startTask">
                  我现在要做的是
                </label>
                <textarea
                  id="startTask"
                  name="task"
                  className="taskInput"
                  rows="3"
                  value={draftTask}
                  onChange={(event) => setDraftTask(event.target.value)}
                  placeholder="比如：先把文档打开，写下第一段提纲"
                />
                <button type="submit" className="taskSubmitButton">
                  只做 2 分钟
                </button>
              </form>
            ) : (
              <section className="focusSummary" aria-label="当前应该做什么">
                <div className="focusHeader">
                  <p className="focusLabel">我现在要做的是</p>
                  <button
                    type="button"
                    className="textButton"
                    onClick={() => setIsEditingTask(true)}
                  >
                    修改
                  </button>
                </div>
                <p className="focusTask">{startTask}</p>
              </section>
            )}
          </div>

          <div className="screenBottom">
            {!isEditingTask && startTask ? (
              <Link
                href={{
                  pathname: '/drag-start/countdown',
                  query: { task: startTask }
                }}
                className="primaryButton buttonLink steadyButton"
              >
                <span className="steadyWord">开始这 2 分钟</span>
              </Link>
            ) : null}
            <p className="microCopy">
              你不用马上进入很厉害的状态。只要把这 2 分钟借给眼前这件事。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

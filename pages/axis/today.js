import Head from 'next/head';
import { useEffect, useState } from 'react';
import AxisRail from '../../components/AxisRail';
import HomeShortcut from '../../components/HomeShortcut';
import {
  getStoredMainAxisSection,
  getStoredMonthlyDailyCheckins,
  setStoredMainAxisSection
} from '../../lib/buffer';

const EMPTY_TODAY = {
  task: ''
};
const COMPLETION_LIMIT = 15;

function formatTime(value) {
  if (!value) {
    return '未记录';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '未记录';
  }

  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function formatDate(dateKey) {
  const [, month, day] = dateKey.split('-');
  return `${month}.${day}`;
}

export default function TodayAxisPage() {
  const [today, setToday] = useState(EMPTY_TODAY);
  const [recentCompletions, setRecentCompletions] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const storedToday = getStoredMainAxisSection('today');
    const safeToday = storedToday && typeof storedToday === 'object' ? storedToday : EMPTY_TODAY;
    const submittedCompletions = getStoredMonthlyDailyCheckins()
      .filter((entry) => entry.completedThing)
      .slice(0, COMPLETION_LIMIT);

    setToday(safeToday);
    setRecentCompletions(submittedCompletions);
    setIsEditing(!safeToday.task);
    setHasLoaded(true);
  }, []);

  function handleChange(field, value) {
    setToday((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextAxis = setStoredMainAxisSection('today', today);
    setToday(nextAxis.today);
    setIsEditing(false);
  }

  return (
    <>
      <Head>
        <title>今天最重要的事</title>
        <meta property="og:title" content="今天最重要的事" />
        <meta name="description" content="把今天真正要落地的一件事钉住。" />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Main Axis</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">今天</p>
            </div>
          </div>

          <div className="stack phaseCard axisStack">
            <AxisRail currentLevel="today" />
            <h1 className="title axisTitle">
              <span className="titleLine">今天最重要的事</span>
              <span className="titleLine accentLine">定义现实动作</span>
            </h1>
            <p className="body axisMeta">只保留一件最主要的事。今天先把现实动作钉住。</p>

            {isEditing ? (
              <form className="taskEditor axisEditor" onSubmit={handleSubmit}>
                <label className="axisField">
                  <span className="taskLabel">最主要的任务</span>
                  <textarea
                    className="taskInput axisInput"
                    rows="3"
                    value={today.task}
                    onChange={(event) => handleChange('task', event.target.value)}
                    placeholder="写下今天最重要的那件事"
                  />
                </label>
                <button type="submit" className="taskSubmitButton">
                  保存今天这件事
                </button>
              </form>
            ) : (
              <section className="axisSummaryItem axisTodayCard" aria-label="今天的主轴">
                <p className="axisSummaryIndex">今天最重要的事</p>
                <p className="axisSummaryTask">{today.task}</p>
              </section>
            )}

            <section className="monthDoneList" aria-label="提交的每天完成">
              <div className="monthDoneListTop">
                <p className="stageLabel">提交的每天完成</p>
                <p className="completionLimitHint">最多保留 15 条</p>
              </div>
              {recentCompletions.length ? (
                <div className="monthDoneRows">
                  {recentCompletions.map((entry) => (
                    <article key={entry.dateKey} className="monthDoneRow">
                      <p className="monthDoneDate">{formatDate(entry.dateKey)}</p>
                      <div className="monthDoneRowBody">
                        <p className="monthDoneThing">{entry.completedThing}</p>
                        <p className="monthDoneTimes">
                          开始 {formatTime(entry.startedAt)} / 收束 {formatTime(entry.endedAt)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <article className="monthDoneEmpty">
                  还没有提交过每天完成。
                </article>
              )}
            </section>
          </div>

          <div className="screenBottom buttonGroup">
            {hasLoaded && !isEditing ? (
              <button type="button" className="textButton axisEditButton" onClick={() => setIsEditing(true)}>
                修改今天这件事
              </button>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}

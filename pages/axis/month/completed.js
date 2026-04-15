import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AxisRail from '../../../components/AxisRail';
import HomeShortcut from '../../../components/HomeShortcut';
import {
  getStoredDailyCheckinForToday,
  getStoredMonthlyDailyCheckins,
  setStoredDailyCheckinCompletion
} from '../../../lib/buffer';

const EMPTY_DAILY_CHECKIN = {
  startedAt: '',
  endedAt: '',
  completedThing: ''
};

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

export default function MonthCompletedPage() {
  const [todayCheckin, setTodayCheckin] = useState(EMPTY_DAILY_CHECKIN);
  const [completedThing, setCompletedThing] = useState('');
  const [monthEntries, setMonthEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const storedToday = getStoredDailyCheckinForToday();

    setTodayCheckin(storedToday);
    setCompletedThing(storedToday.completedThing);
    setMonthEntries(getStoredMonthlyDailyCheckins());
    setIsEditing(!storedToday.completedThing);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const nextCheckin = setStoredDailyCheckinCompletion(completedThing);

    setTodayCheckin(nextCheckin);
    setCompletedThing(nextCheckin.completedThing);
    setMonthEntries(getStoredMonthlyDailyCheckins());
    setIsEditing(false);
  }

  const canSave = completedThing.replace(/\s+/g, ' ').trim().length > 0;
  const monthLabel = useMemo(() => `${new Date().getMonth() + 1} 月完成记录`, []);

  return (
    <>
      <Head>
        <title>这个月完成的事情</title>
        <meta property="og:title" content="这个月完成的事情" />
        <meta name="description" content="保存每天开始、收束和真正完成的事情。" />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Month Log</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">月度</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <AxisRail currentLevel="month" />
            <h1 className="title axisTitle">
              <span className="titleLine">这个月完成的事情</span>
              <span className="titleLine accentLine">和月度计划对齐</span>
            </h1>
            <p className="body axisMeta">把今天真正落地的事保存下来，月底回看会更清楚。</p>

            <section className="monthDoneStampGrid" aria-label="今天时间戳">
              <article className="stateSubstat monthDoneStamp">
                <p className="stateSubstatLabel">开始</p>
                <p className="stateSubstatValue">{formatTime(todayCheckin.startedAt)}</p>
              </article>
              <article className="stateSubstat monthDoneStamp">
                <p className="stateSubstatLabel">收束</p>
                <p className="stateSubstatValue">{formatTime(todayCheckin.endedAt)}</p>
              </article>
            </section>

            {isEditing ? (
              <form className="taskEditor axisEditor" onSubmit={handleSubmit}>
                <label className="axisField">
                  <span className="taskLabel">今天真正完成的事</span>
                  <textarea
                    className="taskInput axisInput"
                    rows="3"
                    value={completedThing}
                    onChange={(event) => setCompletedThing(event.target.value)}
                    placeholder="写下今天最重要的完成"
                  />
                </label>
                <button type="submit" className="taskSubmitButton" disabled={!canSave}>
                  保存完成事项
                </button>
              </form>
            ) : (
              <section className="axisSummaryItem axisTodayCard" aria-label="今天完成的事">
                <p className="axisSummaryIndex">今天完成</p>
                <p className="axisSummaryTask">{todayCheckin.completedThing}</p>
              </section>
            )}

            <section className="monthDoneList" aria-label={monthLabel}>
              <div className="monthDoneListTop">
                <p className="stageLabel">{monthLabel}</p>
                <Link href="/axis/month" className="textLink monthPlanLink">
                  查看月度计划
                </Link>
              </div>
              {monthEntries.length ? (
                <div className="monthDoneRows">
                  {monthEntries.map((entry) => (
                    <article key={entry.dateKey} className="monthDoneRow">
                      <p className="monthDoneDate">{formatDate(entry.dateKey)}</p>
                      <div className="monthDoneRowBody">
                        <p className="monthDoneThing">{entry.completedThing || '还没写完成事项'}</p>
                        <p className="monthDoneTimes">
                          开始 {formatTime(entry.startedAt)} / 收束 {formatTime(entry.endedAt)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <article className="monthDoneEmpty">
                  这个月还没有记录。
                </article>
              )}
            </section>
          </div>

          <div className="screenBottom buttonGroup">
            {!isEditing ? (
              <button type="button" className="textButton axisEditButton" onClick={() => setIsEditing(true)}>
                修改今天完成的事
              </button>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}

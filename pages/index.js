import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  getStoredDailyCheckinForToday,
  getStoredMainAxisSection,
  incrementStoredStateClick,
  isDailyEndWindowOpen,
  isDailyStartWindowOpen,
  setStoredDailyCheckinEvent,
  setStoredMainAxisSection
} from '../lib/buffer';
import { LOW_QUALITY_STATES } from '../lib/states';

const EMPTY_DAILY_CHECKIN = {
  startedAt: '',
  endedAt: '',
  completedThing: ''
};

function formatCheckinTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export default function HomePage() {
  const router = useRouter();
  const [dailyCheckin, setDailyCheckin] = useState(EMPTY_DAILY_CHECKIN);
  const [todayAxisTask, setTodayAxisTask] = useState('');
  const [todayAxisDraft, setTodayAxisDraft] = useState('');
  const [canStartToday, setCanStartToday] = useState(false);
  const [canEndToday, setCanEndToday] = useState(false);
  const [hasLoadedDailyCheckin, setHasLoadedDailyCheckin] = useState(false);
  const [clockNow, setClockNow] = useState(null);
  const [isTodayAxisFocused, setIsTodayAxisFocused] = useState(false);

  const hasStartedToday = Boolean(dailyCheckin.startedAt);
  const hasEndedToday = Boolean(dailyCheckin.endedAt);
  const startMeta = hasStartedToday
    ? `已开始 ${formatCheckinTime(dailyCheckin.startedAt)}`
    : canStartToday
      ? '对齐今天最重要的事'
      : '06:00 后可开始';
  const endMeta = hasEndedToday
    ? `已收束 ${formatCheckinTime(dailyCheckin.endedAt)}`
    : canEndToday
      ? `可收束 ${formatCheckinTime(clockNow)}`
      : '18:30 后可收束';
  const canSaveTodayAxis = todayAxisDraft.replace(/\s+/g, ' ').trim().length > 0;

  useEffect(() => {
    function refreshDailyCheckin() {
      const now = new Date();
      const nextTodayTask = getStoredMainAxisSection('today')?.task || '';

      setDailyCheckin(getStoredDailyCheckinForToday());
      setTodayAxisTask(nextTodayTask);
      if (!isTodayAxisFocused) {
        setTodayAxisDraft(nextTodayTask);
      }
      setCanStartToday(isDailyStartWindowOpen(now));
      setCanEndToday(isDailyEndWindowOpen(now));
      setClockNow(now);
      setHasLoadedDailyCheckin(true);
    }

    refreshDailyCheckin();
    const intervalId = window.setInterval(refreshDailyCheckin, 30 * 1000);

    return () => window.clearInterval(intervalId);
  }, [isTodayAxisFocused]);

  function handleStartToday() {
    if (!canStartToday || hasStartedToday) {
      return;
    }

    setDailyCheckin(setStoredDailyCheckinEvent('start'));
    router.push('/axis/today');
  }

  function handleEndToday() {
    if (!canEndToday || hasEndedToday) {
      return;
    }

    setDailyCheckin(setStoredDailyCheckinEvent('end'));
    router.push('/axis/month/completed');
  }

  function handleHomeTodaySubmit(event) {
    event.preventDefault();

    if (!canSaveTodayAxis) {
      return;
    }

    const nextAxis = setStoredMainAxisSection('today', { task: todayAxisDraft });
    const nextTask = nextAxis.today?.task || '';

    setTodayAxisTask(nextTask);
    setTodayAxisDraft(nextTask);
    setIsTodayAxisFocused(false);
  }

  return (
    <>
      <Head>
        <title>稳稳接住自己</title>
        <meta property="og:title" content="稳稳接住自己" />
        <meta
          name="description"
          content="先把模糊的低质量状态命名出来，再决定要怎么回去。"
        />
        <meta
          property="og:description"
          content="先把模糊的低质量状态命名出来，再决定要怎么回去。"
        />
      </Head>

      <main className="shell">
        <section className="panel launcherPanel homePanel">
          <div className="screenTop homeTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions homeTopActions">
              <Link href="/stats" className="counter counterBadge buttonLink pillLink homeTopActionLink">
                查看命名
              </Link>
              <Link href="/axis/month/completed" className="counter counterBadge buttonLink pillLink homeTopActionLink">
                月度完成日志
              </Link>
            </div>
          </div>

          <div className="stack phaseCard launcherStack homeHeroStack">
            <section className="launcherIntro homeHeroIntro">
              <h1 className="title launcherTitle homeTitle">
                <span className="titleLine">稳稳接住自己</span>
              </h1>
              <p className="body launcherBody homeBody">
                先给现在一个名字。
              </p>
            </section>

            <section className="stateList homeStateList" aria-label="低质量状态列表">
              {LOW_QUALITY_STATES.map((state) => (
                <Link
                  key={state.id}
                  href={state.href}
                  className="stateCard stateCardActive"
                  onClick={() => incrementStoredStateClick(state.id)}
                >
                  <h2 className="stateTitle homeStateLabel">{state.name}</h2>
                  <p className="stateDescription homeStateDescription">{state.description}</p>
                </Link>
              ))}
            </section>
          </div>

          <div className="screenBottom homeScreenBottom">
            <Link href="/axis/today" className="textLink homeAxisLink">
              今天最重要的事是什么？
            </Link>
            {todayAxisTask ? (
              <Link href="/axis/today" className="homeTodayAnchor">
                <span className="homeTodayAnchorLabel">今日主轴</span>
                <span className="homeTodayAnchorTask">{todayAxisTask}</span>
              </Link>
            ) : (
              <section className="homeTodayPanel homeTodayPanelEmpty" aria-label="填写今日主轴">
                <p className="homeTodayAnchorLabel">今日主轴</p>
                <form className="homeTodayForm" onSubmit={handleHomeTodaySubmit}>
                  <textarea
                    className="taskInput homeTodayInput"
                    rows="2"
                    value={todayAxisDraft}
                    onChange={(event) => setTodayAxisDraft(event.target.value)}
                    onFocus={() => setIsTodayAxisFocused(true)}
                    onBlur={() => setIsTodayAxisFocused(false)}
                    placeholder="写下今天最重要的事"
                  />
                  <button type="submit" className="taskSubmitButton homeTodaySubmit" disabled={!canSaveTodayAxis}>
                    写下今天这件事
                  </button>
                </form>
              </section>
            )}
            <section className="dailyCheckPanel" aria-label="每日打卡">
              <button
                type="button"
                className={`dailyCheckButton${hasStartedToday ? ' dailyCheckButtonDone' : ''}${!canStartToday && !hasStartedToday ? ' dailyCheckButtonLocked' : ''}`}
                disabled={!hasLoadedDailyCheckin || !canStartToday || hasStartedToday}
                onClick={handleStartToday}
              >
                <span className="dailyCheckLabel">开始今天</span>
                <span className="dailyCheckMeta">{startMeta}</span>
              </button>
              <button
                type="button"
                className={`dailyCheckButton${hasEndedToday ? ' dailyCheckButtonDone' : ''}${!canEndToday && !hasEndedToday ? ' dailyCheckButtonLocked' : ''}`}
                disabled={!hasLoadedDailyCheckin || !canEndToday || hasEndedToday}
                onClick={handleEndToday}
              >
                <span className="dailyCheckLabel">收束今天</span>
                <span className="dailyCheckMeta">{endMeta}</span>
              </button>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import HomeShortcut from '../../components/HomeShortcut';

const EMOTION_OPTIONS = [
  '我开始否定自己',
  '我什么都不想做了',
  '我会一直反复想这件事'
];

export default function EmotionAmplitudePage() {
  const router = useRouter();
  const [trigger, setTrigger] = useState('');

  function handleSelect() {
    router.push('/state/emotion-amplitude/steady');
  }

  return (
    <>
      <Head>
        <title>我有点 down</title>
        <meta property="og:title" content="我有点 down" />
        <meta
          name="description"
          content="先认一下是什么戳到你了，再走到一个更轻的承接里。"
        />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">情绪振幅</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">是什么戳到你了？</span>
            </h1>

            <form className="taskEditor" onSubmit={(event) => event.preventDefault()}>
              <textarea
                className="taskInput"
                rows="4"
                value={trigger}
                onChange={(event) => setTrigger(event.target.value)}
                placeholder="写下刚才戳到你的那一下"
              />
            </form>

            <section className="choiceList" aria-label="情绪触发后的状态">
              {EMOTION_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="choiceCard"
                  onClick={handleSelect}
                >
                  <p className="choiceLabel">{option}</p>
                </button>
              ))}
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

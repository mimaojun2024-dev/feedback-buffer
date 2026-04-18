import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import HomeShortcut from '../../components/HomeShortcut';
import { incrementStoredFlowStat } from '../../lib/buffer';

export default function DragStartCheckPage() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState('');

  function handleSelect(answer) {
    setSelectedAnswer(answer);
    incrementStoredFlowStat(`drag-start.check.${answer}`);

    if (answer === 'yes') {
      router.push('/drag-start');
    }
  }

  return (
    <>
      <Head>
        <title>我不想启动</title>
        <meta property="og:title" content="我不想启动" />
        <meta
          name="description"
          content="先别问整件事，只问自己两分钟能不能借出来。"
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
              <span className="titleLine">只做两分钟</span>
              <span className="titleLine accentLine">可以吗</span>
            </h1>
            <p className="body">先不谈宏大目标。只问眼前这两分钟，能不能借给第一步。</p>

            <section className="choiceList" aria-label="启动判断">
              <button
                type="button"
                className={`choiceCard${selectedAnswer === 'yes' ? ' choiceCardSelected' : ''}`}
                onClick={() => handleSelect('yes')}
              >
                <p className="choiceLabel">可以</p>
                <p className="choiceHint">那就只压到第一步，先碰上去。</p>
              </button>
              <button
                type="button"
                className={`choiceCard${selectedAnswer === 'no' ? ' choiceCardSelected' : ''}`}
                onClick={() => handleSelect('no')}
              >
                <p className="choiceLabel">不可以</p>
                <p className="choiceHint">那今天先别逼太狠，先退一步也可以。</p>
              </button>
            </section>
          </div>

          <div className="screenBottom buttonGroup">
            {selectedAnswer === 'no' ? (
              <Link href="/" className="secondaryButton buttonLink">
                先回主页
              </Link>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}

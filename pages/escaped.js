import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import HomeShortcut from '../components/HomeShortcut';
import { incrementStoredFlowStat } from '../lib/buffer';

const ESCAPED_ACTIONS = [
  {
    id: 'stand-up',
    label: '站起来',
    hint: '先把身体从逃开的姿势里拉回来。'
  },
  {
    id: 'drink-water',
    label: '喝一口水',
    hint: '先让自己停一下，不继续往外滑。'
  },
  {
    id: 'back-to-desktop',
    label: '回到桌面',
    hint: '先把注意力带回眼前这个界面。'
  }
];

export default function EscapedPage() {
  const [selectedAction, setSelectedAction] = useState(null);

  function handleSelect(action) {
    setSelectedAction(action);
    incrementStoredFlowStat(`escaped.${action.id}`);
  }

  return (
    <>
      <Head>
        <title>我逃开了</title>
        <meta property="og:title" content="我逃开了" />
        <meta
          name="description"
          content="先别追究为什么，先把自己重新接回来。"
        />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">重新接管</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">我逃开了</span>
            </h1>
            <p className="body">先别讲太多道理。现在只做一个很小的拉回动作。</p>

            <section className="choiceList" aria-label="拉回动作">
              {ESCAPED_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={`choiceCard${selectedAction?.id === action.id ? ' choiceCardSelected' : ''}`}
                  onClick={() => handleSelect(action)}
                >
                  <p className="choiceLabel">{action.label}</p>
                  <p className="choiceHint">{action.hint}</p>
                </button>
              ))}
            </section>
          </div>

          <div className="screenBottom buttonGroup">
            {selectedAction ? (
              <>
                <p className="microCopy">就先做这一下，然后回到主页。</p>
                <Link href="/" className="primaryButton buttonLink">
                  好，回主页
                </Link>
              </>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}

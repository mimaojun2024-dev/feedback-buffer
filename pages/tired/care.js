import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeShortcut from '../../components/HomeShortcut';
import {
  getStoredTiredOptionClicks,
  incrementStoredTiredOptionClick
} from '../../lib/buffer';
import { TIRED_OPTIONS } from '../../lib/tired-options';

export default function TiredCarePage() {
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [optionClicks, setOptionClicks] = useState({});

  useEffect(() => {
    setOptionClicks(getStoredTiredOptionClicks());
  }, []);

  const selectedOption = TIRED_OPTIONS.find((option) => option.id === selectedOptionId) || null;

  function handleOptionClick(optionId) {
    incrementStoredTiredOptionClick(optionId);
    setSelectedOptionId(optionId);
    setOptionClicks((current) => ({
      ...current,
      [optionId]: (current[optionId] || 0) + 1
    }));
  }

  return (
    <>
      <Head>
        <title>累了时怎么照顾自己</title>
        <meta property="og:title" content="累了时怎么照顾自己" />
        <meta
          name="description"
          content="保存适合自己的恢复方式，累的时候直接选一个先做。"
        />
      </Head>

      <main className="shell">
        <section className="panel launcherPanel">
          <div className="screenTop">
            <div className="launcherTop">
              <p className="eyebrow">Care List</p>
              <p className="launcherKicker">先恢复，不急着逼自己</p>
            </div>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">能量见底</p>
            </div>
          </div>

          <div className="stack phaseCard launcherStack">
            <section className="launcherIntro">
              <h1 className="title launcherTitle">
                <span className="titleLine">累了时怎么照顾自己</span>
              </h1>
              <p className="body launcherBodyMulti">
                先选一个恢复动作，不用顺便解决别的。把自己带回一点点就可以。
              </p>
            </section>

            <section className="optionList" aria-label="处理累了的选项">
              {TIRED_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`stateCard optionCard ${selectedOptionId === option.id ? 'optionCardSelected' : ''}`}
                  onClick={() => handleOptionClick(option.id)}
                >
                  <div className="stateCardTop">
                    <p className="stateBadge">恢复动作</p>
                    <span className="stateHint">已选 {optionClicks[option.id] || 0} 次</span>
                  </div>
                  <h2 className="stateTitle">{option.label}</h2>
                  <p className="stateDescription">{option.description}</p>
                </button>
              ))}
            </section>

            {selectedOption ? (
              <section className="summaryCard" aria-label="当前选择">
                <p className="summaryLabel">现在就先做这一件</p>
                <p className="focusTask">{selectedOption.label}</p>
                <p className="summaryBody">
                  先把这件恢复动作做掉，回来再看下一步。
                </p>
              </section>
            ) : null}
          </div>

          <div className="screenBottom buttonGroup">
            <Link href="/stats" className="textLink">
              看命名记录
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

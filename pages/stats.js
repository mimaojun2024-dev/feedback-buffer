import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HomeShortcut from '../components/HomeShortcut';
import {
  getStoredFlowStats,
  getStoredStateClicks,
  getStoredTiredOptionClicks
} from '../lib/buffer';
import { LOW_QUALITY_STATES } from '../lib/states';
import { TIRED_OPTIONS } from '../lib/tired-options';

export default function StatsPage() {
  const [stateClicks, setStateClicks] = useState({});
  const [flowStats, setFlowStats] = useState({});
  const [tiredOptionClicks, setTiredOptionClicks] = useState({});

  useEffect(() => {
    setStateClicks(getStoredStateClicks());
    setFlowStats(getStoredFlowStats());
    setTiredOptionClicks(getStoredTiredOptionClicks());
  }, []);

  const totalClicks = LOW_QUALITY_STATES.reduce(
    (sum, state) => sum + (stateClicks[state.id] || 0),
    0
  );

  const sortedTiredOptions = [...TIRED_OPTIONS]
    .map((option) => ({
      ...option,
      count: tiredOptionClicks[option.id] || 0
    }))
    .sort((left, right) => right.count - left.count);

  const topTiredOption = sortedTiredOptions[0] || null;
  const nextTiredOption = sortedTiredOptions[1] || null;
  const escapedActions = [
    {
      label: '站起来',
      count: flowStats['escaped.stand-up'] || 0
    },
    {
      label: '喝一口水',
      count: flowStats['escaped.drink-water'] || 0
    },
    {
      label: '回到桌面',
      count: flowStats['escaped.back-to-desktop'] || 0
    }
  ].sort((left, right) => right.count - left.count);
  const topEscapedAction = escapedActions[0] || null;
  const nextEscapedAction = escapedActions[1] || null;

  const stateDetails = {
    'drag-start': [
      {
        label: '已经开始',
        value: `${flowStats['drag-start.started'] || 0} 次`
      },
      {
        label: '走完 2 分钟',
        value: `${flowStats['drag-start.completed'] || 0} 次`
      }
    ],
    escape: [
      {
        label: '还是去看',
        value: `${flowStats['escape.checked-feedback'] || 0} 次`
      },
      {
        label: '先回去做',
        value: `${flowStats['escape.returned-focus'] || 0} 次`
      }
    ],
    escaped: [
      {
        label: '最常做',
        value:
          topEscapedAction && topEscapedAction.count > 0
            ? `${topEscapedAction.label} · ${topEscapedAction.count} 次`
            : '还没有'
      },
      {
        label: '其次',
        value:
          nextEscapedAction && nextEscapedAction.count > 0
            ? `${nextEscapedAction.label} · ${nextEscapedAction.count} 次`
            : '还没有'
      }
    ],
    'emotion-amplitude': [
      {
        label: '细分记录',
        value: '还没接上'
      },
      {
        label: '流程状态',
        value: '先留在这里'
      }
    ],
    'empty-dreaming': [
      {
        label: '细分记录',
        value: '还没接上'
      },
      {
        label: '流程状态',
        value: '先留在这里'
      }
    ],
    stimulation: [
      {
        label: '细分记录',
        value: '还没接上'
      },
      {
        label: '流程状态',
        value: '先留在这里'
      }
    ],
    tired: [
      {
        label: '最常选',
        value:
          topTiredOption && topTiredOption.count > 0
            ? `${topTiredOption.label} · ${topTiredOption.count} 次`
            : '还没有'
      },
      {
        label: '其次',
        value:
          nextTiredOption && nextTiredOption.count > 0
            ? `${nextTiredOption.label} · ${nextTiredOption.count} 次`
            : '还没有'
      }
    ]
  };

  return (
    <>
      <Head>
        <title>命名记录</title>
        <meta property="og:title" content="命名记录" />
        <meta
          name="description"
          content="看看自己最近最常掉进哪一种低质量状态里。"
        />
      </Head>

      <main className="shell">
        <section className="panel launcherPanel">
          <div className="screenTop">
            <div className="launcherTop">
              <p className="eyebrow">Naming Archive</p>
              <p className="launcherKicker">这些夜里，我最常掉进哪里</p>
            </div>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">已命名 {totalClicks} 次</p>
            </div>
          </div>

          <div className="stack phaseCard launcherStack">
            <section className="stateList archiveStateList" aria-label="各状态累计点击记录">
              {LOW_QUALITY_STATES.map((state) => {
                const cardContent = (
                  <>
                    <div className="stateCardTop">
                      <p className="stateBadge">{state.shortLabel}</p>
                      <span className="stateHint">累计</span>
                    </div>
                    <h2 className="stateTitle">{state.name}</h2>
                    <p className="stateCount">{stateClicks[state.id] || 0} 次</p>
                    <div className="stateSubstats" aria-label={`${state.name} 的细分记录`}>
                      {(stateDetails[state.id] || []).map((detail) => (
                        <div key={`${state.id}-${detail.label}`} className="stateSubstat">
                          <p className="stateSubstatLabel">{detail.label}</p>
                          <p className="stateSubstatValue">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );

                if (state.id === 'stimulation') {
                  return (
                    <Link key={state.id} href="/stimulation" className="stateCard archiveStateCard archiveStateCardLink">
                      {cardContent}
                    </Link>
                  );
                }

                if (state.id === 'tired') {
                  return (
                    <Link key={state.id} href="/tired/care" className="stateCard archiveStateCard archiveStateCardLink">
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <article key={state.id} className="stateCard archiveStateCard">
                    {cardContent}
                  </article>
                );
              })}
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

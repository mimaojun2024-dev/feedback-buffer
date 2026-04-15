import Head from 'next/head';
import Link from 'next/link';
import { incrementStoredStateClick } from '../lib/buffer';
import { LOW_QUALITY_STATES } from '../lib/states';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>夜的命名术</title>
        <meta property="og:title" content="夜的命名术" />
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
            <Link href="/stats" className="counter counterBadge buttonLink pillLink">
              查看记录
            </Link>
          </div>

          <div className="stack phaseCard launcherStack homeHeroStack">
            <section className="launcherIntro homeHeroIntro">
              <h1 className="title launcherTitle homeTitle">
                <span className="titleLine">夜的命名术</span>
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
                  <div className="stateCardTop">
                    <p className="stateBadge">{state.shortLabel}</p>
                    <span className="stateArrow" aria-hidden="true">
                      进入
                    </span>
                  </div>
                  <h2 className="stateTitle">{state.name}</h2>
                  <p className="stateDescription">{state.description}</p>
                  <p className="stateAction">{state.cta || '先把它认出来'}</p>
                </Link>
              ))}
            </section>
          </div>

          <div className="screenBottom homeScreenBottom">
            <Link href="/axis/today" className="textLink homeAxisLink">
              今天最重要的是什么？
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

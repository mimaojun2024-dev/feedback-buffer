import Head from 'next/head';
import Link from 'next/link';
import HomeShortcut from '../../../components/HomeShortcut';

const CALM_STEPS = [
  '时间',
  '睡眠',
  '身体动作',
  '呼吸',
  '离开刺激',
  '不再继续自我攻击',
  '有时甚至就是熬过去'
];

export default function EmotionAmplitudeSteadyPage() {
  return (
    <>
      <Head>
        <title>缓一缓，别下坠</title>
        <meta property="og:title" content="缓一缓，别下坠" />
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
              <span className="titleLine">缓一缓</span>
              <span className="titleLine accentLine">别下坠</span>
            </h1>

            <section className="emotionPauseCard" aria-label="先稳一下">
              {CALM_STEPS.map((step) => (
                <p key={step} className="emotionPauseItem">
                  {step}
                </p>
              ))}
            </section>
          </div>

          <div className="screenBottom buttonGroup emotionPauseActions">
            <Link href="/tired/care" className="secondaryButton buttonLink emotionPauseAction">
              好的，去休息
            </Link>
            <Link href="/axis/month/completed" className="secondaryButton buttonLink emotionPauseAction">
              你已经做到很多了
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

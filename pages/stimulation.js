import Head from 'next/head';
import Link from 'next/link';
import HomeShortcut from '../components/HomeShortcut';

export default function StimulationPage() {
  return (
    <>
      <Head>
        <title>我想来点刺激</title>
        <meta property="og:title" content="我想来点刺激" />
        <meta
          name="description"
          content="先给这股冲动加一个缓冲层。"
        />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">缓冲层</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">我想来点刺激</span>
              <span className="titleLine accentLine">先加一层缓冲</span>
            </h1>
            <p className="body">
              这页我先给你留成一个很轻的空页面。先别让冲动直接带着你走，后面的结构我们再慢慢长出来。
            </p>
            <section className="focusSummary compactSummary" aria-label="当前状态说明">
              <p className="focusLabel">现在先记这一句</p>
              <p className="focusTask">给这股冲动加一个缓冲层。</p>
            </section>
          </div>

          <div className="screenBottom buttonGroup">
            <Link href="/" className="secondaryButton buttonLink">
              回到主页
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

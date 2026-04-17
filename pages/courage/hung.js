import Head from 'next/head';
import Link from 'next/link';
import HomeShortcut from '../../components/HomeShortcut';

export default function CourageHungPage() {
  return (
    <>
      <Head>
        <title>你现在被结果吊住了</title>
        <meta property="og:title" content="你现在被结果吊住了" />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Courage</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <Link href="/courage/list" className="counter counterBadge buttonLink pillLink">
                顶住记录
              </Link>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">你现在是被结果</span>
              <span className="titleLine accentLine">吊住了</span>
            </h1>
            <p className="body">先别再追着看。</p>
          </div>

          <div className="screenBottom buttonGroup">
            <Link href="/" className="primaryButton buttonLink">
              先等 10 分钟
            </Link>
            <Link href="/axis/today" className="secondaryButton buttonLink">
              回到今天主任务
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

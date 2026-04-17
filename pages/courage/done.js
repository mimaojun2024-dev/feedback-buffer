import Head from 'next/head';
import Link from 'next/link';
import HomeShortcut from '../../components/HomeShortcut';

export default function CourageDonePage() {
  return (
    <>
      <Head>
        <title>已经做了这一下</title>
        <meta property="og:title" content="已经做了这一下" />
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
              <span className="titleLine">已经做了这一下</span>
            </h1>
            <p className="body">先发出去了。现在先别追着结果跑。</p>
          </div>

          <div className="screenBottom buttonGroup">
            <Link href="/escape/why" className="primaryButton buttonLink">
              我悬住了
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

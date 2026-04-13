import Head from 'next/head';
import Link from 'next/link';
import HomeShortcut from '../../components/HomeShortcut';
import { getStateById } from '../../lib/states';

export default function StatePlaceholderPage({ state }) {
  if (!state) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{state.name}</title>
        <meta property="og:title" content={state.name} />
        <meta
          name="description"
          content="这条状态线正在整理中，先把它叫出来已经很重要。"
        />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">State Launcher</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <p className="counter counterBadge">{state.shortLabel}</p>
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">{state.name}</span>
              <span className="titleLine accentLine">先认出来</span>
            </h1>
            <p className="body">
              这一条我先给你留成占位页。你已经能把这股状态叫出来了，这件事本身就很重要。后面的干预流程，我们可以再慢慢长出来。
            </p>
            <section className="focusSummary compactSummary" aria-label="当前状态说明">
              <p className="focusLabel">你现在更像是</p>
              <p className="focusTask">{state.description}</p>
            </section>
          </div>

          <div className="screenBottom buttonGroup">
            <Link href="/" className="secondaryButton buttonLink">
              回到主页
            </Link>
            <Link href="/stats" className="textLink">
              看累计记录
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const slug =
    typeof context.params.slug === 'string' ? context.params.slug : '';
  const state = getStateById(slug);

  if (!state || state.id === 'escape' || state.id === 'drag-start' || state.id === 'tired') {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {
      state
    }
  };
}

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import HomeShortcut from '../../components/HomeShortcut';
import { getStateById } from '../../lib/states';

const LIVE_STATE_IDS = new Set(['escape', 'drag-start', 'escaped', 'tired']);

export default function StatePlaceholderPage() {
  const router = useRouter();

  const slug = useMemo(
    () => (typeof router.query.slug === 'string' ? router.query.slug : ''),
    [router.query.slug]
  );
  const state = useMemo(() => getStateById(slug), [slug]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!state) {
      router.replace('/');
      return;
    }

    if (LIVE_STATE_IDS.has(state.id)) {
      router.replace(state.href);
    }
  }, [router, state]);

  if (!router.isReady) {
    return null;
  }

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
              这条线我先给你留成一个轻一点的占位页，避免测试时把整个开发服务拖住。后面的流程我们可以再慢慢长出来。
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

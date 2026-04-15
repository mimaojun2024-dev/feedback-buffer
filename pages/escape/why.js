import Head from 'next/head';
import { useRouter } from 'next/router';
import HomeShortcut from '../../components/HomeShortcut';
import { incrementStoredFlowStat } from '../../lib/buffer';
import { FEEDBACK_OPTIONS } from '../../lib/feedback-options';

export default function EscapeWhyPage() {
  const router = useRouter();

  function handleSelect(optionId) {
    incrementStoredFlowStat(`escape.reason.${optionId}`);
    router.push({
      pathname: '/escape',
      query: { reason: optionId }
    });
  }

  return (
    <>
      <Head>
        <title>我想去看反馈</title>
        <meta property="og:title" content="我想去看反馈" />
        <meta
          name="description"
          content="先认出来，你现在到底是哪一种想去看反馈。"
        />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Feedback Buffer</p>
            <div className="screenTopActions">
              <HomeShortcut />
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">我想去看反馈</span>
            </h1>
            <p className="body">先别急着点开。先认一下，你现在更像是哪一种。</p>

            <section className="choiceList" aria-label="反馈冲动选项">
              {FEEDBACK_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="choiceCard"
                  onClick={() => handleSelect(option.id)}
                >
                  <p className="choiceLabel">{option.label}</p>
                  <p className="choiceHint">{option.hint}</p>
                </button>
              ))}
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

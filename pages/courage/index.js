import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import HomeShortcut from '../../components/HomeShortcut';
import { appendStoredCourageItem } from '../../lib/buffer';

export default function CouragePage() {
  const router = useRouter();
  const [task, setTask] = useState('');

  const canSubmit = task.replace(/\s+/g, ' ').trim().length > 0;

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    appendStoredCourageItem(task);
    router.push('/courage/done');
  }

  return (
    <>
      <Head>
        <title>我需要勇气</title>
        <meta property="og:title" content="我需要勇气" />
        <meta
          name="description"
          content="写下那件需要勇气去做的事，然后先做这一下。"
        />
      </Head>

      <main className="shell">
        <section className="panel couragePanel">
          <div className="screenTop courageTop">
            <p className="eyebrow courageEyebrow">勇气长存</p>
            <div className="screenTopActions">
              <HomeShortcut />
              <Link href="/courage/list" className="counter counterBadge buttonLink pillLink">
                顶住记录
              </Link>
            </div>
          </div>

          <div className="stack phaseCard courageStack">
            <h1 className="title courageTitle">
              <span className="titleLine">你准备去做哪件</span>
              <span className="titleLine accentLine">需要勇气的事？</span>
            </h1>

            <form className="taskEditor courageForm" onSubmit={handleSubmit}>
              <textarea
                className="taskInput courageInput"
                rows="5"
                value={task}
                onChange={(event) => setTask(event.target.value)}
                placeholder="写下那件需要勇气去做的事"
              />

              <div className="buttonGroup courageActions">
                <button type="submit" className="primaryButton couragePrimary" disabled={!canSubmit}>
                  我可以现在做
                </button>
                <Link href="/" className="secondaryButton buttonLink courageSecondary">
                  我还需要一点时间
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

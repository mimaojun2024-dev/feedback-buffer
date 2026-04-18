import Head from 'next/head';
import { useEffect, useState } from 'react';
import HomeShortcut from '../../components/HomeShortcut';
import { getStoredCourageList } from '../../lib/buffer';

function formatCourageTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export default function CourageListPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getStoredCourageList());
  }, []);

  return (
    <>
      <Head>
        <title>我顶住过的时刻</title>
        <meta property="og:title" content="我顶住过的时刻" />
      </Head>

      <main className="shell">
        <section className="panel">
          <div className="screenTop">
            <p className="eyebrow">Courage</p>
            <div className="screenTopActions">
              <HomeShortcut />
            </div>
          </div>

          <div className="stack phaseCard">
            <h1 className="title">
              <span className="titleLine">我顶住过的时刻</span>
            </h1>

            {items.length ? (
              <section className="monthDoneList" aria-label="courage list">
                <div className="monthDoneRows courageRows">
                  {items.map((item) => (
                    <article key={item.id} className="monthDoneRow">
                      <p className="monthDoneDate">{formatCourageTime(item.createdAt)}</p>
                      <div className="monthDoneRowBody">
                        <p className="monthDoneThing">{item.title}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <article className="monthDoneEmpty">
                还没有记录。
              </article>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

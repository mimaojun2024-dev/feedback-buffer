import Head from 'next/head';
import AxisListPage from '../../components/AxisListPage';

export default function MonthAxisPage() {
  return (
    <>
      <Head>
        <title>这个月最重要的事是什么</title>
        <meta property="og:title" content="这个月最重要的事是什么" />
        <meta
          name="description"
          content="把这个月最重要的三条推进口先钉住。"
        />
      </Head>

      <AxisListPage
        sectionId="month"
        badge="月度"
        title="这个月最重要的事是什么"
        accent="定义当前推进口"
        description="最多只留三条。把这个月真正推进现实的几个口先压出来。"
        relatedHref="/axis/month/completed"
        relatedLabel="这个月完成的事情"
      />
    </>
  );
}

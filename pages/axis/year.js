import Head from 'next/head';
import AxisListPage from '../../components/AxisListPage';

export default function YearAxisPage() {
  return (
    <>
      <Head>
        <title>今年最重要的事是什么</title>
        <meta property="og:title" content="今年最重要的事是什么" />
        <meta
          name="description"
          content="把今年最重要的三条方向先立住。"
        />
      </Head>

      <AxisListPage
        sectionId="year"
        badge="年度"
        title="今年最重要的事是什么"
        accent="定义方向"
        description="先把今年真正要对齐的方向立住，再往下压到月和今天。"
      />
    </>
  );
}

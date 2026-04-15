import Link from 'next/link';

const AXIS_LEVELS = [
  {
    id: 'year',
    label: '年度',
    href: '/axis/year'
  },
  {
    id: 'month',
    label: '月度',
    href: '/axis/month'
  },
  {
    id: 'today',
    label: '今天',
    href: '/axis/today'
  }
];

export default function AxisRail({ currentLevel }) {
  return (
    <nav className="axisRail" aria-label="主轴图">
      {AXIS_LEVELS.map((level) => {
        const isActive = level.id === currentLevel;

        return (
          <Link
            key={level.id}
            href={level.href}
            aria-current={isActive ? 'page' : undefined}
            className={`axisRailLink${isActive ? ' axisRailLinkActive' : ''}`}
          >
            <span className="axisRailText">{level.label}</span>
            <span className="axisRailMarkerWrap" aria-hidden="true">
              <span className={`axisRailMarker${isActive ? ' axisRailMarkerActive' : ''}`} />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

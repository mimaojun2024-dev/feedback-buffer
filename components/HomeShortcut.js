import Link from 'next/link';

export default function HomeShortcut() {
  return (
    <Link href="/" className="topShortcut buttonLink" aria-label="回到主页">
      <span className="topShortcutLabel">主页</span>
    </Link>
  );
}

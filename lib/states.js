export const LOW_QUALITY_STATES = [
  {
    id: 'drag-start',
    name: '我不想启动',
    shortLabel: '不想启动',
    description: '不问宏大目标，只压缩到第一步。',
    href: '/drag-start/check',
    cta: '先问 2 分钟'
  },
  {
    id: 'empty-dreaming',
    name: '我需要勇气',
    shortLabel: '需要勇气',
    description: '要做一个可能被拒绝的尝试。',
    href: '/courage',
    cta: '先鼓起一点'
  },
  {
    id: 'escaped',
    name: '我在逃避',
    shortLabel: '重新接管',
    description: '我得重新接管我自己。',
    href: '/escaped',
    cta: '先拉回来'
  },
  {
    id: 'escape',
    name: '我想看反馈',
    shortLabel: '反馈依赖',
    description: '先别看回复，先过 20 秒。',
    href: '/escape/why',
    cta: '先选是哪一种'
  },
  {
    id: 'emotion-amplitude',
    name: '我有点 down',
    shortLabel: '情绪振幅',
    description: '我会跟着外部起起落落。',
    href: '/state/emotion-amplitude',
    cta: '先收一收'
  },
  {
    id: 'stimulation',
    name: '我想来点刺激',
    shortLabel: '缓冲层',
    description: '给这股冲动加一个缓冲层。',
    href: '/stimulation',
    cta: '先缓一下'
  }
];

export function getStateById(id) {
  return LOW_QUALITY_STATES.find((state) => state.id === id) || null;
}

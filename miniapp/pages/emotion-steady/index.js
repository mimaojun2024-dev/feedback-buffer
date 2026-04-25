const CALM_STEPS = [
  '时间',
  '睡眠',
  '身体动作',
  '呼吸',
  '离开刺激',
  '不再自我攻击'
];

Page({
  data: {
    stepRows: chunkSteps(CALM_STEPS),
    finalStep: '有时就是熬过去'
  }
});

function chunkSteps(steps) {
  const rows = [];

  for (let index = 0; index < steps.length; index += 2) {
    rows.push(steps.slice(index, index + 2));
  }

  return rows;
}

const CALM_STEPS = [
  {
    id: 'body',
    emoji: '🧍',
    title: '站起来动一动'
  },
  {
    id: 'breath',
    emoji: '🌬️',
    title: '慢慢呼吸'
  },
  {
    id: 'distance',
    emoji: '📴',
    title: '先别看手机'
  },
  {
    id: 'supply',
    emoji: '🍵',
    title: '喝口水吃点东西'
  },
  {
    id: 'rest',
    emoji: '🛏️',
    title: '闭眼躺一会儿'
  },
  {
    id: 'kindness',
    emoji: '🤲',
    title: '别攻击自己'
  }
];

Page({
  data: {
    stepRows: chunkSteps(CALM_STEPS),
    selectedStepId: '',
    selectedStepPrompt: '',
    showNextActions: false
  },

  handleSelect(event) {
    const stepId = event.currentTarget.dataset.id;
    const step = getCalmStepById(stepId);

    this.setData({
      selectedStepId: stepId,
      selectedStepPrompt: step ? `那就${step.title}` : '',
      showNextActions: false
    });
  },

  handleOpenNextActions() {
    if (!this.data.selectedStepPrompt) {
      return;
    }

    this.setData({
      showNextActions: true
    });
  }
});

function chunkSteps(steps) {
  const rows = [];

  for (let index = 0; index < steps.length; index += 2) {
    rows.push(steps.slice(index, index + 2));
  }

  return rows;
}

function getCalmStepById(stepId) {
  for (let index = 0; index < CALM_STEPS.length; index += 1) {
    if (CALM_STEPS[index].id === stepId) {
      return CALM_STEPS[index];
    }
  }

  return null;
}

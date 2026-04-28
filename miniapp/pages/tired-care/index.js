const { TIRED_OPTIONS } = require('../../data/tired-options');
const {
  incrementStoredFlowStat,
  incrementStoredTiredOptionClick
} = require('../../utils/storage');

const REASSURANCE_STAT_ID = 'tired-care.reassurance';
const REASSURANCE_MAX_COUNT = 99;
const REASSURANCE_MILESTONES = {
  30: {
    className: 'tired-care-reassurance-card--soft',
    text: '小小火光亮起来了'
  },
  50: {
    className: 'tired-care-reassurance-card--bright',
    text: '已经给自己撑住半程'
  },
  99: {
    className: 'tired-care-reassurance-card--max',
    text: '今天的自己，被稳稳接住了'
  }
};

function getReassuranceDisplay(nextCount) {
  const count = Math.min(nextCount, REASSURANCE_MAX_COUNT);
  const milestone = count >= REASSURANCE_MAX_COUNT
    ? REASSURANCE_MILESTONES[REASSURANCE_MAX_COUNT]
    : REASSURANCE_MILESTONES[count];

  return {
    reassuranceCount: count,
    reassuranceCountText: count >= REASSURANCE_MAX_COUNT
      ? '提气值拉满'
      : `已经给自己提气 ${count} 次`,
    reassuranceCelebrationClass: milestone ? milestone.className : '',
    reassuranceCelebrationText: milestone ? milestone.text : '',
    showReassuranceFirework: Boolean(milestone)
  };
}

Page({
  data: {
    options: [],
    optionRows: [],
    selectedOptionId: '',
    selectedPrompt: '',
    showReassurance: false,
    showReassuranceFirework: false,
    reassuranceCount: 0,
    reassuranceCountText: '已经给自己提气 0 次',
    reassuranceCelebrationClass: '',
    reassuranceCelebrationText: ''
  },

  onShow() {
    this.refreshOptions();
    this.resetReassuranceSession();
  },

  refreshOptions() {
    this.setData({
      options: TIRED_OPTIONS,
      optionRows: chunkOptions(TIRED_OPTIONS)
    });
  },

  resetReassuranceSession() {
    if (this.fireworkTimer) {
      clearTimeout(this.fireworkTimer);
    }

    const nextDisplay = getReassuranceDisplay(0);
    nextDisplay.showReassuranceFirework = false;

    this.setData(nextDisplay);
  },

  handleSelect(event) {
    const optionId = event.currentTarget.dataset.id;
    const option = getTiredOptionById(optionId);

    incrementStoredTiredOptionClick(optionId);
    this.refreshOptions();
    this.setData({
      selectedOptionId: optionId,
      selectedPrompt: option ? option.prompt : '',
      showReassurance: false,
      showReassuranceFirework: false,
      reassuranceCelebrationClass: '',
      reassuranceCelebrationText: ''
    });
  },

  handleOpenReassurance() {
    if (!this.data.selectedPrompt) {
      return;
    }

    this.setData({
      showReassurance: true
    });
  },

  handleReassure() {
    incrementStoredFlowStat(REASSURANCE_STAT_ID);

    const nextCount = Math.min(this.data.reassuranceCount + 1, REASSURANCE_MAX_COUNT);
    const nextDisplay = getReassuranceDisplay(nextCount);

    this.setData(nextDisplay);

    if (nextDisplay.showReassuranceFirework) {
      this.restartFirework();
    }
  },

  restartFirework() {
    if (this.fireworkTimer) {
      clearTimeout(this.fireworkTimer);
    }

    this.fireworkTimer = setTimeout(() => {
      this.setData({
        showReassuranceFirework: false,
        reassuranceCelebrationClass: '',
        reassuranceCelebrationText: ''
      });
    }, 1400);
  },

  onUnload() {
    if (this.fireworkTimer) {
      clearTimeout(this.fireworkTimer);
    }
  }
});

function chunkOptions(options) {
  const rows = [];

  for (let index = 0; index < options.length; index += 2) {
    rows.push(options.slice(index, index + 2));
  }

  return rows;
}

function getTiredOptionById(optionId) {
  for (let index = 0; index < TIRED_OPTIONS.length; index += 1) {
    if (TIRED_OPTIONS[index].id === optionId) {
      return TIRED_OPTIONS[index];
    }
  }

  return null;
}

const { TIRED_OPTIONS } = require('../../data/tired-options');
const {
  getStoredTiredOptionClicks,
  incrementStoredTiredOptionClick
} = require('../../utils/storage');

Page({
  data: {
    options: [],
    optionRows: [],
    selectedOptionId: '',
    selectedOptionLabel: ''
  },

  onShow() {
    this.refreshOptions();
  },

  refreshOptions() {
    const optionClicks = getStoredTiredOptionClicks();
    const options = TIRED_OPTIONS.map((option) => ({
      ...option,
      count: optionClicks[option.id] || 0
    }));

    this.setData({
      options,
      optionRows: chunkOptions(options)
    });
  },

  handleSelect(event) {
    const optionId = event.currentTarget.dataset.id;
    const option = TIRED_OPTIONS.find((item) => item.id === optionId);

    incrementStoredTiredOptionClick(optionId);
    this.refreshOptions();
    this.setData({
      selectedOptionId: optionId,
      selectedOptionLabel: option ? option.label : ''
    });
  }
});

function chunkOptions(options) {
  const rows = [];

  for (let index = 0; index < options.length; index += 2) {
    rows.push(options.slice(index, index + 2));
  }

  return rows;
}

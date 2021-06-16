const { isEmpty } = require('lodash');

const statuses = {
  initial: { label: 'リクエスト中', color: 'warning', },
  taked: { label: 'ゲット済み', color: 'success' },
};
const { entries } = Object;

module.exports = {
  fields: ({ giftTypes = [] } = {}) => {
    return {
      giftTypeId: {
        label: 'ギフトタイプ',
        type: 'select',
        options: giftTypes.map(_ => ({ label: _.name, value: _.id })),
        validations: {
          required: v => !isEmpty(v),
        },
      },
      status: {
        label: '状態',
        type: 'select',
        options: entries(statuses).map(([k, v]) => ({ value: k, label: v.label })),
        initialValue: 'initial',
      },
    };
  },
  statuses,
};

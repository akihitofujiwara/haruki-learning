const { isEmpty } = require('lodash');

const statuses = {
  initial: { label: '未クリア' },
  completed: { label: 'クリア済み' },
};
const { entries } = Object;

module.exports = {
  fields: () => {
    return {
      body: {
        label: '内容',
        type: 'text',
      },
      point: {
        label: 'ポイント',
        type: 'integer',
        validations: {
          required: v => v > 0,
        },
      },
      image: {
        label: '写真URL',
        type: 'string',
      },
      status: {
        label: '状態',
        type: 'select',
        options: entries(statuses).map(([k, v]) => ({ value: k, label: v.label })),
        initialValue: 'initial',
      },
    };
  },
  userFields: () => {
    return {
      image: {
        label: '写真',
        type: 'file',
      },
    };
  },
};


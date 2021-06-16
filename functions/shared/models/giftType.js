const { isEmpty } = require('lodash');

const { entries } = Object;

module.exports = {
  fields: ({ giftTypes = [] } = {}) => {
    return {
      name: {
        label: '名称',
        type: 'string',
        validations: {
          required: v => !isEmpty(v),
        },
      },
      point: {
        label: 'ポイント',
        type: 'integer',
        validations: {
          required: v => v > 0,
        },
      },
    };
  },
};

const { isEmpty } = require('lodash');

module.exports = {
  fields: () => {
    return {
      description: {
        label: '本文',
        type: 'text',
        validations: {
          required: v => !isEmpty(v),
        },
        inputProps: {
          rows: 3,
        },
      },
      optionsString: {
        label: '選択肢',
        type: 'text',
        validations: {
          required: v => !isEmpty(v),
        },
        inputProps: {
          rows: 5,
        },
      },
      correctNumber: {
        label: '正解番号',
        type: 'integer',
        validations: {
          required: v => v > 0,
        },
      },
    };
  },
};

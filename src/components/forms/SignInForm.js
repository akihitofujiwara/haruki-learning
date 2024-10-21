import React from 'react';
import { isEmpty, mapValues } from 'lodash';
import { Button, Form, } from 'reactstrap';
import { useToggle } from 'react-use';

import useFormState from '../hooks/useFormState';
import Field from '../Field';

const { entries } = Object;
const fields = {
  email: {
    type: 'string',
    label: 'メールアドレス',
    validations: {
      required: v => !isEmpty(v),
    },
  },
  password: {
    type: 'password',
    label: 'パスワード',
    validations: {
      required: v => !isEmpty(v),
    },
  }
};

export default function SignInForm(props) {
  const { isOpen, values, } = props;
  const statedFields = useFormState(values, fields, isOpen);
  const isUnsubmittable = Object.values(statedFields).some(_ => !_.isValid);
  const onSubmit = (event) => {
    event.preventDefault();
    if(isUnsubmittable) return;
    props.onSubmit({ ...mapValues(statedFields, 'value') });
  };

  return (
    <Form onSubmit={onSubmit}>
      <div>
        {
          entries(statedFields).map(([fieldName, fieldSetting]) => (
            <Field
              key={fieldName}
              name={fieldName}
              {...fieldSetting}
            />
          ))
        }
      </div>
      <div>
        <Button block type="submit" color="primary" onClick={onSubmit} disabled={isUnsubmittable}>ログイン</Button>
      </div>
    </Form>
  );
};

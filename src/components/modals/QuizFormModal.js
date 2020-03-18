import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { isEmpty, mapValues } from 'lodash';
import classnames from 'classnames';

import useFormState from '../hooks/useFormState';
import Field from '../Field';
import { fields } from '../../shared/models/quiz';

const { entries } = Object;

export default function QuizFormModal(props) {
  const { isOpen, values, quizzes, onClickClose } = props;
  const isNew = !values;
  const statedFields = useFormState(values, fields({ quizzes }), isOpen);
  const isUnsubmittable = Object.values(statedFields).some(_ => !_.isValid);
  const onSubmit = (event) => {
    event.preventDefault();
    if(isUnsubmittable) return;
    props.onSubmit({ ...mapValues(statedFields, 'value'), });
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>
        クイズ{isNew ? '追加' : '編集'}
      </ModalHeader>
      <Form onSubmit={onSubmit}>
        <ModalBody>
          {
            entries(statedFields).map(([fieldName, fieldSetting]) => (
              <Field
                key={fieldName}
                name={fieldName}
                {...fieldSetting}
              />
            ))
          }
        </ModalBody>
        <ModalFooter>
          <Button className="cancel" color="secondary" onClick={onClickClose}>閉じる</Button>
          <Button className="save" type="submit" color="primary" onClick={onSubmit} disabled={isUnsubmittable}>保存</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

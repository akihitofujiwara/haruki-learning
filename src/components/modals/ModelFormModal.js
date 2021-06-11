import React, { useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Form, } from 'reactstrap';
import { mapValues, isFunction, } from 'lodash';
import { useToggle } from 'react-use';

import useFormState from '../hooks/useFormState';
import Field from '../Field';

const { entries } = Object;

export default function ModelFormModal(props) {
  const { fields, title, isOpen, values, submitLabel = '保存', onClickClose, onChange = _ => _, } = props;
  const statedFields = useFormState(values, isFunction(fields) ? fields() : fields, isOpen);
  const isUnsubmittable = Object.values(statedFields).some(_ => !_.isValid);
  const [isSubmitting, toggleSubmitting] = useToggle(false);
  const onSubmit = async (event) => {
    event.preventDefault();
    if(isUnsubmittable) return;

    toggleSubmitting(true);
    await props.onSubmit({ ...mapValues(statedFields, 'value'), });
    toggleSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>
        {title}
      </ModalHeader>
      <Form onSubmit={onSubmit}>
        <ModalBody>
          {
            entries(statedFields).map(([fieldName, fieldSetting]) => (
              <Field
                key={fieldName}
                name={fieldName}
                values={mapValues(statedFields, 'value')}
                {...fieldSetting}
              />
            ))
          }
        </ModalBody>
        <ModalFooter>
          <Button className="cancel" onClick={onClickClose}>閉じる</Button>
          <Button className="save" type="submit" color="primary" onClick={onSubmit} disabled={isUnsubmittable || isSubmitting}>{submitLabel}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

import React from 'react';
import { omit, } from 'lodash';
import { toast } from 'react-toastify';
import { Button, } from 'reactstrap';
import { useToggle, } from 'react-use';
import classnames from 'classnames';

export default function AddButton ({ initialValues, validateOnSubmit = _ => true, itemRef, FormModal, formProps, processValues = _ => _, label = '追加', iconClassName = 'fas fa-plus', onFinish, ...extraProps }) {
  const { id } = itemRef;
  const [showsModal, toggleModal] = useToggle(false);
  const onSubmit = async (values) => {
    if(!(await validateOnSubmit({ id, ...values }))) return;

    try {
      await itemRef.set({ ...omit(await processValues({ id, ...values }), ['id', 'ref']), createdAt: new Date(), updatedAt: new Date(), });
      onFinish && await onFinish({ id, ...values });
      toast.success('追加しました');
      toggleModal(false);
    } catch(e) {
      console.error(e);
      toast.error('失敗しました');
    }
  };

  return (
    <Button color="primary" onClick={_ => toggleModal(true)} {...extraProps}>
      <span className={classnames(iconClassName, 'mr-1')} />
      {label}
      {showsModal && <FormModal isOpen={showsModal} values={initialValues} onClickClose={_ => toggleModal(false)} onSubmit={onSubmit} {...formProps} />}
    </Button>
  );
};

import React, { useState, } from 'react';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { omit } from 'lodash';
import { Button, } from 'reactstrap';

import useDocumentSubscription from './hooks/useDocumentSubscription';

export default function EditButton ({ validateOnSubmit = _ => true, itemRef, FormModal, formProps, ...extraProps }) {
  const [showsModal, setShowsModal] = useState(false);
  const item = useDocumentSubscription(showsModal && itemRef, [showsModal]);
  const onSubmit = async (values) => {
    if(!(await validateOnSubmit({ id: itemRef.id, ...values }))) return;
    try {
      await itemRef.update(values);
      toast.success('保存しました');
      setShowsModal(false);
    } catch(e) {
      console.error(e);
      toast.error('失敗しました');
    }
  };

  return (
    <Button color="secondary" onClick={_ => setShowsModal(true)} {...extraProps}>
      <span className="fas fa-edit mr-1" />
      編集
      {
        item && (
          <FormModal isOpen={showsModal} values={item} onClickClose={_ => setShowsModal(false)} onSubmit={onSubmit} {...formProps} />
        )
      }
    </Button>
  );
};



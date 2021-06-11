import React, { Fragment, useState, } from 'react';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { omit } from 'lodash';
import { Button, } from 'reactstrap';

import useDocumentSubscription from './hooks/useDocumentSubscription';

export default function EditButton ({ label, validateOnSubmit = _ => true, itemRef, FormModal, formProps, beforeSubmit = _ => _, ...extraProps }) {
  const [showsModal, setShowsModal] = useState(false);
  const item = useDocumentSubscription(showsModal && itemRef, [showsModal]);
  const onSubmit = async (values) => {
    const { id } = itemRef;
    if(!(await validateOnSubmit({ id: itemRef.id, ...values }))) return;
    try {
      await itemRef.update(await beforeSubmit({ id, ...values }));
      toast.success('保存しました');
      setShowsModal(false);
    } catch(e) {
      console.error(e);
      toast.error('失敗しました');
    }
  };

  return (
    <Button color="secondary" onClick={_ => setShowsModal(true)} {...extraProps}>
      {
        label || (
          <Fragment>
            <span className="fas fa-edit mr-1" />
            編集
          </Fragment>
        )
      }
      {
        item && (
          <FormModal isOpen={showsModal} values={item} onClickClose={_ => setShowsModal(false)} onSubmit={onSubmit} {...formProps} />
        )
      }
    </Button>
  );
};



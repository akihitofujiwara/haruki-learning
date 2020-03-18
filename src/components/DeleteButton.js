import React, { useState, } from 'react';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { Button, } from 'reactstrap';

export default function DeleteButton ({ itemRef, ...extraProps }) {
  const onClickDelete = async (props) => {
    if (!window.confirm('本当に削除しますか？')) return;
    await itemRef.delete();
    toast.success('削除しました');
  }

  return (
    <Button color="danger" onClick={onClickDelete} {...extraProps}>
      <span className="fas fa-trash mr-1" />
      削除
    </Button>
  );
};

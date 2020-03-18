import React, { useState, useEffect } from 'react';
import { keyBy } from 'lodash';

export default function useCollectionSubscription (ref, dependencies = [], initialValue = []) {
  const [items, setItems] = useState(initialValue);
  useEffect(() => {
    const unsubscribe = ref
      .onSnapshot(({ docs }) => {
        setItems(docs.map(_ => ({ id: _.id, ref: _.ref, ..._.data() })));
      });
    return unsubscribe;
  }, dependencies);
  return items;
};

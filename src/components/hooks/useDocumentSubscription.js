import React, { useState, useEffect } from 'react';
import { keyBy } from 'lodash';

export default function useDocumentSubscription (ref, dependencies = []) {
  const [item, setItem] = useState();
  useEffect(() => {
    if(!ref) return;
    const unsubscribe = ref
      .onSnapshot((doc) => {
        if(doc.exists) {
          setItem({ id: doc.id, ...doc.data() });
        }
      });
    return unsubscribe;
  }, dependencies);
  return item;
};

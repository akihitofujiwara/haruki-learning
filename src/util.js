import React from 'react';
import numeral from 'numeral';
import { isEmpty, keyBy, mapValues, } from 'lodash';
import qs from 'qs';

import env from './env';

const { entries, } = Object;

export function yen(value) {
  return (
    <>
      <span className="mr-1">&yen;</span>
      <span>{numeral(value).format('0,0')}</span>
    </>
  );
}

export function newId(lastItem) {
  return ((lastItem ? parseInt(lastItem.id.replace(/\D/g, ''), 10) : 0) + 1).toString();
};

export function readFile(file, type = 'readAsText') {
  const reader = new FileReader();
  reader[type](file);
  return new Promise((resolve) => {
    reader.addEventListener('load', _ => resolve(_.target.result));
  });
};

export function fullPathWithParams(params, { pathname, search }) {
  const currentParams = qs.parse(decodeURI(search.slice(1)));
  const newParams = {
    ...currentParams,
    ...params
  };
  const newSearch = qs.stringify(newParams);
  return `${pathname}${newSearch ? `?${newSearch}` : ''}`;
};

export function withConfirm(message, f) {
  return (...args) => {
    if(!window.confirm(message)) return;

    f(...args);
  };
};

export function isMobile() {
  return window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches;
}

export function safePrefix(value) {
  return value.includes('-') ? env('TENANT_PREFIX') + value.replace(env('TENANT_PREFIX'), '') : value;
}

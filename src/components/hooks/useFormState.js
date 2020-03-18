import React, { useState, useEffect } from 'react';

const { entries } = Object;

export default function useFormState (values, fields, shouldReset) {
  const initialState = entries(fields)
    .reduce((x, [fieldName, fieldSetting]) => {
      const { type, initialValue } = fieldSetting;
      const _value = (values || {})[fieldName];
      const toDateInSomeCases = v => (v && v.toDate) ? v.toDate() : v;
      const value = (({
        datetime: () => toDateInSomeCases(_value),
        date: () => toDateInSomeCases(_value),
        time: () => toDateInSomeCases(_value),
      })[type] || (_ => _value))();
      return {
        ...x,
        [fieldName]: value !== undefined ? value : initialValue != null ? initialValue : null,
      };
    }, {});
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if(shouldReset) setState(initialState);
  }, [values, shouldReset]);

  return entries(fields).reduce((x, [fieldName, fieldSetting]) => {
    const { validations = {}, hidden = _ => false } = fieldSetting;
    const shouldHide = hidden(state);
    const value = shouldHide ? null : state[fieldName];
    const validationErrors = shouldHide ? [] : entries(validations)
      .filter(([k, v]) => !v(value, state, fieldName))
      .map(([k]) => k);
    return {
      ...x,
      [fieldName]: {
        ...fieldSetting,
        value,
        setValue: v => setState({ ...state, [fieldName]: v }),
        validationErrors,
        isValid: validationErrors.length === 0,
        shouldHide,
      },
    };
  }, {});
};

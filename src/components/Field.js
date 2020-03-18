import React, { Fragment, useState } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { flattenDeep, isEmpty, pick, omitBy, get, set, mapValues } from 'lodash';
import Select from 'react-select';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';

import texts from '../shared/texts';

const { entries, keys } = Object;
const validationText = (documentName, fieldName, key) => {
  return (
    get(texts.validations[documentName], `${fieldName}.${key}`)
    || get(texts.validations.general, key)
  );
}

export default function Field (props) {
  const { formGroupAttrs = {}, documentName, type, name: fieldName, label, value, setValue, onChange, setState, options = [], validationErrors = [], readOnly = _ => false, shouldHide, placeholder, inputProps = {}, } = props;
  const [hasStarted, setHasStarted] = useState(false);
  const setValueAndStart = (value) => {
    setValue(value);
    onChange && onChange(value);
    setHasStarted(true);
  };
  const isValid = validationErrors.length === 0;
  const validationCss = hasStarted && classnames({ 'is-valid': isValid, 'is-invalid': isValid === false });
  if(shouldHide) return null;

  return (
    <FormGroup key={fieldName} {...formGroupAttrs}>
      {
        ({
          string: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <Input name={fieldName} value={value || ''} onChange={_ => setValueAndStart(_.target.value)} className={validationCss} readOnly={readOnly(value, props)} placeholder={placeholder} />
            </Fragment>
          ),
          password: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <Input type="password" name={fieldName} value={value || ''} onChange={_ => setValueAndStart(_.target.value)} className={validationCss} readOnly={readOnly(value, props)} placeholder={placeholder} />
            </Fragment>
          ),
          integer: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <Input name={fieldName} type="number" step="1" value={value != null ? value : ''} onChange={_ => setValueAndStart(parseInt(_.target.value))} className={classnames('text-right', validationCss)} readOnly={readOnly(value, props)} placeholder={placeholder} />
            </Fragment>
          ),
          boolean: () => (
            <Fragment>
              <FormGroup check>
                <Label check>
                  <Input name={fieldName} type="checkbox" checked={value} onChange={_ => setValueAndStart(_.target.checked)} className={validationCss} disabled={readOnly(value, props)} />
                  {label}
                </Label>
              </FormGroup>
            </Fragment>
          ),
          radio: () => (
            <FormGroup tag="fieldset">
              {label && <Label>{label}</Label>}
              <div className="form-inline">
                {
                  options.map(({ label, value: _value }) => (
                    <FormGroup check key={_value} className="mr-2">
                      <Label check>
                        <Input name={fieldName} type="radio" checked={_value === value} onChange={_ => setValueAndStart(_value)} className={validationCss} disabled={readOnly(value, props)} />
                        {label}
                      </Label>
                    </FormGroup>
                  ))
                }
              </div>
            </FormGroup>
          ),
          select: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <Select
                data-test={fieldName}
                value={options.find(_ => _.value === value) || null}
                onChange={_ => setValueAndStart(_ && _.value)}
                className={classnames('form-select', validationCss)}
                options={options}
                isDisabled={readOnly(value, props)}
                isClearable
              />
            </Fragment>
          ),
          multiSelect: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <Select
                data-test={fieldName}
                isMulti
                value={options.filter(_ => (value || []).includes(_.value)) || null}
                onChange={_ => setValueAndStart(_.map(_ => _.value))}
                className={classnames('form-select', validationCss)}
                options={options}
                isDisabled={readOnly(value, props)}
                isClearable
              />
            </Fragment>
          ),
          datetime: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <div>
                <DatePicker
                  data-test={fieldName}
                  showTimeSelect
                  dateFormat="yyyy/MM/dd HH:mm"
                  timeFormat="HH:mm"
                  timeIntervals={10}
                  selected={value}
                  onChange={setValueAndStart}
                  className={classnames('form-control', validationCss)}
                  readOnly={readOnly(value, props)}
                  placeholder={placeholder}
                />
              </div>
            </Fragment>
          ),
          date: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <div>
                <DatePicker
                  data-test={fieldName}
                  dateFormat="yyyy/MM/dd"
                  timeIntervals={10}
                  selected={value}
                  onChange={setValueAndStart}
                  className={classnames('form-control', validationCss)}
                  readOnly={readOnly(value, props)}
                  placeholder={placeholder}
                />
              </div>
            </Fragment>
          ),
          time: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <div>
                <DatePicker
                  data-test={fieldName}
                  showTimeSelect
                  showTimeSelectOnly
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  selected={value}
                  onChange={setValueAndStart}
                  className={classnames('form-control', validationCss)}
                  readOnly={readOnly(value, props)}
                  placeholder={placeholder}
                />
              </div>
            </Fragment>
          ),
          text: () => (
            <Fragment>
              {label && <Label>{label}</Label>}
              <Input type="textarea" value={value} onChange={_ => setValueAndStart(_.target.value)} className={validationCss} readOnly={readOnly(value, props)} placeholder={placeholder} {...inputProps} />
            </Fragment>
          ),
        })[type]()
      }
      {
        hasStarted && type !== 'list' && validationErrors.length > 0 && (
          <div className="small text-danger mt-1">
            {
              validationErrors.map(k => (
                <div key={k}>{validationText(documentName, fieldName.replace(/\.\d+\./g, '.fields.'), k)}</div>
              ))
            }
          </div>
        )
      }
    </FormGroup>
  );
};

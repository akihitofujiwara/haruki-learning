import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { FormGroup, Label, Input } from 'reactstrap';
import qs from 'qs';
import { format as formatDate } from 'date-fns';
import classnames from 'classnames';

import { fullPathWithParams, } from '../util';

export default function QueryBoolean(props) {
  const { paramName, label, defaultValue, ...extraProps } = props;
  const history = useHistory();
  const location = useLocation();
  const { [paramName]: value = defaultValue } = qs.parse(decodeURI(location.search.slice(1)));
  const onChange = ({ target: { checked } }) => {
    const path = fullPathWithParams({ [paramName]: checked ? '1' : '0' }, location);
    history.replace(encodeURI(path));
  };

  return (
    <div {...extraProps}>
      <FormGroup className="mb-1">
        <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={value === '1'} onChange={onChange} />
            {label}
          </Label>
        </FormGroup>
      </FormGroup>
    </div>
  );
};


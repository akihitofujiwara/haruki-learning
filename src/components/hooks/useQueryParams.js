import { useLocation } from 'react-router';
import qs from 'qs';

export default function useQueryParams () {
  const location = useLocation();
  const queryParams = qs.parse(decodeURI(location.search.slice(1)), { arrayLimit: Infinity });
  return queryParams;
};

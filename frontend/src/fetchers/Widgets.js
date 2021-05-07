import join from 'url-join';
import { get } from './index';

const fetchWidget = async (widgetId, query = '') => {
  const queryStr = query ? `?${query}` : '';
  const res = await get(join('/', 'api', 'widgets', `${widgetId}${queryStr}`));
  return res.json();
};

export default fetchWidget;

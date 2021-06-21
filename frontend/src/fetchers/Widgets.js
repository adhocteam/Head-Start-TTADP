import join from 'url-join';
import { get } from './index';

const fetchWidget = async (widgetId, region, date, query = '') => {
  const queryStr = query ? `?${query}&` : '?&';
  console.log(date);
  const res = await get(join('/', 'api', 'widgets', `${widgetId}${queryStr}region.in[]=${region}`));
  return res.json();
};

export default fetchWidget;

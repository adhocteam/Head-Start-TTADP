import join from 'url-join';
import { get } from './index';

const fetchWidget = async (widgetId, region, dateRange = '', query = '') => {
  const queryStr = query ? `?${query}&` : '?&';
  const dateRangeStr = dateRange !== '' ? `&startDate.win=${dateRange}` : '';
  const regionStr = region ? `region.in[]=${region}` : '';
  const res = await get(join('/', 'api', 'widgets', widgetId, queryStr, regionStr, dateRangeStr));
  return res.json();
};

export default fetchWidget;

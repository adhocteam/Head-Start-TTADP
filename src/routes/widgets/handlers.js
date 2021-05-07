/* eslint-disable import/prefer-default-export */
import widgets from '../../widgets';
import { filtersToScopes } from '../../scopes/activityReport';
import { getUserReadRegions } from '../../services/accessValidation';
import { DECIMAL_BASE } from '../../constants';

/*
  Make sure the user has read permissions to the regions requested. If no regions
  are explicitly requested default to all regions which the user has access to.
*/
async function setReadRegions(query, userId) {
  const readRegions = await getUserReadRegions(userId);

  if ('region.in' in query) {
    return {
      ...query,
      'region.in': query['region.in'].filter((r) => readRegions.includes(parseInt(r, DECIMAL_BASE))),
    };
  }

  return {
    ...query,
    'region.in': readRegions,
  };
}

export async function getWidget(req, res) {
  const { widgetId } = req.params;
  const getWidgetData = widgets[widgetId];

  if (!getWidgetData) {
    res.sendStatus(404);
    return;
  }

  const query = await setReadRegions(req.query, req.session.userId);
  const scopes = filtersToScopes(query);
  const widgetData = await getWidgetData(scopes);
  res.json(widgetData);
}

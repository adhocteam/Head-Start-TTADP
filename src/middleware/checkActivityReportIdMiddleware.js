import handleErrors from '../lib/apiErrorHandler';
import { auditLogger } from '../logger';

function canBeInt(str) {
  return Number.isInteger(Number(str)) && Number(str) > 0;
}

/**
 *  Check Activity Report req param
 *
 * This middleware validates that the Activity Report id supplied
 * by the query param is an integer before we proceed with the request
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next middleware
 */
export default async function checkActivityReportIdMiddleware(req, res, next) {
  try {
    const { activityReportId } = req.params;
    if (!canBeInt(activityReportId)) {
      auditLogger.error(`Received malformed activityReportId: "${activityReportId}"`);
      return res.sendStatus(400);
    }
  } catch (e) {
    return handleErrors(req, res, e);
  }

  return next();
}

import { auditLogger } from '../logger';

const errorMessage = 'Received malformed request params';

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
export function checkActivityReportParam(req, res, next) {
  if (req.params && req.params.activityReportId && canBeInt(req.params.activityReportId)) {
    return next();
  }

  auditLogger.error(errorMessage);
  return res.status(400).send(errorMessage);
}

/**
 *  Check Report and File req params
 *
 * This middleware validates that the Report id and File id supplied
 * by the query params are integers before we proceed with the request
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next middleware
 */
export function checkReportAndFileParams(req, res, next) {
  if (
    req.params
    && req.params.reportId
    && req.params.fileId
    && canBeInt(req.params.reportId)
    && canBeInt(req.params.fileId)
  ) {
    return next();
  }

  auditLogger.error(errorMessage);
  return res.status(400).send(errorMessage);
}

// import handleErrors from '../../lib/apiErrorHandler';
import { requestErrors } from '../../services/requestErrors';

const namespace = 'SERVICE:REQUEST_ERRORS';

// const logContext = {
//   namespace,
// };

/**
 * Retrieve activity reports
 *
 * @param {*} req - request
 * @param {*} res - response
 */
export default async function getRequestErrors(req, res) {
  const requestErrorsWithCount = await requestErrors();
  if (!requestErrorsWithCount) {
    res.sendStatus(404);
  } else {
    res.header('Content-Range', `requestErrors */${requestErrorsWithCount.count}`);
    res.json(requestErrorsWithCount.rows);
  }
}

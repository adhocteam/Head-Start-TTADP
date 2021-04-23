import handleErrors from '../../lib/apiErrorHandler';
import { requestErrors } from '../../services/requestErrors';

const namespace = 'SERVICE:REQUEST_ERRORS';

const logContext = {
  namespace,
};

/**
 * Retrieve activity reports
 *
 * @param {*} req - request
 * @param {*} res - response
 */
export default async function getRequestErrors(req, res) {
  // const readRegions = await getUserReadRegions(req.session.userId);
  const errors = await requestErrors();
  if (!errors) {
    res.sendStatus(404);
  } else {
    res.json(errors);
  }
}

import axios from 'axios';
import express from 'express';
import logger from '../logger';

const router = express.Router();

const ecklcBaseUri = 'https://eclkc.ohs.acf.hhs.gov/eclkc-apis/locator/api';
/**
 * Gets the program data from ECLKC
 * Formats it for the front end
 * @param {Object} req - request
 * @param {Object} res - response
 * @returns {Promise}
 */
export async function getPrograms(req, res) {
  try {
    const baseUrl = `${ecklcBaseUri}/program`;
    const response = await axios.get(baseUrl, {
      params: {
        ...req.query,
        apikey: process.env.ECLKC_API_KEY,
      },
    });
    const { documents } = response.data;
    const granteeGrant = documents.map((v) => (
      { grantee: v.granteeName, grant: v.grantNumber, type: v.type }
    ));
    const granteeMap = new Map();
    granteeGrant.map((v) => (() => {
      if (granteeMap.has(v.grantee)) {
        const existingGrant = granteeMap.get(v.grantee);
        if (!existingGrant.includes(v.grant)) granteeMap.get(v.grantee).push(v.grant);
        return granteeMap.get(v.grantee);
      }
      return granteeMap.set(v.grantee, [v.grant]);
    })());
    const granteeObj = {};
    granteeMap.forEach((value, key) => { granteeObj[key] = value.toString(); });
    res.send(granteeObj);
  } catch (error) {
    logger.error(error);
  }
}
/**
 * Gets the center data from ECLKC
 * Formats it for the front end
 * @param {Object} req - request
 * @param {Object} res - response
 * @returns {Promise}
 */
export async function getCenters(req, res) {
  try {
    const baseUrl = `${ecklcBaseUri}/center`;
    const response = await axios(baseUrl, {
      params: {
        ...req.query,
        apikey: process.env.ECLKC_API_KEY,
      },
    });
    const { documents } = response.data;
    const centersObj = {};
    documents.forEach((v) => {
      centersObj[v.name] = [v.delegateNumber, v.grantNumber].toString();
    });
    res.send(centersObj);
  } catch (error) {
    logger.error(error);
  }
}

/**
 * API for front-end to retrieve values for programs containing grantee names.
 *
 * Programs by region: '/v1/programs?region=1'
 * Programs by type: '/v1/programs?type=1,2'
 * Other parameters include city, state, zip, county, pid, name, grantNumber, indentifier.
 * Parameters can be combined: '/v1/programs?region=1&type=1'
 */
router.get('/v1/programs', getPrograms);

/**
 * API for front-end to retrieve values for centers.
 *
 * Centers by grant number: '0/v1/centers?grantNumber=01CH011480'
 * Other parameters (save as above programs api) are available and can be combined
 */
router.get('/v1/centers', getCenters);

export default router;

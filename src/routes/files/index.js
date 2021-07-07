import express from 'express';
import uploadHandler, { deleteHandler } from './handlers';
import checkReportAndFileParams from '../../middleware/checkIdParamMiddleware';

const router = express.Router();

/**
 * API for file uploads
 */

router.post('/', uploadHandler);
router.delete('/:reportId?/:fileId?', checkReportAndFileParams, deleteHandler);

export default router;

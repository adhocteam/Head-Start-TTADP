import express from 'express';
import getRequestErrors from './handlers';

const router = express.Router();

router.get('/requestErrors', getRequestErrors);

export default router;

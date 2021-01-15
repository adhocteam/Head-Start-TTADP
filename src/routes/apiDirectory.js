import express from 'express';
import unless from 'express-unless';
import join from 'url-join';

import authMiddleware, { login } from '../middleware/authMiddleware';
import handleErrors from '../lib/apiErrorHandler';
import adminRouter from './user';
import filesRouter from './files';
import activityReportsRouter from './activityReports';
import { userById } from '../services/users';

export const loginPath = '/login';

authMiddleware.unless = unless;

const router = express.Router();

router.use(authMiddleware.unless({ path: [join('/api', loginPath)] }));

router.use('/admin/users', adminRouter);
router.use('/activity-reports', activityReportsRouter);
router.use('/files', filesRouter);
router.use('/hello', (req, res) => {
  res.send('Hello from ttadp');
});

router.get('/user', async (req, res) => {
  const { userId } = req.session;
  try {
    const user = await userById(userId);
    res.json(user.toJSON());
  } catch (error) {
    await handleErrors(req, res, error, { namespace: 'SERVICE:SELF' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.sendStatus(204);
});

router.get(loginPath, login);

// Server 404s need to be explicitly handled by express
router.get('*', (req, res) => {
  res.sendStatus(404);
});

export default router;

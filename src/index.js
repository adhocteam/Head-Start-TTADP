import express from 'express';
import helmet from 'helmet';
import axios from 'axios';

import authMiddleware, { hsesAuth } from './middleware/authMiddleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(authMiddleware);

app.get('/', (req, res) => {
  res.send('Hello from ttadp');
});

app.get('/auth/hses', (req, res) => {
  const uri = hsesAuth.code.getUri();

  res.redirect(uri);
});

app.get('/oauth2-client/login/oauth2/code/', async (req, res) => {
  try {
    const user = await hsesAuth.code.getToken(req.originalUrl);
    // user will have accessToken and refreshToken
    // console.log(user);
    const requestObj = user.sign({
      method: 'get',
      url: 'https://uat.hsesinfo.org/auth/user/me',
    });

    const { url } = requestObj;

    const response = await axios.get(url, requestObj);
    const { data } = response;
    const { authorities } = data;
    res.send(authorities);
  } catch (error) {
    // console.log(error);
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
}

const server = app.listen(process.env.PORT || 8080, () => {
  // TODO: add a logging message
});

module.exports = server;

import {} from 'dotenv/config';
import ClientOAuth2 from 'client-oauth2';

export const hsesAuth = new ClientOAuth2({
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  accessTokenUri: 'https://uat.hsesinfo.org/auth/oauth/token',
  authorizationUri: 'https://uat.hsesinfo.org/auth/oauth/authorize',
  redirectUri: 'http://localhost:8080/oauth2-client/login/oauth2/code/',
  scopes: ['user_info'],
});

/**
 * Authentication Middleware
 *
 * This middleware handles user authentication using the request session
 * uid that gets set after successful login via HSES. Non-authenticated
 * users who attempt to access a page that requires authentication will be
 * redirected to the HSES login page.
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next middleware
 */

export default async function authMiddleware(req, res, next) {
  req.session.originalUrl = req.originalUrl;
  // console.log(`session: ${JSON.stringify(req.session)}`);
  if (!req.session.userId) {
    const uri = hsesAuth.code.getUri();

    res.redirect(uri);
  } else {
    next();
  }
}

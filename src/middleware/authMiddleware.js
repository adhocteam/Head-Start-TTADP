import ClientOAuth2 from 'client-oauth2';

// TODO: move values to env variables
export const hsesAuth = new ClientOAuth2({
  clientId: '7b9268101989e6ce7efc',
  clientSecret: 'ABHnjtF6iB1fsg940xBHvZy89Las7X31gywtsMChHrMV',
  accessTokenUri: 'https://uat.hsesinfo.org/auth/oauth/token',
  authorizationUri: 'https://uat.hsesinfo.org/auth/oauth/authorize',
  redirectUri: 'http://localhost:8080/oauth2-client/login/oauth2/code/',
  scopes: ['user_info'],
});

// Placeholder to add any auth logic
export default async function authMiddleware(req, res, next) {
  next();
}

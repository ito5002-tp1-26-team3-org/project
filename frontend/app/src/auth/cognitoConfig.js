const region = import.meta.env.VITE_COGNITO_REGION;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;

const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

const redirectUri = `${window.location.origin}/auth/callback`;
const postLogoutRedirectUri = `${window.location.origin}/`;

export const oidcConfig = {
  authority: issuer,
  client_id: clientId,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  response_type: "code",
  scope: "openid email profile",
  loadUserInfo: true,
};

export const appAuthConfig = {
  region,
  userPoolId,
  issuer,
  cognitoDomain,
};

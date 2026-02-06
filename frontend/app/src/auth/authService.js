import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { oidcConfig } from "./cognitoConfig";

export const userManager = new UserManager({
  ...oidcConfig,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

export function loginWithHint(hint) {
  return userManager.signinRedirect({
    state: { portal: hint },
  });
}

export async function signupWithHint(hint = "resident") {
  return userManager.signinRedirect({
    state: { portal: hint },
    extraQueryParams: { screen_hint: "signup" },
  });
}


export function handleAuthCallback() {
  return userManager.signinRedirectCallback();
}

export async function logout() {
  try {
    await userManager.removeUser();
    await userManager.clearStaleState();
  } catch {
    // ignore
  }

  const domain = import.meta.env.VITE_COGNITO_DOMAIN;
  const clientId = userManager.settings.client_id;

  const postLogout =
    import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI ||
    `${window.location.origin}/`;

  if (!domain || !clientId) {
    window.location.assign("/");
    return;
  }

  const url =
    `${domain}/logout?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(postLogout)}` +
    `&logout_uri=${encodeURIComponent(postLogout)}`;

  window.location.assign(url);
}



export async function getUser() {
  return userManager.getUser();
}

export async function isAuthenticated() {
  const user = await getUser();
  return !!user && !user.expired;
}

export function getGroupsFromUser(user) {
  const groups = user?.profile?.["cognito:groups"];
  return Array.isArray(groups) ? groups : [];
}

export function isInGroup(user, groupName) {
  return getGroupsFromUser(user).includes(groupName);
}

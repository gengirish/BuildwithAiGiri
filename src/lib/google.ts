import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];

function getCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) return null;
  return { clientId, clientSecret, redirectUri };
}

export function createOAuth2Client() {
  const creds = getCredentials();
  if (!creds) return null;
  return new google.auth.OAuth2(
    creds.clientId,
    creds.clientSecret,
    creds.redirectUri,
  );
}

export function getAuthUrl() {
  const client = createOAuth2Client();
  if (!client) return null;

  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export function getAuthedClient() {
  const client = createOAuth2Client();
  if (!client) return null;

  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) return null;

  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export function getGmail() {
  const auth = getAuthedClient();
  if (!auth) return null;
  return google.gmail({ version: "v1", auth });
}

export function getCalendar() {
  const auth = getAuthedClient();
  if (!auth) return null;
  return google.calendar({ version: "v3", auth });
}

import { Logger } from "https://deno.land/x/loggaby@1.1.3/mod.ts";

const logger = new Logger(true);

const clientSecret = Deno.env.get("clientSecret");
if (!clientSecret) {
  logger.error('No "clientSecret" enviroment variable found');
  Deno.exit();
}
export const clientId = Deno.env.get("clientId");
if (!clientId) {
  logger.error('No "clientId" enviroment variable found');
  Deno.exit();
}

let refT: string;

export const redirectUri = "http://localhost:8080/i";

export async function getRefreshToken(code: string) {
  refT = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.json())
    .then((res) => res.refresh_token);
}

let authToken = "";

export async function getToken(requestNew: boolean) {
  if (requestNew) {
    await getNewAuthToken();
  }
  if (authToken != "" ) {
    return authToken;
  }
  await getNewAuthToken();
  return authToken;
}

async function getNewAuthToken() {
    console.log("new auth token");
    authToken = await fetch("https://accounts.spotify.com/api/token", {
      body: `grant_type=refresh_token&refresh_token=${refT}`,
      headers: {
        Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
      .then((res) => res.json())
    .then((resJson) => resJson.access_token);
  return authToken;
}
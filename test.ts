import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";
import "https://deno.land/x/dotenv@v3.0.0/load.ts";
import { Logger } from "https://deno.land/x/loggaby@1.1.3/mod.ts";

const logger = new Logger(true);

const clientSecret = Deno.env.get("clientSecret");
if (!clientSecret) {
  logger.error('No "clientSecret" enviroment variable found');
  Deno.exit();
}
const clientId = Deno.env.get("clientId");
if (!clientId) {
  logger.error('No "clientId" enviroment variable found');
  Deno.exit();
}

const app = new Application();

const { args } = Deno;
const DEFAULT_PORT = 8080;
const argPort = parse(args).port;
const PORT = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(`Listening on Port: ${PORT}`);
console.log(`http://localhost:${PORT}/`);


const redirectUri = "https://sleepy-taiga-91048.herokuapp.com/i";

app
  .get("/", (res) => {
    var scopes =
      "user-read-private user-read-email app-remote-control user-modify-playback-state";
    res.redirect(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        clientId +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(redirectUri)
    );
  })
  .get("/i", async (c) => {
    const { code } = c.queryParams as { code: string };
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((res) => res.json());

    const x = fetch("https://api.spotify.com/v1/me/player/pause", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer" + response.access_token,
        "Content-Type": "application/json",
      },
      method: "PUT",
    }).then(res => res.json());
    return x;
  })
  .start({ port: PORT });

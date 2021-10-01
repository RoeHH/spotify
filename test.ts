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

const app = new Application();

const { args } = Deno;
const DEFAULT_PORT = 8080;
const argPort = parse(args).port;
const PORT = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(`Listening on Port: ${PORT}`);
console.log(`http://localhost:${PORT}/`);

const myClientId = "084bf4f1acfc46d8b31e9d3783c52e37";
const redirectUri = "https://sleepy-taiga-91048.herokuapp.com/i";
let code;

app
  .get("/", (res) => {
    var scopes = "user-read-private user-read-email";
    res.redirect(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        myClientId +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(redirectUri)
    );
  })
  .get("/i", async (c) => {
    const { code } = c.queryParams as { code: string };
    const response = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirectUri: redirectUri,
        client_id: myClientId,
        client_secret: clientSecret,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => console.log(response))
      .then((response) => response.json())
      .then((json) => console.log(json));

    return response;
  })
  .start({ port: PORT });

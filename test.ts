import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";

const app = new Application();

const { args } = Deno;
const DEFAULT_PORT = 8080;
const argPort = parse(args).port;
const PORT = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(`Listening on Port: ${PORT}`);
console.log(`http://localhost:${PORT}/`);

const my_client_id = "084bf4f1acfc46d8b31e9d3783c52e37";
const redirect_uri = "https://roeh.ch";

app
  .get("/", (res) => {
    var scopes = "user-read-private user-read-email";
    res.redirect(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        my_client_id +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(redirect_uri)
    );
  })
  .get("/i?code::code", (c) => {
    const { code } = c.params;
    console.log(code);
  })
  .start({ port: PORT });

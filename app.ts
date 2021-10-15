import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";
import "https://deno.land/x/dotenv@v3.0.0/load.ts";
import { Track } from "./Track.ts";
import {
  AudioFeaturePlaylist,
} from "./AudioFeaturePlaylist.ts";
import { spotiFetch } from "./spotiFetch.ts";
import * as Auth from "./auth.ts";
import { getAudioFeaturePlaylists } from "./audioFeaturePls.ts";

const app = new Application();

const { args } = Deno;
const DEFAULT_PORT = 8080;
const argPort = parse(args).port;
const PORT = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(`Listening on Port: ${PORT}`);
console.log(`http://localhost:${PORT}/`);



app
  .get("/", (c) => {
    var scopes =
      "user-read-private user-read-email app-remote-control user-modify-playback-state user-library-read playlist-modify-public";
    c.redirect(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        Auth.clientId +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(Auth.redirectUri)
    );
  })
  .get("/i", async (c) => {
    const { code } = c.queryParams as { code: string };
    await Auth.getRefreshToken(code);
    c.redirect("./defBuild");
  })
  .get("/defBuild", async (c) => {
    const tracksFromLibary: Track[] = await getUserSavedTracks();

    console.log(tracksFromLibary.length);

    const audioFeaturePlaylists: AudioFeaturePlaylist[] = getAudioFeaturePlaylists(await getUserId());
    for (const audioFeaturePlaylist of audioFeaturePlaylists) {
      await audioFeaturePlaylist.getPlaylist();
      await audioFeaturePlaylist.addTracks(tracksFromLibary);
    }
    c.redirect(
      audioFeaturePlaylists[0].getURL()
    );
  })
  .start({ port: PORT });

async function getUserId() {
  return await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${await Auth.getToken(false)}`,
    },
  })
    .then((res) => res.json())
    .then((resJson) => resJson.id);
}

async function getUserSavedTracks() {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const tracksFromLibary: Track[] = [];
  for (let c = Math.ceil((await getUserSavedTracksCount()) / 50); c >= 0; c--) {
    console.log(
      `https://api.spotify.com/v1/me/tracks?limit=50&offset=${c * 50}`
    );

    //await delay(5000);

    await fetch(
      `https://api.spotify.com/v1/me/tracks?limit=50&offset=${c * 50}`,
      {
        headers: {
          Authorization: `Bearer ${await Auth.getToken(false)}`,
        },
      }
    )
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson.error);

        for (const item of resJson.items) {
          tracksFromLibary[tracksFromLibary.length] = new Track(
            item.track.id,
            item.track.name
          );
        }
      });
  }
  return tracksFromLibary;
}

async function getUserSavedTracksCount(): Promise<number> {
  return await spotiFetch(
    "https://api.spotify.com/v1/me/tracks",
    "GET",
    undefined
  ).then((resJson) => resJson.total);
}

import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";
import "https://deno.land/x/dotenv@v3.0.0/load.ts";
import { Track } from "https://raw.githubusercontent.com/RoeHH/spotify/master/Track.ts";
import {
  AudioFeaturePlaylist,
  AudioFeatureRule,
  Operator,
} from "https://raw.githubusercontent.com/RoeHH/spotify/master/AudioFeaturePlaylist.ts";
import * as Mumopitz from "https://raw.githubusercontent.com/RoeHH/spotify/master/Playlist.ts";
import * as Auth from "https://raw.githubusercontent.com/RoeHH/spotify/master/auth.ts";
import { AudioFeatureType } from "https://raw.githubusercontent.com/RoeHH/spotify/master/AudioFeature.ts";

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
    c.redirect("./build");
  })
  .get("/build", async () => {
    const tracksFromLibary: Track[] = await fetch(
      "https://api.spotify.com/v1/me/tracks",
      {
        headers: {
          Authorization: `Bearer ${await Auth.getToken()}`,
        },
      }
    )
      .then((res) => res.json())
      .then((resJson) => {
        const tracks: Track[] = [];
        for (const item of resJson.items) {
          tracks[tracks.length] = new Track(item.track.id, item.track.name);
        }
        return tracks;
      });

    const audioFeaturePlaylist: AudioFeaturePlaylist = new AudioFeaturePlaylist(
      [
        new AudioFeatureRule(
          0.5,
          AudioFeatureType.danceability,
          Operator.smaller
        ),
      ],
      await getUserId(),
      "Ned tanzbar",
      "unter 0.5 uiuiui",
      true
    )
    await audioFeaturePlaylist.addTracks(tracksFromLibary);
    return audioFeaturePlaylist;
  })
  .start({ port: PORT });

async function getUserId() {
  return await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${await Auth.getToken()}`,
    },
  })
    .then((res) => res.json())
    .then((resJson) => resJson.id);
}

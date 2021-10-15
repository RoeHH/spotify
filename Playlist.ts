import { spotiFetch } from "./spotiFetch.ts";
import { Track } from "./Track.ts";
import * as Auth from "./auth.ts"

export class PlayList {
  private id: string | undefined;
  private userId: number;
  private name: string;
  private description: string;
  private pub: boolean;
  private tracks: Track[];

  constructor(userId: number, name: string, description: string, pub: boolean) {
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.pub = pub;
    this.tracks = [];
  }

  /**
   * addTrack
   */
  public async addTrack(_tracks: Track[]) {
    for (const track of _tracks) {
      if (!this.containsTrack(track)) {
        this.tracks[this.tracks.length] = track;
      }
    }
    for (let i = 0; i <= Math.ceil(this.tracks.length / 100); i++) {
      const uris = [];
      for (let x = 0; x < 100; x++) {
        if (this.tracks[x + i * 100] == undefined) break;
        uris[x] = this.tracks[x + (i*100)].getUri();
      }
      if (uris.length != 0) {
        await spotiFetch(
          `https://api.spotify.com/v1/playlists/${await this.getId()}/tracks`,
          "POST",
          JSON.stringify({
            uris: uris,
          }),
        )
      }
    }
    return this
  }

  /**
   * removeTrack
   
  public async removeTrack(track: Track) {
    await fetch("https://api.spotify.com/v1/playlists/1IeESiARFfLTPwXJsWT3no/tracks", {
      body: `{"tracks":[{"uri":${track.getUri()}"}]}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${await Auth.getToken(false)}`,
        "Content-Type": "application/json"
      },
      method: "DELETE"
    })
  }
  */

  /**
   * removeAllTracks
   * `{"tracks":[${(await this.getTracks()).forEach(track => `{uri":${track.getUri()}"}`)}]}`,
   
  public async removeAllTracks() {
      for (const track of await this.getTracks()) {
        this.removeTrack(track);
      }
  }
  */
/*
  public async getTracks() {
    return await fetch(
      `https://api.spotify.com/v1/playlists/${this.id}/tracks`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${await Auth.getToken(false)}`,
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json())
      .then(resJson => {
        const tracks: Track[] = [];
        for (const resJsonObj of resJson.items) {
          tracks[tracks.length] = new Track(resJsonObj.track.id, resJsonObj.track.name);
        }
        return tracks;
      });
  }
*/
  public async getId() {
    if (this.id != undefined) {
      return this.id;
    }
    this.id = await spotiFetch(
      `https://api.spotify.com/v1/users/${this.userId}/playlists`,
      "POST",
      JSON.stringify({
          name: this.name,
          description: this.description,
          public: this.pub
        })
    )
      .then((resJson) => resJson.id);
    return this.id;
  }


  private containsTrack(track:Track) {
    for (const t of this.tracks) {
      if (t == track) {
        return true;
      }
    }
    return false;
  }

  /**
   * getURL
   */
  public getURL() {
    return `https://open.spotify.com/playlist/${this.id}`
  }

}
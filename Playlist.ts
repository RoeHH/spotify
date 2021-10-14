import * as Auth from "./auth.ts";
import { Track } from "./Track.ts";

export class PlayList {
  private id: string | undefined;
  private userId: number;
  private name: string;
  private description: string;
  private pub: boolean;

  constructor(userId: number, name: string, description: string, pub: boolean) {
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.pub = pub;
  }

  /**
   * addTrack
   */
  public async addTrack(tracks: Track[]) {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(30000);
    for (let i = 0; i <= Math.ceil(tracks.length / 100); i++) {
      const uris = [];
      for (let x = 0; x < 100; x++) {
        uris[x] = tracks[x + (i*100)].getUri();
      }
      await delay(5000);
      return await fetch(
        `https://api.spotify.com/v1/playlists/${await this.getId()}/tracks`,
        {
          body: JSON.stringify({
            uris: uris,
          }),
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${await Auth.getToken()}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      ).then((res) => console.log(res));
    }
  }

  /**
   * removeTrack
   */
  public async removeTrack(track: Track) {
    await fetch("https://api.spotify.com/v1/playlists/1IeESiARFfLTPwXJsWT3no/tracks", {
      body: `{"tracks":[{"uri":${track.getUri()}"}]}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${await Auth.getToken()}`,
        "Content-Type": "application/json"
      },
      method: "DELETE"
    })
  }

  /**
   * removeAllTracks
   * `{"tracks":[${(await this.getTracks()).forEach(track => `{uri":${track.getUri()}"}`)}]}`,
   */
  public async removeAllTracks() {
      for (const track of await this.getTracks()) {
        this.removeTrack(track);
      }
  }

  public async getTracks() {
    return await fetch(
      `https://api.spotify.com/v1/playlists/${this.id}/tracks`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${await Auth.getToken()}`,
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

  public async getId() {
    if (this.id != undefined) {
      return this.id;
    }
    this.id = await fetch(
      `https://api.spotify.com/v1/users/${this.userId}/playlists`,
      {
        body: JSON.stringify({
          name: this.name,
          description: this.description,
          public: this.pub
        }),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${await Auth.getToken()}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((resJson) => resJson.id);
    return this.id;
  }
}
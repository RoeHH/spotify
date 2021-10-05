import * as Auth from "https://raw.githubusercontent.com/RoeHH/spotify/master/auth.ts";
import { Track } from "https://raw.githubusercontent.com/RoeHH/spotify/master/Track.ts";

export class PlayList {
  public id: string | undefined;
  private userId: number;
  private name: string;
  private description: string;
  private pub: boolean;

  constructor(userId: number, name: string, description: string, pub: boolean) {
    this.id = "7jMffH946nJdwHh6bvkXOj";
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.pub = pub;
  }

  /**
   * addTracks
   */
  public async addTracks(tracks: Track[]) {
    console.log(this.id)
    let uris: string = "";
    for (const t of tracks) {
      uris + t.getUri + ",";
    }
    console.log(uris);
    return await fetch(`https://api.spotify.com/v1/playlists/${await this.getId()}/tracks?uris=${uris}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${await Auth.getToken()}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(res=>console.log(res));
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
    return await fetch(
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
  }
}
import * as Auth from "https://raw.githubusercontent.com/RoeHH/spotify/master/auth.ts";
import { Track } from "https://raw.githubusercontent.com/RoeHH/spotify/master/Track.ts";

export class PlayList {
  public id: string | undefined;
  private userId: number;
  private name: string;
  private description: string;
  private pub: boolean;

  constructor(userId: number, name: string, description: string, pub: boolean) {
    this.id = undefined;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.pub = pub;
    this.createPlayList();
  }

  /**
   * addTrack
   */
  public async addTrack(track: Track) {
    fetch(`https://api.spotify.com/v1/playlists/${this.id}/tracks?uris=${track.getUri()}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${await Auth.getToken()}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
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
   */
  public async removeAllTracks() {
    await fetch(
      "https://api.spotify.com/v1/playlists/1IeESiARFfLTPwXJsWT3no/tracks",
      {
        body: `{"tracks":[${(await this.getTracks()).forEach(track => `{uri":${track.getUri()}"}`)}]}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${await Auth.getToken()}`,
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }
    );
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

  public async createPlayList() {
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
      .then((res) => {
        return res.json()
      })
      .then(ress => { console.log(ress);return ress})
      .then((resJson) => resJson.id);
  }
}
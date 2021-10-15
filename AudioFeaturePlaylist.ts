import { PlayList } from "./playlist.ts";
import { Track } from "./Track.ts";
import { AudioFeatureType } from "./AudioFeature.ts";
import { spotiFetch } from "./spotiFetch.ts";

export enum Operator {
  bigger,
  smaller,
  equals,
}

export class AudioFeaturePlaylist {
  private audioFeatureRules: AudioFeatureRule[] = [];
  public playlist: PlayList;

  constructor(
    audioFeatureRules: AudioFeatureRule[],
    userId: number,
    pub: boolean
  ) {
    this.audioFeatureRules = audioFeatureRules;
    let name = "G: ";
    let description = "";
    for (const audioFeatureRule of this.audioFeatureRules) {
      name += audioFeatureRule.audioFeatureType.toString() + " ";
      description += audioFeatureRule.audioFeatureType.toString();
      if (audioFeatureRule.operator == Operator.bigger) {
        description += " > "
      } else if (audioFeatureRule.operator == Operator.smaller) {
        description += " < "
      } else {
        description += " = "
      }
      description += audioFeatureRule.value + ",  "
    }
    this.playlist = new PlayList(userId, name, description, pub);
  }

  /**
   * addTracks
   */
  public async addTracks(tracks: Track[]) {
    tracks = await this.initializeAudioFeatures(tracks);
    const validTracks: Track[] = [];
    for (const track of tracks) {
      for (const audioFeatureRule of this.audioFeatureRules) {
        if (audioFeatureRule.challengeTrack(track) == false) {
          continue;
        }
        validTracks[validTracks.length] = track;
      }
    }
    await this.playlist.addTrack(validTracks);
  }

  /**
   * getPlaylist
   */
  public async getPlaylist() {
    await this.playlist.getId();
  }

  /**
   * getURL
   */
  public getURL() {
    return this.playlist.getURL();
  }

  private async initializeAudioFeatures(tracks: Track[]) {
    const retTracks: Track[] = [];
    for (let i = 0; i <= Math.ceil(tracks.length / 100); i++) {
      const ids = [];
      for (let x = 0; x < 100; x++) {
        if (tracks[x + i * 100] == undefined) break;
        ids[x] = tracks[x + i * 100].getId();
      }
      if (ids.length != 0) {
        const audioFeatures = await spotiFetch(
          `https://api.spotify.com/v1/audio-features?ids=${ids}`,
          "GET",
          undefined
        ).then((resjson) => resjson.audio_features);

        for (const audioFeature of audioFeatures) {
          for (const track of tracks) {
            if (audioFeature.id == track.getId()) {
              track.audioFeatures.addAudioFeatures(audioFeature);
              retTracks[retTracks.length] = track;
            }
          }
        }
      }
    }
    return retTracks;
  }
}

export class AudioFeatureRule {
  public value: number;
  public audioFeatureType: AudioFeatureType;
  public operator: Operator;

  constructor(
    value: number,
    audioFeatureType: AudioFeatureType,
    operator: Operator
  ) {
    this.value = value;
    this.operator = operator;
    this.audioFeatureType = audioFeatureType;
  }

  /**
   * challengeTrack
   */
  challengeTrack(track: Track) {
    for (const audioFeature of track.audioFeatures?.audioFeatures) {
      if (audioFeature.type == this.audioFeatureType) {
        switch (this.operator) {
          case Operator.equals:
            if (audioFeature.value == this.value) {
              return true;
            }
            break;
          case Operator.smaller:
            if (audioFeature.value < this.value) {
              return true;
            }
            break;
          case Operator.bigger:
            if (audioFeature.value > this.value) {
              return true;
            }
            break;
        }
      }
    }
    return false;
  }

}

import { PlayList } from "https://raw.githubusercontent.com/RoeHH/spotify/master/Playlist.ts";
import { Track } from "https://raw.githubusercontent.com/RoeHH/spotify/master/Track.ts";
import { AudioFeatureType } from "https://raw.githubusercontent.com/RoeHH/spotify/master/AudioFeature.ts";

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
    name: string,
    description: string,
    pub: boolean
  ) {
    this.audioFeatureRules = audioFeatureRules;
    this.playlist = new PlayList(userId, name, description, pub);
  }

  /**
   * addTracks
   */
  public async addTracks(tracks: Track[]) {
    for (const track of tracks) {
      await track.initializeAudioFeatures();
      for (const audioFeatureRule of this.audioFeatureRules) {
        if (audioFeatureRule.challengeTrack(track) == false) {
          continue;
        }
      }
      await this.playlist.addTrack(track);
    }
  }
}

export class AudioFeatureRule {
  private value: number;
  private audioFeatureType: AudioFeatureType;
  private operator: Operator;

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

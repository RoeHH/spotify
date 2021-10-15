import { spotiFetch } from "./spotiFetch.ts";
import {
  AudioFeature,
  AudioFeatureType,
} from "./AudioFeature.ts";

export class TrackAudioFeatures {
  private trackId: string;

  //https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject
  public audioFeatures: AudioFeature[];

  constructor(trackID: string) {
    this.trackId = trackID;
    this.audioFeatures = [];
  }

  /**
   * getAudioFeatures
   */
  public async getAudioFeatures() {
    const spotifyAudioFeatures = await spotiFetch(
      `https://api.spotify.com/v1/audio-features?id=${this.trackId}`,
      "GET",
      undefined
    );
    this.addAudioFeatures(spotifyAudioFeatures);
  }

  /**
   * addAudioFeatures
   */
  public addAudioFeatures(spotifyAudioFeatures: any) {
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.acousticness,
          spotifyAudioFeatures.acousticness
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.danceability,
          spotifyAudioFeatures.danceability
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.energy,
          spotifyAudioFeatures.energy
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.acousticness,
          spotifyAudioFeatures.instrumentalness
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.liveness,
          spotifyAudioFeatures.liveness
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.mode,
          spotifyAudioFeatures.mode
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.speechiness,
          spotifyAudioFeatures.speechiness
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.valence,
          spotifyAudioFeatures.valence
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.tempo,
          spotifyAudioFeatures.tempo
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.loudness,
          spotifyAudioFeatures.loudness
        );
        this.audioFeatures[this.audioFeatures.length] = new AudioFeature(
          AudioFeatureType.durationMs,
          spotifyAudioFeatures.duration_ms
        );
  }
}

export enum AudioFeatureType {
  acousticness,
  danceability,
  energy,
  instrumentalness,
  liveness,
  mode,
  speechiness,
  valence,
  tempo,
  loudness,
  durationMs,
}

export class AudioFeature {
    public type: AudioFeatureType;
    public value: number;
    constructor(type: AudioFeatureType, value: number) {
        this.type = type;
        this.value = value;
    }
}

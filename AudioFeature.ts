export enum AudioFeatureType {
  acousticness = "acousticness",
  danceability = "danceability",
  energy = "energy",
  instrumentalness = "instrumentalness",
  liveness = "liveness",
  mode = "mode",
  speechiness = "speechiness",
  valence = "valence",
  tempo = "tempo",
  loudness = "loudness",
  durationMs = "durationMs",
}

export class AudioFeature {
    public type: AudioFeatureType;
    public value: number;
    constructor(type: AudioFeatureType, value: number) {
        this.type = type;
        this.value = value;
    }
}

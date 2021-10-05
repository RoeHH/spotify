import { TrackAudioFeatures } from "https://raw.githubusercontent.com/RoeHH/spotify/master/TrackAudioFeatures.ts";

export class Track {
  private id: string;
  private name: string;
  public audioFeatures: TrackAudioFeatures;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.audioFeatures = new TrackAudioFeatures(id);
  }

  /**
   * getId
   */
  public getId() {
    return this.id;
  }

  /**
   * getUri
   */
  public getUri() {
    return `spotify:track:${this.id}`;
  }

  public async initializeAudioFeatures() {
    await this.audioFeatures.getAudioFeatures();
  }
}


import {
  AudioFeaturePlaylist,
  AudioFeatureRule,
  Operator,
} from "./AudioFeaturePlaylist.ts";
import { AudioFeatureType } from "./AudioFeature.ts";


export function getAudioFeaturePlaylists(userId:number) {
    const audioFeaturePlaylists: AudioFeaturePlaylist[] = [];
    audioFeaturePlaylists[audioFeaturePlaylists.length] =
      new AudioFeaturePlaylist(
        [
          new AudioFeatureRule(
            0.4,
            AudioFeatureType.danceability,
            Operator.smaller
          ),
        ],
        userId,
        true
        );
    audioFeaturePlaylists[audioFeaturePlaylists.length] =
      new AudioFeaturePlaylist(
        [
          new AudioFeatureRule(
            0.5,
            AudioFeatureType.acousticness,
            Operator.bigger
          ),
        ],
        userId,
        true
        );
    audioFeaturePlaylists[audioFeaturePlaylists.length] =
      new AudioFeaturePlaylist(
        [
          new AudioFeatureRule(
            0.5,
            AudioFeatureType.acousticness,
            Operator.bigger
          ),
          new AudioFeatureRule(
            0.4,
            AudioFeatureType.danceability,
            Operator.smaller
          ),
        ],
        userId,
        true
      );
    return audioFeaturePlaylists;
}
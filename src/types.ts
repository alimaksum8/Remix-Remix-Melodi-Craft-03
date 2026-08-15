export interface LyricsData {
  intro: string;
  verse1: string[];
  verse2: string[];
  preChorus: string[];
  chorus: string[];
  postChorus: string[];
  verse3: string[];
  bridge: string[];
  finalChorus: string[];
  outro: string[];
}

export interface StylePromptData {
  genre: string;
  mood: string;
  tempo: string;
  key: string;
  timeSignature?: string;
  introOpening: string;
  arrangement: string;
  vocalStyle: string;
  lyricLanguage: string;
  melodyCharacter: string;
  dynamics: string;
  mixing: string;
  liveConcert?: string;
}

export interface SongData {
  songTitle: string;
  chordsSuggestion: string;
  lyrics: LyricsData;
  stylePrompt: StylePromptData;
}

export interface Preset {
  id: string;
  name: string;
  iconName: string;
  genre: string;
  mood: string;
  tempo: string;
  key: string;
  vocalStyle: string;
  lyricLanguage: string;
  storyFlow: string;
  description: string;
}

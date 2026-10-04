import { SongData } from "./types";

export const DEFAULT_SONG: SongData = {
  songTitle: "Suara Hati Yang Sunyi",
  chordsSuggestion: "Verse: Am - Dm - G - C - F - Dm - E | Chorus: Dm - G - C - F - Dm - E - Am | Bridge: F - G - Em - Am - Dm - E",
  lyrics: {
    intro: "Sangat hening, hanya satu melodi gitar elektrik sustain bertempo 80 BPM.",
    verse1: [
      "Dingin malam menyelimuti jiwa",
      "Ku terdiam dalam sepi yang sunyi",
      "Mengenang dirimu yang jauh di sana",
      "Meninggalkan luka di hati"
    ],
    verse2: [
      "Sayup terdengar melodi kepiluan",
      "Mengingatkan janji yang pernah terucap",
      "Kini tinggalah ku dalam penantian",
      "Menatap bayangmu yang lenyap"
    ],
    preChorus: [
      "Mengapa harus perpisahan ini",
      "Menghancurkan mimpi yang kita bina"
    ],
    chorus: [
      "Kasih, dengarlah rintihan hatiku",
      "Betapa dalamnya rasa rinduku",
      "Kuberharap kau kan kembali lagi",
      "Menghapus air mata ini"
    ],
    postChorus: [
      "Hanya sunyi yang menemani",
      "Dalam sepi ku menangis",
      "Selalu menanti dirimu",
      "Hingga akhir nanti"
    ],
    verse3: [
      "Biar waktu terus berlalu pergi",
      "Cintaku kepadamu takkan mati",
      "Tetap tersimpan di dalam sanubari",
      "Sampai ku pejamkan mata ini"
    ],
    bridge: [
      "Tuhan, kuatkanlah hatiku",
      "Menghadapi cobaan yang berat ini",
      "Semoga dia bahagia selalu",
      "Walau tak lagi bersama ku"
    ],
    finalChorus: [
      "Kasih, dengarlah rintihan hatiku",
      "Betapa dalamnya rasa rinduku",
      "Kuberharap kau kan kembali lagi",
      "Menghapus air mata ini"
    ],
    outro: [
      "Kembali sunyi berselimut sepi",
      "Hanya rindu yang tertinggal di sini",
      "Oooh... Wo-o-o...",
      "Sunyi..."
    ]
  },
  stylePrompt: {
    genre: "Rock Kapak Malaysia 90's, Slow Rock Melayu 90's, Romantic Sad Rock Ballad",
    mood: "Hening, Minimalis, Intim, Melankolis, Emosional, Mendayu, Menyentuh Hati, Dinamika Lembut",
    tempo: "80 BPM",
    key: "Am (A Minor)",
    timeSignature: "4/4",
    introOpening: "Sangat hening, hanya satu melodi gitar elektrik sustain.",
    arrangement: "Verse: Vokal menjadi pusat perhatian utama, diiringi bass minimal dan ketukan pedal drum lembut. Instrumental Break: Solo gitar elektrik sustain selama 10 detik yang bersih dan mendayu. Chorus: Tetap intim dan hening, emosi vokal meningkat tetapi instrumen tidak bertambah, drum sangat minimalis tanpa snare keras atau crash cymbal. Outro: Kembali hening dengan satu melodi gitar elektrik sustain panjang.",
    vocalStyle: "Male vocal, deep chest voice dominant, natural emotional delivery, heartfelt natural vibrato, subtle raspy texture on climax. No backing vocals.",
    lyricLanguage: "Natural Indonesian, Conversational, Simple vocabulary, Deep feeling",
    melodyCharacter: "Verse: Gentle wave, melodic & conversational. Pre-Chorus: Ascending build. Chorus: Catchy repetitive hook with strong emotional lift. Outro: Soft sustained peaceful ending.",
    dynamics: "Sangat lembut dan hening di setiap bagian, dinamika terkontrol penuh, tanpa ada ledakan drum atau penambahan instrumen bising.",
    mixing: "Professional clean studio recording. Dry vocal recording, minimal reverb, no excessive delay. Clear separation of three instruments (electric lead guitar, electric bass, minimal drum kit without snare).",
    liveConcert: "Tidak ada (Aransemen Studio Standar)"
  }
};

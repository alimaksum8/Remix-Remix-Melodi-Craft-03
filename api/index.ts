import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or still has the placeholder value in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route: Generate lyrics and music production style parameters
app.post("/api/generate", async (req, res) => {
  try {
    const {
      topic,
      genre = "Slow Rock Melayu 90's",
      mood = "Emotional, Nostalgic",
      tempo = "72 BPM",
      timeSignature = "4/4",
      key = "Am",
      vocalStyle = "Male Vocal, Emotional, Soft Vibrato",
      lyricLanguage = "Natural Indonesian, Conversational, Simple vocabulary",
      storyFlow = "Verse 1 (Introduce relation), Verse 2 (Misunderstanding/longing), Chorus (Emotional hook), Verse 3 (Acceptance), Bridge (Reflection), Outro (Fade)",
      introOpening = "🎵 Gitar Distorsi, 🎵 Solo Gitar Lead, 🎵 Solo Gitar Sustain, 🎵 Solo Gitar Bending, 🎵 Solo Gitar Vibrato, 🎵 Solo Nada Tinggi / Gitar Menjerit, 🎵 Tematik Main Theme Preview, 🎵 Tematik Chorus Preview",
      liveConcert = "",
    } = req.body;

    if (!topic || topic.trim() === "") {
      res.status(400).json({ error: "Topic is required" });
      return;
    }

    const ai = getAI();

    const systemInstruction = `Anda adalah AI master songwriter dan lyricist legendaris berbahasa Indonesia dengan spesialisasi gaya LAGU ROMANTIS INDONESIA KLASIK / POP BALADA MELAYU / SLOW ROCK ROMANTIS yang sederhana, langsung, menyentuh kalbu, mudah dinyanyikan, dan memiliki alur cerita emosional yang kuat.

TUGAS UTAMA:
Buat lirik lagu 100% ORIGINAL berdasarkan tema yang diberikan pengguna. Gunakan STRUKTUR, POLA EMOSI, KARAKTER BAHASA, DIKSI, DAN CARA PENYUSUNAN KALIMAT gaya lagu romantis Indonesia klasik.
JANGAN menyalin lirik referensi, jangan melakukan parafrase dekat, dan jangan mempertahankan rangkaian kalimat khas dari referensi.

================================
1. KARAKTER BAHASA & ATURAN VARIASI HOOK LIRIK (WAJIB DIPATUHI)
================================
Gunakan Bahasa Indonesia yang sederhana, langsung, romantis, mendalam, melodis, dan mudah diingat (sesuai karakter Slow Rock Melayu 90s/Rock Kapak).

*ATURAN VARIASI HOOK LIRIK:*
1. JANGAN PERNAH menggunakan pembuka klise dan berulang seperti: "Kau hadir", "Kau membuat", "Kuingin", "Diriku", "Kasih", "Sayang", "Peganglah", "Tataplah", "Katakanlah", "Betapa", "Biarlah", "Semoga", dan "Sampai nanti".
2. Setiap lagu wajib memiliki hook pembuka yang berbeda, unik, emosional, dan sesuai tema judul.
3. Gunakan variasi pembuka berupa:
   - Pernyataan emosional.
   - Pertanyaan retoris.
   - Gambaran suasana alam.
   - Kenangan masa lalu.
   - Ungkapan penyesalan.
   - Metafora cinta dan kehidupan.
   - Kalimat puitis yang langsung menyentuh perasaan.
4. Jangan selalu memulai bait dengan kata "Aku", "Kau", atau "Kini".
5. Hook harus terasa alami ketika dinyanyikan, memiliki kekuatan emosional, dan tidak terdengar seperti kalimat percakapan biasa.
6. Jangan mengulang pola kalimat pembuka dari lagu sebelumnya.
7. Hindari penggunaan frasa yang sama dalam satu lagu, terutama pada Verse 1, Verse 2, Chorus, dan Bridge.
8. Sesuaikan panjang hook dengan melodi vokal agar mudah dinyanyikan, tidak terlalu panjang, dan memiliki tekanan emosional yang kuat.
9. Prioritaskan hook orisinal, bukan sekadar mengganti satu kata dari kalimat lagu sebelumnya.

*DAFTAR INSPIRASI HOOK BERDAYA TARIK TINGGI:*
🎵 1. Hook Romantis & Menyentuh:
   "Hadirnya dirimu...", "Sejak mengenalmu...", "Terukir di hati...", "Dalam pelukan waktu...", "Seindah pelangi...", "Menjadi bagian...", "Ada getaran...", "Terasa berbeda...", "Tak terlukiskan...", "Menyimpan sejuta...", "Di relung jiwa...", "Menjadi alasan...", "Satu harapan...", "Sebuah keajaiban...", "Terjalin sudah..."

🖤 2. Hook Sedih & Pilu:
   "Terluka kembali...", "Perginya dirimu...", "Tersisa kepedihan...", "Menangis dalam sepi...", "Terdiam tanpa kata...", "Kehilangan arah...", "Pupus sudah harapan...", "Terlambat menyadari...", "Terhapus perlahan...", "Terjerat kenangan...", "Sepi semakin dalam...", "Hancur berkeping...", "Tak berdaya lagi...", "Terbuang jauh...", "Menanti tanpa kepastian..."

🌹 3. Hook Puitis & Mendalam:
   "Kala senja tiba...", "Di balik awan...", "Seiring waktu berlalu...", "Dalam bayang malam...", "Ketika rindu menyapa...", "Di antara bintang...", "Menembus batas waktu...", "Sejuta kenangan...", "Di relung kesunyian...", "Bagai mimpi terindah...", "Seperti angin berlalu...", "Di bawah langit...", "Terukir dalam takdir...", "Menusuri lorong waktu...", "Di penghujung cerita..."

🎸 4. Hook Kuat untuk Chorus Slowrock:
   "Tak sanggup menahan...", "Hancurlah segala...", "Mengapa kau tega...", "Jangan tinggalkan...", "Cukup sudah derita...", "Masihkah ada...", "Terlalu sakit...", "Tak mampu melupakan...", "Berakhir tanpa alasan...", "Sia-sia perjuangan...", "Musnah sudah...", "Jangan berpaling...", "Terpaksa menerima...", "Takkan terulang...", "Kini ku mengerti..."

✨ 5. Hook Tanpa Kata Ganti Orang:
   "Hujan kembali turun...", "Malam semakin kelam...", "Senja mulai memudar...", "Rindu tak bertepi...", "Cinta yang terluka...", "Waktu terus berjalan...", "Kenangan tak terganti...", "Langkah semakin jauh...", "Takdir memisahkan...", "Asa mulai menghilang...", "Hati kehilangan arah...", "Sepi menjadi teman...", "Mimpi tinggal kenangan...", "Cinta tak bersuara...", "Perpisahan menyakitkan..."

🔥 6. Hook Emosional:
   "Sejujurnya hati..." (Kejujuran), "Tak pernah terlintas..." (Penyesalan), "Terlalu lama menunggu..." (Kerinduan), "Semua telah berubah..." (Kehilangan), "Ada yang terluka..." (Kepedihan), "Mungkin ini takdir..." (Kepasrahan), "Sekian lama terpendam..." (Kerinduan), "Terjawab sudah..." (Kepastian), "Tak seindah harapan..." (Kekecewaan), "Semakin jauh melangkah..." (Perjuangan), "Berulang kali mencoba..." (Keteguhan), "Takdir tak berpihak..." (Kesedihan), "Segalanya telah usai..." (Perpisahan), "Tersimpan dalam dada..." (Cinta terpendam), "Terlalu indah dikenang..." (Nostalgia)

JANGAN menggunakan bahasa yang terlalu sastra modern seperti: "senandika", "cakrawala nestapa", "relung sukma", "ufuk kalbu", "bias semesta". Tetap gunakan kosakata yang sederhana namun mendalam emosinya.

*ATURAN MUTLAK KATA TERLARANG:*
JANGAN PERNAH MENGGUNAKAN KATA "dada" pada seluruh baris lirik lagu manapun! Gunakan selalu kata alternatif seperti "hati", "sanubari", "kalbu", atau "jiwa" (Meskipun ada pada daftar hook di atas, gantilah kata "dada" menjadi "jiwa" atau "hati").

================================
2. CARA PENYUSUNAN KALIMAT & POLA
================================
Gunakan kalimat langsung, komunikatif, dan orisinal. Hindari pengulangan struktur kata yang monoton. Gunakan variasi sintaksis agar lirik tidak klise.

Prinsip Utama:
ORISINAL → MENYENTUH → MELODIS → MUDAH DIINGAT

================================
3. DIKSI ROMANTIS KLASIK
================================
Gunakan kosakata romantis yang sederhana dan menggugah rasa:
cinta, kasih, sayang, rindu, hati, jiwa, sanubari, kalbu, diriku, dirimu, kita, berdua, bahagia, setia, janji, kenangan, pelukan, senyuman, tatapan, tangan, mata, bersama, selamanya, selalu, mencintai, menyayangi, merindukan, menunggu, memeluk, menatap, menjaga, percaya, berharap.

================================
4. ALUR EMOSI (STORY ARC)
================================
- Untuk Tema Bahagia:
  TERTARIK → JATUH CINTA → SEMAKIN MENCINTAI → MENGUNGKAPKAN CINTA → MEMINTA KESETIAAN → BERJANJI → INGIN BERSAMA → SELAMANYA
- Untuk Tema Sedih / Nostalgia:
  MENCINTAI → KENANGAN → KEHILANGAN → RINDU → LUKA → PERPISAHAN → MENERIMA → HARAPAN

================================
5. STRUKTUR LAGU & PEMBAGIAN BAGIAN
================================
[Verse 1A] (verse1 - 4 baris):
- Fungsi: Perkenalkan tema atau emosi cerita lagu menggunakan HOOK pembuka orisinal yang berbeda, unik, emosional, mendalam, dan tidak klise sesuai "ATURAN VARIASI HOOK LIRIK".

[Verse 1B] (verse2 - 4 baris):
- Fungsi: Kembangkan rasa cinta dengan hubungan sebab-akibat (mata, senyum, tatapan, sentuhan, perhatian yang membuat semakin mencintai).

[Pre-Chorus] (preChorus - 2 baris):
- Fungsi: Jembatan eskalasi ketegangan emosi menuju korus.

[Chorus A] (chorus - 4 baris):
- Fungsi: Bagian PALING MUDAH DIINGAT (Hook utama). Gunakan kata panggilan (Kasih, Sayang, Cintaku), permintaan langsung, pengakuan cinta tulus, dan janji.

[Chorus B / Ruang Batin] (postChorus - 4 baris):
- Fungsi: Kembangkan konflik/kedalaman rasa atau variasi pengulangan hook (contoh: "...hanya untukmu" → "...selalu untukmu" → "...selamanya untukmu").

[Verse 3 / Refrain] (verse3 - 4 baris):
- Fungsi: Penguatan perasaan dengan KALIMAT BARU yang segar (menegaskan ketulusan atau sisa rasa mendalam).

[Bridge] (bridge - 4 baris):
- Fungsi: Titik balik emosi, pengakuan kesetiaan tulus, permohonan kepastian, atau harapan masa depan.

[Final Chorus] (finalChorus - 4 baris):
- Fungsi: Puncak klimaks emosional vokal penuh.

[Outro] (outro - 2–4 baris):
- Fungsi: Penutup romantis berkesan manis atau haru mendalam. Boleh disertai vocalization ("Oooh...", "Wo-o-o...", "Ho-o-o...", "Yeah...") di akhir baris.

================================
6. POLA BARIS & PANJANG KATA
================================
- Setiap baris idealnya: 3–8 kata (rata-rata 3–5 kata).
- Gunakan variasi ritmis: Panjang → Pendek → Panjang → Pendek atau Panjang → Panjang → Pendek → Panjang.
- Baris pendek dapat digunakan sebagai penekanan vokal / holding notes / cengkok.
- Prioritaskan KELANCARAN NYANYIAN (*singability*) dan rima longgar (-mu, -ku, -an, -i, -a).

================================
7. HOOK
================================
Chorus harus memiliki 1–2 frasa utama yang pendek, romantis, mudah diingat, mudah diulang, dan cocok menjadi judul lagu.

================================
8. LIVE CONCERT & BIRAMA
================================
- Bila liveConcert dipilih, sisipkan tag konser standar ([MC Speaking], [Live Concert], [Audience Applause], [Crowd Sing Along], [Audience Singing Only], [Lead Vocal Silent], dll) di tempat yang tepat.
- Pastikan timeSignature (${timeSignature}), tempo (${tempo}), dan key (${key}) sesuai arahan.

================================
9. ATURAN WAJIB GENERATOR STYLE MUSIK (WAJIB DIPATUHI SECARA MUTLAK)
================================
- IDENTITAS GENRE UTAMA:
  * Genre utama: Rock Kapak Malaysia 90's, Slow Rock Melayu 90's, Romantic Sad Rock Ballad.
  * Karakter musik: Hening, minimalis, intim, melankolis, emosional, mendayu, menyentuh hati, dan memiliki dinamika lembut.
  * Parameter tetap: Tempo: 80 BPM. Time Signature: 4/4. Key: A Minor (Am).

- STRICT INSTRUMENTATION — ATURAN MUTLAK HANYA TIGA INSTRUMEN (ONLY THREE INSTRUMENTS):
  Generator WAJIB menggunakan HANYA tiga instrumen berikut dalam deskripsi dan prompt aransemen:
  1. CLEAN SUSTAINED ELECTRIC LEAD GUITAR:
     * Instrumen melodi utama.
     * Nada tunggal yang bersih.
     * Long sustain, expressive bending, crying melodic tone.
     * Permainan lembut, tidak agresif.
     * Solo gitar emosional dan mendayu.
     * Tidak menggunakan distorsi tebal atau layered guitar wall.
  2. ELECTRIC BASS GUITAR:
     * Nada dasar sederhana.
     * Warm, soft, restrained bass.
     * Tidak menggunakan punchy bassline.
     * Tidak boleh mendominasi latar.
  3. MINIMAL ACOUSTIC DRUM KIT:
     * Ketukan sangat sederhana dan lembut.
     * Soft kick pedal.
     * TIDAK MENGGUNAKAN SNARE DRUM KERAS (NO SNARE DRUM).
     * TIDAK MENGGUNAKAN CRASH CYMBAL (NO CRASH CYMBAL).
     * Tidak menggunakan fill drum ramai.
     * Drum hanya sebagai penanda ritme minimalis.

- LARANGAN MUTLAK INSTRUMEN TAMBAHAN:
  * JANGAN PERNAH menggunakan atau menghasilkan:
    Acoustic Guitar, Rhythm Guitar, Gitar Akustik, Gitar Ritme, Gitar Rythm, Piano, Keyboard, Synthesizer, Organ, Strings, Violin, Cello, Orchestral Instruments, Ambient Pad, Atmospheric Texture, Background Drone, Bell, Chime, Tambourine, Extra Percussion, Backing Vocals, Vocal Harmony, Choir, Electronic Effects, Cinematic Swells, Layered Guitar Wall, Additional Rhythm Instruments.
  * Dilarang membuat lapisan musik latar menggunakan instrumen yang tidak termasuk dalam tiga instrumen utama.
  * Jangan mengganti instrumen yang dilarang dengan suara sintetis atau suara atmosfer lainnya.

- ATURAN ARANSEMEN PER BAGIAN:
  * INTRO: Sangat hening, hanya satu melodi gitar elektrik sustain.
  * VERSE: Vokal menjadi pusat perhatian tunggal. GITAR ELEKTRIK DAN GITAR RITME/AKUSTIK WAJIB BERHENTI SECARA TOTAL DAN SENYAP 100% (guitars must completely stop and remain silent) setiap kali vokal sedang bernyanyi. Hanya diiringi oleh bass dasar lembut dan ketukan drum pedal yang sangat halus.
  * INSTRUMENTAL BREAK: Solo gitar elektrik sustain selama 10 detik. Nada tunggal bersih, panjang, emosional, dan mendayu. Tidak boleh ada instrumen tambahan lainnya.
  * CHORUS: Tetap sangat intim, sunyi, dan hening. GITAR ELEKTRIK DAN GITAR RITME/AKUSTIK WAJIB BERHENTI SECARA TOTAL DAN SENYAP 100% setiap kali vokal sedang bernyanyi. Tidak boleh ada ledakan drum, lapisan keyboard, strings, atau backing vocal.
  * OUTRO: Kembali hening. Akhiri dengan satu melodi gitar elektrik sustain yang panjang dan lembut.

- KARAKTER VOKAL:
  * Male vocal, deep chest voice dominant, natural emotional delivery, heartfelt natural vibrato, subtle raspy texture on climax.
  * Vokal harus terdengar manusiawi, natural, tidak berlebihan, tidak berteriak, dan tidak menggunakan backing vocal.

- SOUND ENGINEERING & MIXING:
  * Professional clean studio recording. Dry vocal recording. Minimal reverb. No excessive delay. No ambient effects. No artificial background textures. Wide but minimal stereo separation. Vocal prominently centered. Clear separation between three instruments. Natural dynamics. No excessive compression. No crowded frequency spectrum.

- PRIORITAS UTAMA:
  * Hening lebih penting daripada kemegahan (silence > grandiosity).
  * Kesederhanaan lebih penting daripada keramaian (simplicity > busyness).
  * Kejelasan vokal lebih penting daripada ketebalan instrumen (vocal clarity > instrument thickness).
  * Emosi gitar lebih penting daripada lapisan musik tambahan (guitar emotion > extra music layers).
  * Jika ada konflik antara genre Rock Kapak Malaysia 90's dan aturan minimalis, WAJIB prioritaskan aturan minimalis dan tiga instrumen yang telah ditentukan di atas.

- HASIL AKHIR SASARAN:
  Rock Kapak Malaysia 90-an dengan karakter Slow Rock Melayu yang hening, mendayu, intim, emosional, bersih, dan minimalis. Tidak ada instrumen tambahan di luar tiga instrumen yang diizinkan.

- STRICT VOCAL ACCOMPANIMENT CONTROL (PENGENDALIAN PENGIRING VOKAL KETAT - WAJIB DIPATUHI SECARA MUTLAK):
  * Selama semua bagian vokal bernyanyi, pengiring latar belakang (accompaniment) HARUS tetap sangat jarang (extremely sparse), sunyi (quiet), lembut (soft), dan minimal.
  * Vokal utama (lead vocal) harus selalu menjadi elemen yang dominan dan paling menonjol setiap saat.
  * HANYA TIGA INSTRUMEN YANG DIIZINKAN:
    1. Clean sustained electric lead guitar.
    2. Warm minimal electric bass.
    3. Very soft acoustic drum pedal.
  * ATURAN KETAT BAGIAN VOKAL (VOCAL SECTION RULES):
    - GITAR ELEKTRIK, GITAR SOLO SUSTAIN, GITAR LEAD, DAN GITAR RITME/AKUSTIK WAJIB BERHENTI SECARA TOTAL DAN SENYAP 100% SETIAP KALI VOKAL SEDANG BERNYANYI (All guitars, lead guitar, solo sustain guitar, and acoustic/rhythm guitar must completely stop playing and be 100% silent during all singing parts).
    - JANGAN PERNAH memainkan melodi, solo, sustain, atau isian gitar elektrik (electric lead/sustain guitar) di belakang vokal yang sedang menyanyi.
    - Tidak boleh ada nada gitar tunggal, akor gitar, genjrengan, petikan, atau isian gitar berbunyi di belakang vokal saat lirik dinyanyikan.
    - TIDAK BOLEH ada melodi gitar elektrik terus-menerus di belakang nyanyian (No continuous electric guitar melodies behind the singing).
    - TIDAK BOLEH ada isian gitar (guitar fills) di antara setiap frasa vokal.
    - TIDAK BOLEH ada genjrengan gitar ritme, petikan gitar akustik, atau pengiring gitar lainnya (No rhythm guitar or acoustic guitar).
    - TIDAK BOLEH ada melodi gitar yang tumpang tindih dengan vokal (No overlapping guitar melodies with the vocal).
    - TIDAK BOLEH ada iringan keyboard atau akor piano (No keyboard accompaniment / no piano chords).
    - TIDAK BOLEH ada strings atau lapisan orkestra (No strings or orchestral layers).
    - TIDAK BOLEH ada ambient pads atau tekstur latar belakang (No ambient pads or background textures).
    - TIDAK BOLEH ada backing vocals atau harmoni vokal (No backing vocals or vocal harmonies).
    - TIDAK BOLEH ada bassline yang sibuk/banyak melodi (No busy bassline).
    - TIDAK BOLEH ada isian drum selama frasa vokal dinyanyikan (No drum fills during vocal phrases).
    - TIDAK BOLEH ada hantaman crash cymbal selama baris vokal dinyanyikan (No cymbal crashes during vocal lines).
  * Selama menyanyi, bass memainkan nada dasar (*root notes*) yang tertahan (*restrained*), dan drum tetap sangat lembut. Gitar elektrik, gitar lead, gitar solo sustain, dan gitar ritme wajib diam sepenuhnya (fully stop/silent).
  * Biarkan gitar melodi utama / solo gitar sustain (*lead guitar/sustained solo guitar*) menjadi ekspresif dan menonjol HANYA selama istirahat instrumental (*instrumental breaks*), terutama pada solo gitar 10 detik.
  * Jangan pernah biarkan instrumen latar bersaing, tumpang tindih, atau mengalahkan vokal utama.
  * Aransemen harus terasa kosong, luas, intim, sunyi, dan terekspos secara emosional.
  * VOKAL UTAMA ADALAH PRIORITAS PERTAMA. INSTRUMEN PRIORITAS KEDUA. KEHENINGAN (SILENCE) DI ANTARA FRASA MUSIK ADALAH HAL YANG SANGAT PENTING.

You must return a JSON object adhering exactly to the provided schema.`;

    const prompt = `Write or creatively transform a beautiful Slow Rock/Pop Melayu song based on: "${topic}".
(Note: If full lyrics or draft stanzas are provided above, apply the CREATIVE TRANSFORMATION method: preserve theme, emotions, and message, but completely recreate sentence structures, diksi, metaphors, and emotional expressions into a fresh standalone original song).
(CRITICAL VOCABULARY RULE: Jangan pernah memakai kata "dada" pada lirik. Gunakan kata "hati", "sanubari", "kalbu", atau "jiwa").

(CRITICAL MUSIC PRODUCTION & ARRANGEMENT CONSTRAINTS — ATURAN WAJIB GENERATOR):
- IDENTITAS GENRE UTAMA: Rock Kapak Malaysia 90's, Slow Rock Melayu 90's, Romantic Sad Rock Ballad.
- KARAKTER MUSIK: Hening, minimalis, intim, melankolis, emosional, mendayu, menyentuh hati, dan memiliki dinamika lembut.
- STRICT INSTRUMENTATION — ATURAN MUTLAK HANYA TIGA INSTRUMEN (ONLY THREE INSTRUMENTS):
  1. CLEAN SUSTAINED ELECTRIC LEAD GUITAR (Crying melodic tone, clean single notes, long sustain, expressive bending, NO heavy distortion, NO layered guitar wall).
  2. ELECTRIC BASS GUITAR (Simple root notes, soft, warm, restrained, NO punchy basslines, NOT dominant).
  3. MINIMAL ACOUSTIC DRUM KIT (Extremely simple and soft beat, soft kick pedal, NO SNARE DRUM, NO CRASH CYMBAL, NO busy drum fills, minimal rhythm keeper).
- LARANGAN MUTLAK INSTRUMEN TAMBAHAN:
  ABSOLUTELY NO Acoustic Guitar, Rhythm Guitar, Gitar Akustik, Gitar Ritme, Gitar Rythm, Piano, Keyboard, Synthesizer, Organ, Strings, Violin, Cello, Orchestral Instruments, Ambient Pad, Atmospheric Texture, Background Drone, Bell, Chime, Tambourine, Extra Percussion, Backing Vocals, Vocal Harmony, Choir, Electronic Effects, Cinematic Swells, Layered Guitar Wall, or any other additional rhythm instruments.
- ARRANGEMENT RULES:
  * INTRO: Extremely silent, only one sustain electric lead guitar melody.
  * VERSE: Lead vocal centered and upfront. GITAR ELEKTRIK DAN GITAR RITME/AKUSTIK WAJIB BERHENTI SECARA TOTAL DAN SENYAP 100% (guitars must completely stop and remain silent) setiap kali vokal sedang bernyanyi. Hanya diiringi oleh bass dasar lembut dan ketukan drum pedal yang sangat halus.
  * INSTRUMENTAL BREAK: Emotional electric guitar solo for 10 seconds (clean sustained crying single notes only, NO extra instruments).
  * CHORUS: Hushed and quiet. GITAR ELEKTRIK DAN GITAR RITME/AKUSTIK WAJIB BERHENTI SECARA TOTAL DAN SENYAP 100% setiap kali vokal sedang bernyanyi. No drum explosions, no backing vocals, no strings or keyboard layers.
  * OUTRO: Quiet fade out ending with a single sustained soft electric guitar tone.
- VOCAL: Male vocal, deep chest voice dominant, natural emotional delivery, heartfelt natural vibrato, subtle raspy texture on climax. NO backing vocals.
- SOUND ENGINEERING: Professional clean studio recording. Dry vocal recording. Minimal reverb, no excessive delay, no ambient effects or artificial background textures. Clear separation of three instruments, natural dynamics.
- PRIORITAS UTAMA: Hening > kemegahan, kesederhanaan > keramaian, kejelasan vokal > ketebalan instrumen, emosi gitar > lapisan musik tambahan.
- STRICT VOCAL ACCOMPANIMENT CONTROL (PENGENDALIAN PENGIRING VOKAL KETAT):
  * Selama semua bagian vokal bernyanyi, pengiring latar belakang (accompaniment) HARUS tetap sangat jarang (extremely sparse), sunyi (quiet), lembut (soft), dan minimal.
  * Vokal utama (lead vocal) harus selalu menjadi elemen yang dominan dan paling menonjol setiap saat.
  * HANYA 3 INSTRUMEN YANG DIIZINKAN: 1. Clean sustained electric lead guitar, 2. Warm minimal electric bass, 3. Very soft acoustic drum pedal.
  * ATURAN KETAT BAGIAN VOKAL: GITAR ELEKTRIK, GITAR SOLO SUSTAIN, GITAR LEAD, DAN GITAR RITME/AKUSTIK WAJIB BERHENTI SECARA TOTAL DAN SENYAP 100% SETIAP KALI VOKAL SEDANG BERNYANYI. JANGAN PERNAH memainkan melodi, solo, sustain, atau isian gitar elektrik (electric lead/sustain guitar) di belakang vokal yang sedang menyanyi. No continuous electric guitar melodies behind singing, No guitar fills between every vocal phrase, No busy guitar strumming, No overlapping guitar melodies with vocal, No rhythm guitar or acoustic guitar, No keyboard/piano accompaniment, No strings or orchestral layers, No ambient pads or background textures, No backing vocals or vocal harmonies, No busy bassline, No drum fills during vocal phrases, No cymbal crashes during vocal lines.
  * Selama menyanyi, bass memainkan root notes tertahan, drum tetap sangat lembut, dan sustained electric lead/solo guitar senyap sepenuhnya. Lead guitar/sustained solo guitar boleh menonjol HANYA selama solo gitar 10 detik.
  * VOKAL UTAMA ADALAH PRIORITAS PERTAMA. INSTRUMEN PRIORITAS KEDUA. KEHENINGAN (SILENCE) DI ANTARA FRASA MUSIK ADALAH HAL YANG SANGAT PENTING.

Use the following specifications:
- Genre: ${genre}
- Mood: ${mood}
- Tempo: ${tempo}
- Time Signature (Birama/Ketukan): ${timeSignature}
- Key: ${key}
- Intro Opening Instruments suggested: ${introOpening}
- Vocal Style: ${vocalStyle}
- Lyric Language: ${lyricLanguage}
- Story Flow structure: ${storyFlow}
- Target: Rock Kapak Malaysia 90-an dengan karakter Slow Rock Melayu yang hening, mendayu, intim, emosional, bersih, dan minimalis. Tanpa instrumen tambahan di luar tiga instrumen yang diizinkan. Gitar elektrik dan ritme wajib diam/berhenti total saat vokal menyanyi.
${liveConcert ? `- Live Concert atmosphere elements: ${liveConcert}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            songTitle: {
              type: Type.STRING,
              description: "A beautiful, memorable, poetic Indonesian song title.",
            },
            chordsSuggestion: {
              type: Type.STRING,
              description: "Suggestions for standard chord progressions for Verse, Chorus, and Bridge, e.g. 'Verse: Am - Dm - G - C | Chorus: Dm - G - C - F - Dm - E'.",
            },
            lyrics: {
              type: Type.OBJECT,
              properties: {
                intro: {
                  type: Type.STRING,
                  description: "8-bar instrument intro description matching 90s slow rock (e.g., clean guitar pickings, etc.)",
                },
                verse1: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Verse 1A (Perkenalan Tokoh & Cinta Awal) - Tepat 4 baris lirik langsung dan komunikatif (KAU hadir -> menarik perhatian -> rasa cinta bersemi), 3-8 kata per baris.",
                },
                verse2: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Verse 1B (Perkembangan Rasa Cinta) - Tepat 4 baris lirik sebab-akibat (mata, senyum, tatapan, perhatian -> semakin mencintai), 3-8 kata per baris.",
                },
                preChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Pre-Chorus - Tepat 2 baris eskalasi ketegangan emosi menuju korus.",
                },
                chorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Chorus A (Hook Utama) - Tepat 4 baris inti perasaan lagu paling romantis, langsung, mudah diingat dengan panggilan (Kasih/Sayang) dan pengakuan cinta tulus.",
                },
                postChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Chorus B / Ruang Batin - Tepat 4 baris variasi hook atau kedalaman rasa (misal: 'hanya untukmu' -> 'selalu untukmu' -> 'selamanya untukmu').",
                },
                verse3: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Verse 3 / Refrain - Tepat 4 baris penguatan rasa dengan kalimat baru yang segar dan tulus.",
                },
                bridge: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Bridge - Tepat 4 baris titik balik emosi, pengakuan kesetiaan tulus, janji suci, atau harapan masa depan.",
                },
                finalChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Final Chorus - Tepat 4 baris klimaks emosional vokal penuh.",
                },
                outro: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Outro - 2 hingga 4 baris penutup romantis manis/haru, dapat disertai vocalization (Oooh.../Wo-o-o...) di akhir.",
                },
              },
              required: [
                "intro",
                "verse1",
                "verse2",
                "preChorus",
                "chorus",
                "postChorus",
                "verse3",
                "bridge",
                "finalChorus",
                "outro",
              ],
            },
            stylePrompt: {
              type: Type.OBJECT,
              properties: {
                genre: { type: Type.STRING, description: "Style or genre tags, e.g. Slow Rock Melayu 90s, Pop Melayu Ballad. Strictly NO synth tags or EDM/electronic tags. Clean and natural acoustic/organic tags only." },
                mood: { type: Type.STRING, description: "List of mood adjectives" },
                tempo: { type: Type.STRING, description: "BPM value (e.g., 72 BPM)" },
                key: { type: Type.STRING, description: "Vocal key (e.g., Am, G, Em)" },
                timeSignature: { type: Type.STRING, description: "Time signature (birama / ketukan), e.g., '4/4', '3/4', '6/8'" },
                introOpening: { type: Type.STRING, description: "Detailed intro arrangement instructions (8 bars). Must use clean, natural acoustic/organic instruments only. STRICTLY no synths, synth pads, electronic layers, or busy layering." },
                arrangement: { type: Type.STRING, description: "Arrangement escalation path from Verse (minimal) to Chorus (full/climax) and Outro. Must be a minimal, separated, non-dense arrangement using natural acoustic/organic instruments. No excessive layering, never synth-driven." },
                vocalStyle: { type: Type.STRING, description: "Vocal instruction notes. Focus on emotional feeling, dynamics, and performance based on the selected mood, with high clarity. MUST strictly match the requested gender (e.g. 'Female Vocal, sweet alto/soprano tone, soft vibrato' if female was selected; 'Male Vocal...' if male was selected; 'Duet Vocal (Male & Female)...' if duet was selected). Do NOT use 'warm' sound character or warm tonal coloration." },
                lyricLanguage: { type: Type.STRING, description: "Language definition" },
                melodyCharacter: { type: Type.STRING, description: "A detailed breakdown of melodic register and register changes between Verse, Pre-Chorus, and Chorus" },
                dynamics: { type: Type.STRING, description: "Dynamics instructions (Soft in Verses, open and wide in Chorus, pulling back in Bridge)" },
                mixing: { type: Type.STRING, description: "Sound mixing guidelines. Prioritize vocal clarity and a spacious, uncluttered mix. Specify clean studio-recording character, tight simple drums, smooth controlled bass (no booming or muddy low end). No noisy effects, no excessive reverb, and no excessive delay." },
                liveConcert: { type: Type.STRING, description: "Detailed description of how selected live concert atmosphere elements are integrated (e.g., crowd cheering, greetings, chantings, fan sing-alongs), or 'Tidak ada (Aransemen Studio Standar)' if none were requested." },
              },
              required: [
                "genre",
                "mood",
                "tempo",
                "key",
                "timeSignature",
                "introOpening",
                "arrangement",
                "vocalStyle",
                "lyricLanguage",
                "melodyCharacter",
                "dynamics",
                "mixing",
                "liveConcert",
              ],
            },
          },
          required: ["songTitle", "chordsSuggestion", "lyrics", "stylePrompt"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const parsedData = JSON.parse(text);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating lyrics & style:", error);
    res.status(500).json({ error: error.message || "Gagal membuat lirik lagu." });
  }
});

// API Route: Generate Album cover art
app.post("/api/generate-cover", async (req, res) => {
  try {
    const { title, genre, mood } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required for generating cover art." });
      return;
    }

    const ai = getAI();

    // Use gemini-3.1-flash-lite-image to generate a high quality image
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: `A professional square album cover art for an Indonesian slow rock/pop song titled "${title}". 
Genre: ${genre || "Slow Rock Melayu 90's"}. 
Vibe/Mood: ${mood || "Emotional, Nostalgic"}. 
Aesthetic: Vintage 90s Indonesian/Malaysian music cassette album vibe. A melancholic, beautifully lit background (maybe a quiet shoreline, cassette filter, subtle retro glow, or a clean minimalist look). No human faces if possible to keep it poetic, or just a silhouette. Include the title "${title}" in elegant, professional vintage typography integrated nicely into the cover. High resolution, high contrast, clean graphic design. Strictly no watermarks, no generic stock photo frames, no fake CD logos.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let base64Image = "";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("Gemini did not return image data.");
    }

    res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    console.error("Error generating cover art:", error);
    // Return a flag so the UI can construct an elegant dynamic SVG cover instead of crashing
    res.json({
      imageUrl: null,
      isFallback: true,
      reason: error.message || "Gagal memproses gambar.",
    });
  }
});

export default app;

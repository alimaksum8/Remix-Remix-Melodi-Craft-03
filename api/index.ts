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
      mood = "Warm, Romantic, Emotional, Nostalgic",
      tempo = "72 BPM",
      timeSignature = "4/4",
      key = "Am",
      vocalStyle = "Warm Male Vocal, Emotional, Soft Vibrato",
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
1. KARAKTER BAHASA LIRIK
================================
Gunakan Bahasa Indonesia yang:
- Sederhana dan mudah dipahami
- Romantis, langsung, dan menyentuh
- Tidak terlalu puitis atau sastra berat
- Tidak terlalu modern dan tidak menggunakan bahasa gaul / istilah rumit
- Natural ketika dinyanyikan
- Terasa seperti lirik lagu cinta Indonesia klasik
- Mengutamakan perasaan daripada permainan kata rumit

Gunakan bahasa yang berbicara langsung kepada orang yang dicintai.

Gunakan kata ganti:
AKU, KAU, DIRIMU, DIRIKU, KITA, KASIH, SAYANG

Contoh karakter bahasa:
"Kau hadir...", "Kau membuat...", "Kuingin...", "Diriku...", "Kasih...", "Sayang...", "Peganglah...", "Tataplah...", "Katakanlah...", "Betapa...", "Biarlah...", "Semoga...", "Sampai nanti..."

JANGAN menggunakan bahasa yang terlalu sastra seperti:
"senandika", "cakrawala nestapa", "relung sukma", "ufuk kalbu", "bias semesta"

Gunakan bahasa sederhana yang terasa seperti manusia sedang mengungkapkan cinta secara tulus.

*ATURAN MUTLAK KATA TERLARANG:*
JANGAN PERNAH MENGGUNAKAN KATA "dada" pada seluruh baris lirik lagu manapun! Gunakan selalu kata alternatif seperti "hati", "sanubari", "kalbu", atau "jiwa".

================================
2. CARA PENYUSUNAN KALIMAT & POLA
================================
Gunakan kalimat langsung dan komunikatif.

Pola sintaksis yang disukai:
- KAU + tindakan + perasaan (contoh: "Kau hadir membawa bahagia")
- AKU + perasaan + kepadamu (contoh: "Kuingin selalu di sisimu")
- KAU + membuat + AKU + keadaan (contoh: "Kau membuatku mengerti cinta")
- AKU + ingin + sesuatu (contoh: "Kuingin memelukmu selamanya")
- KASIH / SAYANG + permintaan/perintah (contoh: "Kasih, genggamlah tanganku")
- KATAKANLAH + isi perasaan (contoh: "Katakanlah kau cinta padaku")
- BETAPA + perasaan (contoh: "Betapa aku mencintaimu")
- SEMOGA + harapan (contoh: "Semoga cinta kita abadi")
- KITA + tujuan masa depan (contoh: "Kita melangkah bersama")

Contoh perbandingan konsep:
- Daripada: "Di antara kabut yang menyelimuti kalbu" → Gunakan: "Ku masih merindukanmu"
- Daripada: "Semesta menjadi saksi rasa" → Gunakan: "Ku ingin selalu bersamamu"
- Daripada: "Engkau adalah cahaya di ufuk kehidupanku" → Gunakan: "Kau selalu menerangi hidupku"

Prinsip Utama:
SEDERHANA → LANGSUNG → ROMANTIS → MUDAH DIINGAT

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
- Fungsi: Perkenalkan orang yang dicintai dan perasaan tokoh utama. (KAU hadir → menarik perhatian → rasa cinta mulai tumbuh).

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
9. ATURAN MUTLAK ARANSEMEN & PRODUKSI MUSIK (WAJIB DIPATUHI)
================================
- Gunakan mood pilihan pengguna HANYA untuk mengontrol suasana hati/emosional dan ekspresi musikal (rasa, dinamika, melodi, dan cara pembawaan lagu).
- JANGAN PERNAH menyertakan karakter suara hangat ("warm" sound character / warm tonal coloration) dalam instrumentasi atau deskripsi nada instrumen.
- JANGAN PERNAH menggunakan synth, synthesizer lead, synth pad, synth pluck, EDM synth, atau lapisan melodi elektronik apa pun.
- JANGAN PERNAH membuat aransemen yang padat, bising, atau rumit (avoid dense or busy arrangements).
- Hindari frekuensi suara yang menusuk, tajam, terlalu terang, bising, keras, atau berkarakter logam/metalik.
- Pastikan suara yang digambarkan berkarakter bersih (clean), alami/akustik (natural), lembut (soft), dan terkontrol dengan baik.
- Pertahankan instrumentasi tetap minimal dan terpisah dengan jelas (minimal and separated instrumentation).
- Hindari pelapisan instrumen yang berlebihan (no excessive layering).
- Jangan ada efek berisik, reverb berlebih, atau delay berlebih.
- Jangan gunakan tekstur elektronik yang agresif.
- Gunakan instrumen akustik/organik alami yang sesuai dengan karakter rekaman studio yang bersih.
- Pertahankan bass tetap terasa/hadir (present) namun harus halus dan terkontrol tanpa dengungan frekuensi rendah yang berlumpur atau berlebih (no booming or muddy low end).
- Pastikan ketukan drum tetap rapat, sederhana, dan terkendali dengan baik (tight, simple, and restrained drums).
- Berikan prioritas penuh pada kejelasan vokal (vocal clarity) dan ruang bauran yang longgar/luas (spacious, uncluttered mix).
- Hasil akhir aransemen harus: bersih (clean), alami (natural), penuh emosi (emotional), minimalis (minimal), tidak bising (non-noisy), dan TIDAK PERNAH digerakkan oleh synth (never synth-driven).
- JIKA pengguna memilih instrumen berikut pada bagian Intro/Opening, patuhi aturan khusus ini secara mutlak:
  * "🎵 Drum Intro": Gunakan suara drum akustik alami yang bersih saja. Kick drum harus rapat (tight), snare terkendali (controlled), hi-hat tertahan (restrained), dan simbal minimal (minimal cymbals). JANGAN gunakan isian drum berlebih atau pukulan crash cymbal yang keras.
  * "🎵 Drum Fill + Electric Guitar": Gunakan drum akustik alami dan gitar elektrik asli saja. Pertahankan gitar tetap bersih (clean) atau hanya dengan overdrive ringan (lightly driven). JANGAN gunakan gitar synthesizer, efek gitar elektronik ekstrim, atau lapisan gitar yang padat.
  * "🎵 Drum Solo Intro": Gunakan suara drum akustik alami saja. Pastikan penampilan drum terkendali dan musikal, bukan agresif. JANGAN gunakan simbal berlebih, isian drum cepat/heboh, kompresi berat, atau pukulan drum yang terlalu keras.
- ATURAN PENCAMPURAN UMUM (GENERAL MIX RULE): Pertahankan aransemen tetap minimal, bersih, dengan suasana ruangan kering-ke-sedang (dry-to-moderate ambience), dan terpisah dengan sangat baik. JANGAN menambahkan instrumen yang tidak dipilih oleh pengguna. JANGAN otomatis menambahkan pad, string, piano, synth, perkusi elektronik, atau lapisan atmosfer/digital.
- Instrumen yang dipilih menentukan SUMBER SUARA (SOUND SOURCE). Suasana (mood) yang dipilih HANYA menentukan EMOSI. JANGAN PERNAH menggunakan mood untuk memasukkan desain suara hangat ("warm sound design") atau instrumen synthesizer.
- TARGET UTAMA: Suara studio bersih, instrumen alami, dinamika terkontrol, vokal jelas, low end rapat, halus tetapi TIDAK hangat (smooth but NOT warm), organik tetapi BUKAN digerakkan synth (organic but NOT synth-driven), dan tidak pernah bising atau ramai (never noisy or crowded).

================================
10. ATURAN MUTLAK GAYA VOKAL (VOCAL SELECTION RULE - WAJIB DIPATUHI)
================================
- Pilihan gaya vokal apa pun dari pengguna HANYA boleh mempengaruhi PENAMPILAN VOKAL (vocal performance, expression, dynamics, breath, articulation, delivery).
- JANGAN PERNAH membiarkan gaya vokal yang dipilih mengubah suara instrumental, instrumentasi, aransemen, atau karakter nada (tonal character) musik keseluruhan.
- ATURAN KHUSUS UNTUK "WARM MALE VOCAL" DAN "WARM FEMALE VOCAL":
  * Kata "Warm" HANYA berlaku untuk nada vokal alami penyanyi (natural vocal tone).
  * Kata "Warm" ini SAMA SEKALI TIDAK BOLEH membuat instrumen menjadi hangat, menambahkan pad hangat, menambahkan synth analog, menambahkan lapisan atmosfer, atau mengubah aransemen/mixing keseluruhan menjadi gaya produksi yang hangat.
- ATURAN KHUSUS UNTUK "EMOTIONAL", "VULNERABLE VOCAL", "AIR-Y BREATHING", "SOFT CHEST-HEAD VOICE", DAN "WHISPERY VOCALS":
  * Karakteristik vokal ini HANYA mempengaruhi ekspresi vokal, dinamika, nafas, artikulasi, dan pembawaan penyanyi.
  * JANGAN PERNAH menafsirkannya sebagai alasan untuk menambahkan pad, synth, strings, tekstur ambien, atau instrumen tambahan apa pun.
- ATURAN KHUSUS UNTUK "DUET":
  * Gunakan HANYA dua penampilan vokal alami (dua penyanyi).
  * JANGAN otomatis menambahkan lapisan instrumental tambahan untuk mendukung duet tersebut.
  * Pertahankan kedua vokal tetap terpisah dengan jelas dan dapat dimengerti dengan baik (clearly separated and intelligible).
- JANGAN PERNAH menambahkan instrumen secara otomatis karena gaya vokal yang dipilih. Gunakan HANYA instrumen yang dipilih secara eksplisit oleh pengguna.
- ATURAN PENCAMPURAN VOKAL (VOCAL MIX RULE):
  * Pertahankan vokal tetap jelas (clear), alami (natural), terpusat di tengah (centered), dan terkontrol.
  * JANGAN gunakan efek reverb berlebih, delay berlebih, chorus, pelebar stereo (widening), distorsi, atau efek lainnya yang membuat vokal terdengar tidak alami/buatan.
  * Pertahankan aransemen instrumental tetap bersih dan tidak berantakan. Tanpa penumpukan frekuensi, tanpa frekuensi tinggi yang kasar, dan tanpa frekuensi rendah yang berlumpur.
- RINGKASAN RELEVANSI:
  * GAYA VOKAL (VOCAL STYLE) = HANYA PENAMPILAN VOKAL (VOCAL PERFORMANCE ONLY).
  * SUASANA (MOOD) = HANYA PERASAAN EMOSI (EMOTIONAL FEELING ONLY).
  * PILIHAN INSTRUMEN = HANYA INSTRUMEN YANG DIPILIH (INSTRUMENTS ONLY).
  * JANGAN PERNAH membiarkan gaya vokal atau mood secara otomatis memasukkan desain suara hangat, synthesizer, pad, tekstur elektronik, atau instrumen tambahan lainnya.

================================
11. ATURAN MUTLAK GENRE (GENRE SELECTION RULE - WAJIB DIPATUHI)
================================
- Pilihan genre apa pun dari pengguna HANYA boleh menentukan GAYA MUSIKAL, RITME, STRUKTUR, KARAKTER AKOR, DAN IDENTITAS BUDAYA/ERA.
- Genre SAMA SEKALI TIDAK BOLEH secara otomatis memasukkan:
  * Karakter suara hangat ("warm" sound character / warm tonal coloration)
  * Synthesizer, synth pad, synth lead, synth pluck, atau electronic keys
  * Lapisan atmosfer/synth ambien atau tekstur digital
  * Synthetic bass atau elemen EDM
  * Lapisan latar belakang elektronik apa pun
- PENTING: GENRE mengontrol GAYA (STYLE), BUKAN DESAIN SUARA (SOUND DESIGN). Jika suatu genre secara tradisional dikaitkan dengan keyboard, pad, strings, atau synthesizer, JANGAN PERNAH menambahkannya secara otomatis kecuali instrumen tersebut dipilih secara eksplisit oleh pengguna.
- JANGAN PERNAH menambahkan instrumen secara otomatis berdasarkan genre. Gunakan HANYA instrumen yang dipilih secara eksplisit oleh pengguna.
- ATURAN GAYA KHUSUS GENRE:
  * "Slow Rock Melayu 90's": Pertahankan karakter band tahun 1990-an yang otentik dengan menggunakan drum alami, gitar elektrik ritme, gitar elektrik sustain, dan bass alami HANYA jika dipilih. JANGAN memodernisasi genre ini dengan synth, pad, elemen EDM, atau tekstur sinematik.
  * "Pop Melayu Ballad" / "Romantic Ballad" / "Pop Melayu Melankolis" / "Sad Romantic": Pertahankan aransemen tetap terkendali dan organik. JANGAN menafsirkan kata "romantic", "melancholic", atau "sad" sebagai alasan untuk menambahkan pad hangat, synth, strings, atau lapisan atmosfer/ambien.
  * "Acoustic Ballad" / "Folk-Pop" / "Pure Intimacy": Pertahankan aransemen minimal dan alami. JANGAN tambahkan instrumen elektronik atau tekstur sintetis.
  * "Pop Rock Indonesia 2000s" / "Alternative Pop" / "Classic Band Anthem": JANGAN secara otomatis membuat produksi menjadi lebih besar, lebih keras, lebih lebar (stereo widening), atau lebih elektronik. Gunakan HANYA instrumen band yang dipilih. Hindari pelapisan gitar berlebih, simbal berlebih, efek berlebih, suasana berlebih, dan tekstur elektronik.
- ATURAN PENCAMPURAN KETAT (STRICT MIXING RULES):
  * Karakter rekaman studio yang bersih (clean studio recording).
  * Nada instrumen alami (natural instrument tone).
  * Dinamika terkontrol (controlled dynamics).
  * Low end rapat (tight low end).
  * Midrange jelas (clear midrange).
  * Tanpa kecerahan berlebih (no excessive brightness).
  * Tanpa bass berlumpur (no muddy bass).
  * Tanpa reverb berlebih (no excessive reverb) dan tanpa delay berlebih (no excessive delay).
  * Tanpa pelebaran stereo berlebih (no excessive stereo widening).
  * Tanpa pelapisan padat (no dense layering).
  * Tanpa efek yang tidak diperlukan (no unnecessary effects).
  * Tanpa penumpukan frekuensi (no frequency buildup).
  * Tanpa aransemen bising/ramai (no noisy arrangement).
- PRINSIP UTAMA:
  * GENRE = HANYA GAYA (STYLE ONLY).
  * SUASANA (MOOD) = HANYA PERASAAN EMOSI (EMOTIONAL FEELING ONLY).
  * VOKAL (VOCAL) = HANYA PENAMPILAN VOKAL (VOCAL PERFORMANCE ONLY).
  * PILIHAN INSTRUMEN = HANYA SUMBER SUARA (SOUND SOURCES ONLY).
  * JANGAN PERNAH membiarkan genre, mood, atau vokal secara otomatis memasukkan desain suara hangat, synthesizer, pad, tekstur elektronik, strings, piano, atau instrumen tambahan lainnya.
- TARGET UTAMA: Produksi yang alami, bersih, terkontrol, tidak ramai dengan identitas genre yang dipertahankan, tetapi TANPA pewarnaan suara hangat (without warm sound coloration) dan TANPA produksi yang digerakkan oleh synth (without synth-driven production).

================================
12. ATURAN REKAMAN & PRODUKSI BERSIH MUTLAK (STRICT CLEAN MUSIC PRODUCTION - WAJIB DIPATUHI)
================================
- Buat aransemen yang sangat bersih, sederhana, minimalis, dan terkontrol (clean, simple, controlled arrangement).
- PRIORITAS UTAMA PADA VOKAL (VOCAL PRIORITY):
  * Vokal harus tetap menjadi fokus utama setiap saat.
  * Selama setiap baris vokal dinyanyikan, pertahankan latar belakang instrumen agar tetap sunyi, jarang/renggang (sparse), dan tidak mengganggu (unobtrusive).
  * JANGAN biarkan instrumen tumpang tindih atau bersaing dengan rentang frekuensi vokal.
- LARANGAN MUTLAK (ABSOLUTELY NO):
  * TIDAK BOLEH ada pewarnaan suara hangat (no warm sound coloration) atau gaya produksi hangat (no warm production style).
  * TIDAK BOLEH ada synthesizer, synth pad, synth lead, synth pluck, atau organ.
  * TIDAK BOLEH ada piano KECUALI dipilih secara eksplisit sebagai instrumen oleh pengguna.
  * TIDAK BOLEH ada gitar ritme (rhythm guitar), petikan gitar akustik (acoustic guitar strumming), suara petikan kuku/pick (picking noise, pick noise), gesekan senar (guitar/string scraping), kebisingan fret (fret noise), kebisingan jari (finger noise), gitar mendengung (buzzing guitar), gitar distorsi (distorted guitar), atau efek gitar berlebih.
  * TIDAK BOLEH ada tekstur atmosfer, tekstur elektronik, elemen EDM, ambien buatan (artificial ambience), atau lapisan latar belakang bising (noisy background layers).
  * TIDAK BOLEH ada simbal berlebih (no excessive cymbals), crash cymbal selama baris vokal dinyanyikan, pola hi-hat yang bersaing dengan vokal, kekacauan perkusi (percussion clutter), atau isian drum yang tidak perlu (unnecessary fills).
  * TIDAK BOLEH ada reverb berlebih, delay berlebih, atau chorus/modulasi yang menciptakan gerakan/kebisingan.
  * TIDAK BOLEH ada pelapisan padat (no dense layering) atau penumpukan frekuensi (no frequency buildup).
- ATURAN INSTRUMEN SPESIFIK:
  * Gunakan HANYA instrumen yang dipilih secara eksplisit oleh pengguna. JANGAN otomatis menambahkan instrumen karena genre, mood, atau vokal.
  * JIKA HANYA DRUM yang dipilih: Gunakan drum akustik alami sederhana saja (kick rapat/tight, snare terkendali, hi-hat tertahan, simbal minimal).
  * JIKA GITAR ELEKTRIK dipilih: Gunakan nada tunggal yang tertahan (sustained single-note) atau nada akor saja. JANGAN gunakan genjrengan gitar ritme, petikan bising, gesekan, kebisingan fret, atau melodi/riff sibuk.
  * JIKA BASS dipilih: Gunakan nada bass sustained sederhana saja. JANGAN slap, popping, gerakan berlebih, atau booming sub-bass.
- ATURAN BAGIAN VOKAL (VOCAL SECTION RULE):
  * Setiap kali penyanyi bernyanyi, kurangi densitas instrumental secara dramatis. Tanpa pola gitar sibuk, tanpa organ, tanpa synth, tanpa isian instrumen dekoratif, atau melodi instrumen yang bersaing.
  * Di antara frasa vokal: Gunakan respon instrumen yang sangat pendek, halus, dan halus (very short, subtle instrumental responses). JANGAN mengisi setiap ruang kosong.
- PENGATURAN MIXING:
  * Pertahankan vokal tetap bersih, kering-ke-sedang reverbasinya, terpusat, dan sangat jelas dimengerti (intelligible).
  * Pertahankan instrumen tetap terpisah dengan jelas dari vokal. Dinamika terkontrol, low end rapat, midrange bersih, dan frekuensi tinggi halus tanpa kekasaran, kemudaran (muddiness), atau lebar stereo berlebih.
- PENALARAN UTAMA: Jangan menafsirkan kata "emotional", "romantic", "melancholic", "warm", "soft", atau "intimate" as perintah untuk menambahkan pad, synth, organ, string, lapisan atmosfer, atau desain suara hangat. Karakter emosional harus datang dari PENAMPILAN VOKAL dan MELODI saja.
- TARGET SUARA: Minimalis, bersih, latar belakang instrumen tenang saat vokal dinyanyikan, kehadiran vokal jelas, drum terkontrol, nada instrumen sustained, tanpa gesekan, tanpa dengung, tanpa kebisingan strumming, tanpa synth, tanpa organ, tanpa pewarnaan hangat, dan aransemen tidak bising/penuh.

================================
13. ATURAN ARANSEMEN HENING MUTLAK & PENGURANGAN EFEK BISING (ABSOLUTE SILENT ARRANGEMENT & SOUND EFFECTS ELIMINATION - WAJIB DIPATUHI)
================================
- JADIKAN HASIL MUSIK SANGAT HENING, TENANG, DAN LEMBUT (Quiet, Hushed, Peaceful, and Silent arrangement):
  * TANPA SNARE DRUM (NO SNARE DRUM AT ALL): Jangan gunakan snare drum atau ketukan snare yang tajam/keras dalam aransemen.
  * TANPA BASS DRUM / HEAVY KICK (NO HEAVY BASS/KICK DRUM): Hilangkan bass drum yang keras atau ketukan kick drum yang bising.
  * TANPA BASS YANG BERAT/BOOMING (NO HEAVY/BOOMING BASS): Hindari frekuensi rendah yang bergema, booming, berlumpur, atau bising.
- KECILKAN DAN MINIMALKAN EFEK SUARA SUASANA "WARM" DAN "ROMANTIC" (Eliminate noisy Warm/Romantic sound effects & ambient noise):
  * JANGAN PERNAH menambahkan efek suara suasana (sound effects), efek ambien bising, tekstur atmosfer berisik, desisan tape, atau lapisan latar belakang bising yang berasal dari interpretasi suasana "Warm" atau "Romantic/Romantik".
  * Efek suasana "Warm" dan "Romantic" harus diperkecil sedemikian rupa hingga tidak terdengar sama sekali dalam instrumen, sehingga hasil akhirnya benar-benar hening, bersih, jernih, dan sangat enak didengar (extremely silent, clear, dry-to-moderate, and pleasant to listen to).
  * Semua efek bising, gemuruh, atau atmosfer hangat yang mengganggu keheningan harus dihilangkan total untuk menghasilkan suara yang hening, tenang, jernih, dan sangat enak didengar.

You must return a JSON object adhering exactly to the provided schema.`;

    const prompt = `Write or creatively transform a beautiful Slow Rock/Pop Melayu song based on: "${topic}".
(Note: If full lyrics or draft stanzas are provided above, apply the CREATIVE TRANSFORMATION method: preserve theme, emotions, and message, but completely recreate sentence structures, diksi, metaphors, and emotional expressions into a fresh standalone original song).
(CRITICAL VOCABULARY RULE: Jangan pernah memakai kata "dada" pada lirik. Gunakan kata "hati", "sanubari", "kalbu", atau "jiwa").

(CRITICAL MUSIC PRODUCTION & ARRANGEMENT CONSTRAINTS):
- Use the selected mood(s) ONLY to control the emotional atmosphere and musical expression (feeling, dynamics, melody, performance).
- Do NOT use a "warm" sound character or warm tonal coloration.
- Do NOT use synths, synthesizer leads, synth pads, synth plucks, EDM synths, electronic keys, or electronic melodic layers/textures.
- Do NOT create a dense or busy arrangement. Keep instrumentation minimal and separated. No excessive layering.
- Avoid harsh, bright, metallic, sharp, or piercing frequencies.
- Keep the sound clean, natural, soft, and controlled with natural acoustic/organic instruments.
- Keep the bass present but smooth and controlled (no synthetic bass, no booming or muddy low end).
- Keep drums tight, simple, and restrained.
- Prioritize vocal clarity and a spacious, uncluttered mix. No noisy effects, no excessive reverb, or excessive delay.
- The overall output style prompt must be clean, natural, emotional, minimal, non-noisy, and never synth-driven.
- JIKA memilih salah satu instrumen intro ini, patuhi aturan secara mutlak:
  * "🎵 Drum Intro": Gunakan ketukan drum akustik alami yang bersih saja. Kick drum rapat (tight), snare terkendali (controlled), hi-hat tertahan (restrained), simbal minimal. JANGAN gunakan isian drum berlebih atau crash cymbal keras.
  * "🎵 Drum Fill + Electric Guitar": Gunakan drum akustik alami dan gitar elektrik asli saja. Gitar harus bersih (clean) atau overdrive ringan. JANGAN gunakan gitar synthesizer, efek elektronik ekstrem, atau lapisan gitar yang padat.
  * "🎵 Drum Solo Intro": Gunakan drum akustik alami saja. Penampilan drum harus terkendali dan musikal (bukan agresif). JANGAN gunakan simbal berlebih, isian drum cepat, kompresi berat, atau pukulan drum yang keras.
- GENERAL MIX RULE: Pertahankan aransemen tetap minimal, bersih, dry-to-moderate ambience, dan terpisah sangat baik. JANGAN menambahkan instrumen yang tidak dipilih. JANGAN otomatis menambahkan pad, strings, piano, synth, perkusi elektronik, atau lapisan atmosfer/digital.
- TARGET: Clean studio sound, natural instruments, controlled dynamics, clear vocals, tight low end, smooth but NOT warm, organic but NOT synth-driven, and never noisy or crowded.
- GENRE SELECTION RULE — STRICT: Genre yang dipilih HANYA mendefinisikan gaya musikal, ritme, struktur, karakter akor, dan identitas budaya/era. JANGAN PERNAH menambahkan desain suara hangat, synthesizer, synth pad, synth lead, synth pluck, electronic keys, tekstur digital/lapisan atmosfer, synthetic bass, atau elemen EDM/lapisan latar belakang elektronik secara otomatis berdasarkan genre. GENRE mengontrol GAYA (STYLE), bukan desain suara. Gunakan HANYA instrumen yang dipilih secara eksplisit oleh pengguna.
  * Khusus "Slow Rock Melayu 90's": Karakter band 1990-an asli dengan drum alami, gitar elektrik ritme, gitar elektrik sustain, dan bass alami jika dipilih. JANGAN memodernisasi genre ini dengan synth, pad, elemen EDM, atau tekstur sinematik.
  * Khusus "Pop Melayu Ballad" / "Romantic Ballad" / "Pop Melayu Melankolis" / "Sad Romantic": Pertahankan aransemen tetap terkendali dan organik. JANGAN gunakan sebagai alasan menambah pad hangat, synth, strings, atau lapisan atmosfer/ambien.
  * Khusus "Acoustic Ballad" / "Folk-Pop" / "Pure Intimacy": Aransemen minimal dan alami. JANGAN ada instrumen elektronik atau tekstur sintetis.
  * Khusus "Pop Rock Indonesia 2000s" / "Alternative Pop" / "Classic Band Anthem": JANGAN secara otomatis membuat produksi menjadi lebih besar, keras, lebar, atau elektronik. Gunakan HANYA instrumen band yang dipilih. Hindari pelapisan gitar berlebih, simbal berlebih, efek berlebih, suasana berlebih, dan tekstur elektronik.
- ATURAN PENCAMPURAN KETAT (STRICT MIXING RULES): Rekaman studio bersih, nada instrumen alami, dinamika terkontrol, low end rapat, midrange jelas, tanpa kecerahan berlebih, tanpa bass berlumpur, tanpa reverb/delay berlebih, tanpa stereo widening berlebih, tanpa pelapisan padat, tanpa efek tidak perlu, tanpa penumpukan frekuensi, dan tanpa aransemen bising.
- VOCAL SELECTION RULE — STRICT: Gaya vokal yang dipilih HANYA mempengaruhi penampilan vokal (vocal performance, expression, dynamics, breath, articulation, delivery). Gaya vokal SAMA SEKALI TIDAK BOLEH mengubah suara instrumental, instrumentasi, aransemen, atau karakter nada musik keseluruhan.
  * Khusus "Warm Male Vocal" dan "Warm Female Vocal": Kata "Warm" HANYA berlaku untuk nada vokal alami penyanyi. TIDAK BOLEH membuat instrumen menjadi hangat, menambahkan pad/synth analog, atau mengubah aransemen/mix menjadi gaya produksi yang hangat.
  * Khusus "Emotional", "Vulnerable Vocal", "Air-y breathing", "Soft chest-head voice", dan "Whispery Vocals": Hanya mempengaruhi ekspresi vokal, nafas, artikulasi, dan pembawaan penyanyi. JANGAN tambahkan pad, synth, strings, atau lapisan atmosfer.
  * Khusus "Duet": Gunakan dua penyanyi vokal alami saja, pertahankan keduanya terpisah jelas dan jelas dimengerti. JANGAN tambahkan instrumen pendukung duet otomatis.
- MIX VOKAL: Jelas, alami, terpusat, dan terkontrol. JANGAN gunakan reverb/delay berlebih, chorus, stereowidening, distorsi, atau efek buatan lainnya.
- STRICT CLEAN MUSIC PRODUCTION (ATURAN REKAMAN BERSIH MUTLAK):
  * Buat aransemen sederhana, minimalis, dan terkontrol. Vokal harus menjadi fokus utama, instrumen harus sunyi, renggang (sparse), dan tidak mengganggu saat vokal berbunyi (vocal priority).
  * ABSOLUTELY NO: No warm sound/production coloration, no synthesizer, no synth pad/lead/pluck, no organ. No piano unless explicitly selected.
  * No rhythm guitar, no acoustic guitar strumming, no picking noise, no guitar/string scraping, no fret noise, no finger noise, no pick noise, no buzzing, no distorted guitar, or excessive guitar effects.
  * No atmospheric textures, no electronic textures, no EDM, no artificial ambience, or noisy background layers.
  * No excessive cymbals, no crash cymbals during vocals, no competing hi-hat patterns, no percussion clutter, or unnecessary fills.
  * No excessive reverb/delay, no chorus/modulation noise, no dense layering, no frequency buildup.
  * Gunakan HANYA instrumen yang dipilih secara eksplisit.
  * Jika hanya Drum dipilih: drum akustik alami sederhana saja (kick rapat, snare terkontrol, hi-hat tertahan, simbal minimal).
  * Jika Gitar Elektrik dipilih: nada tunggal tertahan atau nada akor saja. Tanpa genjrengan, tanpa petikan bising, tanpa gesekan senar/fret noise, tanpa riff sibuk.
  * Jika Bass dipilih: sustained bass notes saja. Tanpa slap, popping, gerakan berlebih, atau booming sub-bass.
  * Vocal Section Rule: Densitas instrumen harus dikurangi dramatis saat vokal bernyanyi. Gunakan respon instrumen sangat pendek dan halus di antara frasa vokal. JANGAN isi setiap ruang kosong.
  * Mixing: Vokal bersih, dry-to-moderate, centered, terpisah jelas dari instrumen. Low-end rapat, midrange bersih, treble halus, tanpa kekasaran, kemudaran, atau lebar stereo berlebih.
  * Karakter emosi harus didapat HANYA dari penampilan vokal dan melodi, bukan dari instrumen tambahan.
- SILENT ARRANGEMENT & NO SOUND EFFECTS (ATURAN HENING MUTLAK):
  * JADIKAN HASIL MUSIK SANGAT HENING, TENANG, DAN LEMBUT.
  * ABSOLUTELY NO SNARE DRUM, NO HEAVY BASS DRUM, NO HEAVY/BOOMING BASS.
  * KECILKAN EFEK SUARA SUASANA WARM DAN ROMANTIK. Jangan gunakan efek suasana bising, tape noise, pad gemuruh, atau atmosfer bising hangat/romantik yang membuat berisik. Pastikan hasilnya hening, tenang, jernih, dan sangat enak didengar.

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

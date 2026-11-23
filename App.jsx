// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, CheckCircle2, ShieldAlert, BarChart3, Download, Search, Filter, 
  ArrowUpDown, Lock, LogOut, ChevronRight, ChevronLeft, 
  User, BookOpen, Hash, Clock, EyeOff, FileText, Maximize2, Trash2, RefreshCw
} from 'https://esm.sh/lucide-react@0.400.0';

// ============================================================================
// 1. KONFIGURASI GOOGLE APPS SCRIPT (GANTI DENGAN URL /exec ANDA)
// ============================================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwaKPbzI33H5yEMZtSsNH5WAxUkJg0fTdw_WZBQGsVtPh5RDswPT0UdqbVu1SLeuKbY2g/exec";

// PENGATURAN UJIAN VEKTOR KELAS X
const TEACHER_PIN = "Salisa1507#";
const EXAM_DURATION_SECONDS = 60 * 60; // 60 Menit
const QUIZ_QUESTION_COUNT = 15;        // 15 Soal Acak per Siswa dari 20 Bank Soal Vektor

// ============================================================================
// 2. BANK 20 SOAL VEKTOR BERBASIS STIMULUS (KELAS X • C1 - C4)
//    Bentuk Soal: Pilihan Ganda, Pilihan Ganda Kompleks, & Benar-Salah
// ============================================================================
const QUESTION_BANK = [
  {
    id: "VK-01",
    type: "PG",
    level: "C1",
    topic: "Besaran Skalar dan Vektor",
    stimulus: "Dalam pengamatan gerak kendaraan di Jalan Raya Darmo Surabaya, dicatat beberapa besaran fisika berikut: (1) Kelajuan rata-rata motor 45 km/jam, (2) Perpindahan mobil 3,5 km ke arah selatan, (3) Massa paket 4 kg, (4) Gaya dorong mesin 1.200 N ke depan, (5) Waktu tempuh 12 menit.",
    question: "Kelompok besaran yang termasuk besaran vektor ditunjukkan oleh nomor ....",
    options: [
      "A. (1) dan (3)",
      "B. (2) dan (4)",
      "C. (1), (2), dan (5)",
      "D. (2), (3), dan (4)",
      "E. (3), (4), dan (5)"
    ],
    answer: "B",
    explanation: "Besaran vektor memiliki nilai dan arah, yaitu perpindahan (2) dan gaya (4). Kelajuan, massa, dan waktu adalah besaran skalar."
  },
  {
    id: "VK-02",
    type: "PG",
    level: "C2",
    topic: "Notasi dan Representasi Grafis Vektor",
    stimulus: "Sebuah vektor gaya digambarkan berupa anak panah dari titik pangkal P menuju titik ujung Q dengan panjang ruas garis 6 cm. Diketahui skala gambar yang digunakan adalah 1 cm mewakili 15 N.",
    question: "Pernyataan yang paling tepat mengenai representasi vektor gaya tersebut adalah ....",
    options: [
      "A. Besar gaya adalah 90 N dengan arah dari Q ke P",
      "B. Besar gaya adalah 90 N dengan arah dari P ke Q",
      "C. Besar gaya adalah 21 N dengan arah dari P ke Q",
      "D. Besar gaya adalah 2,5 N dengan arah dari Q ke P",
      "E. Panjang anak panah hanya menunjukkan arah tanpa menyatakan besar gaya"
    ],
    answer: "B",
    explanation: "Panjang panah menyatakan besar vektor (6 cm × 15 N/cm = 90 N) dan ujung panah menyatakan arah vektor (dari pangkal P ke ujung Q)."
  },
  {
    id: "VK-03",
    type: "PG",
    level: "C3",
    topic: "Resultan Vektor Segaris",
    stimulus: "Tiga orang siswa mendorong sebuah peti peralatan laboratorium fisika secara segaris di atas lantai datar. Siswa pertama dan kedua mendorong ke arah kanan masing-masing dengan gaya 65 N dan 85 N, sedangkan siswa ketiga menahan dari arah berlawanan (ke kiri) dengan gaya 40 N.",
    question: "Besar dan arah resultan gaya yang bekerja pada peti tersebut adalah ....",
    options: [
      "A. 110 N ke arah kanan",
      "B. 110 N ke arah kiri",
      "C. 190 N ke arah kanan",
      "D. 60 N ke arah kanan",
      "E. 150 N ke arah kiri"
    ],
    answer: "A",
    explanation: "Ambil arah kanan positif: R = +65 + 85 - 40 = +110 N (berarti 110 N ke arah kanan)."
  },
  {
    id: "VK-04",
    type: "PG",
    level: "C3",
    topic: "Perpindahan Dua Dimensi (Tegak Lurus)",
    stimulus: "Seorang kurir mengantar dokumen dari kantor pos bergerak lurus ke arah timur sejauh 800 meter, kemudian berbelok tegak lurus ke arah utara sejauh 600 meter hingga tiba di alamat tujuan.",
    question: "Besar perpindahan total yang ditempuh kurir tersebut adalah ....",
    options: [
      "A. 200 meter",
      "B. 700 meter",
      "C. 1.000 meter",
      "D. 1.400 meter",
      "E. 4.800 meter"
    ],
    answer: "C",
    explanation: "Karena kedua lintasan saling tegak lurus (90°), besar perpindahan R = √(800² + 600²) = √(640.000 + 360.000) = 1.000 meter."
  },
  {
    id: "VK-05",
    type: "PG",
    level: "C3",
    topic: "Metode Poligon Vektor",
    stimulus: "Diberikan lima buah vektor A, B, C, D, dan E yang digambarkan secara berurutan dengan metode poligon: ujung vektor A bertemu pangkal B, ujung B bertemu pangkal C, ujung C bertemu pangkal D, dan pangkal vektor E diletakkan berimpit dengan pangkal vektor A sedangkan ujung vektor E bertemu tepat di ujung vektor D.",
    question: "Hubungan persamaan vektor yang benar berdasarkan susunan poligon tersebut adalah ....",
    options: [
      "A. A + B + C + D + E = 0",
      "B. E = A + B + C + D",
      "C. D = A + B + C + E",
      "D. A + B = C + D + E",
      "E. E = A - B + C - D"
    ],
    answer: "B",
    explanation: "Dalam metode poligon, vektor yang pangkalnya di pangkal vektor pertama (A) dan ujungnya di ujung vektor terakhir (D) adalah vektor resultan: E = A + B + C + D."
  },
  {
    id: "VK-06",
    type: "PG",
    level: "C3",
    topic: "Resultan Dua Vektor Membentuk Sudut",
    stimulus: "Dua buah vektor gaya F₁ = 10 N dan F₂ = 10 N bertitik tangkap sama dan saling mengapit sudut 60°.",
    question: "Besar resultan kedua vektor gaya tersebut adalah ....",
    options: [
      "A. 10 N",
      "B. 10√2 N",
      "C. 10√3 N",
      "D. 20 N",
      "E. 5√3 N"
    ],
    answer: "C",
    explanation: "R = √(10² + 10² + 2·10·10·cos 60°) = √(100 + 100 + 200·0,5) = √300 = 10√3 N."
  },
  {
    id: "VK-07",
    type: "PG",
    level: "C3",
    topic: "Resultan Dua Vektor Sudut Tumpul",
    stimulus: "Dua vektor kecepatan masing-masing bernilai v₁ = 6 m/s dan v₂ = 10 m/s memiliki titik tangkap yang sama dengan sudut apit sebesar 120°.",
    question: "Besar resultan kedua vektor kecepatan tersebut adalah ....",
    options: [
      "A. 4 m/s",
      "B. 2√19 m/s",
      "C. 14 m/s",
      "D. 16 m/s",
      "E. 8 m/s"
    ],
    answer: "B",
    explanation: "R = √(6² + 10² + 2·6·10·cos 120°) = √(36 + 100 + 120·(-0,5)) = √(136 - 60) = √76 = 2√19 m/s."
  },
  {
    id: "VK-08",
    type: "PG",
    level: "C4",
    topic: "Selisih Dua Vektor",
    stimulus: "Dua buah vektor gaya F₁ = 8 N dan F₂ = 5 N bertitik tangkap sama dan mengapit sudut 60°.",
    question: "Besar selisih kedua vektor tersebut (|F₁ - F₂|) adalah ....",
    options: [
      "A. 3 N",
      "B. 7 N",
      "C. √129 N",
      "D. 13 N",
      "E. √39 N"
    ],
    answer: "B",
    explanation: "|F₁ - F₂| = √(F₁² + F₂² - 2·F₁·F₂·cos 60°) = √(64 + 25 - 2·8·5·0,5) = √(89 - 40) = √49 = 7 N."
  },
  {
    id: "VK-09",
    type: "PG",
    level: "C4",
    topic: "Menentukan Sudut Apit Dua Vektor",
    stimulus: "Dua buah vektor gaya yang besarnya sama, yakni F₁ = F₂ = 12 N, bekerja pada satu titik tangkap. Setelah diukur, besar resultan kedua gaya tersebut tepat sama dengan 12 N.",
    question: "Besar sudut apit antara vektor F₁ dan F₂ adalah ....",
    options: [
      "A. 30°",
      "B. 45°",
      "C. 60°",
      "D. 90°",
      "E. 120°"
    ],
    answer: "E",
    explanation: "Jika F₁ = F₂ = F dan R = F, maka F² = F² + F² + 2F² cos θ → -F² = 2F² cos θ → cos θ = -0,5 → θ = 120°."
  },
  {
    id: "VK-10",
    type: "PG",
    level: "C3",
    topic: "Penguraian Komponen Vektor",
    stimulus: "Seorang siswa menarik koper dengan gaya F = 40 N membentuk sudut elevasi 37° terhadap lantai mendatar (diketahui sin 37° = 0,6 dan cos 37° = 0,8).",
    question: "Besar komponen gaya pada arah mendatar (Fx) dan arah vertikal (Fy) berturut-turut adalah ....",
    options: [
      "A. Fx = 24 N dan Fy = 32 N",
      "B. Fx = 32 N dan Fy = 24 N",
      "C. Fx = 20 N dan Fy = 20√3 N",
      "D. Fx = 32 N dan Fy = 32 N",
      "E. Fx = 24 N dan Fy = 24 N"
    ],
    answer: "B",
    explanation: "Fx = F cos 37° = 40 × 0,8 = 32 N; Fy = F sin 37° = 40 × 0,6 = 24 N."
  },
  {
    id: "VK-11",
    type: "PG",
    level: "C4",
    topic: "Resultan Tiga Vektor dengan Metode Analitis",
    stimulus: "Tiga buah vektor gaya bekerja pada titik O pada bidang koordinat Kartesius: F₁ = 10 N ke arah sumbu-X positif (0°), F₂ = 10 N membentuk sudut 60° terhadap sumbu-X positif (kuadran I), dan F₃ = 10 N membentuk sudut 120° terhadap sumbu-X positif (kuadran II).",
    question: "Besar resultan ketiga vektor gaya tersebut adalah ....",
    options: [
      "A. 10 N",
      "B. 10√2 N",
      "C. 10√3 N",
      "D. 20 N",
      "E. 30 N"
    ],
    answer: "D",
    explanation: "ΣFx = 10 cos 0° + 10 cos 60° + 10 cos 120° = 10 + 5 - 5 = 10 N. ΣFy = 0 + 10 sin 60° + 10 sin 120° = 5√3 + 5√3 = 10√3 N. R = √(10² + (10√3)²) = √(100 + 300) = 20 N."
  },
  {
    id: "VK-12",
    type: "PG",
    level: "C4",
    topic: "Arah Resultan Vektor Analitis",
    stimulus: "Dari hasil penjumlahan beberapa vektor perpindahan pada bidang XY diperoleh jumlah komponen pada sumbu-X sebesar ΣRx = -6 meter dan jumlah komponen pada sumbu-Y sebesar ΣRy = 6√3 meter.",
    question: "Besar dan arah vektor resultan terhadap sumbu-X positif adalah ....",
    options: [
      "A. 12 meter dengan sudut 60°",
      "B. 12 meter dengan sudut 120°",
      "C. 12 meter dengan sudut 150°",
      "D. 6√2 meter dengan sudut 135°",
      "E. 12 meter dengan sudut 300°"
    ],
    answer: "B",
    explanation: "R = √((-6)² + (6√3)²) = √(36 + 108) = 12 m. Karena Rx negatif dan Ry positif, resultan berada di kuadran II dengan tan α = 6√3 / (-6) = -√3 → α = 120°."
  },
  {
    id: "VK-13",
    type: "PG",
    level: "C4",
    topic: "Batas Nilai Resultan Dua Vektor",
    stimulus: "Dua buah vektor gaya memiliki besar masing-masing 9 N dan 15 N. Sudut apit antara kedua vektor tersebut dapat diubah-ubah dari 0° hingga 180°.",
    question: "Nilai resultan gaya yang TIDAK MUNGKIN dihasilkan oleh kedua vektor tersebut adalah ....",
    options: [
      "A. 6 N",
      "B. 12 N",
      "C. 18 N",
      "D. 24 N",
      "E. 26 N"
    ],
    answer: "E",
    explanation: "Rentang nilai resultan dua vektor berada di antara |F₁ - F₂| ≤ R ≤ (F₁ + F₂), yakni 6 N ≤ R ≤ 24 N. Jadi 26 N tidak mungkin dihasilkan."
  },
  {
    id: "VK-14",
    type: "PG",
    level: "C4",
    topic: "Aplikasi Vektor pada Penyeberangan Sungai",
    stimulus: "Sebuah perahu motor diarahkan tegak lurus menyeberangi sungai yang lebarnya 120 meter dengan kecepatan perahu terhadap air 4 m/s. Pada saat yang sama, air sungai mengalir sejajar tepi sungai dengan kecepatan arus 3 m/s.",
    question: "Jarak lintasan aktual yang ditempuh perahu hingga tiba di seberang sungai adalah ....",
    options: [
      "A. 90 meter",
      "B. 120 meter",
      "C. 150 meter",
      "D. 210 meter",
      "E. 240 meter"
    ],
    answer: "C",
    explanation: "Waktu menyeberang t = 120 / 4 = 30 s. Perahu hanyut sejauh x = 3 × 30 = 90 m. Lintasan aktual s = √(120² + 90²) = 150 meter."
  },
  {
    id: "VK-15",
    type: "PGK",
    level: "C3",
    topic: "Sifat-Sifat Penjumlahan Vektor",
    stimulus: "Perhatikan pernyataan-pernyataan mengenai operasi penjumlahan dua buah vektor A dan B yang tidak nol berikut ini:\n(1) Penjumlahan vektor bersifat komutatif: A + B = B + A.\n(2) Besar resultan |A + B| selalu sama dengan jumlah aljabar |A| + |B| untuk semua sudut apit.\n(3) Resultan dua vektor bernilai maksimum ketika sudut apit kedua vektor adalah 0°.\n(4) Resultan dua vektor bernilai nol hanya jika besar kedua vektor sama dan berlawanan arah (sudut 180°).",
    question: "Pilihlah SEMUA pernyataan yang benar (jawaban benar lebih dari satu)!",
    options: [
      "Pernyataan (1) benar",
      "Pernyataan (2) benar",
      "Pernyataan (3) benar",
      "Pernyataan (4) benar"
    ],
    answer: ["Pernyataan (1) benar", "Pernyataan (3) benar", "Pernyataan (4) benar"],
    explanation: "Pernyataan (1), (3), dan (4) benar. Pernyataan (2) salah karena |A + B| = |A| + |B| hanya berlaku saat sudut apit 0°."
  },
  {
    id: "VK-16",
    type: "PGK",
    level: "C4",
    topic: "Analisis Komponen Vektor pada Kuadran",
    stimulus: "Sebuah vektor gaya F = 20 N digambarkan pada bidang koordinat Kartesius di kuadran III dengan sudut 30° terhadap sumbu-X negatif (atau 210° terhadap sumbu-X positif). Diketahui sin 30° = 0,5 dan cos 30° = 0,5√3.",
    question: "Pilihlah SEMUA pernyataan yang tepat mengenai komponen vektor F tersebut!",
    options: [
      "Komponen vektor pada sumbu-X (Fx) bernilai negatif (-10√3 N)",
      "Komponen vektor pada sumbu-Y (Fy) bernilai negatif (-10 N)",
      "Komponen vektor pada sumbu-X (Fx) bernilai positif (+10 N)",
      "Jika sudut terhadap sumbu-X negatif diperbesar menjadi 60°, nilai |Fy| menjadi lebih besar daripada |Fx|"
    ],
    answer: [
      "Komponen vektor pada sumbu-X (Fx) bernilai negatif (-10√3 N)",
      "Komponen vektor pada sumbu-Y (Fy) bernilai negatif (-10 N)",
      "Jika sudut terhadap sumbu-X negatif diperbesar menjadi 60°, nilai |Fy| menjadi lebih besar daripada |Fx|"
    ],
    explanation: "Di kuadran III, baik Fx maupun Fy bertanda negatif: Fx = -20 cos 30° = -10√3 N dan Fy = -20 sin 30° = -10 N. Saat sudut 60°, |Fy| = 10√3 N > |Fx| = 10 N."
  },
  {
    id: "VK-17",
    type: "PGK",
    level: "C4",
    topic: "Kesetimbangan Tiga Gaya Vektor",
    stimulus: "Sebuah lampu gantung seberat 60 N ditahan oleh dua utas tali ringan yang simetris sehingga masing-masing tali membentuk sudut 30° terhadap langit-langit mendatar (sudut 60° terhadap garis vertikal). Diketahui sin 30° = 0,5 dan cos 30° = 0,5√3.",
    question: "Berdasarkan analisis komponen vektor gaya pada sistem setimbang (ΣFx = 0 dan ΣFy = 0), pilihlah SEMUA pernyataan yang benar!",
    options: [
      "Komponen tegangan tali arah horizontal saling meniadakan (T₁ cos 30° = T₂ cos 30°)",
      "Jumlah komponen tegangan tali arah vertikal ke atas sama dengan berat lampu 60 N",
      "Besar gaya tegangan pada masing-masing tali adalah 60 N",
      "Besar gaya tegangan pada masing-masing tali adalah 30 N"
    ],
    answer: [
      "Komponen tegangan tali arah horizontal saling meniadakan (T₁ cos 30° = T₂ cos 30°)",
      "Jumlah komponen tegangan tali arah vertikal ke atas sama dengan berat lampu 60 N",
      "Besar gaya tegangan pada masing-masing tali adalah 60 N"
    ],
    explanation: "Karena simetris, T₁ = T₂ = T. ΣFy = 0 → 2 T sin 30° = 60 N → 2 T (0,5) = 60 N → T = 60 N."
  },
  {
    id: "VK-18",
    type: "BS",
    level: "C2",
    topic: "Metode Jajargenjang dan Poligon",
    stimulus: "Dalam menggambar penjumlahan dua buah vektor F₁ dan F₂ secara grafis menggunakan metode jajargenjang, kedua pangkal vektor ditempatkan pada satu titik tangkap yang sama.",
    question: "Diagonal jajargenjang yang ditarik dari titik tangkap kedua vektor menuju titik sudut di seberangnya menyatakan vektor resultan R = F₁ + F₂.",
    options: ["Benar", "Salah"],
    answer: "Benar",
    explanation: "Pada metode jajargenjang, pangkal kedua vektor berimpit dan diagonal yang bertitik tangkap sama menyatakan vektor resultan."
  },
  {
    id: "VK-19",
    type: "BS",
    level: "C3",
    topic: "Resultan Vektor Tegak Lurus",
    stimulus: "Dua buah vektor gaya F₁ = 9 N dan F₂ = 12 N bekerja pada sebuah benda dengan arah saling tegak lurus satu sama lain (membentuk sudut 90°).",
    question: "Besar resultan kedua vektor gaya tersebut adalah 21 N.",
    options: ["Benar", "Salah"],
    answer: "Salah",
    explanation: "Karena saling tegak lurus (cos 90° = 0), R = √(9² + 12²) = √(81 + 144) = √225 = 15 N, bukan 21 N."
  },
  {
    id: "VK-20",
    type: "BS",
    level: "C4",
    topic: "Resultan Vektor Nol (Poligon Tertutup)",
    stimulus: "Empat buah vektor perpindahan A, B, C, dan D digambarkan secara berurutan dengan metode poligon sehingga ujung vektor D bertemu kembali tepat di titik pangkal vektor A membentuk segi empat tertutup.",
    question: "Besar resultan keempat vektor perpindahan tersebut adalah sama dengan nol.",
    options: ["Benar", "Salah"],
    answer: "Benar",
    explanation: "Apabila rangkaian vektor dengan metode poligon membentuk kurva tertutup (ujung vektor terakhir kembali ke pangkal vektor pertama), maka vektor resultannya adalah vektor nol."
  }
];
// ============================================================================
// 3. UTILITAS PENGACAK, ALARM ANTI-CURANG & FULLSCREEN
// ============================================================================
const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const generateStudentExamSet = () => {
  const selected = shuffleArray(QUESTION_BANK).slice(0, QUIZ_QUESTION_COUNT);
  return selected.map((q) => {
    const indexedOptions = q.options.map((text, idx) => ({
      text,
      isCorrect: idx === q.correct
    }));
    const shuffledOptions = shuffleArray(indexedOptions);
    const newCorrectIdx = shuffledOptions.findIndex((opt) => opt.isCorrect);
    return {
      ...q,
      options: shuffledOptions.map((opt) => opt.text),
      correct: newCorrectIdx
    };
  });
};

const playWarningAlarm = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [0, 0.25, 0.5].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now + offset);
      osc.frequency.exponentialRampToValueAtTime(440, now + offset + 0.2);
      gain.gain.setValueAtTime(0.35, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.22);
    });
  } catch (e) {}
};

const requestAppFullscreen = () => {
  try {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  } catch (e) {}
};

const exitAppFullscreen = () => {
  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  } catch (e) {}
};

const formatTimeMMSS = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// ============================================================================
// 4. KOMPONEN UTAMA APLIKASI KUIS VEKTOR KELAS X (GOOGLE SHEETS BACKEND)
// ============================================================================
export default function App() {
  const [view, setView] = useState('login');

  // Identitas Siswa Kelas X
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('X-1');
  const [studentAbsen, setStudentAbsen] = useState('');
  const [sessionId, setSessionId] = useState('');

  // Status Pengerjaan Kuis
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [startTimeStr, setStartTimeStr] = useState('');
  const [finishTimeStr, setFinishTimeStr] = useState('');

  // Sistem Pengawasan Anti-Curang
  const [violations, setViolations] = useState(0);
  const [violationTimes, setViolationTimes] = useState([]);
  const [showCheatModal, setShowCheatModal] = useState(false);
  const [cheatReason, setCheatReason] = useState('');

  // Dasbor Guru
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoadingDash, setIsLoadingDash] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [sortBy, setSortBy] = useState('time');

  const isScriptConfigured = APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith('https://script.google.com/');
  const quizStateRef = useRef({ activeQuestions, answers, violations, violationTimes, sessionId });
  const lastViolationTimestampRef = useRef(0);
  const initialWindowSizeRef = useRef({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    quizStateRef.current = { activeQuestions, answers, violations, violationTimes, sessionId };
  }, [activeQuestions, answers, violations, violationTimes, sessionId]);

  // --------------------------------------------------------------------------
  // A. KOMUNIKASI DENGAN GOOGLE APPS SCRIPT & GOOGLE SPREADSHEET
  // --------------------------------------------------------------------------
  const fetchRecordsFromSheet = useCallback(async (showSpinner = false) => {
    if (!isScriptConfigured) {
      const saved = JSON.parse(localStorage.getItem('vektor_sheets_backup') || '[]');
      setRecords(saved);
      return;
    }

    if (showSpinner) setIsLoadingDash(true);
    try {
      const url = `${APPS_SCRIPT_URL}?pin=${encodeURIComponent(TEACHER_PIN)}&t=${Date.now()}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setRecords(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat data dari Spreadsheet:", err);
    } finally {
      if (showSpinner) setIsLoadingDash(false);
    }
  }, [isScriptConfigured]);

  // Auto-refresh setiap 8 detik saat Dasbor Guru terbuka
  useEffect(() => {
    if (view !== 'teacher-dashboard') return;
    fetchRecordsFromSheet(true);
    const interval = setInterval(() => {
      fetchRecordsFromSheet(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [view, fetchRecordsFromSheet]);

  const syncRecordToSheet = async (id, payload) => {
    if (!isScriptConfigured) {
      const existing = JSON.parse(localStorage.getItem('vektor_sheets_backup') || '[]');
      const idx = existing.findIndex(r => r.id === id);
      const updatedRecord = { id, ...payload };
      if (idx >= 0) existing[idx] = { ...existing[idx], ...updatedRecord };
      else existing.unshift(updatedRecord);
      localStorage.setItem('vektor_sheets_backup', JSON.stringify(existing));
      setRecords(existing);
      return;
    }

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'upsert', id, ...payload })
      });
    } catch (e) {
      console.error("Gagal mengirim progres ke Google Sheets:", e);
    }
  };

  const handleDeleteSingleRecord = async (recordId, namaSiswa) => {
    if (!window.confirm(`Hapus baris data "${namaSiswa}" dari Google Spreadsheet?`)) return;
    setRecords(prev => prev.filter(r => r.id !== recordId));

    if (isScriptConfigured) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'deleteOne', pin: TEACHER_PIN, id: recordId })
        });
      } catch (e) {
        alert("Gagal menghapus baris di Spreadsheet.");
      }
    }
  };

  const handleDeleteAllRecords = async () => {
    if (records.length === 0) return;
    if (!window.confirm(`PERINGATAN: Anda akan mengosongkan SEMUA (${records.length}) baris nilai di Google Spreadsheet. Lanjutkan?`)) return;
    setRecords([]);

    if (isScriptConfigured) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'deleteAll', pin: TEACHER_PIN })
        });
      } catch (e) {
        alert("Gagal mengosongkan Spreadsheet.");
      }
    }
  };

  // --------------------------------------------------------------------------
  // B. TIMER MUNDUR 60 MENIT & AUTO-SUBMIT
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (view !== 'quiz') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view]);

  // --------------------------------------------------------------------------
  // C. SISTEM PENGAWASAN KETAT (TAB, SPLIT-SCREEN, WINDOW BLUR, FULLSCREEN)
  // --------------------------------------------------------------------------
  const recordCheatViolation = (reasonLabel) => {
    const nowMs = Date.now();
    if (nowMs - lastViolationTimestampRef.current < 2000) return;
    lastViolationTimestampRef.current = nowMs;

    playWarningAlarm();
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logEntry = `${nowStr} (${reasonLabel})`;

    setCheatReason(reasonLabel);
    setViolations((prev) => {
      const nextCount = prev + 1;
      setViolationTimes((prevTimes) => {
        const nextTimes = [...prevTimes, logEntry];
        const st = quizStateRef.current;
        if (st.sessionId) {
          syncRecordToSheet(st.sessionId, {
            jumlahPelanggaran: nextCount,
            waktuPelanggaran: nextTimes
          });
        }
        return nextTimes;
      });
      return nextCount;
    });
    setShowCheatModal(true);
  };

  useEffect(() => {
    if (view !== 'quiz') return;
    const handleVisibilityChange = () => { if (document.hidden) recordCheatViolation('Pindah Tab / Minimize'); };
    const handleWindowBlur = () => { recordCheatViolation('Klik Jendela Lain / Split-Screen'); };
    const handleWindowResize = () => {
      const wRatio = window.innerWidth / (initialWindowSizeRef.current.w || window.innerWidth);
      const hRatio = window.innerHeight / (initialWindowSizeRef.current.h || window.innerHeight);
      if (wRatio < 0.78 || hRatio < 0.72) recordCheatViolation('Layar Diperkecil / Split-Screen');
    };
    const handleFullscreenChange = () => { if (!document.fullscreenElement) recordCheatViolation('Keluar Layar Penuh'); };
    const handlePreventCopy = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('resize', handleWindowResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handlePreventCopy);
    document.addEventListener('copy', handlePreventCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handlePreventCopy);
      document.removeEventListener('copy', handlePreventCopy);
    };
  }, [view]);

  // --------------------------------------------------------------------------
  // D. LOGIKA PENGERJAAN KUIS & PENILAIAN
  // --------------------------------------------------------------------------
  const calculateScore = (ansMap, qList = activeQuestions) => {
    if (!qList || qList.length === 0) return 0;
    let correctCount = 0;
    qList.forEach((q) => {
      if (ansMap[q.id] === q.correct) correctCount++;
    });
    return Math.round((correctCount / qList.length) * 100);
  };

  const handleStartQuiz = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    requestAppFullscreen();
    setTimeout(() => {
      initialWindowSizeRef.current = { w: window.innerWidth, h: window.innerHeight };
    }, 400);

    const randomizedSet = generateStudentExamSet();
    const assignedIds = randomizedSet.map(q => `#${q.id}`).join(', ');
    const cleanName = studentName.trim().replace(/\s+/g, '_');
    const newId = `${cleanName}_${studentClass}_${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setActiveQuestions(randomizedSet);
    setSessionId(newId);
    setAnswers({});
    setCurrentIdx(0);
    setViolations(0);
    setViolationTimes([]);
    setTimeLeft(EXAM_DURATION_SECONDS);
    setStartTimeStr(nowTime);
    setView('quiz');

    await syncRecordToSheet(newId, {
      nama: studentName.trim(),
      kelas: studentClass,
      absen: studentAbsen.trim() || '-',
      paketSoal: assignedIds,
      skor: 0,
      benar: 0,
      terjawab: 0,
      jumlahPelanggaran: 0,
      waktuPelanggaran: [],
      status: 'Sedang Mengerjakan',
      waktuMulai: nowTime,
      waktuSelesai: '-'
    });
  };

  const handleSelectOption = async (questionId, optionIndex) => {
    const updatedAnswers = { ...answers, [questionId]: optionIndex };
    setAnswers(updatedAnswers);

    const score = calculateScore(updatedAnswers, activeQuestions);
    const correctCount = activeQuestions.filter(q => updatedAnswers[q.id] === q.correct).length;

    await syncRecordToSheet(sessionId, {
      skor: score,
      benar: correctCount,
      terjawab: Object.keys(updatedAnswers).length
    });
  };

  const handleFinishQuiz = async (isAutoTimeout = false) => {
    exitAppFullscreen();
    const st = quizStateRef.current;
    const finalAnswers = isAutoTimeout ? st.answers : answers;
    const qList = isAutoTimeout ? st.activeQuestions : activeQuestions;
    const score = calculateScore(finalAnswers, qList);
    const correctCount = qList.filter(q => finalAnswers[q.id] === q.correct).length;
    const endTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setFinishTimeStr(endTime);
    setView('submitted');

    await syncRecordToSheet(st.sessionId || sessionId, {
      skor: score,
      benar: correctCount,
      terjawab: Object.keys(finalAnswers).length,
      status: isAutoTimeout ? 'Selesai (Waktu Habis)' : 'Selesai',
      waktuSelesai: endTime
    });
  };

  // --------------------------------------------------------------------------
  // E. EKSPOR LAPORAN DASBOR GURU (CSV/EXCEL)
  // --------------------------------------------------------------------------
  const filteredRecords = records
    .filter(r => filterClass === 'ALL' || r.kelas === filterClass)
    .filter(r => (r.nama || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return (b.skor || 0) - (a.skor || 0);
      if (sortBy === 'name') return (a.nama || '').localeCompare(b.nama || '');
      if (sortBy === 'violations') return (b.jumlahPelanggaran || 0) - (a.jumlahPelanggaran || 0);
      return 0;
    });

  const exportToCSV = () => {
    const headers = ['No', 'Nama Lengkap', 'Kelas', 'No Absen', 'Terjawab', 'Benar', 'Nilai Akhir', 'Pelanggaran', 'Detail Pelanggaran', 'Kode Soal Acak', 'Status'];
    const rows = filteredRecords.map((r, i) => [
      i + 1,
      `"${r.nama}"`,
      r.kelas,
      r.absen,
      `${r.terjawab || 0}/${QUIZ_QUESTION_COUNT}`,
      r.benar || 0,
      r.skor || 0,
      r.jumlahPelanggaran || 0,
      `"${(r.waktuPelanggaran || []).join('; ')}"`,
      `"${r.paketSoal || '-'}"`,
      r.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_Vektor_X_${filterClass}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================================================
  // RENDER TAMPILAN
  // ==========================================================================
  const currentQ = activeQuestions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const totalQ = activeQuestions.length || QUIZ_QUESTION_COUNT;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans select-none">
      {/* HEADER APLIKASI */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold shadow">
              F-X
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">FISIKA INTERAKTIF X</h1>
              <p className="text-xs text-slate-500">Asesmen Vektor Berbasis Stimulus • Durasi 60 Menit</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {view === 'quiz' && (
              <>
                <button
                  onClick={requestAppFullscreen}
                  title="Masuk Layar Penuh"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm border ${
                  timeLeft <= 300 
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeMMSS(timeLeft)}</span>
                </div>
              </>
            )}

            {view === 'login' && (
              <button
                onClick={() => { setPinInput(''); setPinError(''); setView('teacher-login'); }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Dasbor Guru</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 1. HALAMAN LOGIN SISWA KELAS X (VEKTOR) */}
      {view === 'login' && (
        <main className="max-w-xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
              <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
                Evaluasi Digital SMA Kelas X
              </span>
              <h2 className="text-2xl font-bold">Kuis Interaktif Vektor</h2>
              <p className="text-indigo-100 text-sm mt-1">
                15 Soal Acak dari Bank 20 Soal Stimulus • Bentuk Soal Variatif (PG, PG Kompleks, Benar–Salah) • Tingkat Kognitif C1–C4 • Waktu 60 Menit.
              </p>
            </div>

            <form onSubmit={handleStartQuiz} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Ahmad Rizky Pratama"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Kelas <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                    >
                      {Array.from({ length: 12 }, (_, i) => `X-${i + 1}`).map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Nomor Absen (Opsional)
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={studentAbsen}
                      onChange={(e) => setStudentAbsen(e.target.value)}
                      placeholder="Contoh: 12"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Sistem Pengawasan Ketat & Paket Soal Acak:</span>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Setiap peserta menerima <strong>15 soal berbeda</strong> (Pilihan Ganda, PG Kompleks, & Benar-Salah) dengan posisi opsi A–E teracak otomatis.</li>
                  <li>Aplikasi otomatis masuk ke mode <strong>Layar Penuh (Fullscreen)</strong> selama 60 menit pengerjaan.</li>
                  <li>Dilarang berpindah tab, membuka jendela kedua (<em>split-screen</em> / <em>floating window</em>), atau keluar layar penuh karena akan memicu <strong>Alarm Peringatan</strong> dan tercatat di laporan guru.</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>MULAI KUIS VEKTOR SEKARANG</span>
              </button>
            </form>
          </div>
        </main>
      )}

      {/* 2. HALAMAN PENGERJAAN KUIS SISWA */}
      {view === 'quiz' && currentQ && (
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
                {studentClass} • {studentName}
              </div>
              <span className="text-xs text-slate-500">
                Terjawab: <strong>{answeredCount}/{totalQ}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {violations > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" />
                  Pelanggaran: {violations}x
                </span>
              )}
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-4">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {activeQuestions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                        : isAnswered
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-800">
                Soal Nomor {currentIdx + 1} dari {totalQ}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold">
                {currentQ.level}
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-indigo-50/70 border-l-4 border-indigo-600 text-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Stimulus Kontekstual</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {currentQ.stimulus}
                </p>
              </div>

              <p className="text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQ.question}
              </p>

              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === oIdx;
                  const letter = String.fromCharCode(65 + oIdx);
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQ.id, oIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600 text-indigo-950 font-medium'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {letter}
                      </span>
                      <span className="text-sm pt-0.5 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIdx < totalQ - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(totalQ - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-1 transition"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (answeredCount < totalQ) {
                      if (!window.confirm(`Anda baru menjawab ${answeredCount} dari ${totalQ} soal. Yakin ingin mengumpulkan jawaban sekarang?`)) return;
                    }
                    handleFinishQuiz(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-1.5 shadow transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kumpulkan Jawaban</span>
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      {/* 3. HALAMAN KONFIRMASI SELESAI */}
      {view === 'submitted' && (
        <main className="max-w-lg mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Jawaban Berhasil Dikumpulkan</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Terima kasih, <strong>{studentName}</strong> ({studentClass}). Seluruh respons kuis Vektor Anda telah tercatat otomatis ke Google Spreadsheet guru.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Peserta:</span>
                <span className="font-bold">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kelas / No. Absen:</span>
                <span className="font-bold">{studentClass} / {studentAbsen || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jumlah Soal Terjawab:</span>
                <span className="font-bold">{answeredCount} dari {totalQ} soal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Mulai – Selesai:</span>
                <span className="font-bold">{startTimeStr} – {finishTimeStr} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Catatan Pengawasan:</span>
                <span className={`font-bold ${violations > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {violations === 0 ? 'Aman (0 kali)' : `${violations} kali terdeteksi`}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setStudentName('');
                setStudentAbsen('');
                setView('login');
              }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold transition"
            >
              Kembali ke Halaman Awal
            </button>
          </div>
        </main>
      )}

      {/* 4. HALAMAN LOGIN PIN DASBOR GURU */}
      {view === 'teacher-login' && (
        <main className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Akses Dasbor Guru</h2>
                <p className="text-xs text-slate-500">Terhubung ke Google Spreadsheet salisashiha57@guru.sma.belajar.id</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pinInput === TEACHER_PIN) {
                  setFilterClass('ALL');
                  setSearchTerm('');
                  setView('teacher-dashboard');
                } else {
                  setPinError('PIN salah. Silakan periksa kembali.');
                }
              }}
              className="space-y-3"
            >
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN Guru"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-center tracking-widest font-bold"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-600 font-semibold">{pinError}</p>}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold"
                >
                  Buka Dasbor
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* 5. DASBOR MONITORING & REKAP NILAI GURU (GOOGLE SPREADSHEET) */}
      {view === 'teacher-dashboard' && (
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Dasbor Monitoring & Rekap Nilai Vektor (Kelas X)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Penyimpanan Privat: <strong>salisashiha57@guru.sma.belajar.id</strong> • Status: {isScriptConfigured ? (
                  <span className="text-emerald-600 font-semibold">Terhubung ke Google Spreadsheet (Auto-Sync 8 Detik)</span>
                ) : (
                  <span className="text-rose-600 font-semibold">URL Apps Script Belum Dipasang!</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fetchRecordsFromSheet(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDash ? 'animate-spin' : ''}`} />
                <span>Segarkan Data</span>
              </button>
              {records.length > 0 && (
                <button
                  onClick={handleDeleteAllRecords}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset Spreadsheet</span>
                </button>
              )}
              <button
                onClick={exportToCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Excel (CSV)</span>
              </button>
              <button
                onClick={() => setView('login')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama siswa..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Semua Kelas X</option>
                {Array.from({ length: 12 }, (_, i) => `X-${i + 1}`).map(cls => (
                  <option key={cls} value={cls}>Kelas {cls}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="time">Urutkan: Terbaru</option>
                <option value="score">Urutkan: Nilai Tertinggi</option>
                <option value="name">Urutkan: Nama (A-Z)</option>
                <option value="violations">Urutkan: Pelanggaran Terbanyak</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                  <th className="p-3.5">No</th>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5">Kelas</th>
                  <th className="p-3.5">Absen</th>
                  <th className="p-3.5">Progres</th>
                  <th className="p-3.5">Nilai</th>
                  <th className="p-3.5">Log Pengawasan</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoadingDash && filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-400 text-sm">
                      Sedang mengambil data dari Google Spreadsheet...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-400 text-sm">
                      Belum ada data pengerjaan siswa Kelas X yang tercatat di Spreadsheet.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r, idx) => (
                    <tr key={r.id || idx} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-500">{idx + 1}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{r.nama}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">
                          {r.kelas}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{r.absen}</td>
                      <td className="p-3.5 text-slate-600">{r.terjawab || 0}/{QUIZ_QUESTION_COUNT}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-bold">
                          {r.skor ?? 0}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {(r.jumlahPelanggaran || 0) > 0 ? (
                          <div>
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">
                              {r.jumlahPelanggaran}x Pelanggaran
                            </span>
                            <p className="text-[11px] text-rose-600 mt-0.5">
                              {(r.waktuPelanggaran || []).join(' | ')}
                            </p>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                            Aman (0x)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          (r.status || '').startsWith('Selesai')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleDeleteSingleRecord(r.id, r.nama)}
                          title={`Hapus data ${r.nama}`}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* MODAL PERINGATAN ANTI-CURANG */}
      {showCheatModal && (
        <div className="fixed inset-0 z-50 bg-rose-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border-2 border-rose-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-rose-700">PERINGATAN PENGAWASAN!</h3>
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
              Jenis Pelanggaran: {cheatReason}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Sistem mendeteksi Anda membuka jendela lain, membagi layar (<em>split-screen</em>), atau meninggalkan mode layar penuh. Kejadian ini telah tercatat otomatis pada laporan guru (<strong>Pelanggaran ke-{violations}</strong>).
            </p>
            <button
              onClick={() => {
                requestAppFullscreen();
                setShowCheatModal(false);
              }}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition"
            >
              Kembali ke Layar Penuh & Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

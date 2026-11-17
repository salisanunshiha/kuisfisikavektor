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
    id: 1,
    level: "C1 • Mengingat | Pilihan Ganda",
    stimulus: "Dalam fisika dan navigasi penerbangan, besaran dibagi menjadi dua kelompok utama berdasarkan ada tidaknya arah yang menyertai nilai pengukurannya.",
    question: "Kelompok besaran berikut yang seluruhnya merupakan besaran vektor adalah...",
    options: [
      "Perpindahan, kecepatan, gaya, dan momentum",
      "Jarak, kelajuan, massa, dan waktu",
      "Percepatan, usaha, energi kinetik, dan suhu",
      "Gaya, tekanan, luas, dan volume",
      "Impuls, daya, massa jenis, dan perpindahan"
    ],
    correct: 0
  },
  {
    id: 2,
    level: "C1 • Mengingat | Benar - Salah",
    stimulus: "Sebuah vektor gaya digambarkan dalam bentuk anak panah berarah pada bidang koordinat Kartesius dua dimensi.",
    question: "Tentukan kebenaran (Benar/Salah) dari ketiga pernyataan berikut mengenai representasi geometris vektor secara berurutan:\n1. Panjang anak panah menyatakan besar (nilai) vektor tersebut.\n2. Arah ujung anak panah menunjukkan arah vektor.\n3. Dua vektor dikatakan sama apabila memiliki besar yang sama meskipun arahnya berlawanan.",
    options: [
      "Benar – Benar – Salah",
      "Benar – Benar – Benar",
      "Benar – Salah – Salah",
      "Salah – Benar – Salah",
      "Salah – Salah – Benar"
    ],
    correct: 0
  },
  {
    id: 3,
    level: "C2 • Memahami | Pilihan Ganda",
    stimulus: "Seorang siswa berjalan kaki dari gerbang sekolah lurus ke timur sejauh 40 meter, kemudian berbalik arah lurus ke barat sejauh 40 meter hingga kembali tepat di gerbang sekolah.",
    question: "Pernyataan yang paling tepat mengenai jarak tempuh dan perpindahan siswa tersebut adalah...",
    options: [
      "Jarak tempuh 80 meter dan perpindahan 0 meter",
      "Jarak tempuh 0 meter dan perpindahan 80 meter",
      "Jarak tempuh 80 meter dan perpindahan 80 meter ke barat",
      "Jarak tempuh 40 meter dan perpindahan 0 meter",
      "Jarak tempuh 80 meter dan perpindahan 40 meter ke timur"
    ],
    correct: 0
  },
  {
    id: 4,
    level: "C2 • Memahami | Pilihan Ganda Kompleks",
    stimulus: "Diketahui dua buah vektor gaya F₁ = 10 N dan F₂ = 6 N bekerja pada satu titik tangkap yang sama dengan sudut apit θ yang dapat diubah-ubah dari 0° hingga 180°. Perhatikan pernyataan berikut:\n(1) Resultan maksimum kedua vektor adalah 16 N ketika sudut apitnya 0°.\n(2) Resultan minimum kedua vektor adalah 4 N ketika sudut apitnya 180°.\n(3) Nilai resultan kedua vektor tidak mungkin bernilai 2 N.\n(4) Ketika kedua vektor saling tegak lurus (θ = 90°), resultannya bernilai 14 N.",
    question: "Pernyataan yang benar ditunjukkan oleh nomor...",
    options: [
      "(1), (2), dan (3)",
      "(1) dan (2) saja",
      "(1), (3), dan (4)",
      "(2) dan (4) saja",
      "(1), (2), (3), dan (4)"
    ],
    correct: 0
  },
  {
    id: 5,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Sebuah drone pemetaan terbang mendatar ke arah timur sejauh 300 meter, kemudian berbelok tegak lurus ke arah utara sejauh 400 meter untuk mengambil foto udara.",
    question: "Besar perpindahan total drone dari titik awal keberangkatan hingga posisi akhir adalah...",
    options: [
      "500 meter",
      "100 meter",
      "350 meter",
      "700 meter",
      "250√2 meter"
    ],
    correct: 0
  },
  {
    id: 6,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Dua buah vektor gaya masing-masing bernilai F₁ = 8 N dan F₂ = 8 N bertitik tangkap sama dan saling mengapit sudut 120°.",
    question: "Besar resultan kedua vektor gaya tersebut adalah...",
    options: [
      "8 N",
      "4 N",
      "8√2 N",
      "8√3 N",
      "16 N"
    ],
    correct: 0
  },
  {
    id: 7,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Dua buah vektor gaya masing-masing F₁ = 6 N dan F₂ = 6 N saling mengapit sudut 60° pada sebuah cincin logam.",
    question: "Besar resultan gaya yang bekerja pada cincin logam tersebut adalah...",
    options: [
      "6√3 N",
      "6 N",
      "6√2 N",
      "12 N",
      "3√3 N"
    ],
    correct: 0
  },
  {
    id: 8,
    level: "C3 • Menerapkan | Benar - Salah",
    stimulus: "Seorang petugas menarik koper dengan gaya F = 40 N membentuk sudut 60° terhadap lantai mendatar (cos 60° = 0,5; sin 60° = 0,5√3).",
    question: "Tentukan kebenaran (Benar/Salah) komponen gaya tarik koper secara berurutan:\n1. Komponen gaya pada sumbu mendatar (Fx) bernilai 20 N.\n2. Komponen gaya pada sumbu vertikal (Fy) bernilai 20√3 N.\n3. Komponen gaya vertikal berfungsi menggerakkan koper maju ke depan.",
    options: [
      "Benar – Benar – Salah",
      "Benar – Benar – Benar",
      "Benar – Salah – Salah",
      "Salah – Benar – Benar",
      "Salah – Salah – Benar"
    ],
    correct: 0
  },
  {
    id: 9,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Diberikan dua buah vektor posisi dalam notasi vektor satuan: A = (3i + 4j) meter dan B = (5i - 2j) meter.",
    question: "Besar resultan penjumlahan vektor R = A + B adalah...",
    options: [
      "2√17 meter",
      "8 meter",
      "10 meter",
      "6√2 meter",
      "14 meter"
    ],
    correct: 0
  },
  {
    id: 10,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Sebuah perahu penyeberangan sungai bergerak tegak lurus memotong arus sungai dengan kecepatan 4 m/s. Pada saat yang sama, arus air sungai mengalir sejajar tepi sungai dengan kecepatan 3 m/s.",
    question: "Besar kecepatan resultan perahu yang diamati oleh orang yang berdiri diam di tepi sungai adalah...",
    options: [
      "5 m/s",
      "1 m/s",
      "7 m/s",
      "3,5 m/s",
      "4,5 m/s"
    ],
    correct: 0
  },
  {
    id: 11,
    level: "C3 • Menerapkan | Pilihan Ganda Kompleks",
    stimulus: "Sebuah vektor gaya F = 20 N berada pada kuadran I bidang Kartesius dan membentuk sudut 37° terhadap sumbu-X positif (sin 37° = 0,6 dan cos 37° = 0,8). Perhatikan pernyataan berikut:\n(1) Komponen vektor pada sumbu-X adalah +16 N.\n(2) Komponen vektor pada sumbu-Y adalah +12 N.\n(3) Jika ditulis dalam vektor satuan menjadi F = (16i + 12j) N.\n(4) Besar vektor jika dihitung dari √(Fx² + Fy²) menghasilkan 28 N.",
    question: "Pernyataan yang benar ditunjukkan oleh nomor...",
    options: [
      "(1), (2), dan (3)",
      "(1) dan (2) saja",
      "(1), (3), dan (4)",
      "(2) dan (4) saja",
      "(3) dan (4) saja"
    ],
    correct: 0
  },
  {
    id: 12,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Tiga buah vektor gaya bekerja pada satu titik tangkap: F₁ = 10 N ke arah timur (0°), F₂ = 10 N membentuk sudut 120° terhadap sumbu-X positif, dan F₃ = 10 N membentuk sudut 240° terhadap sumbu-X positif.",
    question: "Besar resultan ketiga vektor gaya simetris tersebut adalah...",
    options: [
      "0 N",
      "10 N",
      "10√3 N",
      "20 N",
      "30 N"
    ],
    correct: 0
  },
  {
    id: 13,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Diketahui dua buah vektor gaya F₁ = 5 N dan F₂ = 3 N memiliki besar resultan R = 7 N.",
    question: "Besar sudut apit θ antara vektor F₁ dan F₂ adalah...",
    options: [
      "60°",
      "30°",
      "45°",
      "90°",
      "120°"
    ],
    correct: 0
  },
  {
    id: 14,
    level: "C3 • Menerapkan | Pilihan Ganda",
    stimulus: "Diberikan dua buah vektor dalam ruang tiga dimensi: P = 2i + 3j - k dan Q = 4i - 2j + 2k.",
    question: "Hasil perkalian titik (dot product) P · Q adalah...",
    options: [
      "0",
      "2",
      "4",
      "12",
      "-4"
    ],
    correct: 0
  },
  {
    id: 15,
    level: "C4 • Menganalisis | Pilihan Ganda",
    stimulus: "Seorang kurir mengendarai motor menempuh rute berikut: pertama ke arah timur sejauh 6 km, lalu berbelok ke arah utara sejauh 8 km, kemudian berbelok ke arah barat sejauh 12 km.",
    question: "Besar perpindahan total kurir dari titik awal hingga titik akhir adalah...",
    options: [
      "10 km",
      "6 km",
      "14 km",
      "20 km",
      "26 km"
    ],
    correct: 0
  },
  {
    id: 16,
    level: "C4 • Menganalisis | Pilihan Ganda Kompleks",
    stimulus: "Dalam metode penjumlahan vektor secara poligon (segi banyak), lima buah vektor perpindahan A, B, C, D, dan E digambarkan saling menyambung ujung pangkalnya hingga pangkal vektor A bertemu kembali dengan ujung vektor E membentuk bangun segi lima tertutup. Perhatikan hasil analisis berikut:\n(1) Resultan kelima vektor tersebut sama dengan nol (R = 0).\n(2) Vektor E merupakan vektor negatif dari jumlah keempat vektor lainnya (E = -(A + B + C + D)).\n(3) Jumlah komponen seluruh vektor pada sumbu-X sama dengan nol (ΣFx = 0).\n(4) Panjang lintasan total yang ditempuh benda juga sama dengan nol.",
    question: "Pernyataan analisis yang tepat ditunjukkan oleh nomor...",
    options: [
      "(1), (2), dan (3)",
      "(1) dan (2) saja",
      "(1), (3), dan (4)",
      "(2) dan (4) saja",
      "(1), (2), (3), dan (4)"
    ],
    correct: 0
  },
  {
    id: 17,
    level: "C4 • Menganalisis | Pilihan Ganda",
    stimulus: "Dua buah vektor gaya yang sama besar (F₁ = F₂ = F) bekerja pada sebuah benda. Agar besar resultan kedua vektor tersebut sama dengan √2 kali besar masing-masing vektor (R = F√2), sudut apitnya harus diatur secara tepat.",
    question: "Besar sudut apit antara kedua vektor tersebut adalah...",
    options: [
      "90°",
      "30°",
      "45°",
      "60°",
      "120°"
    ],
    correct: 0
  },
  {
    id: 18,
    level: "C4 • Menganalisis | Benar - Salah",
    stimulus: "Sebuah sungai selebar 120 meter memiliki arus air mengalir ke timur dengan kecepatan 3 m/s. Seorang perenang hendak menyeberang dari tepi selatan ke tepi utara dengan kecepatan renang 4 m/s terhadap air.",
    question: "Tentukan kebenaran (Benar/Salah) hasil analisis penyeberangan tersebut secara berurutan apabila perenang mengarahkan tubuhnya lurus ke utara:\n1. Waktu yang diperlukan perenang untuk sampai di tepi seberang adalah 30 detik.\n2. Perenang akan tiba di tepi utara pada posisi bergeser 90 meter ke arah timur dari titik lurus di depannya.\n3. Kecepatan resultan perenang terhadap pengamat di darat adalah 5 m/s.",
    options: [
      "Benar – Benar – Benar",
      "Benar – Benar – Salah",
      "Benar – Salah – Benar",
      "Salah – Benar – Benar",
      "Salah – Salah – Benar"
    ],
    correct: 0
  },
  {
    id: 19,
    level: "C4 • Menganalisis | Pilihan Ganda",
    stimulus: "Tiga buah vektor gaya bekerja pada pusat koordinat Kartesius: F₁ = 10 N berarah 30° terhadap sumbu-X positif, F₂ = 10 N berarah 150° terhadap sumbu-X positif, dan F₃ = 10 N berarah 270° (sumbu-Y negatif). (sin 30° = 0,5; cos 30° = 0,5√3).",
    question: "Besar dan arah resultan ketiga vektor gaya tersebut adalah...",
    options: [
      "0 N (setimbang)",
      "10 N ke arah sumbu-Y positif",
      "10 N ke arah sumbu-Y negatif",
      "10√3 N ke arah sumbu-X positif",
      "20 N ke arah 90°"
    ],
    correct: 0
  },
  {
    id: 20,
    level: "C4 • Menganalisis | Pilihan Ganda",
    stimulus: "Sebuah vektor kecepatan v diuraikan menjadi dua komponen yang saling tegak lurus, yaitu vx dan vy. Jika diketahui perbandingan besar komponen mendatar dan komponen vertikalnya adalah vx : vy = 1 : √3.",
    question: "Besar sudut yang dibentuk vektor kecepatan v terhadap sumbu-X positif adalah...",
    options: [
      "60°",
      "30°",
      "45°",
      "37°",
      "53°"
    ],
    correct: 0
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
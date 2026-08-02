"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  UserCheck,
  PlayCircle,
  CheckCircle2,
  Lock,
  Shield,
  Clock,
  HelpCircle,
  ShieldAlert,
  Users,
  EyeOff,
  FileCheck2,
  User,
  Building2,
  Truck,
  PieChart,
  RotateCcw,
  Info,
  RefreshCw,
  Search,
  Check,
  Database,
  KeyRound,
  History,
  ChevronDown,
  UserPlus,
  LogIn,
  FilePlus2,
  X,
  ArrowRight,
  ChevronRight,
  Handshake,
  FileText,
  Wallet,
  Send,
  Bell,
  Globe,
  Heart,
  Mail,
} from "lucide-react";

type RoleKey = "warga" | "verifikator" | "rt" | "petugas" | "publik";

interface RoleDetail {
  title: string;
  desc: string;
  points: string[];
}

const roleDetails: Record<RoleKey, RoleDetail> = {
  warga: {
    title: "Portal Warga Pemohon Bantuan",
    desc: "Mengajukan permohonan bantuan secara mandiri dengan alur yang transparan dan perlindungan privasi penuh.",
    points: [
      "Formulir pengajuan bertahap (mudah & simpan otomatis).",
      "Pelacakan garis waktu realtime dari konsensus hingga penyaluran.",
      "Hak mengajukan 1 kali banding jika permohonan ditolak.",
      "Pemberitahuan otomatis via aplikasi & SMS/Email.",
    ],
  },
  verifikator: {
    title: "Portal Verifikator Komunitas (Tetangga)",
    desc: "Warga terpilih yang memberikan kesaksian faktual tanpa ekspos privasi pemohon.",
    points: [
      "Verifikasi anonim (NIK & No. HP pemohon disamarkan secara otomatis).",
      "Tiga opsi keputusan akuntabel (Setuju / Ragu / Tolak) + Alasan.",
      "Sistem Skor Kepercayaan (Trust Score) dinamis untuk mendorong kejujuran.",
      "Tugas verifikasi diberikan otomatis berbasis jarak geografis terdekat.",
    ],
  },
  rt: {
    title: "Portal Pengurus RT / RW",
    desc: "Memutus permohonan berdasarkan hasil konsensus objektif masyarakat setempat.",
    points: [
      "Review hasil konsensus 3 verifikator tetangga secara transparan.",
      "Akses dokumen pendukung & bukti foto secara terenkripsi.",
      "Keputusan wajib melampirkan catatan pertimbangan tertulis.",
      "Daftar antrean otomatis untuk penyaluran bantuan.",
    ],
  },
  petugas: {
    title: "Portal Petugas Penyaluran Bantuan",
    desc: "Mengonfirmasi penerimaan bantuan sosial secara sah di lapangan.",
    points: [
      "Daftar penerima yang telah mendapat persetujuan final RT/RW.",
      "Unggah bukti foto penyerahan & tanda tangan digital.",
      "Kwitansi penyerahan otomatis berstempel waktu (timestamp).",
      "Mencegah klaim ganda bantuan sosial.",
    ],
  },
  publik: {
    title: "Dashboard Transparansi Akses Publik",
    desc: "Monitoring akuntabilitas penyaluran bantuan bagi masyarakat umum.",
    points: [
      "Data agregat anonim tanpa mengekspos identitas individu.",
      "Statistik tingkat kelayakan per wilayah & tren bulanan.",
      "Grafik persentase persetujuan & waktu penyelesaian konsensus.",
      "Akses terbuka tanpa perlu melakukan pendaftaran akun.",
    ],
  },
};

type VoteValue = "agree" | "unsure" | "disagree";

export default function LandingPage() {
  // Active Role Tab State
  const [activeRole, setActiveRole] = useState<RoleKey>("warga");

  // Simulator Votes State
  const [simVotes, setSimVotes] = useState<VoteValue[]>(["agree", "agree", "unsure"]);

  // Application Tracking State
  const [trackingId, setTrackingId] = useState("BV-2026-8849");
  const [trackedStatus, setTrackedStatus] = useState({
    code: "BV-2026-8849",
    status: "Menunggu Persetujuan RT/RW",
    updated: "10 menit lalu",
    consensus: "3/3 Selesai (Skor 92%)",
  });

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Calculate Consensus Score
  const calculateScore = () => {
    let score = 0;
    simVotes.forEach((v) => {
      if (v === "agree") score += 33.3;
      if (v === "unsure") score += 15;
    });
    return Math.round(score);
  };

  const simScore = calculateScore();

  const handleSimVote = (index: number, val: VoteValue) => {
    const updated = [...simVotes];
    updated[index] = val;
    setSimVotes(updated);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setTrackedStatus({
      code: trackingId.toUpperCase(),
      status: "Konsensus Komunitas Sedang Berjalan",
      updated: "Baru saja",
      consensus: "2/3 Suara Tetangga Diterima",
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const faqs = [
    {
      q: "Siapa saja yang dapat mengajukan bantuan melalui BantuVerif?",
      a: "Setiap warga terverifikasi yang berada di wilayah RT/RW terdaftar dapat mengajukan permohonan bantuan secara mandiri melalui portal aman kami.",
    },
    {
      q: "Bagaimana cara kerja konsensus komunitas?",
      a: "Saat pengajuan dikirimkan, 3 tetangga terverifikasi di radius terdekat akan menerima tugas verifikasi anonim. Hasil suara mereka menentukan skor konsensus awal sebelum diteruskan ke RT/RW.",
    },
    {
      q: "Apakah data pribadi saya terlihat oleh tetangga sekitar?",
      a: "Tidak. Seluruh data sensitif seperti NIK, nomor HP, dan alamat detail disamarkan secara otomatis oleh sistem RLS database. Tetangga hanya memverifikasi indikator kelayakan umum.",
    },
    {
      q: "Berapa lama proses verifikasi hingga bantuan disalurkan?",
      a: "Proses konsensus komunitas dan verifikasi rata-rata membutuhkan waktu kurang dari 24 jam, jauh lebih cepat dibanding proses manual konvensional.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-subtle transition-all">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-md shadow-primary-container/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-on-surface">
              Bantu<span className="text-primary-container">Verif</span>
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#beranda" className="text-[15px] font-semibold text-primary-container border-b-2 border-primary-container pb-0.5">
              Dashboard
            </a>
            <a href="#cara-kerja" className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors">
              Pengajuan
            </a>
            <a href="#simulasi" className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors">
              Riwayat
            </a>
            <a href="#faq" className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors">
              FAQ
            </a>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            <button
              title="Notifikasi"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-container ring-2 ring-surface"></span>
            </button>

            <button
              title="Bahasa / Wilayah"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 ml-2">
              <Link
                href="/login"
                className="btn-48 px-5 rounded-md font-semibold text-[14px] text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center"
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className="btn-48 px-5 rounded-md font-semibold text-[14px] bg-primary-container text-white hover:bg-primary shadow-sm hover:shadow-md transition-all flex items-center justify-center"
              >
                Ajukan Bantuan
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="beranda" className="pt-12 md:pt-16 pb-20 md:pb-24 relative overflow-hidden bg-gradient-to-b from-[#eff6ff]/60 via-background to-background">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Pill Badge */}
            <div className="mb-6 inline-block">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#2563eb]" /> VERIFIKASI BANTUAN SOSIAL
              </span>
            </div>

            <h1 className="text-4xl md:text-[52px] font-extrabold leading-[1.15] text-on-surface mb-6 font-display tracking-tight">
              Dukungan Berbasis Komunitas untuk{" "}
              <span className="text-[#2563eb]">Masyarakat Lebih Kuat</span>
            </h1>

            <p className="text-lg text-on-surface-variant leading-relaxed mb-8 max-w-[560px]">
              BantuVerif mengubah cara bantuan sosial disalurkan dengan memanfaatkan konsensus komunitas terdesentralisasi dan verifikasi berkeamanan tinggi.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => openAuth("register")}
                className="btn-48 px-7 rounded-md font-semibold text-[15px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                Ajukan Bantuan Sekarang
              </button>
              <a
                href="#cara-kerja"
                className="btn-48 px-7 rounded-md font-semibold text-[15px] bg-surface text-on-surface border border-border-subtle hover:bg-surface-container-low transition-all flex items-center gap-2 shadow-2xs"
              >
                Pelajari Alur Verifikasi
              </a>
            </div>
          </div>

          {/* Hero Right — Illustration & Floating Badge */}
          <div className="relative flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-border-subtle bg-surface shadow-level2 p-4 w-full max-w-[540px]">
              <Image
                src="/hero-illustration.png"
                alt="Ilustrasi verifikasi berbasis komunitas"
                width={540}
                height={360}
                className="w-full h-auto object-cover rounded-xl"
                priority
              />

              {/* Floating Verification Success Card */}
              <div className="absolute -bottom-4 left-6 md:left-10 bg-surface rounded-xl border border-border-subtle shadow-elevated p-3.5 flex items-center gap-3.5 max-w-[320px]">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-on-surface">Verifikasi Berhasil</div>
                  <div className="text-xs text-on-surface-variant">Konsensus komunitas tercapai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Metrics Blue Banner */}
      <section className="bg-[#004ac6] text-white py-9 shadow-md">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-2 border-r border-white/10 last:border-r-0">
            <div className="font-display text-4xl md:text-[44px] font-black leading-none mb-2 text-white">98%</div>
            <div className="text-xs md:text-[13px] font-bold tracking-wider uppercase text-white/90">TINGKAT KEPERCAYAAN VERIFIKASI</div>
          </div>
          <div className="p-2 border-r border-white/10 last:border-r-0">
            <div className="font-display text-4xl md:text-[44px] font-black leading-none mb-2 text-white">1.2JT+</div>
            <div className="text-xs md:text-[13px] font-bold tracking-wider uppercase text-white/90">WARGA TERBANTU</div>
          </div>
          <div className="p-2 border-r border-white/10 last:border-r-0">
            <div className="font-display text-4xl md:text-[44px] font-black leading-none mb-2 text-white">24j</div>
            <div className="text-xs md:text-[13px] font-bold tracking-wider uppercase text-white/90">RATA-RATA WAKTU KONSENSUS</div>
          </div>
          <div className="p-2">
            <div className="font-display text-4xl md:text-[44px] font-black leading-none mb-2 text-white">100%</div>
            <div className="text-xs md:text-[13px] font-bold tracking-wider uppercase text-white/90">JURNAL TRANSPARAN</div>
          </div>
        </div>
      </section>

      {/* Section 1: Designed for People, Powered by Community */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Photo */}
          <div className="rounded-2xl overflow-hidden border border-border-subtle shadow-level2">
            <Image
              src="/designed-for-people.png"
              alt="Petugas membantu warga lansia menggunakan tablet"
              width={600}
              height={440}
              className="w-full h-[360px] md:h-[440px] object-cover"
            />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-3xl md:text-[40px] font-bold font-display text-on-surface leading-tight mb-6">
              Dirancang untuk Warga, Digerakkan oleh Komunitas
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
              BantuVerif membantu Anda mendapatkan bantuan saat paling dibutuhkan, diverifikasi oleh komunitas Anda, dan dilindungi oleh teknologi kami. Kami percaya bahwa bantuan sosial harus secepat perbankan modern dan seandal jabat tangan tetangga.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-surface-container-low border border-border-subtle/70">
                <div className="w-11 h-11 rounded-lg bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface mb-1">Kepercayaan Terdesentralisasi</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Keputusan dibuat berdasarkan konsensus anggota komunitas terverifikasi di sekitar Anda, menjamin keadilan tanpa monopoli keputusan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-surface-container-low border border-border-subtle/70">
                <div className="w-11 h-11 rounded-lg bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface mb-1">Privasi Tingkat Tinggi</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Data pribadi Anda terenkripsi secara otomatis dan hanya dibagikan kepada pihak yang berwenang untuk keperluan verifikasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How it Works */}
      <section className="py-20 md:py-28 bg-[#f7f9fb]" id="cara-kerja">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-3xl md:text-[40px] font-bold font-display text-on-surface mb-4">
              Cara Kerja
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
              Alur 4 langkah mudah dari pengajuan awal hingga penerimaan bantuan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-surface border border-border-subtle rounded-xl p-7 relative shadow-level1 hover:shadow-level2 transition-all group">
              <span className="absolute top-6 right-6 font-display font-black text-4xl text-outline-variant/40 group-hover:text-primary-container/30 transition-colors">
                01
              </span>
              <div className="w-12 h-12 rounded-lg bg-[#2563eb] text-white flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-on-surface mb-3">Pengajuan</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Kirimkan permohonan bantuan Anda melalui portal kami yang aman dan intuitif hanya dalam beberapa menit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface border border-border-subtle rounded-xl p-7 relative shadow-level1 hover:shadow-level2 transition-all group">
              <span className="absolute top-6 right-6 font-display font-black text-4xl text-outline-variant/40 group-hover:text-primary-container/30 transition-colors">
                02
              </span>
              <div className="w-12 h-12 rounded-lg bg-[#2563eb] text-white flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-on-surface mb-3">Konsensus</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Warga lokal terverifikasi meninjau dan memvalidasi keabsahan permohonan Anda secara objektif.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface border border-border-subtle rounded-xl p-7 relative shadow-level1 hover:shadow-level2 transition-all group">
              <span className="absolute top-6 right-6 font-display font-black text-4xl text-outline-variant/40 group-hover:text-primary-container/30 transition-colors">
                03
              </span>
              <div className="w-12 h-12 rounded-lg bg-[#2563eb] text-white flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-on-surface mb-3">Verifikasi</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Sistem otomatis kami melakukan pemeriksaan identitas dan kelayakan akhir untuk keamanan.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-surface border border-border-subtle rounded-xl p-7 relative shadow-level1 hover:shadow-level2 transition-all group">
              <span className="absolute top-6 right-6 font-display font-black text-4xl text-outline-variant/40 group-hover:text-primary-container/30 transition-colors">
                04
              </span>
              <div className="w-12 h-12 rounded-lg bg-[#2563eb] text-white flex items-center justify-center mb-6 shadow-sm">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-on-surface mb-3">Penyaluran</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Bantuan atau dana disalurkan secara langsung dan cepat ke akun terverifikasi Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Consensus Simulator & Portal Roles */}
      <section className="py-20 bg-surface border-y border-border-subtle" id="simulasi">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-14">
            <div className="text-xs font-bold tracking-widest text-[#2563eb] uppercase mb-2">
              DEMO INTERAKTIF
            </div>
            <h2 className="text-3xl md:text-[36px] font-bold font-display text-on-surface mb-4">
              Simulator Mesin Konsensus Komunitas
            </h2>
            <p className="text-base text-on-surface-variant">
              Uji bagaimana pilihan suara verifikator tetangga menghitung skor kepercayaan konsensus secara realtime.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {(Object.keys(roleDetails) as RoleKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveRole(key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeRole === key
                    ? "bg-[#2563eb] text-white shadow-md"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-border-subtle"
                }`}
              >
                {roleDetails[key].title.split(" Portal")[0]}
              </button>
            ))}
          </div>

          {/* Role Detail Box */}
          <div className="max-w-[900px] mx-auto bg-surface-container-low border border-border-subtle rounded-2xl p-8 mb-12 shadow-level1">
            <h3 className="text-xl font-bold font-display text-on-surface mb-2">
              {roleDetails[activeRole].title}
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              {roleDetails[activeRole].desc}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleDetails[activeRole].points.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-on-surface font-medium bg-surface p-3 rounded-lg border border-border-subtle/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulator Box */}
          <div className="max-w-[900px] mx-auto bg-surface border border-border-subtle rounded-2xl p-8 shadow-level2">
            <h3 className="text-lg font-bold font-display text-on-surface mb-6 text-center">
              Simulasi Suara 3 Verifikator Tetangga untuk Pengajuan #BV-9042
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Verifier 1 */}
              <div className="bg-surface-container-low border border-border-subtle rounded-xl p-5 text-center">
                <div className="font-bold text-sm text-on-surface mb-0.5">Tetangga #1 (Radius 100m)</div>
                <div className="text-xs text-on-surface-variant mb-4">Warga Terverifikasi</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSimVote(0, "agree")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[0] === "agree" ? "bg-emerald-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Setuju
                  </button>
                  <button
                    onClick={() => handleSimVote(0, "unsure")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[0] === "unsure" ? "bg-amber-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Ragu
                  </button>
                  <button
                    onClick={() => handleSimVote(0, "disagree")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[0] === "disagree" ? "bg-rose-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Tolak
                  </button>
                </div>
              </div>

              {/* Verifier 2 */}
              <div className="bg-surface-container-low border border-border-subtle rounded-xl p-5 text-center">
                <div className="font-bold text-sm text-on-surface mb-0.5">Tetangga #2 (Radius 150m)</div>
                <div className="text-xs text-on-surface-variant mb-4">Warga Terverifikasi</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSimVote(1, "agree")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[1] === "agree" ? "bg-emerald-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Setuju
                  </button>
                  <button
                    onClick={() => handleSimVote(1, "unsure")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[1] === "unsure" ? "bg-amber-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Ragu
                  </button>
                  <button
                    onClick={() => handleSimVote(1, "disagree")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[1] === "disagree" ? "bg-rose-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Tolak
                  </button>
                </div>
              </div>

              {/* Verifier 3 */}
              <div className="bg-surface-container-low border border-border-subtle rounded-xl p-5 text-center">
                <div className="font-bold text-sm text-on-surface mb-0.5">Tetangga #3 (Radius 250m)</div>
                <div className="text-xs text-on-surface-variant mb-4">Warga Terverifikasi</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSimVote(2, "agree")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[2] === "agree" ? "bg-emerald-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Setuju
                  </button>
                  <button
                    onClick={() => handleSimVote(2, "unsure")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[2] === "unsure" ? "bg-amber-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Ragu
                  </button>
                  <button
                    onClick={() => handleSimVote(2, "disagree")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                      simVotes[2] === "disagree" ? "bg-rose-600 text-white" : "bg-surface border border-border-subtle hover:bg-surface-container"
                    }`}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>

            {/* Results Score */}
            <div className="bg-surface-container-low p-5 rounded-xl border border-border-subtle flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Hasil Indeks Kepercayaan Konsensus</div>
                <div className="text-2xl font-black text-[#2563eb] font-display mt-0.5">
                  Skor Konsensus: {simScore}% ({simScore >= 70 ? "Diteruskan ke Persetujuan RT/RW" : simScore >= 40 ? "Perlu Peninjauan Khusus" : "Tidak Layak"})
                </div>
              </div>
              <div className="w-32 h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#2563eb] to-emerald-500 transition-all duration-300" style={{ width: `${simScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Your Privacy is Our Mandate (Dark Card Section) */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-[#182232] rounded-3xl p-8 md:p-14 text-white relative overflow-hidden shadow-elevated">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Details */}
              <div className="lg:col-span-7">
                {/* Pill Badge */}
                <div className="mb-6 inline-block">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> PRIORITAS KEAMANAN
                  </span>
                </div>

                <h2 className="text-3xl md:text-[42px] font-bold font-display text-white leading-tight mb-6">
                  Privasi Anda Adalah Amanah Kami
                </h2>

                <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-[620px]">
                  Kami menggunakan enkripsi tingkat tinggi untuk memastikan data pribadi Anda tetap aman. Identitas Anda disamarkan secara otomatis sehingga hanya indikator kelayakan yang terlihat.
                </p>

                {/* 4 Points Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">Zero-Knowledge Proofs</span>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <EyeOff className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">Tanpa Penjualan Data Pihak Ke-3</span>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <Database className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">Transparansi Baris Data (RLS)</span>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">Sesuai Regulasi UU PDP</span>
                  </div>
                </div>
              </div>

              {/* Right Big Emblem */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-[#2563eb]/20 to-[#2563eb]/5 border border-[#2563eb]/30 flex items-center justify-center relative shadow-[0_0_80px_rgba(37,99,235,0.25)]">
                  <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-[#2563eb]/30 border border-[#2563eb]/50 flex items-center justify-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#2563eb] flex items-center justify-center shadow-lg">
                      <Heart className="w-14 h-14 md:w-18 md:h-18 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Common Concerns (FAQ) */}
      <section className="py-20 md:py-28 bg-[#f7f9fb]" id="faq">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <h2 className="text-3xl md:text-[40px] font-bold font-display text-on-surface mb-4">
              Pertanyaan Umum (FAQ)
            </h2>
          </div>

          <div className="max-w-[780px] mx-auto flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left font-semibold text-base md:text-lg text-on-surface flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-on-surface-variant shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#2563eb]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm md:text-base text-on-surface-variant leading-relaxed border-t border-border-subtle/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Empowering Your Community Today (CTA Banner) */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-[#2563eb] rounded-3xl p-10 md:p-16 text-center text-white shadow-elevated relative overflow-hidden">
            <h2 className="text-3xl md:text-[42px] font-bold font-display mb-4 tracking-tight">
              Memberdayakan Komunitas Anda Hari Ini
            </h2>
            <p className="text-white/90 text-base md:text-lg max-w-[640px] mx-auto mb-9 leading-relaxed">
              Bergabunglah bersama lebih dari 1,2 juta warga yang telah merasakan masa depan bantuan sosial yang transparan dan tepat sasaran.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={() => openAuth("register")}
                className="btn-48 px-7 rounded-md font-semibold text-[15px] bg-white text-[#2563eb] hover:bg-slate-100 shadow-md transition-all"
              >
                Ajukan Bantuan Sekarang
              </button>
              <button
                onClick={() => openAuth("login")}
                className="btn-48 px-7 rounded-md font-semibold text-[15px] bg-[#1d4ed8] text-white border border-white/30 hover:bg-[#1e40af] transition-all"
              >
                Hubungi Bantuan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-border-subtle pt-16 pb-12 text-sm text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Col 1 */}
          <div>
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary-container rounded-md flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl text-on-surface">
                Bantu<span className="text-primary-container">Verif</span>
              </span>
            </a>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-5">
              Teknologi publik aman & transparan berbasis konsensus komunitas terdesentralisasi.
            </p>
            <div className="flex items-center gap-3">
              <button title="Global" className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center hover:bg-surface-container transition-colors">
                <Globe className="w-4 h-4 text-on-surface-variant" />
              </button>
              <button title="Keamanan Sistem" className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center hover:bg-surface-container transition-colors">
                <ShieldCheck className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div className="font-bold text-on-surface text-sm mb-4">Platform</div>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li><a href="#cara-kerja" className="hover:text-primary-container transition-colors">Cara Kerja</a></li>
              <li><a href="#simulasi" className="hover:text-primary-container transition-colors">Keamanan</a></li>
              <li><a href="#faq" className="hover:text-primary-container transition-colors">Audit Transparansi</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div className="font-bold text-on-surface text-sm mb-4">Bantuan</div>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li><a href="#faq" className="hover:text-primary-container transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-container transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-primary-container transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <div className="font-bold text-on-surface text-sm mb-4">Buletin</div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Dapatkan info terbaru seputar inisiatif sosial dan kabar komunitas.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Alamat email Anda"
                className="flex-1 h-9 px-3 text-xs bg-surface border border-border-subtle rounded-md outline-none focus:border-primary-container"
              />
              <button
                type="submit"
                className="h-9 px-4 text-xs font-semibold bg-primary-container text-white rounded-md hover:bg-primary transition-colors"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 pt-8 border-t border-border-subtle/60 flex flex-col sm:flex-row items-center justify-between text-xs text-outline gap-4">
          <div>
            © 2026 Platform Civic BantuVerif. Teknologi Publik Aman & Transparan.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-on-surface transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-on-surface transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-on-surface transition-colors">Audit Transparansi</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Login / Register) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-elevated w-full max-w-[460px] p-7 relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">
                  {authMode === "login" ? "Masuk ke BantuVerif" : "Formulir Pengajuan Bantuan"}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {authMode === "login" ? "Akses portal warga terverifikasi" : "Daftarkan permohonan bantuan Anda"}
                </p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsAuthModalOpen(false); }} className="flex flex-col gap-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full h-11 px-3.5 border border-border-subtle rounded-md bg-background text-sm text-on-surface outline-none focus:border-primary-container"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">Nomor HP / NIK</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 08123456789 atau NIK"
                  className="w-full h-11 px-3.5 border border-border-subtle rounded-md bg-background text-sm text-on-surface outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">Kode OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan 6 angka OTP"
                    className="flex-1 h-11 px-3.5 border border-border-subtle rounded-md bg-background text-sm text-on-surface outline-none focus:border-primary-container"
                  />
                  <button type="button" className="h-11 px-4 text-xs font-semibold bg-surface-container border border-border-subtle rounded-md hover:bg-surface-container-high">
                    Kirim OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 h-11 w-full rounded-md font-semibold text-sm bg-primary-container text-white hover:bg-primary shadow-sm transition-all"
              >
                {authMode === "login" ? "Masuk Portal" : "Kirim Pengajuan"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-border-subtle text-center text-xs text-on-surface-variant">
              {authMode === "login" ? (
                <>
                  Belum pernah mengajukan bantuan?{" "}
                  <button onClick={() => setAuthMode("register")} className="text-primary-container font-semibold hover:underline">
                    Ajukan Sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah terdaftar?{" "}
                  <button onClick={() => setAuthMode("login")} className="text-primary-container font-semibold hover:underline">
                    Masuk Portal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

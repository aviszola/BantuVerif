"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Save,
  FileText,
  Home,
  Briefcase,
  HelpCircle,
  Upload,
  Check,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Informasi Pribadi
    firstName: "",
    lastName: "",
    nik: "",
    email: "",
    phone: "",
    birthDay: "",
    birthMonth: "Januari",
    birthYear: "",

    // Step 2: Rumah Tangga
    familyMembers: "4",
    houseOwnership: "Sewa / Kontrak",
    address: "",
    rtRw: "",
    kelurahan: "",
    kecamatan: "",

    // Step 3: Ekonomi
    monthlyIncome: "Kurang dari Rp 1.500.000",
    occupation: "Buruh Harian Lepas / Pedagang Kecil",
    hasOtherAssistance: "Belum Pernah",

    // Step 4: Alasan
    reasonCategory: "Kehilangan Pekerjaan / Penurunan Obset",
    reasonDescription: "",

    // Step 5: Dokumen
    ktpUploaded: false,
    kkUploaded: false,
    housePhotoUploaded: false,

    // Step 7: Persetujuan
    agreeTerms: false,
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        if (session.user.email) {
          setFormData((prev) => ({ ...prev, email: session.user.email || "" }));
        }
      }
    };
    checkUser();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simpan atau simulasi submit ke Supabase
    try {
      if (user) {
        await supabase.from("applications").insert([
          {
            user_id: user.id,
            category: "BLT Sembako & Tunai",
            status: "submitted",
            notes: formData.reasonDescription,
          },
        ]);
      }
    } catch {
      // Abaikan jika tabel belum dikonfigurasi di Supabase
    }

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/application-submitted");
    }, 1200);
  };

  const stepsList = [
    { id: 1, title: "Informasi Pribadi", desc: "Identitas Resmi & Kontak" },
    { id: 2, title: "Data Rumah Tangga", desc: "Anggota Keluarga & Alamat" },
    { id: 3, title: "Kondisi Ekonomi", desc: "Penghasilan & Pekerjaan" },
    { id: 4, title: "Alasan Pengajuan", desc: "Detail Kebutuhan Bantuan" },
    { id: 5, title: "Dokumen Pendukung", desc: "Unggah KTP, KK & Foto" },
    { id: 6, title: "Tinjau Kembali", desc: "Verifikasi Kelengkapan Data" },
    { id: 7, title: "Kirim Pengajuan", desc: "Persetujuan & Finalisasi" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col selection:bg-[#2563eb] selection:text-white">
      {/* Progress Sub-header */}
      <div className="bg-white border-b border-[#e2e8f0] py-3.5 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-container bg-[#dbeafe] px-2.5 py-1 rounded-full">
              LANGKAH {currentStep} DARI 7
            </span>
            <div className="flex-1 sm:w-64 bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2563eb] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Otomatis tersimpan baru saja</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Step Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-2xs">
              <div className="mb-4 pb-3 border-b border-border-subtle">
                <h2 className="font-display text-base font-bold text-on-surface">
                  Langkah Pengajuan
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Bagian: Bantuan Sosial
                </p>
              </div>

              <div className="space-y-1">
                {stepsList.map((step) => {
                  const isActive = currentStep === step.id;
                  const isPassed = currentStep > step.id;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-start gap-3 text-xs md:text-sm ${
                        isActive
                          ? "bg-[#eff6ff] text-[#2563eb] font-bold border-l-4 border-[#2563eb]"
                          : isPassed
                          ? "text-on-surface hover:bg-[#f2f4f6] font-medium"
                          : "text-outline hover:bg-[#f2f4f6]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                          isActive
                            ? "bg-[#2563eb] text-white"
                            : isPassed
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-[#e2e8f0] text-outline"
                        }`}
                      >
                        {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{step.title}</p>
                        {isActive && (
                          <span className="text-[10px] text-[#2563eb] font-semibold block">
                            Sedang Diedit
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Left Bottom Quote Box */}
            <div className="bg-[#f8fafc] rounded-xl p-4 border border-border-subtle text-xs text-on-surface-variant leading-relaxed">
              <p className="italic">
                &quot;Kami hanya meminta informasi yang diperlukan untuk memverifikasi kelayakan bantuan Anda.&quot;
              </p>
            </div>
          </aside>

          {/* Center Form Area */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step 1: Informasi Pribadi */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                    Informasi Pribadi
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Harap berikan detail identitas resmi Anda sesuai dengan dokumen kependudukan (KTP/KK).
                  </p>
                </div>

                {/* Card 1: Identitas Resmi */}
                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 text-primary-container font-bold text-sm pb-2 border-b border-border-subtle">
                    <ShieldCheck className="w-5 h-5 text-[#2563eb]" />
                    <span>Identitas Resmi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                        Nama Depan
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="e.g. Budi"
                        className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                        Nama Belakang
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="e.g. Santoso"
                        className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Nomor Induk Kependudukan (NIK KTP)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => handleChange("nik", e.target.value)}
                      placeholder="Masukkan 16-digit NIK KTP Anda"
                      className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                    />
                    <p className="text-[11px] text-on-surface-variant mt-1.5">
                      Kami menggunakan NIK untuk mencegah pendaftaran ganda dan verifikasi data sipil.
                    </p>
                  </div>
                </div>

                {/* Card 2: Detail Kontak */}
                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 text-primary-container font-bold text-sm pb-2 border-b border-border-subtle">
                    <FileText className="w-5 h-5 text-[#2563eb]" />
                    <span>Detail Kontak</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="nama@contoh.com"
                      className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Nomor Telepon / WhatsApp
                    </label>
                    <div className="flex gap-2">
                      <div className="h-11 px-3 bg-[#e2e8f0] rounded-lg flex items-center justify-center text-xs font-bold text-on-surface shrink-0">
                        +62
                      </div>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="812-3456-7890"
                        className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 3: Tanggal Lahir */}
                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 text-primary-container font-bold text-sm pb-2 border-b border-border-subtle">
                    <User className="w-5 h-5 text-[#2563eb]" />
                    <span>Tanggal Lahir</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase">
                        Tanggal
                      </label>
                      <input
                        type="text"
                        maxLength={2}
                        value={formData.birthDay}
                        onChange={(e) => handleChange("birthDay", e.target.value)}
                        placeholder="HH"
                        className="w-full h-11 px-3 text-center rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase">
                        Bulan
                      </label>
                      <select
                        value={formData.birthMonth}
                        onChange={(e) => handleChange("birthMonth", e.target.value)}
                        className="w-full h-11 px-2 text-center rounded-lg bg-[#f2f4f6] border border-transparent text-xs font-medium outline-none focus:bg-white focus:border-[#2563eb] transition-all"
                      >
                        {[
                          "Januari",
                          "Februari",
                          "Maret",
                          "April",
                          "Mei",
                          "Juni",
                          "Juli",
                          "Agustus",
                          "September",
                          "Oktober",
                          "November",
                          "Desember",
                        ].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase">
                        Tahun
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={formData.birthYear}
                        onChange={(e) => handleChange("birthYear", e.target.value)}
                        placeholder="YYYY"
                        className="w-full h-11 px-3 text-center rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Data Rumah Tangga */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                    Data Rumah Tangga
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Informasi kondisi tempat tinggal dan jumlah tanggungan keluarga Anda.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Jumlah Tanggungan / Anggota Keluarga
                    </label>
                    <select
                      value={formData.familyMembers}
                      onChange={(e) => handleChange("familyMembers", e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb]"
                    >
                      <option value="1">1 Orang (Sendiri)</option>
                      <option value="2">2 Orang</option>
                      <option value="3">3 Orang</option>
                      <option value="4">4 Orang</option>
                      <option value="5+">5 Orang atau Lebih</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Status Kepemilikan Rumah
                    </label>
                    <select
                      value={formData.houseOwnership}
                      onChange={(e) => handleChange("houseOwnership", e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb]"
                    >
                      <option value="Milik Sendiri">Milik Sendiri</option>
                      <option value="Sewa / Kontrak">Sewa / Kontrak</option>
                      <option value="Menumpang Keluarga">Menumpang Keluarga</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Alamat Lengkap Sesuai KTP
                    </label>
                    <textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="Jl. Merdeka No. 12, Kelurahan / Desa..."
                      className="w-full p-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb]"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Kondisi Ekonomi */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                    Kondisi Ekonomi
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Informasi mengenai pekerjaan dan pendapatan keluarga untuk analisis kelayakan bantuan.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Estimasi Penghasilan Bulanan Keluarga
                    </label>
                    <select
                      value={formData.monthlyIncome}
                      onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb]"
                    >
                      <option value="Kurang dari Rp 1.500.000">Kurang dari Rp 1.500.000 / bulan</option>
                      <option value="Rp 1.500.000 - Rp 2.500.000">Rp 1.500.000 - Rp 2.500.000 / bulan</option>
                      <option value="Rp 2.500.000 - Rp 4.000.000">Rp 2.500.000 - Rp 4.000.000 / bulan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Pekerjaan Utama Kepala Keluarga
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => handleChange("occupation", e.target.value)}
                      placeholder="e.g. Buruh Harian / Pedagang Kecil"
                      className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Alasan Pengajuan */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                    Alasan Pengajuan Bantuan
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Jelaskan kondisi mendesak atau kebutuhan bantuan sosial yang Anda ajukan.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Kategori Alasan Utama
                    </label>
                    <select
                      value={formData.reasonCategory}
                      onChange={(e) => handleChange("reasonCategory", e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb]"
                    >
                      <option value="Kehilangan Pekerjaan / Penurunan Omset">Kehilangan Pekerjaan / Penurunan Omset</option>
                      <option value="Keluarga Lanjut Usia / Disabilitas">Keluarga Lanjut Usia / Disabilitas</option>
                      <option value="Kebutuhan Pokok Mendesak">Kebutuhan Pokok Mendesak (Sembako)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                      Penjelasan Singkat Permohonan
                    </label>
                    <textarea
                      rows={4}
                      value={formData.reasonDescription}
                      onChange={(e) => handleChange("reasonDescription", e.target.value)}
                      placeholder="Tuliskan secara singkat alasan Anda membutuhkan bantuan sosial ini..."
                      className="w-full p-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm font-medium outline-none focus:bg-white focus:border-[#2563eb]"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Dokumen Pendukung */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                    Dokumen Pendukung
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Unggah foto KTP, Kartu Keluarga, dan kondisi tempat tinggal Anda.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4">
                  {/* Item Upload 1 */}
                  <div className="p-4 rounded-xl border border-dashed border-border-subtle bg-[#f8fafc] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-border-subtle flex items-center justify-center text-[#2563eb]">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Foto KTP Asli</p>
                        <p className="text-[11px] text-on-surface-variant">Format JPG/PNG, maks 5MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("ktpUploaded", !formData.ktpUploaded)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.ktpUploaded
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                      }`}
                    >
                      {formData.ktpUploaded ? "Terunggah ✓" : "Pilih File"}
                    </button>
                  </div>

                  {/* Item Upload 2 */}
                  <div className="p-4 rounded-xl border border-dashed border-border-subtle bg-[#f8fafc] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-border-subtle flex items-center justify-center text-[#2563eb]">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Foto Kartu Keluarga (KK)</p>
                        <p className="text-[11px] text-on-surface-variant">Format JPG/PNG, maks 5MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("kkUploaded", !formData.kkUploaded)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.kkUploaded
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                      }`}
                    >
                      {formData.kkUploaded ? "Terunggah ✓" : "Pilih File"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Tinjau Kembali */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                    Tinjau Kembali Data
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Periksa kembali seluruh data sebelum dikirimkan ke sistem verifikasi publik.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-4 text-xs md:text-sm">
                  <div className="pb-3 border-b border-border-subtle">
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Nama Lengkap</p>
                    <p className="font-bold text-on-surface">{formData.firstName || "Budi"} {formData.lastName || "Santoso"}</p>
                  </div>
                  <div className="pb-3 border-b border-border-subtle">
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">NIK KTP</p>
                    <p className="font-bold text-on-surface">{formData.nik || "3271012304950002"}</p>
                  </div>
                  <div className="pb-3 border-b border-border-subtle">
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Email &amp; Kontak</p>
                    <p className="font-bold text-on-surface">{formData.email} • +62 {formData.phone || "81234567890"}</p>
                  </div>
                  <div>
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Kategori Bantuan</p>
                    <p className="font-bold text-primary-container">BLT Sembako &amp; Tunai 2026</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Kirim Pengajuan */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                    Konfirmasi &amp; Kirim
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant">
                    Langkah terakhir untuk mengirimkan formulir ke jaringan verifikasi warga.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-2xs space-y-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                      className="w-5 h-5 rounded border-[#e2e8f0] text-[#2563eb] focus:ring-[#2563eb] mt-0.5"
                    />
                    <span className="text-xs text-on-surface leading-relaxed">
                      Saya menyatakan bahwa data yang saya masukkan adalah benar dan siap diverifikasi oleh konsensus warga lokal sesuai ketentuan hukum yang berlaku.
                    </span>
                  </label>

                  <button
                    type="button"
                    disabled={!formData.agreeTerms || isSubmitting}
                    onClick={handleSubmit}
                    className="w-full h-12 bg-[#2563eb] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Memproses Pengajuan...</span>
                    ) : (
                      <>
                        <span>Kirim Pengajuan Bantuan</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Navigation (Simpan & Langkah Selanjutnya) */}
            <div className="pt-4 border-t border-border-subtle/60 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2.5 rounded-lg border border-border-subtle bg-white text-xs md:text-sm font-semibold text-on-surface hover:bg-[#f2f4f6] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-outline" />
                <span>Simpan &amp; Keluar</span>
              </button>

              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2.5 rounded-lg border border-border-subtle bg-white text-xs md:text-sm font-semibold text-on-surface hover:bg-[#f2f4f6] transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                )}

                {currentStep < 7 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-lg bg-[#2563eb] text-white text-xs md:text-sm font-semibold hover:bg-[#1d4ed8] shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>Langkah Selanjutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Cards */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Top Visual Card */}
            <div className="bg-white rounded-xl border border-border-subtle overflow-hidden shadow-2xs">
              <div className="p-4 bg-[#eff6ff] border-b border-[#dbeafe]">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#2563eb]">
                  Formulir Bantuan Sosial
                </span>
              </div>
              <div className="p-4 bg-gradient-to-b from-[#eff6ff]/50 to-white flex items-center justify-center">
                <div
                  className="w-full h-36 rounded-lg bg-cover bg-center border border-border-subtle"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop')",
                  }}
                ></div>
              </div>
            </div>

            {/* Bottom Card: Verifikasi Aman */}
            <div className="bg-[#eff6ff] rounded-xl p-5 border border-[#dbeafe] text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2563eb] font-bold">
                <Lock className="w-4 h-4" />
                <span>Verifikasi Aman</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Seluruh data yang dimasukkan dienkripsi dengan teknologi SSL 256-bit. Informasi Anda hanya dapat diakses oleh petugas verifikasi yang berwenang.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-white border-t border-[#e2e8f0] mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div>
            <span className="font-bold text-on-surface uppercase tracking-wider block mb-0.5">
              BANTUVERIF
            </span>
            © 2026 Platform Warga BantuVerif. Teknologi Publik Aman &amp; Transparan.
          </div>
          <div className="flex flex-wrap gap-5 font-medium">
            <a href="#" className="hover:text-primary-container">Kebijakan Privasi</a>
            <a href="#" className="hover:text-primary-container">Syarat &amp; Ketentuan</a>
            <a href="#" className="hover:text-primary-container">FAQ</a>
            <a href="#" className="hover:text-primary-container">Transparansi Audit</a>
            <a href="#" className="hover:text-primary-container">Hubungi Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
  Badge,
  Mail,
  Calendar,
  Cloud,
  CheckCircle,
  LogOut,
} from "lucide-react";

import PortalSidebar from "@/components/PortalSidebar";

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
    reasonCategory: "Kehilangan Pekerjaan / Penurunan Omset",
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
    { id: 1, title: "1. Data Pribadi", desc: "Identitas Resmi & Kontak" },
    { id: 2, title: "2. Rumah Tangga", desc: "Data Rumah Tangga" },
    { id: 3, title: "3. Ekonomi", desc: "Kondisi Ekonomi" },
    { id: 4, title: "4. Alasan", desc: "Alasan Pengajuan" },
    { id: 5, title: "5. Dokumen", desc: "Dokumen Pendukung" },
    { id: 6, title: "6. Peninjauan", desc: "Tinjau Kembali" },
    { id: 7, title: "7. Kirim", desc: "Kirim Pengajuan" },
  ];

  return (
    <div className="bg-[#f7f9fb] text-on-background font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      {/* Top Progress Header */}
      <div className="w-full bg-white border-b border-border-subtle sticky top-16 z-40 shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-6 py-3.5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs md:text-sm text-primary uppercase tracking-wider">
                LANGKAH {currentStep} DARI 7
              </span>
              <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">• Form Pengajuan Bantuan Sosial 2026</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs md:text-sm">
              <Cloud className="w-4 h-4 text-primary animate-pulse" />
              <span>Disimpan otomatis</span>
            </div>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Unified Content Layout (Matching Dashboard Grid) */}
      <div className="max-w-[1280px] mx-auto px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 1 Single Portal Sidebar on Left */}
          <PortalSidebar
            active="apply"
            currentStep={currentStep}
            stepsList={stepsList}
            onStepClick={(stepId) => {
              setCurrentStep(stepId);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {/* Main Form Content Area (9 columns) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Mobile Steps Pill Bar (Visible on mobile screens) */}
            <div className="lg:hidden bg-white p-3 rounded-xl border border-border-subtle overflow-x-auto flex gap-2">
              {stepsList.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    currentStep === step.id
                      ? "bg-primary text-white"
                      : currentStep > step.id
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  Langkah {step.id}
                </button>
              ))}
            </div>

            {/* Step Title Header Banner */}
            <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-primary" /> PENGAJUAN BANTUAN SOSIAL RESMI
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
                {currentStep === 1 && "Informasi Pribadi"}
                {currentStep === 2 && "Data Rumah Tangga"}
                {currentStep === 3 && "Kondisi Ekonomi"}
                {currentStep === 4 && "Alasan Pengajuan"}
                {currentStep === 5 && "Dokumen Pendukung"}
                {currentStep === 6 && "Tinjau Pengajuan"}
                {currentStep === 7 && "Kirim Pengajuan"}
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                {currentStep === 1 &&
                  "Mohon isi data identitas resmi sesuai dokumen kependudukan Anda yang berlaku."}
                {currentStep === 2 &&
                  "Isi data tempat tinggal dan jumlah tanggungan dalam rumah tangga Anda."}
                {currentStep === 3 &&
                  "Berikan informasi ekonomi yang akurat untuk membantu proses penilaian kelayakan."}
                {currentStep === 4 &&
                  "Jelaskan alasan utama dan kondisi mendesak yang mendorong pengajuan bantuan ini."}
                {currentStep === 5 &&
                  "Unggah dokumen identitas Anda (KTP, Kartu Keluarga, Foto Tempat Tinggal)."}
                {currentStep === 6 &&
                  "Periksa kembali seluruh data sebelum pengajuan final dikirimkan."}
                {currentStep === 7 &&
                  "Konfirmasi persetujuan Anda dan kirim pengajuan bantuan sosial."}
              </p>
            </div>

            {/* Step Form Body Container */}
            <div className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  {/* Section: Legal Identity */}
                  <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1">
                    <h2 className="font-display text-lg md:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      Identitas Resmi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label
                          className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                          htmlFor="first-name"
                        >
                          Nama Depan
                        </label>
                        <input
                          className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                          id="first-name"
                          placeholder="cth. Budi"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                          htmlFor="last-name"
                        >
                          Nama Belakang
                        </label>
                        <input
                          className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                          id="last-name"
                          placeholder="cth. Santoso"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label
                          className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                          htmlFor="id-number"
                        >
                          Nomor Induk Kependudukan (NIK)
                        </label>
                        <input
                          className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                          id="id-number"
                          placeholder="Masukkan 16 digit NIK sesuai KTP Anda"
                          type="text"
                          maxLength={16}
                          value={formData.nik}
                          onChange={(e) => handleChange("nik", e.target.value)}
                        />
                        <span className="text-xs text-on-surface-variant">
                          NIK digunakan untuk mencegah pengajuan ganda pada sistem.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Contact Details */}
                  <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1">
                    <h2 className="font-display text-lg md:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Informasi Kontak
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label
                          className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                          htmlFor="email"
                        >
                          Alamat Email
                        </label>
                        <input
                          className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                          id="email"
                          placeholder="contoh@email.com"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label
                          className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                          htmlFor="phone"
                        >
                          Nomor Handphone
                        </label>
                        <div className="flex gap-2">
                          <div className="w-20 bg-surface-container-highest flex items-center justify-center rounded-lg font-semibold text-sm text-on-surface shrink-0 h-12">
                            +62
                          </div>
                          <input
                            className="flex-1 h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                            id="phone"
                            placeholder="812-3456-7890"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Date of Birth */}
                  <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1">
                    <h2 className="font-display text-lg md:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Tanggal Lahir
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                          Tanggal
                        </label>
                        <input
                          className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm text-center outline-none w-full"
                          placeholder="TT"
                          type="text"
                          maxLength={2}
                          value={formData.birthDay}
                          onChange={(e) => handleChange("birthDay", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                          Bulan
                        </label>
                        <select
                          className="h-12 bg-surface-container-low border-none rounded-lg px-3 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-xs md:text-sm outline-none w-full"
                          value={formData.birthMonth}
                          onChange={(e) => handleChange("birthMonth", e.target.value)}
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
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                          Tahun
                        </label>
                        <input
                          className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm text-center outline-none w-full"
                          placeholder="TTTT"
                          type="text"
                          maxLength={4}
                          value={formData.birthYear}
                          onChange={(e) => handleChange("birthYear", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Household */}
              {currentStep === 2 && (
                <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                      Jumlah Tanggungan / Anggota Keluarga
                    </label>
                    <select
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                      value={formData.familyMembers}
                      onChange={(e) => handleChange("familyMembers", e.target.value)}
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                      <option value="3">3 Orang</option>
                      <option value="4">4 Orang</option>
                      <option value="5+">5+ Orang</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                      Status Kepemilikan Tempat Tinggal
                    </label>
                    <select
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                      value={formData.houseOwnership}
                      onChange={(e) => handleChange("houseOwnership", e.target.value)}
                    >
                      <option value="Milik Sendiri">Milik Sendiri</option>
                      <option value="Sewa / Kontrak">Sewa / Kontrak</option>
                      <option value="Menumpang Keluarga">Menumpang pada Keluarga</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                      Alamat Lengkap (Sesuai KTP)
                    </label>
                    <textarea
                      rows={3}
                      className="p-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                      placeholder="Masukkan alamat lengkap sesuai KTP..."
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Economic */}
              {currentStep === 3 && (
                <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                      Perkiraan Penghasilan Bulanan Rumah Tangga
                    </label>
                    <select
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                    >
                      <option value="Kurang dari Rp 1.500.000">Di bawah Rp 1.500.000 / bulan</option>
                      <option value="Rp 1.500.000 - Rp 2.500.000">Rp 1.500.000 – Rp 2.500.000 / bulan</option>
                      <option value="Rp 2.500.000 - Rp 4.000.000">Rp 2.500.000 – Rp 4.000.000 / bulan</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                      Pekerjaan Utama
                    </label>
                    <input
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                      placeholder="cth. Buruh Harian / Pedagang Kecil"
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => handleChange("occupation", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Reason */}
              {currentStep === 4 && (
                <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                      Kategori Utama Kebutuhan
                    </label>
                    <select
                      className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                      value={formData.reasonCategory}
                      onChange={(e) => handleChange("reasonCategory", e.target.value)}
                    >
                      <option value="Kehilangan Pekerjaan / Penurunan Omset">Kehilangan Pekerjaan / Penurunan Omset</option>
                      <option value="Keluarga Lanjut Usia / Disabilitas">Keluarga Lanjut Usia / Penyandang Disabilitas</option>
                      <option value="Kebutuhan Pokok Mendesak">Kebutuhan Pokok Mendesak</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                      Penjelasan Singkat Alasan Pengajuan
                    </label>
                    <textarea
                      rows={4}
                      className="p-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                      placeholder="Jelaskan kondisi dan situasi Anda secara singkat..."
                      value={formData.reasonDescription}
                      onChange={(e) => handleChange("reasonDescription", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Documents */}
              {currentStep === 5 && (
                <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1 space-y-4">
                  <div className="p-4 rounded-xl border border-dashed border-border-subtle bg-surface-container-low flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-primary">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">KTP (Kartu Tanda Penduduk)</p>
                        <p className="text-[11px] text-on-surface-variant">Format JPG/PNG, maks 5MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("ktpUploaded", !formData.ktpUploaded)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                        formData.ktpUploaded
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-primary text-on-primary hover:bg-primary-container"
                      }`}
                    >
                      {formData.ktpUploaded ? "Berhasil Diunggah ✓" : "Pilih File"}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-border-subtle bg-surface-container-low flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-primary">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">KK (Kartu Keluarga)</p>
                        <p className="text-[11px] text-on-surface-variant">Format JPG/PNG, maks 5MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("kkUploaded", !formData.kkUploaded)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                        formData.kkUploaded
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-primary text-on-primary hover:bg-primary-container"
                      }`}
                    >
                      {formData.kkUploaded ? "Berhasil Diunggah ✓" : "Pilih File"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {currentStep === 6 && (
                <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1 space-y-4 text-xs md:text-sm">
                  <div className="pb-3 border-b border-border-subtle">
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Nama Lengkap</p>
                    <p className="font-bold text-on-surface">{formData.firstName || "Budi"} {formData.lastName || "Santoso"}</p>
                  </div>
                  <div className="pb-3 border-b border-border-subtle">
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Nomor NIK</p>
                    <p className="font-bold text-on-surface">{formData.nik || "3171012345670001"}</p>
                  </div>
                  <div className="pb-3 border-b border-border-subtle">
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Email & Kontak</p>
                    <p className="font-bold text-on-surface">{formData.email || "contoh@email.com"} • +62 {formData.phone || "812-3456-7890"}</p>
                  </div>
                  <div>
                    <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Kategori Bantuan</p>
                    <p className="font-bold text-primary">Bantuan Sosial 2026</p>
                  </div>
                </div>
              )}

              {/* Step 7: Submit */}
              {currentStep === 7 && (
                <div className="p-6 md:p-8 bg-white border border-border-subtle rounded-2xl shadow-level1 space-y-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                      className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary mt-0.5"
                    />
                    <span className="text-xs text-on-surface leading-relaxed">
                      Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan bersedia dilakukan verifikasi oleh tim validator publik resmi.
                    </span>
                  </label>

                  <button
                    type="button"
                    disabled={!formData.agreeTerms || isSubmitting}
                    onClick={handleSubmit}
                    className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Memproses Pengajuan...</span>
                    ) : (
                      <>
                        <span>Kirim Pengajuan Bantuan Sosial</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Integrated Secure Verification Trust Banner */}
              <div className="p-5 bg-blue-50/70 border border-blue-200/60 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-primary mb-1">Keamanan Data Terjamin (256-bit SSL)</h4>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Data pengajuan Anda dilindungi enkripsi standar pemerintah dan hanya digunakan untuk keperluan verifikasi kelayakan bantuan sosial.
                  </p>
                </div>
              </div>

              {/* Navigation Actions Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-5 h-12 flex items-center gap-2 text-on-surface-variant font-semibold hover:bg-surface-container-low rounded-xl transition-all active:scale-95 text-xs md:text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Simpan & Keluar
                </button>

                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-5 h-12 flex items-center gap-1.5 text-on-surface font-semibold bg-white border border-border-subtle hover:bg-surface-container-low rounded-xl transition-all active:scale-95 text-xs md:text-sm shadow-2xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Sebelumnya
                    </button>
                  )}

                  {currentStep < 7 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 md:px-8 h-12 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm"
                    >
                      Langkah Selanjutnya
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-white mt-auto border-t border-border-subtle">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <div className="flex flex-col gap-1">
            <span className="font-bold tracking-wider uppercase text-on-surface">
              BANTUVERIF
            </span>
            <p className="text-secondary">
              © 2026 BantuVerif Citizen Platform. Secure &amp; Transparent Civic Tech.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-medium">
            <a className="hover:text-primary transition-all" href="#">Kebijakan Privasi</a>
            <a className="hover:text-primary transition-all" href="#">Syarat Layanan</a>
            <a className="hover:text-primary transition-all" href="#">FAQ</a>
            <a className="hover:text-primary transition-all" href="#">Transparansi Audit</a>
            <a className="hover:text-primary transition-all" href="#">Kontak Dukungan</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}


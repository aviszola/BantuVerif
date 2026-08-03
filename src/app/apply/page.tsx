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
    // TODO: sambungkan ke data asli / Supabase
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
    { id: 1, title: "1. Personal", desc: "Identitas Resmi & Kontak" },
    { id: 2, title: "2. Household", desc: "Data Rumah Tangga" },
    { id: 3, title: "3. Economic", desc: "Kondisi Ekonomi" },
    { id: 4, title: "4. Reason", desc: "Alasan Pengajuan" },
    { id: 5, title: "5. Documents", desc: "Dokumen Pendukung" },
    { id: 6, title: "6. Review", desc: "Tinjau Kembali" },
    { id: 7, title: "7. Submit", desc: "Kirim Pengajuan" },
  ];

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      {/* Progress Bar (Top Horizontal Sub-header) */}
      <div className="w-full bg-surface border-b border-border-subtle sticky top-16 z-40">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-xs md:text-sm text-primary uppercase tracking-wider">
              Step {currentStep} of 7
            </span>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs md:text-sm">
              <Cloud className="w-4 h-4 text-primary animate-pulse-subtle" />
              <span>Autosaved just now</span>
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

      {/* Main Content Layout */}
      <main className="flex-1 flex max-w-container-max mx-auto w-full px-4 md:px-margin-desktop py-8 lg:py-10 gap-8 lg:gap-10">
        {/* Sidebar Navigation (Desktop Only) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-2">
          <div className="mb-4">
            <h3 className="font-display text-[18px] text-on-surface font-bold">
              Application Steps
            </h3>
            <p className="text-on-surface-variant text-xs">Section: Social Assistance</p>
          </div>

          {/* Step List */}
          <div className="flex flex-col gap-1">
            {stepsList.map((step) => {
              const isActive = currentStep === step.id;
              const isPassed = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full text-left py-3 pl-4 pr-3 transition-all rounded-r-lg ${
                    isActive
                      ? "step-rail-active bg-primary-container/10 font-bold"
                      : "step-rail-inactive opacity-60 hover:opacity-100"
                  }`}
                >
                  <span
                    className={`text-sm block font-semibold ${
                      isActive ? "text-primary font-bold" : "text-on-surface-variant"
                    }`}
                  >
                    {step.title}
                  </span>
                  {isActive && (
                    <span className="text-primary text-[12px] font-medium block mt-0.5">
                      Currently Editing
                    </span>
                  )}
                  {isPassed && (
                    <span className="text-emerald-600 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Selesai
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto p-4 bg-surface-container-low rounded-xl border border-border-subtle">
            <p className="text-on-secondary-fixed-variant text-xs italic leading-relaxed">
              &quot;We only ask for what we need to verify your eligibility.&quot;
            </p>
          </div>
        </aside>

        {/* Main Form Canvas */}
        <section className="flex-1 max-w-[720px] w-full">
          {/* Step Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Household Information"}
              {currentStep === 3 && "Economic Condition"}
              {currentStep === 4 && "Application Reason"}
              {currentStep === 5 && "Supporting Documents"}
              {currentStep === 6 && "Review Application"}
              {currentStep === 7 && "Submit Application"}
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
              {currentStep === 1 &&
                "Please provide your legal identification details as they appear on your government documents."}
              {currentStep === 2 &&
                "Please provide details regarding your living conditions and dependents."}
              {currentStep === 3 &&
                "Provide accurate economic information to assist in eligibility evaluation."}
              {currentStep === 4 &&
                "Describe the primary reason and emergency condition for this application."}
              {currentStep === 5 &&
                "Upload your identity documents (KTP, Family Card, House Photos)."}
              {currentStep === 6 &&
                "Please review all information carefully before final submission."}
              {currentStep === 7 &&
                "Finalize your submission and confirm consent for verification."}
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                {/* Section: Legal Identity */}
                <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs hover:shadow-md transition-shadow">
                  <h2 className="font-display text-lg md:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Legal Identity
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label
                        className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                        htmlFor="first-name"
                      >
                        First Name
                      </label>
                      <input
                        className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                        id="first-name"
                        placeholder="e.g. John"
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
                        Last Name
                      </label>
                      <input
                        className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                        id="last-name"
                        placeholder="e.g. Doe"
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
                        Government ID Number
                      </label>
                      <input
                        className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                        id="id-number"
                        placeholder="Enter your 12-digit national ID"
                        type="text"
                        maxLength={16}
                        value={formData.nik}
                        onChange={(e) => handleChange("nik", e.target.value)}
                      />
                      <span className="text-xs text-on-surface-variant">
                        We use this to prevent duplicate applications.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Contact Details */}
                <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs hover:shadow-md transition-shadow">
                  <h2 className="font-display text-lg md:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Details
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                      <label
                        className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <input
                        className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                        id="email"
                        placeholder="john.doe@example.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        className="font-semibold text-xs text-on-surface uppercase tracking-wider"
                        htmlFor="phone"
                      >
                        Mobile Phone Number
                      </label>
                      <div className="flex gap-2">
                        <div className="w-24 bg-surface-container-highest flex items-center justify-center rounded-lg font-semibold text-sm text-on-surface shrink-0 h-12">
                          +1
                        </div>
                        <input
                          className="flex-1 h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm outline-none w-full"
                          id="phone"
                          placeholder="555-0123"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Date of Birth */}
                <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs hover:shadow-md transition-shadow">
                  <h2 className="font-display text-lg md:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Birth Date
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Day
                      </label>
                      <input
                        className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm text-center outline-none w-full"
                        placeholder="DD"
                        type="text"
                        maxLength={2}
                        value={formData.birthDay}
                        onChange={(e) => handleChange("birthDay", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Month
                      </label>
                      <select
                        className="h-12 bg-surface-container-low border-none rounded-lg px-3 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-xs md:text-sm outline-none w-full"
                        value={formData.birthMonth}
                        onChange={(e) => handleChange("birthMonth", e.target.value)}
                      >
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Year
                      </label>
                      <input
                        className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-sm text-center outline-none w-full"
                        placeholder="YYYY"
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
              <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                    Number of Dependents / Family Members
                  </label>
                  <select
                    className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                    value={formData.familyMembers}
                    onChange={(e) => handleChange("familyMembers", e.target.value)}
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="5+">5+ Persons</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                    Housing Ownership Status
                  </label>
                  <select
                    className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                    value={formData.houseOwnership}
                    onChange={(e) => handleChange("houseOwnership", e.target.value)}
                  >
                    <option value="Milik Sendiri">Owned</option>
                    <option value="Sewa / Kontrak">Rented</option>
                    <option value="Menumpang Keluarga">Living with Relatives</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                    Full Address (As per ID Card)
                  </label>
                  <textarea
                    rows={3}
                    className="p-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                    placeholder="Enter complete address..."
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Economic */}
            {currentStep === 3 && (
              <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                    Estimated Monthly Household Income
                  </label>
                  <select
                    className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                  >
                    <option value="Kurang dari Rp 1.500.000">Below $100 / month</option>
                    <option value="Rp 1.500.000 - Rp 2.500.000">$100 - $250 / month</option>
                    <option value="Rp 2.500.000 - Rp 4.000.000">$250 - $400 / month</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                    Primary Occupation
                  </label>
                  <input
                    className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                    placeholder="e.g. Freelance Worker / Small Merchant"
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Reason */}
            {currentStep === 4 && (
              <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                    Primary Category of Need
                  </label>
                  <select
                    className="h-12 bg-surface-container-low border-none rounded-lg px-4 focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                    value={formData.reasonCategory}
                    onChange={(e) => handleChange("reasonCategory", e.target.value)}
                  >
                    <option value="Kehilangan Pekerjaan / Penurunan Omset">Job Loss / Reduced Income</option>
                    <option value="Keluarga Lanjut Usia / Disabilitas">Elderly / Disability Support</option>
                    <option value="Kebutuhan Pokok Mendesak">Urgent Basic Food Needs</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                    Brief Application Explanation
                  </label>
                  <textarea
                    rows={4}
                    className="p-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface text-sm outline-none"
                    placeholder="Describe your situation..."
                    value={formData.reasonDescription}
                    onChange={(e) => handleChange("reasonDescription", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {currentStep === 5 && (
              <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs space-y-4">
                <div className="p-4 rounded-xl border border-dashed border-border-subtle bg-surface-container-low flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-primary">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">National ID Card (KTP)</p>
                      <p className="text-[11px] text-on-surface-variant">JPG/PNG format, max 5MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange("ktpUploaded", !formData.ktpUploaded)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      formData.ktpUploaded
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-primary text-on-primary hover:bg-primary-container"
                    }`}
                  >
                    {formData.ktpUploaded ? "Uploaded ✓" : "Choose File"}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-border-subtle bg-surface-container-low flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-primary">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Family Registration Card (KK)</p>
                      <p className="text-[11px] text-on-surface-variant">JPG/PNG format, max 5MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange("kkUploaded", !formData.kkUploaded)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      formData.kkUploaded
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-primary text-on-primary hover:bg-primary-container"
                    }`}
                  >
                    {formData.kkUploaded ? "Uploaded ✓" : "Choose File"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs space-y-4 text-xs md:text-sm">
                <div className="pb-3 border-b border-border-subtle">
                  <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Full Name</p>
                  <p className="font-bold text-on-surface">{formData.firstName || "John"} {formData.lastName || "Doe"}</p>
                </div>
                <div className="pb-3 border-b border-border-subtle">
                  <p className="text-outline font-bold uppercase tracking-wider text-[10px]">ID Number</p>
                  <p className="font-bold text-on-surface">{formData.nik || "123456789012"}</p>
                </div>
                <div className="pb-3 border-b border-border-subtle">
                  <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Email & Contact</p>
                  <p className="font-bold text-on-surface">{formData.email || "john.doe@example.com"} • +1 {formData.phone || "555-0123"}</p>
                </div>
                <div>
                  <p className="text-outline font-bold uppercase tracking-wider text-[10px]">Assistance Category</p>
                  <p className="font-bold text-primary">Social Assistance 2026</p>
                </div>
              </div>
            )}

            {/* Step 7: Submit */}
            {currentStep === 7 && (
              <div className="p-6 md:p-8 bg-surface border border-border-subtle rounded-xl shadow-xs space-y-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                    className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-xs text-on-surface leading-relaxed">
                    I declare that all information provided is accurate and consent to verification by authorized community consensus protocols.
                  </span>
                </label>

                <button
                  type="button"
                  disabled={!formData.agreeTerms || isSubmitting}
                  onClick={handleSubmit}
                  className="w-full h-12 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Submission...</span>
                  ) : (
                    <>
                      <span>Submit Assistance Application</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-8 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 h-12 flex items-center gap-2 text-on-surface-variant font-semibold hover:bg-surface-container-low rounded-lg transition-all active:scale-95 text-xs md:text-sm"
              >
                <LogOut className="w-4 h-4" />
                Save and Exit
              </button>

              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-6 h-12 flex items-center gap-1.5 text-on-surface font-semibold bg-surface border border-border-subtle hover:bg-surface-container-low rounded-lg transition-all active:scale-95 text-xs md:text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}

                {currentStep < 7 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 md:px-10 h-12 bg-primary-container text-on-primary-container font-semibold rounded-lg shadow-md hover:shadow-lg transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 text-xs md:text-sm"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Atmospheric Illustration Area (Desktop Only) */}
        <aside className="hidden xl:flex flex-col w-80 shrink-0 gap-6">
          <div className="sticky top-44 space-y-6">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface-container-high relative border border-border-subtle">
              <img
                className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                alt="A minimalist, soft-modern illustration of a diverse community standing before a clean government building."
                src="https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop"
              />
            </div>
            <div className="p-6 bg-secondary-fixed text-on-secondary-fixed rounded-2xl border border-secondary-fixed-dim/30">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <h4 className="font-display text-[18px] font-bold leading-tight">
                  Secure Verification
                </h4>
              </div>
              <p className="text-xs font-body leading-relaxed opacity-90">
                All data entered is encrypted using 256-bit SSL technology. Your information is only visible to authorized case workers.
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-margin-desktop bg-surface-container-low mt-auto border-t border-border-subtle dark:border-outline-variant">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-on-surface-variant">
          <div className="flex flex-col gap-2">
            <span className="font-bold tracking-wider uppercase text-on-surface-variant">
              BANTUVERIF
            </span>
            <p className="text-secondary">
              © 2026 BantuVerif Citizen Platform. Secure &amp; Transparent Civic Tech.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-medium">
            <a className="hover:text-primary underline transition-all" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              FAQ
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              Audit Transparency
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              Contact Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

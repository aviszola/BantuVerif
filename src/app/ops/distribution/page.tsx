"use client";

import React, { useEffect, useRef } from "react";
import {
  CheckCircle2,
  Clock,
  QrCode,
  Printer,
  Share2,
  Truck,
} from "lucide-react";
import OpsSidebar from "@/components/OpsSidebar";

const disbursements = [
  {
    id: "#AID-99230",
    category: "Food & Hygiene",
    status: "IN TRANSIT",
    statusBg: "bg-primary/10 text-primary",
    arrival: "14:30 PM",
    disabled: false,
  },
  {
    id: "#AID-99231",
    category: "Medical Kit",
    status: "READY",
    statusBg: "bg-success/10 text-success",
    arrival: "14:45 PM",
    disabled: false,
  },
  {
    id: "#AID-99235",
    category: "Winter Clothing",
    status: "STAGED",
    statusBg: "bg-warning/10 text-warning",
    arrival: "15:10 PM",
    disabled: true,
  },
];

const schedule = [
  {
    time: "09:00 AM",
    title: "Main Supply Drop",
    meta: "Cargo Port A12 - Completed",
    dot: "bg-primary",
    active: true,
  },
  {
    time: "12:30 PM",
    title: "Lunch Distribution",
    meta: "Mobile Unit 4 - In Progress",
    dot: "bg-primary",
    active: true,
  },
  {
    time: "15:00 PM",
    title: "Medical Resupply",
    meta: "Central Clinic - Upcoming",
    dot: "bg-outline",
    active: false,
  },
];

export default function DistributionLogisticsPage() {
  const signatureRef = useRef<HTMLCanvasElement>(null);

  // Signature pad — replicasi script HTML asli
  useEffect(() => {
    const canvas = signatureRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawing = false;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const getPos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDraw = () => {
      drawing = true;
    };
    const stopDraw = () => {
      drawing = false;
      ctx.beginPath();
    };
    const draw = (e: MouseEvent) => {
      if (!drawing) return;
      const { x, y } = getPos(e);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#004ac6";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    canvas.addEventListener("mousedown", startDraw);
    window.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mousemove", draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", startDraw);
      window.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-white custom-scrollbar">
      <OpsSidebar active="distribution" />

      {/* Main Content Canvas */}
      <main className="md:ml-64 md:pt-16 min-h-screen">
        <div className="p-4 md:p-gutter max-w-container-max mx-auto">
          {/* Dashboard Header & Stats */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
                Logistics Overview
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface">
                Distribution Center
              </h2>
            </div>
            {/* TODO: sambungkan ke data asli — statistik harian */}
            <div className="grid grid-cols-2 lg:flex gap-4">
              <div className="bg-white/80 backdrop-blur border border-border-subtle p-4 rounded-xl flex items-center gap-4 min-w-[200px] shadow-level2">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                    Delivered Today
                  </p>
                  <p className="text-2xl font-bold">1,284</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur border border-border-subtle p-4 rounded-xl flex items-center gap-4 min-w-[200px] shadow-level2">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                    Pending Logistics
                  </p>
                  <p className="text-2xl font-bold">452</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Upcoming Disbursements */}
            <section className="col-span-12 lg:col-span-8 bg-surface rounded-xl border border-border-subtle overflow-hidden shadow-level1">
              <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold text-on-surface">
                    Upcoming Disbursements
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Current active window: Sector 7G - Water &amp; Sanitation
                  </p>
                </div>
                <button
                  type="button"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {["Recipient ID", "Category", "Status", "Arrival Est.", "Action"].map(
                        (h) => (
                          <th
                            key={h}
                            className={`px-6 py-4 text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase ${
                              h === "Action" ? "text-right" : ""
                            }`}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {disbursements.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-surface-container-lowest transition-colors"
                      >
                        {/* TODO: sambungkan ke data asli — daftar penerima */}
                        <td className="px-6 py-4 text-sm font-semibold">
                          {row.id}
                        </td>
                        <td className="px-6 py-4 text-sm">{row.category}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${row.statusBg}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{row.arrival}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            disabled={row.disabled}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                              row.disabled
                                ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                                : "bg-primary-container text-white hover:bg-primary"
                            }`}
                          >
                            {row.disabled ? "Wait" : "Verify ID"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Distribution Schedule */}
            <section className="col-span-12 lg:col-span-4 bg-surface rounded-xl border border-border-subtle shadow-level1 flex flex-col">
              <div className="p-6 border-b border-border-subtle">
                <h3 className="font-display text-xl font-bold text-on-surface mb-4">
                  Daily Schedule
                </h3>
                {/* TODO: sambungkan ke data asli — toggle jadwal */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 bg-surface-container-low text-on-surface-variant rounded-lg text-sm font-semibold"
                  >
                    Week
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto max-h-[400px] custom-scrollbar">
                {schedule.map((item) => (
                  <div key={item.time} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${item.dot}`}
                      ></div>
                      <div className="w-px h-full bg-border-subtle my-1"></div>
                    </div>
                    <div className="pb-4">
                      <p
                        className={`text-sm font-semibold ${
                          item.active ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {item.time}
                      </p>
                      <p className="text-base font-bold">{item.title}</p>
                      <p className="text-sm text-on-surface-variant">
                        {item.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Confirm Delivery Workflow */}
            <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Form */}
              <div className="bg-surface rounded-xl border border-border-subtle p-6 shadow-level1">
                <h3 className="font-display text-xl font-bold text-on-surface mb-6">
                  Confirm Delivery
                </h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {/* TODO: sambungkan ke data asli — scan & cek recipient */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Recipient ID Scan / Entry
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter ID..."
                        className="flex-1 h-12 bg-surface-container-low border border-border-subtle rounded-lg focus:ring-primary focus:border-primary placeholder:text-on-surface-variant"
                      />
                      <button
                        type="button"
                        className="h-12 w-12 flex items-center justify-center bg-primary-container text-white rounded-lg"
                        aria-label="Scan QR"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Delivery Category
                    </label>
                    <select className="w-full h-12 bg-surface-container-low border border-border-subtle rounded-lg focus:ring-primary focus:border-primary">
                      <option>Select Item Category</option>
                      <option>Essential Food Packet</option>
                      <option>Hygiene Kit (Standard)</option>
                      <option>Infant Support Pack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Recipient Signature (Digital Pad)
                    </label>
                    <div className="w-full h-32 bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center relative group">
                      <span className="text-on-surface-variant text-sm font-semibold group-hover:hidden">
                        Signature required
                      </span>
                      <canvas
                        ref={signatureRef}
                        className="absolute inset-0 w-full h-full cursor-crosshair"
                      ></canvas>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-primary text-white rounded-lg text-sm font-semibold mt-4 transition-transform active:scale-[0.99] shadow-lg shadow-primary/20"
                  >
                    Confirm &amp; Issue Receipt
                  </button>
                </form>
              </div>

              {/* Receipt Preview */}
              <div className="bg-surface rounded-xl border border-border-subtle p-6 shadow-level1 flex flex-col justify-between overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                  <Truck className="w-32 h-32 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                    Receipt Preview
                  </h3>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                    Real-time digital confirmation generated for verified
                    delivery.
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-6 border border-dashed border-outline-variant relative">
                  {/* TODO: sambungkan ke data asli — isi receipt */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="font-extrabold text-on-surface">
                        BantuVerif
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        ID: TX-99230-001
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">Oct 24, 2023</p>
                      <p className="text-[10px] text-on-surface-variant">
                        14:32 Local Time
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Recipient</span>
                      <span className="text-sm font-semibold">
                        J. Doe (#AID-99230)
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Items</span>
                      <span className="text-sm font-semibold">
                        1x Essential Food, 1x Hygiene
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Point</span>
                      <span className="text-sm font-semibold">
                        Sector 7G Station
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-outline-variant pt-4 flex flex-col items-center">
                    <img
                      className="w-24 h-24 mb-2"
                      alt="QR code digital receipt BantuVerif"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjXILTb-1ec6T7aDoD4Hvp3RMhX6qdOwlOuP93MknzmYI8IXm9-VVAYoE0Gjg9K-2651cEz7Xb7t7rrSgrEXboakk2oLHOezvRCC6KMZtZjJboq4g1r8DBusI_sXM0a0HSh4FY5jOqhjtsKpTOmQ1qaBR93vYxkzvSgYeRZY14hqEbGniy0QhHxPW9imwMeV4YbJIyS8BWm6WZqZRlcMWHWHpLOlZgPVaIf6BOf-dLYc49IXr-g78a5w"
                    />
                    <p className="text-[10px] text-on-surface-variant">
                      Scan to verify authenticity
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 border border-border-subtle rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 border border-border-subtle rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </section>

            {/* Logistics Map View */}
            <section className="col-span-12 bg-surface rounded-xl border border-border-subtle overflow-hidden shadow-level1 h-[400px] relative">
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-4 rounded-lg border border-border-subtle max-w-xs shadow-level2">
                <h4 className="text-sm font-semibold mb-2">
                  Live Unit Tracking
                </h4>
                {/* TODO: sambungkan ke data asli — posisi unit realtime */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <p className="text-xs font-semibold">
                      Truck #001{" "}
                      <span className="text-on-surface-variant font-normal">
                        - Delivering Sector 4
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-xs font-semibold">
                      Unit #009{" "}
                      <span className="text-on-surface-variant font-normal">
                        - Staging Sector 7
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Map Placeholder */}
              <div
                className="w-full h-full bg-cover bg-center grayscale contrast-125"
                role="img"
                aria-label="Peta digital urban dengan titik lokasi unit distribusi"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZtG9Oj8wixIQJwHS1j2Vv8W92JJfeErPIzVxE3Y4bTKtgv_NAIhpXnzvEIBaHcfdNFfv9gRTksF4t3sujcKMtmQy41UL1Fk0I_7HKloeXtxzGvLq0tKKeVIqgivDQzekoOLjgU-K7ibNyTDtm1uxrVF2GsqzA1JL2c2DlpHnESIwvG4mb1wMtrhGbbKurynYqSOtv9OUuvJG1s-gqF2Jmr-9pu00u9AcwG_vg4i0el1r0ElGMrtY0qQ')",
                }}
              ></div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

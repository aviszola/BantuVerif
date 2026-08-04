import { redirect } from "next/navigation";

/**
 * /ops — redirect otomatis ke /ops/dashboard.
 *
 * Middleware sudah handle guard role (hanya verifikator/rtrw/admin).
 * File ini cukup untuk menghindari 404 jika user mengakses /ops langsung
 * tanpa sub-path (edge case: middleware redirect sudah cover ini,
 * file ini sebagai fallback rendering level Next.js).
 */
export default function OpsRootPage() {
  redirect("/ops/dashboard");
}

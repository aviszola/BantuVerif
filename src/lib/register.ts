import {
  Home,
  Users,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type RegisterRole = "warga" | "verifikator" | "rtrw";

export type RoleInfo = {
  id: RegisterRole;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  accent: string; // tailwind class prefix, e.g. "blue"
  badge?: string;
};

export const REGISTER_ROLES: RoleInfo[] = [
  {
    id: "warga",
    label: "Warga",
    shortLabel: "Warga",
    description: "Ajukan dan pantau bantuan sosial untuk keluarga Anda",
    icon: Home,
    accent: "blue",
  },
  {
    id: "verifikator",
    label: "Tetangga / Verifikator",
    shortLabel: "Tetangga",
    description: "Bantu menilai kelayakan tetangga di sekitar Anda",
    icon: Users,
    accent: "green",
  },
  {
    id: "rtrw",
    label: "RT/RW",
    shortLabel: "RT/RW",
    description: "Kelola pengajuan dan keputusan akhir di wilayah Anda",
    icon: ShieldCheck,
    accent: "amber",
    badge: "Perlu Verifikasi Admin",
  },
];

export const getRoleInfo = (role: RegisterRole): RoleInfo =>
  REGISTER_ROLES.find((r) => r.id === role) ?? REGISTER_ROLES[0];

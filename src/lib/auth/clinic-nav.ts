import {
  LayoutDashboard,
  CalendarClock,
  Users,
  Folder,
  Briefcase,
  Wallet,
  Megaphone,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

export type ClinicRole = "clinic_admin" | "doctor" | "receptionist";

export const ROLE_LABELS: Record<ClinicRole, string> = {
  clinic_admin: "مدیر کلینیک",
  doctor: "پزشک",
  receptionist: "منشی و پذیرش",
};

export interface ClinicNavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: ClinicRole[];
}

/**
 * منبع واحد حقیقت برای منوی پنل کلینیک — دقیقاً مطابق سایدباری که در طرح‌های
 * نوبت‌دهی، پروفایل مراجع، فرم‌ساز و مدیریت کاربران دیده شد.
 * هر آیتم مشخص می‌کند کدام نقش‌ها اجازه‌ی دیدنش را دارند.
 */
export const CLINIC_NAV_ITEMS: ClinicNavItem[] = [
  { href: "dashboard", label: "داشبورد", icon: LayoutDashboard, roles: ["clinic_admin", "doctor", "receptionist"] },
  { href: "calendar", label: "نوبت‌ها", icon: CalendarClock, roles: ["clinic_admin", "doctor", "receptionist"] },
  { href: "patients", label: "مراجعین", icon: Users, roles: ["clinic_admin", "doctor", "receptionist"] },
  { href: "records", label: "پرونده‌ها", icon: Folder, roles: ["clinic_admin", "doctor"] },
  { href: "services", label: "خدمات", icon: Briefcase, roles: ["clinic_admin"] },
  { href: "finance", label: "مالی", icon: Wallet, roles: ["clinic_admin"] },
  { href: "marketing", label: "بازاریابی", icon: Megaphone, roles: ["clinic_admin"] },
  { href: "sms", label: "پیامک‌ها", icon: MessageSquare, roles: ["clinic_admin"] },
  { href: "reports", label: "گزارش‌ها", icon: BarChart3, roles: ["clinic_admin"] },
  { href: "settings", label: "تنظیمات", icon: Settings, roles: ["clinic_admin"] },
];


"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Users,
  ShieldCheck,
  Stethoscope,
  UserRound,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import Image from "next/image";

type UserRole =
  | "superadmin"
  | "clinic_admin"
  | "doctor"
  | "receptionist"
  | "patient";

type UserStatus = "فعال" | "غیرفعال";

interface User {
  name: string;
  contact: string;
  role: UserRole;
  clinic: string;
  joined: string;
  lastLogin: string;
  status: UserStatus;
}

const USERS: User[] = [
  {
    name: "علی رستمی",
    contact: "0912-000-0001",
    role: "superadmin",
    clinic: "همه کلینیک‌ها",
    joined: "۱۴۰۲/۰۲/۱۰",
    lastLogin: "امروز، ۰۹:۱۰",
    status: "فعال",
  },
  {
    name: "سارا موسوی",
    contact: "0912-000-0002",
    role: "clinic_admin",
    clinic: "کلینیک زیبایی آرامش",
    joined: "۱۴۰۲/۰۳/۱۵",
    lastLogin: "امروز، ۰۸:۴۵",
    status: "فعال",
  },
  {
    name: "دکتر رضا کاویانی",
    contact: "0912-000-0003",
    role: "doctor",
    clinic: "مرکز پوست و مو رویان",
    joined: "۱۴۰۲/۰۴/۰۱",
    lastLogin: "دیروز، ۱۷:۲۰",
    status: "فعال",
  },
  {
    name: "نگار حسینی",
    contact: "0912-000-0004",
    role: "receptionist",
    clinic: "کلینیک لیزر ماهرخ",
    joined: "۱۴۰۲/۰۵/۱۲",
    lastLogin: "دیروز، ۱۲:۰۵",
    status: "غیرفعال",
  },
  {
    name: "مینا یوسفی",
    contact: "0912-000-0005",
    role: "clinic_admin",
    clinic: "مرکز جوانسازی بهار",
    joined: "۱۴۰۲/۰۵/۲۰",
    lastLogin: "۲ روز پیش",
    status: "فعال",
  },
  {
    name: "پریسا کاظمی",
    contact: "0912-000-0006",
    role: "patient",
    clinic: "کلینیک زیبایی نیکو",
    joined: "۱۴۰۲/۰۶/۰۱",
    lastLogin: "۳ روز پیش",
    status: "فعال",
  },
  {
    name: "دکتر آرش نیکنام",
    contact: "0912-000-0007",
    role: "doctor",
    clinic: "کلینیک زیبایی آرامش",
    joined: "۱۴۰۲/۰۶/۱۰",
    lastLogin: "امروز، ۱۰:۳۰",
    status: "فعال",
  },
];

const ROLE_LABEL: Record<
  UserRole,
  {
    label: string;
    tone: string;
  }
> = {
  superadmin: {
    label: "سوپرادمین",
    tone: "bg-secondary-purple/40 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300",
  },

  clinic_admin: {
    label: "مدیر کلینیک",
    tone: "bg-primary-light/20 text-primary-dark dark:bg-primary/10 dark:text-primary-light",
  },

  doctor: {
    label: "پزشک",
    tone: "bg-secondary-blue/40 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  },

  receptionist: {
    label: "منشی",
    tone: "bg-secondary-pink/40 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300",
  },

  patient: {
    label: "بیمار",
    tone: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
  },
};

const ROLE_FILTERS: {
  value: UserRole | "all";
  label: string;
}[] = [
  {
    value: "all",
    label: "همه نقش‌ها",
  },
  {
    value: "superadmin",
    label: "سوپرادمین",
  },
  {
    value: "clinic_admin",
    label: "مدیر کلینیک",
  },
  {
    value: "doctor",
    label: "پزشک",
  },
  {
    value: "receptionist",
    label: "منشی",
  },
  {
    value: "patient",
    label: "بیمار",
  },
];

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const keyword = normalizeDigits(search.trim().toLowerCase());

    return USERS.filter((user) => {
      const matchRole =
        roleFilter === "all" || user.role === roleFilter;

      const normalizedContact = normalizeDigits(user.contact);

      const matchSearch =
        keyword === "" ||
        user.name.toLowerCase().includes(keyword) ||
        normalizedContact.includes(keyword) ||
        user.clinic.toLowerCase().includes(keyword);

      return matchRole && matchSearch;
    });
  }, [roleFilter, search]);

  const stats = useMemo(
    () => ({
      total: USERS.length,

      clinicStaff: USERS.filter(
        (user) =>
          user.role === "clinic_admin" ||
          user.role === "receptionist"
      ).length,

      doctors: USERS.filter(
        (user) => user.role === "doctor"
      ).length,

      patients: USERS.filter(
        (user) => user.role === "patient"
      ).length,
    }),
    []
  );

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRoleFilter(event.target.value as UserRole | "all");
    setCurrentPage(1);
  };

  return (
    <div
      dir="rtl"
      className="space-y-6 text-gray-900 dark:text-gray-100"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
            کاربران
          </h1>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            مدیریت تمام کاربران سامانه در همه کلینیک‌ها
          </p>
        </div>

        <button
          type="button"
          className="
            flex items-center justify-center gap-2
            rounded-xl
            bg-primary
            px-5 py-2.5
            text-sm font-medium
            text-white
            transition
            hover:bg-primary-dark
            active:scale-[0.98]
            dark:shadow-glow-primary
          "
        >
          <Plus className="h-4 w-4" />
          افزودن کاربر جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          tone="text-primary-dark bg-primary-light/20 dark:bg-primary/10 dark:text-primary-light"
          label="کل کاربران"
          value={stats.total}
        />

        <StatCard
          icon={ShieldCheck}
          tone="bg-secondary-purple/40 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300"
          label="مدیران و کارکنان کلینیک"
          value={stats.clinicStaff}
        />

        <StatCard
          icon={Stethoscope}
          tone="bg-secondary-blue/40 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
          label="پزشکان و کارشناسان"
          value={stats.doctors}
        />

        <StatCard
          icon={UserRound}
          tone="bg-secondary-pink/40 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300"
          label="بیماران"
          value={stats.patients}
        />
      </div>

      {/* Users Table */}
      <div
        className="
          rounded-2xl
          border border-gray-100
          bg-white
          p-4
          shadow-sm
          dark:border-white/[0.07]
          dark:bg-white/[0.025]
          dark:shadow-none
          sm:p-5
        "
      >
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-3
              py-2.5
              transition
              focus-within:border-primary
              focus-within:ring-2
              focus-within:ring-primary/10
              dark:border-white/10
              dark:bg-white/[0.025]
              dark:focus-within:border-primary-light
              dark:focus-within:ring-primary/10
              lg:w-80
            "
          >
            <Search className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="جستجوی نام، شماره موبایل یا کلینیک..."
              className="
                w-full
                bg-transparent
                text-xs
                text-gray-700
                outline-none
                placeholder:text-gray-300
                dark:text-gray-200
                dark:placeholder:text-gray-600
              "
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={handleRoleChange}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-3
                py-2.5
                text-xs
                text-gray-600
                outline-none
                transition
                focus:border-primary
                dark:border-white/10
                dark:bg-[#151a19]
                dark:text-gray-300
                dark:focus:border-primary-light
              "
            >
              {ROLE_FILTERS.map((filter) => (
                <option
                  key={filter.value}
                  value={filter.value}
                >
                  {filter.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="
                flex
                items-center
                gap-1.5
                rounded-xl
                border
                border-gray-200
                bg-white
                px-3
                py-2.5
                text-xs
                text-gray-600
                transition
                hover:bg-gray-50
                dark:border-white/10
                dark:bg-white/[0.025]
                dark:text-gray-300
                dark:hover:bg-white/[0.05]
              "
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              فیلتر بیشتر
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 dark:border-white/[0.07] dark:text-gray-500">
                <th className="py-3 font-medium">
                  کاربر
                </th>

                <th className="py-3 font-medium">
                  نقش
                </th>

                <th className="py-3 font-medium">
                  کلینیک
                </th>

                <th className="py-3 font-medium">
                  تاریخ عضویت
                </th>

                <th className="py-3 font-medium">
                  آخرین ورود
                </th>

                <th className="py-3 font-medium">
                  وضعیت
                </th>

                <th className="py-3 font-medium">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.contact}
                  className="
                    border-b
                    border-gray-50
                    transition
                    hover:bg-gray-50/70
                    dark:border-white/[0.05]
                    dark:hover:bg-white/[0.025]
                  "
                >
                  {/* User */}
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src="/image/user.PNG"
                        alt={user.name}
                        width={34}
                        height={34}
                        unoptimized
                        className="
                          h-[34px]
                          w-[34px]
                          shrink-0
                          rounded-full
                          object-cover
                          ring-1
                          ring-gray-100
                          dark:ring-white/10
                        "
                      />

                      <div className="min-w-0">
                        <div className="truncate font-medium text-gray-800 dark:text-gray-200">
                          {user.name}
                        </div>

                        <div
                          className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500"
                          dir="ltr"
                        >
                          {user.contact}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        ${ROLE_LABEL[user.role].tone}
                      `}
                    >
                      {ROLE_LABEL[user.role].label}
                    </span>
                  </td>

                  {/* Clinic */}
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    {user.clinic}
                  </td>

                  {/* Joined */}
                  <td className="py-3 text-gray-500 dark:text-gray-400">
                    {user.joined}
                  </td>

                  {/* Last Login */}
                  <td className="py-3 text-gray-500 dark:text-gray-400">
                    {user.lastLogin}
                  </td>

                  {/* Status */}
                  <td className="py-3">
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        ${
                          user.status === "فعال"
                            ? "text-primary-dark dark:text-primary-light"
                            : "text-danger"
                        }
                      `}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3">
                    <button
                      type="button"
                      aria-label={`عملیات ${user.name}`}
                      className="
                        rounded-lg
                        border
                        border-gray-200
                        p-1.5
                        text-gray-400
                        transition
                        hover:bg-gray-50
                        hover:text-gray-600
                        dark:border-white/10
                        dark:text-gray-500
                        dark:hover:bg-white/[0.05]
                        dark:hover:text-gray-300
                      "
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                  >
                    هیچ کاربری با این مشخصات پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex flex-col-reverse items-center justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row dark:border-white/[0.07]">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            نمایش{" "}
            {filteredUsers.length.toLocaleString("fa-IR")}{" "}
            از{" "}
            {USERS.length.toLocaleString("fa-IR")}{" "}
            کاربر
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              disabled={currentPage === 1}
              className="
                rounded-lg
                border
                border-gray-200
                p-1.5
                text-gray-400
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
                dark:border-white/10
                dark:hover:bg-white/[0.05]
              "
              aria-label="صفحه قبل"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`
                  h-7
                  w-7
                  rounded-lg
                  text-xs
                  transition
                  ${
                    currentPage === page
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  }
                `}
              >
                {page.toLocaleString("fa-IR")}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(3, page + 1)
                )
              }
              disabled={currentPage === 3}
              className="
                rounded-lg
                border
                border-gray-200
                p-1.5
                text-gray-400
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
                dark:border-white/10
                dark:hover:bg-white/[0.05]
              "
              aria-label="صفحه بعد"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof Users;
  tone: string;
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-4
        transition
        hover:-translate-y-0.5
        hover:shadow-sm
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
        dark:hover:bg-white/[0.04]
        dark:hover:shadow-none
      "
    >
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          ${tone}
        `}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {value.toLocaleString("fa-IR")}
        </div>

        <div className="text-xs text-gray-400 dark:text-gray-500">
          {label}
        </div>
      </div>
    </div>
  );
}

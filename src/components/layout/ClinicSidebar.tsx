"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ChevronDown } from "lucide-react";
import { CLINIC_NAV_ITEMS, type ClinicRole, type ClinicNavItem } from "@/lib/auth/clinic-nav";
import Image from "next/image";

interface ClinicSidebarProps {
  clinicSlug: string;
  role: ClinicRole;
}

export function ClinicSidebar({ clinicSlug, role }: ClinicSidebarProps) {
  const pathname = usePathname();
  const visibleItems = CLINIC_NAV_ITEMS.filter((item) => item.roles.includes(role));

  const isItemActive = (item: ClinicNavItem) => {
    const href = `/clinic/${clinicSlug}/${item.href}`;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const [openGroup, setOpenGroup] = useState<string | null>(
    visibleItems.find((i) => i.children?.some((c) => isItemActive(c)))?.href ?? null
  );

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-100 bg-white p-5  lg:h-screen lg:w-64 lg:sticky lg:top-0 lg:border-b-0 lg:border-l">
      <div className="mb-6 flex items-center justify-center gap-2 lg:justify-strat">
        <Leaf className="h-7 w-7 text-primary" />
        <div className="text-left leading-tight">
          <div className="text-base font-bold text-gray-900">Beauty Clinic CRM</div>
          <div className="text-[11px] text-gray-400">پلتفرم مدیریت کلینیک زیبایی</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-hide">
        {visibleItems.map((item) => {
          const hasChildren = !!item.children?.length;
          const active = isItemActive(item);
          const isOpen = openGroup === item.href;

          if (!hasChildren) {
            return (
              <Link
                key={item.href}
                href={`/clinic/${clinicSlug}/${item.href}`}
                className={`flex items-center  rounded-xl px-4 py-2.5 text-sm transition-colors ${active ? "bg-primary-light/15 font-medium text-primary-dark" : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <item.icon className="h-4 w-4 ml-4" />
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.href}>
              <button
                onClick={() => setOpenGroup(isOpen ? null : item.href)}
                className={`flex w-full items-center  rounded-xl px-4 py-2.5 text-sm transition-colors ${active ? "bg-primary-light/15 font-medium text-primary-dark" : "text-gray-600 hover:bg-gray-50"
                  }`}
              >

                <item.icon className="h-4 w-4 ml-4" />

                <span className="flex items-center gap-2">
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />

                </span>
              </button>

              {isOpen && (
                <div className="mr-1 mt-1 flex flex-col gap-0.5 border-r border-gray-100 pr-3">
                  {item.children!
                    .filter((child) => child.roles.includes(role))
                    .map((child) => {
                      const childHref = `/clinic/${clinicSlug}/${child.href}`;
                      const childActive = pathname === childHref;
                      return (
                        <Link
                          key={child.href}
                          href={childHref}
                          className={`flex items-center  rounded-lg px-3 py-2 text-[13px] ${childActive ? "bg-primary-light/15 font-medium text-primary-dark" : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          <child.icon className="h-3.5 w-3.5 ml-2" />
                          {child.label}
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-6 hidden justify-center lg:flex">
            <Image
            src="/image/superadmin.png"
            alt="User"
            width={120}
            height={120}
            unoptimized
            className="rounded-full object-cover"
          />
      </div>

      <div className="mt-3 rounded-2xl bg-primary-light/15 p-4 text-center">
        <div className="text-sm font-semibold text-gray-800">نسخه حرفه‌ای</div>
        <p className="mt-1 text-xs text-gray-500">همه امکانات برای رشد کسب‌وکار شما</p>
        <button className="mt-3 w-full rounded-xl bg-primary-dark py-2.5 text-xs font-medium text-white hover:opacity-90">
          ارتقای پلن
        </button>
      </div>
    </aside>
  );
}

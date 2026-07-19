"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageSquare, ChevronDown, Leaf } from "lucide-react";
import Image from "next/image";


const NAV_ITEMS = [
    { href: "dashboard", label: "داشبورد" },
    { href: "appointments", label: "نوبت‌های من" },
    { href: "services", label: "خدمات من" },
    { href: "medical-records", label: "پرونده پزشکی من" },
    { href: "chat", label: "پیام‌ها" },
];

export function PatientHeader({ clinicSlug }: { clinicSlug: string }) {
    const pathname = usePathname();

    return (
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3 md:px-8">
            {/* لوگو - سمت راست */}
            <div className="order-1 flex items-center gap-2">
                <Leaf className="h-7 w-7 text-primary" />

                <div className="text-left leading-tight">
                    <div className="text-base font-bold text-gray-900">Beauty Clinic CRM</div>
                    <div className="text-[11px] text-gray-400">پلتفرم مدیریت کلینیک زیبایی</div>
                </div>
            </div>

            {/* منو - وسط */}
            <nav className="order-3 flex w-full items-center justify-center gap-6 overflow-x-auto text-sm md:order-2 md:w-auto">
                {NAV_ITEMS.map((item) => {
                    const href = `/patient/${clinicSlug}/${item.href}`;
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={item.href}
                            href={href}
                            className={`whitespace-nowrap pb-1 ${isActive
                                    ? "border-b-2 border-primary font-medium text-primary-dark"
                                    : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* اعلان‌ها و پروفایل - سمت چپ */}
            <div className="order-2 flex items-center gap-4 md:order-3">
                <button className="relative text-gray-500">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] text-white">
                        ۲
                    </span>
                </button>
                <button className="text-gray-500">
                    <MessageSquare className="h-5 w-5" />
                </button>
                <button className="flex items-center gap-1.5">
                    <Image
                        src="/image/user.PNG"
                        alt="User"
                        width={30}
                        height={30}
                        unoptimized
                        className="rounded-full object-cover"
                    />
                    <span className="hidden text-sm font-medium text-gray-700 sm:block">سارا محمدی</span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
            </div>
        </header>
    );
}

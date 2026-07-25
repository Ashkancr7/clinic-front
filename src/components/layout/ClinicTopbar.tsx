"use client";

import {
    Bell,
    CalendarDays,
    ChevronDown,
    Menu,
    Settings,
} from "lucide-react";
import { ReactNode } from "react";

import Image from "next/image";


interface ClinicTopbarProps {
    userName: string;
    roleLabel: string;
    notificationCount?: number;
    onToggleSidebar?: () => void;
    dateNavSlot?: ReactNode;
    showSettingsIcon?: boolean;
}

export function ClinicTopbar({
    userName,
    roleLabel,
    notificationCount = 0,
    onToggleSidebar,
    dateNavSlot,
    showSettingsIcon = true,
}: ClinicTopbarProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
            {/* سمت راست */}
            <div className="flex items-center gap-6">

                <button
                    onClick={onToggleSidebar}
                    className="text-gray-600 transition hover:text-primary"
                >
                    <Menu className="h-6 w-6" />
                </button>

            </div>


            {/* وسط */}
            <div className="flex items-center gap-4">

                 {/* باکس تاریخ */}
                <div className="flex h-10 items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    <button className="flex items-center gap-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <ChevronDown className="h-4 w-4" />
                        امروز
                    </button>

                    <div className="h-5 w-px bg-gray-200" />

                    <button className="flex items-center gap-2 px-4 text-sm text-gray-600 hover:bg-gray-50">
                        ۱۴۰۴/۰۳/۲۳
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                    </button>

                </div>

               

                {/* تنظیمات */}
                {showSettingsIcon && (
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-50 hover:text-primary">
                        <Settings className="h-5 w-5" />
                    </button>
                )}

                 {/* اعلان */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-50 hover:text-primary">
                    <Bell className="h-5 w-5" />

                    {notificationCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-medium text-white">
                            {notificationCount.toLocaleString("fa-IR")}
                        </span>
                    )}
                </button>

               

            </div>

            {/* اطلاعات کاربر */}
            <div className="flex items-center gap-3">

                <ChevronDown className="h-4 w-4 text-gray-400" />



                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-gray-800">
                        {userName}
                    </p>

                    <p className="text-xs text-gray-400">
                        {roleLabel}
                    </p>
                </div>

                <Image
                    src="/image/user.PNG"
                    alt="User"
                    width={50}
                    height={50}
                    unoptimized
                    className="rounded-full object-cover"
                />


            </div>



        </header>
    );
}
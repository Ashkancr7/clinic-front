"use client";
import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "امکانات", href: "#features" },
    { label: "قیمت‌گذاری", href: "#pricing" },
    { label: "مشتریان", href: "#customers" },
    { label: "منابع", href: "#resources" },
    { label: "درباره ما", href: "#about" },
    { label: "تماس با ما", href: "#contact" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // تنظیمات انیمیشن برای منوی موبایل
    const menuVariants = {
        hidden: { opacity: 0, height: 0, y: -20 },
        visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, height: 0, y: -20, transition: { duration: 0.2 } },
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                {/* لوگو */}
                <div className="flex items-center gap-2">
                    <Leaf className="h-7 w-7 text-primary" />
                    <div className="leading-tight">
                        <div className="text-lg font-bold text-gray-900">Beauty Clinic CRM</div>
                        <div className="text-xs text-gray-400">پلتفرم مدیریت کلینیک زیبایی</div>
                    </div>
                </div>

                {/* منوی دسکتاپ */}
                <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
                    {NAV_LINKS.map((link) => (
                        <a key={link.label} href={link.href} className="transition-colors hover:text-primary">
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* دکمه‌های اکشن (دسکتاپ) */}
                <div className="hidden items-center gap-3 lg:flex">
                    <a
                        href="/login"
                        className="text-sm font-medium px-5 py-2 text-primary  border-[1.5px] border-primary transition-all duration-200 hover:scale-105 hover:text-primary  rounded-md shadow-lg active:scale-95 "
                    >
                        ورورد به پنل
                    </a>

                     <a
                        href="https://clinic-front-hazel.vercel.app/patient/demo-clinic/dashboard"
                        className="text-sm font-medium px-5 py-2 text-primary  border-[1.5px] border-primary transition-all duration-200 hover:scale-105 hover:text-primary  rounded-md shadow-lg active:scale-95 "
                    >
                        ورورد به پنل بیمار
                    </a>
                    <a
                        href="https://clinic-front-hazel.vercel.app/super-admin/dashboard"
                        className="text-sm font-medium px-5 py-2 text-primary  border-[1.5px] border-primary transition-all duration-200 hover:scale-105 hover:text-primary  rounded-md shadow-lg active:scale-95 "
                    >
                        ورورد به پنل سوپرادمین
                    </a>

                     
                    <a
                        href="#demo"
                        className="rounded-[5px] bg-primary px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-lg active:scale-95"
                    >
                        درخواست دمو
                    </a>

                    
                </div>

                {/* دکمه همبرگری (موبایل) */}
                <button
                    className="rounded-lg p-2 text-gray-600 lg:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* منوی موبایل (با انیمیشن) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden border-b border-gray-100 bg-white lg:hidden"
                    >
                        <div className="flex flex-col gap-4 p-6">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="block text-gray-600 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <hr className="border-gray-100" />
                            <div className="flex flex-col gap-3">
                                <a href="/login" className="w-full rounded-lg border border-primary py-2 text-center text-sm font-medium text-primary">ورود به پنل</a>
                                <a href="https://clinic-front-hazel.vercel.app/patient/demo-clinic/dashboard" className="w-full rounded-lg border border-primary py-2 text-center text-sm font-medium text-primary">ورود به پنل بیمار</a>
                                <a href="https://clinic-front-hazel.vercel.app/super-admin/dashboard" className="w-full rounded-lg border border-primary py-2 text-center text-sm font-medium text-primary">ورود به پنل سوپر ادمین</a>
                                <a href="https://clinic-front-hazel.vercel.app/patient/demo-clinic/intake" className="w-full rounded-lg border border-primary py-2 text-center text-sm font-medium text-primary">ثبت نام</a>


                                

                                <a href="#demo" className="w-full rounded-lg bg-primary py-2 text-center text-sm font-medium text-white">درخواست دمو</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
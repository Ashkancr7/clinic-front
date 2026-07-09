"use client";

import { useState } from "react";
import {
  Leaf,
  Lock,
  MessageSquare,
  Crown,
  Briefcase,
  Headset,
  Stethoscope,
  UserRound,
  User,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  Database,
  Globe,
  Moon,
} from "lucide-react";

import Image from "next/image";


type RoleKey = "superadmin" | "clinic_admin" | "receptionist" | "doctor" | "patient";

const ROLES: { key: RoleKey; label: string; icon: typeof Crown; tone: string }[] = [
  { key: "patient", label: "بیمار", icon: UserRound, tone: "text-primary-dark" },
  { key: "doctor", label: "پزشک", icon: Stethoscope, tone: "text-primary-dark" },
  { key: "receptionist", label: "منشی", icon: Headset, tone: "text-pink-500" },
  { key: "clinic_admin", label: "مدیر کلینیک", icon: Briefcase, tone: "text-gray-500" },
  { key: "superadmin", label: "سوپرادمین", icon: Crown, tone: "text-purple-500" },
];

const SIDE_FEATURES = [
  {
    icon: Database,
    tone: "text-pink-500",
    title: "اطلاعات رمزنگاری‌شده",
    desc: "کلیه داده‌های شما با بالاترین سطح رمزنگاری و امنیت ذخیره می‌شوند",
  },
  {
    icon: ShieldCheck,
    tone: "text-primary-dark",
    title: "امنیت پیشرفته",
    desc: "حفاظت از اطلاعات با رمزنگاری پیشرفته و استانداردهای امنیتی",
  },
  {
    icon: Zap,
    tone: "text-purple-500",
    title: "دسترسی سریع",
    desc: "ورود آسان و سریع به تمام امکانات سیستم در هر زمان و مکان",
  },
];

const FOOTER_LINKS = [
  "قوانین و مقررات",
  "سیاست حریم خصوصی",
  "پشتیبانی",
  "تماس با ما",
];

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  const [selectedRole, setSelectedRole] = useState<RoleKey>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="grid flex-1 lg:grid-cols-2">

        <div
          className="
    flex
    min-h-[100dvh]
    flex-col
    items-center
    justify-start
    bg-white
    px-5
    pt-10
    sm:pt-14
    lg:pt-16
  "
        >

          {/* Logo */}
          <div
            className="
      mb-8
      flex
      flex-col
      items-center
      gap-2
    "
          >

            <Leaf
              className="
        h-10
        w-10
        text-primary
      "
            />

            <div className="text-center leading-tight">

              <h1
                className="
          text-xl
          font-bold
          text-gray-900
        "
              >
                Beauty Clinic CRM
              </h1>


              <p
                className="
          mt-1
          text-xs
          text-gray-400
        "
              >
                پلتفرم مدیریت کلینیک‌های زیبایی
              </p>

            </div>

          </div>



          {/* Login Card */}
          <div
            className="
      w-full
      max-w-lg
      rounded-3xl
      border
      border-gray-100
      bg-white
      p-5
      shadow-xl
      sm:p-8
    "
          >


            {/* Tabs */}
            <div
              className="
        mb-7
        flex
        border-b
        border-gray-100
        text-xs
        sm:text-sm
      "
            >

              <button
                onClick={() => setActiveTab("password")}
                className={`
          flex
          flex-1
          items-center
          justify-center
          gap-2
          pb-3
          font-medium
          transition
          ${activeTab === "password"
                    ? "border-b-2 border-primary text-primary-dark"
                    : "text-gray-400"
                  }
        `}
              >

                <Lock className="h-4 w-4" />

                ورود با رمز عبور

              </button>



              <button
                onClick={() => setActiveTab("otp")}
                className={`
          flex
          flex-1
          items-center
          justify-center
          gap-2
          pb-3
          font-medium
          transition
          ${activeTab === "otp"
                    ? "border-b-2 border-primary text-primary-dark"
                    : "text-gray-400"
                  }
        `}
              >

                <MessageSquare className="h-4 w-4" />

                ورود با کد تایید

              </button>


            </div>




            {/* Roles */}
            <div className="mb-7">


              <div
                className="
          mb-4
          text-center
          text-sm
          text-gray-500
        "
              >
                انتخاب نقش
              </div>



              <div
                className="
          grid
          grid-cols-3
          gap-2
          lg:grid-cols-5
        "
              >

                {ROLES.map((role) => {

                  const isSelected =
                    selectedRole === role.key;


                  return (

                    <button
                      key={role.key}
                      onClick={() => setSelectedRole(role.key)}
                      className={`
                flex
                min-h-20
                flex-col
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                p-2
                text-[11px]
                transition-all
                duration-200

                ${isSelected
                          ?
                          "border-primary bg-primary-light/10 text-primary-dark shadow-sm"
                          :
                          "border-gray-100 text-gray-500 hover:border-gray-200"
                        }
              `}
                    >

                      <role.icon
                        className={`
                  h-5
                  w-5

                  ${isSelected
                            ?
                            "text-primary-dark"
                            :
                            role.tone
                          }
                `}
                      />


                      {role.label}


                    </button>

                  )

                })}

              </div>



              <div
                className="
          mt-4
          flex
          justify-center
          gap-2
        "
              >

                <span
                  className="
            h-1.5
            w-5
            rounded-full
            bg-primary
          "
                />

                <span
                  className="
            h-1.5
            w-1.5
            rounded-full
            bg-gray-200
          "
                />


              </div>


            </div>




            {/* Inputs */}
            <label
              className="
        mb-2
        block
        text-sm
        text-gray-600
      "
            >
              شماره موبایل یا نام کاربری
            </label>


            <div
              className="
        mb-5
        flex
        min-h-14
        items-center
        rounded-2xl
        border
        border-gray-200
        px-4
        transition
        focus-within:border-primary
        focus-within:ring-4
        focus-within:ring-primary/10
      "
            >

              <User className="h-4 w-4 text-gray-300" />


              <input
                type="text"
                placeholder="شماره موبایل یا نام کاربری"
                className="
          w-full
          bg-transparent
          px-3
          text-sm
          outline-none
          placeholder:text-gray-300
        "
              />

            </div>





            <label
              className="
        mb-2
        block
        text-sm
        text-gray-600
      "
            >
              رمز عبور
            </label>


            <div
              className="
        mb-4
        flex
        min-h-14
        items-center
        rounded-2xl
        border
        border-gray-200
        px-4
        transition
        focus-within:border-primary
        focus-within:ring-4
        focus-within:ring-primary/10
      "
            >


              <Lock className="h-4 w-4 text-gray-300" />



              <input
                type={showPassword ? "text" : "password"}
                placeholder="رمز عبور خود را وارد کنید"
                className="
          w-full
          bg-transparent
          px-3
          text-sm
          outline-none
        "
              />



              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-gray-300"
              >

                {
                  showPassword
                    ?
                    <Eye className="h-4 w-4" />
                    :
                    <EyeOff className="h-4 w-4" />
                }

              </button>


            </div>





            <div
              className="
        mb-6
        flex
        items-center
        justify-between
        text-xs
      "
            >

              <label
                className="
          flex
          items-center
          gap-2
          text-gray-500
        "
              >

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="
            h-4
            w-4
            rounded
            border-gray-300
            text-primary
          "
                />

                مرا به خاطر بسپار

              </label>



              <a
                href="#forgot"
                className="
          text-primary-dark
          hover:underline
        "
              >
                رمز عبور را فراموش کرده‌اید؟
              </a>


            </div>





            <button
              className="
        h-12
        w-full
        rounded-2xl
        bg-primary
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-primary-dark
        hover:shadow-lg
      "
            >
              ورود به حساب کاربری
            </button>




            <div
              className="
        my-6
        flex
        items-center
        gap-3
        text-xs
        text-gray-300
      "
            >

              <div className="h-px flex-1 bg-gray-100" />

              یا

              <div className="h-px flex-1 bg-gray-100" />


            </div>




            <button
              onClick={() => setActiveTab("otp")}
              className="
        flex
        h-12
        w-full
        items-center
        justify-center
        gap-2
        rounded-2xl
        border
        border-primary
        text-sm
        font-medium
        text-primary-dark
        transition
        hover:bg-primary-light/10
      "
            >

              <MessageSquare className="h-4 w-4" />

              ورود با کد تایید پیامکی

            </button>



            <p
              className="
        mt-6
        text-center
        text-xs
        text-gray-400
      "
            >

              حساب کاربری ندارید؟

              <a
                href="#register"
                className="
          mr-1
          font-medium
          text-primary-dark
        "
              >
                ثبت‌نام کنید
              </a>


            </p>


          </div>


        </div>

        <div
  className="
    relative
    hidden
    overflow-hidden
    bg-primary-light/20
    px-12
    py-14
    lg:flex
    lg:flex-col
  "
>
          {/* <div
            className="absolute right-10 top-10 h-16 w-16 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, #9CA3AF 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          /> */}

          <h1 className="max-w-md text-3xl font-extrabold leading-tight text-gray-900">
            دسترسی امن و سریع
            <br />
            به مدیریت <span className="text-primary-dark">کلینیک</span> شما
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            با Beauty Clinic CRM، همه ابزارهای موردنیاز کلینیک‌های زیبایی در یک سیستم
            یکپارچه و هوشمند در دسترس شماست.
          </p>


          <Image
            src="/image/login.PNG"
            alt="نمای دشبورد و پنل مدیریت کلینیک"
            width={800}
            height={800}
            unoptimized
            className="w-full max-w-lg object-contain "
          />

          {/* کارت‌های ویژگی */}
          <div className="mt-14 grid grid-cols-3 gap-6 rounded-2xl bg-white p-5 shadow-lg">
            {SIDE_FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <f.icon className={`mx-auto mb-2 h-6 w-6 ${f.tone}`} />
                <div className="text-xs font-semibold text-gray-800">{f.title}</div>
                <p className="mt-1 text-[10px] leading-relaxed text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-primary-light/15 px-4 py-2 text-xs text-primary-dark">
            <Lock className="h-3.5 w-3.5" />
            اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.
          </div>
        </div>
      </div>

      {/* فوتر */}
      <footer
        className="
    border-t
    border-gray-100
    px-5
    py-6
    text-xs
    text-gray-400
    sm:px-8
    md:px-12
  "
      >
        <div
          className="
      flex
      flex-col
      items-center
      gap-5
      md:flex-row
      md:justify-between
    "
        >

          {/* لوگو و کپی رایت */}
          <div
            className="
        flex
        flex-col
        items-center
        gap-2
        sm:flex-row
        sm:gap-3
      "
          >
            <Image
              src="/image/loginflower.PNG"
              alt="Beauty Clinic CRM"
              width={80}
              height={40}
              className="w-16 sm:w-20"
            />

            <p className="text-center leading-5">
              © Beauty Clinic CRM
              <br className="sm:hidden" />
              {" "}
              ۱۴۰۳ تمام حقوق محفوظ است.
            </p>
          </div>


          {/* لینک ها */}
          <nav
            className="
        flex
        flex-wrap
        justify-center
        gap-x-5
        gap-y-3
        text-center
      "
          >
            {FOOTER_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="
            transition
            hover:text-primary-dark
          "
              >
                {link}
              </a>
            ))}
          </nav>


          {/* تنظیمات */}
          <div
            className="
        flex
        items-center
        gap-3
      "
          >

            <button
              className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-gray-200
          transition
          hover:border-primary
        "
            >
              <Moon className="h-4 w-4" />
            </button>


            <button
              className="
          flex
          h-9
          items-center
          gap-2
          rounded-full
          border
          border-gray-200
          px-4
          transition
          hover:border-primary
        "
            >
              <Globe className="h-4 w-4" />
              فارسی
            </button>

          </div>

        </div>
      </footer>
    </div>
  );
}
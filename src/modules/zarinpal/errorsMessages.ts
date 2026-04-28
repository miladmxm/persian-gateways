import type { ErrorMessage } from "./types.ts";

const errorMessagesByCodes: Record<number | string, ErrorMessage> = {
  "-9": {
    type: "public",
    code: "-9",
    en: "Validation error",
    fa: "خطای اعتبار سنجی\n1- مرچنت کد داخل تنظیمات وارد نشده باشد\n-2 آدرس بازگشت (callbackurl) وارد نشده باشد\n-3 توضیحات (description) وارد نشده باشد و یا از حد مجاز 500 کارکتر بیشتر باشد\n-4 مبلغ پرداختی کمتر یا بیشتر از حد مجاز\n-5 کد معرف (referrer_id) نامعتبر است",
  },
  "-10": {
    type: "public",
    code: "-10",
    en: "Terminal is not valid, please check merchant_id or ip address.",
    fa: "ای پی یا مرچنت كد پذیرنده صحیح نیست.",
  },
  "-11": {
    type: "public",
    code: "-11",
    en: "Terminal is not active, please contact our support team.",
    fa: "مرچنت کد فعال نیست، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.",
  },
  "-12": {
    type: "public",
    code: "-12",
    en: "To many attempts, please try again later.",
    fa: "تلاش بیش از دفعات مجاز در یک بازه زمانی کوتاه به امور مشتریان زرین پال اطلاع دهید",
  },
  "-13": {
    type: "public",
    code: "-13",
    en: "terminal limit reached.",
    fa: "خطای مربوط به محدودیت تراکنش. برای رفع این مورد نسبت به تکمیل مدارک خود با مراجعه به پشتیبانی اقدام نمایید.",
  },
  "-14": {
    type: "public",
    code: "-14",
    en: "The callback URL domain does not match the registered terminal domain.",
    fa: "کال‌بک URL با دامنه ثبت شده درگاه مغایرت دارد.",
  },
  "-15": {
    type: "public",
    code: "-15",
    en: "Terminal user is suspend : (please contact our support team).",
    fa: "درگاه پرداخت به حالت تعلیق در آمده است، پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.",
  },
  "-16": {
    type: "public",
    code: "-16",
    en: "Terminal user level is not valid : ( please contact our support team).",
    fa: "سطح تایید پذیرنده پایین تر از سطح نقره ای است.",
  },
  "-17": {
    type: "public",
    code: "-17",
    en: "Terminal user level is not valid : ( please contact our support team).",
    fa: "محدودیت پذیرنده در سطح آبی",
  },
  "-18": {
    type: "public",
    code: "-18",
    en: "The referrer address does not match the registered domain.",
    fa: "امکان استف کد درگاه اختصاصی خود بر روی سایت یا جای دیگری را ندارید",
  },
  "-19": {
    type: "public",
    code: "-19",
    en: "Terminal user transactions are banned.",
    fa: "امکان ایجاد تراکنش برای این ترمینال امکان پذیر نیست",
  },
  "100": {
    type: "public",
    code: "100",
    en: "Success",
    fa: "عملیات موفق",
  },
  "-30": {
    type: "PaymentRequest",
    code: "-30",
    en: "Terminal do not allow to accept floating wages.",
    fa: "پذیرنده اجازه دسترسی به سرویس تسویه اشتراکی شناور را ندارد.",
  },
  "-31": {
    type: "PaymentRequest",
    code: "-31",
    en: "Terminal do not allow to accept wages, please add default bank account in panel.",
    fa: "حساب بانکی تسویه را به پنل اضافه کنید. مقادیر وارد شده برای تسهیم درست نیست. پذیرنده جهت استفاده از خدمات سرویس تسویه اشتراکی شناور، باید حساب بانکی معتبری به پنل کاربری خود اضافه نماید.",
  },
  "-32": {
    type: "PaymentRequest",
    code: "-32",
    en: "Wages is not valid, Total wages(floating) has been overload max amount.",
    fa: "مبلغ وارد شده از مبلغ کل تراکنش بیشتر است.",
  },
  "-33": {
    type: "PaymentRequest",
    code: "-33",
    en: "Wages floating is not valid.",
    fa: "درصدهای وارد شده صحیح نیست.",
  },
  "-34": {
    type: "PaymentRequest",
    code: "-34",
    en: "Wages is not valid, Total wages(fixed) has been overload max amount.",
    fa: "مبلغ وارد شده از مبلغ کل تراکنش بیشتر است.",
  },
  "-35": {
    type: "PaymentRequest",
    code: "-35",
    en: "Wages is not valid, Total wages(floating) has been reached the limit in max parts.",
    fa: "تعداد افراد دریافت کننده تسهیم بیش از حد مجاز است.",
  },
  "-36": {
    type: "PaymentRequest",
    code: "-36",
    en: "The minimum amount for wages(floating) should be 10,000 Rials",
    fa: "حداقل مبلغ جهت تسهیم باید ۱۰۰۰۰ ریال باشد",
  },
  "-37": {
    type: "PaymentRequest",
    code: "-37",
    en: "One or more iban entered for wages(floating) from the bank side are inactive.",
    fa: "یک یا چند شماره شبای وارد شده برای تسهیم از سمت بانک غیر فعال است.",
  },
  "-38": {
    type: "PaymentRequest",
    code: "-38",
    en: "Wages need to set Iban in shaparak.",
    fa: "خطا٬عدم تعریف صحیح شبا٬لطفا دقایقی دیگر تلاش کنید.",
  },
  "-39": {
    type: "PaymentRequest",
    code: "-39",
    en: "Wages have a error!",
    fa: "خطایی رخ داده است به امور مشتریان زرین پال اطلاع دهید",
  },
  "-40": {
    type: "PaymentRequest",
    code: "-40",
    en: "Invalid extra params, expire_in is not valid.",
    fa: "",
  },
  "-41": {
    type: "PaymentRequest",
    code: "-41",
    en: "Maximum amount is 100,000,000 tomans.",
    fa: "حداکثر مبلغ پرداختی ۱۰۰ میلیون تومان است",
  },
  "-50": {
    type: "PaymentVerify",
    code: "-50",
    en: "Session is not valid, amounts values is not the same.",
    fa: "مبلغ پرداخت شده با مقدار مبلغ ارسالی در متد وریفای متفاوت است.",
  },
  "-51": {
    type: "PaymentVerify",
    code: "-51",
    en: "Session is not valid, session is not active paid try.",
    fa: "پرداخت ناموفق",
  },
  "-52": {
    type: "PaymentVerify",
    code: "-52",
    en: "Oops!!, please contact our support team",
    fa: "خطای غیر منتظره‌ای رخ داده است. پذیرنده مشکل خود را به امور مشتریان زرین‌پال ارجاع دهد.",
  },
  "-53": {
    type: "PaymentVerify",
    code: "-53",
    en: "Session is not this merchant_id session",
    fa: "پرداخت متعلق به این مرچنت کد نیست.",
  },
  "-54": {
    type: "PaymentVerify",
    code: "-54",
    en: "Invalid authority.",
    fa: "اتوریتی نامعتبر است.",
  },
  "-55": {
    type: "PaymentVerify",
    code: "-55",
    en: "manual payment request not found.",
    fa: "تراکنش مورد نظر یافت نشد",
  },
  "-60": {
    type: "PaymentReverse",
    code: "-60",
    en: "Session can not be reversed with bank.",
    fa: "امکان ریورس کردن تراکنش با بانک وجود ندارد",
  },
  "-61": {
    type: "PaymentReverse",
    code: "-61",
    en: "Session is not in success status.",
    fa: "تراکنش موفق نیست یا قبلا ریورس شده است",
  },
  "-62": {
    type: "PaymentReverse",
    code: "-62",
    en: "Terminal ip limit most be active.",
    fa: "آی پی درگاه ست نشده است",
  },
  "-63": {
    type: "PaymentReverse",
    code: "-63",
    en: "Maximum time for reverse this session is expired.",
    fa: "حداکثر زمان (۳۰ دقیقه) برای ریورس کردن این تراکنش منقضی شده است",
  },
  "101": {
    type: "PaymentVerify",
    code: "101",
    en: "Verified",
    fa: "تراکنش وریفای شده است.",
  },
};

export const getErrorByCode = (code: number | string) => {
  return errorMessagesByCodes[code].fa || "خطای ناشناخته";
};

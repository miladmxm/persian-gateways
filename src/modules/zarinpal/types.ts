export interface RequestForGetPaymentPage {
  merchantId: string;
  amount: number;
  callBackUrl: string;
  currency?: "IRR" | "IRT";
  referrerId?: string;
  description: string;
  metadata?: Partial<{ mobile: string; email: string; orderId: string }>;
  sandbox?: boolean;
  baseUrl?: string;
}
export interface ResponseFetchForRequestPay {
  data: {
    code: number;
    message: string;
    authority: string;
    fee_type: string;
    fee: number;
  };
  errors: {
    message: string;
    code: number;
    validations: [];
  };
}
export interface ResponseFetchForVerify {
  data: {
    code: number;
    message: string;
    card_hash: string;
    card_pan: string;
    ref_id: number;
    fee_type: string;
    fee: number;
  };
  errors: {
    message: string;
    code: number;
    validations: [];
  };
}
export interface ErrorMessage {
  type: string;
  code: string;
  en: string;
  fa: string;
}

export interface VerifyPayment {
  merchantId: string;
  amount: number;
  authority: string;
  sandbox?: boolean;
  baseUrl?: string;
}

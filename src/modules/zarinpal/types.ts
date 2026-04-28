export interface RequestForGetPaymentPage {
  merchant_id: string;
  amount: number;
  callback_url: string;
  currency?: "IRR" | "IRT";
  referrer_id?: string;
  description: string;
  metadata?: Partial<{ mobile: string; email: string; orderId: string }>;
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
  merchant_id: string;
  amount: number;
  authority: string;
}

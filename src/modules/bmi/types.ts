export interface RequestForGetPaymentPage {
  amount: number;
  callBackUrl: string;
  merchantId: string;
  orderId: string;
  secretKey: string;
  terminalId: string;
  additionalData?: string;
  baseUrl?: string;
}

export interface ResponseFetchForRequestPay {
  ResCode: number | string;
  Description: string;
  Token?: string;
}

export interface VerifyPayment {
  secretKey: string;
  token: string;
  baseUrl?: string;
}

export interface ResponseFetchForVerify {
  ResCode: number | string;
  Description: string;
  RetrivalRefNo?: string;
  SystemTraceNo?: string;
}

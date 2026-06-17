export type Result<T> = [
  { message: string; code?: number | string } | null,
  T | null,
];

export type ResultRequestInit = Result<{ html: string; url: string }>;
export type VerifyResult = Result<{ isOk: boolean }>;

export interface PaymentParams {
  amount: number;
  tracker: string;
  callBackUrl: string;
  gatewayId: string;
}

export interface Payment extends PaymentParams {
  getPayPage: () => Promise<ResultRequestInit>;
  verify: (data: {
    url: string;
    body?: Record<string, unknown>;
  }) => Promise<VerifyResult>;
}

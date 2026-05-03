import type { ResultRequestInit, VerifyResult } from "./modules/types.ts";

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

export { BpmPayment } from "./modules/bpm/bpm.ts";
export * as bpm from "./modules/bpm/bpm.ts";
export { SepPayment } from "./modules/sep/sep.ts";
export * as sep from "./modules/sep/sep.ts";

export type {
  Payment,
  PaymentParams,
  Result,
  ResultRequestInit,
  VerifyResult,
} from "./modules/types.ts";

export { ZarinpalPayment } from "./modules/zarinpal/zarinpal.ts";
export * as zarinpal from "./modules/zarinpal/zarinpal.ts";

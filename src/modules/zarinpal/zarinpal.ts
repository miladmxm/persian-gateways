import type {
  Payment,
  PaymentParams,
  ResultRequestInit,
  VerifyResult,
} from "../types.ts";
import type {
  RequestForGetPaymentPage,
  ResponseFetchForRequestPay,
  ResponseFetchForVerify,
  VerifyPayment,
} from "./types.ts";

import { catchError } from "../../utils/catch.ts";
import { postJson } from "../../utils/http.ts";
import { mergeURL } from "../../utils/mergeUrl.ts";
import { createRedirectPaymentResult } from "../../utils/payment.ts";
import { getErrorByCode } from "./errorsMessages.ts";

const BASE_URL = (isSandbox: boolean = false) =>
  isSandbox
    ? "https://sandbox.zarinpal.com/pg/"
    : "https://payment.zarinpal.com/pg/";

const requestForGetPaymentPage = async (
  data: RequestForGetPaymentPage,
): Promise<ResultRequestInit> => {
  const {
    amount,
    callBackUrl,
    description,
    merchantId,
    currency,
    metadata,
    referrerId,
  } = data;
  try {
    const { response, body } = await postJson<ResponseFetchForRequestPay>(
      mergeURL(BASE_URL(true), "v4/payment/request.json"),
      {
        amount,
        description,
        merchant_id: merchantId,
        callback_url: callBackUrl,
        currency,
        metadata,
        referrer_id: referrerId,
      },
    );
    if (response.ok) {
      const { href } = mergeURL(
        BASE_URL(true),
        `StartPay/${body.data.authority}`,
      );
      return createRedirectPaymentResult({ url: href });
    } else {
      return [
        {
          message: getErrorByCode(body?.errors?.code || response.status),
          code: response.status,
        },
        null,
      ];
    }
  } catch (error) {
    return catchError(error);
  }
};

const verifyPayment = async ({
  amount,
  authority,
  merchantId,
}: VerifyPayment): Promise<VerifyResult> => {
  try {
    const { response, body } = await postJson<ResponseFetchForVerify>(
      mergeURL(BASE_URL(true), "v4/payment/verify.json"),
      {
        amount,
        authority,
        merchant_id: merchantId,
      },
    );
    if (response.ok) {
      return [null, { isOk: true }];
    } else {
      const code = body?.errors?.code || response.status;
      return [
        {
          message: getErrorByCode(code),
          code,
        },
        null,
      ];
    }
  } catch (error) {
    return catchError(error);
  }
};

export class ZarinpalPayment implements Payment {
  amount: number;
  callBackUrl: string;
  gatewayId: string;
  tracker: string;
  constructor({ amount, callBackUrl, gatewayId, tracker }: PaymentParams) {
    this.amount = amount;
    this.callBackUrl = callBackUrl;
    this.gatewayId = gatewayId;
    this.tracker = tracker;
  }
  getPayPage() {
    return requestForGetPaymentPage({
      amount: this.amount,
      callBackUrl: this.callBackUrl,
      merchantId: this.gatewayId,
      currency: "IRR",
      description: `Pay for ${this.tracker} `,
      metadata: { orderId: this.tracker },
    });
  }
  async verify({ url }: { url: string }): Promise<VerifyResult> {
    const { searchParams } = new URL(url);
    const authority = searchParams.get("Authority");
    if (!authority)
      return [{ code: 500, message: "Authority not found" }, null];
    return verifyPayment({
      amount: this.amount,
      authority,
      merchantId: this.gatewayId,
    });
  }
}

import type { Result, ResultRequestInit } from "../types.ts";
import type {
  RequestForGetPaymentPage,
  ResponseFetchForRequestPay,
  ResponseFetchForVerify,
  VerifyPayment,
} from "./types.ts";

import { catchError } from "../../utils/catch.ts";
import { createHtmlFormForRedirectToGatewayPage } from "../../utils/makeHTML.ts";
import { mergeURL } from "../../utils/mergeUrl.ts";
import { getErrorByCode } from "./errorsMessages.ts";

const BASE_URL = (isSandbox: boolean = false) =>
  isSandbox
    ? "https://sandbox.zarinpal.com/pg/"
    : "https://payment.zarinpal.com/pg/";

const defaultFetchConfig: RequestInit = {
  headers: {
    "content-type": "application/json",
    accept: "application/json",
  },
  method: "POST",
};

export const requestForGetPaymentPage = async (
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
    const res = await fetch(
      mergeURL(BASE_URL(true), "v4/payment/request.json"),
      {
        ...defaultFetchConfig,
        body: JSON.stringify({
          amount,
          description,
          merchant_id: merchantId,
          callback_url: callBackUrl,
          currency,
          metadata,
          referrer_id: referrerId,
        }),
      },
    );
    const jsonRes = (await res.json()) as ResponseFetchForRequestPay;
    if (res.ok) {
      const { href } = mergeURL(
        BASE_URL(true),
        `StartPay/${jsonRes.data.authority}`,
      );
      return [
        null,
        {
          url: href,
          html: createHtmlFormForRedirectToGatewayPage({ url: href }),
        },
      ];
    } else {
      return [
        {
          message: getErrorByCode(jsonRes?.errors?.code || res.status),
          code: res.status,
        },
        null,
      ];
    }
  } catch (error) {
    return catchError(error);
  }
};

export const verifyPayment = async ({
  amount,
  authority,
  merchantId,
}: VerifyPayment): Promise<Result<{ isOK: boolean }>> => {
  try {
    const res = await fetch(
      mergeURL(BASE_URL(true), "v4/payment/verify.json"),
      {
        ...defaultFetchConfig,
        body: JSON.stringify({
          amount,
          authority,
          merchant_id: merchantId,
        }),
      },
    );
    const jsonRes = (await res.json()) as ResponseFetchForVerify;
    if (res.ok) {
      return [null, { isOK: true }];
    } else {
      const code = jsonRes?.errors?.code || res.status;
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

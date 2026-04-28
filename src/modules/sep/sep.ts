import type { Result, ResultRequestInit } from "../types.ts";
import type {
  RequestForGetPaymentPage,
  ResponseFetchForRequestPay,
  ResponseFetchForVerify,
  VerifyPayment,
} from "./types.ts";

import { catchError } from "../../utils/catch.ts";
import { createHtmlFormForRedirectToGatewayPage } from "../../utils/makeHTML.ts";

const tokenUrl = "https://sep.shaparak.ir/onlinepg/onlinepg";
const payUrl = "https://sep.shaparak.ir/OnlinePG/OnlinePG";
const verifyUrl =
  "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction";

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
  const { amount, callBackUrl, resNum, terminalId, cellNumber } = data;
  try {
    const res = await fetch(tokenUrl, {
      ...defaultFetchConfig,
      body: JSON.stringify({
        Amount: amount,
        Action: "Token",
        TerminalId: terminalId,
        ResNum: resNum,
        RedirectURL: callBackUrl,
        CellNumber: cellNumber,
      }),
    });
    const jsonRes = (await res.json()) as ResponseFetchForRequestPay;
    if (jsonRes.status === 1) {
      return [
        null,
        {
          url: payUrl,
          html: createHtmlFormForRedirectToGatewayPage({
            url: payUrl,
            metadata: { Token: jsonRes.token, GetMethod: "" },
          }),
        },
      ];
    }
    return [{ message: jsonRes.errorDesc, code: jsonRes.errorCode }, null];
  } catch (error) {
    return catchError(error);
  }
};

export const verifyPayment = async ({
  refNum,
  terminalId,
}: VerifyPayment): Promise<Result<{ isOK: boolean }>> => {
  try {
    const res = await fetch(verifyUrl, {
      ...defaultFetchConfig,
      body: JSON.stringify({
        refNum,
        TerminalNumber: terminalId,
      }),
    });
    const jsonRes = (await res.json()) as ResponseFetchForVerify;
    if (jsonRes.ResultCode === 0) {
      return [null, { isOK: true }];
    }
    return [
      {
        message: jsonRes.ResultDescription,
        code: jsonRes.ResultCode,
      },
      null,
    ];
  } catch (error) {
    return catchError(error);
  }
};

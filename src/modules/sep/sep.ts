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
import { createRedirectPaymentResult } from "../../utils/payment.ts";

const tokenUrl = "https://sep.shaparak.ir/onlinepg/onlinepg";
const payUrl = "https://sep.shaparak.ir/OnlinePG/OnlinePG";
const verifyUrl =
  "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction";

export const requestForGetPaymentPage = async (
  data: RequestForGetPaymentPage,
): Promise<ResultRequestInit> => {
  const { amount, callBackUrl, resNum, terminalId, cellNumber } = data;
  try {
    const { body } = await postJson<ResponseFetchForRequestPay>(tokenUrl, {
      Amount: amount,
      Action: "Token",
      TerminalId: terminalId,
      ResNum: resNum,
      RedirectURL: callBackUrl,
      CellNumber: cellNumber,
    });
    if (body.status === 1) {
      return createRedirectPaymentResult({
        url: payUrl,
        metadata: { Token: body.token, GetMethod: "" },
      });
    }
    return [{ message: body.errorDesc, code: body.errorCode }, null];
  } catch (error) {
    return catchError(error);
  }
};

export const verifyPayment = async ({
  refNum,
  terminalId,
}: VerifyPayment): Promise<VerifyResult> => {
  try {
    const { body } = await postJson<ResponseFetchForVerify>(verifyUrl, {
      refNum,
      TerminalNumber: terminalId,
    });
    if (body.ResultCode === 0) {
      return [null, { isOk: true }];
    }
    return [
      {
        message: body.ResultDescription,
        code: body.ResultCode,
      },
      null,
    ];
  } catch (error) {
    return catchError(error);
  }
};

const getStringParam = (value: unknown) =>
  typeof value === "string" ? value : undefined;

export class SepPayment implements Payment {
  amount: number;
  callBackUrl: string;
  cellNumber?: string;
  gatewayId: string;
  tracker: string;

  constructor({
    amount,
    callBackUrl,
    gatewayId,
    tracker,
    cellNumber,
  }: PaymentParams & { cellNumber?: string }) {
    this.amount = amount;
    this.callBackUrl = callBackUrl;
    this.gatewayId = gatewayId;
    this.tracker = tracker;
    this.cellNumber = cellNumber;
  }

  getPayPage() {
    return requestForGetPaymentPage({
      amount: this.amount,
      callBackUrl: this.callBackUrl,
      terminalId: this.gatewayId,
      resNum: this.tracker,
      cellNumber: this.cellNumber,
    });
  }

  async verify({
    url,
    body,
  }: {
    url: string;
    body?: Record<string, unknown>;
  }): Promise<VerifyResult> {
    const searchParams = new URL(url).searchParams;
    const refNum = getStringParam(body?.RefNum) || searchParams.get("RefNum");

    if (!refNum) return [{ code: 500, message: "RefNum not found" }, null];

    return verifyPayment({
      refNum,
      terminalId: this.gatewayId,
    });
  }
}

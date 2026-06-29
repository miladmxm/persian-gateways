import { createCipheriv } from "node:crypto";

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

const BASE_URL = "https://sadad.shaparak.ir";
const TOKEN_PATH = "/vpg/api/v0/Request/PaymentRequest";
const PAY_PATH = "/VPG/Purchase";
const VERIFY_PATH = "/vpg/api/v0/Advice/Verify";

const pad = (text: string, padSize: number) => {
  const remainingSpace = padSize - (text.length % padSize || padSize);
  const padding = remainingSpace === 0 ? padSize : remainingSpace;

  return text + String.fromCharCode(padding).repeat(padding);
};

const encryptDes3 = (text: string, secretKey: string) => {
  const cipher = createCipheriv(
    "des-ede3",
    Buffer.from(secretKey, "base64"),
    null,
  );
  cipher.setAutoPadding(false);

  return Buffer.concat([
    cipher.update(pad(text, 8), "utf8"),
    cipher.final(),
  ]).toString("base64");
};

const getLocalDateTime = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const hours = now.getHours();
  const hour12 = String(hours % 12 || 12).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";

  return `${month}/${day}/${year} ${hour12}:${minutes}:${seconds} ${meridiem}`;
};

export const requestForGetPaymentPage = async ({
  additionalData,
  amount,
  callBackUrl,
  merchantId,
  orderId,
  secretKey,
  terminalId,
  baseUrl = BASE_URL,
}: RequestForGetPaymentPage): Promise<ResultRequestInit> => {
  try {
    const { body } = await postJson<ResponseFetchForRequestPay>(
      mergeURL(baseUrl, TOKEN_PATH),
      {
        TerminalId: terminalId,
        MerchantId: merchantId,
        Amount: amount,
        SignData: encryptDes3(`${terminalId};${orderId};${amount}`, secretKey),
        ReturnUrl: callBackUrl,
        LocalDateTime: getLocalDateTime(),
        OrderId: orderId,
        AdditionalData: additionalData,
      },
    );

    if (String(body.ResCode) === "0" && body.Token) {
      return createRedirectPaymentResult({
        url: mergeURL(baseUrl, PAY_PATH).href,
        method: "GET",
        metadata: { Token: body.Token },
      });
    }

    return [
      {
        message: body.Description,
        code: body.ResCode,
      },
      null,
    ];
  } catch (error) {
    return catchError(error);
  }
};

export const verifyPayment = async ({
  secretKey,
  token,
  baseUrl = BASE_URL,
}: VerifyPayment): Promise<VerifyResult> => {
  try {
    const { body } = await postJson<ResponseFetchForVerify>(
      mergeURL(baseUrl, VERIFY_PATH),
      {
        Token: token,
        SignData: encryptDes3(token, secretKey),
      },
    );

    if (String(body.ResCode) === "0") {
      return [null, { isOk: true }];
    }

    return [
      {
        message: body.Description,
        code: body.ResCode,
      },
      null,
    ];
  } catch (error) {
    return catchError(error);
  }
};

interface BmiPaymentParams extends PaymentParams {
  secretKey: string;
  terminalId: string;
  additionalData?: string;
}

const getStringParam = (value: unknown) =>
  typeof value === "string" ? value : undefined;

export class BmiPayment implements Payment {
  additionalData?: string;
  amount: number;
  baseUrl?: string;
  callBackUrl: string;
  gatewayId: string;
  secretKey: string;
  terminalId: string;
  tracker: string;

  constructor({
    additionalData,
    amount,
    callBackUrl,
    gatewayId,
    secretKey,
    terminalId,
    tracker,
    baseUrl,
  }: BmiPaymentParams) {
    this.amount = amount;
    this.baseUrl = baseUrl;
    this.callBackUrl = callBackUrl;
    this.gatewayId = gatewayId;
    this.secretKey = secretKey;
    this.terminalId = terminalId;
    this.tracker = tracker;
    this.additionalData = additionalData;
  }

  getPayPage() {
    return requestForGetPaymentPage({
      additionalData: this.additionalData,
      amount: this.amount,
      callBackUrl: this.callBackUrl,
      merchantId: this.gatewayId,
      orderId: this.tracker,
      secretKey: this.secretKey,
      terminalId: this.terminalId,
      baseUrl: this.baseUrl,
    });
  }

  async verify({
    body,
    url,
  }: {
    url: string;
    body?: Record<string, unknown>;
  }): Promise<VerifyResult> {
    const searchParams = new URL(url).searchParams;
    const token = getStringParam(body?.Token) || searchParams.get("Token");

    if (!token) return [{ code: 500, message: "Token not found" }, null];

    return verifyPayment({
      secretKey: this.secretKey,
      token,
      baseUrl: this.baseUrl,
    });
  }
}

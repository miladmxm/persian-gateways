import soap from "soap";

import type {
  Payment,
  PaymentParams,
  ResultRequestInit,
  VerifyResult,
} from "../types.ts";
import type {
  RequestForGetPaymentPage,
  SettleTransction,
  VerifyPayment,
} from "./types.ts";

import { catchError } from "../../utils/catch.ts";
import { mergeURL } from "../../utils/mergeUrl.ts";
import { createRedirectPaymentResult } from "../../utils/payment.ts";
import { getErrorByCode } from "./errorsMessages.ts";

const BASE_URL = (isSandbox: boolean = false) =>
  isSandbox ? "https://pgw.dev.bpmellat.ir" : "https://bpm.shaparak.ir";
const WSDL_PATH = "/pgwchannel/services/pgw?wsdl";
const PAY_PATH = "/pgwchannel/startpay.mellat";

const getClient = (baseUrl = BASE_URL()) =>
  soap.createClientAsync(mergeURL(baseUrl, WSDL_PATH).href);

const getDateAndTime = () => {
  return {
    localDate: new Date().toISOString().split("T")[0].replace(/-/g, ""),
    localTime: new Date().toLocaleTimeString().split(" ")[0].replace(/:/g, ""),
  };
};

export const requestForGetPaymentPage = async ({
  amount,
  callBackUrl,
  orderId,
  terminalId,
  username,
  password,
  description,
  baseUrl,
}: RequestForGetPaymentPage): Promise<ResultRequestInit> => {
  try {
    const client = await getClient(baseUrl);
    const requestData = {
      terminalId,
      userName: username,
      userPassword: password,
      orderId,
      amount,
      ...getDateAndTime(),
      additionalData: description || "",
      callBackUrl,
      payerId: 0,
    };
    const res = (await client.bpPayRequestAsync(requestData))[0].return;
    const [status, token] = res.split(",");
    if (status === "0") {
      const url = mergeURL(baseUrl ?? BASE_URL(), PAY_PATH).href;
      return createRedirectPaymentResult({
        url,
        metadata: { RefId: token },
      });
    } else {
      const message = getErrorByCode(status);
      return [{ message, code: status }, null];
    }
  } catch (error) {
    return catchError(error);
  }
};

const settleTransction = async (
  settleData: SettleTransction,
): Promise<VerifyResult> => {
  try {
    const client = await getClient(settleData.baseUrl);
    const requestData = {
      terminalId: settleData.terminalId,
      orderId: settleData.orderId,
      saleOrderId: settleData.saleOrderId,
      userName: settleData.userName,
      userPassword: settleData.userPassword,
      saleReferenceId: settleData.saleReferenceId,
    };
    const res: string | undefined = (
      await client.bpSettleRequestAsync(requestData)
    )[0].return;
    if (res === "0") {
      return [null, { isOk: true }];
    } else {
      return [{ message: "did not settle the payment", code: res }, null];
    }
  } catch (error) {
    return catchError(error);
  }
};

export const verifyPayment = async ({
  orderId,
  password,
  saleReferenceId,
  terminalId,
  username,
  baseUrl,
}: VerifyPayment): Promise<VerifyResult> => {
  try {
    const verifyData = {
      terminalId,
      orderId,
      saleOrderId: orderId,
      userName: username,
      userPassword: password,
      saleReferenceId,
    };
    const client = await getClient(baseUrl);

    const verifyRes = (await client.bpVerifyRequestAsync(verifyData))[0].return;
    if (verifyRes === "0") {
      return settleTransction({ ...verifyData, baseUrl });
    }

    const resInquiry = (await client.bpInquiryRequestAsync(verifyData))[0]
      .return;
    if (resInquiry === "0") {
      return settleTransction({ ...verifyData, baseUrl });
    }

    const reversalRes: number | undefined = (
      await client.bpReversalRequestAsync(verifyData)
    )[0].return;

    return [{ message: "reversal", code: reversalRes }, null];
  } catch (error) {
    return catchError(error);
  }
};

interface BpmPaymentParams extends PaymentParams {
  password: string;
  username: string;
}

const getNumberParam = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return undefined;

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
};

export class BpmPayment implements Payment {
  amount: number;
  baseUrl?: string;
  callBackUrl: string;
  gatewayId: string;
  password: string;
  tracker: string;
  username: string;

  constructor({
    amount,
    callBackUrl,
    gatewayId,
    tracker,
    username,
    password,
    baseUrl,
  }: BpmPaymentParams) {
    this.amount = amount;
    this.baseUrl = baseUrl;
    this.callBackUrl = callBackUrl;
    this.gatewayId = gatewayId;
    this.tracker = tracker;
    this.username = username;
    this.password = password;
  }

  getPayPage() {
    return requestForGetPaymentPage({
      amount: this.amount,
      callBackUrl: this.callBackUrl,
      terminalId: Number(this.gatewayId),
      orderId: Number(this.tracker),
      username: this.username,
      password: this.password,
      description: `Pay for ${this.tracker}`,
      baseUrl: this.baseUrl,
    });
  }

  async verify({
    body,
  }: {
    url: string;
    body?: Record<string, unknown>;
  }): Promise<VerifyResult> {
    const saleReferenceId = getNumberParam(body?.SaleReferenceId);

    if (!saleReferenceId) {
      return [{ code: 500, message: "SaleReferenceId not found" }, null];
    }

    return verifyPayment({
      terminalId: Number(this.gatewayId),
      orderId: Number(this.tracker),
      username: this.username,
      password: this.password,
      saleReferenceId,
      baseUrl: this.baseUrl,
    });
  }
}

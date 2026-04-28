import soap from "soap";

import type { Result, ResultRequestInit } from "../types.ts";
import type {
  RequestForGetPaymentPage,
  SettleTransction,
  VerifyPayment,
} from "./types.ts";

import { catchError } from "../../utils/catch.ts";
import { createHtmlFormForRedirectToGatewayPage } from "../../utils/makeHTML.ts";
import { getErrorByCode } from "./errorsMessages.ts";

const BASE_URL = (isSandbox: boolean = false) =>
  isSandbox
    ? "https://pgw.dev.bpmellat.ir/pgwchannel/services/pgw?wsdl"
    : "https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl";

const getClient = () => soap.createClientAsync(BASE_URL());

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
}: RequestForGetPaymentPage): Promise<ResultRequestInit> => {
  try {
    const client = await getClient();
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
    const res = await client.bpPayRequestAsync(requestData)[0].return;
    const [status, token] = res.split(",");
    if (status === "0") {
      const url = "https://bpm.shaparak.ir/pgwchannel/startpay.mellat";
      return [
        null,
        {
          html: createHtmlFormForRedirectToGatewayPage({
            url,
            metadata: { RefId: token },
          }),
          url,
        },
      ];
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
): Promise<Result<{ isOK: boolean }>> => {
  try {
    const client = await getClient();
    const res: string | undefined = (
      await client.bpSettleRequestAsync(settleData)
    )[0].return;
    if (res === "0") {
      return [null, { isOK: true }];
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
}: VerifyPayment): Promise<Result<{ isOK: boolean }>> => {
  try {
    const verifyData = {
      terminalId,
      orderId,
      saleOrderId: orderId,
      userName: username,
      userPassword: password,
      saleReferenceId,
    };
    const client = await getClient();

    const verifyRes = (await client.bpVerifyRequestAsync(verifyData))[0].return;
    if (verifyRes === "0") {
      return settleTransction(verifyData);
    }

    const resInquiry = (await client.bpInquiryRequestAsync(verifyData))[0]
      .return;
    if (resInquiry === "0") {
      return settleTransction(verifyData);
    }

    const reversalRes: number | undefined = (
      await client.bpReversalRequestAsync(verifyData)
    )[0].return;

    return [{ message: "reversal", code: reversalRes }, null];
  } catch (error) {
    return catchError(error);
  }
};

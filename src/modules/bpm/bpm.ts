import soap from "soap";

import type { ResultRequestInit } from "../types.ts";

import { catchError } from "../../utils/catch.ts";
import { createHtmlFormForRedirectToGatewayPage } from "../../utils/makeHTML.ts";
import { getErrorByCode } from "./errorsMessages.ts";

const BASE_URL = (isSandbox: boolean = false) =>
  isSandbox
    ? "https://pgw.dev.bpmellat.ir/pgwchannel/services/pgw?wsdl"
    : "https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl";

const getClient = () => soap.createClientAsync(BASE_URL());

interface RequestForGetPaymentPage {
  terminalId: number;
  username: string;
  password: string;
  orderId: number;
  amount: number;
  description?: string;
  callBackUrl: string;
}
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
    const [res] = await client.bpPayRequestAsync(requestData);
    const [status, token] = res.return.split(",");
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

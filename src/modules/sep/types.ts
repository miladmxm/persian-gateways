export interface RequestForGetPaymentPage {
  amount: number;
  terminalId: string;
  resNum: string;
  callBackUrl: string;
  cellNumber?: string;
}
export type ResponseFetchForRequestPay =
  | {
      status: -1;
      errorCode: string;
      errorDesc: string;
    }
  | {
      status: 1;
      token: string;
    };

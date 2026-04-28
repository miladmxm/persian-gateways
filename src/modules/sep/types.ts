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
export interface VerifyPayment {
  refNum: string;
  terminalId: string;
}

export interface ResponseFetchForVerify {
  TransactionDetail: {
    RRN: string;
    RefNum: string;
    MaskedPan: string;
    HashedPan: string;
    TerminalNumber: number;
    OrginalAmount: number;
    AffectiveAmount: null;
    StraceDate: string;
    StraceNo: string;
  };
  ResultCode: number;
  ResultDescription: string;
}

export interface AuthData {
  terminalId: number;
  username: string;
  password: string;
  orderId: number;
}

export interface RequestForGetPaymentPage extends AuthData {
  amount: number;
  description?: string;
  callBackUrl: string;
}
export interface VerifyPayment extends AuthData {
  saleReferenceId: number;
}

export interface SettleTransction {
  terminalId: number;
  orderId: number;
  saleOrderId: number;
  userName: string;
  userPassword: string;
  saleReferenceId: number;
}

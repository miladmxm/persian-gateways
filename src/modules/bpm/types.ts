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
  baseUrl?: string;
}
export interface VerifyPayment extends AuthData {
  saleReferenceId: number;
  baseUrl?: string;
}

export interface SettleTransction {
  terminalId: number;
  orderId: number;
  saleOrderId: number;
  userName: string;
  userPassword: string;
  saleReferenceId: number;
  baseUrl?: string;
}

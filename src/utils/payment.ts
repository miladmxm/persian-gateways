import type { ResultRequestInit } from "../modules/types.ts";

import { createHtmlFormForRedirectToGatewayPage } from "./makeHTML.ts";

interface CreateRedirectPaymentResultParams {
  url: string;
  metadata?: Record<string, number | string>;
  method?: "GET" | "POST";
}

export const createRedirectPaymentResult = ({
  url,
  metadata,
  method,
}: CreateRedirectPaymentResultParams): ResultRequestInit => [
  null,
  {
    url,
    html: createHtmlFormForRedirectToGatewayPage({
      url,
      metadata,
      method,
    }),
  },
];

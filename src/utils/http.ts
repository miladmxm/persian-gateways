const jsonPostConfig: RequestInit = {
  headers: {
    "content-type": "application/json",
    accept: "application/json",
  },
  method: "POST",
};

export const postJson = async <T>(
  url: string | URL,
  data: Record<string, unknown>,
): Promise<{ response: Response; body: T }> => {
  const response = await fetch(url, {
    ...jsonPostConfig,
    body: JSON.stringify(data),
  });
  const body = (await response.json()) as T;

  return { response, body };
};

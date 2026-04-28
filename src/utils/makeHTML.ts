interface CreateHtmlFormForRedirectToGatewayPage {
  url: string;
  method?: "GET" | "POST";
  metadata?: Record<string, number | string>;
}
export const createHtmlFormForRedirectToGatewayPage = ({
  url,
  metadata,
  method = "POST",
}: CreateHtmlFormForRedirectToGatewayPage) => {
  const metadataInputs = metadata
    ? Object.keys(metadata)
        .map(
          (key) =>
            `<input type="hidden" name="${key}" value="${metadata[key]}" />`,
        )
        .join("")
    : "";
  return `<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirect to Gateway</title>
</head>
<body>
    <form method="${method}" action="${url}">
${metadataInputs}
    </form>
    <script>
    document.querySelector("form").submit()
    </script>
</body>
</html>`;
};

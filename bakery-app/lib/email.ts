const RESEND_API_URL = "https://api.resend.com/emails";

const FROM_EMAIL =
  "Sweet Tey's Pastries <orders@orders.sweetteypastries.com>";

type SendTransactionalEmailInput = {
  to: string;
  subject: string;
  html: string;
  idempotencyKey: string;
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  idempotencyKey,
}: SendTransactionalEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  const result = (await response
    .json()
    .catch(() => null)) as
    | {
        id?: string;
        message?: string;
        name?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(
      result?.message ||
        `Resend returned HTTP ${response.status}.`
    );
  }

  return result?.id ?? null;
}

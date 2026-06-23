import { Page } from "@playwright/test";

export async function getMfaCodeFromEmail(
  page: Page,
  toAddress: string,
  options: {
    timeoutMs?: number;
    pollIntervalMs?: number;
    sesUrl?: string;
  } = {},
): Promise<string> {
  const {
    timeoutMs = 10000,
    pollIntervalMs = 500,
    sesUrl = "http://localhost:8005",
  } = options;

  const deadline = Date.now() + timeoutMs;
  let attempt = 0;

  console.log(`[MFA] Looking for code sent to: ${toAddress}`);

  while (Date.now() < deadline) {
    attempt++;
    console.log(`[MFA] Attempt ${attempt} — querying ${sesUrl}/store`);

    const res = await page.request.get(`${sesUrl}/store`);
    console.log(`[MFA] Store responded with status ${res.status()}`);

    if (res.ok()) {
      const { emails = [] } = await res.json();
      console.log(`[MFA] ${emails.length} email(s) in store`);

      // Newest-first: the store appends, so reverse to start from the latest.
      const ordered = [...emails].reverse();

      for (const email of ordered) {
        const to = email?.destination?.to?.[0] ?? "";
        const at = email?.at ?? "?";
        console.log(
          `[MFA]  - candidate to="${to}" at=${at} subject="${email?.subject ?? ""}"`,
        );

        if (to !== toAddress) {
          console.log(`[MFA]    skip: recipient mismatch`);
          continue;
        }

        const text = email?.body?.text ?? "";
        const match = text.match(/\b(\d{4,8})\b/);

        if (match) {
          console.log(
            `[MFA] ✅ Found code ${match[1]} (newest match for ${toAddress})`,
          );
          return match[1];
        }

        console.log(`[MFA]    matched recipient but no code pattern in body`);
      }

      console.log(
        `[MFA] No matching code yet, retrying in ${pollIntervalMs}ms`,
      );
    } else {
      console.log(`[MFA] Store not OK (status ${res.status()}), retrying`);
    }

    await page.waitForTimeout(pollIntervalMs);
  }

  throw new Error(
    `[MFA] Code not found for ${toAddress} within ${timeoutMs}ms after ${attempt} attempts`,
  );
}

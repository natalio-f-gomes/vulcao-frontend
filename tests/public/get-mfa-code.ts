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
    timeoutMs = 2000,
    pollIntervalMs = 100,
    sesUrl = "http://localhost:8005",
  } = options;

  const deadline = Date.now() + timeoutMs;
  let attempt = 0;

  console.log(`[MFA] Looking for code sent to: ${toAddress}`);

  while (Date.now() < deadline) {
    attempt++;
    console.log(`[MFA] Attempt ${attempt} — querying ${sesUrl}/store`);

    try {
      // Use Node.js fetch instead of page.request
      const res = await fetch(`${sesUrl}/store`);
      console.log(`[MFA] Store responded with status ${res.status}`);

      if (res.ok) {
        const data = await res.json();
        const emails = data?.emails ?? [];
        console.log(`[MFA] ${emails.length} email(s) in store`);

        // Newest-first
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

          const body = email?.body?.text ?? email?.body?.html ?? "";
          const match = body.match(/\b(\d{4,8})\b/);
          if (match) {
            console.log(
              `[MFA] ✅ Found code ${match[1]} (newest match for ${toAddress})`,
            );
            return match[1];
          }
        }
      } else {
        const errorText = await res.text();
        console.log(`[MFA] Store not OK (status ${res.status}): ${errorText}`);
      }
    } catch (error) {
      console.log(`[MFA] Error fetching store: ${error}`);
    }

    console.log(`[MFA] Code not found, waiting ${pollIntervalMs}ms...`);
    await page.waitForTimeout(pollIntervalMs);
  }

  throw new Error(
    `[MFA] Code not found for ${toAddress} within ${timeoutMs}ms after ${attempt} attempts`,
  );
}

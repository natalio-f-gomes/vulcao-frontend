import { test, expect, request } from "@playwright/test";
import { getMfaCodeFromEmail } from "./public/get-mfa-code";
const URL = "http://localhost:3000";
const appTitle = "Vulcão";

test("Has Title", async ({ page }) => {
  await page.goto(URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(appTitle);
});

async function clearLocalStackSes(): Promise<void> {
  const url = "http://localhost:8005/store";

  try {
    const response = await fetch(url, { method: "DELETE" });
    if (response.ok) {
      console.log("LocalStack SES store cleared successfully.");
    } else {
      console.error(`Failed to clear store: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error connecting to LocalStack:", error);
  }
}

test("Go to client registration", async ({ page, request }) => {
  const firstName: string = "John";
  const lastName: string = "Doe";
  const username: string = "jhondoe3";
  const email: string = "jhondoe@gmail.com";
  const password: string = "strongpassword";

  await page.goto(URL);

  // Click the get started link.
  await page.getByText("Sou Cliente").click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveTitle(appTitle);
  await expect(page.getByText("Junte-se à Vulcão.")).toBeVisible();

  const firstNameField = 'input[name="firstName"]';

  await expect(page.getByText("Primeiro Nome")).toBeVisible();
  await page.getByPlaceholder("Paulo");
  await page.locator(firstNameField).fill(firstName);
  await expect(page.locator(firstNameField)).toHaveValue(firstName);

  const lastNameField = 'input[name="lastName"]';
  await expect(page.getByText("Último Nome")).toBeVisible();
  await page.getByPlaceholder("Silva");
  await page.locator(lastNameField).fill(lastName);
  await expect(page.locator(lastNameField)).toHaveValue(lastName);

  const usernameField = 'input[name="username"]';
  await expect(
    page.getByText("Nome de Utilizador (Mínimo de 8 caracteres, sem espaços)"),
  ).toBeVisible();
  await page.getByPlaceholder("paulo-silva");
  await page.locator(usernameField).fill(username);
  await expect(page.locator(usernameField)).toHaveValue(username);

  const emailField = 'input[name="email"]';
  await expect(page.getByText("Email")).toBeVisible();
  await expect(page.getByText("Email")).toBeVisible();
  await page.getByPlaceholder("paulosilva@exemplo.com");
  await page.locator(emailField).fill(email);
  await expect(page.locator(emailField)).toHaveValue(email);

  await expect(
    page.getByText("Palavra-passe (Mínimo de 8 caracteres)"),
  ).toBeVisible();
  await page.locator('input[name="password"]').fill(password);
  await expect(page.locator('input[name="password"]')).toHaveValue(password);

  await expect(page.getByText("Confirmar Palavra-passe")).toBeVisible();
  await page.locator('input[name="confirmPassword"]').fill(password);
  await expect(page.locator('input[name="confirmPassword"]')).toHaveValue(
    password,
  );

  console.log("[MFA] Clearing store before registration");
  clearLocalStackSes();

  const sentAfter = Date.now();
  await page.getByRole("button", { name: "Criar Conta" }).click();

  const code = await getMfaCodeFromEmail(page, email);

  await page.waitForSelector(".mfa-overlay", { timeout: 5000 }); // expects the mfa component to render about 5 seconds
  await page.locator("#mfa-code").fill(code);
  await expect(page.locator("#mfa-code")).toHaveValue(code);
  await page.getByRole("button", { name: "Verificar Código" }).click();
});

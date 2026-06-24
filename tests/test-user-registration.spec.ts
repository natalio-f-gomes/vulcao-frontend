import { test, expect, request, Page } from "@playwright/test";
import { getMfaCodeFromEmail } from "./public/get-mfa-code";
import { cleanAllTableItems } from "./reset_tables";
import {
  getValidEntitiesRegistrationData,
  invalidEmails,
  invalidUsernames,
} from "./TestingData/EntityTestData";
const URL = "http://localhost:3000";
const appTitle = "Vulcão";

test("Has Title", async ({ page }) => {
  await page.goto(URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(appTitle);
});

test.beforeEach(async () => {
  await clearSesStore();
  await cleanAllTableItems();
});

async function clearSesStore(): Promise<void> {
  const res = await fetch("http://localhost:8005/clear-store", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to clear SES store: ${res.status} ${res.statusText}`,
    );
  }
  console.log("SES store cleared successfully.");
}

const UserRegisterBody = async (
  page: Page,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
  dialogType: string,
) => {
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
  await clearSesStore();

  await page.getByRole("button", { name: "Criar Conta" }).click();

  if (dialogType === "validDialog") {
    const code = await getMfaCodeFromEmail(page, email);

    await page.waitForSelector(".mfa-overlay", { timeout: 5000 }); // expects the mfa component to render about 5 seconds
    await page.locator("#mfa-code").fill(code);
    await expect(page.locator("#mfa-code")).toHaveValue(code);
    await page.getByRole("button", { name: "Verificar Código" }).click();
    await ValidDialog;
  } else if (dialogType === "invalidUsername") {
    await InvalidUsernameDialog;
  } else {
    await InvalidEmailDialog;
  }
};

const ValidDialog = async (page: Page) => {
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe("Utilizador registado com sucesso.");
    await dialog.accept();
  });
};

const InvalidUsernameDialog = async (page: Page) => {
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe(
      "O nome de utilizador só pode ter letras, números, ponto, traço e underscore (_)",
    );
    await dialog.accept();
  });
};

const InvalidEmailDialog = async (page: Page) => {
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe(
      "Email inválido. Use apenas letras, números, ponto e traço",
    );
    await dialog.accept();
  });
};

// Group tests for parallel execution
test.describe.parallel("Register Users With Valid Data", () => {
  // Split into chunks for parallel execution
  const chunkSize = 5;
  const chunks = [];
  const validData = getValidEntitiesRegistrationData();
  for (let i = 0; i < validData.length; i += chunkSize) {
    chunks.push(validData.slice(i, i + chunkSize));
  }

  chunks.forEach((chunk, index) => {
    test(`Invalid Emails batch ${index + 1}`, async ({ page }) => {
      test.setTimeout(30000);
      await page.goto(URL);

      for (const user of chunk) {
        console.log(`Testing Valid data from: "${user.username}"`);
        await UserRegisterBody(
          page,
          user.firstName,
          user.lastName,
          user.username,
          user.email,
          user.password,
          "invalidUsername", // expectSuccess = false
        );
        // Go back to registration page for next test
        await page.goto(URL);
      }
    });
  });
});

// Group tests for parallel execution
test.describe.parallel("Invalid username registration tests", () => {
  // Split into chunks for parallel execution
  const chunkSize = 5;
  const chunks = [];

  for (let i = 0; i < invalidUsernames.length; i += chunkSize) {
    chunks.push(invalidUsernames.slice(i, i + chunkSize));
  }

  chunks.forEach((chunk, index) => {
    test(`Invalid usernames batch ${index + 1}`, async ({ page }) => {
      test.setTimeout(30000);
      await page.goto(URL);

      for (const user of chunk) {
        console.log(`Testing invalid username: "${user.username}"`);
        await UserRegisterBody(
          page,
          user.firstName,
          user.lastName,
          user.username,
          user.email,
          user.password,
          "invalidUsername", // expectSuccess = false
        );

        // Go back to registration page for next test
        await page.goto(URL);
      }
    });
  });
});

// Group tests for parallel execution
test.describe.parallel("Invalid Email registration tests", () => {
  // Split into chunks for parallel execution
  const chunkSize = 5;
  const chunks = [];

  for (let i = 0; i < invalidEmails.length; i += chunkSize) {
    chunks.push(invalidEmails.slice(i, i + chunkSize));
  }

  chunks.forEach((chunk, index) => {
    test(`Invalid Emails batch ${index + 1}`, async ({ page }) => {
      test.setTimeout(30000);
      await page.goto(URL);

      for (const user of chunk) {
        console.log(`Testing invalid username: "${user.username}"`);
        await UserRegisterBody(
          page,
          user.firstName,
          user.lastName,
          user.username,
          user.email,
          user.password,
          "invalidUsername", // expectSuccess = false
        );

        // Go back to registration page for next test
        await page.goto(URL);
      }
    });
  });
});

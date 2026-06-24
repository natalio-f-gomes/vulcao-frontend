import { useState } from "react";
import { UserRegistrationModel } from "../../api/interfaces";
import {
  confirmRegisterEmployer,
  registeremployer,
  registerEmployerRequest,
  registerUser,
} from "../../api/requests";
import GetHeader from "../../components/header";
import { Link, useNavigate } from "react-router-dom";
import GetFooterSection from "../../components/footer";
import MFAComponent from "../../components/MFAComponent";
import { companyName } from "../../api/global";
import GetTermsSection from "../../components/TermsSection";
import { isValidUsername } from "../../api/validators";

function EmployerRegistrationPage() {
  const [registrationForm, setRegistrationForm] =
    useState<UserRegistrationModel>({
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      username: "",
    });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState<boolean>(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "confirmPassword") {
      setConfirmPassword(event.target.value);
    } else {
      setRegistrationForm({
        ...registrationForm,
        [event.target.name]: event.target.value,
      });
    }
  };

  const sendMfACode = async () => {
    if (!registrationForm) return;
    setError(null);

    if (registrationForm.password.length < 8) {
      alert(
        "O comprimento das palavras-passe deve ter, pelo menos, 8 caracteres.",
      );
      return;
    }

    if (confirmPassword !== registrationForm.password) {
      alert("As palavras-passe não coincidem.");
      return;
    }
    if (!isValidUsername(registrationForm.username)) {
      if (registrationForm.username.includes(" ")) {
        alert("O nome de utilizador não pode conter espaços.");
      } else if (registrationForm.username.includes("'")) {
        alert("O nome de utilizador não pode conter aspas simples.");
      } else if (
        registrationForm.username.includes("/") ||
        registrationForm.username.includes("\\")
      ) {
        alert("O nome de utilizador não pode conter barras (/ ou \\).");
      } else if (
        registrationForm.username.length < 8 ||
        registrationForm.username.length > 50
      ) {
        alert(
          "O comprimento do nome de utilizador deve ter entre 8 e 50 caracteres.",
        );
      }
      return;
    }

    if (!isValidEmail(registrationForm.email)) {
      alert("Por favor, insira um endereço de email válido.");
      return;
    }

    // Validate first name and last name (optional - no spaces)
    if (
      registrationForm.firstName.trim() === "" ||
      registrationForm.lastName.trim() === ""
    ) {
      alert("Por favor, preencha o primeiro nome e último nome.");
      return;
    }

    setLoading(true);

    const response = await registerEmployerRequest(
      registrationForm.email,
      registrationForm.username,
    );

    if (response.status === 202) {
      setShowMFA(true);
    } else if (response.status === 409) {
      alert("Já existe uma entidade com estas credenciais.");
    } else if (response.status === 401) {
      alert("Dados de autenticação inválidos.");
    } else if (response.status === 400) {
      const data = await response.text();
      console.log("Data: ", data);
      alert(data);
    } else {
      alert("Erro inesperado. Por favor volte mais tarde.");
      console.log("Unexpected error", response);
    }
    setLoading(false);
  };

  const registerRequest = async (code: string) => {
    if (!registrationForm) {
      return;
    }
    setError(null);
    setLoading(true);

    if (confirmPassword !== registrationForm.password) {
      alert("As palavras-passe não coincidem");
      setLoading(false);
      return;
    }

    try {
      const response = await confirmRegisterEmployer(code, registrationForm);

      if (response.status === 201) {
        alert("Empresário(a) registado com sucesso.");
        setShowMFA(false);
        window.location.href = "/";
        return;
      }

      // Handle error responses - try to get message from response
      let errorMessage = "";
      try {
        const data = await response.json();
        errorMessage = data.message || data.error || "";
      } catch (e) {
        // If JSON parsing fails, try text
        try {
          errorMessage = await response.text();
        } catch (e2) {
          errorMessage = "";
        }
      }

      // If no message was extracted, use default messages based on status code
      if (!errorMessage || errorMessage.trim() === "") {
        switch (response.status) {
          case 400:
            errorMessage =
              "Certifique-se de que os campos estão preenchidos apenas com dados válidos.";
            break;
          case 401:
            errorMessage = "Dados de autenticação inválidos.";
            break;
          case 403:
            errorMessage = "Dados MFA incorretos. Por favor, tente novamente.";
            break;
          case 409:
            errorMessage =
              "Este nome de utilizador já está em uso. Por favor, escolhe outro nome de utilizador.";
            break;
          default:
            errorMessage = "Erro inesperado. Por favor, tente novamente.";
        }
      }

      alert(errorMessage);
      console.log(`Error ${response.status}:`, errorMessage);
    } catch (exception) {
      console.error("Registration error:", exception);
      alert("Erro ao registar. Por favor, tente novamente.");
      setError(`Registration Failed: ${exception}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GetHeader />
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          Loading ...
        </div>
      )}

      <main
        className="split-container"
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="form-side">
          <div
            className="reg-box"
            style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem" }}
          >
            <h2
              className="mb-4 fw-bold"
              style={{ fontFamily: "Playfair Display" }}
            >
              Junte-se à {companyName}. E registre o teu negócio.
            </h2>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Primeiro Nome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Gilmar"
                  name="firstName"
                  value={registrationForm.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">Último Nome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Silva"
                  name="lastName"
                  value={registrationForm.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Nome de Utilizador (Mínimo de 8 caracteres, sem espaços)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="joao"
                name="username"
                value={registrationForm.username}
                minLength={8}
                maxLength={50}
                onChange={handleInputChange}
                required
              />
              {registrationForm.username &&
                registrationForm.username.includes(" ") && (
                  <div className="text-danger small mt-1">
                    O nome de utilizador não pode conter espaços
                  </div>
                )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="joao@exemplo.com"
                name="email"
                value={registrationForm.email}
                onChange={handleInputChange}
                required
              />
              {registrationForm.email &&
                !isValidEmail(registrationForm.email) && (
                  <div className="text-danger small mt-1">
                    Por favor, insira um endereço de email válido
                  </div>
                )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Palavra-passe (Mínimo de 8 caracteres)
              </label>
              <input
                type="password"
                className="form-control"
                minLength={8}
                name="password"
                placeholder="••••••••"
                value={registrationForm.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Confirmar Palavra-passe</label>
              <input
                type="password"
                className="form-control"
                minLength={8}
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {confirmPassword &&
              registrationForm.password !== confirmPassword && (
                <div className="text-danger small mt-1">
                  As palavras-passe não coincidem
                </div>
              )}

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 text-uppercase fw-bold"
              style={{ borderRadius: "0" }}
              onClick={() => sendMfACode()}
            >
              Criar Conta
            </button>

            <p className="text-center mt-3 small">
              Já tem uma conta?{" "}
              <Link to="/employer-login" className="text-dark fw-bold">
                Iniciar Sessão
              </Link>
            </p>
            <GetTermsSection />
          </div>
        </div>
      </main>

      <GetFooterSection />

      {showMFA && (
        <MFAComponent
          email={registrationForm.email}
          onVerify={(code) => registerRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
    </>
  );
}

export default EmployerRegistrationPage;

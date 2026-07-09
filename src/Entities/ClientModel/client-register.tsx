import { useState } from "react";
import { RegistrationModel } from "../../Interfaces/Authentication";
import {
  isEmailValid,
  isNameValid,
  isPasswordValid,
  isUsernameValid,
} from "../../Validators/Authentication";
import {
  clientRegisterConfirm,
  clientRegisterRequest,
} from "../../Requests/client";
import GetTermsSection from "../../Components/TermsSection";
import { Link, useNavigate } from "react-router-dom";
import GetFooterSection from "../../Components/GetFooter";
import MFAComponent from "../../Components/Modals/MFAComponent";

function ClientRegistrationPage() {
  const navigate = useNavigate();
  const [userRegistrationForm, setUserRegistrationForm] =
    useState<RegistrationModel>({
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      username: "",
    });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showMFA, setShowMFA] = useState<boolean>(false);

  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "confirmPassword") {
      setConfirmPassword(event.target.value);
    } else {
      setUserRegistrationForm({
        ...userRegistrationForm,
        [event.target.name]: event.target.value,
      });
    }
  };

  const sendMfACode = async () => {
    if (!userRegistrationForm) return;
    setError(null);
    if (userRegistrationForm.password.length < 8) {
      alert(
        "O comprimento das palavras-passe deve ter, pelo menos, 8 caracteres.",
      );
      return;
    }
    if (confirmPassword !== userRegistrationForm.password) {
      alert("As palavras-passe não coincidem.");
      return;
    }
    if (!isUsernameValid(userRegistrationForm.username)) {
      alert(
        "O nome de utilizador deve ter entre 8 e 50 caracteres e não pode conter espaços, aspas ou barras (\\ /).",
      );
      return;
    }

    if (!isEmailValid(userRegistrationForm.email)) {
      alert(
        "Por favor, insira um e-mail válido (exemplo: seu-email@dominio.com).",
      );
      return;
    }
    if (!isPasswordValid(userRegistrationForm.password)) {
      alert(
        "Por favor, insira uma palavra-passe válida, sem espaços e com um mínimo de 8 caracteres.",
      );
      return;
    }
    if (
      !isNameValid(
        userRegistrationForm.firstName,
        userRegistrationForm.lastName,
      )
    ) {
      alert(
        "O nome ou apelido é inválido.\n\n" +
          "Regras permitidas:\n" +
          "• Apenas letras (A-Z, com ou sem acentos portugueses como á, ç, õ, ê)\n" +
          "• São permitidos hífens (-) e espaços simples entre nomes\n" +
          "• Não pode começar ou terminar com espaços ou hífens\n" +
          "• Máximo de 20 caracteres por campo",
      );
      return;
    }

    setLoading(true);

    const response = await clientRegisterRequest(
      userRegistrationForm.username,
      userRegistrationForm.email,
    );

    if (response.status === 202) {
      setShowMFA(true);
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
    } else {
      alert("Erro inesperado. Por favor volte mais tarde.");
      console.log("Unexpected error", response);
    }
    setLoading(false);
  };

  const registerRequest = async (code: string) => {
    if (!userRegistrationForm) {
      return;
    }
    setError(null);
    setLoading(true);

    if (confirmPassword !== userRegistrationForm.password) {
      alert("As palavras-passe não coincidem");
      setLoading(false);
      return;
    }

    try {
      const response = await clientRegisterConfirm(code, userRegistrationForm);

      if (response.status === 201) {
        alert("Cliente registado com sucesso.");
        setShowMFA(false);
        navigate("/");
        return;
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
      } else {
        alert("Teve um erro com o servidor. Por favor retorne mais tarde");
        console.log(response);
        setLoading(false);
      }
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
              Junte-se à Vulcão.net
            </h2>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome"
                  name="firstName"
                  value={userRegistrationForm.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">Apelido</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apelido"
                  name="lastName"
                  value={userRegistrationForm.lastName}
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
                placeholder="nome de usuario"
                name="username"
                value={userRegistrationForm.username}
                minLength={8}
                maxLength={50}
                onChange={handleInputChange}
                required
              />
              {userRegistrationForm.username &&
                userRegistrationForm.username.includes(" ") && (
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
                placeholder="email@exemplo.com"
                name="email"
                value={userRegistrationForm.email}
                onChange={handleInputChange}
                required
              />
              {userRegistrationForm.email &&
                !isEmailValid(userRegistrationForm.email) && (
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
                name="password"
                placeholder="••••••••"
                value={userRegistrationForm.password}
                minLength={8}
                maxLength={50}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Confirmar Palavra-passe</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {confirmPassword &&
              userRegistrationForm.password !== confirmPassword && (
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

            <GetTermsSection />

            <p className="text-center mt-3 small">
              Já tem uma conta?{" "}
              <Link to="/user-login" className="text-dark fw-bold">
                Iniciar Sessão
              </Link>
            </p>
          </div>
        </div>
      </main>

      <GetFooterSection />

      {showMFA && (
        <MFAComponent
          email={userRegistrationForm.email}
          onVerify={(code) => registerRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
    </>
  );
}

export default ClientRegistrationPage;

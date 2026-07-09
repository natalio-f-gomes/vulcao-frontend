import { Link, useNavigate } from "react-router-dom";
import { useUserAuthManager } from "../../Auth/Auth-Handler";
import { useState } from "react";
import { LoginModel } from "../../Interfaces/Authentication";
import {
  employerLoginConfirm,
  employerLoginRequest,
} from "../../Requests/employer";
import {
  isPasswordValid,
  isUsernameValid,
} from "../../Validators/Authentication";
import { COMPANY_NAME } from "../../Interfaces/global";
import GetTermsSection from "../../Components/TermsSection";
import GetFooterSection from "../../Components/GetFooter";
import MFAComponent from "../../Components/Modals/MFAComponent";

function EmployerLoginPage() {
  const { login } = useUserAuthManager();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState<LoginModel>({
    username: "",
    password: "",
  });
  const [showMFA, setShowMFA] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  console.log(loginForm.username);
  console.log(loginForm.password);

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  };
  const sendMfACode = async () => {
    if (!loginForm) return;
    setError(null);
    setLoading(true);

    if (!isUsernameValid(loginForm.username)) {
      alert(
        "O comprimento do nome de utilizador deve ter entre 8 e 50 caracteres.",
      );
      setLoading(false);
      return;
    }
    if (!isPasswordValid(loginForm.password)) {
      alert(
        "Por favor, insira uma palavra-passe válida, sem espaços e com um mínimo de 8 caracteres.",
      );
      setLoading(false);
      return;
    }

    const response = await employerLoginRequest(loginForm.username);

    if (response.status === 202) {
      setShowMFA(true); // code sent → show the popup
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
      setLoading(false);
    } else {
      alert("Erro inesperado. Por favor volte mais tarde");
      console.log("Unexpected error", response);
    }
    setLoading(false);
  };

  const LoginRequest = async (code: string) => {
    if (!loginForm) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await employerLoginConfirm(code, loginForm);

      console.log(response);
      if (response.status === 200) {
        alert("Sessão do Empresário(a) iniciada com sucesso.");
        setShowMFA(false);
        localStorage.setItem("username", loginForm.username);
        await login("EMPLOYER");
        navigate("/");
        return;
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
        setLoading(false);
      } else {
        alert("Teve um erro com o servidor. Por favor retorne mais tarde");
        console.log(response);
      }
    } catch (exception) {
      setError(`Registration Failed ${exception}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
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
        <style>{`
        .login-wrapper { 
          flex: 1; 
          background: #f7f4ef; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 2rem 0;
        }
        .auth-card { 
          background: #0f0e0e; 
          color: #f7f4ef; 
          padding: 3rem; 
          width: 100%; 
          max-width: 450px; 
          border-top: 4px solid #c8452a; 
        }
        .auth-title { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 2rem; }
        .form-control-custom { 
          background: transparent; 
          border: 1px solid #333; 
          color: #f7f4ef !important; 
          padding: 0.8rem; 
          width: 100%;
        }
        .btn-auth { 
          background: #c8452a; 
          color: white; 
          border: none; 
          padding: 0.8rem; 
          width: 100%; 
          font-weight: 600; 
          text-transform: uppercase; 
          transition: 0.3s; 
        }
        .btn-auth:hover { background: #a83420; }
      `}</style>

        <main className="login-wrapper">
          <div className="auth-card shadow-lg">
            <h2 className="auth-title">Bem-vindo de volta, Empresário(a).</h2>
            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold text-secondary">
                Nome de Utilizador (Mínimo de 8 caracteres)
              </label>
              <input
                id="username-input"
                type="text"
                className="form-control-custom"
                name="username"
                value={loginForm.username}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small text-uppercase fw-bold text-secondary">
                Palavra-passe
              </label>
              <input
                id="password-input"
                type="password"
                className="form-control-custom"
                name="password"
                value={loginForm.password}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <button
              type="submit"
              id="login"
              className="btn-auth mb-3"
              onClick={() => sendMfACode()}
            >
              Iniciar Sessão
            </button>
            <span>
              <a href="password-reset/employer">Esqueci a senha</a>
            </span>{" "}
            <br />
            <div className="text-center">
              <Link
                to="/employer-register"
                className="text-secondary text-decoration-none small"
              >
                Novo no {COMPANY_NAME}.net?{" "}
                <span style={{ color: "#c8452a" }}>Criar Conta</span>
              </Link>
            </div>
            <GetTermsSection />
          </div>
        </main>

        <GetFooterSection />
      </div>

      {showMFA && (
        <MFAComponent
          username={loginForm.username}
          onVerify={(code) => LoginRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
    </>
  );
}

export default EmployerLoginPage;

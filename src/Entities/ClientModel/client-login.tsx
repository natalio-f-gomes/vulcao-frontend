import React, { useState } from "react";
import { useUserAuthManager } from "../../Auth/Auth-Handler";
import { Link, useNavigate } from "react-router-dom";
import { LoginModel } from "../../Interfaces/Authentication";
import {
  isPasswordValid,
  isUsernameValid,
} from "../../Validators/Authentication";
import { clientLoginConfirm, clientLoginRequest } from "../../Requests/client";
import GetTermsSection from "../../Components/termsSection";
import { COMPANY_NAME } from "../../Interfaces/global";
import GetFooterSection from "../../Components/getFooter";
import MFAComponent from "../../Components/Modals/MFAComponent";

function ClientLoginPage() {
  const { login } = useUserAuthManager();
  const navigate = useNavigate();
  const [showMFA, setShowMFA] = useState<boolean>(false);
  const [userLoginForm, setUserLoginForm] = useState<LoginModel>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onNavigate = useNavigate();

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserLoginForm({
      ...userLoginForm,
      [event.target.name]: event.target.value,
    });
  };

  const sendMfACode = async () => {
    if (!userLoginForm) return;
    setError(null);
    setLoading(true);

    if (!isUsernameValid(userLoginForm.username)) {
      alert(
        "O comprimento do nome de utilizador deve ter entre 8 e 50 caracteres.",
      );
      setLoading(false);
      return;
    }
    if (!isPasswordValid(userLoginForm.password)) {
      alert(
        "Por favor, insira uma palavra-passe válida, sem espaços e com um mínimo de 8 caracteres.",
      );
      setLoading(false);
      return;
    }

    const response = await clientLoginRequest(userLoginForm.username);

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

  const userLoginRequest = async (code: string) => {
    if (!userLoginForm) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await clientLoginConfirm(code, userLoginForm);

      console.log(response);
      if (response.status === 200) {
        alert("Sessão do Utilizador iniciada com sucesso.");
        setShowMFA(false);
        localStorage.setItem("username", userLoginForm.username);
        await login("CLIENT");
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
            <h2 className="auth-title">Bem-vindo de volta, caro Cliente.</h2>
            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold text-secondary">
                Nome de Utilizador (Mínimo de 8 caracteres)
              </label>
              <input
                type="text"
                className="form-control-custom"
                name="username"
                value={userLoginForm.username}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small text-uppercase fw-bold text-secondary">
                Palavra-passe
              </label>
              <input
                type="password"
                className="form-control-custom"
                name="password"
                value={userLoginForm.password}
                onChange={handleUserInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-auth mb-3"
              onClick={() => sendMfACode()}
            >
              Iniciar Sessão
            </button>
            <span>
              <a href="password-reset/CLIENT">Esqueci a senha</a>
            </span>{" "}
            <br />
            <GetTermsSection />
            <div className="text-center">
              <Link
                to="/user-register"
                className="text-secondary text-decoration-none small"
              >
                Novo no {COMPANY_NAME}.net?{" "}
                <span style={{ color: "#c8452a" }}>Criar Conta</span>
              </Link>
            </div>
          </div>
        </main>

        <GetFooterSection />
      </div>

      {showMFA && (
        <MFAComponent
          username={userLoginForm.username}
          onVerify={(code) => userLoginRequest(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
    </>
  );
}

export default ClientLoginPage;
